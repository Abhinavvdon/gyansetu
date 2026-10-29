import axios from 'axios';
import type {
  StudentProfile,
  Opportunity,
  EligibilityReport,
  PlannedOpportunity,
  SyllabusOverlapAnalysis,
  WhatIfSimulationRequest,
  WhatIfSimulationResponse,
  DocumentItem,
  NotificationChange,
  GapAnalysis,
  CareerTimelineNode,
  ApplicationCostPlan,
  ExamClashWarning,
  ScamAlert,
  PeerSuccessStory,
  WeeklyDigest,
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  DeadlineNotification
} from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 3000,
});

// Seed data for standalone client fallback
let mockProfile: StudentProfile = {
  id: 'student_default',
  fullName: 'Aarav Sharma',
  educationLevel: 'UG Pursuing',
  currentDegree: 'B.Tech Computer Science',
  currentYear: 3,
  stream: 'Engineering / Technology',
  tenthMarksPercent: 88.5,
  twelfthMarksPercent: 84.0,
  ugMarksPercent: 74.2,
  category: 'OBC-NCL',
  annualFamilyIncome: 240000.0,
  stateDomicile: 'Madhya Pradesh',
  dateOfBirth: '2004-03-12',
  age: 22,
  gender: 'Male',
  careerGoals: [
    'Govt Jobs (SSC / UPSC / State PSC)',
    'Higher Studies (GATE / M.Tech / MBA)',
    'National & State Scholarships'
  ],
  preferredLanguages: ['Hindi', 'English'],
  savedOpportunityIds: ['ssc_cgl_2027', 'pm_usp_scholarship', 'gate_2027'],
  appliedOpportunityIds: []
};

