export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  budgetAllocated: number;
  budgetSpent: number;
  headName: string;
  contactEmail: string;
  _count?: {
    projects: number;
  };
}

export interface Contractor {
  id: string;
  name: string;
  registrationNumber: string;
  panNumber?: string;
  contactEmail: string;
  contactPhone?: string;
  rating: number;
  walletAddress?: string;
  _count?: {
    projects: number;
  };
}

export interface Milestone {
  id: string;
  projectId: string;
  sequence: number;
  title: string;
  description: string;
  targetAmount: number;
  physicalWeightage: number;
  status: 'Pending' | 'InProgress' | 'Submitted' | 'Approved' | 'FundsReleased';
  evidenceDescription?: string | null;
  evidenceDocHash?: string | null;
  submittedAt?: string | null;
  approvedAt?: string | null;
  approvedBy?: string | null;
  fundReleases?: FundRelease[];
  expenses?: Expense[];
}

export interface FundRelease {
  id: string;
  projectId: string;
  milestoneId?: string | null;
  amount: number;
  releaseDate: string;
  authorizedBy: string;
  recipientAddress?: string | null;
  blockchainTxHash?: string | null;
  blockNumber?: number | null;
  status: string;
}

export interface Expense {
  id: string;
  projectId: string;
  milestoneId?: string | null;
  vendorName: string;
  amount: number;
  category: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceDocHash: string;
  blockchainTxHash?: string | null;
  blockNumber?: number | null;
  status: string;
}

export interface Document {
  id: string;
  projectId: string;
  docType: string;
  title: string;
  fileName: string;
  fileHash: string;
  fileSize: number;
  ipfsHash?: string | null;
  uploadedBy: string;
  verifiedOnChain: boolean;
  blockchainTxHash?: string | null;
  blockNumber?: number | null;
  createdAt: string;
}

export interface BlockchainTransaction {
  id: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
  eventType: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  projectId?: string | null;
  status: string;
  gasUsed: number;
  rawData?: string | null;
  project?: {
    code: string;
    title: string;
    sector?: string;
  };
}

export interface Anomaly {
  id: string;
  projectId: string;
  anomalyType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  confidenceScore: number;
  detectedAt: string;
  status: 'Under Review' | 'Resolved' | 'Cleared';
  resolvedBy?: string | null;
  project?: Project;
}

export interface Project {
  id: string;
  code: string;
  title: string;
  description: string;
  departmentId: string;
  contractorId?: string | null;
  totalBudget: number;
  allocatedFunds: number;
  releasedFunds: number;
  expenditure: number;
  physicalProgress: number;
  financialProgress: number;
  status: 'Proposed' | 'Approved' | 'Active' | 'Delayed' | 'Completed';
  sector: 'Roads' | 'Schools' | 'Hospitals' | 'Water' | 'Infrastructure';
  locationAddress: string;
  district: string;
  state: string;
  locationLat: number;
  locationLng: number;
  startDate: string;
  targetCompletionDate: string;
  aiReviewStatus: 'Normal' | 'Review Required' | 'High Risk';
  aiReviewReason?: string | null;
  smartContractProjectId?: number | null;
  createdAt: string;
  updatedAt: string;

  department?: Department;
  contractor?: Contractor;
  milestones?: Milestone[];
  fundAllocations?: any[];
  fundReleases?: FundRelease[];
  expenses?: Expense[];
  documents?: Document[];
  blockchainTransactions?: BlockchainTransaction[];
  anomalies?: Anomaly[];
  remainingBudget?: number;
  unspentReleased?: number;
  aiAnalysis?: {
    isFlagged: boolean;
    severity: string;
    riskScore: number;
    primaryReason: string;
    allReasons: string[];
    metrics: {
      financialProgressPct: number;
      physicalProgressPct: number;
      disparityDelta: number;
      budgetUtilization: number;
      expenseRatio: number;
    };
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'GOVERNMENT' | 'DEPARTMENT' | 'CONTRACTOR' | 'AUDITOR' | 'CITIZEN';
  departmentId?: string | null;
  contractorId?: string | null;
  department?: Department | null;
  contractor?: Contractor | null;
}

export interface SystemOverview {
  summary: {
    totalBudget: number;
    allocatedFunds: number;
    releasedFunds: number;
    expenditure: number;
    totalProjects: number;
    completedProjects: number;
    activeProjects: number;
    delayedProjects: number;
    departmentsCount: number;
    contractorsCount: number;
    transactionsCount: number;
    anomaliesCount: number;
  };
  sectors: {
    sector: string;
    count: number;
    budget: number;
    released: number;
  }[];
  recentTransactions: BlockchainTransaction[];
}
