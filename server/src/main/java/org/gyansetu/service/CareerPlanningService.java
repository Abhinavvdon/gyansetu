package org.gyansetu.service;

import org.gyansetu.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CareerPlanningService {

    public List<CareerTimelineNode> generateTimeline(StudentProfile profile) {
        List<CareerTimelineNode> timeline = new ArrayList<>();

        // 1. Stage: Open Today (Current Status)
        CareerTimelineNode nowNode = new CareerTimelineNode(
                "Open Today (Current Academic Window)",
                "Pre-Final Year / Ongoing Semester Opportunities",
                "Eligible right now based on your Class 12th marks (" + profile.getTwelfthMarksPercent() + "%) and enrolled degree.",
                "Complete document readiness (Income certificate, Aadhaar-NPCI seeding) and start early syllabus foundation."
        );
        nowNode.getUnlockingOpportunities().add(new CareerTimelineNode.TimelineOpportunity(
                "pm_usp_scholarship",
                "PM-USP Central Sector Scholarship",
                OpportunityType.SCHOLARSHIP,
                "₹12,000/yr college financial grant"
        ));
        nowNode.getUnlockingOpportunities().add(new CareerTimelineNode.TimelineOpportunity(
                "gate_2027",
                "GATE 2027 (Pre-Final Year Eligibility)",
                OpportunityType.HIGHER_STUDIES,
                "Eligible to appear in 3rd year for 3-year valid scorecard"
        ));
        timeline.add(nowNode);

        // 2. Stage: In 6 to 12 Months (Degree Final Year Completion)
        CareerTimelineNode finalYearNode = new CareerTimelineNode(
                "In 6 to 12 Months (Upon Degree Final Year)",
                "Full Graduate Officer & Executive Window Opens",
                "Triggers once your final year exams conclude and Bachelor's provisional degree is issued.",
                "Intensive preparation on Quant, Reasoning, and General Studies to target Group B/C Central Recruitment."
        );
        finalYearNode.getUnlockingOpportunities().add(new CareerTimelineNode.TimelineOpportunity(
                "ssc_cgl_2027",
                "SSC Combined Graduate Level (CGL) 2027",
                OpportunityType.GOVT_EXAM,
                "Income Tax Inspector, ASO in MEA (Level 7 Pay: ₹44,900 - ₹1,42,400)"
        ));
        finalYearNode.getUnlockingOpportunities().add(new CareerTimelineNode.TimelineOpportunity(
                "ibps_po_2027",
                "IBPS Probationary Officer (CRP-XV)",
                OpportunityType.GOVT_EXAM,
                "Assistant Manager in Nationalized Banks (₹52,000 - ₹68,000/mo)"
        ));
        finalYearNode.getUnlockingOpportunities().add(new CareerTimelineNode.TimelineOpportunity(
                "cat_2027",
                "CAT (Common Admission Test for IIMs)",
                OpportunityType.HIGHER_STUDIES,
                "Premier MBA admissions (Average Package ₹28+ LPA)"
        ));
        timeline.add(finalYearNode);

        // 3. Stage: In 1.5 to 2.5 Years (Post-Graduation / Mature Window)
        CareerTimelineNode matureNode = new CareerTimelineNode(
                "In 1.5 to 2.5 Years (Age 23+ / Apex Service Window)",
                "Civil Services & Specialized State Gazetted Cadres",
                "Full eligibility with mature preparation trajectory for administrative services and PSU appointments.",
                "Consolidate comprehensive GS answer writing, essay practice, and optional subject mastery."
        );
        matureNode.getUnlockingOpportunities().add(new CareerTimelineNode.TimelineOpportunity(
                "upsc_cse_2027",
                "UPSC Civil Services Examination (IAS / IPS / IFS)",
                OpportunityType.GOVT_EXAM,
                "Apex Administrative & District Magistrate positions"
        ));
        matureNode.getUnlockingOpportunities().add(new CareerTimelineNode.TimelineOpportunity(
                "state_psc_deputy_collector",
                "State Public Service Commission (State PCS)",
                OpportunityType.GOVT_EXAM,
                "Deputy Collector / DSP in your home state (" + profile.getStateDomicile() + ")"
        ));
        timeline.add(matureNode);

        return timeline;
    }
}