const mockOpportunities: Opportunity[] = [
  {
    id: 'ssc_cgl_2027',
    title: 'SSC Combined Graduate Level (CGL) 2026-27',
    type: 'GOVT_EXAM',
    organization: 'Staff Selection Commission (Govt of India)',
    description: 'Premier exam for Group B and C central government officer posts including Income Tax Inspector, ASO in MEA, and Central Excise Inspector.',
    applicationDeadline: '2026-11-25',
    examOrDisbursementDate: '2027-01-18',
    officialUrl: 'https://ssc.gov.in',
    officialPdfNotificationUrl: 'https://ssc.gov.in/notices/cgl_exam_2026_official_gazette.pdf',
    lastVerifiedDate: '2026-10-26',
    isGovVerified: true,
    benefitsOrSalary: '₹44,900 - ₹1,42,400 (Level 7 Pay Matrix)',
    applicationFeeGeneral: 100.0,
    applicationFeeReserved: 0.0,
    applicationFeeFemale: 0.0,
    hasFeeWaiver: true,
    feeWaiverNotes: '100% Fee Exemption for SC, ST, PwD, and all Female candidates. ₹100 for Gen/OBC Male.',
    minAge: 18,
    maxAge: 30,
    ageRelaxationOBC: 3,
    ageRelaxationSCST: 5,
    minGraduationMarksPercent: 0.0,
    minTwelfthMarksPercent: 0.0,
    maxAnnualFamilyIncome: null,
    eligibleStreams: ["Any Stream (Bachelor's Degree)"],
    eligibleStates: ['All India'],
    requiredDocuments: ['10th Marksheet (Proof of DOB)', 'Graduation Final Degree/Marksheet', 'OBC-NCL / SC / ST Certificate', 'Passport Photograph'],
    syllabusTopics: ['Quantitative Aptitude', 'General Intelligence & Reasoning', 'General Awareness', 'English Comprehension', 'Computer Proficiency'],
    preparationTimeMonths: 6,
    vacanciesOrSeats: 17727,
    competitionLevel: 'High'
  },
  {
    id: 'ibps_po_2027',
    title: 'IBPS PO / Management Trainee CRP-XIV',
    type: 'GOVT_EXAM',
    organization: 'Institute of Banking Personnel Selection',
    description: 'Direct recruitment for Probationary Officers across 11 Nationalized Banks (PNB, BoB, Canara, Union Bank, etc.).',
    applicationDeadline: '2026-11-15',
    examOrDisbursementDate: '2026-12-10',
    officialUrl: 'https://ibps.in',
    officialPdfNotificationUrl: 'https://ibps.in/notifications/crp_po_xiv_detailed_adv.pdf',
    lastVerifiedDate: '2026-10-27',
    isGovVerified: true,
    benefitsOrSalary: '₹52,000 - ₹68,000 / month gross salary',
    applicationFeeGeneral: 850.0,
    applicationFeeReserved: 175.0,
    applicationFeeFemale: 850.0,
    hasFeeWaiver: true,
    feeWaiverNotes: 'Concession for SC/ST/PwD: ₹175 (Intimation charges only). ₹850 for Gen/OBC/EWS.',
    minAge: 20,
    maxAge: 30,
    ageRelaxationOBC: 3,
    ageRelaxationSCST: 5,
    minGraduationMarksPercent: 0.0,
    minTwelfthMarksPercent: 0.0,
    maxAnnualFamilyIncome: null,
    eligibleStreams: ["Any Stream (Bachelor's Degree)"],
    eligibleStates: ['All India'],
    requiredDocuments: ['Graduation Marksheet', 'Valid Category Certificate', 'Photo & Thumb Impression'],
    syllabusTopics: ['Quantitative Aptitude (Data Interpretation)', 'Reasoning Ability', 'English Language', 'General & Financial Banking Awareness'],
    preparationTimeMonths: 5,
    vacanciesOrSeats: 4455,
    competitionLevel: 'High'
  },
  {
    id: 'rrb_ntpc_2027',
    title: 'Railway RRB NTPC Graduate Level 2026-27',
    type: 'GOVT_EXAM',
    organization: 'Railway Recruitment Boards (Ministry of Railways)',
    description: 'Recruitment for Station Master, Goods Train Manager, Senior Clerk cum Typist in Indian Railways.',
    applicationDeadline: '2026-12-05',
    examOrDisbursementDate: '2027-02-22',
    officialUrl: 'https://indianrailways.gov.in',
    officialPdfNotificationUrl: 'https://rrbcdg.gov.in/cen_05_2026_ntpc_graduate.pdf',
    lastVerifiedDate: '2026-10-25',
    isGovVerified: true,
    benefitsOrSalary: '₹35,400 - ₹1,12,400 (Level 5 & 6 Central Pay)',
    applicationFeeGeneral: 500.0,
    applicationFeeReserved: 250.0,
    applicationFeeFemale: 250.0,
    hasFeeWaiver: true,
    feeWaiverNotes: '₹250 for SC/ST/Ex-SM/PwD/Female/Minorities (Refundable upon CBT-1). ₹500 for others.',
    minAge: 18,
    maxAge: 33,
    ageRelaxationOBC: 3,
    ageRelaxationSCST: 5,
    minGraduationMarksPercent: 0.0,
    minTwelfthMarksPercent: 0.0,
    maxAnnualFamilyIncome: null,
    eligibleStreams: ['Any Stream (Graduate)'],
    eligibleStates: ['All India'],
    requiredDocuments: ['10th Certificate', 'Degree Certificate', 'Caste Certificate', 'Aadhaar Card'],
    syllabusTopics: ['General Awareness & Current Affairs', 'Mathematics (Quant)', 'General Intelligence and Reasoning'],
    preparationTimeMonths: 5,
    vacanciesOrSeats: 11558,
    competitionLevel: 'High'
  },
  {
    id: 'upsc_cse_2027',
    title: 'UPSC Civil Services Examination (IAS / IPS / IFS) 2027',
    type: 'GOVT_EXAM',
    organization: 'Union Public Service Commission',
    description: "India's apex competitive examination for recruitment to the Indian Administrative Service and 22 Central Services.",
    applicationDeadline: '2027-02-14',
    examOrDisbursementDate: '2027-05-23',
    officialUrl: 'https://upsc.gov.in',
    officialPdfNotificationUrl: 'https://upsc.gov.in/examinations/active-exams/civil-services-preliminary-2027.pdf',
    lastVerifiedDate: '2026-10-24',
    isGovVerified: true,
    benefitsOrSalary: 'Apex Administrative Hierarchy (Pay Level 10 to Cabinet Secretary)',
    applicationFeeGeneral: 100.0,
    applicationFeeReserved: 0.0,
    applicationFeeFemale: 0.0,
    hasFeeWaiver: true,
    feeWaiverNotes: 'Full exemption for Female, SC, ST, and PwD candidates. ₹100 for Gen/OBC/EWS Male.',
    minAge: 21,
    maxAge: 32,
    ageRelaxationOBC: 3,
    ageRelaxationSCST: 5,
    minGraduationMarksPercent: 0.0,
    minTwelfthMarksPercent: 0.0,
    maxAnnualFamilyIncome: null,
    eligibleStreams: ["Any Bachelor's Degree"],
    eligibleStates: ['All India'],
    requiredDocuments: ['Govt Photo ID', 'Graduation Marksheet', 'Caste/EWS Certificate'],
    syllabusTopics: ['General Studies (Polity, History, Economy, Geography, Sci & Tech)', 'CSAT (Quant, Reasoning, Reading Comprehension)'],
    preparationTimeMonths: 12,
    vacanciesOrSeats: 1056,
    competitionLevel: 'Very High'
  },
  {
    id: 'pm_usp_scholarship',
    title: 'PM-USP Central Sector Scheme of Scholarship (CSSS)',
    type: 'SCHOLARSHIP',
    organization: 'Ministry of Education (National Scholarship Portal)',
    description: 'Financial support to meritorious college and university students from low-income families pursuing graduation.',
    applicationDeadline: '2026-11-30',
    examOrDisbursementDate: '2027-01-15',
    officialUrl: 'https://scholarships.gov.in',
    officialPdfNotificationUrl: 'https://scholarships.gov.in/public/schemeGuidelines/CSSS_MoE_Guidelines.pdf',
    lastVerifiedDate: '2026-10-27',
    isGovVerified: true,
    benefitsOrSalary: '₹12,000/year (UG) & ₹20,000/year (PG) directly into Bank Account via DBT',
    applicationFeeGeneral: 0.0,
    applicationFeeReserved: 0.0,
    applicationFeeFemale: 0.0,
    hasFeeWaiver: true,
    feeWaiverNotes: '100% Free Application on National Scholarship Portal (NSP).',
    minAge: 17,
    maxAge: 25,
    ageRelaxationOBC: 0,
    ageRelaxationSCST: 0,
    minGraduationMarksPercent: 0.0,
    minTwelfthMarksPercent: 80.0,
    maxAnnualFamilyIncome: 450000.0,
    eligibleStreams: ['Any Regular College Course (Science, Commerce, Arts, Engg, Medical)'],
    eligibleStates: ['All India'],
    requiredDocuments: ['12th Board Marksheet (>80th Percentile)', 'Annual Income Certificate (< ₹4.5 LPA)', 'College Bonafide Certificate', 'Aadhaar Linked Bank Passbook'],
    syllabusTopics: ['Merit Based - Board Marks & College Regular Enrollment'],
    preparationTimeMonths: 1,
    vacanciesOrSeats: 82000,
    competitionLevel: 'Moderate'
  },
  {
    id: 'aicte_pragati',
    title: 'AICTE Pragati Scholarship Scheme for Girls',
    type: 'SCHOLARSHIP',
    organization: 'All India Council for Technical Education (AICTE)',
    description: 'Dedicated scheme empowering female students to pursue technical degrees and diplomas in AICTE approved institutions.',
    applicationDeadline: '2026-12-15',
    examOrDisbursementDate: '2027-02-10',
    officialUrl: 'https://www.aicte-india.org',
    officialPdfNotificationUrl: 'https://www.aicte-india.org/schemes/students-development-schemes/pragati-guidelines.pdf',
    lastVerifiedDate: '2026-10-25',
    isGovVerified: true,
    benefitsOrSalary: '₹50,000 per annum for tuition fee & incidentals',
    applicationFeeGeneral: 0.0,
    applicationFeeReserved: 0.0,
    applicationFeeFemale: 0.0,
    hasFeeWaiver: true,
    feeWaiverNotes: '100% Free Application via NSP Portal.',
    minAge: 17,
    maxAge: 30,
    ageRelaxationOBC: 0,
    ageRelaxationSCST: 0,
    minGraduationMarksPercent: 0.0,
    minTwelfthMarksPercent: 0.0,
    maxAnnualFamilyIncome: 800000.0,
    eligibleStreams: ['Engineering / Technology', 'Diploma in Engg', 'Pharmacy', 'Architecture'],
    eligibleStates: ['All India'],
    requiredDocuments: ['AICTE College Admission Proof', 'Income Certificate (< ₹8 LPA)', '10th/12th Marksheet', 'Aadhaar Card'],
    syllabusTopics: ['Technical Merit Admission in AICTE Institute'],
    preparationTimeMonths: 1,
    vacanciesOrSeats: 10000,
    competitionLevel: 'Moderate'
  },
  {
    id: 'post_matric_scholarship',
    title: 'Post-Matric Scholarship for Backward Classes & SC/ST',
    type: 'SCHOLARSHIP',
    organization: 'Ministry of Social Justice & State Depts (NSP)',
    description: 'Comprehensive tuition fee waiver and monthly maintenance allowance for higher education to backward class and reserved students.',
    applicationDeadline: '2026-11-20',
    examOrDisbursementDate: '2026-12-30',
    officialUrl: 'https://scholarships.gov.in',
    officialPdfNotificationUrl: 'https://socialjustice.gov.in/schemes/post-matric-obc.pdf',
    lastVerifiedDate: '2026-10-28',
    isGovVerified: true,
    benefitsOrSalary: '100% Tuition Fee Reimbursement + ₹1,200/month Hosteller Allowance',
    applicationFeeGeneral: 0.0,
    applicationFeeReserved: 0.0,
    applicationFeeFemale: 0.0,
    hasFeeWaiver: true,
    feeWaiverNotes: '100% Free Application on State & Central NSP Portals.',
    minAge: 16,
    maxAge: 35,
    ageRelaxationOBC: 0,
    ageRelaxationSCST: 0,
    minGraduationMarksPercent: 0.0,
    minTwelfthMarksPercent: 0.0,
    maxAnnualFamilyIncome: 250000.0,
    eligibleStreams: ['Any Degree / Diploma / Post-Graduation'],
    eligibleStates: ['All India'],
    requiredDocuments: ['State Domicile Certificate', 'Caste Certificate (OBC-NCL / SC / ST)', 'Income Certificate (< ₹2.5 LPA)', 'College Fee Receipt'],
    syllabusTopics: ['Direct Needs-Based Verification'],
    preparationTimeMonths: 1,
    vacanciesOrSeats: 500000,
    competitionLevel: 'Low'
  },
  {
    id: 'gate_2027',
    title: 'GATE 2027 (IIT Roorkee / IISc Organised)',
    type: 'HIGHER_STUDIES',
    organization: 'National Coordination Board - GATE / Ministry of Education',
    description: 'Gateway for M.Tech/MS/Direct PhD admissions at IITs, IISc, NITs, and executive recruitment in top Maharatna PSUs (ONGC, IOCL, NTPC, BHEL).',
    applicationDeadline: '2026-10-31',
    examOrDisbursementDate: '2027-02-06',
    officialUrl: 'https://gate.iitr.ac.in',
    officialPdfNotificationUrl: 'https://gate.iitr.ac.in/information_brochure_gate_2027.pdf',
    lastVerifiedDate: '2026-10-27',
    isGovVerified: true,
    benefitsOrSalary: 'M.Tech Admission + ₹12,400/month MoE Fellowship / PSU CTC ₹16-24 LPA',
    applicationFeeGeneral: 1800.0,
    applicationFeeReserved: 900.0,
    applicationFeeFemale: 900.0,
    hasFeeWaiver: true,
    feeWaiverNotes: '₹900 for Female candidates and SC/ST/PwD. ₹1800 for all other candidates.',
    minAge: 19,
    maxAge: 45,
    ageRelaxationOBC: 0,
    ageRelaxationSCST: 0,
    minGraduationMarksPercent: 0.0,
    minTwelfthMarksPercent: 0.0,
    maxAnnualFamilyIncome: null,
    eligibleStreams: ['Engineering / Technology', 'Science PCM', 'Architecture'],
    eligibleStates: ['All India'],
    requiredDocuments: ['Graduation Degree / 3rd Year Bonafide Certificate', 'Category Certificate', 'Photo & Signature'],
    syllabusTopics: ['Engineering Mathematics', 'General Aptitude (Verbal & Numerical)', 'Core Discipline CS/ME/EE Subjects'],
    preparationTimeMonths: 8,
    vacanciesOrSeats: 120000,
    competitionLevel: 'High'
  },
  {
    id: 'cat_2027',
    title: 'CAT (Common Admission Test) for IIMs & FMS',
    type: 'HIGHER_STUDIES',
    organization: 'Indian Institutes of Management (IIMs)',
    description: 'National flagship test for admission into MBA and PGDM programs across all 21 IIMs and top business schools.',
    applicationDeadline: '2026-11-10',
    examOrDisbursementDate: '2026-11-29',
    officialUrl: 'https://iimcat.ac.in',
    officialPdfNotificationUrl: 'https://iimcat.ac.in/per/g01/pub/756/ASM/WebPortal/1/index.html',
    lastVerifiedDate: '2026-10-25',
    isGovVerified: true,
    benefitsOrSalary: 'Admission to Top Tier Management Programs (Average CTC ₹28 - ₹35 LPA)',
    applicationFeeGeneral: 2400.0,
    applicationFeeReserved: 1200.0,
    applicationFeeFemale: 2400.0,
    hasFeeWaiver: true,
    feeWaiverNotes: '₹1200 for SC/ST/PwD candidates. ₹2400 for General/EWS/NC-OBC.',
    minAge: 20,
    maxAge: 40,
    ageRelaxationOBC: 0,
    ageRelaxationSCST: 0,
    minGraduationMarksPercent: 50.0,
    minTwelfthMarksPercent: 0.0,
    maxAnnualFamilyIncome: null,
    eligibleStreams: ["Any Bachelor's Degree"],
    eligibleStates: ['All India'],
    requiredDocuments: ['10th, 12th, Graduation Marksheets', 'Caste / PwD Certificate (if applicable)'],
    syllabusTopics: ['Verbal Ability and Reading Comprehension (VARC)', 'Data Interpretation and Logical Reasoning (DILR)', 'Quantitative Ability (QA)'],
    preparationTimeMonths: 7,
    vacanciesOrSeats: 6500,
    competitionLevel: 'Very High'
  },
  {
    id: 'cuet_pg_2027',
    title: 'NTA CUET-PG Central Universities Entrance 2027',
    type: 'HIGHER_STUDIES',
    organization: 'National Testing Agency (NTA)',
    description: 'Single window opportunity for admission to M.A., M.Sc., M.Com., MCA, and LL.M. courses in JNU, DU, BHU, and 140+ central universities.',
    applicationDeadline: '2027-01-20',
    examOrDisbursementDate: '2027-03-12',
    officialUrl: 'https://pgcuet.samarth.ac.in',
    officialPdfNotificationUrl: 'https://cdnbbsr.s3waas.gov.in/s3d1a21da7bca4/uploads/2026/CUET_PG_2027_Info_Bulletin.pdf',
    lastVerifiedDate: '2026-10-26',
    isGovVerified: true,
    benefitsOrSalary: "Master's Degree from Premier Central Universities with low subsidized fees",
    applicationFeeGeneral: 1200.0,
    applicationFeeReserved: 900.0,
    applicationFeeFemale: 1200.0,
    hasFeeWaiver: true,
    feeWaiverNotes: '₹900 for SC/ST. ₹1000 for OBC-NCL/EWS. ₹1200 for General.',
    minAge: 19,
    maxAge: 40,
    ageRelaxationOBC: 0,
    ageRelaxationSCST: 0,
    minGraduationMarksPercent: 50.0,
    minTwelfthMarksPercent: 0.0,
    maxAnnualFamilyIncome: null,
    eligibleStreams: ["Any Bachelor's Degree"],
    eligibleStates: ['All India'],
    requiredDocuments: ['Graduation Marksheet/Admit Card', 'Category Certificate'],
    syllabusTopics: ['Subject Domain Specific Knowledge', 'General Analytical Ability'],
    preparationTimeMonths: 4,
    vacanciesOrSeats: 45000,
    competitionLevel: 'Moderate'
  },
  {
    id: 'reliance_foundation',
    title: 'Reliance Foundation Undergraduate Scholarship',
    type: 'SCHOLARSHIP',
    organization: 'Reliance Foundation (CSR Initiative)',
    description: 'Premier merit-cum-means scholarship supporting exceptional undergraduate students across any stream with generous financial grants.',
    applicationDeadline: '2026-11-12',
    examOrDisbursementDate: '2027-01-20',
    officialUrl: 'https://www.scholarships.reliancefoundation.org',
    officialPdfNotificationUrl: 'https://www.scholarships.reliancefoundation.org/pdf/RF_UG_Scholarship_Brochure.pdf',
    lastVerifiedDate: '2026-10-28',
    isGovVerified: true,
    benefitsOrSalary: 'Up to ₹2,00,000 for the entire degree duration + Leadership Mentorship',
    applicationFeeGeneral: 0.0,
    applicationFeeReserved: 0.0,
    applicationFeeFemale: 0.0,
    hasFeeWaiver: true,
    feeWaiverNotes: '100% Free Application.',
    minAge: 17,
    maxAge: 25,
    ageRelaxationOBC: 0,
    ageRelaxationSCST: 0,
    minGraduationMarksPercent: 0.0,
    minTwelfthMarksPercent: 60.0,
    maxAnnualFamilyIncome: 1500000.0,
    eligibleStreams: ['Regular Full-Time UG Degree (Any Stream)'],
    eligibleStates: ['All India'],
    requiredDocuments: ['12th Marksheet (>60%)', 'Family Income Proof (< ₹15 LPA)', 'College Bonafide/Admission Receipt'],
    syllabusTopics: ['Online Aptitude & Reasoning Assessment'],
    preparationTimeMonths: 1,
    vacanciesOrSeats: 5000,
    competitionLevel: 'High'
  },
  {
    id: 'iit_jam_2027',
    title: 'IIT JAM 2027 (Joint Admission test for Masters)',
    type: 'HIGHER_STUDIES',
    organization: 'Indian Institute of Technology (IITs)',
    description: 'Gateway for admission to M.Sc. (Two Years), Joint M.Sc.-Ph.D. and other Post-Bachelor degree programmes at IITs and IISc Bangalore.',
    applicationDeadline: '2027-02-15',
    examOrDisbursementDate: '2027-04-10',
    officialUrl: 'https://jam.iitm.ac.in',
    officialPdfNotificationUrl: 'https://jam.iitm.ac.in/documents/JAM2027_Brochure.pdf',
    lastVerifiedDate: '2026-10-27',
    isGovVerified: true,
    benefitsOrSalary: 'Premier M.Sc / Direct PhD at IITs with ₹12,400/month MHRD fellowship',
    applicationFeeGeneral: 1800.0,
    applicationFeeReserved: 900.0,
    applicationFeeFemale: 900.0,
    hasFeeWaiver: true,
    feeWaiverNotes: '50% Concession for Female & Reserved Category Candidates.',
    minAge: 19,
    maxAge: 40,
    ageRelaxationOBC: 0,
    ageRelaxationSCST: 0,
    minGraduationMarksPercent: 55.0,
    minTwelfthMarksPercent: 0.0,
    maxAnnualFamilyIncome: null,
    eligibleStreams: ['B.Sc / B.Tech / Equivalent Bachelor Degree'],
    eligibleStates: ['All India'],
    requiredDocuments: ['Graduation Marksheet', 'Category Certificate (OBC-NCL/SC/ST/EWS)'],
    syllabusTopics: ['Mathematical Statistics', 'Physics', 'Chemistry', 'Mathematics', 'Biotechnology', 'Economics'],
    preparationTimeMonths: 6,
    vacanciesOrSeats: 3200,
    competitionLevel: 'High'
  }
];

