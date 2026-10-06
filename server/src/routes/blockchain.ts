import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { blockchainService } from '../services/blockchainService';

const router = Router();
const prisma = new PrismaClient();

// GET /api/blockchain/verify/:txHash
// Core requirement: "Verify Transaction page where users enter a transaction hash and see:
// Hash, block number, timestamp, sender, receiver, amount, project ID, event type and verification status."
router.get('/verify/:txHash', async (req, res: Response) => {
  try {
    const { txHash } = req.params;
    const verification = await blockchainService.verifyTransaction(txHash);

    if (!verification) {
      return res.status(404).json({
        verified: false,
        error: 'Transaction hash not found on FundChain Immutable Ledger.'
      });
    }

    res.json({
      verified: true,
      data: verification
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/blockchain/verify-hash/:docHash
// Verify SHA-256 Document / Invoice / Evidence Hash
router.get('/verify-hash/:docHash', async (req, res: Response) => {
  try {
    const { docHash } = req.params;

    // Check in documents
    const doc = await prisma.document.findFirst({
      where: { fileHash: docHash },
      include: { project: { select: { title: true, code: true, department: true } } }
    });

    if (doc) {
      return res.json({
        verified: true,
        type: 'Official Document',
        title: doc.title,
        docType: doc.docType,
        projectCode: doc.project.code,
        projectTitle: doc.project.title,
        department: doc.project.department.name,
        uploadedBy: doc.uploadedBy,
        blockchainTxHash: doc.blockchainTxHash,
        blockNumber: doc.blockNumber,
        timestamp: doc.createdAt
      });
    }

    // Check in milestone evidence
    const milestone = await prisma.milestone.findFirst({
      where: { evidenceDocHash: docHash },
      include: { project: { select: { title: true, code: true, department: true } } }
    });

    if (milestone) {
      return res.json({
        verified: true,
        type: 'Milestone Evidence Proof',
        title: milestone.title,
        projectCode: milestone.project.code,
        projectTitle: milestone.project.title,
        department: milestone.project.department.name,
        submittedAt: milestone.submittedAt,
        approvedAt: milestone.approvedAt,
        status: milestone.status
      });
    }

    // Check in expenses invoices
    const expense = await prisma.expense.findFirst({
      where: { invoiceDocHash: docHash },
      include: { project: { select: { title: true, code: true } } }
    });

    if (expense) {
      return res.json({
        verified: true,
        type: 'Procurement Invoice',
        vendor: expense.vendorName,
        amount: expense.amount,
        invoiceNumber: expense.invoiceNumber,
        projectCode: expense.project.code,
        projectTitle: expense.project.title,
        blockchainTxHash: expense.blockchainTxHash,
        blockNumber: expense.blockNumber
      });
    }

    res.status(404).json({
      verified: false,
      message: 'Hash not matched against any on-chain registered document or invoice.'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/blockchain/transactions
router.get('/transactions', async (req, res: Response) => {
  try {
    const { eventType, limit = '20', page = '1' } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const where: any = {};
    if (eventType && typeof eventType === 'string' && eventType !== 'All') {
      where.eventType = eventType;
    }

    const [transactions, total] = await Promise.all([
      prisma.blockchainTransaction.findMany({
        where,
        take,
        skip,
        orderBy: { blockNumber: 'desc' },
        include: {
          project: { select: { code: true, title: true, sector: true } }
        }
      }),
      prisma.blockchainTransaction.count({ where })
    ]);

    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page as string, 10),
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/blockchain/recent-blocks
router.get('/recent-blocks', async (_req, res: Response) => {
  try {
    const recentTx = await prisma.blockchainTransaction.findMany({
      take: 6,
      orderBy: { blockNumber: 'desc' },
      include: { project: { select: { code: true, title: true } } }
    });

    const blocks = recentTx.map((tx) => ({
      blockNumber: tx.blockNumber,
      txHash: tx.txHash,
      eventType: tx.eventType,
      amount: tx.amount,
      gasUsed: tx.gasUsed,
      timestamp: tx.timestamp,
      projectCode: tx.project?.code
    }));

    res.json({
      networkStatus: 'Operational (PoA Consensus)',
      latestBlock: recentTx[0]?.blockNumber || 18942500,
      recentBlocks: blocks
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
