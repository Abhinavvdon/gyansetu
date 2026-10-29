import json
import csv
import os

higher_studies_data = [
    {
        "id": "gate_2027",
        "title": "GATE 2027 (Graduate Aptitude Test in Engineering)",
        "type": "HIGHER_STUDIES",
        "organization": "Indian Institute of Science (IISc) / IITs",
        "level": "Postgraduate (M.Tech / M.E / Ph.D / Direct PSU)",
        "applicationDeadline": "2026-10-15",
        "examDate": "2027-02-06",
        "minEducationLevel": "Graduate",
        "eligibleDegrees": ["B.Tech", "B.E", "B.Arch", "M.Sc", "MCA"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General", "OBC-NCL", "SC", "ST", "EWS", "PwD"],
        "benefitsOrSalary": "MHRD AICTE PG Fellowship: ₹12,400/month for 24 months + Direct PSU Recruitment (IOCL, ONGC, NTPC, BHEL)",
        "applicationFeeGeneral": 1800,
        "applicationFeeReserved": 900,
        "applicationFeeFemale": 900,
        "officialUrl": "https://gate2027.iitk.ac.in",
        "syllabus": "Engineering Mathematics, General Aptitude, and Discipline Core (CS, ME, CE, EE, EC, etc.)"
    },
    {
        "id": "cat_2026",
        "title": "CAT 2026 (Common Admission Test - 21 IIMs)",
        "type": "HIGHER_STUDIES",
        "organization": "Indian Institutes of Management (IIMs)",
        "level": "Postgraduate (MBA / PGDM)",
        "applicationDeadline": "2026-09-20",
        "examDate": "2026-11-29",
        "minEducationLevel": "Graduate",
        "eligibleDegrees": ["Any Bachelor's Degree (Min 50% Marks, 45% for SC/ST/PwD)"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General", "NC-OBC", "SC", "ST", "EWS", "PwD"],
        "benefitsOrSalary": "Admission to 21 IIMs & 100+ top B-schools with average domestic placement of ₹28 - ₹35 LPA",
        "applicationFeeGeneral": 2400,
        "applicationFeeReserved": 1200,
        "applicationFeeFemale": 1200,
        "officialUrl": "https://iimcat.ac.in",
        "syllabus": "Verbal Ability & Reading Comprehension (VARC), Data Interpretation & Logical Reasoning (DILR), Quantitative Aptitude (QA)"
    },
    {
        "id": "cuet_pg_2027",
        "title": "CUET-PG 2027 (Central Universities PG Entrance)",
        "type": "HIGHER_STUDIES",
        "organization": "National Testing Agency (NTA)",
        "level": "Postgraduate (MA, M.Sc, M.Com, MCA, LLM, M.Ed)",
        "applicationDeadline": "2027-02-05",
        "examDate": "2027-03-15",
        "minEducationLevel": "Graduate",
        "eligibleDegrees": ["Graduation in relevant discipline from recognized university"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General", "OBC-NCL", "SC", "ST", "EWS"],
        "benefitsOrSalary": "Subsidized PG seats in premier Central Universities (DU, JNU, BHU, Hyderabad University, Jamia Millia Islamia)",
        "applicationFeeGeneral": 1200,
        "applicationFeeReserved": 900,
        "applicationFeeFemale": 900,
        "officialUrl": "https://pgcuet.samarth.ac.in",
        "syllabus": "Domain Knowledge 75 Questions + General Analytical Section (Part A optional per university)"
    },
    {
        "id": "iit_jam_2027",
        "title": "IIT JAM 2027 (Joint Admission Test for M.Sc. at IITs)",
        "type": "HIGHER_STUDIES",
        "organization": "Indian Institutes of Technology (IITs)",
        "level": "Postgraduate (M.Sc, Joint M.Sc.-Ph.D., M.Sc.-Ph.D. Dual Degree)",
        "applicationDeadline": "2026-10-20",
        "examDate": "2027-02-14",
        "minEducationLevel": "Graduate",
        "eligibleDegrees": ["B.Sc in Physics, Chemistry, Math, Biotech, Geology, or Economics"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General", "OBC-NCL", "SC", "ST", "EWS", "PwD"],
        "benefitsOrSalary": "Direct M.Sc. Admission at 21 IITs and IISc Bangalore + eligibility for CSIR-NET research fellowships",
        "applicationFeeGeneral": 1800,
        "applicationFeeReserved": 900,
        "applicationFeeFemale": 900,
        "officialUrl": "https://jam2027.iitd.ac.in",
        "syllabus": "Pure Science Core: Biotechnology, Chemistry, Geology, Mathematics, Mathematical Statistics, Physics, Economics"
    },
    {
        "id": "nimcet_2027",
        "title": "NIMCET 2027 (NIT MCA Common Entrance Test)",
        "type": "HIGHER_STUDIES",
        "organization": "National Institutes of Technology (NITs)",
        "level": "Postgraduate (Master of Computer Applications - MCA)",
        "applicationDeadline": "2027-04-10",
        "examDate": "2027-06-08",
        "minEducationLevel": "Graduate",
        "eligibleDegrees": ["B.Sc / B.Sc (Hons) / BCA / BIT / B.Voc (Computer Science) or B.E / B.Tech (Min 60% marks with Mathematics)"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General", "OBC-NCL", "SC", "ST", "EWS", "PwD"],
        "benefitsOrSalary": "3-Year & 2-Year MCA at top NITs (Trichy, Surathkal, Warangal, Allahabad) with campus placement avg ₹12 - ₹16 LPA",
        "applicationFeeGeneral": 2500,
        "applicationFeeReserved": 1250,
        "applicationFeeFemale": 1250,
        "officialUrl": "https://www.nimcet.in",
        "syllabus": "Mathematics (Higher Secondary & Discrete), Analytical Ability & Logical Reasoning, Computer Awareness, General English"
    },
    {
        "id": "ceed_2027",
        "title": "CEED 2027 (Common Entrance Examination for Design - M.Des IITs)",
        "type": "HIGHER_STUDIES",
        "organization": "IIT Bombay",
        "level": "Postgraduate (M.Des & Ph.D. in Design)",
        "applicationDeadline": "2026-11-10",
        "examDate": "2027-01-17",
        "minEducationLevel": "Graduate",
        "eligibleDegrees": ["Degree/Diploma/Postgraduate of min 3 years after 10+2 (Engg, Architecture, Design, Arts)"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General", "OBC-NCL", "SC", "ST", "EWS", "PwD"],
        "benefitsOrSalary": "Master of Design (M.Des) at IIT Bombay, IIT Delhi, IIT Guwahati, IIT Hyderabad, IISc Bangalore + ₹12,400/month fellowship",
        "applicationFeeGeneral": 3800,
        "applicationFeeReserved": 1900,
        "applicationFeeFemale": 1900,
        "officialUrl": "https://www.ceed.iitb.ac.in",
        "syllabus": "Part A (Visualization, Spatial Reasoning, Environmental Awareness) + Part B (Drawing, Problem Identification, Creativity)"
    },
    {
        "id": "nid_dat_2027",
        "title": "NID Design Aptitude Test (DAT 2027 - M.Des)",
        "type": "HIGHER_STUDIES",
        "organization": "National Institute of Design (NID)",
        "level": "Postgraduate (Master of Design - 2.5 Years)",
        "applicationDeadline": "2026-12-05",
        "examDate": "2027-01-03",
        "minEducationLevel": "Graduate",
        "eligibleDegrees": ["Bachelor degree in any specialization or full-time Diploma in Design"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General", "OBC-NCL", "SC", "ST", "EWS"],
        "benefitsOrSalary": "Admission to 19 M.Des disciplines across NID Ahmedabad, Gandhinagar, and Bengaluru campuses",
        "applicationFeeGeneral": 3000,
        "applicationFeeReserved": 1500,
        "applicationFeeFemale": 1500,
        "officialUrl": "https://admissions.nid.edu",
        "syllabus": "Design Aptitude Test Prelims (Visual Design, Observation, Lateral Thinking) followed by DAT Mains Studio Test"
    },
    {
        "id": "xat_2027",
        "title": "XAT 2027 (Xavier Aptitude Test - XLRI)",
        "type": "HIGHER_STUDIES",
        "organization": "XLRI Xavier School of Management",
        "level": "Postgraduate (MBA / PGDM in BM, HRM)",
        "applicationDeadline": "2026-11-30",
        "examDate": "2027-01-04",
        "minEducationLevel": "Graduate",
        "eligibleDegrees": ["Three-year Bachelor's degree in any discipline"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General", "OBC-NCL", "SC", "ST", "EWS"],
        "benefitsOrSalary": "Admission to XLRI Jamshedpur & Delhi-NCR, XIMB, TAPMI, GIM (XLRI Average CTC ₹32.7 Lakhs/year)",
        "applicationFeeGeneral": 2200,
        "applicationFeeReserved": 2200,
        "applicationFeeFemale": 2200,
        "officialUrl": "https://xatonline.in",
        "syllabus": "Decision Making (DM), Verbal & Logical Ability, Quantitative Ability & Data Interpretation, General Knowledge, Essay"
    },
    {
        "id": "clat_pg_2027",
        "title": "CLAT PG 2027 (Common Law Admission Test for LL.M.)",
        "type": "HIGHER_STUDIES",
        "organization": "Consortium of National Law Universities (NLUs)",
        "level": "Postgraduate (Master of Laws - LL.M.)",
        "applicationDeadline": "2026-11-05",
        "examDate": "2026-12-06",
        "minEducationLevel": "Graduate",
        "eligibleDegrees": ["LL.B. Degree or an equivalent examination (Min 50% Marks, 45% for SC/ST)"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General", "OBC-NCL", "SC", "ST", "EWS"],
        "benefitsOrSalary": "LL.M. Degree at 24 NLUs + Direct PSU Legal Counsel recruitment (NTPC, BHEL, ONGC, PowerGrid)",
        "applicationFeeGeneral": 4000,
        "applicationFeeReserved": 3500,
        "applicationFeeFemale": 3500,
        "officialUrl": "https://consortiumofnlus.ac.in",
        "syllabus": "Constitutional Law, Jurisprudence, Administrative Law, Law of Contract, Torts, Family Law, Criminal Law, IPR"
    },
    {
        "id": "isi_cmi_masters",
        "title": "ISI & CMI Masters Admission (M.Stat / M.Math / M.Tech CS)",
        "type": "HIGHER_STUDIES",
        "organization": "Indian Statistical Institute & Chennai Mathematical Institute",
        "level": "Postgraduate (M.Stat, M.Math, M.Sc Data Science)",
        "applicationDeadline": "2027-03-31",
        "examDate": "2027-05-09",
        "minEducationLevel": "Graduate",
        "eligibleDegrees": ["3-year Bachelor's degree with Mathematics/Statistics as core subject or B.Tech"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General", "OBC-NCL", "SC", "ST", "EWS"],
        "benefitsOrSalary": "100% Tuition Fee Waiver + Monthly Scholarship of ₹8,000 to ₹12,400 to ALL admitted students",
        "applicationFeeGeneral": 1500,
        "applicationFeeReserved": 750,
        "applicationFeeFemale": 750,
        "officialUrl": "https://www.isical.ac.in",
        "syllabus": "Rigorous Advanced Mathematics: Linear Algebra, Real Analysis, Calculus, Probability, Abstract Algebra"
    },
    {
        "id": "ugc_net_jrf",
        "title": "UGC NET / JRF Examination (Junior Research Fellowship)",
        "type": "HIGHER_STUDIES",
        "organization": "National Testing Agency (NTA) on behalf of UGC",
        "level": "Research & Academic (Ph.D. / JRF / Assistant Professorship)",
        "applicationDeadline": "2026-11-15",
        "examDate": "2026-12-10",
        "minEducationLevel": "Post-Graduate",
        "eligibleDegrees": ["Master's Degree or equivalent with min 55% marks (50% for OBC/SC/ST/Transgender)"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General", "OBC-NCL", "SC", "ST", "EWS"],
        "benefitsOrSalary": "Government JRF Fellowship: ₹37,000/month for first 2 years, ₹42,000/month (SRF) for next 3 years + HRA",
        "applicationFeeGeneral": 1150,
        "applicationFeeReserved": 325,
        "applicationFeeFemale": 600,
        "officialUrl": "https://ugcnet.nta.ac.in",
        "syllabus": "Paper 1 (Teaching & Research Aptitude, Reasoning, ICT) + Paper 2 (Subject-specific out of 83 subjects)"
    },
    {
        "id": "tiss_cuet_pg",
        "title": "TISS Masters Admission (HRM & LR, Social Work, Public Policy)",
        "type": "HIGHER_STUDIES",
        "organization": "Tata Institute of Social Sciences (TISS Mumbai/Tuljapur/Hyderabad/Guwahati)",
        "level": "Postgraduate (M.A. / M.Sc. in Human Resources, Hospital Admin, Social Work)",
        "applicationDeadline": "2027-02-05",
        "examDate": "2027-03-15",
        "minEducationLevel": "Graduate",
        "eligibleDegrees": ["Bachelor's degree of minimum 3 or 4 years duration in any discipline"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General", "OBC-NCL", "SC", "ST", "EWS"],
        "benefitsOrSalary": "Admission to flagship MA in HRM & LR (Average CTC ₹27.22 LPA, Highest CTC ₹49.0 LPA)",
        "applicationFeeGeneral": 1200,
        "applicationFeeReserved": 900,
        "applicationFeeFemale": 900,
        "officialUrl": "https://admissions.tiss.edu",
        "syllabus": "CUET-PG General Paper (COQP12) + TISS Online Personal Interview (OPI) round"
    },
    {
        "id": "nift_pg_entrance",
        "title": "NIFT Master of Fashion Management & Tech (M.F.M / M.F.Tech)",
        "type": "HIGHER_STUDIES",
        "organization": "National Institute of Fashion Technology",
        "level": "Postgraduate (M.Des, M.F.M, M.F.Tech)",
        "applicationDeadline": "2027-01-08",
        "examDate": "2027-02-07",
        "minEducationLevel": "Graduate",
        "eligibleDegrees": ["Undergraduate degree in any discipline or B.F.Tech for M.F.Tech"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General", "OBC-NCL", "SC", "ST", "EWS"],
        "benefitsOrSalary": "Admission to 18 NIFT campuses with premier placement in retail, luxury brands & e-commerce leadership",
        "applicationFeeGeneral": 3000,
        "applicationFeeReserved": 1500,
        "applicationFeeFemale": 1500,
        "officialUrl": "https://nift.ac.in",
        "syllabus": "General Ability Test (GAT) + Creative Ability Test (CAT) + Personal Interview"
    },
    {
        "id": "bits_hd_2027",
        "title": "BITS Higher Degree Admission Test (BITS HD 2027 - M.E. / M.Pharm)",
        "type": "HIGHER_STUDIES",
        "organization": "Birla Institute of Technology and Science (BITS Pilani, Goa, Hyderabad)",
        "level": "Postgraduate (Master of Engineering - M.E.)",
        "applicationDeadline": "2027-04-25",
        "examDate": "2027-05-22",
        "minEducationLevel": "Graduate",
        "eligibleDegrees": ["B.E / B.Tech or equivalent with minimum 60% aggregate marks"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General"],
        "benefitsOrSalary": "Institute Teaching Assistantship: ₹13,400/month for all admitted ME candidates + 6-month corporate Practice School",
        "applicationFeeGeneral": 3400,
        "applicationFeeReserved": 3400,
        "applicationFeeFemale": 3400,
        "officialUrl": "https://www.bitsadmission.com",
        "syllabus": "Test I (Core Mathematics & English Proficiency) + Test II (Discipline Core: CS, EEE, Mechanical, Chemical, Civil)"
    },
    {
        "id": "neet_pg_2027",
        "title": "NEET-PG 2027 (National Eligibility cum Entrance Test - MD/MS/DNB)",
        "type": "HIGHER_STUDIES",
        "organization": "National Board of Examinations in Medical Sciences (NBEMS)",
        "level": "Postgraduate (MD / MS / PG Diploma / DNB)",
        "applicationDeadline": "2027-04-20",
        "examDate": "2027-06-20",
        "minEducationLevel": "Graduate",
        "eligibleDegrees": ["MBBS degree or provisional MBBS pass certificate with 1-year completed mandatory rotatory internship"],
        "maxAnnualFamilyIncome": None,
        "genderEligibility": "ALL",
        "categoryQuotas": ["General", "OBC-NCL", "SC", "ST", "EWS"],
        "benefitsOrSalary": "All-India 50% Quota and State Quota PG Medical Seats + Monthly Junior Resident Stipend (₹65,000 - ₹1,15,000/mo)",
        "applicationFeeGeneral": 3500,
        "applicationFeeReserved": 2500,
        "applicationFeeFemale": 2500,
        "officialUrl": "https://natboard.edu.in",
        "syllabus": "Pre-Clinical, Para-Clinical, and Clinical MBBS Subjects per National Medical Commission (NMC) regulations"
    }
]

out_dir = r"C:\Users\abhin\.gemini\antigravity\scratch\gyansetu\data\higher_studies"
os.makedirs(out_dir, exist_ok=True)

# 1. Output clean Higher Studies JSON
json_path = os.path.join(out_dir, "gyansetu_higher_studies.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(higher_studies_data, f, indent=2, ensure_ascii=False)

# 2. Output clean CSV
csv_path = os.path.join(out_dir, "gyansetu_higher_studies.csv")
keys = [
    "id", "title", "type", "organization", "level", "applicationDeadline",
    "examDate", "minEducationLevel", "eligibleDegrees", "categoryQuotas",
    "benefitsOrSalary", "applicationFeeGeneral", "applicationFeeReserved",
    "officialUrl", "syllabus"
]
with open(csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=keys)
    writer.writeheader()
    for opp in higher_studies_data:
        row = dict(opp)
        row["categoryQuotas"] = "; ".join(row["categoryQuotas"])
        row["eligibleDegrees"] = "; ".join(row["eligibleDegrees"])
        # Remove keys not in header
        filtered_row = {k: row[k] for k in keys}
        writer.writerow(filtered_row)

# 3. Output Adaption AI Fine-Tuning JSONL (Instruction / Input / Output for higher studies student counseling)
jsonl_path = os.path.join(out_dir, "gyansetu_higher_studies_finetune.jsonl")

counseling_prompts = [
    (
        "I am completing my B.Tech in Computer Science and want to pursue M.Tech at an IIT with a government stipend. Which exam should I target?",
        "gate_2027"
    ),
    (
        "I am in the final year of my graduation and aiming for an MBA at top Indian institutes like IIM Ahmedabad and IIM Bangalore. What is the national entrance and syllabus?",
        "cat_2026"
    ),
    (
        "I am doing B.Sc in Mathematics and want to join Delhi University or JNU for M.Sc. What is the official common entrance exam?",
        "cuet_pg_2027"
    ),
    (
        "I want to do M.Sc in Physics or Biotechnology at IITs or IISc Bangalore. Which exam do I need to clear?",
        "iit_jam_2027"
    ),
    (
        "I am a BCA / B.Sc Computer Science student aiming for an MCA from top National Institutes of Technology (NITs). What exam and placement prospects can I expect?",
        "nimcet_2027"
    ),
    (
        "I am interested in Master of Design (M.Des) at IIT Bombay and IIT Delhi with a monthly stipend. What is the entrance test and eligibility?",
        "ceed_2027"
    ),
    (
        "I want to do a master's in design at National Institute of Design (NID). What is the exam structure and campuses?",
        "nid_dat_2027"
    ),
    (
        "Which exam should I write to join XLRI Jamshedpur for their flagship Business Management and Human Resource Management programs?",
        "xat_2027"
    ),
    (
        "I am completing my LL.B. and want to pursue an LL.M. at a National Law University (NLU) and get hired by PSUs. Which exam should I register for?",
        "clat_pg_2027"
    ),
    (
        "I love pure mathematics and statistics. Are there premier institutes offering free tuition and monthly stipends for M.Stat or M.Math?",
        "isi_cmi_masters"
    ),
    (
        "I have completed my Master's degree and want to qualify for Assistant Professor and receive a Junior Research Fellowship (JRF). Which exam provides this?",
        "ugc_net_jrf"
    ),
    (
        "I am interested in Human Resources, Social Work, and Public Policy at Tata Institute of Social Sciences (TISS). What entrance process does TISS follow?",
        "tiss_cuet_pg"
    ),
    (
        "What is the entrance examination for postgraduate fashion management (MFM) and design programs at NIFT?",
        "nift_pg_entrance"
    ),
    (
        "I want to pursue Master of Engineering (M.E.) at BITS Pilani with a teaching assistantship stipend. How can I apply?",
        "bits_hd_2027"
    ),
    (
        "I have completed my MBBS internship and want to compete for MD/MS residency seats across India. What is the exam and stipend details?",
        "neet_pg_2027"
    )
]

opp_map = {o["id"]: o for o in higher_studies_data}

with open(jsonl_path, "w", encoding="utf-8") as f:
    for query, opp_id in counseling_prompts:
        opp = opp_map[opp_id]
        record = {
            "instruction": "You are GyanSetu's AI Higher Education Advisor. Guide the student with exact eligibility requirements, exam format, deadlines, fees, and government financial support.",
            "input": query,
            "output": f"Recommendation: {opp['title']}\n"
                      f"• Conducting Body: {opp['organization']}\n"
                      f"• Target Level: {opp['level']}\n"
                      f"• Minimum Eligibility: {opp['minEducationLevel']} (Eligible Degrees: {', '.join(opp['eligibleDegrees'])})\n"
                      f"• Application Deadline: {opp['applicationDeadline']} | Exam Date: {opp['examDate']}\n"
                      f"• Quotas: {', '.join(opp['categoryQuotas'])}\n"
                      f"• Benefits & Financial Support: {opp['benefitsOrSalary']}\n"
                      f"• Application Fee: ₹{opp['applicationFeeGeneral']} (General), ₹{opp['applicationFeeReserved']} (Reserved/Female)\n"
                      f"• Syllabus: {opp['syllabus']}\n"
                      f"• Official Portal: {opp['officialUrl']}"
        }
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

print("Generated Higher Studies datasets successfully!")
print(f"JSON: {json_path}")
print(f"CSV: {csv_path}")
print(f"Fine-Tuning JSONL: {jsonl_path}")