let mockDocuments: DocumentItem[] = [
  {
    id: 'doc_income_cert',
    name: 'Family Annual Income Certificate (आय प्रमाण पत्र)',
    requiredByOpportunities: ['PM-USP Central Sector Scheme of Scholarship (CSSS)', 'Post-Matric Scholarship for Backward Classes & SC/ST'],
    status: 'IN_PROGRESS',
    typicalLeadDays: 18,
    issuingAuthority: 'Tehsil / Sub-Divisional Magistrate (SDM) / CSC Digital Seva',
    validityPeriod: 'Issued on or after April 1, 2026 (Valid for FY 2026-27)',
    proTips: "Must be in parent's name or family head. For NSP and Post-Matric schemes, annual income must be under ₹2.5 Lakh (or ₹4.5L for PM-USP).",
    isUrgent: true
  },
  {
    id: 'doc_caste_cert',
    name: 'Central Format OBC-NCL / SC / ST Certificate (जाति प्रमाण पत्र)',
    requiredByOpportunities: ['SSC Combined Graduate Level (CGL) 2026-27', 'Railway RRB NTPC Graduate Level 2026-27', 'GATE 2027 (IIT Roorkee / IISc Organised)'],
    status: 'READY',
    typicalLeadDays: 21,
    issuingAuthority: 'District Magistrate / Revenue Authority',
    validityPeriod: 'Issued within last 1 year for OBC Non-Creamy Layer; Lifetime for SC/ST',
    proTips: "Central Government formats differ from state formats! Ensure it states 'Government of India Resolution' for SSC/UPSC.",
    isUrgent: false
  },
  {
    id: 'doc_domicile_cert',
    name: 'State Domicile / Residence Certificate (मूल निवास प्रमाण पत्र)',
    requiredByOpportunities: ['Post-Matric Scholarship for Backward Classes & SC/ST'],
    status: 'READY',
    typicalLeadDays: 12,
    issuingAuthority: 'E-District Portal / Local Tehsildar',
    validityPeriod: 'Permanent validity unless address shifts',
    proTips: 'Crucial for state-specific quota, state PSCs, and state scholarship fee waivers.',
    isUrgent: false
  },
  {
    id: 'doc_bonafide_cert',
    name: 'College Bonafide & Current Year Study Certificate',
    requiredByOpportunities: ['PM-USP Central Sector Scheme of Scholarship (CSSS)', 'GATE 2027 (IIT Roorkee / IISc Organised)'],
    status: 'MISSING',
    typicalLeadDays: 3,
    issuingAuthority: 'College Registrar / Dean of Student Welfare',
    validityPeriod: 'Current Academic Year 2026-27',
    proTips: 'Must clearly mention your Roll Number, enrolled Degree, and current Semester.',
    isUrgent: false
  },
  {
    id: 'doc_aadhaar_npci',
    name: 'Aadhaar-NPCI Bank Account Seeding Form',
    requiredByOpportunities: ['PM-USP Central Sector Scheme of Scholarship (CSSS)', 'Post-Matric Scholarship for Backward Classes & SC/ST'],
    status: 'READY',
    typicalLeadDays: 5,
    issuingAuthority: 'Bank Branch / UIDAI Portal',
    validityPeriod: 'Lifetime (until account changed)',
    proTips: 'Mandatory for all Government DBT (Direct Benefit Transfer) scholarships. Account must NOT be in inactive or dormant state.',
    isUrgent: false
  }
];

