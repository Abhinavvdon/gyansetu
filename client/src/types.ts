export type OpportunityType = 'SCHOLARSHIP' | 'GOVT_EXAM' | 'HIGHER_STUDIES';

export type ConfidenceLevel = 'ELIGIBLE' | 'LIKELY_ELIGIBLE' | 'NEEDS_VERIFICATION' | 'NOT_ELIGIBLE';

export interface StudentProfile {
  id: string;
  fullName: string;
  educationLevel: string;
  currentDegree: string;
  currentYear: number;
  stream: string;
  tenthMarksPercent: number;
  twelfthMarksPercent: number;
  ugMarksPercent: number;
  category: 'General' | 'OBC-NCL' | 'SC' | 'ST' | 'EWS' | 'PwD';
  annualFamilyIncome: number;
  stateDomicile: string;
  dateOfBirth: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  careerGoals: string[];
  preferredLanguages: string[];
  savedOpportunityIds: string[];
  appliedOpportunityIds: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  organization: string;
  description: string;
  applicationDeadline: string;
  examOrDisbursementDate: string;
  officialUrl: string;
  officialPdfNotificationUrl: string;
  lastVerifiedDate: string;
  isGovVerified: boolean;
  benefitsOrSalary: string;
  applicationFeeGeneral: number;
  applicationFeeReserved: number;
  applicationFeeFemale: number;
  hasFeeWaiver: boolean;
  feeWaiverNotes: string;
  minAge: number;
  maxAge: number;
  ageRelaxationOBC: number;
  ageRelaxationSCST: number;
  minGraduationMarksPercent: number;
  minTwelfthMarksPercent: number;
  maxAnnualFamilyIncome: number | null;
  eligibleStreams: string[];
  eligibleStates: string[];
  requiredDocuments: string[];
  syllabusTopics: string[];
  preparationTimeMonths: number;
  vacanciesOrSeats: number;
  competitionLevel: string;
}

export interface EligibilityReport {
  opportunityId: string;
  opportunityTitle: string;
  opportunityType: OpportunityType;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  reasonsWhyQualified: string[];
  missingCriteria: string[];
  appliedRelaxations: string[];
  officialUrl: string;
  officialPdfNotificationUrl: string;
  lastVerifiedDate: string;
  isGovVerified: boolean;
  daysRemainingToDeadline: number;
  calculatedApplicationFee: number;
  feeConcessionStatus: string;
}

export interface PlannedOpportunity {
  opportunityId: string;
  title: string;
  type: OpportunityType;
  applicationDeadline: string;
  daysRemaining: number;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  preparationTimeMonths: number;
  benefits: string;
  officialUrl: string;
  isSaved: boolean;
  priorityScore: number;
  priorityBand: string;
}

export interface SubjectOverlapDetail {
  subjectName: string;
  overlapPercent: number;
  syllabusDepthNotes: string;
}

export interface SyllabusOverlapAnalysis {
  selectedExamIds: string[];
  selectedExamTitles: string[];
  commonSubjects: string[];
  uniqueSubjectsPerExam: Record<string, string[]>;
  overallOverlapPercentage: number;
  estimatedStudyHoursSaved: number;
  recommendedStrategy: string;
  subjectBreakdown: SubjectOverlapDetail[];
}

export interface WhatIfSimulationRequest {
  simulatedUgMarks?: number;
  simulatedTwelfthMarks?: number;
  simulatedCategory?: string;
  simulatedIncome?: number;
  simulatedAge?: number;
  simulatedDegreeCompleted?: boolean;
}

export interface UnlockedItem {
  id: string;
  title: string;
  type: OpportunityType;
  unlockReason: string;
  benefits: string;
}

export interface WhatIfSimulationResponse {
  baselineEligibleCount: number;
  simulatedEligibleCount: number;
  netUnlockedCount: number;
  unlockedOpportunities: UnlockedItem[];
  strategicInsights: string[];
}

export interface DocumentItem {
  id: string;
  name: string;
  requiredByOpportunities: string[];
  status: 'READY' | 'IN_PROGRESS' | 'MISSING';
  typicalLeadDays: number;
  issuingAuthority: string;
  validityPeriod: string;
  proTips: string;
  isUrgent: boolean;
}

export interface NotificationChange {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  changeType: string;
  headline: string;
  summary: string;
  oldValue: string;
  newValue: string;
  dateDetected: string;
  officialGazetteLink: string;
  verifiedByAdmin: boolean;
}

export interface ClosestAlternative {
  id: string;
  title: string;
  type: OpportunityType;
  whyRecommended: string;
}

export interface GapAnalysis {
  opportunityId: string;
  opportunityTitle: string;
  opportunityType: OpportunityType;
  exactGapStatement: string;
  gapParameter: string;
  studentCurrentValue: string;
  requiredThreshold: string;
  actionableRemedy: string;
  closestAlternatives: ClosestAlternative[];
}

export interface TimelineOpportunity {
  id: string;
  title: string;
  type: OpportunityType;
  expectedBenefit: string;
}

export interface CareerTimelineNode {
  timeframe: string;
  milestoneTitle: string;
  triggerEvent: string;
  unlockingOpportunities: TimelineOpportunity[];
  prepActionToday: string;
}

export interface OpportunityCostDetail {
  opportunityId: string;
  opportunityTitle: string;
  originalFee: number;
  finalPayableFee: number;
  isCompletelyWaived: boolean;
  waiverCategoryApplied: string;
}

export interface ApplicationCostPlan {
  standardTotalFee: number;
  studentDiscountedTotalFee: number;
  totalSavedViaWaivers: number;
  estimatedTravelAndCenterCost: number;
  estimatedBooksAndPrepCost: number;
  grandTotalEstimatedExpense: number;
  itemizedCosts: OpportunityCostDetail[];
}

export interface ExamClashWarning {
  id: string;
  exam1Id: string;
  exam1Title: string;
  exam1Date: string;
  exam2Id: string;
  exam2Title: string;
  exam2Date: string;
  daysApart: number;
  severity: string;
  recommendationAdvice: string;
}

export interface ScamAlert {
  id: string;
  fakeClaimOrDomain: string;
  officialGenuinePortal: string;
  warningLevel: string;
  scamPatternDescription: string;
  safetyTip: string;
  dateReported: string;
}

export interface PeerSuccessStory {
  id: string;
  studentAlias: string;
  homeState: string;
  collegeBackground: string;
  graduationMarks: number;
  socialCategory: string;
  appliedCombo: string[];
  clearedExamOrAward: string;
  currentRoleOrStipend: string;
  strategicQuote: string;
}

export interface WeeklyDigest {
  studentName: string;
  weekLabel: string;
  upcomingDeadlinesCount: number;
  newMatchesCount: number;
  documentsUrgentCount: number;
  feeSavingsToDate: number;
  upcomingDeadlineHighlights: string[];
  newMatchHighlights: string[];
  urgentDocumentAlerts: string[];
  whatsAppFormattedMessage: string;
  hindiParentSummary: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string | null;
  userId?: number | null;
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface DeadlineNotification {
  id: number;
  userId?: number | null;
  opportunityId: string;
  opportunityTitle: string;
  type: 'DEADLINE_URGENT' | 'DEADLINE_APPROACHING' | 'DATE_EXTENDED' | 'DOCUMENT_ALERT';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  daysRemaining: number;
  officialUrl?: string;
  actionLabel?: string;
  read: boolean;
  emailSent: boolean;
  createdAt: string;
}
