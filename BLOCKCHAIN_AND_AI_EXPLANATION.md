# 🏛️ FundChain: Role of Blockchain and AI in Public Fund Tracking
> **Project Title:** FundChain — Blockchain-Based Public Fund Tracking & Transparency System  
> **Tagline:** *"Track Every Rupee. Verify Every Record."*  
> **Academic Level:** Final-Year B.E. (Bachelor of Engineering) Major Project  
> **Prepared For:** Project Guide / Professor / Viva Evaluation

---

## 📌 Quick Summary for Your Presentation (2-Minute Elevator Pitch)

> *"Respected Ma'am / Sir,*  
> *In traditional government projects, funds often leak or get delayed because transactions are stored in private, centralized databases that administrators can edit or delete, and nobody verifies if ground physical work matches the released money.*  
> 
> *In **FundChain**, we solve this using two cutting-edge technologies:*
> 1. ***Blockchain (Ethereum / Solidity):*** *Acts as a tamper-proof digital notary. Once a rupee is allocated, approved, or paid to a contractor, that record is cryptographically signed and stored in immutable blocks. Nobody—not even an admin—can delete or alter it.*
> 2. ***Artificial Intelligence (Python / Scikit-Learn Isolation Forest):*** *Acts as an automated audit watchdog. It continuously analyzes fund releases against real ground physical progress. If a contractor has received 78% of the funds but only completed 35% of the bridge, our AI immediately flags a neutral alert: **'Review Required — Financial progress is higher than reported physical progress'**, allowing state auditors to intervene before money is lost."*

---

