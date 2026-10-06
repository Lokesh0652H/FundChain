import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, authenticateJWT, requireRole } from '../middleware/auth';
import { aiService } from '../services/aiService';

const router = Router();
const prisma = new PrismaClient();

// GET /api/anomalies - Auditor / Official access
router.get('/', async (req, res: Response) => {
  try {
    const { status, severity } = req.query;
    const where: any = {};
    if (status && status !== 'All') where.status = status;
    if (severity && severity !== 'All') where.severity = severity;

    const anomalies = await prisma.anomaly.findMany({
      where,
      include: {
        project: {
          include: {
            department: { select: { name: true, code: true } },
            contractor: { select: { name: true } }
          }
        }
      },
      orderBy: { detectedAt: 'desc' }
    });

    res.json(anomalies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/anomalies/scan-all - Run AI batch scan
router.post('/scan-all', authenticateJWT, requireRole(['AUDITOR', 'GOVERNMENT']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: { expenses: true, milestones: true }
    });

    let flaggedCount = 0;
    const updates = [];

    for (const p of projects) {
      const analysis = await aiService.analyzeProject(p, p.expenses, p.milestones);
      if (analysis.isFlagged) {
        flaggedCount++;
        await prisma.project.update({
          where: { id: p.id },
          data: {
            aiReviewStatus: 'Review Required',
            aiReviewReason: analysis.primaryReason
          }
        });

        // Ensure anomaly record exists
        const existing = await prisma.anomaly.findFirst({
          where: { projectId: p.id, status: 'Under Review' }
        });

        if (!existing) {
          await prisma.anomaly.create({
            data: {
              projectId: p.id,
              anomalyType: 'FinancialProgressDisparity',
              severity: analysis.severity === 'HIGH' ? 'High' : 'Medium',
              description: analysis.primaryReason,
              confidenceScore: analysis.riskScore,
              status: 'Under Review'
            }
          });
        }

        updates.push({ projectId: p.id, code: p.code, reason: analysis.primaryReason });
      } else {
        await prisma.project.update({
          where: { id: p.id },
          data: {
            aiReviewStatus: 'Normal',
            aiReviewReason: null
          }
        });
      }
    }

    res.json({
      message: 'AI Scan completed successfully across all active projects.',
      totalScanned: projects.length,
      flaggedCount,
      updates
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/anomalies/:id/resolve
router.patch('/:id/resolve', authenticateJWT, requireRole(['AUDITOR', 'GOVERNMENT']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const anomaly = await prisma.anomaly.update({
      where: { id },
      data: {
        status: 'Resolved',
        resolvedBy: req.user?.name || 'Authorized Auditor'
      },
      include: { project: true }
    });

    await prisma.project.update({
      where: { id: anomaly.projectId },
      data: {
        aiReviewStatus: 'Normal',
        aiReviewReason: `Resolved by ${req.user?.name}: ${notes || 'Verified legitimate variance'}`
      }
    });

    res.json(anomaly);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
