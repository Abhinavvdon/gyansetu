# 🎓 GyanSetu (ज्ञानसेतु)
### *AI-Powered Opportunity & Career Intelligence Platform for Indian Students*

> **"पुल सपनों से सफलता का — Bridge from Ambition to Opportunity"**

---

## 🌟 Overview & Architecture

**GyanSetu** is an intelligent, student-friendly platform specifically tailored for Indian students. It integrates opportunities across three core educational pillars:
1. **Scholarships** (Central Sector Schemes, State Domicile Post-Matric Waivers, Girl Student Empowement)
2. **Higher Study Options** (GATE, CAT, CUET-PG Central Universities)
3. **Government Examinations** (UPSC CSE, SSC CGL, Banking IBPS PO, Railways RRB NTPC, State PSCs)

### 🏗️ Technology Stack
- **Frontend**: **React.js 19** + **TypeScript** + **Vite** + **Tailwind CSS** + **Lucide Icons**
  - Modern student-friendly layout with deep royal purple gradient hero banner, clean white sidebar navigation, and soft pastel category cards.
  - Sidebar options: `"Profile"`, `"Scholarship"`, `"Government Schemes"`, `"Higher Studies"`, `"Documents"`, `"trust and scams"`, `"logout"`.
  - Bilingual support (English & हिन्दी).
  - Responsive mobile, tablet, and desktop layout.
  - Native browser Text-to-Speech (Web Speech API) audio guidance for parents and rural students.
- **Backend**: **Java Spring Boot 3.3.4** + **Java 17** + **Maven** + **Spring Data JPA** + **PostgreSQL**
  - RESTful API endpoints with full CORS integration.
  - BCrypt password encryption (10 rounds) for secure user authentication.
  - PostgreSQL persistent storage for registered students and sessions.
  - Cross-opportunity evaluation engine.
  - Preparation overlap analyzer.
  - Dynamic simulation solver.
  - Document lead-time bottleneck tracker.
  - Application fee waiver calculator and exam date collision radar.
- **Database**: **PostgreSQL 14** (Database: `gyansetu`, Port: `5434`)
  - Stores student accounts, hashed passwords, roles, and timestamps.

---

## 🚀 Live Running Endpoints

