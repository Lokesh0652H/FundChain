// Vercel Serverless Function Handler for FundChain
// Provides instant, zero-cold-start responses on Vercel deployment

const departments = [
  { id: '1', code: 'PWD', name: 'Public Works Department (State Highways & Bridges)', budgetAllocated: 450000000, headName: 'Er. Rajeshwar Rao' },
  { id: '2', code: 'HEALTH', name: 'Health & Family Welfare Directorate', budgetAllocated: 320000000, headName: 'Dr. Sunita Kulkarni' },
  { id: '3', code: 'EDU', name: 'Department of School & Higher Education', budgetAllocated: 280000000, headName: 'Prof. Anand Verma' },
  { id: '4', code: 'WATER', name: 'Rural Water Supply & Sanitation Mission', budgetAllocated: 380000000, headName: 'Er. P. Venkatesh' },
  { id: '5', code: 'SMART', name: 'Urban Development & Smart City Mission', budgetAllocated: 520000000, headName: 'IAS Meera Nambiar' },
  { id: '6', code: 'POWER', name: 'Renewable Energy & Grid Modernization', budgetAllocated: 260000000, headName: 'Er. Harish Chandra' },
  { id: '7', code: 'WOMEN', name: 'Women & Child Development Infrastructure', budgetAllocated: 180000000, headName: 'Smt. Shalini Hegde' },
  { id: '8', code: 'IRRIG', name: 'Minor Irrigation & Groundwater Recharge', budgetAllocated: 220000000, headName: 'Er. Ramanathan K.' },
  { id: '9', code: 'TRANS', name: 'Transport Infrastructure & EV Hubs', budgetAllocated: 310000000, headName: 'Shri. Vikram Seth' },
  { id: '10', code: 'IT', name: 'Electronics & IT Innovation Parks', budgetAllocated: 190000000, headName: 'Dr. Aruna Shenoy' }
];

const contractors = [
  { id: 'c1', name: 'Apex Infra Projects Pvt Ltd', registrationNumber: 'CIN-U45201KA2015PTC081234', rating: 4.8 },
  { id: 'c2', name: 'Kaveri Civil Engineering Corp', registrationNumber: 'CIN-U45202KA2012PTC065412', rating: 4.6 },
  { id: 'c3', name: 'Shapoorji Pallonji Infrastructure', registrationNumber: 'CIN-U45200MH2014PTC078901', rating: 4.9 },
  { id: 'c4', name: 'BlueStar Water Tech Solutions', registrationNumber: 'CIN-U41000DL2018PTC099231', rating: 4.7 }
];

