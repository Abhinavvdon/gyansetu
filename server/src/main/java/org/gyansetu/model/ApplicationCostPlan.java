package org.gyansetu.model;

import java.util.ArrayList;
import java.util.List;

public class ApplicationCostPlan {
    private double standardTotalFee;
    private double studentDiscountedTotalFee;
    private double totalSavedViaWaivers;
    private double estimatedTravelAndCenterCost;
    private double estimatedBooksAndPrepCost;
    private double grandTotalEstimatedExpense;
    private List<OpportunityCostDetail> itemizedCosts = new ArrayList<>();

    public static class OpportunityCostDetail {
        private String opportunityId;
        private String opportunityTitle;
        private double originalFee;
        private double finalPayableFee;
        private boolean isCompletelyWaived;
        private String waiverCategoryApplied;

        public OpportunityCostDetail() {}
        public OpportunityCostDetail(String opportunityId, String opportunityTitle, double originalFee,
                                     double finalPayableFee, boolean isCompletelyWaived, String waiverCategoryApplied) {
            this.opportunityId = opportunityId;
            this.opportunityTitle = opportunityTitle;
            this.originalFee = originalFee;
            this.finalPayableFee = finalPayableFee;
            this.isCompletelyWaived = isCompletelyWaived;
            this.waiverCategoryApplied = waiverCategoryApplied;
        }

        public String getOpportunityId() { return opportunityId; }
        public void setOpportunityId(String opportunityId) { this.opportunityId = opportunityId; }
        public String getOpportunityTitle() { return opportunityTitle; }
        public void setOpportunityTitle(String opportunityTitle) { this.opportunityTitle = opportunityTitle; }
        public double getOriginalFee() { return originalFee; }
        public void setOriginalFee(double originalFee) { this.originalFee = originalFee; }
        public double getFinalPayableFee() { return finalPayableFee; }
        public void setFinalPayableFee(double finalPayableFee) { this.finalPayableFee = finalPayableFee; }
        public boolean isCompletelyWaived() { return isCompletelyWaived; }
        public void setCompletelyWaived(boolean completelyWaived) { isCompletelyWaived = completelyWaived; }
        public String getWaiverCategoryApplied() { return waiverCategoryApplied; }
        public void setWaiverCategoryApplied(String waiverCategoryApplied) { this.waiverCategoryApplied = waiverCategoryApplied; }
    }

    public ApplicationCostPlan() {}

    public double getStandardTotalFee() { return standardTotalFee; }
    public void setStandardTotalFee(double standardTotalFee) { this.standardTotalFee = standardTotalFee; }

    public double getStudentDiscountedTotalFee() { return studentDiscountedTotalFee; }
    public void setStudentDiscountedTotalFee(double studentDiscountedTotalFee) { this.studentDiscountedTotalFee = studentDiscountedTotalFee; }

    public double getTotalSavedViaWaivers() { return totalSavedViaWaivers; }
    public void setTotalSavedViaWaivers(double totalSavedViaWaivers) { this.totalSavedViaWaivers = totalSavedViaWaivers; }

    public double getEstimatedTravelAndCenterCost() { return estimatedTravelAndCenterCost; }
    public void setEstimatedTravelAndCenterCost(double estimatedTravelAndCenterCost) { this.estimatedTravelAndCenterCost = estimatedTravelAndCenterCost; }

    public double getEstimatedBooksAndPrepCost() { return estimatedBooksAndPrepCost; }
    public void setEstimatedBooksAndPrepCost(double estimatedBooksAndPrepCost) { this.estimatedBooksAndPrepCost = estimatedBooksAndPrepCost; }

    public double getGrandTotalEstimatedExpense() { return grandTotalEstimatedExpense; }
    public void setGrandTotalEstimatedExpense(double grandTotalEstimatedExpense) { this.grandTotalEstimatedExpense = grandTotalEstimatedExpense; }

    public List<OpportunityCostDetail> getItemizedCosts() { return itemizedCosts; }
    public void setItemizedCosts(List<OpportunityCostDetail> itemizedCosts) { this.itemizedCosts = itemizedCosts; }
}
