package org.gyansetu.model;

import java.util.ArrayList;
import java.util.List;

public class CareerTimelineNode {
    private String timeframe; // "Immediate / Open Now", "In 6 Months", "In 1 Year (Post-Graduation)", "In 2-3 Years"
    private String milestoneTitle;
    private String triggerEvent;
    private List<TimelineOpportunity> unlockingOpportunities = new ArrayList<>();
    private String prepActionToday;

    public static class TimelineOpportunity {
        private String id;
        private String title;
        private OpportunityType type;
        private String expectedBenefit;

        public TimelineOpportunity() {}
        public TimelineOpportunity(String id, String title, OpportunityType type, String expectedBenefit) {
            this.id = id;
            this.title = title;
            this.type = type;
            this.expectedBenefit = expectedBenefit;
        }
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public OpportunityType getType() { return type; }
        public void setType(OpportunityType type) { this.type = type; }
        public String getExpectedBenefit() { return expectedBenefit; }
        public void setExpectedBenefit(String expectedBenefit) { this.expectedBenefit = expectedBenefit; }
    }

    public CareerTimelineNode() {}

    public CareerTimelineNode(String timeframe, String milestoneTitle, String triggerEvent, String prepActionToday) {
        this.timeframe = timeframe;
        this.milestoneTitle = milestoneTitle;
        this.triggerEvent = triggerEvent;
        this.prepActionToday = prepActionToday;
    }

    public String getTimeframe() { return timeframe; }
    public void setTimeframe(String timeframe) { this.timeframe = timeframe; }

    public String getMilestoneTitle() { return milestoneTitle; }
    public void setMilestoneTitle(String milestoneTitle) { this.milestoneTitle = milestoneTitle; }

    public String getTriggerEvent() { return triggerEvent; }
    public void setTriggerEvent(String triggerEvent) { this.triggerEvent = triggerEvent; }

    public List<TimelineOpportunity> getUnlockingOpportunities() { return unlockingOpportunities; }
    public void setUnlockingOpportunities(List<TimelineOpportunity> unlockingOpportunities) { this.unlockingOpportunities = unlockingOpportunities; }

    public String getPrepActionToday() { return prepActionToday; }
    public void setPrepActionToday(String prepActionToday) { this.prepActionToday = prepActionToday; }
}
