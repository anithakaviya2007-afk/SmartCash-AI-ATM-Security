import React, { useState, useRef, useEffect } from 'react';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DemoControlPanel } from './components/DemoControlPanel';
import { ArrowUp, ArrowDown, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

// Views
import { WelcomeView } from './views/WelcomeView';
import { Step1FaceRecognitionView } from './views/Step1FaceRecognitionView';
import { Step2CardScanView } from './views/Step2CardScanView';
import { Step3PinVerificationView } from './views/Step3PinVerificationView';
import { Step4AccessDecisionView } from './views/Step4AccessDecisionView';
import { Step5CashWithdrawalView } from './views/Step5CashWithdrawalView';
import { CardScanView } from './views/CardScanView';
import { CardVerifiedView } from './views/CardVerifiedView';
import { FaceRecognitionView } from './views/FaceRecognitionView';
import { OtpVerificationView } from './views/OtpVerificationView';
import { AccessGrantedView } from './views/AccessGrantedView';
import { AccessDeniedView } from './views/AccessDeniedView';
import { SecureLabView } from './views/SecureLabView';
import { AtmView } from './views/AtmView';
import { DashboardView } from './views/DashboardView';
import { AccessHistoryView } from './views/AccessHistoryView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { SecurityAlertsView } from './views/SecurityAlertsView';
import { ProfileView } from './views/ProfileView';
import { AdminUsersView } from './views/AdminUsersView';

// CashGuard AI Views & Modals
import { SensorSimulatorView } from './views/SensorSimulatorView';
import { AtmListView } from './views/AtmListView';
import { AtmDetailsView } from './views/AtmDetailsView';
import { AtmMapView } from './views/AtmMapView';
import { NearbyBranchesView } from './views/NearbyBranchesView';
import { AiAssistantView } from './views/AiAssistantView';
import { ReportsView } from './views/ReportsView';
import { NotificationsView } from './views/NotificationsView';
import { AIPredictionsView } from './views/AIPredictionsView';
import { RefillTeamsView } from './views/RefillTeamsView';
import { CriticalAlarmModal } from './components/CriticalAlarmModal';
import { RefillConfirmationModal } from './components/RefillConfirmationModal';
import { ManagerLoginModal } from './components/ManagerLoginModal';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { SmsAlertToast } from './components/SmsAlertToast';

const AppContent: React.FC = () => {
  const {
    currentView,
    isRefillModalOpen,
    refillModalAtm,
    closeRefillModal,
    isManagerLoginOpen,
    setIsManagerLoginOpen,
    setIsHowItWorksOpen,
    language
  } = useSecurity();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [demoDrawerOpen, setDemoDrawerOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [canScrollDown, setCanScrollDown] = useState<boolean>(true);
  const mainRef = useRef<HTMLDivElement>(null);

  // Scroll to top whenever currentView changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  // Monitor scroll position inside main container
  const handleScroll = () => {
    if (mainRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
      setShowScrollTop(scrollTop > 120);
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 30);
    }
  };

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollSlowDown = () => {
    if (mainRef.current) {
      mainRef.current.scrollBy({ top: 320, behavior: 'smooth' });
    }
  };

  const scrollSlowUp = () => {
    if (mainRef.current) {
      mainRef.current.scrollBy({ top: -320, behavior: 'smooth' });
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'WELCOME':
        return <WelcomeView />;
      case 'STEP1_FACE':
        return <Step1FaceRecognitionView />;
      case 'STEP2_CARD':
        return <Step2CardScanView />;
      case 'STEP3_PIN':
        return <Step3PinVerificationView />;
      case 'STEP4_DECISION':
        return <Step4AccessDecisionView />;
      case 'STEP5_WITHDRAWAL':
        return <Step5CashWithdrawalView />;
      case 'FACE_RECOGNITION':
      case 'FACE_VERIFICATION':
        return <Step1FaceRecognitionView />;
      case 'CARD_SCAN':
      case 'CARD_VERIFIED':
        return <Step2CardScanView />;
      case 'OTP_VERIFICATION':
        return <Step3PinVerificationView />;
      case 'ACCESS_GRANTED':
        return <Step4AccessDecisionView />;
      case 'ACCESS_DENIED':
        return <Step4AccessDecisionView />;
      case 'SECURE_LAB':
        return <SecureLabView />;
      case 'ATM_HOME':
      case 'ATM_WITHDRAW':
      case 'ATM_CONFIRM':
      case 'ATM_SUCCESS':
      case 'ATM_BALANCE':
      case 'ATM_STATEMENT':
        return <AtmView />;
      case 'DASHBOARD':
        return <DashboardView />;
      case 'SENSOR_SIMULATOR':
        return <SensorSimulatorView />;
      case 'ATM_LIST':
        return <AtmListView />;
      case 'ATM_DETAILS':
        return <AtmDetailsView />;
      case 'ATM_MAP':
        return <AtmMapView />;
      case 'NEARBY_BRANCHES':
        return <NearbyBranchesView />;
      case 'AI_ASSISTANT':
        return <AiAssistantView />;
      case 'REPORTS':
        return <ReportsView />;
      case 'NOTIFICATIONS':
        return <NotificationsView />;
      case 'AI_PREDICTIONS':
        return <AIPredictionsView />;
      case 'REFILL_TEAMS':
        return <RefillTeamsView />;
      case 'ACCESS_HISTORY':
        return <AccessHistoryView />;
      case 'ADMIN_DASHBOARD':
        return <AdminDashboardView />;
      case 'SECURITY_ALERTS':
        return <SecurityAlertsView />;
      case 'PROFILE':
        return <ProfileView />;
      case 'ADMIN_USERS':
        return <AdminUsersView />;
      default:
        return <WelcomeView />;
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-900 text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Global Top Header with Live Clock and MFA Status */}
      <Header onToggleDemoDrawer={() => setDemoDrawerOpen(!demoDrawerOpen)} />

      {/* Main Responsive Grid Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar Navigation */}
        <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

        {/* Dynamic View Canvas */}
        <main 
          ref={mainRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto scroll-smooth pb-20 md:pb-8 relative focus:outline-none"
        >
          {renderCurrentView()}

          {/* Floating Smooth Scroll & Guide Controller */}
          <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end space-y-2 pointer-events-auto">
            {/* Quick How It Works Button */}
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-3.5 py-2 rounded-2xl shadow-xl shadow-blue-950/80 border border-blue-400/50 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              title={language === 'ta' ? '💡 எப்படி வேலை செய்கிறது? (How It Works)' : '💡 How It Works Guide'}
            >
              <HelpCircle className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span className="text-xs font-bold">
                {language === 'ta' ? 'எப்படி இயங்குகிறது?' : 'How It Works'}
              </span>
            </button>

            {/* Slow Smooth Scroll Controls */}
            <div className="flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl">
              {showScrollTop && (
                <button
                  onClick={scrollSlowUp}
                  className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white transition cursor-pointer"
                  title={language === 'ta' ? 'மெதுவாக மேலே உருட்டவும் (Slow Scroll Up)' : 'Slow Scroll Up'}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              )}

              {canScrollDown && (
                <button
                  onClick={scrollSlowDown}
                  className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white transition cursor-pointer"
                  title={language === 'ta' ? 'மெதுவாக கீழே உருட்டவும் (Slow Scroll Down)' : 'Slow Scroll Down'}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}

              {showScrollTop && (
                <button
                  onClick={scrollToTop}
                  className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-2.5 py-1.5 rounded-xl shadow-md transition cursor-pointer text-xs font-bold"
                  title={language === 'ta' ? 'மேலே செல்லவும் (Top)' : 'Scroll to top'}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-mono hidden sm:inline">
                    {language === 'ta' ? 'Top' : 'Top'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (Visible on mobile/tablet screens) */}
      <BottomNav />

      {/* Interactive How It Works Walkthrough Modal */}
      <HowItWorksModal />

      {/* Critical Cash < 30% Alarm Modal */}
      <CriticalAlarmModal />

      {/* Cash Refill Handover Confirmation Modal */}
      <RefillConfirmationModal
        isOpen={isRefillModalOpen}
        atm={refillModalAtm}
        onClose={closeRefillModal}
      />

      {/* Manager Session Authentication Modal */}
      <ManagerLoginModal
        isOpen={isManagerLoginOpen}
        onClose={() => setIsManagerLoginOpen(false)}
      />

      {/* Voice Guidance Adjustment & Sound Settings Modal */}
      <VoiceSettingsModal />

      {/* Real-time Linked Phone SMS Alert Notification */}
      <SmsAlertToast />

      {/* Prototype Demo Testing HUD & Hardware Simulation Toolbar */}
      <DemoControlPanel isOpen={demoDrawerOpen} onClose={() => setDemoDrawerOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <SecurityProvider>
      <AppContent />
    </SecurityProvider>
  );
}