const projects = [
  {
    id: 'p1',
    code: 'FC-2026-PWD-001',
    title: 'Peripheral Ring Road Corridor Phase-II 4-Lane Widening',
    description: 'Upgradation and four-laning of the major arterial corridor connecting Kanakapura Road to Electronic City.',
    departmentId: '1',
    contractorId: 'c1',
    totalBudget: 65000000,
    allocatedFunds: 50000000,
    releasedFunds: 48000000,
    expenditure: 45200000,
    physicalProgress: 72,
    financialProgress: 73.8,
    status: 'Active',
    sector: 'Roads',
    locationAddress: 'SH-87 Corridor, Bannerghatta to Jigani',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    locationLat: 12.8399,
    locationLng: 77.6770,
    aiReviewStatus: 'Normal',
    department: departments[0],
    contractor: contractors[0]
  },
  {
    id: 'p2',
    code: 'FC-2026-PWD-002',
    title: 'Kaveri River Bridge Replacement & Approach Elevated Viaduct',
    description: 'Demolition of aged bridge and construction of 6-span balanced cantilever prestressed bridge.',
    departmentId: '1',
    contractorId: 'c3',
    totalBudget: 48600000,
    allocatedFunds: 40000000,
    releasedFunds: 38200000,
    expenditure: 37500000,
    physicalProgress: 35,
    financialProgress: 78.5,
    status: 'Active',
    sector: 'Roads',
    locationAddress: 'Nanjangud Highway over Kaveri Basin',
    district: 'Mysuru',
    state: 'Karnataka',
    locationLat: 12.1197,
    locationLng: 76.6800,
    aiReviewStatus: 'Review Required',
    aiReviewReason: 'Review Required — Financial progress (78.5%) is higher than reported physical progress (35.0%).',
    department: departments[0],
    contractor: contractors[2]
  },
  {
    id: 'p3',
    code: 'FC-2026-HLT-001',
    title: '250-Bed District Super Specialty Maternal & Pediatric Hospital',
    description: 'Modern 5-floor clinical complex with pediatric ICU, neo-natal intensive care units, and modular OTs.',
    departmentId: '2',
    contractorId: 'c1',
    totalBudget: 58000000,
    allocatedFunds: 45000000,
    releasedFunds: 40000000,
    expenditure: 38900000,
    physicalProgress: 68,
    financialProgress: 68.9,
    status: 'Active',
    sector: 'Hospitals',
    locationAddress: 'Civil Hospital Campus, Hubballi Central',
    district: 'Dharwad',
    state: 'Karnataka',
    locationLat: 15.3647,
    locationLng: 75.1240,
    aiReviewStatus: 'Normal',
    department: departments[1],
    contractor: contractors[0]
  },
  {
    id: 'p4',
    code: 'FC-2026-WTR-001',
    title: 'Jal Jeevan Multi-Village Piped Drinking Water Supply Scheme',
    description: 'Intake well on river basin, 25 MLD water treatment plant, 140 km ductile iron transmission pipeline.',
    departmentId: '4',
    contractorId: 'c4',
    totalBudget: 72000000,
    allocatedFunds: 60000000,
    releasedFunds: 48000000,
    expenditure: 46200000,
    physicalProgress: 66,
    financialProgress: 66.6,
    status: 'Active',
    sector: 'Water',
    locationAddress: 'Cauvery River Basin, T. Narasipura',
    district: 'Mysuru',
    state: 'Karnataka',
    locationLat: 12.2120,
    locationLng: 76.9039,
    aiReviewStatus: 'Normal',
    department: departments[3],
    contractor: contractors[3]
  },
  {
    id: 'p5',
    code: 'FC-2026-SMT-001',
    title: 'Integrated Command & Control Center (ICCC) & AI Traffic Management',
    description: 'Centralized municipal monitoring hub with 1,200 pan-tilt-zoom surveillance cameras and adaptive traffic signaling.',
    departmentId: '5',
    contractorId: 'c1',
    totalBudget: 68000000,
    allocatedFunds: 55000000,
    releasedFunds: 48000000,
    expenditure: 46800000,
    physicalProgress: 70,
    financialProgress: 70.5,
    status: 'Active',
    sector: 'Infrastructure',
    locationAddress: 'Smart City HQ, Corporation Square',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    locationLat: 12.9716,
    locationLng: 77.5946,
    aiReviewStatus: 'Normal',
    department: departments[4],
    contractor: contractors[0]
  },
  {
    id: 'p6',
    code: 'FC-2026-EDU-001',
    title: 'Model Smart Secondary School & STEM Lab Construction',
    description: 'Composite school campus with 24 digitized smart classrooms, state-of-the-art robotics laboratory, and library.',
    departmentId: '3',
    contractorId: 'c1',
    totalBudget: 21000000,
    allocatedFunds: 18000000,
    releasedFunds: 16500000,
    expenditure: 16100000,
    physicalProgress: 75,
    financialProgress: 78.5,
    status: 'Active',
    sector: 'Schools',
    locationAddress: 'Govt Model Higher Secondary Campus, Jayanagar',
    district: 'Bengaluru South',
    state: 'Karnataka',
    locationLat: 12.9250,
    locationLng: 77.5938,
    aiReviewStatus: 'Normal',
    department: departments[2],
    contractor: contractors[0]
  }
];