## 📑 Table of Contents
1. [Where and How Blockchain is Used](#1-where-and-how-blockchain-is-used)
   - [Core Problems Solved by Blockchain](#core-problems-solved-by-blockchain)
   - [Smart Contract Architecture (`FundChain.sol`)](#smart-contract-architecture-fundchainsol)
   - [Off-Chain Storage & On-Chain Hash Fingerprints](#off-chain-storage--on-chain-hash-fingerprints)
   - [Public Verification Explorer (`/verify`)](#public-verification-explorer-verify)
2. [Where and How Artificial Intelligence (AI) is Used](#2-where-and-how-artificial-intelligence-ai-is-used)
   - [Core Problems Solved by AI](#core-problems-solved-by-ai)
   - [Isolation Forest Machine Learning Model](#isolation-forest-machine-learning-model)
   - [The Multi-Parameter Feature Vector](#the-multi-parameter-feature-vector)
   - [Deterministic Disparity Rules & Neutral Audit Wording](#deterministic-disparity-rules--neutral-audit-wording)
3. [The Synergy: How Blockchain and AI Work Together](#3-the-synergy-how-blockchain-and-ai-work-together)
4. [Frequently Asked Questions (Viva Questions & Exact Answers)](#4-frequently-asked-questions-viva-questions--exact-answers)
5. [Code File References in the Project](#5-code-file-references-in-the-project)

---

## 1. Where and How Blockchain is Used

### Core Problems Solved by Blockchain
In existing government portals:
- Records can be changed or back-dated by database admins to cover up delays or unauthorized expenses.
- Citizens and auditors cannot mathematically prove whether an invoice was altered after submission.
- Centralized databases lack trust between independent bodies (Government Treasury, Public Works Department, Private Contractors, and the Public).

### Smart Contract Architecture (`blockchain/contracts/FundChain.sol`)
Our smart contract is written in **Solidity ^0.8.20** and deployed to an Ethereum-compatible Proof-of-Authority (PoA) network at address:  
`0x5FbDB2315678afecb367f032d93F642f64180aa3`

The smart contract governs the entire 7-step lifecycle:
$$\text{Government} \longrightarrow \text{Department} \longrightarrow \text{Project} \longrightarrow \text{Contractor} \longrightarrow \text{Milestone} \longrightarrow \text{Expense} \longrightarrow \text{Blockchain}$$

#### 8 Core Blockchain Functions:
1. **`createProject(...)`**: Registers a new civic project with sanctioned budget, department code, and assigned contractor wallet. Emits `ProjectCreated` event.
2. **`allocateFunds(...)`**: Treasury locks budgetary capital into the smart contract project escrow. Emits `FundsAllocated` event.
3. **`createMilestone(...)`**: Defines physical stages (e.g., *Phase 1: Substructure 30%*, *Phase 2: Superstructure 40%*) with target amounts. Emits `MilestoneCreated` event.
4. **`submitMilestoneEvidence(...)`**: Contractor submits proof of ground work along with an unalterable **SHA-256 cryptographic hash** of the site inspection report. Emits `MilestoneEvidenceSubmitted` event.
5. **`approveMilestone(...)`**: Authorized Department Chief Engineer digitally signs that physical inspection is verified on-site. Emits `MilestoneApproved` event.
6. **`releaseFunds(...)`**: Smart contract programmatically releases payment directly to the contractor’s wallet. **Non-reentrant modifier** protects against reentrancy attacks. Emits `FundsReleased` event.
7. **`recordExpense(...)`**: Contractor logs itemized supplier expenses (cement, steel, labor) accompanied by the invoice's SHA-256 hash. Emits `ExpenseRecorded` event.
8. **`registerDocumentHash(...)`**: Seals Detailed Project Reports (DPR), tenders, and quality certificates on-chain. Emits `DocumentRegistered` event.

### Off-Chain Storage & On-Chain Hash Fingerprints
*Crucial viva concept to explain to your professor:*
- **We do NOT store heavy PDFs or videos directly on the blockchain**, because storing large files on-chain is prohibitively expensive in gas fees and slows the network.
- **Instead:**
  1. The actual document (PDF, site photo) is stored off-chain or on IPFS.
  2. A **SHA-256 cryptographic hash** (a 64-character unique digital fingerprint) is computed from the file.
  3. This hash is permanently recorded on the blockchain smart contract.
  4. If anyone tampers with even a single letter or rupee in the document, the hash changes, and the smart contract immediately rejects it as invalid.

### Public Verification Explorer (`/verify`)
Anyone (citizen, journalist, or CAG auditor) can enter a transaction hash (`0x...`) and see:
- Block Number & Timestamp
- Sender (Treasury / Department) and Receiver (Contractor Wallet)
- Disbursed Amount in ₹
- Event Type & Consumed Gas Units
- Status: **`VERIFIED ON IMMUTABLE LEDGER`**
- Decoded raw smart contract state receipt

---

## 2. Where and How Artificial Intelligence (AI) is Used

### Core Problems Solved by AI
While Blockchain ensures records cannot be altered, **it does not automatically know if human officials are disbursing money too fast or colluding to approve milestones ahead of real physical progress.**  
With hundreds of public projects, human state auditors cannot monitor every transaction manually in real time. **AI acts as the automated surveillance auditor.**

### Isolation Forest Machine Learning Model (`ai-service/detector.py`)
We implemented an unsupervised anomaly detection engine using **Python 3.12, Scikit-Learn, and FastAPI**:
- **Why Isolation Forest?**  
  Unlike traditional supervised models that require thousands of labeled "fraud" examples (which governments rarely publish), **Isolation Forest** isolates anomalies based on the principle that unusual data points have shorter path lengths in randomized decision trees.

### The Multi-Parameter Feature Vector
The model evaluates each project across 5 statistical dimensions:
$$\vec{X} = \begin{bmatrix} \text{Financial Progress } \% \\ \text{Physical Progress } \% \\ \text{Budget Utilization Ratio} \\ \text{Expense-to-Allocated Ratio} \\ \text{Milestone Disbursement Velocity} \end{bmatrix}$$

- Baseline: Trained on benchmark distributions of 300 normal municipal infrastructure projects where physical progress closely tracks financial progress within a $\pm 15\%$ tolerance band.

### Deterministic Disparity Rules & Neutral Audit Wording
The AI service analyzes four critical patterns:
1. **Physical vs. Financial Disparity (Core Requirement):**
   - If a project has released **78.5%** of its capital, but ground engineers only report **35.0%** physical progress, the AI triggers:
     > **"Review Required — Financial progress is higher than reported physical progress."**
2. **Single-Expense Outlier Spike:**
   - Flags when a single disbursement to a single vendor represents $>40\%$ of the entire allocated project capital.
3. **Missing Ledger Evidence Proofs:**
   - Flags when milestones are marked "Approved" without a verifiable SHA-256 evidence hash on the blockchain.
4. **Expense Overrun:**
   - Flags when recorded supplier expenses exceed total released tranches.

### Ethical AI / Auditor Standard
*Important viva rule:*
- The AI **NEVER claims or writes that an anomaly is "fraud" or "corruption"**.
- It frames every flag objectively as **"Review Required"** or **"Variance Advisory"** for departmental inspection. This satisfies real-world legal and governmental audit compliance standards.

---

## 3. The Synergy: How Blockchain and AI Work Together

| Feature | Without Blockchain & AI | With Blockchain Only | With Both: FundChain |
|---|---|---|---|
| **Data Integrity** | Vulnerable to admin alteration | Tamper-proof and immutable | Tamper-proof and immutable |
| **Audit Speed** | Months/years after project ends | Instant cryptographic lookup | Instant real-time anomaly detection |
| **Disparity Detection** | Discovered only after scam is exposed | Human must manually calculate math | **AI flags discrepancy within seconds** |
| **Contractor Accountability** | Advance payments without ground proof | Milestone releases locked by code | Milestone releases locked + Hash verified |
| **Public Trust** | Closed government portals | Open but technical for citizens | **Human-friendly citizen portal + GIS map** |

---

## 4. Frequently Asked Questions (Viva Questions & Exact Answers)

### Q1: "Why did you use Blockchain instead of a standard MySQL database with audit tables?"
> **Answer:**  
> *"Ma'am, in a traditional MySQL or PostgreSQL database, a database administrator (DBA) or high-ranking government official with root access can run `UPDATE` or `DELETE` SQL queries to alter past expenditure records or back-date transactions.  
> In FundChain, the financial disbursements and milestone approvals are executed on an Ethereum smart contract. Blockchain uses cryptographic hashing and append-only blocks, making it mathematically impossible for any administrator to erase or modify recorded expenditures."*

---

### Q2: "Do you store large engineering drawings or inspection photos directly on the blockchain?"
> **Answer:**  
> *"No, Ma'am. Storing large binary files on a blockchain requires enormous gas fees and causes network bloat.  
> Following industry best practices, we use an **Off-Chain Storage / On-Chain Hash Verification** architecture:
> The actual PDF or photo is stored off-chain (or IPFS), and we calculate its **SHA-256 hash**. Only the 64-character hash is registered on the smart contract. Anyone can verify the file at any time by re-hashing it against the on-chain ledger."*

---

### Q3: "Does your AI module directly accuse a contractor of fraud?"
> **Answer:**  
> *"No, Ma'am. In professional government auditing (like the CAG of India), an algorithm cannot make legal accusations of fraud because legitimate delays—such as monsoon rain, land acquisition litigation, or bulk cement advance purchases—can temporarily cause financial progress to exceed physical progress.  
> Therefore, our Scikit-Learn Isolation Forest module uses neutral audit wording: **'Review Required — Financial progress is higher than reported physical progress'**, ensuring that human auditors are alerted to inspect the site without making premature legal assumptions."*

---

### Q4: "What consensus mechanism and smart contract version did you use?"
> **Answer:**  
> *"We wrote the smart contract in **Solidity version ^0.8.20** with OpenZeppelin reentrancy guard standards. For the network layer, we configured a **Proof of Authority (PoA)** Ethereum-compatible testnet. PoA is ideal for GovTech consortiums because validator nodes are operated by trusted government authorities (Finance Ministry, State Auditor, Public Works), providing sub-second block times and near-zero transaction costs."*

---

### Q5: "How does the citizen benefit if they don't know blockchain?"
> **Answer:**  
> *"Citizens don't need MetaMask, crypto wallets, or private keys. Our frontend provides a clean, human-friendly UI with:
> 1. An OpenStreetMap **GIS Map** showing projects pinned by district.
> 2. An interactive **'Follow the Money'** visualizer that traces rupees from Treasury &rarr; Department &rarr; Contractor &rarr; Milestone &rarr; Expense.
> 3. A one-click **Verify Transaction** explorer that translates complex blockchain blocks into clear human-readable audit receipts."*

---

## 5. Code File References in the Project

If your professor asks to see the exact code, open these files:

1. **Smart Contract:**  
   [`blockchain/contracts/FundChain.sol`](file:///C:/Users/Prajwal/.gemini/antigravity/scratch/fundchain/blockchain/contracts/FundChain.sol)  
   *(Contains the complete Solidity contract with `createProject`, `releaseFunds`, and event logs)*

2. **AI Anomaly Detection Engine:**  
   [`ai-service/detector.py`](file:///C:/Users/Prajwal/.gemini/antigravity/scratch/fundchain/ai-service/detector.py)  
   *(Contains the Scikit-Learn `IsolationForest` model and physical vs. financial disparity metrics)*

3. **AI REST Microservice:**  
   [`ai-service/main.py`](file:///C:/Users/Prajwal/.gemini/antigravity/scratch/fundchain/ai-service/main.py)  
   *(FastAPI microservice exposing `/analyze-project` and `/analyze-batch`)*

4. **Blockchain Sync Service:**  
   [`server/src/services/blockchainService.ts`](file:///C:/Users/Prajwal/.gemini/antigravity/scratch/fundchain/server/src/services/blockchainService.ts)  
   *(Ethers.js bridge syncing smart contract transactions with the database)*

5. **Follow the Money Interactive Component:**  
   [`client/src/components/FollowTheMoney.tsx`](file:///C:/Users/Prajwal/.gemini/antigravity/scratch/fundchain/client/src/components/FollowTheMoney.tsx)  
   *(7-step sequential fund tracker from Treasury to Supplier Invoice)*

6. **On-Chain Verification Explorer:**  
   [`client/src/pages/VerifyTransactionPage.tsx`](file:///C:/Users/Prajwal/.gemini/antigravity/scratch/fundchain/client/src/pages/VerifyTransactionPage.tsx)  
   *(Page where users enter any transaction hash to see proof of ledger integrity)*

7. **Database Schema:**  
   [`server/prisma/schema.prisma`](file:///C:/Users/Prajwal/.gemini/antigravity/scratch/fundchain/server/prisma/schema.prisma)  
   *(Prisma schema with 12 models: Users, Projects, Milestones, Expenses, Documents, BlockchainTransactions, Anomalies)*

---

*Academic Major Project Documentation &bull; Bachelor of Engineering (B.E.) &bull; Computer Science &amp; Engineering*
