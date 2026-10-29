package org.gyansetu.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gyansetu.model.*;
import org.springframework.stereotype.Repository;

import java.io.InputStream;
import java.util.*;

@Repository
public class DataRepository {

    private final StudentProfile defaultProfile = new StudentProfile();
    private final Map<String, Opportunity> opportunities = new LinkedHashMap<>();
    private final List<DocumentItem> defaultDocuments = new ArrayList<>();
    private final List<NotificationChange> notificationChanges = new ArrayList<>();
    private final List<ScamAlert> scamAlerts = new ArrayList<>();
    private final List<PeerSuccessStory> peerStories = new ArrayList<>();

    public DataRepository() {
        seedOpportunities();
        loadFiftyDataset();
        seedDocuments();
        seedNotifications();
        seedScamAlerts();
        seedPeerStories();
    }

    private void seedOpportunities() {
        // 1. SSC CGL 2026/2027
        Opportunity sscCgl = new Opportunity(
                "ssc_cgl_2027",
                "SSC Combined Graduate Level (CGL) 2026-27",
                OpportunityType.GOVT_EXAM,
                "Staff Selection Commission (Govt of India)",
                "Premier exam for Group 'B' and 'C' Gazetted & Non-Gazetted central government officer posts including Income Tax Inspector, ASO in MEA, and Central Excise Inspector.",
                "2026-11-25",
                "2027-01-18",
                "https://ssc.gov.in",
                "https://ssc.gov.in/notices/cgl_exam_2026_official_gazette.pdf",
                "2026-10-26",
                "₹44,900 - ₹1,42,400 (Level 7 Pay Matrix)",
                100.0, 0.0, 0.0, true,
                "100% Fee Exemption for SC, ST, PwD, and all Female candidates. ₹100 for Gen/OBC Male.",
                18, 30, 0.0, null
        );
        sscCgl.setAgeRelaxationOBC(3);
        sscCgl.setAgeRelaxationSCST(5);
        sscCgl.setVacanciesOrSeats(17727);
        sscCgl.setCompetitionLevel("High");
        sscCgl.setPreparationTimeMonths(6);
        sscCgl.setEligibleStreams(Arrays.asList("Any Stream (Bachelor's Degree)"));
        sscCgl.setEligibleStates(Arrays.asList("All India"));
        sscCgl.setSyllabusTopics(Arrays.asList("Quantitative Aptitude", "General Intelligence & Reasoning", "General Awareness", "English Comprehension", "Computer Proficiency"));
        sscCgl.setRequiredDocuments(Arrays.asList("10th Marksheet (Proof of DOB)", "Graduation Final Degree/Marksheet", "OBC-NCL / SC / ST / EWS Certificate", "Passport Photograph"));
        opportunities.put(sscCgl.getId(), sscCgl);

        // 2. IBPS Probationary Officer (PO)
        Opportunity ibpsPo = new Opportunity(
                "ibps_po_2027",
                "IBPS PO / Management Trainee CRP-XIV",
                OpportunityType.GOVT_EXAM,
                "Institute of Banking Personnel Selection (Public Sector Banks)",
                "Direct recruitment for Probationary Officers across 11 Nationalized Banks (PNB, BoB, Canara, Union Bank, etc.).",
                "2026-11-15",
                "2026-12-10",
                "https://ibps.in",
                "https://ibps.in/notifications/crp_po_xiv_detailed_adv.pdf",
                "2026-10-27",
                "₹52,000 - ₹68,000 / month gross salary",
                850.0, 175.0, 850.0, true,
                "Concession for SC/ST/PwD: ₹175 (Intimation charges only). ₹850 for Gen/OBC/EWS.",
                20, 30, 0.0, null
        );
        ibpsPo.setAgeRelaxationOBC(3);
        ibpsPo.setAgeRelaxationSCST(5);
        ibpsPo.setVacanciesOrSeats(4455);
        ibpsPo.setCompetitionLevel("High");
        ibpsPo.setPreparationTimeMonths(5);
        ibpsPo.setEligibleStreams(Arrays.asList("Any Stream (Bachelor's Degree)"));
        ibpsPo.setEligibleStates(Arrays.asList("All India"));
        ibpsPo.setSyllabusTopics(Arrays.asList("Quantitative Aptitude (Data Interpretation)", "Reasoning Ability", "English Language", "General & Financial Banking Awareness"));
        ibpsPo.setRequiredDocuments(Arrays.asList("Graduation Marksheet", "Valid Category Certificate", "Photo & Thumb Impression", "Handwritten Declaration"));
        opportunities.put(ibpsPo.getId(), ibpsPo);

        // 3. RRB Non-Technical Popular Categories (NTPC)
        Opportunity rrbNtpc = new Opportunity(
                "rrb_ntpc_2027",
                "Railway RRB NTPC Graduate Level 2026-27",
                OpportunityType.GOVT_EXAM,
                "Railway Recruitment Boards (Ministry of Railways)",
                "Recruitment for Station Master, Goods Train Manager, Senior Clerk cum Typist, and Commercial Apprentice in Indian Railways.",
                "2026-12-05",
                "2027-02-22",
                "https://indianrailways.gov.in",
                "https://rrbcdg.gov.in/cen_05_2026_ntpc_graduate.pdf",
                "2026-10-25",
                "₹35,400 - ₹1,12,400 (Level 5 & 6 Central Pay)",
                500.0, 250.0, 250.0, true,
                "₹250 for SC/ST/Ex-SM/PwD/Female/Minorities (₹250 refunded upon attending CBT-1). ₹500 for others (₹400 refunded).",
                18, 33, 0.0, null
        );
        rrbNtpc.setAgeRelaxationOBC(3);
        rrbNtpc.setAgeRelaxationSCST(5);
        rrbNtpc.setVacanciesOrSeats(11558);
        rrbNtpc.setCompetitionLevel("High");
        rrbNtpc.setPreparationTimeMonths(5);
        rrbNtpc.setEligibleStreams(Arrays.asList("Any Stream (Graduate)"));
        rrbNtpc.setEligibleStates(Arrays.asList("All India"));
        rrbNtpc.setSyllabusTopics(Arrays.asList("General Awareness & Current Affairs", "Mathematics (Quant)", "General Intelligence and Reasoning"));
        rrbNtpc.setRequiredDocuments(Arrays.asList("10th Certificate", "Degree Certificate", "Caste Certificate", "Aadhaar Card"));
        opportunities.put(rrbNtpc.getId(), rrbNtpc);

        // 4. UPSC Civil Services Examination 2027
        Opportunity upscCse = new Opportunity(
                "upsc_cse_2027",
                "UPSC Civil Services Examination (IAS / IPS / IFS) 2027",
                OpportunityType.GOVT_EXAM,
                "Union Public Service Commission",
                "India's apex competitive examination for recruitment to the Indian Administrative Service, Indian Police Service, and 22 Central Group A/B Services.",
                "2027-02-14",
                "2027-05-23",
                "https://upsc.gov.in",
                "https://upsc.gov.in/examinations/active-exams/civil-services-preliminary-2027.pdf",
                "2026-10-24",
                "Apex Administrative Hierarchy (Pay Level 10 to Cabinet Secretary)",
                100.0, 0.0, 0.0, true,
                "Full exemption for Female, SC, ST, and PwD candidates. ₹100 for Gen/OBC/EWS Male.",
                21, 32, 0.0, null
        );
        upscCse.setAgeRelaxationOBC(3);
        upscCse.setAgeRelaxationSCST(5);
        upscCse.setVacanciesOrSeats(1056);
        upscCse.setCompetitionLevel("Very High");
        upscCse.setPreparationTimeMonths(12);
        upscCse.setEligibleStreams(Arrays.asList("Any Bachelor's Degree"));
        upscCse.setEligibleStates(Arrays.asList("All India"));
        upscCse.setSyllabusTopics(Arrays.asList("General Studies (History, Polity, Geography, Economy, Science)", "CSAT (Quantitative Aptitude, Logical Reasoning, Comprehension)"));
        upscCse.setRequiredDocuments(Arrays.asList("Govt Photo ID", "Graduation Marksheet", "Caste/EWS Certificate"));
        opportunities.put(upscCse.getId(), upscCse);

        // 5. PM-USP Central Sector Scholarship
        Opportunity pmUsp = new Opportunity(
                "pm_usp_scholarship",
                "PM-USP Central Sector Scheme of Scholarship (CSSS)",
                OpportunityType.SCHOLARSHIP,
                "Ministry of Education, Govt of India (National Scholarship Portal)",
                "Financial support to meritorious college and university students from low-income families to pursue graduation and post-graduation.",
                "2026-11-30",
                "2027-01-15",
                "https://scholarships.gov.in",
                "https://scholarships.gov.in/public/schemeGuidelines/CSSS_MoE_Guidelines.pdf",
                "2026-10-27",
                "₹12,000/year (UG) & ₹20,000/year (PG) directly into Bank Account via DBT",
                0.0, 0.0, 0.0, true,
                "100% Free Application on National Scholarship Portal (NSP).",
                17, 25, 0.0, 450000.0
        );
        pmUsp.setMinTwelfthMarksPercent(80.0);
        pmUsp.setVacanciesOrSeats(82000);
        pmUsp.setCompetitionLevel("Moderate");
        pmUsp.setPreparationTimeMonths(1);
        pmUsp.setEligibleStreams(Arrays.asList("Any Regular College Course (Science, Commerce, Arts, Engg, Medical)"));
        pmUsp.setEligibleStates(Arrays.asList("All India"));
        pmUsp.setRequiredDocuments(Arrays.asList("12th Board Marksheet (>80th Percentile)", "Annual Income Certificate (< ₹4.5 LPA)", "College Bonafide Certificate", "Aadhaar Linked Bank Passbook"));
        pmUsp.setSyllabusTopics(Arrays.asList("Merit Based - Board Marks & College Regular Enrollment"));
        opportunities.put(pmUsp.getId(), pmUsp);

        // 6. AICTE Pragati Scholarship for Girl Students
        Opportunity aictePragati = new Opportunity(
                "aicte_pragati",
                "AICTE Pragati Scholarship Scheme for Girls",
                OpportunityType.SCHOLARSHIP,
                "All India Council for Technical Education (AICTE)",
                "A dedicated scheme to empower female students to pursue technical degrees and diplomas in AICTE approved institutions.",
                "2026-12-15",
                "2027-02-10",
                "https://www.aicte-india.org",
                "https://www.aicte-india.org/schemes/students-development-schemes/pragati-guidelines.pdf",
                "2026-10-25",
                "₹50,000 per annum for every year of study towards tuition fee & incidentals",
                0.0, 0.0, 0.0, true,
                "100% Free Application via National Scholarship Portal.",
                17, 30, 0.0, 800000.0
        );
        aictePragati.setVacanciesOrSeats(10000);
        aictePragati.setCompetitionLevel("Moderate");
        aictePragati.setEligibleStreams(Arrays.asList("Engineering / Technology", "Diploma in Engg", "Pharmacy", "Architecture"));
        aictePragati.setEligibleStates(Arrays.asList("All India"));
        aictePragati.setRequiredDocuments(Arrays.asList("AICTE College Admission Proof", "Income Certificate (< ₹8 LPA)", "10th/12th Marksheet", "Aadhaar Card"));
        aictePragati.setSyllabusTopics(Arrays.asList("Technical Merit Admission in AICTE Institute"));
        opportunities.put(aictePragati.getId(), aictePragati);

        // 7. Post-Matric Scholarship for OBC / SC / ST Students
        Opportunity postMatric = new Opportunity(
                "post_matric_scholarship",
                "Post-Matric Scholarship for Backward Classes & SC/ST",
                OpportunityType.SCHOLARSHIP,
                "Ministry of Social Justice & State Depts (NSP & State Portals)",
                "Comprehensive tuition fee waiver and monthly maintenance allowance for higher education to backward class and reserved students.",
                "2026-11-20",
                "2026-12-30",
                "https://scholarships.gov.in",
                "https://socialjustice.gov.in/schemes/post-matric-obc.pdf",
                "2026-10-28",
                "100% Tuition Fee Reimbursement + ₹1,200/month Hosteller Allowance",
                0.0, 0.0, 0.0, true,
                "100% Free Application on State & Central NSP Portals.",
                16, 35, 0.0, 250000.0
        );
        postMatric.setVacanciesOrSeats(500000);
        postMatric.setCompetitionLevel("Low");
        postMatric.setEligibleStreams(Arrays.asList("Any Degree / Diploma / Post-Graduation"));
        postMatric.setEligibleStates(Arrays.asList("All India"));
        postMatric.setRequiredDocuments(Arrays.asList("State Domicile Certificate", "Caste Certificate (OBC-NCL / SC / ST)", "Income Certificate (< ₹2.5 LPA)", "Fee Receipt of Current College"));
        postMatric.setSyllabusTopics(Arrays.asList("Direct Needs-Based Verification"));
        opportunities.put(postMatric.getId(), postMatric);

        // 8. GATE 2027 (Graduate Aptitude Test in Engineering)
        Opportunity gateExam = new Opportunity(
                "gate_2027",
                "GATE 2027 (IIT Roorkee / IISc Organised)",
                OpportunityType.HIGHER_STUDIES,
                "National Coordination Board - GATE / Ministry of Education",
                "Gateway for M.Tech/MS/Direct PhD admissions at IITs, IISc, NITs, and executive recruitment in top Maharatna PSUs (ONGC, IOCL, NTPC, BHEL, DRDO, BARC).",
                "2026-10-31",
                "2027-02-06",
                "https://gate.iitr.ac.in",
                "https://gate.iitr.ac.in/information_brochure_gate_2027.pdf",
                "2026-10-27",
                "M.Tech Admission + ₹12,400/month MoE Fellowship / PSU CTC ₹16-24 LPA",
                1800.0, 900.0, 900.0, true,
                "₹900 for Female candidates and SC/ST/PwD. ₹1800 for all other candidates.",
                19, 45, 0.0, null
        );
        gateExam.setVacanciesOrSeats(120000);
        gateExam.setCompetitionLevel("High");
        gateExam.setPreparationTimeMonths(8);
        gateExam.setEligibleStreams(Arrays.asList("Engineering / Technology", "Science PCM", "Architecture"));
        gateExam.setEligibleStates(Arrays.asList("All India"));
        gateExam.setSyllabusTopics(Arrays.asList("Engineering Mathematics", "General Aptitude (Verbal & Numerical)", "Discipline Specific Core Subjects (CS / ME / EE / CE / EC)"));
        gateExam.setRequiredDocuments(Arrays.asList("Graduation Degree / 3rd Year Bonafide Certificate", "Category Certificate", "Photo & Signature"));
        opportunities.put(gateExam.getId(), gateExam);

        // 9. CAT 2026/2027 (Common Admission Test for IIMs)
        Opportunity catExam = new Opportunity(
                "cat_2027",
                "CAT (Common Admission Test) for IIMs & FMS",
                OpportunityType.HIGHER_STUDIES,
                "Indian Institutes of Management (IIMs)",
                "National flagship test for admission into Master in Business Administration (MBA) and PGDM programs across all 21 IIMs and top B-schools.",
                "2026-11-10",
                "2026-11-29",
                "https://iimcat.ac.in",
                "https://iimcat.ac.in/per/g01/pub/756/ASM/WebPortal/1/index.html",
                "2026-10-25",
                "Admission to Top Tier Management Programs (Average CTC ₹28 - ₹35 LPA)",
                2400.0, 1200.0, 2400.0, true,
                "₹1200 for SC/ST/PwD candidates. ₹2400 for General/EWS/NC-OBC.",
                20, 40, 50.0, null
        );
        catExam.setMinGraduationMarksPercent(50.0);
        catExam.setVacanciesOrSeats(6500);
        catExam.setCompetitionLevel("Very High");
        catExam.setPreparationTimeMonths(7);
        catExam.setEligibleStreams(Arrays.asList("Any Bachelor's Degree"));
        catExam.setEligibleStates(Arrays.asList("All India"));
        catExam.setSyllabusTopics(Arrays.asList("Verbal Ability and Reading Comprehension (VARC)", "Data Interpretation and Logical Reasoning (DILR)", "Quantitative Ability (QA)"));
        catExam.setRequiredDocuments(Arrays.asList("10th, 12th, Graduation Marksheets", "Caste / PwD Certificate (if applicable)"));
        opportunities.put(catExam.getId(), catExam);

        // 10. CUET-PG (Common University Entrance Test for Post-Graduation)
        Opportunity cuetPg = new Opportunity(
                "cuet_pg_2027",
                "NTA CUET-PG Central Universities Entrance 2027",
                OpportunityType.HIGHER_STUDIES,
                "National Testing Agency (NTA)",
                "Single window opportunity for admission to M.A., M.Sc., M.Com., MCA, and LL.M. courses in JNU, DU, BHU, Hyderabad University, and 140+ participating central universities.",
                "2027-01-20",
                "2027-03-12",
                "https://pgcuet.samarth.ac.in",
                "https://cdnbbsr.s3waas.gov.in/s3d1a21da7bca4/uploads/2026/CUET_PG_2027_Info_Bulletin.pdf",
                "2026-10-26",
                "Master's Degree from Premier Central Universities with low subsidized fees",
                1200.0, 900.0, 1200.0, true,
                "₹900 for SC/ST/Third Gender. ₹1000 for OBC-NCL/EWS. ₹1200 for General.",
                19, 40, 50.0, null
        );
        cuetPg.setMinGraduationMarksPercent(50.0);
        cuetPg.setVacanciesOrSeats(45000);
        cuetPg.setCompetitionLevel("Moderate");
        cuetPg.setPreparationTimeMonths(4);
        cuetPg.setEligibleStreams(Arrays.asList("Any Bachelor's Degree"));
        cuetPg.setEligibleStates(Arrays.asList("All India"));
        cuetPg.setSyllabusTopics(Arrays.asList("Subject Domain Specific Knowledge", "General Analytical Ability"));
        cuetPg.setRequiredDocuments(Arrays.asList("Graduation Marksheet/Admit Card", "Category Certificate"));
        opportunities.put(cuetPg.getId(), cuetPg);
    }