const transactions = [
  {
    id: 'tx1',
    txHash: '0x7b23d9a1f5e8401a71923057fa4891b0c953e201b17a02e64b81b2123d4e861c7',
    blockNumber: 18942698,
    timestamp: '2026-09-25T14:30:00Z',
    eventType: 'FundsReleased',
    fromAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    toAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    amount: 19500000,
    projectId: 'p1',
    status: 'Confirmed',
    gasUsed: 48200,
    project: { code: 'FC-2026-PWD-001', title: 'Peripheral Ring Road Corridor' }
  },
  {
    id: 'tx2',
    txHash: '0x91dae2f4c6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4eb5a4',
    blockNumber: 18942695,
    timestamp: '2026-09-25T14:15:00Z',
    eventType: 'ExpenseRecorded',
    fromAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    toAddress: 'UltraTech Cement Direct',
    amount: 9800000,
    projectId: 'p1',
    status: 'Confirmed',
    gasUsed: 39100,
    project: { code: 'FC-2026-PWD-001', title: 'Peripheral Ring Road Corridor' }
  },
  {
    id: 'tx3',
    txHash: '0x81fa0e59c6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4ec707',
    blockNumber: 18942690,
    timestamp: '2026-09-25T13:45:00Z',
    eventType: 'MilestoneApproved',
    fromAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    toAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    amount: 0,
    projectId: 'p2',
    status: 'Confirmed',
    gasUsed: 37800,
    project: { code: 'FC-2026-PWD-002', title: 'Kaveri River Bridge' }
  }
];

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';

  // 1. Stats Overview
  if (url.includes('/api/stats/overview')) {
    return res.status(200).json({
      summary: {
        totalBudget: 1982000000,
        allocatedFunds: 1650000000,
        releasedFunds: 1420000000,
        expenditure: 1380000000,
        totalProjects: 30,
        completedProjects: 6,
        activeProjects: 21,
        delayedProjects: 3,
        departmentsCount: 10,
        contractorsCount: 20,
        transactionsCount: 252,
        anomaliesCount: 4
      },
      sectors: [
        { sector: 'Roads', count: 8, budget: 260000000, released: 210000000 },
        { sector: 'Hospitals', count: 6, budget: 140000000, released: 110000000 },
        { sector: 'Schools', count: 6, budget: 95000000, released: 68000000 },
        { sector: 'Water', count: 5, budget: 187000000, released: 119000000 },
        { sector: 'Infrastructure', count: 5, budget: 234000000, released: 180000000 }
      ],
      recentTransactions: transactions
    });
  }

  // 2. Projects
  if (url.includes('/api/projects')) {
    const parts = url.split('/api/projects');
    const pathAfter = parts[1] ? parts[1].split('?')[0] : '';

    // Project Follow the money
    if (pathAfter.includes('/follow-the-money')) {
      return res.status(200).json({
        project: projects[0],
        steps: [
          { step: 1, level: 'Government', entity: 'Ministry of Finance, Govt. of India', date: '10 Dec 2025', amount: 1258900000, purpose: 'Budget sanctioned from treasury to main escrow', txHash: '0x7b23d9a1f5e8401a71923057fa4891b0c953e201b17a02e64b81b2123d4e861c7' },
          { step: 2, level: 'Department', entity: 'Jal Shakti & Sanitation Department', date: '12 Dec 2025', amount: 1258900000, purpose: 'Budget allocation FY2026-Q4', txHash: '0x91dae2f4c6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4eb5a4' },
          { step: 3, level: 'Project', entity: 'Stormwater Drainage Upgrade, Chennai', date: '15 Dec 2025', amount: 1446100000, purpose: 'Sanctioned budget FC-2026-119', txHash: '0x81fa0e59c6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4ec707' },
          { step: 4, level: 'Contractor', entity: 'Brahmaputra Engineering', date: '26 Dec 2025', amount: 1084600000, purpose: 'Initial tranche release against approved milestones', txHash: '0x47e199d9c6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4ee282' },
          { step: 5, level: 'Milestone', entity: 'Foundation & Phase 1 Works', date: '19 Jan 2026', amount: 433800000, purpose: 'Approved - 32% of works', txHash: '0x9815aac6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4ecbb9' },
          { step: 6, level: 'Expense', entity: 'Consultancy & Testing', date: '17 May 2026', amount: 410500000, purpose: 'Payment for consultancy & testing', txHash: '0x7a83d4c6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4eab85' },
          { step: 7, level: 'Blockchain', entity: 'Block #149', date: '17 May 2026', amount: 944600000, purpose: '8 records hash-chained & verifiable on PoA ledger', txHash: '0x7ba451c6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4e6f81' }
        ]
      });
    }

    // Single Project
    if (pathAfter.length > 2 && !pathAfter.includes('?')) {
      const cleanId = pathAfter.replace('/', '');
      const found = projects.find(p => p.id === cleanId || p.code === cleanId) || projects[0];
      return res.status(200).json({
        ...found,
        remainingBudget: Math.max(0, found.totalBudget - found.releasedFunds),
        milestones: [
          { id: 'm1', sequence: 1, title: 'Phase 1: Foundation Works', targetAmount: found.totalBudget * 0.3, physicalWeightage: 30, status: 'FundsReleased', evidenceDocHash: '0x7a83d...6f81' },
          { id: 'm2', sequence: 2, title: 'Phase 2: Superstructure & Girders', targetAmount: found.totalBudget * 0.4, physicalWeightage: 40, status: 'Approved', evidenceDocHash: '0x91dae...e124' },
          { id: 'm3', sequence: 3, title: 'Phase 3: Decking, Lighting & Commissioning', targetAmount: found.totalBudget * 0.3, physicalWeightage: 30, status: 'Pending' }
        ],
        expenses: [
          { id: 'e1', invoiceNumber: 'INV-2026-101', vendorName: 'UltraTech Cement', amount: found.expenditure * 0.5, category: 'Material', invoiceDocHash: '0x3a4b7c89d902...', blockchainTxHash: transactions[1].txHash },
          { id: 'e2', invoiceNumber: 'INV-2026-102', vendorName: 'Tata Steel Fe500', amount: found.expenditure * 0.4, category: 'Material', invoiceDocHash: '0x892da01b9521...', blockchainTxHash: transactions[0].txHash }
        ],
        documents: [
          { id: 'd1', docType: 'DPR', title: 'Detailed Project Report', fileHash: '0x7b23d9a1...', uploadedBy: 'Er. Rajeshwar Rao', verifiedOnChain: true, blockchainTxHash: transactions[0].txHash },
          { id: 'd2', docType: 'TenderOrder', title: 'Work Order & Escrow Sanction', fileHash: '0x91dae2f4...', uploadedBy: 'Principal Secretary', verifiedOnChain: true, blockchainTxHash: transactions[1].txHash }
        ],
        blockchainTransactions: transactions
      });
    }

    return res.status(200).json(projects);
  }

  // 3. Departments
  if (url.includes('/api/departments')) {
    return res.status(200).json(departments);
  }

  // 4. Contractors & Contractor Dashboard
  if (url.includes('/api/contractors/my-projects')) {
    return res.status(200).json(projects.slice(0, 3).map(p => ({
      ...p,
      contractor: contractors[2],
      milestones: [
        { id: 'm1', sequence: 1, title: 'Phase 1: Foundation Works', targetAmount: p.totalBudget * 0.3, physicalWeightage: 30, status: 'FundsReleased', evidenceDocHash: '0x7a83d4c6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4eab85' },
        { id: 'm2', sequence: 2, title: 'Phase 2: Superstructure & Girders', targetAmount: p.totalBudget * 0.4, physicalWeightage: 40, status: 'Approved', evidenceDocHash: '0x91dae2f4c6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4eb5a4' },
        { id: 'm3', sequence: 3, title: 'Phase 3: Decking & Commissioning', targetAmount: p.totalBudget * 0.3, physicalWeightage: 30, status: 'Pending' }
      ]
    })));
  }

  if (url.includes('/api/contractors')) {
    return res.status(200).json(contractors);
  }

  // 5. Fund Allocation, Release, and Expenses
  if (url.includes('/api/funds/allocate')) {
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return res.status(200).json({
      success: true,
      message: 'Budget successfully allocated on FundChain smart contract',
      txHash,
      blockNumber: 18942701,
      gasUsed: 42100
    });
  }

  if (url.includes('/api/funds/release')) {
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return res.status(200).json({
      success: true,
      message: 'Funds released from escrow to contractor wallet upon milestone approval',
      txHash,
      blockNumber: 18942702,
      gasUsed: 51200
    });
  }

  if (url.includes('/api/funds/expense')) {
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return res.status(200).json({
      success: true,
      message: 'Contractor expense item recorded and verified with cryptographic invoice hash',
      txHash,
      blockNumber: 18942703,
      gasUsed: 38900
    });
  }

  // 6. Milestones (Approve & Evidence)
  if (url.includes('/approve')) {
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return res.status(200).json({
      success: true,
      message: 'Milestone verified and approved on-chain. Smart contract fund release triggered.',
      txHash,
      blockNumber: 18942704
    });
  }

  if (url.includes('/submit-evidence')) {
    return res.status(200).json({
      success: true,
      message: 'Milestone evidence document & geotagged proof submitted for engineering verification',
      documentHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    });
  }

  // 7. Blockchain Verifications
  if (url.includes('/api/blockchain/verify/')) {
    const hash = url.split('/api/blockchain/verify/')[1]?.split('?')[0];
    return res.status(200).json({
      verified: true,
      data: {
        txHash: hash || transactions[0].txHash,
        blockNumber: 18942698,
        timestamp: new Date().toISOString(),
        sender: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        receiver: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        amount: 19500000,
        projectId: 'p1',
        projectCode: 'FC-2026-PWD-001',
        projectTitle: 'Peripheral Ring Road Corridor Phase-II',
        eventType: 'FundsReleased',
        gasUsed: 48200,
        verificationStatus: 'VERIFIED ON IMMUTABLE LEDGER',
        consensusMechanism: 'Proof of Authority (GovTech Testnet)',
        smartContract: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
      }
    });
  }

  if (url.includes('/api/blockchain/verify-hash/')) {
    return res.status(200).json({
      verified: true,
      type: 'Official Document',
      title: 'Detailed Project Report (DPR)',
      projectCode: 'FC-2026-PWD-001',
      projectTitle: 'Peripheral Ring Road Corridor',
      blockchainTxHash: transactions[0].txHash,
      blockNumber: 18942698
    });
  }

  if (url.includes('/api/blockchain/transactions') || url.includes('/api/blockchain/recent-blocks')) {
    return res.status(200).json({
      transactions,
      recentBlocks: transactions,
      latestBlock: 18942700
    });
  }

  // 8. Anomalies
  if (url.includes('/api/anomalies/scan-all')) {
    return res.status(200).json({
      success: true,
      scannedProjects: 30,
      flaggedAnomalies: 1,
      message: 'AI Isolation Forest scan completed across all active projects'
    });
  }

  if (url.includes('/resolve')) {
    return res.status(200).json({
      success: true,
      message: 'Anomaly marked as resolved and logged to audit trail'
    });
  }

  if (url.includes('/api/anomalies')) {
    return res.status(200).json([
      {
        id: 'a1',
        projectId: 'p2',
        severity: 'High',
        description: 'Review Required — Financial progress (78.5%) is higher than reported physical progress (35.0%).',
        confidenceScore: 0.94,
        status: 'Under Review',
        detectedAt: new Date().toISOString(),
        project: projects[1]
      }
    ]);
  }

  // 9. Auth Demo Login
  if (url.includes('/api/auth/demo-login')) {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch {}
    }
    const role = (body && body.role) ? body.role : 'GOVERNMENT';
    const roleProfiles = {
      GOVERNMENT: { id: 'u_gov', name: 'State Principal Finance Secretary', email: 'finsec@karnataka.gov.in', role: 'GOVERNMENT' },
      DEPARTMENT: { id: 'u_dept', name: 'PWD Chief Engineer (Highways)', email: 'chief.pwd@karnataka.gov.in', role: 'DEPARTMENT', departmentId: '1' },
      CONTRACTOR: { id: 'u_cont', name: 'Project Lead, Shapoorji Pallonji', email: 'contracts@shapoorji.com', role: 'CONTRACTOR', contractorId: 'c3' },
      AUDITOR: { id: 'u_audit', name: 'Senior CAG State Auditor', email: 'audit.blr@cag.gov.in', role: 'AUDITOR' },
      CITIZEN: { id: 'u_cit', name: 'Citizen Observer', email: 'citizen@fundchain.in', role: 'CITIZEN' }
    };
    const profile = roleProfiles[role] || roleProfiles.GOVERNMENT;
    return res.status(200).json({
      token: `fundchain_jwt_${role.toLowerCase()}_demo_2026`,
      user: profile
    });
  }

  if (url.includes('/api/auth/login')) {
    return res.status(200).json({
      token: 'fundchain_jwt_token_demo_2026',
      user: {
        id: 'u1',
        name: 'Government Official / Demo User',
        email: 'gov@fundchain.gov.in',
        role: 'GOVERNMENT'
      }
    });
  }

  // Default health
  return res.status(200).json({
    status: 'online',
    system: 'FundChain Vercel Serverless Edge',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}
