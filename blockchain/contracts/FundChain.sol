// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FundChain
 * @notice Blockchain-Based Public Fund Tracking & Transparency System
 * @dev Academic Demonstration Major Project - "Track Every Rupee. Verify Every Record."
 */
contract FundChain {
    // --- Access Control ---
    address public governmentAdmin;
    
    mapping(address => bool) public authorizedDepartments;
    mapping(address => bool) public authorizedAuditors;
    mapping(address => bool) public authorizedContractors;

    // --- Data Structures ---
    enum ProjectStatus { Proposed, Approved, Active, Delayed, Completed, Suspended }
    enum MilestoneStatus { Pending, InProgress, Submitted, Approved, FundsReleased }

    struct Milestone {
        uint256 id;
        string title;
        uint256 targetAmount;
        uint8 physicalTargetPercentage;
        MilestoneStatus status;
        string evidenceDocHash;
        uint256 approvedAt;
        uint256 fundsReleasedAt;
    }

    struct Project {
        uint256 id;
        string name;
        string departmentCode;
        uint256 totalBudget;
        uint256 allocatedFunds;
        uint256 releasedFunds;
        uint256 totalExpenses;
        address contractor;
        ProjectStatus status;
        uint256 createdAt;
        bool exists;
    }

    struct ExpenseRecord {
        uint256 expenseId;
        uint256 projectId;
        uint256 milestoneId;
        string vendor;
        uint256 amount;
        string category;
        string invoiceHash;
        uint256 timestamp;
    }

    struct DocumentRecord {
        string docType;
        string docHash;
        string ipfsUri;
        uint256 timestamp;
        address uploadedBy;
    }

    // --- Mappings ---
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Milestone[]) private projectMilestones;
    mapping(uint256 => ExpenseRecord[]) private projectExpenses;
    mapping(uint256 => DocumentRecord[]) private projectDocuments;
    mapping(string => bool) public verifiedHashes;

    uint256 public totalProjectsCount;
    uint256 public totalGovernmentBudget;
    uint256 public totalDisbursedFunds;

    // --- Reentrancy Guard ---
    uint8 private _unlocked = 1;
    modifier nonReentrant() {
        require(_unlocked == 1, "FundChain: REENTRANCY_GUARD_TRIGGERED");
        _unlocked = 0;
        _;
        _unlocked = 1;
    }

    // --- Modifiers ---
    modifier onlyGovernment() {
        require(msg.sender == governmentAdmin, "FundChain: ONLY_GOVERNMENT_ADMIN");
        _;
    }

    modifier onlyAuthorized() {
        require(
            msg.sender == governmentAdmin || 
            authorizedDepartments[msg.sender] || 
            authorizedAuditors[msg.sender],
            "FundChain: UNAUTHORIZED_SENDER"
        );
        _;
    }

    // --- Events (Audit Trail on-chain) ---
    event ProjectCreated(
        uint256 indexed projectId, 
        string name, 
        string departmentCode, 
        uint256 budget, 
        address indexed contractor, 
        uint256 timestamp
    );

    event FundsAllocated(
        uint256 indexed projectId, 
        uint256 amount, 
        uint256 newTotalAllocation, 
        uint256 timestamp
    );

    event MilestoneCreated(
        uint256 indexed projectId, 
        uint256 milestoneId, 
        string title, 
        uint256 targetAmount, 
        uint8 physicalTarget, 
        uint256 timestamp
    );

    event MilestoneEvidenceSubmitted(
        uint256 indexed projectId, 
        uint256 milestoneId, 
        string evidenceHash, 
        uint256 timestamp
    );

    event MilestoneApproved(
        uint256 indexed projectId, 
        uint256 milestoneId, 
        address indexed approver, 
        uint256 timestamp
    );

    event FundsReleased(
        uint256 indexed projectId, 
        uint256 milestoneId, 
        uint256 amount, 
        address indexed recipient, 
        string txRef, 
        uint256 timestamp
    );

    event ExpenseRecorded(
        uint256 indexed projectId, 
        uint256 expenseId, 
        string vendor, 
        uint256 amount, 
        string category, 
        string invoiceHash, 
        uint256 timestamp
    );

    event DocumentRegistered(
        uint256 indexed projectId, 
        string docType, 
        string docHash, 
        string ipfsUri, 
        uint256 timestamp
    );

    constructor() {
        governmentAdmin = msg.sender;
    }

    // --- Administrative Functions ---
    function setDepartmentAuthorization(address deptAddress, bool authorized) external onlyGovernment {
        authorizedDepartments[deptAddress] = authorized;
    }

    function setAuditorAuthorization(address auditorAddress, bool authorized) external onlyGovernment {
        authorizedAuditors[auditorAddress] = authorized;
    }

    function setContractorAuthorization(address contractorAddress, bool authorized) external onlyGovernment {
        authorizedContractors[contractorAddress] = authorized;
    }

    // --- Core Workflow Functions ---

    /**
     * @notice Creates a new public infrastructure or civic project
     */
    function createProject(
        uint256 id,
        string calldata name,
        string calldata dept,
        uint256 budget,
        address contractor
    ) external onlyAuthorized {
        require(!projects[id].exists, "FundChain: PROJECT_ALREADY_EXISTS");
        require(budget > 0, "FundChain: INVALID_BUDGET");

        projects[id] = Project({
            id: id,
            name: name,
            departmentCode: dept,
            totalBudget: budget,
            allocatedFunds: 0,
            releasedFunds: 0,
            totalExpenses: 0,
            contractor: contractor,
            status: ProjectStatus.Active,
            createdAt: block.timestamp,
            exists: true
        });

        totalProjectsCount += 1;
        totalGovernmentBudget += budget;

        emit ProjectCreated(id, name, dept, budget, contractor, block.timestamp);
    }

    /**
     * @notice Allocates funds from government treasury to project account
     */
    function allocateFunds(uint256 projectId, uint256 amount) external onlyGovernment {
        require(projects[projectId].exists, "FundChain: PROJECT_NOT_FOUND");
        require(amount > 0, "FundChain: INVALID_AMOUNT");
        require(
            projects[projectId].allocatedFunds + amount <= projects[projectId].totalBudget,
            "FundChain: EXCEEDS_PROJECT_BUDGET"
        );

        projects[projectId].allocatedFunds += amount;

        emit FundsAllocated(projectId, amount, projects[projectId].allocatedFunds, block.timestamp);
    }

    /**
     * @notice Defines a milestone with target percentage and funding cap
     */
    function createMilestone(
        uint256 projectId,
        uint256 milestoneId,
        string calldata title,
        uint256 targetAmount,
        uint8 physicalTarget
    ) external onlyAuthorized {
        require(projects[projectId].exists, "FundChain: PROJECT_NOT_FOUND");
        require(physicalTarget <= 100, "FundChain: INVALID_PHYSICAL_PERCENTAGE");

        projectMilestones[projectId].push(Milestone({
            id: milestoneId,
            title: title,
            targetAmount: targetAmount,
            physicalTargetPercentage: physicalTarget,
            status: MilestoneStatus.Pending,
            evidenceDocHash: "",
            approvedAt: 0,
            fundsReleasedAt: 0
        }));

        emit MilestoneCreated(projectId, milestoneId, title, targetAmount, physicalTarget, block.timestamp);
    }

    /**
     * @notice Contractor submits completion proof with off-chain SHA-256 evidence hash
     */
    function submitMilestoneEvidence(
        uint256 projectId,
        uint256 milestoneIndex,
        string calldata evidenceHash
    ) external {
        require(projects[projectId].exists, "FundChain: PROJECT_NOT_FOUND");
        require(milestoneIndex < projectMilestones[projectId].length, "FundChain: MILESTONE_NOT_FOUND");
        
        Milestone storage m = projectMilestones[projectId][milestoneIndex];
        m.status = MilestoneStatus.Submitted;
        m.evidenceDocHash = evidenceHash;
        verifiedHashes[evidenceHash] = true;

        emit MilestoneEvidenceSubmitted(projectId, m.id, evidenceHash, block.timestamp);
    }

    /**
     * @notice Department or Auditor verifies physical inspection and approves milestone
     */
    function approveMilestone(uint256 projectId, uint256 milestoneIndex) external onlyAuthorized {
        require(projects[projectId].exists, "FundChain: PROJECT_NOT_FOUND");
        require(milestoneIndex < projectMilestones[projectId].length, "FundChain: MILESTONE_NOT_FOUND");

        Milestone storage m = projectMilestones[projectId][milestoneIndex];
        m.status = MilestoneStatus.Approved;
        m.approvedAt = block.timestamp;

        emit MilestoneApproved(projectId, m.id, msg.sender, block.timestamp);
    }

    /**
     * @notice Releases tranche of funds following verified milestone approval
     */
    function releaseFunds(
        uint256 projectId,
        uint256 milestoneIndex,
        uint256 amount,
        string calldata txRef
    ) external onlyGovernment nonReentrant {
        require(projects[projectId].exists, "FundChain: PROJECT_NOT_FOUND");
        require(milestoneIndex < projectMilestones[projectId].length, "FundChain: MILESTONE_NOT_FOUND");
        
        Milestone storage m = projectMilestones[projectId][milestoneIndex];
        require(m.status == MilestoneStatus.Approved, "FundChain: MILESTONE_NOT_APPROVED");
        require(
            projects[projectId].releasedFunds + amount <= projects[projectId].allocatedFunds,
            "FundChain: RELEASE_EXCEEDS_ALLOCATION"
        );

        projects[projectId].releasedFunds += amount;
        totalDisbursedFunds += amount;
        m.status = MilestoneStatus.FundsReleased;
        m.fundsReleasedAt = block.timestamp;

        emit FundsReleased(projectId, m.id, amount, projects[projectId].contractor, txRef, block.timestamp);
    }

    /**
     * @notice Records line-item expenditure with invoice cryptographic hash
     */
    function recordExpense(
        uint256 projectId,
        uint256 expenseId,
        string calldata vendor,
        uint256 amount,
        string calldata category,
        string calldata invoiceHash
    ) external onlyAuthorized {
        require(projects[projectId].exists, "FundChain: PROJECT_NOT_FOUND");
        require(amount > 0, "FundChain: INVALID_EXPENSE_AMOUNT");

        projects[projectId].totalExpenses += amount;
        verifiedHashes[invoiceHash] = true;

        projectExpenses[projectId].push(ExpenseRecord({
            expenseId: expenseId,
            projectId: projectId,
            milestoneId: 0,
            vendor: vendor,
            amount: amount,
            category: category,
            invoiceHash: invoiceHash,
            timestamp: block.timestamp
        }));

        emit ExpenseRecorded(projectId, expenseId, vendor, amount, category, invoiceHash, block.timestamp);
    }

    /**
     * @notice Registers audit document hash (DPR, tender, audit report, site photo hash)
     */
    function registerDocumentHash(
        uint256 projectId,
        string calldata docType,
        string calldata docHash,
        string calldata ipfsUri
    ) external onlyAuthorized {
        require(projects[projectId].exists, "FundChain: PROJECT_NOT_FOUND");
        require(bytes(docHash).length > 0, "FundChain: EMPTY_DOC_HASH");

        verifiedHashes[docHash] = true;

        projectDocuments[projectId].push(DocumentRecord({
            docType: docType,
            docHash: docHash,
            ipfsUri: ipfsUri,
            timestamp: block.timestamp,
            uploadedBy: msg.sender
        }));

        emit DocumentRegistered(projectId, docType, docHash, ipfsUri, block.timestamp);
    }

    // --- View Functions ---
    function getProject(uint256 projectId) external view returns (Project memory) {
        require(projects[projectId].exists, "FundChain: PROJECT_NOT_FOUND");
        return projects[projectId];
    }

    function getMilestones(uint256 projectId) external view returns (Milestone[] memory) {
        return projectMilestones[projectId];
    }

    function getExpenses(uint256 projectId) external view returns (ExpenseRecord[] memory) {
        return projectExpenses[projectId];
    }

    function getDocuments(uint256 projectId) external view returns (DocumentRecord[] memory) {
        return projectDocuments[projectId];
    }

    function verifyHashExists(string calldata targetHash) external view returns (bool) {
        return verifiedHashes[targetHash];
    }
}