| Component | URL | Status |
|---|---|---|
| **Frontend Web App** | [http://localhost:5173/](http://localhost:5173/) | 🟢 **Live & Running** |
| **Spring Boot REST API** | [http://localhost:8085/api](http://localhost:8085/api) | 🟢 **Live & Running** |

---

## 💎 Features Implemented

### 1. Core Platform Capabilities
- **Personalised Profile Engine**:
  - Detailed student tracking: 10th %, 12th %, UG degree %, stream, age/DOB, social category (`General`, `OBC-NCL`, `SC`, `ST`, `EWS`, `PwD`), annual family income, state domicile, gender, and career ambitions.
- **Opportunity Discovery**:
  - Multi-category catalog with instant search, domicile state filters, application deadlines, benefits breakdown, and direct government links.
- **AI-Based Eligibility Matching**:
  - Multi-tier confidence scoring:
    - 🟢 `ELIGIBLE` (100% criteria met)
    - 🔵 `LIKELY_ELIGIBLE` (Pending minor documentation / final result)
    - 🟡 `NEEDS_VERIFICATION` (Pending state domicile / income validation)
    - 🔴 `NOT_ELIGIBLE` (Clear gap like age or stream cutoff)
- **Eligibility Explanation & Source-Linked Verification**:
  - Detailed bullet-point breakdown: *"Why you qualify"*, *"Missing criteria"*, *"Category relaxations applied"*, *"Calculated application fee with concessions"*, and *"Last-verified date from official government gazette"*.
- **Deadline Tracking & Smart Planner**:
  - Save/bookmark opportunities, dynamic countdown days remaining, priority score (0-100) combining urgency, eligibility confidence, and preparation effort.

---

### 2. Five Unique Main Functions
1. **Cross-Opportunity Eligibility Engine**:
   - Single student profile evaluated across Scholarships, Higher Studies, and Govt Exams simultaneously.
2. **Smart Opportunity Planner**:
   - Compares deadlines, eligibility, vacancies, and preparation time to categorize targets into *Top Priority*, *Secondary Targets*, and *Backup Options*.
3. **Preparation Overlap Detector**:
   - Identifies common subjects across candidate exams (e.g., SSC CGL + IBPS PO + RRB NTPC).
   - Computes syllabus overlap percentage (e.g., 86% between SSC and RRB NTPC).
   - Calculates study hours saved (e.g., ~140 hours saved) and provides an optimal study sequence.
4. **What-If Eligibility Simulator**:
   - Interactive sliders for Graduation Marks %, 12th Marks %, Category switch, Family Income, and Age.
   - Instantly shows newly unlocked opportunities in real-time as sliders change.
5. **Explainable & Source-Linked Matching**:
   - Direct verification badges from `.gov.in` and `.nic.in` domains with verification timestamps.

---

### 3. Four Strongest Differentiators
1. **Document Readiness Checker**:
   - Interactive checklist for required paperwork: Income Certificate, Caste Certificate, State Domicile, College Bonafide, Aadhaar-NPCI Seeding.
   - Status tracking (`Ready`, `In Progress`, `Missing`).
   - Realistic Tehsil / CSC lead times (e.g., 14-21 days) with **Urgent Action Warnings** when deadlines are threatened.
2. **Notification Change Tracker**:
   - Live updates and gazette corrigendums (e.g., *SSC CGL deadline extended by 10 days*, *RRB NTPC added 1,200 vacancies*, *NSP biometric rules*).
3. **Missed-It-By-How-Much Gap Analysis**:
   - For borderline opportunities, highlights exact pinpoint gap (*"You missed cutoff by 2.8% marks"*, *"Age limit exceeded by 4 months"*).
   - Working backwards, immediately suggests 2-3 closest alternatives the student is eligible for right now.
4. **Eligibility Timeline (Future Career Horizon)**:
   - 1 to 3-year forward roadmap:
     - Phase 1: Open Today (Pre-Final Year / Ongoing Degree)
     - Phase 2: In 6 to 12 Months (Upon Final Year Graduation)
     - Phase 3: In 1.5 to 2.5 Years (Age 23+ / Apex Administrative Services)

---

### 4. Practical Features Students Actually Use
- **Application Cost Planner & Fee-Waiver Finder**:
  - Calculates total form fees across all shortlisted exams.
  - Automatically applies category exemptions (₹0 fee for Female, SC, ST, and PwD candidates).
  - Estimates travel and self-study test series allowance.
- **Exam Clash Detector**:
  - Highlights exam dates scheduled within 0-5 days of each other with priority recommendations to avoid travel conflicts.
- **Regional & Language Filter**:
  - Filters by state domicile (Madhya Pradesh, Uttar Pradesh, Bihar, Rajasthan, Maharashtra, etc.) and regional language availability.

---

### 5. Engagement & Trust Features
- **Scam & Fake-Notice Alert System**:
  - Flags known fake domains (e.g. `ssc-online-gov.in`) and viral WhatsApp hoaxes with PIB Fact-Check guidelines.
- **Peer Success Paths**:
  - Anonymized student success case studies showing the exam & scholarship combinations that worked.
- **Family & Parent Mode (परिवार मोड)**:
  - Simplified Hindi interface with large fonts, financial savings summary, and **Text-to-Speech audio guide ("🔊 आवाज़ में सुनें")** for parents and rural students.
- **Weekly Action Digest**:
  - Actionable modal previewing simulated WhatsApp/Email digest with one-click copy and share buttons.

---

## 🛠️ Project Structure

```
gyansetu/
├── client/                           # React 19 Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts             # API Client with live backend & fallback engine
│   │   ├── components/
│   │   │   ├── Navbar.tsx            # Header, tab navigation & parent mode toggle
│   │   │   ├── ProfileDrawer.tsx     # Student profile editor
│   │   │   ├── DiscoveryView.tsx     # Filterable opportunity catalog
│   │   │   ├── EligibilityEngineView.tsx # AI match explanation cards
│   │   │   ├── SmartPlannerView.tsx  # Priority matrix & plan
│   │   │   ├── PreparationOverlapView.tsx # Syllabus overlap detector
│   │   │   ├── WhatIfSimulatorView.tsx # Interactive slider simulator
│   │   │   ├── DocumentReadinessView.tsx # Paperwork & CSC lead-time tracker
│   │   │   ├── NotificationTrackerView.tsx # Live corrigendum alerts
│   │   │   ├── GapAnalysisView.tsx   # Missed-it-by-how-much solver
│   │   │   ├── EligibilityTimelineView.tsx # 1-3 year future horizon
│   │   │   ├── CostAndClashView.tsx  # Fee waivers & exam date collisions
│   │   │   ├── ScamAndTrustView.tsx  # Anti-fraud radar & genuine portal rule
│   │   │   ├── PeerSuccessView.tsx   # Peer combination paths
│   │   │   ├── FamilyModeView.tsx    # Hindi parent view with Audio TTS
│   │   │   └── WeeklyDigestModal.tsx # WhatsApp action summary modal
│   │   ├── App.tsx                   # Main root view & tab manager
│   │   ├── types.ts                  # TypeScript data interfaces
│   │   └── index.css                 # Tailwind base styles
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── server/                           # Java Spring Boot 3.3 Backend
    ├── src/main/java/org/gyansetu/
    │   ├── GyansetuApplication.java  # Main Application & CORS Config
    │   ├── controller/
    │   │   └── GyanSetuApiController.java # Full REST API Endpoints
    │   ├── model/                    # Domain POJOs & DTOs
    │   │   ├── StudentProfile.java
    │   │   ├── Opportunity.java
    │   │   ├── EligibilityReport.java
    │   │   ├── SyllabusOverlapAnalysis.java
    │   │   ├── WhatIfSimulationRequest.java
    │   │   ├── WhatIfSimulationResponse.java
    │   │   ├── DocumentItem.java
    │   │   ├── NotificationChange.java
    │   │   ├── GapAnalysis.java
    │   │   ├── CareerTimelineNode.java
    │   │   ├── ApplicationCostPlan.java
    │   │   ├── ExamClashWarning.java
    │   │   ├── ScamAlert.java
    │   │   ├── PeerSuccessStory.java
    │   │   └── WeeklyDigest.java
    │   └── service/                  # Business Logic & Algorithms
    │       ├── DataRepository.java   # Verified opportunities & seed data
    │       ├── EligibilityEngineService.java
    │       ├── PlannerService.java
    │       ├── OverlapDetectorService.java
    │       ├── WhatIfSimulatorService.java
    │       ├── DocumentReadinessService.java
    │       ├── NotificationTrackerService.java
    │       ├── GapAnalysisService.java
    │       ├── CareerPlanningService.java
    │       ├── CostAndClashService.java
    │       └── TrustAndEngagementService.java
    ├── src/main/resources/
    │   └── application.properties    # Port 8085 configuration
    ├── mvnw.cmd                      # Maven Wrapper
    └── pom.xml
```

---

## 🏃 Running Locally

### 1. Run Spring Boot Backend
```powershell
cd server
./mvnw.cmd spring-boot:run
```
*API available at: `http://localhost:8085/api`*

### 2. Run React Frontend
```powershell
cd client
npm run dev
```
*Web App available at: `http://localhost:5173/`*

---

## ☁️ Deploying on Render (Cloud Production)

GyanSetu includes native support for **[Render.com](https://render.com)** deployment:
- **Render Blueprint (`render.yaml`)**: Automated 1-click deployment provisioning a managed PostgreSQL database and unified fullstack Web Service.
- **Multi-Stage `Dockerfile`**: Packages React 19 + Spring Boot 3.3.4 into a lightweight, container-aware Alpine image tuned for Render's Free Tier (512MB RAM cap).
- **Auto-Configuring Database**: Automatically converts Render's `DATABASE_URL` (`postgres://...`) to standard JDBC.

👉 **See the complete step-by-step instructions in [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md).**
