import { useState, useEffect, Suspense, lazy } from 'react';
import { Sidebar } from './components/Sidebar';
import type { MainNavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { ProfileView } from './components/ProfileView';
import { ProfileDrawer } from './components/ProfileDrawer';
import { DiscoveryView } from './components/DiscoveryView';
import { EligibilityEngineView } from './components/EligibilityEngineView';
import { SmartPlannerView } from './components/SmartPlannerView';
import { NotificationTrackerView } from './components/NotificationTrackerView';
import { GapAnalysisView } from './components/GapAnalysisView';
import { EligibilityTimelineView } from './components/EligibilityTimelineView';
import { DocumentReadinessView } from './components/DocumentReadinessView';

// Code-split heavy views & modals for optimal bundle size
const PreparationOverlapView = lazy(() => import('./components/PreparationOverlapView').then(m => ({ default: m.PreparationOverlapView })));
const WhatIfSimulatorView = lazy(() => import('./components/WhatIfSimulatorView').then(m => ({ default: m.WhatIfSimulatorView })));
const CostAndClashView = lazy(() => import('./components/CostAndClashView').then(m => ({ default: m.CostAndClashView })));
const ScamAndTrustView = lazy(() => import('./components/ScamAndTrustView').then(m => ({ default: m.ScamAndTrustView })));
const PeerSuccessView = lazy(() => import('./components/PeerSuccessView').then(m => ({ default: m.PeerSuccessView })));
const FamilyModeView = lazy(() => import('./components/FamilyModeView').then(m => ({ default: m.FamilyModeView })));
const WeeklyDigestModal = lazy(() => import('./components/WeeklyDigestModal').then(m => ({ default: m.WeeklyDigestModal })));
const AuthModal = lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));
const StudyChatbot = lazy(() => import('./components/StudyChatbot').then(m => ({ default: m.StudyChatbot })));
const AdaptionAiModal = lazy(() => import('./components/AdaptionAiModal').then(m => ({ default: m.AdaptionAiModal })));

const ViewLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[220px] text-slate-400 gap-2">
    <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
    <span className="text-xs font-medium">Loading view...</span>
  </div>
);

import type {
  StudentProfile,
  Opportunity,
  EligibilityReport,
  PlannedOpportunity,
  SyllabusOverlapAnalysis,
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
  DeadlineNotification
} from './types';
import { GyanSetuApi } from './api/client';
import {
  Award,
  Landmark,
  GraduationCap,
  Sparkles,
  GitCompare,
  SlidersHorizontal,
  CalendarCheck,
  LayoutDashboard,
  IndianRupee
} from 'lucide-react';

