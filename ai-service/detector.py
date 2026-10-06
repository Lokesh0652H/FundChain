"""
FundChain AI Anomaly & Risk Detection Engine
Uses Scikit-learn (Isolation Forest) and deterministic financial disparity heuristics
to evaluate project milestones, expenditure velocity, and fund utilization patterns.

DISCLAIMER: Flagged indicators represent items recommended for administrative/auditor review
and are NEVER to be interpreted or described as conclusive proof of fraud.
"""

import numpy as np
from sklearn.ensemble import IsolationForest
from typing import Dict, Any, List


class FundChainAnomalyDetector:
    def __init__(self):
        # Initialize and fit a baseline Isolation Forest on typical municipal infrastructure distributions
        # Features: [financial_pct, physical_pct, budget_utilization_pct, expense_to_allocated_ratio, release_frequency_index]
        np.random.seed(42)
        # Synthetic baseline of 300 normal infrastructure projects
        normal_financial = np.random.uniform(10, 95, 300)
        # In normal projects, physical progress closely tracks financial progress within +/- 15%
        normal_physical = np.clip(normal_financial + np.random.normal(0, 8, 300), 0, 100)
        normal_utilization = np.clip(normal_financial / 100.0 * np.random.uniform(0.8, 1.05, 300), 0.1, 1.0)
        normal_expense_ratio = np.random.uniform(0.6, 0.98, 300)
        normal_release_freq = np.random.uniform(1.0, 5.0, 300)

        X_train = np.column_stack([
            normal_financial,
            normal_physical,
            normal_utilization,
            normal_expense_ratio,
            normal_release_freq
        ])

        self.model = IsolationForest(
            n_estimators=100,
            contamination=0.10,
            random_state=42
        )
        self.model.fit(X_train)

    def analyze_project(self, project: Dict[str, Any], expenses: List[Dict[str, Any]] = None, milestones: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Analyzes a project's financial and physical parameters and returns an AI review assessment.
        """
        total_budget = float(project.get("totalBudget", 0))
        allocated = float(project.get("allocatedFunds", 0))
        released = float(project.get("releasedFunds", 0))
        spent = float(project.get("expenditure", 0))
        physical_pct = float(project.get("physicalProgress", 0))
        
        # Calculate financial percentage relative to budget
        financial_pct = (released / total_budget * 100.0) if total_budget > 0 else 0.0
        utilization = (spent / allocated) if allocated > 0 else 0.0
        expense_ratio = (spent / released) if released > 0 else 0.0
        release_freq = float(len(milestones or [])) or 1.0

        feature_vector = np.array([[
            financial_pct,
            physical_pct,
            utilization,
            expense_ratio,
            release_freq
        ]])

        # Isolation forest score (lower is more anomalous)
        raw_score = float(self.model.score_samples(feature_vector)[0])
        # Normalize score into a 0.0 to 1.0 risk index (0 = very normal, 1 = high anomaly likelihood)
        normalized_risk = max(0.0, min(1.0, float(-raw_score * 1.5 + 0.35)))

        flags: List[str] = []
        severity = "NORMAL"

        # 1. Primary Requirement Check: Financial progress significantly higher than physical progress
        if financial_pct > (physical_pct + 18.0) and financial_pct >= 25.0:
            flags.append(
                f"Review Required — Financial progress ({financial_pct:.1f}%) is higher than reported physical progress ({physical_pct:.1f}%)."
            )
            severity = "HIGH" if (financial_pct - physical_pct) > 30 else "MEDIUM"

        # 2. Expense check: single expense exceeding 40% of total allocated budget
        if expenses:
            for exp in expenses:
                amt = float(exp.get("amount", 0))
                if allocated > 0 and amt > (allocated * 0.40):
                    vendor = exp.get("vendorName") or exp.get("vendor") or "Vendor"
                    flags.append(
                        f"Notice — Single disbursement to '{vendor}' (₹{amt:,.0f}) represents >40% of total allocated capital."
                    )
                    if severity == "NORMAL":
                        severity = "MEDIUM"

        # 3. Budget utilization without submitted physical evidence
        if milestones:
            approved_unsubmitted = [
                m for m in milestones 
                if m.get("status") in ["Approved", "FundsReleased"] and not m.get("evidenceDocHash")
            ]
            if approved_unsubmitted:
                flags.append(
                    f"Notice — {len(approved_unsubmitted)} milestone(s) transitioned without verifiable SHA-256 evidence hash on ledger."
                )
                if severity == "NORMAL":
                    severity = "LOW"

        # 4. Expenditure higher than released funds
        if spent > released and released > 0:
            flags.append(
                f"Audit Advisory — Total recorded expense (₹{spent:,.0f}) exceeds total disbursed tranche (₹{released:,.0f})."
            )
            severity = "HIGH"

        # Model isolation forest alert
        if normalized_risk > 0.65 and not flags:
            flags.append(
                "Review Advisory — Statistical divergence detected across disbursement velocity and milestone scheduling."
            )
            severity = "LOW"

        is_flagged = len(flags) > 0 or severity in ["MEDIUM", "HIGH"]
        primary_reason = flags[0] if flags else "Normal expenditure pattern within standard variance boundaries."

        return {
            "isFlagged": is_flagged,
            "severity": severity,
            "riskScore": round(normalized_risk, 3),
            "primaryReason": primary_reason,
            "allReasons": flags,
            "metrics": {
                "financialProgressPct": round(financial_pct, 1),
                "physicalProgressPct": round(physical_pct, 1),
                "disparityDelta": round(financial_pct - physical_pct, 1),
                "budgetUtilization": round(utilization * 100.0, 1),
                "expenseRatio": round(expense_ratio * 100.0, 1)
            }
        }


# Singleton instance
anomaly_engine = FundChainAnomalyDetector()
