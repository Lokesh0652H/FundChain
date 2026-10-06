import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, authenticateJWT } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/contractors
router.get('/', async (_req, res: Response) => {
  try {
    const contractors = await prisma.contractor.findMany({
      include: {
        _count: {
          select: { projects: true }
        }
      },
      orderBy: { rating: 'desc' }
    });
    res.json(contractors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/contractors/my-projects
router.get('/my-projects', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const contractorId = req.user?.contractorId;
    if (!contractorId) {
      // If user is not directly mapped to contractor, return projects assigned to first contractor for demo convenience
      const firstContractor = await prisma.contractor.findFirst();
      if (!firstContractor) return res.json([]);
      const projects = await prisma.project.findMany({
        where: { contractorId: firstContractor.id },
        include: {
          milestones: true,
          expenses: true,
          fundReleases: true,
          department: { select: { name: true, code: true } }
        }
      });
      return res.json(projects);
    }

    const projects = await prisma.project.findMany({
      where: { contractorId },
      include: {
        milestones: true,
        expenses: true,
        fundReleases: true,
        department: { select: { name: true, code: true } }
      }
    });

    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