export function App() {
  // Navigation State - exact options in left sidebar:
  // "Profile", "Scholarship", "Government Schemes", "Higher Studies", "Documents", "trust and scams", "logout"
  const [activeTab, setActiveTab] = useState<MainNavTab>('home');
  const [scholarshipSubTab, setScholarshipSubTab] = useState<'overview' | 'discovery' | 'matching' | 'whatif'>('overview');
  const [govtSubTab, setGovtSubTab] = useState<'discovery' | 'matching' | 'overlap'>('discovery');
  const [higherEdSubTab, setHigherEdSubTab] = useState<'discovery' | 'matching' | 'timeline'>('discovery');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [isParentMode, setIsParentMode] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isDigestOpen, setIsDigestOpen] = useState<boolean>(false);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState<boolean>(false);

  // Theme state (Light / Dark mode persistence)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('gyansetu-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDarkMode) {
      root.classList.add('dark');
      if (body) body.classList.add('dark');
      localStorage.setItem('gyansetu-theme', 'dark');
    } else {
      root.classList.remove('dark');
      if (body) body.classList.remove('dark');
      localStorage.setItem('gyansetu-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Authentication State (PostgreSQL + BCrypt)
  const [currentUser, setCurrentUser] = useState<User | null>(() => GyanSetuApi.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Core Data States
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [eligibilityReports, setEligibilityReports] = useState<EligibilityReport[]>([]);
  const [planner, setPlanner] = useState<PlannedOpportunity[]>([]);
  const [overlapData, setOverlapData] = useState<SyllabusOverlapAnalysis | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationChange[]>([]);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis[]>([]);
  const [timeline, setTimeline] = useState<CareerTimelineNode[]>([]);
  const [costPlan, setCostPlan] = useState<ApplicationCostPlan | null>(null);
  const [clashes, setClashes] = useState<ExamClashWarning[]>([]);
  const [scamAlerts, setScamAlerts] = useState<ScamAlert[]>([]);
  const [peerStories, setPeerStories] = useState<PeerSuccessStory[]>([]);
  const [digest, setDigest] = useState<WeeklyDigest | null>(null);
  const [deadlineAlerts, setDeadlineAlerts] = useState<DeadlineNotification[]>([]);
  const [unreadAlertCount, setUnreadAlertCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Initial Data Fetching
  const loadAllData = async () => {
    setLoading(true);
    try {
      const p = await GyanSetuApi.getProfile();
      setProfile(p);

      const [opps, eligs, plan, ovlp, docs, notifs, gaps, time, costs, clsh, scams, peers, dig, alerts, unread] =
        await Promise.all([
          GyanSetuApi.getOpportunities(),
          GyanSetuApi.getEligibilityReports(),
          GyanSetuApi.getPlanner(),
          GyanSetuApi.analyzeOverlap(),
          GyanSetuApi.getDocuments(),
          GyanSetuApi.getNotifications(),
          GyanSetuApi.getGapAnalysis(),
          GyanSetuApi.getTimeline(),
          GyanSetuApi.getCosts(),
          GyanSetuApi.getClashes(),
          GyanSetuApi.getScamAlerts(),
          GyanSetuApi.getPeerStories(),
          GyanSetuApi.getWeeklyDigest(),
          GyanSetuApi.getDeadlineAlerts(currentUser?.id),
          GyanSetuApi.getUnreadAlertCount(currentUser?.id)
        ]);

      setOpportunities(opps);
      setEligibilityReports(eligs);
      setPlanner(plan);
      setOverlapData(ovlp);
      setDocuments(docs);
      setNotifications(notifs);
      setGapAnalysis(gaps);
      setTimeline(time);
      setCostPlan(costs);
      setClashes(clsh);
      setScamAlerts(scams);
      setPeerStories(peers);
      setDigest(dig);
      setDeadlineAlerts(alerts);
      setUnreadAlertCount(unread);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleToggleSave = async (id: string) => {
    const res = await GyanSetuApi.toggleSaveOpportunity(id);
    if (profile) {
      const set = new Set(profile.savedOpportunityIds);
      if (res.isSaved) set.add(id);
      else set.delete(id);
      setProfile({ ...profile, savedOpportunityIds: Array.from(set) });
    }
    const [updatedPlan, updatedDocs, updatedCosts] = await Promise.all([
      GyanSetuApi.getPlanner(),
      GyanSetuApi.getDocuments(),
      GyanSetuApi.getCosts()
    ]);
    setPlanner(updatedPlan);
    setDocuments(updatedDocs);
    setCostPlan(updatedCosts);
  };

  const handleUpdateProfile = async (updated: StudentProfile) => {
    const saved = await GyanSetuApi.updateProfile(updated);
    setProfile(saved);
    const [eligs, plan, costs, gaps, dig] = await Promise.all([
      GyanSetuApi.getEligibilityReports(),
      GyanSetuApi.getPlanner(),
      GyanSetuApi.getCosts(),
      GyanSetuApi.getGapAnalysis(),
      GyanSetuApi.getWeeklyDigest()
    ]);
    setEligibilityReports(eligs);
    setPlanner(plan);
    setCostPlan(costs);
    setGapAnalysis(gaps);
    setDigest(dig);
  };

  const handleUpdateDocumentStatus = async (id: string, status: 'READY' | 'IN_PROGRESS' | 'MISSING') => {
    const updated = await GyanSetuApi.updateDocumentStatus(id, status, user?.id);
    if (updated) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? updated : d))
      );
    } else {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status } : d))
      );
    }
  };

  const handleRefreshOverlap = async (examIds: string[]) => {
    const data = await GyanSetuApi.analyzeOverlap(examIds);
    setOverlapData(data);
  };

  const handleMarkAlertRead = async (id: number) => {
    await GyanSetuApi.markAlertRead(id);
    setDeadlineAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
    setUnreadAlertCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAlertsRead = async () => {
    await GyanSetuApi.markAllAlertsRead(currentUser?.id);
    setDeadlineAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    setUnreadAlertCount(0);
  };

  const handleAuthSuccess = async (user: User) => {
    setCurrentUser(user);
    try {
      const userProfile = await GyanSetuApi.getProfile(user.id);
      setProfile(userProfile);
      const [updatedEligs, updatedPlan, updatedAlerts, updatedUnread] = await Promise.all([
        GyanSetuApi.getEligibilityReports(user.id),
        GyanSetuApi.getPlanner(user.id),
        GyanSetuApi.getDeadlineAlerts(user.id),
        GyanSetuApi.getUnreadAlertCount(user.id)
      ]);
      setEligibilityReports(updatedEligs);
      setPlanner(updatedPlan);
      setDeadlineAlerts(updatedAlerts);
      setUnreadAlertCount(updatedUnread);
    } catch {
      if (profile && user.name) {
        setProfile({ ...profile, fullName: user.name });
      }
    }
  };

  const handleLogout = async () => {
    GyanSetuApi.clearAuthSession();
    setCurrentUser(null);
    setActiveTab('home');
    try {
      const guestProfile = await GyanSetuApi.getProfile();
      setProfile(guestProfile);
      const [updatedEligs, updatedPlan, updatedAlerts, updatedUnread] = await Promise.all([
        GyanSetuApi.getEligibilityReports(),
        GyanSetuApi.getPlanner(),
        GyanSetuApi.getDeadlineAlerts(),
        GyanSetuApi.getUnreadAlertCount()
      ]);
      setEligibilityReports(updatedEligs);
      setPlanner(updatedPlan);
      setDeadlineAlerts(updatedAlerts);
      setUnreadAlertCount(updatedUnread);
    } catch {
      // fallback
    }
  };

  const toggleParentMode = () => {
    const nextState = !isParentMode;
    setIsParentMode(nextState);
    if (nextState) {
      setActiveTab('family');
    } else {
      setActiveTab('home');
    }
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleOpportunitiesAdded = (newOpps: Opportunity[]) => {
    setOpportunities((prev) => {
      const existingIds = new Set(prev.map((o) => o.id));
      const fresh = newOpps.filter((o) => !existingIds.has(o.id));
      return [...fresh, ...prev];
    });
    GyanSetuApi.getEligibilityReports().then((reports) => {
      if (reports && reports.length > 0) {
        setEligibilityReports(reports);
      }
    });
  };

  if (loading || !profile || !digest || !costPlan) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-white border border-[#ede9fe] flex items-center justify-center p-2.5 shadow-lg shadow-[#5034df]/15 mx-auto animate-bounce">
            <img src="/logo-icon.png" alt="GyanSetu Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Gyan<span className="text-[#5034df]">Setu</span> (ज्ञानसेतु)
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Loading AI Opportunity Intelligence Engine...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter opportunities by search query
  const searchFilteredOpportunities = searchQuery.trim()
    ? opportunities.filter((o) => {
        const q = searchQuery.toLowerCase();
        return (
          o.title.toLowerCase().includes(q) ||
          o.organization.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
        );
      })
    : opportunities;

  // Filter opportunities & reports by type
  const scholarshipOpps = searchFilteredOpportunities.filter((o) => o.type === 'SCHOLARSHIP');
  const scholarshipReports = eligibilityReports.filter((r) => r.opportunityType === 'SCHOLARSHIP');

  const govtOpps = searchFilteredOpportunities.filter((o) => o.type === 'GOVT_EXAM');
  const govtReports = eligibilityReports.filter((r) => r.opportunityType === 'GOVT_EXAM');

  const higherEdOpps = searchFilteredOpportunities.filter((o) => o.type === 'HIGHER_STUDIES');
  const higherEdReports = eligibilityReports.filter((r) => r.opportunityType === 'HIGHER_STUDIES');

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0b0f19] flex text-slate-800 dark:text-slate-100 font-sans selection:bg-[#ede9fe] selection:text-[#5034df] transition-colors duration-200">
      {/* 1. Left Sidebar Navigation:
          Options displayed strictly in this order:
          "Profile", "Scholarship", "Government Schemes", "Higher Studies", "Documents", "trust and scams", "logout"
      */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t)}
        onLogout={handleLogout}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        }}
        lang={lang}
      />

      {/* 2. Main Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar matching screenshot */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          profile={profile}
          currentUser={currentUser}
          notifications={deadlineAlerts}
          unreadAlertCount={unreadAlertCount}
          onMarkAlertRead={handleMarkAlertRead}
          onMarkAllAlertsRead={handleMarkAllAlertsRead}
          onSelectOpportunity={(oppId) => {
            const opp = opportunities.find((o) => o.id === oppId);
            if (opp?.type === 'SCHOLARSHIP') {
              setActiveTab('Scholarship');
              setScholarshipSubTab('matching');
            } else if (opp?.type === 'GOVT_EXAM') {
              setActiveTab('Government Schemes');
              setGovtSubTab('matching');
            } else {
              setActiveTab('Higher Studies');
              setHigherEdSubTab('matching');
            }
          }}
          onOpenAuth={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          onOpenProfile={() => setActiveTab('Profile')}
          onOpenDigest={() => setIsDigestOpen(true)}
          onOpenAiModal={() => setIsGeminiModalOpen(true)}
          isParentMode={isParentMode}
          toggleParentMode={toggleParentMode}
          lang={lang}
          toggleLanguage={toggleLanguage}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Workspace Body */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {/* Quick Tab Header / Back to Overview Button */}
          {activeTab !== 'home' && (
            <div className="mb-5 flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="cursor-pointer text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#5034df] dark:hover:text-[#a594fd] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'अवलोकन (Overview)' : 'Overview Dashboard'}</span>
                </button>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                  {activeTab}
                </span>
              </div>

              {/* Sub-tools Quick Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab('planner')}
                  className="cursor-pointer px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#5034df] text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition flex items-center gap-1 shadow-xs"
                >
                  <CalendarCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{lang === 'hi' ? 'स्मार्ट प्लानर' : 'Smart Planner'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('overlap')}
                  className="cursor-pointer px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#5034df] text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition flex items-center gap-1 shadow-xs"
                >
                  <GitCompare className="w-3 h-3 text-[#5034df] dark:text-[#a594fd]" />
                  <span>{lang === 'hi' ? 'सिलेबस ओवरलैप' : 'Prep Overlap'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('whatif')}
                  className="cursor-pointer px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#5034df] text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition flex items-center gap-1 shadow-xs"
                >
                  <SlidersHorizontal className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>{lang === 'hi' ? 'अनुकरण (What-If)' : 'What-If Lab'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('costs')}
                  className="cursor-pointer px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#5034df] text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition flex items-center gap-1 shadow-xs"
                >
                  <IndianRupee className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{lang === 'hi' ? 'फीस व टकराव' : 'Costs & Clashes'}</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 0: HOME / DASHBOARD OVERVIEW (Matching Screenshot) */}
          <Suspense fallback={<ViewLoadingFallback />}>
            {activeTab === 'home' && (
              <DashboardOverview
              opportunities={searchFilteredOpportunities}
              eligibilityReports={eligibilityReports}
              profile={profile}
              currentUser={currentUser}
              onNavigate={(t) => setActiveTab(t)}
              onToggleSave={handleToggleSave}
              onInspectOpportunity={(id) => {
                const opp = opportunities.find((o) => o.id === id);
                if (opp?.type === 'SCHOLARSHIP') {
                  setActiveTab('Scholarship');
                  setScholarshipSubTab('matching');
                } else if (opp?.type === 'GOVT_EXAM') {
                  setActiveTab('Government Schemes');
                  setGovtSubTab('matching');
                } else {
                  setActiveTab('Higher Studies');
                  setHigherEdSubTab('matching');
                }
              }}
              onOpenAiModal={() => setIsGeminiModalOpen(true)}
              lang={lang}
            />
          )}

          {/* VIEW 1: PROFILE */}
          {activeTab === 'Profile' && (
            <ProfileView
              profile={profile}
              currentUser={currentUser}
              onSave={handleUpdateProfile}
              lang={lang}
            />
          )}

          {/* VIEW 2: SCHOLARSHIP */}
          {activeTab === 'Scholarship' && (
            <div className="space-y-6">
              {/* Category Sub-tabs */}
              <div className="flex items-center justify-between border-b border-slate-200/90 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                      {lang === 'hi' ? 'छात्रवृत्तियां व वित्तीय सहायता' : 'Scholarships & Financial Aid'}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      {scholarshipOpps.length} {lang === 'hi' ? 'सत्यापित छात्रवृत्तियां उपलब्ध' : 'Verified Central & State Scholarships'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setScholarshipSubTab('discovery')}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      scholarshipSubTab === 'discovery'
                        ? 'bg-white text-[#5034df] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'hi' ? 'सभी छात्रवृत्तियां' : 'All Scholarships'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setScholarshipSubTab('matching')}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      scholarshipSubTab === 'matching'
                        ? 'bg-white text-[#5034df] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lang === 'hi' ? 'AI पात्रता मैच' : 'AI Eligibility'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setScholarshipSubTab('whatif')}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      scholarshipSubTab === 'whatif'
                        ? 'bg-white text-[#5034df] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{lang === 'hi' ? 'व्हाट-इफ सिम्युलेटर' : 'What-If Lab'}</span>
                  </button>
                </div>
              </div>

              {scholarshipSubTab === 'discovery' && (
                <DiscoveryView
                  opportunities={scholarshipOpps}
                  profile={profile}
                  onToggleSave={handleToggleSave}
                  onInspectEligibility={() => setScholarshipSubTab('matching')}
                  lang={lang}
                />
              )}

              {scholarshipSubTab === 'matching' && (
                <EligibilityEngineView
                  reports={scholarshipReports}
                  profile={profile}
                  onToggleSave={handleToggleSave}
                  onSwitchTab={(t) => {
                    if (t === 'whatif') setScholarshipSubTab('whatif');
                  }}
                  lang={lang}
                />
              )}

              {scholarshipSubTab === 'whatif' && (
                <WhatIfSimulatorView profile={profile} lang={lang} />
              )}
            </div>
          )}

          {/* VIEW 3: GOVERNMENT SCHEMES */}
          {activeTab === 'Government Schemes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/90 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                      {lang === 'hi' ? 'सरकारी योजनाएं व भर्ती परीक्षाएं' : 'Government Schemes & Exams'}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      SSC CGL, IBPS PO, UPSC Civil Services &amp; State PSCs
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setGovtSubTab('discovery')}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      govtSubTab === 'discovery'
                        ? 'bg-white text-[#5034df] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'hi' ? 'परीक्षाएं व रिक्तियां' : 'Exams & Vacancies'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGovtSubTab('matching')}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      govtSubTab === 'matching'
                        ? 'bg-white text-[#5034df] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lang === 'hi' ? 'आयु छूट व पात्रता' : 'Relaxations & Match'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGovtSubTab('overlap')}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      govtSubTab === 'overlap'
                        ? 'bg-white text-[#5034df] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'hi' ? 'सिलेबस तालमेल' : 'Syllabus Overlap'}</span>
                  </button>
                </div>
              </div>

              {govtSubTab === 'discovery' && (
                <DiscoveryView
                  opportunities={govtOpps}
                  profile={profile}
                  onToggleSave={handleToggleSave}
                  onInspectEligibility={() => setGovtSubTab('matching')}
                  lang={lang}
                />
              )}

              {govtSubTab === 'matching' && (
                <EligibilityEngineView
                  reports={govtReports}
                  profile={profile}
                  onToggleSave={handleToggleSave}
                  onSwitchTab={() => setGovtSubTab('overlap')}
                  lang={lang}
                />
              )}

              {govtSubTab === 'overlap' && overlapData && (
                <PreparationOverlapView
                  overlapData={overlapData}
                  onRefreshOverlap={handleRefreshOverlap}
                  lang={lang}
                />
              )}
            </div>
          )}

          {/* VIEW 4: HIGHER STUDIES */}
          {activeTab === 'Higher Studies' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/90 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-[#5034df]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                      {lang === 'hi' ? 'उच्च शिक्षा एवं राष्ट्रीय प्रवेश परीक्षाएं' : 'Higher Studies & National Entrances'}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      GATE 2027 (IITs), CAT 2027 (IIMs), NTA CUET-PG (Central Universities)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setHigherEdSubTab('discovery')}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      higherEdSubTab === 'discovery'
                        ? 'bg-white text-[#5034df] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'hi' ? 'प्रवेश परीक्षाएं' : 'Entrance Exams'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHigherEdSubTab('matching')}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      higherEdSubTab === 'matching'
                        ? 'bg-white text-[#5034df] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lang === 'hi' ? 'पात्रता जांच' : 'Cutoff & Match'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHigherEdSubTab('timeline')}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      higherEdSubTab === 'timeline'
                        ? 'bg-white text-[#5034df] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CalendarCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{lang === 'hi' ? 'भविष्य रोडमैप' : 'Future Timeline'}</span>
                  </button>
                </div>
              </div>

              {higherEdSubTab === 'discovery' && (
                <DiscoveryView
                  opportunities={higherEdOpps}
                  profile={profile}
                  onToggleSave={handleToggleSave}
                  onInspectEligibility={() => setHigherEdSubTab('matching')}
                  lang={lang}
                />
              )}

              {higherEdSubTab === 'matching' && (
                <EligibilityEngineView
                  reports={higherEdReports}
                  profile={profile}
                  onToggleSave={handleToggleSave}
                  onSwitchTab={() => setHigherEdSubTab('timeline')}
                  lang={lang}
                />
              )}

              {higherEdSubTab === 'timeline' && (
                <EligibilityTimelineView
                  timeline={timeline}
                  onSelectOpportunity={() => setHigherEdSubTab('matching')}
                  lang={lang}
                />
              )}
            </div>
          )}

          {/* VIEW 5: DOCUMENTS */}
          {activeTab === 'Documents' && (
            <DocumentReadinessView
              documents={documents}
              onUpdateStatus={handleUpdateDocumentStatus}
              lang={lang}
            />
          )}

          {/* VIEW 6: TRUST AND SCAMS */}
          {activeTab === 'trust and scams' && (
            <div className="space-y-8">
              <NotificationTrackerView
                notifications={notifications}
                lang={lang}
              />
              <ScamAndTrustView
                scamAlerts={scamAlerts}
                lang={lang}
              />
            </div>
          )}

          {/* SUB-VIEWS: PLANNER, OVERLAP, WHAT-IF, COSTS, PEERS, FAMILY */}
          {activeTab === 'planner' && (
            <SmartPlannerView
              plan={planner}
              profile={profile}
              onToggleSave={handleToggleSave}
              onSwitchTab={(t) => setActiveTab(t as any)}
              lang={lang}
            />
          )}

          {activeTab === 'overlap' && overlapData && (
            <PreparationOverlapView
              overlapData={overlapData}
              onRefreshOverlap={handleRefreshOverlap}
              lang={lang}
            />
          )}

          {activeTab === 'whatif' && (
            <WhatIfSimulatorView profile={profile} lang={lang} />
          )}

          {activeTab === 'costs' && (
            <div className="space-y-8">
              <CostAndClashView
                costPlan={costPlan}
                clashes={clashes}
                profile={profile}
                lang={lang}
              />
              <GapAnalysisView
                gaps={gapAnalysis}
                onInspectAlternative={() => setActiveTab('Scholarship')}
                lang={lang}
              />
            </div>
          )}

          {activeTab === 'family' && (
            <FamilyModeView
              profile={profile}
              currentUser={currentUser}
              opportunities={opportunities}
              digest={digest}
              costPlan={costPlan}
              lang={lang}
              onToggleLanguage={toggleLanguage}
              onNavigateTab={(t) => {
                setActiveTab(t);
                if (t !== 'family') setIsParentMode(false);
              }}
            />
          )}
          </Suspense>
        </main>
      </div>

      {/* Quick Profile Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={handleUpdateProfile}
        lang={lang}
      />

      <Suspense fallback={null}>
        {/* Weekly Action Digest Modal */}
        <WeeklyDigestModal
          isOpen={isDigestOpen}
          onClose={() => setIsDigestOpen(false)}
          digest={digest}
          lang={lang}
        />

        {/* GyanSetu Study Timetable & Scheduling AI Chatbot (Bottom-Right) */}
        <StudyChatbot lang={lang} profile={profile} />

        {/* Authentication Modal (PostgreSQL & BCrypt) */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          initialMode={authModalMode}
          lang={lang}
        />

        {/* Adaption AI Dataset Importer Modal */}
        <AdaptionAiModal
          isOpen={isGeminiModalOpen}
          onClose={() => setIsGeminiModalOpen(false)}
          onOpportunitiesAdded={handleOpportunitiesAdded}
          lang={lang}
        />
      </Suspense>
    </div>
  );
}

export default App;
