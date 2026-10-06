import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

function generateTxHash(): string {
  return '0x' + crypto.randomBytes(32).toString('hex');
}

function generateDocHash(content: string): string {
  return crypto.createHash('sha256').update(content + Date.now().toString()).digest('hex');
}

function generateIpfsHash(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let hash = 'Qm';
  for (let i = 0; i < 44; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

function randomWallet(): string {
  return '0x' + crypto.randomBytes(20).toString('hex');
}

async function main() {
  console.log('--- SEEDING FUNDCHAIN DATABASE ---');
  console.log('NOTICE: Academic Demonstration Dataset for BE Major Project');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.anomaly.deleteMany();
  await prisma.blockchainTransaction.deleteMany();
  await prisma.document.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.fundRelease.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.fundAllocation.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.contractor.deleteMany();
  await prisma.department.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create 10 Departments
  const departmentsData = [
    { code: 'PWD', name: 'Public Works Department (State Highways & Bridges)', budgetAllocated: 450000000, headName: 'Er. Rajeshwar Rao', contactEmail: 'pwd.head@fundchain.gov.in' },
    { code: 'HEALTH', name: 'Health & Family Welfare Directorate', budgetAllocated: 320000000, headName: 'Dr. Sunita Kulkarni', contactEmail: 'health.director@fundchain.gov.in' },
    { code: 'EDU', name: 'Department of School & Higher Education', budgetAllocated: 280000000, headName: 'Prof. Anand Verma', contactEmail: 'education.office@fundchain.gov.in' },
    { code: 'WATER', name: 'Rural Water Supply & Sanitation Mission', budgetAllocated: 380000000, headName: 'Er. P. Venkatesh', contactEmail: 'water.sanitation@fundchain.gov.in' },
    { code: 'SMART', name: 'Urban Development & Smart City Mission', budgetAllocated: 520000000, headName: 'IAS Meera Nambiar', contactEmail: 'smartcity.mission@fundchain.gov.in' },
    { code: 'POWER', name: 'Renewable Energy & Grid Modernization', budgetAllocated: 260000000, headName: 'Er. Harish Chandra', contactEmail: 'power.energy@fundchain.gov.in' },
    { code: 'WOMEN', name: 'Women & Child Development Infrastructure', budgetAllocated: 180000000, headName: 'Smt. Shalini Hegde', contactEmail: 'wcd.welfare@fundchain.gov.in' },
    { code: 'IRRIG', name: 'Minor Irrigation & Groundwater Recharge', budgetAllocated: 220000000, headName: 'Er. Ramanathan K.', contactEmail: 'irrigation.dept@fundchain.gov.in' },
    { code: 'TRANS', name: 'Transport Infrastructure & EV Hubs', budgetAllocated: 310000000, headName: 'Shri. Vikram Seth', contactEmail: 'transport.infra@fundchain.gov.in' },
    { code: 'IT', name: 'Electronics & IT Innovation Parks', budgetAllocated: 190000000, headName: 'Dr. Aruna Shenoy', contactEmail: 'it.innovation@fundchain.gov.in' },
  ];

  const createdDepartments = [];
  for (const dept of departmentsData) {
    const d = await prisma.department.create({
      data: {
        code: dept.code,
        name: dept.name,
        budgetAllocated: dept.budgetAllocated,
        budgetSpent: Math.floor(dept.budgetAllocated * 0.42),
        headName: dept.headName,
        contactEmail: dept.contactEmail,
        description: `Responsible for state-level sanctioning, execution, and audits in ${dept.name}.`
      }
    });
    createdDepartments.push(d);
  }
  console.log(`Created ${createdDepartments.length} Departments`);

  // 2. Create 20 Contractors
  const contractorsData = [
    { name: 'Apex Infra Projects Pvt Ltd', reg: 'CIN-U45201KA2015PTC081234', email: 'tenders@apexinfra.in', rating: 4.8 },
    { name: 'Kaveri Civil Engineering Corp', reg: 'CIN-U45202KA2012PTC065412', email: 'contact@kavericivil.com', rating: 4.6 },
    { name: 'Sahyadri Builders & Highways', reg: 'CIN-U45200MH2014PTC078901', email: 'projects@sahyadribuilders.com', rating: 4.4 },
    { name: 'BlueStar Water Tech Solutions', reg: 'CIN-U41000DL2018PTC099231', email: 'info@bluestarwater.in', rating: 4.7 },
    { name: 'Medica Health Infrastructure Ltd', reg: 'CIN-U85110KA2016PLC088712', email: 'bids@medicainfra.org', rating: 4.9 },
    { name: 'Vidyalaya School Works Consortium', reg: 'CIN-U80900TN2017PTC071299', email: 'tender@vidyalayaworks.com', rating: 4.2 },
    { name: 'GreenGrid Solar EPC Services', reg: 'CIN-U40106GJ2019PTC104523', email: 'support@greengridepc.com', rating: 4.5 },
    { name: 'MetroBridge Heavy Structures', reg: 'CIN-U45309TS2013PLC045129', email: 'operations@metrobridge.in', rating: 4.7 },
    { name: 'SmartCity Digital Urban Labs', reg: 'CIN-U72200KA2020PTC132456', email: 'urban@smartcitylabs.ai', rating: 4.6 },
    { name: 'Bharat Jal Utilities & Pipes', reg: 'CIN-U28990UP2016PTC082341', email: 'sales@bharatjal.gov.in.net', rating: 4.3 },
    { name: 'Deccan Expressways & Flyovers Ltd', reg: 'CIN-U45203KA2011PLC059871', email: 'contact@deccanexpressways.in', rating: 4.5 },
    { name: 'Suraksha Structural Engineers', reg: 'CIN-U74210MH2015PTC261984', email: 'admin@surakshastruct.com', rating: 4.1 },
    { name: 'Shakti Power Distribution Partners', reg: 'CIN-U40108RJ2018PTC061298', email: 'info@shaktipower.in', rating: 4.4 },
    { name: 'Chaitanya Community Spaces LLP', reg: 'CIN-U45400KA2021LLP018231', email: 'projects@chaitanyaspaces.in', rating: 4.3 },
    { name: 'Prism Hospital Equipments & Civil', reg: 'CIN-U33110DL2017PTC318902', email: 'tenders@prismcivil.com', rating: 4.7 },
    { name: 'Jal-Jeevan PipeTech Engineering', reg: 'CIN-U25200MH2019PTC329812', email: 'eng@jaljeevantech.in', rating: 4.4 },
    { name: 'Nagarik Urban Transit Associates', reg: 'CIN-U60210KA2016PTC091245', email: 'contact@nagariktransit.com', rating: 4.6 },
    { name: 'Vistara Telemetry & IoT Infrastructure', reg: 'CIN-U72900TS2020PTC145671', email: 'bids@vistaraiot.in', rating: 4.8 },
    { name: 'PentaBridge Foundation Specialists', reg: 'CIN-U45205TN2014PTC098234', email: 'info@pentabridge.co.in', rating: 4.5 },
    { name: 'Sunrise Rural Electrification Corp', reg: 'CIN-U40102GJ2015PTC082910', email: 'projects@sunrisegrid.in', rating: 4.3 },
  ];

  const createdContractors = [];
  for (const c of contractorsData) {
    const contractor = await prisma.contractor.create({
      data: {
        name: c.name,
        registrationNumber: c.reg,
        panNumber: 'AAAC' + Math.floor(1000 + Math.random() * 9000) + 'K',
        contactEmail: c.email,
        contactPhone: '+91 98450 ' + Math.floor(10000 + Math.random() * 90000),
        rating: c.rating,
        walletAddress: randomWallet()
      }
    });
    createdContractors.push(contractor);
  }
  console.log(`Created ${createdContractors.length} Contractors`);

  // 3. Create Users across all roles
  const usersToCreate = [
    { email: 'gov@fundchain.gov.in', name: 'Dr. Ramesh Kumar (Principal Secretary, Finance)', role: 'GOVERNMENT' },
    { email: 'dept.pwd@fundchain.gov.in', name: 'Er. Rajeshwar Rao (Chief Engineer, PWD)', role: 'DEPARTMENT', deptIndex: 0 },
    { email: 'dept.health@fundchain.gov.in', name: 'Dr. Sunita Kulkarni (Director Health)', role: 'DEPARTMENT', deptIndex: 1 },
    { email: 'dept.water@fundchain.gov.in', name: 'Er. P. Venkatesh (Chief Engineer Water)', role: 'DEPARTMENT', deptIndex: 3 },
    { email: 'contractor.apex@fundchain.com', name: 'Sanjay Deshmukh (Managing Director, Apex Infra)', role: 'CONTRACTOR', contractorIndex: 0 },
    { email: 'contractor.kaveri@fundchain.com', name: 'Guruprasad Patil (Director, Kaveri Civil)', role: 'CONTRACTOR', contractorIndex: 1 },
    { email: 'auditor@fundchain.gov.in', name: 'Vandana Shastri (Senior State Auditor, CAG)', role: 'AUDITOR' },
    { email: 'citizen@fundchain.org', name: 'Arjun Nair (Citizen / Civic Activist)', role: 'CITIZEN' },
  ];

  for (const u of usersToCreate) {
    await prisma.user.create({
      data: {
        email: u.email,
        name: u.name,
        passwordHash,
        role: u.role,
        departmentId: u.deptIndex !== undefined ? createdDepartments[u.deptIndex].id : null,
        contractorId: u.contractorIndex !== undefined ? createdContractors[u.contractorIndex].id : null
      }
    });
  }
  console.log(`Created System Users for all roles`);

  // 4. Create 30 Realistic Projects
  const projectsData = [
    // Roads (8)
    {
      code: 'FC-2026-PWD-001',
      title: 'Peripheral Ring Road Corridor Phase-II 4-Lane Widening',
      desc: 'Upgradation and four-laning of the major arterial corridor connecting Kanakapura Road to Electronic City with automated tolling plazas and grade separators.',
      deptIdx: 0,
      contractorIdx: 0,
      budget: 65000000,
      allocated: 50000000,
      released: 48000000,
      spent: 45200000,
      physProgress: 72,
      finProgress: 73.8,
      status: 'Active',
      sector: 'Roads',
      addr: 'SH-87 Corridor, Bannerghatta to Jigani',
      dist: 'Bengaluru Urban',
      state: 'Karnataka',
      lat: 12.8399,
      lng: 77.6770,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-PWD-002',
      title: 'Kabini River Bridge Replacement & Approach Elevated Viaduct',
      desc: 'Demolition of aged British-era masonry arch bridge and construction of 6-span balanced cantilever prestressed bridge with anti-scour protection.',
      deptIdx: 0,
      contractorIdx: 1,
      budget: 28000000,
      allocated: 24000000,
      released: 22000000,
      spent: 21400000,
      physProgress: 35, // Deliberate Disparity for AI Demo!
      finProgress: 78.5,
      status: 'Active',
      sector: 'Roads',
      addr: 'Nanjangud Highway over Kabini',
      dist: 'Mysuru',
      state: 'Karnataka',
      lat: 12.1197,
      lng: 76.6800,
      aiStatus: 'Review Required',
      aiReason: 'Review Required — Financial progress (78.5%) is higher than reported physical progress (35.0%).'
    },
    {
      code: 'FC-2026-PWD-003',
      title: 'Western Bypass Concrete Pavement & Stormwater Culverts',
      desc: 'Dual-carriageway rigid concrete pavement with high-capacity prefabricated culverts to prevent seasonal monsoon inundation.',
      deptIdx: 0,
      contractorIdx: 2,
      budget: 42000000,
      allocated: 35000000,
      released: 28000000,
      spent: 27100000,
      physProgress: 65,
      finProgress: 66.6,
      status: 'Active',
      sector: 'Roads',
      addr: 'Katraj Bypass Extension, Ambegaon',
      dist: 'Pune',
      state: 'Maharashtra',
      lat: 18.4574,
      lng: 73.8504,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-PWD-004',
      title: 'Smart Feeder Road & Underpass for Aerospace Tech SEZ',
      desc: 'Access road connecting airport cargo terminal to Aerospace SEZ with heavy-load pavement specifications and LED smart illumination.',
      deptIdx: 0,
      contractorIdx: 7,
      budget: 31000000,
      allocated: 31000000,
      released: 31000000,
      spent: 30850000,
      physProgress: 100,
      finProgress: 100,
      status: 'Completed',
      sector: 'Roads',
      addr: 'Devanahalli Aerospace Park Road',
      dist: 'Bengaluru Rural',
      state: 'Karnataka',
      lat: 13.2104,
      lng: 77.7123,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-PWD-005',
      title: 'Coastal Highway Resilience Asphalt Re-surfacing',
      desc: 'Polymer modified bitumen resurfacing and sea-wall rock armoring along coastal cyclone prone stretch.',
      deptIdx: 0,
      contractorIdx: 10,
      budget: 19500000,
      allocated: 12000000,
      released: 8000000,
      spent: 7600000,
      physProgress: 40,
      finProgress: 41.0,
      status: 'Active',
      sector: 'Roads',
      addr: 'NH-66 Stretch, Panambur Coast',
      dist: 'Mangaluru',
      state: 'Karnataka',
      lat: 12.9467,
      lng: 74.8021,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-PWD-006',
      title: 'Tribal Belt All-Weather Connect Road (PMGSY Stage-III)',
      desc: '14.2 km metalled all-weather road with 8 cross-drainage structures connecting isolated forest settlements to taluk hospital.',
      deptIdx: 0,
      contractorIdx: 11,
      budget: 15000000,
      allocated: 10000000,
      released: 4000000,
      spent: 3800000,
      physProgress: 25,
      finProgress: 26.6,
      status: 'Active',
      sector: 'Roads',
      addr: 'Madikeri - Somwarpet Forest Section',
      dist: 'Kodagu',
      state: 'Karnataka',
      lat: 12.4244,
      lng: 75.7382,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-PWD-007',
      title: 'Eastern Flyover Ramp & Junction Grade Separator',
      desc: 'Two-lane unidirectional rotary overbridge to de-congest busy railway level crossing and freight intersection.',
      deptIdx: 0,
      contractorIdx: 18,
      budget: 38000000,
      allocated: 30000000,
      released: 29000000,
      spent: 28500000,
      physProgress: 38, // Disparity Demo 2
      finProgress: 76.3,
      status: 'Delayed',
      sector: 'Roads',
      addr: 'Uppal Ring Junction, Medchal Highway',
      dist: 'Hyderabad',
      state: 'Telangana',
      lat: 17.4018,
      lng: 78.5602,
      aiStatus: 'Review Required',
      aiReason: 'Review Required — Financial progress (76.3%) is higher than reported physical progress (38.0%).'
    },
    {
      code: 'FC-2026-PWD-008',
      title: 'Rural Agri-Market Link Corridor Phase-I',
      desc: 'Connecting 12 agricultural produce market committees (APMC) through durable reinforced black-topped roads.',
      deptIdx: 0,
      contractorIdx: 1,
      budget: 22000000,
      allocated: 22000000,
      released: 22000000,
      spent: 21900000,
      physProgress: 100,
      finProgress: 100,
      status: 'Completed',
      sector: 'Roads',
      addr: 'Hassan APMC Corridor, B.M. Road',
      dist: 'Hassan',
      state: 'Karnataka',
      lat: 13.0033,
      lng: 76.1004,
      aiStatus: 'Normal'
    },

    // Hospitals & Healthcare (6)
    {
      code: 'FC-2026-HLT-001',
      title: '250-Bed District Super Specialty Maternal & Pediatric Hospital',
      desc: 'Modern 5-floor clinical complex with pediatric ICU, neo-natal intensive care units, 4 modular operation theaters, and medical gas pipeline system.',
      deptIdx: 1,
      contractorIdx: 4,
      budget: 58000000,
      allocated: 45000000,
      released: 40000000,
      spent: 38900000,
      physProgress: 68,
      finProgress: 68.9,
      status: 'Active',
      sector: 'Hospitals',
      addr: 'Civil Hospital Campus, Hubballi Central',
      dist: 'Dharwad',
      state: 'Karnataka',
      lat: 15.3647,
      lng: 75.1240,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-HLT-002',
      title: 'Taluk Primary Health Centre Solarization & Cold-Chain Hub',
      desc: 'Installation of uninterrupted rooftop solar micro-grids, walk-in vaccine freezers, and telemedicine communication links for 8 rural PHCs.',
      deptIdx: 1,
      contractorIdx: 6,
      budget: 12500000,
      allocated: 12500000,
      released: 12500000,
      spent: 12400000,
      physProgress: 100,
      finProgress: 100,
      status: 'Completed',
      sector: 'Hospitals',
      addr: 'Sirsi Taluk Hospital Cluster',
      dist: 'Uttara Kannada',
      state: 'Karnataka',
      lat: 14.6195,
      lng: 74.8354,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-HLT-003',
      title: 'Trauma & Emergency Care Critical Unit Wing Upgradation',
      desc: 'Construction of dedicated helipad access, emergency resuscitation bays, and 32-slice CT scanner housing with radiation shielding.',
      deptIdx: 1,
      contractorIdx: 14,
      budget: 26000000,
      allocated: 18000000,
      released: 15000000,
      spent: 14600000,
      physProgress: 55,
      finProgress: 57.6,
      status: 'Active',
      sector: 'Hospitals',
      addr: 'General Hospital Road, Tumakuru',
      dist: 'Tumakuru',
      state: 'Karnataka',
      lat: 13.3422,
      lng: 77.1017,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-HLT-004',
      title: 'Community Health Center Diagnostic Laboratory Modernization',
      desc: 'Fully automated biochemistry, pathology, and digital X-ray diagnostics facility serving rural population in Kolar gold fields basin.',
      deptIdx: 1,
      contractorIdx: 4,
      budget: 14000000,
      allocated: 14000000,
      released: 13500000,
      spent: 13100000,
      physProgress: 42, // Disparity Demo 3
      finProgress: 96.4,
      status: 'Active',
      sector: 'Hospitals',
      addr: 'Robertsonpet CHC Complex',
      dist: 'Kolar',
      state: 'Karnataka',
      lat: 12.9602,
      lng: 78.2711,
      aiStatus: 'Review Required',
      aiReason: 'Review Required — Financial progress (96.4%) is higher than reported physical progress (42.0%).'
    },
    {
      code: 'FC-2026-HLT-005',
      title: 'Dialysis Center Expansion & RO Water System Installation',
      desc: '16-station hemodialysis unit with dual-pass RO purification unit and emergency standby oxygen generation.',
      deptIdx: 1,
      contractorIdx: 14,
      budget: 9500000,
      allocated: 7000000,
      released: 4500000,
      spent: 4200000,
      physProgress: 45,
      finProgress: 47.3,
      status: 'Active',
      sector: 'Hospitals',
      addr: 'District Hospital, Mandya',
      dist: 'Mandya',
      state: 'Karnataka',
      lat: 12.5218,
      lng: 76.8951,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-HLT-006',
      title: 'Mental Health & Rehabilitation Residential Campus',
      desc: '60-bed therapeutic rehabilitation ward, counselling suites, open-air therapy gardens, and vocational training blocks.',
      deptIdx: 1,
      contractorIdx: 13,
      budget: 17500000,
      allocated: 10000000,
      released: 5000000,
      spent: 4800000,
      physProgress: 28,
      finProgress: 28.5,
      status: 'Active',
      sector: 'Hospitals',
      addr: 'NMC Campus, Shivamogga',
      dist: 'Shivamogga',
      state: 'Karnataka',
      lat: 13.9299,
      lng: 75.5681,
      aiStatus: 'Normal'
    },

    // Schools & Education (6)
    {
      code: 'FC-2026-EDU-001',
      title: 'Model Smart Secondary School & STEM Lab Construction',
      desc: 'Composite school campus with 24 digitized smart classrooms, state-of-the-art robotics laboratory, library, and solar rooftop.',
      deptIdx: 2,
      contractorIdx: 5,
      budget: 21000000,
      allocated: 18000000,
      released: 16500000,
      spent: 16100000,
      physProgress: 75,
      finProgress: 78.5,
      status: 'Active',
      sector: 'Schools',
      addr: 'Govt Model Higher Secondary Campus, Jayanagar',
      dist: 'Bengaluru South',
      state: 'Karnataka',
      lat: 12.9250,
      lng: 77.5938,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-EDU-002',
      title: 'Kasturba Gandhi Balika Vidyalaya Residential Hostel Block',
      desc: '3-storey secure residential hostel accommodating 200 girl students from disadvantaged backgrounds with dining hall and solar heaters.',
      deptIdx: 2,
      contractorIdx: 5,
      budget: 16500000,
      allocated: 16500000,
      released: 16500000,
      spent: 16300000,
      physProgress: 100,
      finProgress: 100,
      status: 'Completed',
      sector: 'Schools',
      addr: 'KGBV Campus, Chamarajanagar Bypass',
      dist: 'Chamarajanagar',
      state: 'Karnataka',
      lat: 11.9261,
      lng: 76.9437,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-EDU-003',
      title: 'Government Polytechnic Skill Center & CNC Machine Workshop',
      desc: 'Heavy mechanical workshop equipped with 5-axis CNC machines, automotive simulation testing bays, and mechatronics lab.',
      deptIdx: 2,
      contractorIdx: 8,
      budget: 24000000,
      allocated: 18000000,
      released: 12000000,
      spent: 11800000,
      physProgress: 50,
      finProgress: 50.0,
      status: 'Active',
      sector: 'Schools',
      addr: 'GPT Campus, Belagavi Industrial Road',
      dist: 'Belagavi',
      state: 'Karnataka',
      lat: 15.8497,
      lng: 74.4977,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-EDU-004',
      title: 'Rural Primary Schools Drinking Water & Sanitation Units (50 Units)',
      desc: 'Prefabricated child-friendly washrooms with handwashing stations, rainwater harvesting, and continuous running water in 50 gram panchayats.',
      deptIdx: 2,
      contractorIdx: 3,
      budget: 11000000,
      allocated: 9000000,
      released: 8500000,
      spent: 8300000,
      physProgress: 30, // Disparity Demo 4
      finProgress: 77.2,
      status: 'Active',
      sector: 'Schools',
      addr: 'Cluster Gram Panchayats, Kalaburagi North',
      dist: 'Kalaburagi',
      state: 'Karnataka',
      lat: 17.3297,
      lng: 76.8343,
      aiStatus: 'Review Required',
      aiReason: 'Review Required — Financial progress (77.2%) is higher than reported physical progress (30.0%).'
    },
    {
      code: 'FC-2026-EDU-005',
      title: 'District Central Digital Library & Competitive Exam Learning Hub',
      desc: '200-seat digital reading hall with high-speed fiber internet, Kindle book lending section, and audio-video coaching studios.',
      deptIdx: 2,
      contractorIdx: 13,
      budget: 13500000,
      allocated: 10000000,
      released: 6000000,
      spent: 5800000,
      physProgress: 44,
      finProgress: 44.4,
      status: 'Active',
      sector: 'Schools',
      addr: 'Public Gardens, Ballari',
      dist: 'Ballari',
      state: 'Karnataka',
      lat: 15.1394,
      lng: 76.9214,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-EDU-006',
      title: 'Tribal Ashram School Kitchen & Nutrition Refurbishment',
      desc: 'Steam cooking mechanized kitchen, food grains storage granary with insect barrier, and dining shed for 400 residential pupils.',
      deptIdx: 2,
      contractorIdx: 5,
      budget: 8500000,
      allocated: 8500000,
      released: 8500000,
      spent: 8400000,
      physProgress: 100,
      finProgress: 100,
      status: 'Completed',
      sector: 'Schools',
      addr: 'BR Hills Tribal Sanctuary',
      dist: 'Chamarajanagar',
      state: 'Karnataka',
      lat: 11.9934,
      lng: 77.1350,
      aiStatus: 'Normal'
    },

    // Water & Sanitation (5)
    {
      code: 'FC-2026-WTR-001',
      title: 'Jal Jeevan Multi-Village Piped Drinking Water Supply Scheme',
      desc: 'Intake well on river basin, 25 MLD water treatment plant, 140 km ductile iron transmission pipeline and household tap connections for 42 villages.',
      deptIdx: 3,
      contractorIdx: 3,
      budget: 72000000,
      allocated: 60000000,
      released: 48000000,
      spent: 46200000,
      physProgress: 66,
      finProgress: 66.6,
      status: 'Active',
      sector: 'Water',
      addr: 'Cauvery River Basin, T. Narasipura',
      dist: 'Mysuru',
      state: 'Karnataka',
      lat: 12.2120,
      lng: 76.9039,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-WTR-002',
      title: 'Tungabhadra Canal Lift Irrigation & Groundwater Recharge Ponds',
      desc: 'High-lift pump houses, HDPE rising mains, and rejuvenation of 18 cascading historical percolation tanks.',
      deptIdx: 3,
      contractorIdx: 9,
      budget: 44000000,
      allocated: 35000000,
      released: 22000000,
      spent: 21500000,
      physProgress: 49,
      finProgress: 50.0,
      status: 'Active',
      sector: 'Water',
      addr: 'Koppal Canal Distributary Sector',
      dist: 'Koppal',
      state: 'Karnataka',
      lat: 15.3456,
      lng: 76.1554,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-WTR-003',
      title: 'Urban Underground Sewage Treatment Plant (15 MLD SBR Tech)',
      desc: 'Sequential batch reactor (SBR) wastewater recycling plant producing tertiary treated water for industrial estate usage.',
      deptIdx: 3,
      contractorIdx: 15,
      budget: 39000000,
      allocated: 30000000,
      released: 28500000,
      spent: 27900000,
      physProgress: 36, // Disparity Demo 5
      finProgress: 73.0,
      status: 'Active',
      sector: 'Water',
      addr: 'Industrial Area Phase-IV, Peenya Outskirts',
      dist: 'Bengaluru Urban',
      state: 'Karnataka',
      lat: 13.0298,
      lng: 77.5186,
      aiStatus: 'Review Required',
      aiReason: 'Review Required — Financial progress (73.0%) is higher than reported physical progress (36.0%).'
    },
    {
      code: 'FC-2026-WTR-004',
      title: 'Arsenic & Fluoride Community Water Purification Units (35 Plants)',
      desc: 'Decentralized reverse osmosis + activated alumina filtration kiosks dispensing safe 20-liter drinking water cans at ₹5.',
      deptIdx: 3,
      contractorIdx: 3,
      budget: 14500000,
      allocated: 14500000,
      released: 14500000,
      spent: 14350000,
      physProgress: 100,
      finProgress: 100,
      status: 'Completed',
      sector: 'Water',
      addr: 'Bagepalli & Chintamani Taluks',
      dist: 'Chikkaballapur',
      state: 'Karnataka',
      lat: 13.7844,
      lng: 77.7944,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-WTR-005',
      title: 'Stormwater Lake De-silting & Wetland Ecological Restoration',
      desc: 'Removal of 80,000 cu.m silt, biological floating wetland construction, perimeter bund walking track, and bioswales.',
      deptIdx: 3,
      contractorIdx: 9,
      budget: 18000000,
      allocated: 12000000,
      released: 6000000,
      spent: 5700000,
      physProgress: 33,
      finProgress: 33.3,
      status: 'Active',
      sector: 'Water',
      addr: 'Varthur Lake Upstream Inflow Zone',
      dist: 'Bengaluru Urban',
      state: 'Karnataka',
      lat: 12.9406,
      lng: 77.7466,
      aiStatus: 'Normal'
    },

    // Infrastructure & Smart City (5)
    {
      code: 'FC-2026-SMT-001',
      title: 'Integrated Command & Control Center (ICCC) & AI Traffic Management',
      desc: 'Centralized municipal monitoring hub with 1,200 pan-tilt-zoom surveillance cameras, adaptive traffic signaling, and air quality telemetry.',
      deptIdx: 4,
      contractorIdx: 8,
      budget: 68000000,
      allocated: 55000000,
      released: 48000000,
      spent: 46800000,
      physProgress: 70,
      finProgress: 70.5,
      status: 'Active',
      sector: 'Infrastructure',
      addr: 'Smart City HQ, Corporation Square',
      dist: 'Bengaluru Urban',
      state: 'Karnataka',
      lat: 12.9716,
      lng: 77.5946,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-SMT-002',
      title: 'Solar Photovoltaic 25MW Floating Reservoir Array',
      desc: 'Grid-connected floating solar array installed on irrigation balancing reservoir with high-voltage step-up substation.',
      deptIdx: 5,
      contractorIdx: 6,
      budget: 85000000,
      allocated: 70000000,
      released: 55000000,
      spent: 53800000,
      physProgress: 64,
      finProgress: 64.7,
      status: 'Active',
      sector: 'Infrastructure',
      addr: 'Hemavathi Reservoir Foreshore, Gorur',
      dist: 'Hassan',
      state: 'Karnataka',
      lat: 12.8711,
      lng: 76.0528,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-SMT-003',
      title: 'Electric Bus Depot Rapid Charging Infrastructure (40 Bays)',
      desc: 'High-power 240kW DC fast-charging bays with dedicated 11kV substation and automated depot dispatch management software.',
      deptIdx: 8,
      contractorIdx: 16,
      budget: 32000000,
      allocated: 32000000,
      released: 32000000,
      spent: 31700000,
      physProgress: 100,
      finProgress: 100,
      status: 'Completed',
      sector: 'Infrastructure',
      addr: 'BMTC Central Depot-12, Shantinagar',
      dist: 'Bengaluru Urban',
      state: 'Karnataka',
      lat: 12.9554,
      lng: 77.5956,
      aiStatus: 'Normal'
    },
    {
      code: 'FC-2026-SMT-004',
      title: 'District Anganwadi Centers Modernization (120 Child Centers)',
      desc: 'Thermal insulation roofs, nutritional smart weighing pods, safe play yards, and water filters in 120 rural child care centers.',
      deptIdx: 6,
      contractorIdx: 13,
      budget: 20000000,
      allocated: 15000000,
      released: 14000000,
      spent: 13500000,
      physProgress: 41, // Disparity Demo 6
      finProgress: 70.0,
      status: 'Active',
      sector: 'Infrastructure',
      addr: 'Rural Panchayats, Vijayapura East',
      dist: 'Vijayapura',
      state: 'Karnataka',
      lat: 16.8302,
      lng: 75.7100,
      aiStatus: 'Review Required',
      aiReason: 'Review Required — Financial progress (70.0%) is higher than reported physical progress (41.0%).'
    },
    {
      code: 'FC-2026-SMT-005',
      title: 'State Agri-Tech & Biotechnology Incubation Hub',
      desc: 'Cleanroom tissue culture laboratories, IoT soil test automation benches, and co-working workspace for 60 agrigenomics startups.',
      deptIdx: 9,
      contractorIdx: 17,
      budget: 29000000,
      allocated: 20000000,
      released: 12000000,
      spent: 11400000,
      physProgress: 40,
      finProgress: 41.3,
      status: 'Active',
      sector: 'Infrastructure',
      addr: 'Biotech Innovation Park, Electronics City Phase-II',
      dist: 'Bengaluru Urban',
      state: 'Karnataka',
      lat: 12.8452,
      lng: 77.6602,
      aiStatus: 'Normal'
    }
  ];

  let totalTransactionsCount = 0;
  let currentBlockNumber = 18942000;

  for (let i = 0; i < projectsData.length; i++) {
    const p = projectsData[i];
    const dept = createdDepartments[p.deptIdx];
    const contractor = createdContractors[p.contractorIdx];
    const smartContractProjectId = i + 1;

    // Create Project
    const project = await prisma.project.create({
      data: {
        code: p.code,
        title: p.title,
        description: p.desc,
        departmentId: dept.id,
        contractorId: contractor.id,
        totalBudget: p.budget,
        allocatedFunds: p.allocated,
        releasedFunds: p.released,
        expenditure: p.spent,
        physicalProgress: p.physProgress,
        financialProgress: p.finProgress,
        status: p.status,
        sector: p.sector,
        locationAddress: p.addr,
        district: p.dist,
        state: p.state,
        locationLat: p.lat,
        locationLng: p.lng,
        targetCompletionDate: new Date('2027-03-31T00:00:00Z'),
        aiReviewStatus: p.aiStatus,
        aiReviewReason: p.aiReason || null,
        smartContractProjectId: smartContractProjectId
      }
    });

    // 1. Transaction: ProjectCreated
    const txHashProject = generateTxHash();
    currentBlockNumber += Math.floor(Math.random() * 5) + 1;
    await prisma.blockchainTransaction.create({
      data: {
        txHash: txHashProject,
        blockNumber: currentBlockNumber,
        eventType: 'ProjectCreated',
        fromAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Govt Admin
        toAddress: contractor.walletAddress || randomWallet(),
        amount: p.budget,
        projectId: project.id,
        status: 'Confirmed',
        gasUsed: 52140
      }
    });
    totalTransactionsCount++;

    // 2. Fund Allocation record & tx
    const txHashAlloc = generateTxHash();
    currentBlockNumber += Math.floor(Math.random() * 5) + 1;
    await prisma.fundAllocation.create({
      data: {
        projectId: project.id,
        amount: p.allocated,
        financialYear: '2025-2026',
        orderNumber: `GO-MS-${dept.code}-${100 + i}`,
        authorizedBy: 'Principal Secretary (Finance)',
        blockchainTxHash: txHashAlloc
      }
    });

    await prisma.blockchainTransaction.create({
      data: {
        txHash: txHashAlloc,
        blockNumber: currentBlockNumber,
        eventType: 'FundsAllocated',
        fromAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        toAddress: dept.headName,
        amount: p.allocated,
        projectId: project.id,
        status: 'Confirmed',
        gasUsed: 44100
      }
    });
    totalTransactionsCount++;

    // 3. Milestones (3 per project)
    const milestoneDefs = [
      { seq: 1, title: 'Phase 1: Mobilization, Site Survey & Foundation Substructure', weight: 30, pct: 0.3 },
      { seq: 2, title: 'Phase 2: Core Structural Works & Utility Interconnects', weight: 40, pct: 0.4 },
      { seq: 3, title: 'Phase 3: Finishing, Systems Commissioning & Handover', weight: 30, pct: 0.3 }
    ];

    for (const mDef of milestoneDefs) {
      const milestoneTarget = p.allocated * mDef.pct;
      const isPastProgress = (mDef.seq === 1 && p.physProgress >= 30) || (mDef.seq === 2 && p.physProgress >= 70);
      const isCompletedProject = p.status === 'Completed';

      let mStatus = 'Pending';
      if (isCompletedProject || (mDef.seq === 1 && p.physProgress >= 30)) {
        mStatus = 'FundsReleased';
      } else if (mDef.seq === 2 && p.physProgress >= 50) {
        mStatus = 'Approved';
      } else if (mDef.seq === 2 && p.physProgress >= 20) {
        mStatus = 'Submitted';
      }

      const evidenceHash = (mStatus !== 'Pending') ? generateDocHash(`${project.code}-M${mDef.seq}`) : null;

      const milestone = await prisma.milestone.create({
        data: {
          projectId: project.id,
          sequence: mDef.seq,
          title: mDef.title,
          description: `Detailed milestone requirements for ${project.title} covering ${mDef.title}.`,
          targetAmount: milestoneTarget,
          physicalWeightage: mDef.weight,
          status: mStatus,
          evidenceDescription: evidenceHash ? `Geotagged site inspection report & concrete core test certificate SHA-256: ${evidenceHash.substring(0, 16)}...` : null,
          evidenceDocHash: evidenceHash,
          submittedAt: evidenceHash ? new Date('2026-04-10T10:00:00Z') : null,
          approvedAt: (mStatus === 'Approved' || mStatus === 'FundsReleased') ? new Date('2026-05-15T14:30:00Z') : null,
          approvedBy: (mStatus === 'Approved' || mStatus === 'FundsReleased') ? dept.headName : null
        }
      });

      // If funds released for milestone, create FundRelease + Blockchain Transaction
      if (mStatus === 'FundsReleased') {
        const releaseTx = generateTxHash();
        currentBlockNumber += Math.floor(Math.random() * 5) + 1;
        await prisma.fundRelease.create({
          data: {
            projectId: project.id,
            milestoneId: milestone.id,
            amount: milestoneTarget * 0.95,
            authorizedBy: dept.headName,
            recipientAddress: contractor.walletAddress,
            blockchainTxHash: releaseTx,
            blockNumber: currentBlockNumber,
            status: 'Released'
          }
        });

        await prisma.blockchainTransaction.create({
          data: {
            txHash: releaseTx,
            blockNumber: currentBlockNumber,
            eventType: 'FundsReleased',
            fromAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            toAddress: contractor.walletAddress || randomWallet(),
            amount: milestoneTarget * 0.95,
            projectId: project.id,
            status: 'Confirmed',
            gasUsed: 49200
          }
        });
        totalTransactionsCount++;
      }
    }

    // 4. Expenses (2 to 3 expenses per project)
    const expenseCategories = ['Material', 'Labor', 'Machinery', 'Inspection'];
    const vendors = ['UltraTech Cement Direct', 'Tata Steel Reinforcements', 'JCB Earthmoving Fleet', 'Bureau Veritas Inspection Ltd'];

    for (let eIdx = 0; eIdx < 2; eIdx++) {
      const expAmount = Math.floor(p.spent * (0.35 + eIdx * 0.25));
      const invHash = generateDocHash(`${project.code}-EXP-${eIdx}`);
      const expTx = generateTxHash();
      currentBlockNumber += Math.floor(Math.random() * 4) + 1;

      await prisma.expense.create({
        data: {
          projectId: project.id,
          vendorName: vendors[eIdx % vendors.length],
          amount: expAmount,
          category: expenseCategories[eIdx % expenseCategories.length],
          invoiceNumber: `INV-${dept.code}-2026-${1000 + i * 10 + eIdx}`,
          invoiceDocHash: invHash,
          blockchainTxHash: expTx,
          blockNumber: currentBlockNumber,
          status: 'Recorded'
        }
      });

      await prisma.blockchainTransaction.create({
        data: {
          txHash: expTx,
          blockNumber: currentBlockNumber,
          eventType: 'ExpenseRecorded',
          fromAddress: contractor.walletAddress || randomWallet(),
          toAddress: vendors[eIdx % vendors.length],
          amount: expAmount,
          projectId: project.id,
          status: 'Confirmed',
          gasUsed: 38400
        }
      });
      totalTransactionsCount++;
    }

    // 5. Official Documents with On-Chain Hashes
    const docTypes = ['DPR', 'TenderOrder', 'MilestoneEvidence'];
    for (const dType of docTypes) {
      const docHash = generateDocHash(`${project.code}-${dType}`);
      const docTx = generateTxHash();
      currentBlockNumber += Math.floor(Math.random() * 4) + 1;

      await prisma.document.create({
        data: {
          projectId: project.id,
          docType: dType,
          title: `${dType} - Detailed Official Record for ${project.code}`,
          fileName: `${project.code.toLowerCase()}_${dType.toLowerCase()}.pdf`,
          fileHash: docHash,
          fileSize: 245000 + Math.floor(Math.random() * 500000),
          ipfsHash: generateIpfsHash(),
          uploadedBy: dept.headName,
          verifiedOnChain: true,
          blockchainTxHash: docTx,
          blockNumber: currentBlockNumber
        }
      });

      await prisma.blockchainTransaction.create({
        data: {
          txHash: docTx,
          blockNumber: currentBlockNumber,
          eventType: 'DocumentRegistered',
          fromAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
          toAddress: '0x0000000000000000000000000000000000000000',
          amount: 0,
          projectId: project.id,
          status: 'Confirmed',
          gasUsed: 31000
        }
      });
      totalTransactionsCount++;
    }

    // 6. Pre-generate Anomalies for projects with disparity
    if (p.aiStatus === 'Review Required') {
      await prisma.anomaly.create({
        data: {
          projectId: project.id,
          anomalyType: 'FinancialProgressDisparity',
          severity: 'High',
          description: p.aiReason || 'Financial progress is higher than reported physical progress.',
          confidenceScore: 0.94,
          status: 'Under Review'
        }
      });
    }
  }

  console.log(`Successfully seeded ${projectsData.length} Projects`);
  console.log(`Successfully recorded ${totalTransactionsCount} On-Chain Transactions!`);
  console.log('--- DATABASE SEED COMPLETED ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