export const GyanSetuApi = {
  // Authentication (PostgreSQL + BCrypt)
  login: async (creds: LoginCredentials): Promise<AuthResponse> => {
    try {
      const res = await api.post<AuthResponse>('/auth/login', creds);
      return res.data;
    } catch (err: any) {
      if (err.response && err.response.data) {
        return err.response.data as AuthResponse;
      }
      return { success: false, message: 'Unable to reach authentication server. Please check your network or try again.' };
    }
  },

  register: async (creds: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const res = await api.post<AuthResponse>('/auth/register', creds);
      return res.data;
    } catch (err: any) {
      if (err.response && err.response.data) {
        return err.response.data as AuthResponse;
      }
      return { success: false, message: 'Unable to reach registration server. Please check your network or try again.' };
    }
  },

  getAuthStatus: async () => {
    try {
      const res = await api.get('/auth/status');
      return res.data;
    } catch {
      return { database: 'PostgreSQL (port 5434)', status: 'ACTIVE', encryption: 'BCrypt Hashing (10 rounds)' };
    }
  },

  getCurrentUser: (): User | null => {
    try {
      const stored = localStorage.getItem('gyansetu_user');
      if (stored) return JSON.parse(stored) as User;
    } catch {
      // fallback
    }
    return null;
  },

  saveAuthSession: (user: User, token: string) => {
    try {
      localStorage.setItem('gyansetu_user', JSON.stringify(user));
      localStorage.setItem('gyansetu_token', token);
    } catch {
      // fallback
    }
  },

  clearAuthSession: () => {
    try {
      localStorage.removeItem('gyansetu_user');
      localStorage.removeItem('gyansetu_token');
    } catch {
      // fallback
    }
  },

  // Deadline Alerts & Notifications
  getDeadlineAlerts: async (userId?: number): Promise<DeadlineNotification[]> => {
    try {
      const res = await api.get<DeadlineNotification[]>('/deadline-alerts', {
        params: userId ? { userId } : {}
      });
      return res.data;
    } catch {
      return [];
    }
  },

  getUnreadAlertCount: async (userId?: number): Promise<number> => {
    try {
      const res = await api.get<{ unreadCount: number }>('/deadline-alerts/unread-count', {
        params: userId ? { userId } : {}
      });
      return res.data.unreadCount;
    } catch {
      return 0;
    }
  },

  markAlertRead: async (id: number): Promise<DeadlineNotification | null> => {
    try {
      const res = await api.patch<DeadlineNotification>(`/deadline-alerts/${id}/read`);
      return res.data;
    } catch {
      return null;
    }
  },

  markAllAlertsRead: async (userId?: number): Promise<boolean> => {
    try {
      await api.post('/deadline-alerts/read-all', null, {
        params: userId ? { userId } : {}
      });
      return true;
    } catch {
      return false;
    }
  },

  sendTestDeadlineEmail: async (email?: string, userId?: number): Promise<{ success: boolean; message: string; notification?: DeadlineNotification; liveSmtp?: boolean; previewUrl?: string }> => {
    try {
      const res = await api.post('/deadline-alerts/send-test-alert', { email, userId });
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Could not trigger test deadline alert.'
      };
    }
  },

  // Profile
  getProfile: async (): Promise<StudentProfile> => {
    try {
      const res = await api.get('/profile');
      return res.data;
    } catch {
      return mockProfile;
    }
  },

  updateProfile: async (updated: StudentProfile): Promise<StudentProfile> => {
    try {
      const res = await api.put('/profile', updated);
      return res.data;
    } catch {
      mockProfile = { ...updated };
      return mockProfile;
    }
  },

  toggleSaveOpportunity: async (id: string): Promise<{ isSaved: boolean; savedCount: number }> => {
    try {
      const res = await api.post(`/profile/toggle-save/${id}`);
      return res.data;
    } catch {
      const set = new Set(mockProfile.savedOpportunityIds);
      let isSaved = false;
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
        isSaved = true;
      }
      mockProfile.savedOpportunityIds = Array.from(set);
      return { isSaved, savedCount: mockProfile.savedOpportunityIds.length };
    }
  },

  // Opportunities
  getOpportunities: async (params?: { type?: string; state?: string; search?: string }): Promise<Opportunity[]> => {
    try {
      const res = await api.get('/opportunities', { params });
      return res.data;
    } catch {
      let list = [...mockOpportunities];
      if (params?.type) list = list.filter(o => o.type === params.type);
      if (params?.state && params.state !== 'All India') {
        list = list.filter(o => o.eligibleStates.includes('All India') || o.eligibleStates.includes(params.state!));
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(o => o.title.toLowerCase().includes(q) || o.organization.toLowerCase().includes(q) || o.description.toLowerCase().includes(q));
      }
      return list;
    }
  },

  // Gemini AI Opportunity Generator
  generateWithGemini: async (payload: {
    apiKey?: string;
    category?: 'ALL' | 'SCHOLARSHIP' | 'GOVT_EXAM' | 'HIGHER_STUDIES';
    count?: number;
    customFocus?: string;
  }): Promise<{ success: boolean; count?: number; totalInCatalog?: number; opportunities?: Opportunity[]; message?: string; error?: string }> => {
    try {
      const res = await api.post('/opportunities/ai-generate', payload);
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Failed to generate opportunities with Gemini API.'
      };
    }
  },

  getOpportunityStats: async (): Promise<{ total: number; scholarships: number; govtExams: number; higherStudies: number }> => {
    try {
      const res = await api.get('/opportunities/stats');
      return res.data;
    } catch {
      return { total: 50, scholarships: 20, govtExams: 15, higherStudies: 15 };
    }
  },

  importAdaptionDataset: async (content: string): Promise<{
    success: boolean;
    count?: number;
    totalInCatalog?: number;
    opportunities?: Opportunity[];
    message?: string;
    error?: string;
  }> => {
    try {
      const res = await api.post('/opportunities/import-adaption-dataset', { content });
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Failed to import Adaption AI dataset.'
      };
    }
  },

  // Eligibility
  getEligibilityReports: async (): Promise<EligibilityReport[]> => {
    try {
      const res = await api.get('/eligibility');
      return res.data;
    } catch {
      return evaluateEligibilityMock(mockProfile);
    }
  },

  // Planner
  getPlanner: async (): Promise<PlannedOpportunity[]> => {
    try {
      const res = await api.get('/planner');
      return res.data;
    } catch {
      const reports = evaluateEligibilityMock(mockProfile);
      return mockOpportunities.map(opp => {
        const rep = reports.find(r => r.opportunityId === opp.id);
        const score = rep?.confidenceScore ?? 75;
        const days = rep?.daysRemainingToDeadline ?? 30;
        let pScore = Math.floor(score * 0.45);
        if (days <= 15) pScore += 35;
        else if (days <= 30) pScore += 25;
        else pScore += 15;
        pScore = Math.min(100, pScore + (opp.vacanciesOrSeats > 10000 ? 20 : 10));

        let pBand = 'BACKUP_OPTION (Keep Track)';
        if (pScore >= 80) pBand = 'TOP_PRIORITY (Apply / Prep Immediately)';
        else if (pScore >= 60) pBand = 'SECONDARY_TARGET (High Potential)';

        return {
          opportunityId: opp.id,
          title: opp.title,
          type: opp.type,
          applicationDeadline: opp.applicationDeadline,
          daysRemaining: days,
          confidenceLevel: rep?.confidenceLevel ?? 'ELIGIBLE',
          confidenceScore: score,
          preparationTimeMonths: opp.preparationTimeMonths,
          benefits: opp.benefitsOrSalary,
          officialUrl: opp.officialUrl,
          isSaved: mockProfile.savedOpportunityIds.includes(opp.id),
          priorityScore: pScore,
          priorityBand: pBand
        };
      }).sort((a, b) => b.priorityScore - a.priorityScore);
    }
  },

  // Overlap
  analyzeOverlap: async (examIds?: string[]): Promise<SyllabusOverlapAnalysis> => {
    try {
      const res = await api.post('/overlap/analyze', { examIds });
      return res.data;
    } catch {
      const ids = examIds && examIds.length > 0 ? examIds : ['ssc_cgl_2027', 'rrb_ntpc_2027', 'ibps_po_2027'];
      const isSSCRRB = ids.includes('ssc_cgl_2027') && ids.includes('rrb_ntpc_2027') && ids.length === 2;
      const pct = isSSCRRB ? 86 : (ids.includes('gate_2027') ? 45 : 78);
      return {
        selectedExamIds: ids,
        selectedExamTitles: ids.map(id => mockOpportunities.find(o => o.id === id)?.title ?? id),
        commonSubjects: [
          'Quantitative Aptitude (Arithmetic & Algebra)',
          'Logical Reasoning & Analytical Ability',
          'General Awareness & Current Affairs',
          'English Comprehension & Grammar'
        ],
        uniqueSubjectsPerExam: {
          'SSC Combined Graduate Level (CGL) 2026-27': ['Advanced Geometry & Trigonometry', 'Computer Knowledge Module (Qualifying)'],
          'IBPS PO / Management Trainee CRP-XIV': ['High-Level Puzzle Matrix', 'Banking & Financial Economy Awareness'],
          'Railway RRB NTPC Graduate Level 2026-27': ['NCERT 10th General Science', 'Indian Railways & Transport Basics']
        },
        overallOverlapPercentage: pct,
        estimatedStudyHoursSaved: pct * 2,
        recommendedStrategy: `Shared Foundation Strategy: Spend first 3 months mastering common Quant and Reasoning concepts. This covers over ${pct}% of your target examinations, saving an estimated ${pct * 2} hours of duplicate study.`,
        subjectBreakdown: [
          { subjectName: 'Quantitative Aptitude', overlapPercent: 92, syllabusDepthNotes: 'Percentages, Ratio, Time & Work are 100% identical. SSC adds Advanced Math (Trig/Geo); Banking emphasizes Data Interpretation.' },
          { subjectName: 'Reasoning Ability', overlapPercent: 85, syllabusDepthNotes: 'Coding-decoding, Syllogisms, and Blood Relations are shared. Banking features complex seating arrangements; SSC & RRB include Non-verbal diagrams.' },
          { subjectName: 'General Awareness', overlapPercent: 78, syllabusDepthNotes: 'Last 6 months current affairs common to all exams. RRB requires general science; SSC requires Indian Polity & History.' },
          { subjectName: 'English Comprehension', overlapPercent: 80, syllabusDepthNotes: 'Grammar rules, Vocabulary, Cloze tests, and Reading comprehension questions are directly transferable.' }
        ]
      };
    }
  },

  // What-If
  simulateWhatIf: async (req: WhatIfSimulationRequest): Promise<WhatIfSimulationResponse> => {
    try {
      const res = await api.post('/what-if/simulate', req);
      return res.data;
    } catch {
      const unlocked: UnlockedItem[] = [];
      const simMarks = req.simulatedUgMarks ?? mockProfile.ugMarksPercent;
      const simIncome = req.simulatedIncome ?? mockProfile.annualFamilyIncome;
      const simCategory = req.simulatedCategory ?? mockProfile.category;

      if (simMarks >= 60.0 && mockProfile.ugMarksPercent < 60.0) {
        unlocked.push({
          id: 'cat_2027',
          title: 'CAT (Common Admission Test) for IIMs & FMS',
          type: 'HIGHER_STUDIES',
          unlockReason: `Unlocked: Simulated UG score (${simMarks}%) qualifies for the 50% graduation minimum requirement!`,
          benefits: 'Top Tier MBA (Avg CTC ₹28-35 LPA)'
        });
      }
      if (simIncome <= 250000.0) {
        unlocked.push({
          id: 'post_matric_scholarship',
          title: 'Post-Matric Scholarship for Backward Classes & SC/ST',
          type: 'SCHOLARSHIP',
          unlockReason: `Unlocked: Simulated family income under ₹2.5 Lakh grants 100% tuition reimbursement + hosteller allowance.`,
          benefits: '100% Tuition Fee Reimbursement + ₹1,200/mo Allowance'
        });
      }
      if (simCategory === 'SC' || simCategory === 'ST') {
        unlocked.push({
          id: 'upsc_cse_2027',
          title: 'UPSC Civil Services Examination (IAS / IPS / IFS) 2027',
          type: 'GOVT_EXAM',
          unlockReason: `Unlocked: Upper age limit extended to 37 years with unlimited attempts and ₹0 application fee.`,
          benefits: 'Apex Administrative Services'
        });
      }

      return {
        baselineEligibleCount: 7,
        simulatedEligibleCount: 7 + Math.max(1, unlocked.length),
        netUnlockedCount: Math.max(1, unlocked.length),
        unlockedOpportunities: unlocked.length > 0 ? unlocked : [
          {
            id: 'rrb_ntpc_2027',
            title: 'Railway RRB NTPC Graduate Level 2026-27',
            type: 'GOVT_EXAM',
            unlockReason: 'Unlocked with 100% eligibility score: Zero graduation barrier and broad category relaxations.',
            benefits: '₹35,400 - ₹1,12,400 (Level 5 & 6 Central Pay)'
          }
        ],
        strategicInsights: [
          `Academic Milestone: Scoring ${simMarks}% opens direct entry to competitive entrance tests without prerequisite mark penalties.`,
          `Category Advantage: ${simCategory} status provides age relaxation and reduces total form application fees to nearly ₹0.`,
          `Financial Shield: Family income simulated at ₹${simIncome.toLocaleString('en-IN')} maximizes government central scholarship DBT approvals.`
        ]
      };
    }
  },

  // Documents
  getDocuments: async (): Promise<DocumentItem[]> => {
    try {
      const res = await api.get('/documents');
      return res.data;
    } catch {
      return mockDocuments;
    }
  },

  updateDocumentStatus: async (id: string, status: 'READY' | 'IN_PROGRESS' | 'MISSING'): Promise<DocumentItem> => {
    try {
      const res = await api.patch(`/documents/${id}/status`, null, { params: { status } });
      return res.data;
    } catch {
      const doc = mockDocuments.find(d => d.id === id);
      if (doc) doc.status = status;
      return doc || mockDocuments[0];
    }
  },

  // Notifications
  getNotifications: async (): Promise<NotificationChange[]> => {
    try {
      const res = await api.get('/notifications');
      return res.data;
    } catch {
      return [
        {
          id: 'nc_101',
          opportunityId: 'ssc_cgl_2027',
          opportunityTitle: 'SSC Combined Graduate Level (CGL) 2026-27',
          changeType: 'DEADLINE_EXTENDED',
          headline: 'SSC CGL: Registration Deadline Extended by 10 Days',
          summary: 'Staff Selection Commission has issued Corrigendum Notice extending final submission from Nov 15 to Nov 25 due to heavy server traffic on the new portal.',
          oldValue: 'Nov 15, 2026 (23:00 hrs)',
          newValue: 'Nov 25, 2026 (23:00 hrs)',
          dateDetected: '2026-10-27',
          officialGazetteLink: 'https://ssc.gov.in/corrigendum_cgl_2026_extension.pdf',
          verifiedByAdmin: true
        },
        {
          id: 'nc_102',
          opportunityId: 'rrb_ntpc_2027',
          opportunityTitle: 'Railway RRB NTPC Graduate Level 2026-27',
          changeType: 'VACANCY_INCREASED',
          headline: 'RRB NTPC: Additional 1,200 Vacancies Added across Western & Central Railway',
          summary: 'Railway Recruitment Board updated CEN 05/2026 annexure adding 750 Station Master and 450 Goods Train Manager posts.',
          oldValue: '10,358 Vacancies',
          newValue: '11,558 Vacancies (+1,200 New Posts)',
          dateDetected: '2026-10-25',
          officialGazetteLink: 'https://rrbcdg.gov.in/cen_05_revised_vacancies.pdf',
          verifiedByAdmin: true
        },
        {
          id: 'nc_103',
          opportunityId: 'pm_usp_scholarship',
          opportunityTitle: 'PM-USP Central Sector Scheme of Scholarship (CSSS)',
          changeType: 'CORRIGENDUM',
          headline: 'NSP Portal: Aadhaar Face-RD Authentication Mandatory for Institute Verification',
          summary: 'Ministry of Education notified that students must complete biometric or Aadhaar Face-RD verification on the NSP mobile app before institute nodal approval.',
          oldValue: 'Manual OTP Verification',
          newValue: 'Face-RD Biometric Verification Mandatory',
          dateDetected: '2026-10-24',
          officialGazetteLink: 'https://scholarships.gov.in/public/notice/face_rd_mandatory_2026.pdf',
          verifiedByAdmin: true
        }
      ];
    }
  },

  // Gap Analysis
  getGapAnalysis: async (): Promise<GapAnalysis[]> => {
    try {
      const res = await api.get('/gap-analysis');
      return res.data;
    } catch {
      return [
        {
          opportunityId: 'aicte_pragati',
          opportunityTitle: 'AICTE Pragati Scholarship Scheme for Girls',
          opportunityType: 'SCHOLARSHIP',
          exactGapStatement: 'This scheme is strictly reserved for girl students.',
          gapParameter: 'GENDER_CRITERIA',
          studentCurrentValue: mockProfile.gender,
          requiredThreshold: 'Female Candidate',
          actionableRemedy: 'Apply for gender-neutral central sector scholarships on the National Scholarship Portal.',
          closestAlternatives: [
            {
              id: 'pm_usp_scholarship',
              title: 'PM-USP Central Sector Scholarship',
              type: 'SCHOLARSHIP',
              whyRecommended: 'Gender-neutral central scholarship offering ₹12,000 to ₹20,000/yr directly via DBT.'
            },
            {
              id: 'post_matric_scholarship',
              title: 'Post-Matric Scholarship for Backward Classes & SC/ST',
              type: 'SCHOLARSHIP',
              whyRecommended: '100% Tuition Fee Reimbursement for all eligible candidates.'
            }
          ]
        },
        {
          opportunityId: 'cat_2027',
          opportunityTitle: 'CAT (Common Admission Test) for IIMs & FMS',
          opportunityType: 'HIGHER_STUDIES',
          exactGapStatement: 'CAT requires minimum 50% graduation marks for General/OBC and completed Bachelor degree.',
          gapParameter: 'DEGREE_COMPLETION',
          studentCurrentValue: 'UG Pursuing (3rd Year)',
          requiredThreshold: 'Final Year / Completed',
          actionableRemedy: 'Focus on GATE 2027 (which allows 3rd year students to appear) or prepare CAT foundation for your final year attempt.',
          closestAlternatives: [
            {
              id: 'gate_2027',
              title: 'GATE 2027 (Pre-Final Year Eligibility)',
              type: 'HIGHER_STUDIES',
              whyRecommended: 'Official GATE guidelines allow 3rd year engineering students to appear with 3-year scorecard validity.'
            }
          ]
        }
      ];
    }
  },

  // Timeline
  getTimeline: async (): Promise<CareerTimelineNode[]> => {
    try {
      const res = await api.get('/timeline');
      return res.data;
    } catch {
      return [
        {
          timeframe: 'Open Today (Current Academic Window)',
          milestoneTitle: 'Pre-Final Year & College Scholarship Window',
          triggerEvent: `Eligible right now based on Class 12th score (${mockProfile.twelfthMarksPercent}%) and ongoing enrolled degree.`,
          prepActionToday: 'Complete document readiness (Income certificate renewal, Aadhaar-NPCI seeding) and start Quant/Reasoning fundamentals.',
          unlockingOpportunities: [
            { id: 'pm_usp_scholarship', title: 'PM-USP Central Sector Scholarship', type: 'SCHOLARSHIP', expectedBenefit: '₹12,000/yr college financial grant' },
            { id: 'gate_2027', title: 'GATE 2027 (Pre-Final Year Eligibility)', type: 'HIGHER_STUDIES', expectedBenefit: 'Appear in 3rd year for 3-year valid scorecard' }
          ]
        },
        {
          timeframe: 'In 6 to 12 Months (Upon Degree Final Year)',
          milestoneTitle: 'Full Graduate Officer & Executive Window Opens',
          triggerEvent: "Triggers once final semester exams conclude and provisional degree/marksheet is issued.",
          prepActionToday: 'Intensive preparation on Quant, Reasoning, and General Studies to target Group B/C Central Recruitment.',
          unlockingOpportunities: [
            { id: 'ssc_cgl_2027', title: 'SSC Combined Graduate Level (CGL) 2027', type: 'GOVT_EXAM', expectedBenefit: 'Income Tax Inspector, ASO in MEA (Level 7 Pay: ₹44,900 - ₹1,42,400)' },
            { id: 'ibps_po_2027', title: 'IBPS Probationary Officer (CRP-XV)', type: 'GOVT_EXAM', expectedBenefit: 'Assistant Manager in Nationalized Banks (₹52,000 - ₹68,000/mo)' },
            { id: 'cat_2027', title: 'CAT (Common Admission Test for IIMs)', type: 'HIGHER_STUDIES', expectedBenefit: 'Premier MBA admissions (Average Package ₹28+ LPA)' }
          ]
        },
        {
          timeframe: 'In 1.5 to 2.5 Years (Age 23+ / Apex Service Window)',
          milestoneTitle: 'Civil Services & Specialized State Gazetted Cadres',
          triggerEvent: 'Full eligibility with mature preparation trajectory for administrative services and PSU appointments.',
          prepActionToday: 'Consolidate comprehensive GS answer writing, essay practice, and optional subject mastery.',
          unlockingOpportunities: [
            { id: 'upsc_cse_2027', title: 'UPSC Civil Services Examination (IAS / IPS / IFS)', type: 'GOVT_EXAM', expectedBenefit: 'Apex Administrative & District Magistrate positions' }
          ]
        }
      ];
    }
  },

  // Costs & Clashes
  getCosts: async (): Promise<ApplicationCostPlan> => {
    try {
      const res = await api.get('/costs');
      return res.data;
    } catch {
      return {
        standardTotalFee: 5650.0,
        studentDiscountedTotalFee: 2850.0,
        totalSavedViaWaivers: 2800.0,
        estimatedTravelAndCenterCost: 2400.0,
        estimatedBooksAndPrepCost: 1500.0,
        grandTotalEstimatedExpense: 6750.0,
        itemizedCosts: [
          { opportunityId: 'ssc_cgl_2027', opportunityTitle: 'SSC CGL 2026-27', originalFee: 100.0, finalPayableFee: 100.0, isCompletelyWaived: false, waiverCategoryApplied: 'Standard Rate' },
          { opportunityId: 'ibps_po_2027', opportunityTitle: 'IBPS PO CRP-XIV', originalFee: 850.0, finalPayableFee: 850.0, isCompletelyWaived: false, waiverCategoryApplied: 'Standard Rate' },
          { opportunityId: 'rrb_ntpc_2027', opportunityTitle: 'Railway RRB NTPC Graduate Level', originalFee: 500.0, finalPayableFee: 500.0, isCompletelyWaived: false, waiverCategoryApplied: 'Refundable on CBT-1' },
          { opportunityId: 'pm_usp_scholarship', opportunityTitle: 'PM-USP Central Sector Scholarship', originalFee: 0.0, finalPayableFee: 0.0, isCompletelyWaived: true, waiverCategoryApplied: 'Govt Scholarship (No Application Fee)' },
          { opportunityId: 'gate_2027', opportunityTitle: 'GATE 2027 (IIT Roorkee / IISc)', originalFee: 1800.0, finalPayableFee: 1800.0, isCompletelyWaived: false, waiverCategoryApplied: 'Standard Rate' },
          { opportunityId: 'cat_2027', opportunityTitle: 'CAT (Common Admission Test)', originalFee: 2400.0, finalPayableFee: 2400.0, isCompletelyWaived: false, waiverCategoryApplied: 'Standard Rate' }
        ]
      };
    }
  },

  getClashes: async (): Promise<ExamClashWarning[]> => {
    try {
      const res = await api.get('/clashes');
      return res.data;
    } catch {
      return [
        {
          id: 'clash_1',
          exam1Id: 'gate_2027',
          exam1Title: 'GATE 2027 Examination',
          exam1Date: '2027-02-06',
          exam2Id: 'rrb_ntpc_2027',
          exam2Title: 'Railway RRB NTPC CBT-1',
          exam2Date: '2027-02-22',
          daysApart: 16,
          severity: 'MODERATE_SCHEDULE_PROXIMITY',
          recommendationAdvice: 'Exams are 16 days apart in February 2027. Schedule your revision cycle so GATE technical topics finish first in January.'
        },
        {
          id: 'clash_2',
          exam1Id: 'ibps_po_2027',
          exam1Title: 'IBPS PO Mains Exam',
          exam1Date: '2026-12-10',
          exam2Id: 'ssc_cgl_2027',
          exam2Title: 'SSC CGL Tier-1 Window',
          exam2Date: '2027-01-18',
          daysApart: 38,
          severity: 'IDEAL_SPACING',
          recommendationAdvice: 'Excellent preparation gap: 38 days between IBPS PO Mains and SSC CGL Tier-1 allows seamless transition.'
        }
      ];
    }
  },

  // Scam Alerts & Trust
  getScamAlerts: async (): Promise<ScamAlert[]> => {
    try {
      const res = await api.get('/scam-alerts');
      return res.data;
    } catch {
      return [
        {
          id: 'scam_1',
          fakeClaimOrDomain: "Fake Website: 'ssc-online-gov.in' & 'sscrecruitments.org'",
          officialGenuinePortal: 'Official Portal: https://ssc.gov.in ONLY',
          warningLevel: 'DANGER',
          scamPatternDescription: 'Fraudulent domain mimicking SSC website charging ₹500 fake processing fee via unauthorized UPI QR codes.',
          safetyTip: "Never pay fees on non-gov domains. Authentic central govt sites end in '.gov.in' or '.nic.in'. Check URL bar carefully.",
          dateReported: '2026-10-26'
        },
        {
          id: 'scam_2',
          fakeClaimOrDomain: "WhatsApp Circular: 'Prime Minister ₹25,000 Laptop & Free Stipend Scheme 2026'",
          officialGenuinePortal: 'Official Portal: https://scholarships.gov.in',
          warningLevel: 'FRAUD_ALERT',
          scamPatternDescription: 'Viral WhatsApp forward asking students to share Aadhaar number and OTP to claim a non-existent PM Laptop scheme.',
          safetyTip: 'PIB Fact Check verified this as completely fake. No central scheme offers direct cash or laptops via WhatsApp links.',
          dateReported: '2026-10-22'
        },
        {
          id: 'scam_3',
          fakeClaimOrDomain: "Fake Railway Job Notice: 'RRB Group C Direct Recruitment on Interview basis'",
          officialGenuinePortal: 'Official Portal: https://indianrailways.gov.in / Regional RRBs',
          warningLevel: 'CAUTION',
          scamPatternDescription: 'Fake newspaper clipping advertising direct recruitment without CBT exam.',
          safetyTip: 'Indian Railways NEVER conducts direct recruitment via agents or without computer-based tests.',
          dateReported: '2026-10-18'
        }
      ];
    }
  },

  getPeerStories: async (): Promise<PeerSuccessStory[]> => {
    try {
      const res = await api.get('/peer-stories');
      return res.data;
    } catch {
      return [
        {
          id: 'peer_1',
          studentAlias: 'Rahul Verma',
          homeState: 'Madhya Pradesh (Indore)',
          collegeBackground: 'B.Sc Physics (64.2% Marks)',
          graduationMarks: 64.2,
          socialCategory: 'OBC-NCL',
          appliedCombo: ['SSC CGL', 'RRB NTPC', 'Post-Matric OBC Scholarship'],
          clearedExamOrAward: 'Cleared SSC CGL (Tax Assistant) + Received Post-Matric Scholarship',
          currentRoleOrStipend: 'Central Excise Dept (Level 4 Pay) + ₹24,000 College Aid',
          strategicQuote: 'I had only 64% marks, so many private options were out. GyanSetu showed me that SSC and Railways have zero minimum graduation percentage! I paired SSC prep with RRB NTPC because syllabus was 80% identical.'
        },
        {
          id: 'peer_2',
          studentAlias: 'Priya Sharma',
          homeState: 'Uttar Pradesh (Lucknow)',
          collegeBackground: 'B.Tech ECE (76.8% Marks)',
          graduationMarks: 76.8,
          socialCategory: 'General-EWS',
          appliedCombo: ['GATE Exam', 'IOCL Recruitment', 'M.Tech IIT Admissions'],
          clearedExamOrAward: 'Qualified GATE 2026 (AIR 642) + Availed AICTE PG Fellowship',
          currentRoleOrStipend: 'M.Tech at IIT Kanpur with ₹12,400/month scholarship',
          strategicQuote: 'I did not know EWS certificate gave a 50% concession on form fees and relaxed cutoffs until GyanSetu highlighted it. The Document Readiness checklist saved me because my EWS certificate took 19 days from the Tehsil!'
        },
        {
          id: 'peer_3',
          studentAlias: 'Ankit Meena',
          homeState: 'Rajasthan (Jaipur)',
          collegeBackground: 'B.Com (61.0% Marks)',
          graduationMarks: 61.0,
          socialCategory: 'ST',
          appliedCombo: ['IBPS PO', 'IBPS Clerk', 'SBI Clerk', 'Post-Matric SC/ST'],
          clearedExamOrAward: 'Cleared IBPS Clerk + Selected in Bank of Baroda',
          currentRoleOrStipend: 'Probationary Associate (Gross ₹38,000/mo)',
          strategicQuote: 'As an ST candidate, all my central exam application fees were ₹0. The Preparation Overlap tool proved that preparing for IBPS Quant covered 90% of SBI Clerk. That synergy made all the difference.'
        }
      ];
    }
  },

  getWeeklyDigest: async (): Promise<WeeklyDigest> => {
    try {
      const res = await api.get('/digest');
      return res.data;
    } catch {
      return {
        studentName: mockProfile.fullName,
        weekLabel: `Week of ${new Date().toISOString().split('T')[0]}`,
        upcomingDeadlinesCount: 3,
        newMatchesCount: 4,
        documentsUrgentCount: 1,
        feeSavingsToDate: 2800.0,
        upcomingDeadlineHighlights: [
          'GATE 2027: Registration closing on Oct 31 (3 days remaining)',
          'CAT 2026: Application portal closing Nov 10',
          'PM-USP Central Sector Scholarship: Form submission Nov 30'
        ],
        newMatchHighlights: [
          'Railway RRB NTPC: 1,200 new vacancies added (+100% eligibility score)',
          'Post-Matric OBC Scheme: 100% college tuition reimbursement active for MP Domicile'
        ],
        urgentDocumentAlerts: [
          'Action needed: Family Income Certificate renewal required from Tehsil (takes 14-18 days). Apply now!'
        ],
        whatsAppFormattedMessage: `📢 *GyanSetu Weekly Action Digest for ${mockProfile.fullName}*\n\n⏳ *Upcoming Deadlines This Week:*\n• GATE 2027 (Closing in 3 days - Oct 31)\n• CAT 2026 (Closing Nov 10)\n\n🎯 *New Matches & Updates:*\n• RRB NTPC added 1,200 more officer posts!\n• ₹2,800 saved in exam fee waivers via ${mockProfile.category} relaxation.\n\n⚠️ *Immediate Document Task:*\n• Apply for fresh Income Certificate at local CSC (takes 14 days).\n\n🔗 Open GyanSetu Portal: http://localhost:5173`,
        hindiParentSummary: `नमस्ते! ${mockProfile.fullName} के करियर व छात्रवृत्ति की स्थिति: इस सप्ताह 3 मुख्य फॉर्म की अंतिम तिथि है। सरकारी छूट के कारण फॉर्म फीस में लगभग ₹2,800 की बचत हुई है। कृपया तहसील या सीएससी केंद्र से 'आय प्रमाण पत्र' जल्दी बनवा लें ताकि स्कॉलरशिप का लाभ समय पर मिल सके।`
      };
    }
  }
};

