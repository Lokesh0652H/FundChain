import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { AuthenticatedRequest, authenticateJWT, requireRole } from '../middleware/auth';
import { blockchainService } from '../services/blockchainService';

const router = Router();
const prisma = new PrismaClient();

// POST /api/milestones - Create new milestone
router.post('/', authenticateJWT, requireRole(['GOVERNMENT', 'DEPARTMENT']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, title, description, targetAmount, physicalWeightage } = req.body;
    if (!projectId || !title || !targetAmount) {
      return res.status(400).json({ error: 'Project ID, title, and target amount are required' });
    }

    const count = await prisma.milestone.count({ where: { projectId } });

    const milestone = await prisma.milestone.create({
      data: {
        projectId,
        sequence: count + 1,
        title,
        description: description || `Milestone Phase ${count + 1}`,
        targetAmount: parseFloat(targetAmount),
        physicalWeightage: physicalWeightage ? parseFloat(physicalWeightage) : 25,
        status: 'Pending'
      }
    });

    res.status(201).json(milestone);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/milestones/:id/submit-evidence (Contractor submits completion proof)
router.post('/:id/submit-evidence', authenticateJWT, requireRole(['CONTRACTOR', 'DEPARTMENT', 'GOVERNMENT']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { evidenceDescription, documentBase64, fileName } = req.body;

    const milestone = await prisma.milestone.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    // Generate SHA-256 hash of the evidence
    const hashPayload = (documentBase64 || evidenceDescription || '') + milestone.id + Date.now();
    const evidenceDocHash = '0x' + crypto.createHash('sha256').update(hashPayload).digest('hex');

    const updatedMilestone = await prisma.milestone.update({
      where: { id },
      data: {
        status: 'Submitted',
        evidenceDescription: evidenceDescription || 'Physical milestone completion evidence submitted for departmental audit.',
        evidenceDocHash,
        submittedAt: new Date()
      }
    });

    // Also register document record with on-chain reference
    const docTx = await blockchainService.registerDocumentHash(
      milestone.projectId,
      'MilestoneEvidence',
      evidenceDocHash,
      `QmEvidence${evidenceDocHash.substring(2, 42)}`
    );

    await prisma.document.create({
      data: {
        projectId: milestone.projectId,
        docType: 'MilestoneEvidence',
        title: `Milestone Evidence: ${milestone.title}`,
        fileName: fileName || `${milestone.project.code}_m${milestone.sequence}_evidence.pdf`,
        fileHash: evidenceDocHash,
        uploadedBy: req.user?.name || 'Contractor',
        verifiedOnChain: true,
        blockchainTxHash: docTx.txHash,
        blockNumber: docTx.blockNumber
      }
    });

    res.json({
      milestone: updatedMilestone,
      evidenceHash: evidenceDocHash,
      blockchainReceipt: docTx
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/milestones/:id/approve (Department / Auditor approves milestone)
router.post('/:id/approve', authenticateJWT, requireRole(['DEPARTMENT', 'GOVERNMENT', 'AUDITOR']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const milestone = await prisma.milestone.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    const updatedMilestone = await prisma.milestone.update({
      where: { id },
      data: {
        status: 'Approved',
        approvedAt: new Date(),
        approvedBy: req.user?.name || 'Authorized Engineer'
      }
    });

    // Update physical progress of project based on approved milestone weightage
    const allMilestones = await prisma.milestone.findMany({
      where: { projectId: milestone.projectId }
    });
    const approvedWeight = allMilestones
      .filter(m => m.status === 'Approved' || m.status === 'FundsReleased')
      .reduce((acc, m) => acc + m.physicalWeightage, 0);

    const newPhysicalProgress = Math.min(100, Math.max(milestone.project.physicalProgress, approvedWeight));

    await prisma.project.update({
      where: { id: milestone.projectId },
      data: { physicalProgress: newPhysicalProgress }
    });

    // Record MilestoneApproved on Blockchain
    const tx = await blockchainService.recordMilestoneApproval(
      milestone.projectId,
      milestone.id,
      milestone.title,
      req.user?.name || 'Authorized Engineer'
    );

    res.json({
      milestone: updatedMilestone,
      physicalProgress: newPhysicalProgress,
      blockchainReceipt: tx
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
