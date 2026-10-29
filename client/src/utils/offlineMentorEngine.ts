import type { StudentProfile } from '../types';

/**
 * GyanSetu Intelligent Offline Study Mentor & Timetable Architect.
 * 
 * Provides rich, personalized study timetables, backlog clearance routines,
 * syllabus overlap advice, and exam preparation blueprints based on student profile
 * without requiring any external cloud API key.
 */
export function generateOfflineStudyMentorResponse(
  query: string,
  profile?: StudentProfile | null,
  lang: 'en' | 'hi' = 'en'
): string {
  const q = query.toLowerCase();
  const isHindi = lang === 'hi';

  const name = profile?.fullName ? profile.fullName.split(' ')[0] : (isHindi ? 'विद्यार्थी' : 'Student');
  const degree = profile?.currentDegree || (isHindi ? 'स्नातक (UG)' : 'Undergraduate Degree');
  const year = profile?.currentYear || 3;
  const stream = profile?.stream || 'Engineering / Technology';
  const targetExams = profile?.careerGoals && profile.careerGoals.length > 0
    ? profile.careerGoals.join(', ')
    : 'GATE, SSC CGL & Higher Studies';
  const tenth = profile?.tenthMarksPercent || 0;
  const twelfth = profile?.twelfthMarksPercent || 0;
  const category = profile?.category || 'General';

  // 1. BACKLOG / CATCHUP QUERY
  if (q.includes('backlog') || q.includes('बैकलॉग') || q.includes('fail') || q.includes('arrear') || q.includes('clear')) {
    if (isHindi) {
      return `### 🎯 ${name} के लिए बैकलॉग निकासी व कॉलेज संतुलन मास्टर-प्लान

> 💡 **स्वर्ण नियम:** बैकलॉग को कॉलेज के नियमित विषयों के साथ एक ही समय में न पढ़ें। दिन में एक **अविभाजित 90 मिनट का समर्पित बैकलॉग स्लॉट** निर्धारित करें।

#### 📊 आपकी वर्तमान शैक्षणिक स्थिति:
* **कोर्स व वर्ष:** ${degree} (वर्ष ${year}, ${stream})
* **लक्ष्य:** नियमित सेमेस्टर में 7.5+ CGPA सुरक्षित करते हुए सभी बैकलॉग 1 सेमेस्टर के भीतर शून्य करना।

#### ⏰ दैनिक अध्ययन समय-सारणी (कॉलेज समय के साथ):
* **06:00 AM - 07:30 AM | ⚡ बैकलॉग प्राथमिक स्लॉट (High Focus):**
  * केवल बैकलॉग विषय की महत्वपूर्ण यूनिट्स और पिछले 5 वर्षों के विश्वविद्यालय प्रश्नपत्र (PYQ) हल करें।
* **09:00 AM - 05:00 PM | 🏫 कॉलेज एवं लैब्स:**
  * कक्षा में 100% ध्यान दें ताकि वर्तमान विषयों का नया बैकलॉग न बने।
* **06:30 PM - 08:30 PM | 📚 वर्तमान सेमेस्टर विषय:**
  * नियमित विषयों के असाइनमेंट व लैब वर्क पूरा करें।
* **09:30 PM - 10:30 PM | 📝 25-मिनट पोमोडोरो अभ्यास:**
  * बैकलॉग विषय के 3 संख्यात्मक (Numerical) या मुख्य डेरीवेशन दोहराएं।

#### 📅 सप्ताहांत (Saturday & Sunday) रणनीति:
* **शनिवार (4 घंटे):** बैकलॉग के 2 सबसे कठिन अध्यायों के संपूर्ण नोट्स व फॉर्मूला शीट बनाएं।
* **रविवार (3 घंटे):** समयबद्ध मॉक टेस्ट दें और गलतियों की डायरी (Mistake Notebook) में सुधार नोट करें।`;
    }

    return `### 🎯 Backlog Clearance & Academic Recovery Blueprint for ${name}

> 💡 **Golden Rule:** Never mix backlog recovery into your regular semester classes. Allocate a single **dedicated, non-negotiable 90-minute daily slot** purely for backlogs.

#### 📊 Student Profile Context:
* **Enrolled Degree:** ${degree} (Year ${year}, ${stream})
* **Category:** ${category} | Past Academic Record: 10th: ${tenth}%, 12th: ${twelfth}%
* **Target Objective:** Clear outstanding subjects in 1 semester while maintaining a 7.5+ regular semester SGPA.

#### ⏰ Recommended Daily Time Schedule:
* **06:00 AM - 07:30 AM | ⚡ Dedicated Backlog Focus Slot:**
  * Highest mental clarity period. Focus solely on high-weightage chapters and past 5 years' University Exam Papers (PYQs).
* **09:00 AM - 05:00 PM | 🏫 College Lectures & Practical Labs:**
  * Maximize classroom retention to prevent new backlogs from forming in the ongoing semester.
* **06:30 PM - 08:30 PM | 📚 Ongoing Semester Subjects:**
  * Clear daily assignments, lab records, and upcoming internal test prep.
* **09:30 PM - 10:30 PM | 📝 Active Recall & Formula Drilling:**
  * Solve 3 difficult numericals or proof derivations from your backlog subject.

#### 📅 Weekend Acceleration (Saturday & Sunday):
* **Saturday Block (4 hrs):** Complete comprehensive notes and one-page cheat sheets for 2 difficult units.
* **Sunday Block (3 hrs):** Timed mock assessment matching university grading criteria and review weak areas.`;
  }

  // 2. GATE / HIGHER STUDIES SPECIFIC QUERY
  if (q.includes('gate') || q.includes('m.tech') || q.includes('गेट') || q.includes('higher study') || q.includes('cat') || q.includes('mba')) {
    if (isHindi) {
      return `### 🎯 ${name} के लिए उच्च अध्ययन व GATE / CAT तैयारी रणनीति

> 💡 **रणनीति:** अपने कॉलेज के कोर इंजीनियरिंग/मैनेजमेंट विषयों को GATE/CAT पाठ्यक्रम के साथ सिंक्रोनाइज़ (Synchronize) करें।

#### 📊 अध्ययन प्रोफ़ाइल:
* **कोर्स:** ${degree} (${stream}, वर्ष ${year})
* **लक्षित परीक्षाएं:** ${targetExams}

#### ⏰ दैनिक कार्य योजना (कॉलेज + प्रतियोगी परीक्षा):
* **06:00 AM - 07:30 AM | 📐 गणित व सामान्य योग्यता (Engineering Math & Aptitude):**
  * प्रतिदिन 15 अंक सुनिश्चित करने वाले गणित व रीजनिंग के 20 प्रश्न हल करें।
* **09:00 AM - 05:00 PM | 🏫 कॉलेज लेक्चर्स:**
  * कॉलेज की क्लास में GATE स्तर की मानक पुस्तकें (Standard Reference Books) पढ़ें।
* **06:00 PM - 08:00 PM | 🔬 कोर तकनीकी विषय (Core Technical Subject):**
  * विषयवार अवधारणाओं (Concepts) को पूरा करें और शॉर्ट-नोट्स बनाएं।
* **09:00 PM - 10:30 PM | 💡 PYQ सॉल्विंग (Last 15 Years):**
  * वर्चुअल कैलकुलेटर के साथ पिछले वर्षों के प्रश्नों का दैनिक अभ्यास।

#### 📈 3-चरणीय तैयारी रोडमैप (Next 6 Months):
* **माह 1-3:** 70% महत्वपूर्ण पाठ्यक्रम और शॉर्ट-नोट्स पूरा करना।
* **माह 4-5:** टॉपिक-वाइज और सब्जेक्ट-वाइज टेस्ट सीरीज + कमजोर क्षेत्रों का पुनरावलोकन।
* **माह 6:** 15+ फुल लेंथ मॉक टेस्ट (FLT) और फॉर्मूला रिविजन।`;
    }

    return `### 🎯 High-Yield GATE & Higher Studies Roadmap for ${name}

> 💡 **Strategy:** Synchronize your university syllabus with the national exam syllabus to double your preparation efficiency without extra hours.

#### 📊 Profile Overview:
* **Current Program:** ${degree} (${stream}, Year ${year})
* **Target Aspirations:** ${targetExams}

#### ⏰ Daily Power Routine (College + Competitive Prep):
* **06:00 AM - 07:30 AM | 📐 Engineering Mathematics & General Aptitude:**
  * High-scoring segment (28-30 marks). Practice 20 targeted numerical questions every morning.
* **09:00 AM - 05:00 PM | 🏫 College Hours:**
  * Pay active attention during core departmental classes that overlap with the syllabus.
* **06:00 PM - 08:00 PM | 🔬 Core Technical Subject Mastery:**
  * Focus on 1 core technical subject at a time. Build your personal formula notebook.
* **09:00 PM - 10:30 PM | 💡 PYQ Solving with Virtual Calculator:**
  * Practice past 15 years' questions under strict timed conditions.

#### 📈 Structured Phase Plan:
* **Phase 1 (Months 1-3):** Cover 70% highest-weightage topics and prepare 1-page formula summaries.
* **Phase 2 (Months 4-5):** Subject-wise test series, negative marking reduction, and mistake logging.
* **Phase 3 (Month 6):** 15 full-length mock exams simulating the actual 3-hour examination window.`;
  }

  // 3. GOVT EXAMS / SSC CGL / UPSC / STATE PSC
  if (q.includes('ssc') || q.includes('upsc') || q.includes('govt') || q.includes('सरकारी') || q.includes('psc') || q.includes('railway') || q.includes('banking')) {
    if (isHindi) {
      return `### 🎯 ${name} के लिए सरकारी नौकरी (SSC CGL / UPSC / Banking) अध्ययन योजना

> 💡 **स्वर्ण नियम:** सरकारी परीक्षाओं में सफलता का आधार 'गति (Speed) + सटीकता (Accuracy)' है। प्रतिदिन 30 मिनट कैलकुलेशन और करंट अफेयर्स को अवश्य दें।

#### 📊 विद्यार्थी विवरण:
* **कोर्स:** ${degree} (वर्ष ${year})
* **आरक्षण श्रेणी:** ${category} (सरकारी आयु छूट व न्यूनतम कट-ऑफ लाभ लागू)
* **लक्ष्य:** ${targetExams}

#### ⏰ दैनिक 4-स्तंभ अध्ययन समय-सारणी:
* **स्तंभ 1 (06:30 AM - 08:00 AM) | 📰 करेंट अफेयर्स व शब्दावली (Vocab):**
  * द हिंदू/दैनिक जागरण राष्ट्रीय संस्करण + 20 अंग्रेज़ी शब्द/मुहावरे।
* **स्तंभ 2 (05:30 PM - 07:00 PM) | 🧮 गणित एवं क्वांटिटेटिव एप्टीट्यूड:**
  * गति-सुधार ट्रिक्स, प्रतिशत, लाभ-हानि, अनुपात और डेटा व्याख्या (DI)।
* **स्तंभ 3 (07:30 PM - 09:00 PM) | 🧠 रीजनिंग एवं सामान्य अध्ययन (GS):**
  * भारतीय राजव्यवस्था (Polity), आधुनिक इतिहास और सामान्य विज्ञान।
* **स्तंभ 4 (09:45 PM - 10:30 PM) | ⏱️ गति टेस्ट एवं मॉक क्विज़:**
  * 25 प्रश्नों का सेक्शनल टाइमर टेस्ट।`;
    }

    return `### 🎯 Government Competitive Exams (SSC / Banking / UPSC) Blueprint for ${name}

> 💡 **Key Insight:** Competitive exams are won on 'Speed + Accuracy'. Dedicate 30 minutes every morning to mental math calculations and newspaper editorial analysis.

#### 📊 Student Profile Summary:
* **Degree:** ${degree} (Year ${year})
* **Reservation Category:** ${category} (Applicable age relaxations & fee concessions factored in)
* **Target Objectives:** ${targetExams}

#### ⏰ Daily 4-Pillar Time Allocation:
* **Pillar 1 (06:30 AM - 08:00 AM) | 📰 Daily Affairs & Vocabulary:**
  * Editorial reading, Monthly CA compilation, and 20 high-frequency vocabulary words.
* **Pillar 2 (05:30 PM - 07:00 PM) | 🧮 Quantitative Aptitude & Speed Math:**
  * Arithmetic (Percentages, Profit & Loss, Ratio) and Data Interpretation drills.
* **Pillar 3 (07:30 PM - 09:00 PM) | 🧠 Reasoning & General Studies:**
  * Indian Polity, Modern History, and NCERT-level General Science.
* **Pillar 4 (09:45 PM - 10:30 PM) | ⏱️ Sectional Speed Test:**
  * Solve 25 mixed questions with negative marking penalties enabled.`;
  }

  // 4. GENERAL TIMETABLE / STUDY HOURS QUERY
  if (isHindi) {
    return `### 🎯 ${name} के लिए व्यक्तिगत संपूर्ण अध्ययन समय-सारणी (Custom Daily Timetable)

> 💡 **संतुलन मंत्र:** 8 घंटे कॉलेज + 6 घंटे नींद + 2 घंटे खेल/विश्राम = **दैनिक 4.5 से 5 घंटे का प्रभावी अध्ययन समय**।

#### 📊 आपकी प्रोफ़ाइल संदर्भ:
* **डिग्री व वर्ष:** ${degree} (वर्ष ${year}, ${stream})
* **लक्ष्य:** ${targetExams}
* **श्रेणी:** ${category}

#### ⏰ संपूर्ण 24-घंटे का दैनिक चक्र:
* **06:00 AM - 06:30 AM:** उठना, ताज़ा होना, हल्का व्यायाम व जलपान
* **06:30 AM - 08:00 AM | स्लॉट 1 (High Focus):**
  * सबसे कठिन विषय का अध्ययन जब मस्तिष्क शांत व ऊर्जावान हो।
* **08:00 AM - 09:00 AM:** स्नान, नाश्ता और कॉलेज की तैयारी।
* **09:00 AM - 05:00 PM:** 🏫 कॉलेज लेक्चर्स, प्रैक्टिकल लैब्स एवं प्रोजेक्ट वर्क।
* **05:00 PM - 06:00 PM:** विश्राम, चाय/नाश्ता, मित्रों के साथ समय या वॉक।
* **06:00 PM - 07:30 PM | स्लॉट 2 (Practice & PYQs):**
  * संख्यात्मक प्रश्न, कोडिंग या विषयवार अभ्यास प्रश्न।
* **07:30 PM - 08:30 PM:** कॉलेज असाइनमेंट या आगामी इंटरनल टेस्ट रिविजन।
* **08:30 PM - 09:30 PM:** रात्रि भोजन व परिवार के साथ समय।
* **09:30 PM - 10:45 PM | स्लॉट 3 (Light Revision & Testing):**
  * आज दिनभर में जो पढ़ा उसका 20-मिनट त्वरित दोहराव (Active Recall)।
* **11:00 PM:** विश्राम एवं स्वस्थ 7 घंटे की नींद।

#### 📌 सफलता के 3 स्वर्णिम नियम:
1. **फोन डिस्ट्रैक्शन रोकथाम:** अध्ययन स्लॉट में फोन को 'Do Not Disturb' मोड पर रखें।
2. **सप्ताहांत टेस्ट:** प्रत्येक रविवार 10:00 AM को 2 घंटे का समयबद्ध टेस्ट दें।
3. **संदेह निवारण (Doubt Diary):** कठिन प्रश्नों को अलग डायरी में लिखें और 48 घंटे में हल करें।`;
  }

  return `### 🎯 Personalized 24-Hour Master Timetable for ${name}

> 💡 **Balance Formula:** 8h College + 7h Sleep + 4.5h Deep Study + 4.5h Personal Life = **Sustainable High Performance**.

#### 📊 Student Profile Context:
* **Program:** ${degree} (Year ${year}, ${stream})
* **Career Goals:** ${targetExams}
* **Category:** ${category}

#### ⏰ Recommended 24-Hour Daily Cycle:
* **06:00 AM - 06:30 AM:** Wake-up, hydration, and light stretching.
* **06:30 AM - 08:00 AM | Slot 1: High-Focus Core Theory:**
  * Study your most cognitively demanding subject during peak mental alertness.
* **08:00 AM - 09:00 AM:** Breakfast, grooming, and college commute.
* **09:00 AM - 05:00 PM:** 🏫 College Classes, Laboratories, and Project Work.
* **05:00 PM - 06:00 PM:** Unwind, evening tea, physical workout or walk.
* **06:00 PM - 07:30 PM | Slot 2: Numerical Problem Solving & PYQs:**
  * Active question solving for your primary target exam.
* **07:30 PM - 08:30 PM:** College assignment completion and internal assessment prep.
* **08:30 PM - 09:30 PM:** Dinner and relaxation with family/friends.
* **09:30 PM - 10:45 PM | Slot 3: Spaced Repetition & Daily Recap:**
  * Review today's formulas and self-quiz with active recall flashcards.
* **11:00 PM:** Lights out for 7 hours of restorative sleep.

#### 📌 3 Golden Rules for Academic Excellence:
1. **Zero-Distraction Zones:** Place smartphones in another room during Slot 1 and Slot 2.
2. **Weekly Sunday Reset:** Dedicate Sunday mornings (10 AM - 12 PM) to timed testing and error review.
3. **Mistake Journaling:** Record every wrongly attempted question in a dedicated notebook for weekly review.`;
}