    private void loadFiftyDataset() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = getClass().getResourceAsStream("/data/opportunities_50.json");
            if (is != null) {
                List<Opportunity> loaded = mapper.readValue(is, new TypeReference<List<Opportunity>>() {});
                for (Opportunity opp : loaded) {
                    if (opp.getId() != null && !opportunities.containsKey(opp.getId())) {
                        if (opp.getDescription() == null || opp.getDescription().isEmpty()) {
                            opp.setDescription(opp.getTitle() + " offered by " + opp.getOrganization() + ". Key Benefits: " + opp.getBenefitsOrSalary());
                        }
                        if (opp.getEligibleStates() == null || opp.getEligibleStates().isEmpty()) {
                            opp.setEligibleStates(Collections.singletonList("All India"));
                        }
                        if (opp.getEligibleStreams() == null || opp.getEligibleStreams().isEmpty()) {
                            opp.setEligibleStreams(Collections.singletonList("Any Recognized Stream"));
                        }
                        opportunities.put(opp.getId(), opp);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Note: Could not load /data/opportunities_50.json: " + e.getMessage());
        }
    }

    public void addOpportunity(Opportunity opp) {
        if (opp != null && opp.getId() != null) {
            opportunities.put(opp.getId(), opp);
        }
    }

    public void addOpportunities(List<Opportunity> newOpps) {
        if (newOpps != null) {
            for (Opportunity opp : newOpps) {
                addOpportunity(opp);
            }
        }
    }

    private void seedDocuments() {
        defaultDocuments.add(new DocumentItem(
                "doc_income_cert",
                "Family Annual Income Certificate (आय प्रमाण पत्र)",
                18,
                "Tehsil / Sub-Divisional Magistrate (SDM) / CSC Digital Seva",
                "Issued on or after April 1, 2026 (Valid for FY 2026-27)",
                "Must be in parent's name or family head. For NSP and Post-Matric schemes, annual income must be under ₹2.5 Lakh (or ₹4.5L for PM-USP).",
                "IN_PROGRESS"
        ));
        defaultDocuments.add(new DocumentItem(
                "doc_caste_cert",
                "Central Format OBC-NCL / SC / ST Certificate (जाति प्रमाण पत्र)",
                21,
                "District Magistrate / Revenue Authority",
                "Issued within last 1 year for OBC Non-Creamy Layer; Lifetime for SC/ST",
                "Central Government formats differ from state formats! Ensure it states 'Government of India Resolution' for SSC/UPSC.",
                "READY"
        ));
        defaultDocuments.add(new DocumentItem(
                "doc_domicile_cert",
                "State Domicile / Residence Certificate (मूल निवास प्रमाण पत्र)",
                12,
                "E-District Portal / Local Tehsildar",
                "Permanent validity unless address shifts",
                "Crucial for state-specific quota, state PSCs, and state scholarship fee waivers.",
                "READY"
        ));
        defaultDocuments.add(new DocumentItem(
                "doc_bonafide_cert",
                "College Bonafide & Current Year Study Certificate",
                3,
                "College Registrar / Dean of Student Welfare",
                "Current Academic Year 2026-27",
                "Must clearly mention your Roll Number, enrolled Degree, and current Semester.",
                "MISSING"
        ));
        defaultDocuments.add(new DocumentItem(
                "doc_aadhaar_npci",
                "Aadhaar-NPCI Bank Account Seeding Form",
                5,
                "Bank Branch / UIDAI Portal",
                "Lifetime (until account changed)",
                "Mandatory for all Government DBT (Direct Benefit Transfer) scholarships. Account must NOT be in inactive or dormant state.",
                "READY"
        ));
    }

    private void seedNotifications() {
        notificationChanges.add(new NotificationChange(
                "nc_101",
                "ssc_cgl_2027",
                "SSC Combined Graduate Level (CGL) 2026-27",
                "DEADLINE_EXTENDED",
                "SSC CGL: Registration Deadline Extended by 10 Days",
                "Staff Selection Commission has issued Corrigendum Notice extending final submission from Nov 15 to Nov 25 due to heavy server traffic on the new portal.",
                "Nov 15, 2026 (23:00 hrs)",
                "Nov 25, 2026 (23:00 hrs)",
                "2026-10-27",
                "https://ssc.gov.in/corrigendum_cgl_2026_extension.pdf"
        ));
        notificationChanges.add(new NotificationChange(
                "nc_102",
                "rrb_ntpc_2027",
                "Railway RRB NTPC Graduate Level 2026-27",
                "VACANCY_INCREASED",
                "RRB NTPC: Additional 1,200 Vacancies Added across Western & Central Railway",
                "Railway Recruitment Board updated CEN 05/2026 annexure adding 750 Station Master and 450 Goods Train Manager posts.",
                "10,358 Vacancies",
                "11,558 Vacancies (+1,200 New Posts)",
                "2026-10-25",
                "https://rrbcdg.gov.in/cen_05_revised_vacancies.pdf"
        ));
        notificationChanges.add(new NotificationChange(
                "nc_103",
                "pm_usp_scholarship",
                "PM-USP Central Sector Scheme of Scholarship (CSSS)",
                "CORRIGENDUM",
                "NSP Portal: Aadhaar Face-RD Authentication Mandatory for Institute Verification",
                "Ministry of Education notified that students must complete biometric or Aadhaar Face-RD verification on the NSP mobile app before institute nodal approval.",
                "Manual OTP Verification",
                "Face-RD Biometric Verification Mandatory",
                "2026-10-24",
                "https://scholarships.gov.in/public/notice/face_rd_mandatory_2026.pdf"
        ));
    }

    private void seedScamAlerts() {
        scamAlerts.add(new ScamAlert(
                "scam_1",
                "Fake Website: 'ssc-online-gov.in' & 'sscrecruitments.org'",
                "Official Portal: https://ssc.gov.in ONLY",
                "DANGER",
                "Fraudulent domain mimicking SSC website charging ₹500 fake processing fee via unauthorized UPI QR codes.",
                "Never pay fees on non-gov domains. Authentic central govt sites end in '.gov.in' or '.nic.in'. Check URL bar carefully.",
                "2026-10-26"
        ));
        scamAlerts.add(new ScamAlert(
                "scam_2",
                "WhatsApp Circular: 'Prime Minister ₹25,000 Laptop & Free Stipend Scheme 2026'",
                "Official Portal: https://scholarships.gov.in",
                "FRAUD_ALERT",
                "Viral WhatsApp forward asking students to share Aadhaar number and OTP to claim a non-existent PM Laptop scheme.",
                "PIB Fact Check verified this as completely fake. No central scheme offers direct cash or laptops via WhatsApp links.",
                "2026-10-22"
        ));
        scamAlerts.add(new ScamAlert(
                "scam_3",
                "Fake Railway Job Notice: 'RRB Group C Direct Recruitment on Interview basis'",
                "Official Portal: https://indianrailways.gov.in / Regional RRBs",
                "CAUTION",
                "Fake newspaper clipping advertising direct recruitment without CBT exam.",
                "Indian Railways NEVER conducts direct recruitment via agents or without computer-based tests.",
                "2026-10-18"
        ));
    }

    private void seedPeerStories() {
        PeerSuccessStory story1 = new PeerSuccessStory(
                "peer_1",
                "Rahul Verma",
                "Madhya Pradesh (Indore)",
                "B.Sc Physics (64.2% Marks)",
                64.2,
                "OBC-NCL",
                "Cleared SSC CGL (Tax Assistant) + Received Post-Matric Scholarship",
                "Central Excise Dept (Level 4 Pay) + ₹24,000 College Aid",
                "I had only 64% marks, so many top private entrance exams were out. GyanSetu showed me that SSC and Railways have zero minimum graduation percentage! I paired SSC prep with RRB NTPC because syllabus was 80% identical."
        );
        story1.setAppliedCombo(Arrays.asList("SSC CGL", "RRB NTPC", "Post-Matric OBC Scholarship"));
        peerStories.add(story1);

        PeerSuccessStory story2 = new PeerSuccessStory(
                "peer_2",
                "Priya Sharma",
                "Uttar Pradesh (Lucknow)",
                "B.Tech ECE (76.8% Marks)",
                76.8,
                "General-EWS",
                "Qualified GATE 2026 (AIR 642) + Availed AICTE PG Fellowship",
                "M.Tech at IIT Kanpur with ₹12,400/month scholarship",
                "I didn't know EWS certificate gave a 50% concession on form fees and relaxed cutoffs until GyanSetu highlighted it. The Document Readiness checklist saved me because my EWS certificate took 19 days from the Tehsil!"
        );
        story2.setAppliedCombo(Arrays.asList("GATE Exam", "IOCL Recruitment", "M.Tech IIT Admissions"));
        peerStories.add(story2);

        PeerSuccessStory story3 = new PeerSuccessStory(
                "peer_3",
                "Ankit Meena",
                "Rajasthan (Jaipur)",
                "B.Com (61.0% Marks)",
                61.0,
                "ST",
                "Cleared IBPS Clerk + Selected in Bank of Baroda",
                "Probationary Associate (Gross ₹38,000/mo)",
                "As an ST candidate, all my central exam application fees were ₹0. The Preparation Overlap tool proved that preparing for IBPS Quant covered 90% of SBI Clerk. That synergy made all the difference."
        );
        story3.setAppliedCombo(Arrays.asList("IBPS PO", "IBPS Clerk", "SBI Clerk", "Post-Matric SC/ST"));
        peerStories.add(story3);
    }

    public synchronized void resetCatalog() {
        opportunities.clear();
        seedOpportunities();
        loadFiftyDataset();
    }

    public StudentProfile getDefaultProfile() { return defaultProfile; }
    public Map<String, Opportunity> getOpportunities() { return opportunities; }
    public List<DocumentItem> getDefaultDocuments() { return defaultDocuments; }
    public List<NotificationChange> getNotificationChanges() { return notificationChanges; }
    public List<ScamAlert> getScamAlerts() { return scamAlerts; }
    public List<PeerSuccessStory> getPeerStories() { return peerStories; }
}
