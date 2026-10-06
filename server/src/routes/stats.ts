import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/stats/overview
router.get('/overview', async (_req, res: Response) => {
  try {
    const [
      totalProjects,
      completedProjects,
      activeProjects,
      delayedProjects,
      departmentsCount,
      contractorsCount,
      transactionsCount,
      anomaliesCount,
      projectsAgg
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'Completed' } }),
      prisma.project.count({ where: { status: 'Active' } }),
      prisma.project.count({ where: { status: 'Delayed' } }),
      prisma.department.count(),
      prisma.contractor.count(),
      prisma.blockchainTransaction.count(),
      prisma.anomaly.count({ where: { status: 'Under Review' } }),
      prisma.project.aggregate({
        _sum: {
          totalBudget: true,
          allocatedFunds: true,
          releasedFunds: true,
          expenditure: true
        }
      })
    ]);

    // Sector breakdown
    const sectorStats = await prisma.project.groupBy({
      by: ['sector'],
      _count: { id: true },
      _sum: { totalBudget: true, releasedFunds: true }
    });

    // Recent 5 verified transactions
    const recentTransactions = await prisma.blockchainTransaction.findMany({
      take: 6,
      orderBy: { blockNumber: 'desc' },
      include: { project: { select: { code: true, title: true } } }
    });

    res.json({
      summary: {
        totalBudget: projectsAgg._sum.totalBudget || 0,
        allocatedFunds: projectsAgg._sum.allocatedFunds || 0,
        releasedFunds: projectsAgg._sum.releasedFunds || 0,
        expenditure: projectsAgg._sum.expenditure || 0,
        totalProjects,
        completedProjects,
        activeProjects,
        delayedProjects,
        departmentsCount,
        contractorsCount,
        transactionsCount,
        anomaliesCount
      },
      sectors: sectorStats.map(s => ({
        sector: s.sector,
        count: s._count.id,
        budget: s._sum.totalBudget || 0,
        released: s._sum.releasedFunds || 0
      })),
      recentTransactions
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
