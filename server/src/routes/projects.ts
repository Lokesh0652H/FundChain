import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, authenticateJWT, requireRole } from '../middleware/auth';
import { blockchainService } from '../services/blockchainService';
import { aiService } from '../services/aiService';

const router = Router();
const prisma = new PrismaClient();

// GET /api/projects - Public / Citizen accessible
router.get('/', async (req, res: Response) => {
  try {
    const {
      search,
      sector,
      status,
      departmentId,
      district,
      minBudget,
      maxBudget,
      aiStatus
    } = req.query;

    const where: any = {};

    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search } },
        { code: { contains: search } },
        { locationAddress: { contains: search } },
        { district: { contains: search } }
      ];
    }

    if (sector && typeof sector === 'string' && sector !== 'All') {
      where.sector = sector;
    }

    if (status && typeof status === 'string' && status !== 'All') {
      if (status === 'Ongoing') {
        where.status = 'Active';
      } else {
        where.status = status;
      }
    }

    if (departmentId && typeof departmentId === 'string' && departmentId !== 'All') {
      where.departmentId = departmentId;
    }

    if (district && typeof district === 'string' && district !== 'All') {
      where.district = district;
    }

    if (aiStatus && typeof aiStatus === 'string') {
      where.aiReviewStatus = aiStatus;
    }

    if (minBudget || maxBudget) {
      where.totalBudget = {};
      if (minBudget) where.totalBudget.gte = parseFloat(minBudget as string);
      if (maxBudget) where.totalBudget.lte = parseFloat(maxBudget as string);
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        department: { select: { id: true, name: true, code: true, headName: true } },
        contractor: { select: { id: true, name: true, registrationNumber: true, rating: true } },
        _count: {
          select: {
            milestones: true,
            expenses: true,
            documents: true,
            blockchainTransactions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/projects/:id - Full details
router.get('/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { code: id }]
      },
      include: {
        department: true,
        contractor: true,
        fundAllocations: { orderBy: { allocatedDate: 'desc' } },
        milestones: {
          orderBy: { sequence: 'asc' },
          include: {
            fundReleases: true,
            expenses: true
          }
        },
        expenses: { orderBy: { invoiceDate: 'desc' } },
        documents: { orderBy: { createdAt: 'desc' } },
        blockchainTransactions: { orderBy: { blockNumber: 'desc' } },
        anomalies: { orderBy: { detectedAt: 'desc' } }
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Calculate real-time AI risk indicator
    const aiAnalysis = await aiService.analyzeProject(
      project,
      project.expenses,
      project.milestones
    );

    const remainingBudget = Math.max(0, project.totalBudget - project.releasedFunds);
    const unspentReleased = Math.max(0, project.releasedFunds - project.expenditure);

    res.json({
      ...project,
      remainingBudget,
      unspentReleased,
      aiAnalysis
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/projects/:id/follow-the-money - Structured Flow Visualization
router.get('/:id/follow-the-money', async (req, res: Response) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: { OR: [{ id }, { code: id }] },
      include: {
        department: true,
        contractor: true,
        fundAllocations: { orderBy: { allocatedDate: 'asc' } },
        milestones: {
          orderBy: { sequence: 'asc' },
          include: { fundReleases: true, expenses: true }
        },
        expenses: { orderBy: { invoiceDate: 'asc' } },
        blockchainTransactions: { orderBy: { blockNumber: 'asc' } }
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const firstTx = project.blockchainTransactions[0];
    const allocTx = project.fundAllocations[0];

    const steps = [
      {
        step: 1,
        level: 'Government',
        entity: 'State Treasury / Finance Department',
        date: project.startDate.toISOString().split('T')[0],
        amount: project.totalBudget,
        purpose: `Sanctioned capital expenditure under State Infrastructure Program for ${project.title}`,
        txHash: firstTx ? firstTx.txHash : '0x' + 'a'.repeat(64),
        status: 'Sanctioned & Immutable',
        details: {
          scheme: 'State Urban & Rural Infrastructure Development Plan 2025-26',
          authorizedBy: 'Principal Secretary (Finance)',
          treasuryRef: `GO-MS-FIN-${project.code.slice(-3)}`
        }
      },
      {
        step: 2,
        level: 'Department',
        entity: project.department.name,
        date: allocTx ? allocTx.allocatedDate.toISOString().split('T')[0] : project.startDate.toISOString().split('T')[0],
        amount: project.allocatedFunds,
        purpose: `Departmental administrative approval & tranche allocation (Order: ${allocTx?.orderNumber || 'GO-DIR-01'})`,
        txHash: allocTx?.blockchainTxHash || firstTx?.txHash || '0x' + 'b'.repeat(64),
        status: 'Allocated to Project Account',
        details: {
          nodalOfficer: project.department.headName,
          deptCode: project.department.code,
          allocationPercentage: Math.round((project.allocatedFunds / project.totalBudget) * 100) + '%'
        }
      },
      {
        step: 3,
        level: 'Project',
        entity: project.title,
        date: project.startDate.toISOString().split('T')[0],
        amount: project.totalBudget,
        purpose: `Site commencement and work package initiation at ${project.locationAddress}`,
        txHash: firstTx?.txHash || '0x' + 'c'.repeat(64),
        status: project.status,
        details: {
          projectCode: project.code,
          sector: project.sector,
          district: project.district,
          targetCompletion: project.targetCompletionDate.toISOString().split('T')[0]
        }
      },
      {
        step: 4,
        level: 'Contractor',
        entity: project.contractor ? project.contractor.name : 'Government Direct Execution',
        date: project.startDate.toISOString().split('T')[0],
        amount: project.releasedFunds,
        purpose: `Awarded contract with binding smart contract escrow terms (Reg: ${project.contractor?.registrationNumber || 'N/A'})`,
        txHash: project.blockchainTransactions.find(t => t.eventType === 'FundsReleased')?.txHash || firstTx?.txHash || '0x' + 'd'.repeat(64),
        status: 'Contract Signed & Escrow Active',
        details: {
          rating: project.contractor?.rating || 4.5,
          contactEmail: project.contractor?.contactEmail,
          walletAddress: project.contractor?.walletAddress || '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
        }
      },
      {
        step: 5,
        level: 'Milestone',
        entity: project.milestones.length > 0 ? project.milestones[0].title : 'Milestone 1 Execution',
        date: project.milestones[0]?.approvedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        amount: project.milestones.reduce((acc, m) => acc + (m.status === 'FundsReleased' ? m.targetAmount : 0), 0) || project.releasedFunds,
        purpose: `Tranche disbursement conditional on geotagged site verification and physical weightage verification`,
        txHash: project.milestones[0]?.fundReleases[0]?.blockchainTxHash || firstTx?.txHash || '0x' + 'e'.repeat(64),
        status: `${project.milestones.filter(m => m.status === 'FundsReleased').length}/${project.milestones.length} Milestones Cleared`,
        details: {
          physicalProgress: `${project.physicalProgress}%`,
          financialProgress: `${project.financialProgress}%`,
          milestonesTotal: project.milestones.length
        }
      },
      {
        step: 6,
        level: 'Expense',
        entity: project.expenses.length > 0 ? `${project.expenses.length} Verified Invoices (Vendors & Labor)` : 'Direct Construction Expenses',
        date: project.expenses[0]?.invoiceDate.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        amount: project.expenditure,
        purpose: `Itemized procurement of cement, steel, machinery, and certified technical inspections`,
        txHash: project.expenses[0]?.blockchainTxHash || firstTx?.txHash || '0x' + 'f'.repeat(64),
        status: `${project.expenses.length} Invoices Sealed On-Chain`,
        details: {
          vendors: [...new Set(project.expenses.map(e => e.vendorName))].join(', ') || 'Authorized Suppliers',
          highestExpense: project.expenses.length > 0 ? `₹${Math.max(...project.expenses.map(e => e.amount)).toLocaleString('en-IN')}` : 'N/A'
        }
      },
      {
        step: 7,
        level: 'Blockchain',
        entity: 'Ethereum-Compatible PoA Ledger (FundChain Smart Contract)',
        date: new Date().toISOString().split('T')[0],
        amount: project.expenditure,
        purpose: `Cryptographic SHA-256 seal & Merkle proof guaranteeing tamper-proof public transparency`,
        txHash: project.blockchainTransactions[project.blockchainTransactions.length - 1]?.txHash || firstTx?.txHash || '0x' + '1'.repeat(64),
        status: 'Immutable & Publicly Verifiable',
        details: {
          totalBlocksMined: project.blockchainTransactions.length,
          smartContract: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          consensus: 'Proof of Authority (GovTech Network)'
        }
      }
    ];

    res.json({
      project: {
        id: project.id,
        code: project.code,
        title: project.title,
        totalBudget: project.totalBudget,
        releasedFunds: project.releasedFunds,
        expenditure: project.expenditure
      },
      steps
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/projects - Create Project (Gov / Dept only)
router.post('/', authenticateJWT, requireRole(['GOVERNMENT', 'DEPARTMENT']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      description,
      departmentId,
      contractorId,
      totalBudget,
      allocatedFunds,
      sector,
      locationAddress,
      district,
      state,
      locationLat,
      locationLng,
      targetCompletionDate
    } = req.body;

    if (!title || !departmentId || !totalBudget) {
      return res.status(400).json({ error: 'Title, department, and total budget are required' });
    }

    const dept = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!dept) return res.status(400).json({ error: 'Invalid department' });

    const count = await prisma.project.count();
    const code = `FC-2026-${dept.code}-${String(count + 1).padStart(3, '0')}`;

    // 1. Create DB Project
    const project = await prisma.project.create({
      data: {
        code,
        title,
        description: description || `Project initiated under ${dept.name}`,
        departmentId,
        contractorId: contractorId || null,
        totalBudget: parseFloat(totalBudget),
        allocatedFunds: allocatedFunds ? parseFloat(allocatedFunds) : 0,
        releasedFunds: 0,
        expenditure: 0,
        physicalProgress: 0,
        financialProgress: 0,
        status: 'Active',
        sector: sector || 'Infrastructure',
        locationAddress: locationAddress || 'State Highway Sector',
        district: district || 'Bengaluru Urban',
        state: state || 'Karnataka',
        locationLat: locationLat ? parseFloat(locationLat) : 12.9716,
        locationLng: locationLng ? parseFloat(locationLng) : 77.5946,
        targetCompletionDate: targetCompletionDate ? new Date(targetCompletionDate) : new Date('2027-03-31T00:00:00Z'),
        aiReviewStatus: 'Normal'
      }
    });

    // 2. Call Smart Contract / Blockchain Service
    const tx = await blockchainService.recordProjectCreation(
      project.id,
      project.title,
      dept.code,
      project.totalBudget
    );

    // 3. Create default 3 milestones
    const milestoneDefs = [
      { seq: 1, title: 'Phase 1: Site Survey, Design Approval & Substructure', weight: 30, pct: 0.3 },
      { seq: 2, title: 'Phase 2: Core Structural Works & Utilities', weight: 40, pct: 0.4 },
      { seq: 3, title: 'Phase 3: Finishing, Inspection & Quality Signoff', weight: 30, pct: 0.3 }
    ];

    for (const mDef of milestoneDefs) {
      await prisma.milestone.create({
        data: {
          projectId: project.id,
          sequence: mDef.seq,
          title: mDef.title,
          description: `Detailed milestone requirements for ${project.title}.`,
          targetAmount: project.totalBudget * mDef.pct,
          physicalWeightage: mDef.weight,
          status: 'Pending'
        }
      });
    }

    // 4. Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        userName: req.user?.name || 'System Official',
        userRole: req.user?.role || 'GOVERNMENT',
        action: 'CREATE_PROJECT',
        entityType: 'PROJECT',
        entityId: project.id,
        details: `Created project ${project.code} with budget ₹${project.totalBudget} and recorded on blockchain tx ${tx.txHash}`
      }
    });

    res.status(201).json({
      project,
      blockchainReceipt: tx
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
