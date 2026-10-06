import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { AuthenticatedRequest, authenticateJWT, requireRole } from '../middleware/auth';
import { blockchainService } from '../services/blockchainService';
import { aiService } from '../services/aiService';

const router = Router();
const prisma = new PrismaClient();

// POST /api/funds/allocate - Government allocates budget
router.post('/allocate', authenticateJWT, requireRole(['GOVERNMENT']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, amount, orderNumber } = req.body;
    if (!projectId || !amount) {
      return res.status(400).json({ error: 'Project ID and amount are required' });
    }

    const allocAmount = parseFloat(amount);
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.allocatedFunds + allocAmount > project.totalBudget) {
      return res.status(400).json({
        error: `Cannot allocate ₹${allocAmount}. Exceeds total sanctioned budget of ₹${project.totalBudget} (Currently allocated: ₹${project.allocatedFunds})`
      });
    }

    // 1. Record on Blockchain
    const tx = await blockchainService.recordFundAllocation(
      project.id,
      allocAmount,
      req.user?.name || 'Principal Secretary (Finance)'
    );

    // 2. Write to DB
    const allocation = await prisma.fundAllocation.create({
      data: {
        projectId: project.id,
        amount: allocAmount,
        financialYear: '2025-2026',
        orderNumber: orderNumber || `GO-MS-AL-${Date.now().toString().slice(-4)}`,
        authorizedBy: req.user?.name || 'Principal Secretary (Finance)',
        blockchainTxHash: tx.txHash
      }
    });

    const newAllocTotal = project.allocatedFunds + allocAmount;
    await prisma.project.update({
      where: { id: project.id },
      data: { allocatedFunds: newAllocTotal }
    });

    res.status(201).json({
      allocation,
      newTotalAllocated: newAllocTotal,
      blockchainReceipt: tx
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/funds/release - Government releases tranche to contractor
router.post('/release', authenticateJWT, requireRole(['GOVERNMENT']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, milestoneId, amount } = req.body;
    if (!projectId || !amount) {
      return res.status(400).json({ error: 'Project ID and amount are required' });
    }

    const releaseAmount = parseFloat(amount);
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { contractor: true }
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.releasedFunds + releaseAmount > project.allocatedFunds) {
      return res.status(400).json({
        error: `Release amount ₹${releaseAmount} exceeds available allocated funds of ₹${project.allocatedFunds - project.releasedFunds}`
      });
    }

    const contractorWallet = project.contractor?.walletAddress || '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';

    // 1. Record on Blockchain
    const tx = await blockchainService.recordFundRelease(
      project.id,
      milestoneId || 'GENERAL',
      releaseAmount,
      contractorWallet,
      req.user?.name || 'Treasury Officer'
    );

    // 2. Create FundRelease entry
    const fundRelease = await prisma.fundRelease.create({
      data: {
        projectId: project.id,
        milestoneId: milestoneId || null,
        amount: releaseAmount,
        authorizedBy: req.user?.name || 'Treasury Officer',
        recipientAddress: contractorWallet,
        blockchainTxHash: tx.txHash,
        blockNumber: tx.blockNumber,
        status: 'Released'
      }
    });

    // 3. Update Milestone if specified
    if (milestoneId) {
      await prisma.milestone.update({
        where: { id: milestoneId },
        data: { status: 'FundsReleased' }
      });
    }

    // 4. Update Project financial progress and released amount
    const newReleasedTotal = project.releasedFunds + releaseAmount;
    const newFinancialProgress = project.totalBudget > 0
      ? Math.round((newReleasedTotal / project.totalBudget) * 1000) / 10
      : 0;

    const updatedProject = await prisma.project.update({
      where: { id: project.id },
      data: {
        releasedFunds: newReleasedTotal,
        financialProgress: newFinancialProgress
      },
      include: { expenses: true, milestones: true }
    });

    // Run AI check after release to immediately spot physical vs financial progress disparity
    const aiCheck = await aiService.analyzeProject(
      updatedProject,
      updatedProject.expenses,
      updatedProject.milestones
    );

    if (aiCheck.isFlagged) {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          aiReviewStatus: 'Review Required',
          aiReviewReason: aiCheck.primaryReason
        }
      });

      await prisma.anomaly.create({
        data: {
          projectId: project.id,
          anomalyType: 'FinancialProgressDisparity',
          severity: aiCheck.severity === 'HIGH' ? 'High' : 'Medium',
          description: aiCheck.primaryReason,
          confidenceScore: aiCheck.riskScore,
          status: 'Under Review'
        }
      });
    }

    res.status(201).json({
      fundRelease,
      newReleasedTotal,
      newFinancialProgress,
      blockchainReceipt: tx,
      aiAnalysis: aiCheck
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/funds/expense - Record expense invoice
router.post('/expense', authenticateJWT, requireRole(['CONTRACTOR', 'DEPARTMENT', 'GOVERNMENT']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, milestoneId, vendorName, amount, category, invoiceNumber, invoiceBase64 } = req.body;
    if (!projectId || !vendorName || !amount) {
      return res.status(400).json({ error: 'Project ID, vendor name, and amount are required' });
    }

    const expAmount = parseFloat(amount);
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Generate SHA-256 hash of invoice data
    const hashData = (invoiceBase64 || '') + vendorName + invoiceNumber + expAmount + Date.now();
    const invoiceDocHash = '0x' + crypto.createHash('sha256').update(hashData).digest('hex');

    // 1. Record on Blockchain
    const tx = await blockchainService.recordExpense(
      project.id,
      vendorName,
      expAmount,
      category || 'Material',
      invoiceDocHash
    );

    // 2. Create Expense in DB
    const expense = await prisma.expense.create({
      data: {
        projectId: project.id,
        milestoneId: milestoneId || null,
        vendorName,
        amount: expAmount,
        category: category || 'Material',
        invoiceNumber: invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
        invoiceDocHash,
        blockchainTxHash: tx.txHash,
        blockNumber: tx.blockNumber,
        status: 'Recorded'
      }
    });

    // 3. Update Project expenditure
    const newExpenditure = project.expenditure + expAmount;
    await prisma.project.update({
      where: { id: project.id },
      data: { expenditure: newExpenditure }
    });

    res.status(201).json({
      expense,
      newExpenditure,
      blockchainReceipt: tx
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
