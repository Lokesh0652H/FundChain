import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/departments
router.get('/', async (_req, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { projects: true }
        }
      },
      orderBy: { budgetAllocated: 'desc' }
    });
    res.json(departments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/departments/:id
router.get('/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            contractor: { select: { name: true } },
            _count: { select: { milestones: true, expenses: true } }
          }
        }
      }
    });

    if (!department) return res.status(404).json({ error: 'Department not found' });
    res.json(department);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
