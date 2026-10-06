import { config } from '../config/env';

export interface AIAnalysisResult {
  isFlagged: boolean;
  severity: 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH';
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
}

class AIService {
  /**
   * Analyzes project financial and milestone metrics using FastAPI ML microservice or internal heuristics
   */
  async analyzeProject(
    project: any,
    expenses: any[] = [],
    milestones: any[] = []
  ): Promise<AIAnalysisResult> {
    try {
      // Attempt to invoke the Python Isolation Forest microservice
      const response = await fetch(`${config.aiServiceUrl}/analyze-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, expenses, milestones })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.analysis) {
          return json.analysis;
        }
      }
    } catch {
      // Fallback seamlessly to native statistical analysis engine
    }

    return this.evaluateHeuristics(project, expenses, milestones);
  }

  private evaluateHeuristics(
    project: any,
    expenses: any[] = [],
    milestones: any[] = []
  ): AIAnalysisResult {
    const totalBudget = Number(project.totalBudget || 0);
    const allocated = Number(project.allocatedFunds || 0);
    const released = Number(project.releasedFunds || 0);
    const spent = Number(project.expenditure || 0);
    const physicalPct = Number(project.physicalProgress || 0);

    const financialPct = totalBudget > 0 ? (released / totalBudget) * 100 : 0;
    const utilization = allocated > 0 ? (spent / allocated) * 100 : 0;
    const expenseRatio = released > 0 ? (spent / released) * 100 : 0;
    const disparity = financialPct - physicalPct;

    const flags: string[] = [];
    let severity: 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH' = 'NORMAL';

    // 1. Mandatory Core Requirement: Financial progress higher than physical progress
    if (financialPct > physicalPct + 15 && financialPct >= 20) {
      flags.push(
        `Review Required — Financial progress is higher than reported physical progress.`
      );
      severity = disparity > 30 ? 'HIGH' : 'MEDIUM';
    }

    // 2. Large expense outlier check (> 40% of allocated capital)
    if (expenses && expenses.length > 0 && allocated > 0) {
      for (const exp of expenses) {
        if (Number(exp.amount) > allocated * 0.4) {
          flags.push(
            `Notice — Single disbursement to '${exp.vendorName || exp.vendor || 'Vendor'}' (₹${Number(exp.amount).toLocaleString('en-IN')}) represents >40% of total allocated funds.`
          );
          if (severity === 'NORMAL') severity = 'MEDIUM';
        }
      }
    }

    // 3. Milestone without verifiable evidence hash
    if (milestones && milestones.length > 0) {
      const missingEvidence = milestones.filter(
        (m) =>
          (m.status === 'Approved' || m.status === 'FundsReleased') &&
          !m.evidenceDocHash
      );
      if (missingEvidence.length > 0) {
        flags.push(
          `Notice — ${missingEvidence.length} milestone(s) approved without verifiable SHA-256 evidence hash on ledger.`
        );
        if (severity === 'NORMAL') severity = 'LOW';
      }
    }

    // 4. Spent exceeds released
    if (spent > released && released > 0) {
      flags.push(
        `Audit Advisory — Total recorded expense (₹${spent.toLocaleString('en-IN')}) exceeds total disbursed tranche (₹${released.toLocaleString('en-IN')}).`
      );
      severity = 'HIGH';
    }

    const isFlagged = flags.length > 0;
    const primaryReason = isFlagged
      ? flags[0]
      : 'Normal expenditure and milestone progression pattern within standard parameters.';

    // Risk score from 0.05 to 0.95
    let riskScore = 0.08;
    if (severity === 'HIGH') riskScore = 0.92;
    else if (severity === 'MEDIUM') riskScore = 0.65;
    else if (severity === 'LOW') riskScore = 0.35;

    return {
      isFlagged,
      severity,
      riskScore,
      primaryReason,
      allReasons: flags,
      metrics: {
        financialProgressPct: Math.round(financialPct * 10) / 10,
        physicalProgressPct: Math.round(physicalPct * 10) / 10,
        disparityDelta: Math.round(disparity * 10) / 10,
        budgetUtilization: Math.round(utilization * 10) / 10,
        expenseRatio: Math.round(expenseRatio * 10) / 10
      }
    };
  }
}

export const aiService = new AIService();
