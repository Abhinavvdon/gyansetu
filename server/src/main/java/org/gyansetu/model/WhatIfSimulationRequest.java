package org.gyansetu.model;

import java.util.ArrayList;
import java.util.List;

public class WhatIfSimulationRequest {
    private Double simulatedUgMarks;
    private Double simulatedTwelfthMarks;
    private String simulatedCategory;
    private Double simulatedIncome;
    private Integer simulatedAge;
    private Boolean simulatedDegreeCompleted;

    public WhatIfSimulationRequest() {}

    public Double getSimulatedUgMarks() { return simulatedUgMarks; }
    public void setSimulatedUgMarks(Double simulatedUgMarks) { this.simulatedUgMarks = simulatedUgMarks; }

    public Double getSimulatedTwelfthMarks() { return simulatedTwelfthMarks; }
    public void setSimulatedTwelfthMarks(Double simulatedTwelfthMarks) { this.simulatedTwelfthMarks = simulatedTwelfthMarks; }

    public String getSimulatedCategory() { return simulatedCategory; }
    public void setSimulatedCategory(String simulatedCategory) { this.simulatedCategory = simulatedCategory; }

    public Double getSimulatedIncome() { return simulatedIncome; }
    public void setSimulatedIncome(Double simulatedIncome) { this.simulatedIncome = simulatedIncome; }

    public Integer getSimulatedAge() { return simulatedAge; }
    public void setSimulatedAge(Integer simulatedAge) { this.simulatedAge = simulatedAge; }

    public Boolean getSimulatedDegreeCompleted() { return simulatedDegreeCompleted; }
    public void setSimulatedDegreeCompleted(Boolean simulatedDegreeCompleted) { this.simulatedDegreeCompleted = simulatedDegreeCompleted; }
}