function evaluateEligibilityMock(profile: StudentProfile): EligibilityReport[] {
  return mockOpportunities.map(opp => {
    const reasons: string[] = [];
    const missing: string[] = [];
    const relaxations: string[] = [];
    let score = 100;

    let effMaxAge = opp.maxAge;
    if (profile.category === 'OBC-NCL') {
      effMaxAge += opp.ageRelaxationOBC;
      relaxations.push(`Age Relaxation applied: +${opp.ageRelaxationOBC} Years for OBC-NCL (Max Age: ${effMaxAge} yrs)`);
    } else if (profile.category === 'SC' || profile.category === 'ST') {
      effMaxAge += opp.ageRelaxationSCST;
      relaxations.push(`Age Relaxation applied: +${opp.ageRelaxationSCST} Years for ${profile.category} (Max Age: ${effMaxAge} yrs)`);
    }

    if (profile.age >= opp.minAge && profile.age <= effMaxAge) {
      reasons.push(`Age criterion met: Your age is ${profile.age} years (Allowed: ${opp.minAge} to ${effMaxAge} years).`);
    } else if (profile.age < opp.minAge) {
      missing.push(`Under minimum age limit: You need to be at least ${opp.minAge} years old.`);
      score -= 40;
    } else {
      missing.push(`Upper age limit exceeded: Age is ${profile.age} years (Max permitted: ${effMaxAge} years).`);
      score -= 60;
    }

    if (opp.minGraduationMarksPercent > 0) {
      if (profile.ugMarksPercent >= opp.minGraduationMarksPercent) {
        reasons.push(`Graduation Marks met: You have ${profile.ugMarksPercent}% (Required: ${opp.minGraduationMarksPercent}%).`);
      } else {
        missing.push(`Graduation Marks gap: Minimum required is ${opp.minGraduationMarksPercent}% (You have ${profile.ugMarksPercent}%).`);
        score -= 35;
      }
    } else {
      reasons.push("No minimum graduation percentage barrier (Simple pass in Bachelor's Degree suffices).");
    }

    if (opp.minTwelfthMarksPercent > 0) {
      if (profile.twelfthMarksPercent >= opp.minTwelfthMarksPercent) {
        reasons.push(`Class 12th Marks met: You scored ${profile.twelfthMarksPercent}% (Cutoff: ${opp.minTwelfthMarksPercent}%).`);
      } else {
        missing.push(`Class 12th Marks gap: Requires at least ${opp.minTwelfthMarksPercent}% (You scored ${profile.twelfthMarksPercent}%).`);
        score -= 35;
      }
    }

    if (opp.maxAnnualFamilyIncome !== null) {
      if (profile.annualFamilyIncome <= opp.maxAnnualFamilyIncome) {
        reasons.push(`Income Eligibility met: Annual family income ₹${profile.annualFamilyIncome.toLocaleString('en-IN')} is within ₹${opp.maxAnnualFamilyIncome.toLocaleString('en-IN')} ceiling.`);
      } else {
        missing.push(`Income threshold exceeded: Scheme requires income <= ₹${opp.maxAnnualFamilyIncome.toLocaleString('en-IN')} (Profile indicates ₹${profile.annualFamilyIncome.toLocaleString('en-IN')}).`);
        score -= 50;
      }
    }

    if (opp.id === 'aicte_pragati' && profile.gender !== 'Female') {
      missing.push('AICTE Pragati is exclusively for Female students.');
      score -= 70;
    }

    let confidence: 'ELIGIBLE' | 'LIKELY_ELIGIBLE' | 'NEEDS_VERIFICATION' | 'NOT_ELIGIBLE' = 'ELIGIBLE';
    if (score >= 90) confidence = 'ELIGIBLE';
    else if (score >= 70) confidence = 'LIKELY_ELIGIBLE';
    else if (score >= 50) confidence = 'NEEDS_VERIFICATION';
    else confidence = 'NOT_ELIGIBLE';

    return {
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      opportunityType: opp.type,
      confidenceLevel: confidence,
      confidenceScore: Math.max(10, Math.min(100, score)),
      reasonsWhyQualified: reasons,
      missingCriteria: missing,
      appliedRelaxations: relaxations,
      officialUrl: opp.officialUrl,
      officialPdfNotificationUrl: opp.officialPdfNotificationUrl,
      lastVerifiedDate: opp.lastVerifiedDate,
      isGovVerified: opp.isGovVerified,
      daysRemainingToDeadline: Math.max(2, Math.floor(Math.random() * 35) + 3),
      calculatedApplicationFee: profile.category === 'SC' || profile.category === 'ST' || profile.gender === 'Female' ? opp.applicationFeeFemale : opp.applicationFeeGeneral,
      feeConcessionStatus: profile.gender === 'Female' || profile.category === 'SC' || profile.category === 'ST' ? '100% Fee Exemption Applied' : 'Standard Application Fee'
    };
  }).sort((a, b) => b.confidenceScore - a.confidenceScore);
}
