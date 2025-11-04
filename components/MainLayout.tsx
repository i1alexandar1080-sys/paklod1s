import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HomeScreen } from './HomeScreen';
import { TaskScreen } from './TaskScreen';
import { TeamScreen } from './TeamScreen';
import { VIPScreen } from './VIPScreen';
import { MeScreen } from './MeScreen';
import { BottomNav } from './BottomNav';
import { LanguageSelector } from './LanguageSelector';
import { WithdrawScreen } from './WithdrawScreen';
import { RechargeSelectScreen } from './RechargeSelectScreen';
import { RechargeDetailsScreen } from './RechargeDetailsScreen';
import { ChevronLeftIcon, GlobeIcon, CalendarIcon, GiftIcon, HeadsetIcon, EnvelopeIcon } from './icons';
import { TeamDetailsScreen } from './TeamDetailsScreen';
import { FinancialRecordsScreen } from './FinancialRecordsScreen';
import { AccountScreen } from './AccountScreen';
import { ChangePasswordScreen } from './ChangePasswordScreen';
import { CompanyProfileScreen } from './CompanyProfileScreen';
import { LoginRewardsModal } from './LoginRewardsModal';
import { CustomerServiceModal } from './CustomerServiceModal';
import { NotificationsScreen } from './NotificationsScreen';
import { NotificationDetailsScreen } from './NotificationDetailsScreen';
import { db, type User, type PlatformSettingsData } from '../lib/mockDatabase';
import { InfoModal } from './InfoModal';
import { ActivityDetailsScreen } from './ActivityDetailsScreen';

// Toast component for short, temporary messages
const Toast: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 text-white px-6 py-3 rounded-lg shadow-lg z-[999] animate-fade-in-out-toast">
            {message}
        </div>
    );
};


interface MainLayoutProps {
  user: User;
  isLanguageSelectorOpen: boolean;
  setIsLanguageSelectorOpen: (isOpen: boolean) => void;
  selectedLanguageCode: string;
  getLanguageName: (code: string) => string;
  handleLanguageSelect: (code: string) => void;
  onSignOut: () => void;
  platformSettings: PlatformSettingsData;
  onAppInstall: () => void;
  onUserUpdate: () => void;
}

type RechargeConfig = { amount: number; currency: string; network: string; };

type InfoModalData = {
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
};

export const MainLayout: React.FC<MainLayoutProps> = ({
  user,
  isLanguageSelectorOpen,
  setIsLanguageSelectorOpen,
  selectedLanguageCode,
  getLanguageName,
  handleLanguageSelect,
  onSignOut,
  platformSettings,
  onAppInstall,
  onUserUpdate
}) => {
  const { t } = useTranslation();
  const [viewHistory, setViewHistory] = useState<string[]>(['home']);
  const [rechargeConfig, setRechargeConfig] = useState<RechargeConfig | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoginRewardsModalOpen, setLoginRewardsModalOpen] = useState(false);
  const [isCustomerServiceModalOpen, setCustomerServiceModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<InfoModalData | null>(null);
  const [toasts, setToasts] = useState<{ id: number, message: string }[]>([]);
  const toastIdCounter = useRef(0);

  const showInfoModal = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setInfoModal({ title, message, type });
  };

  const showToast = (message: string) => {
    const id = toastIdCounter.current++;
    // Only show one toast at a time in the center.
    setToasts([{ id, message }]);

    setTimeout(() => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000); // Duration matches the CSS animation.
  };

  const currentView = viewHistory[viewHistory.length - 1];
  const mainTabs = ['home', 'task', 'team', 'vip', 'me'];
  const activeTab = mainTabs.find(tab => currentView.startsWith(tab)) || 'home';

  const navigateTo = (view: string) => {
    setViewHistory(prev => [...prev, view]);
  };

  const handleBack = () => {
    if (viewHistory.length > 1) {
      setViewHistory(prev => prev.slice(0, -1));
    }
  };

  const handleTabChange = (tab: string) => {
    setViewHistory([tab]);
  };

  const handleRechargeProceed = (config: RechargeConfig) => {
    setRechargeConfig(config);
    navigateTo('recharge_details');
  };

  const handleScroll = () => {
    if (scrollRef.current) {
        setIsScrolled(scrollRef.current.scrollTop > 10);
    }
  };
  
  const getHeaderTitle = () => {
      const titleMap: { [key: string]: string } = {
          'recharge_select': t('recharge'),
          'recharge_details': t('rechargeDetails'),
          'withdraw': t('withdraw'),
          'financial_records': t('financialRecords'),
          'account': t('account'),
          'change_password': t('changePassword'),
          'company_profile': t('companyProfile'),
          'notifications': t('systemInformation'),
      };
      if (currentView.startsWith('team_details_')) {
        return t('details');
      }
      if (currentView.startsWith('notification_details_')) {
          return t('systemNotice');
      }
      if (currentView.startsWith('activity_details_')) {
          return t('share');
      }
      return titleMap[currentView] || '';
  };

  const renderContent = () => {
    const screenProps = {
      user,
      navigateTo,
      setIsLanguageSelectorOpen,
      selectedLanguageCode,
      getLanguageName,
      onUserUpdate,
      showInfoModal,
      showToast,
    };

    if (currentView.startsWith('team_details_')) {
        const level = parseInt(currentView.split('_')[2], 10);
        return <TeamDetailsScreen level={level} user={user} platformSettings={platformSettings} />;
    }
    
    if (currentView.startsWith('notification_details_')) {
        const messageId = parseInt(currentView.split('_')[2], 10);
        return <NotificationDetailsScreen messageId={messageId} platformSettings={platformSettings} />;
    }

    if (currentView.startsWith('activity_details_')) {
        const activityId = currentView.split('_')[2];
        return <ActivityDetailsScreen 
                    activityId={activityId} 
                    platformSettings={platformSettings} 
                    user={user} 
                    showInfoModal={showInfoModal}
                />;
    }

    switch (currentView) {
      case 'home':
        return <HomeScreen {...screenProps} platformSettings={platformSettings} onAppInstall={onAppInstall} onUserUpdate={onUserUpdate} />;
      case 'task':
        return <TaskScreen {...screenProps} />;
      case 'team':
        return <TeamScreen {...screenProps} platformSettings={platformSettings} />;
      case 'vip':
        return <VIPScreen navigateTo={navigateTo} user={user} platformSettings={platformSettings} />;
      case 'me':
        return <MeScreen onSignOut={onSignOut} {...screenProps} platformSettings={platformSettings}/>;
      case 'recharge_select':
        return <RechargeSelectScreen onProceed={handleRechargeProceed} platformSettings={platformSettings} />;
      case 'recharge_details':
        return <RechargeDetailsScreen config={rechargeConfig} onBack={handleBack} user={user} platformSettings={platformSettings}/>;
      case 'withdraw':
        return <WithdrawScreen user={user} showInfoModal={showInfoModal} platformSettings={platformSettings} />;
      case 'financial_records':
        return <FinancialRecordsScreen user={user} platformSettings={platformSettings} />;
      case 'account':
        return <AccountScreen user={user} platformSettings={platformSettings} />;
      case 'change_password':
        return <ChangePasswordScreen user={user} onPasswordChanged={handleBack} platformSettings={platformSettings} />;
      case 'company_profile':
        return <CompanyProfileScreen platformSettings={platformSettings} />;
      case 'notifications':
        return <NotificationsScreen {...screenProps} platformSettings={platformSettings} />;
      default:
        return <HomeScreen {...screenProps} platformSettings={platformSettings} onAppInstall={onAppInstall} onUserUpdate={onUserUpdate} />;
    }
  };
  
  const messages = db.getMessagesForUser(user.id);
  const unreadCount = messages.filter(msg => !user.readMessageIds.includes(msg.id)).length;

  const isStickyHeaderVisible = mainTabs.includes(activeTab) && viewHistory.length === 1;
  const isSubViewHeaderVisible = viewHistory.length > 1;

  return (
    <div className="flex flex-col w-full h-full">
      {isStickyHeaderVisible && (
        <header 
            className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-4 pt-4 pb-3 transition-colors duration-300"
            style={{ backgroundColor: isScrolled ? platformSettings.headerColor : 'transparent' }}
        >
            <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1 rounded-md">
                   <img src={platformSettings.logoUrl} alt="logo" className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold">{platformSettings.name}</h1>
            </div>
            <button onClick={() => setIsLanguageSelectorOpen(true)} className="flex items-center gap-1.5 text-sm bg-black/20 px-3 py-1 rounded-full">
                <GlobeIcon className="w-5 h-5"/>
                <span>{getLanguageName(selectedLanguageCode)}</span>
            </button>
        </header>
      )}

      {isSubViewHeaderVisible && (
        <header className="p-4 flex items-center gap-4 flex-shrink-0">
           <button onClick={handleBack} className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold">{getHeaderTitle()}</h2>
        </header>
      )}

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className={`flex-grow overflow-y-auto pb-20 no-scrollbar ${isStickyHeaderVisible ? 'pt-20' : ''} ${isSubViewHeaderVisible && !mainTabs.includes(currentView) ? '' : ''}`}>
        {renderContent()}
      </div>
      
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} platformSettings={platformSettings} />
      
      {mainTabs.includes(activeTab) && (
        <div className="fixed bottom-24 right-4 space-y-3 z-30">
            {activeTab === 'home' && (
                <button onClick={() => setLoginRewardsModalOpen(true)} className="w-12 h-12 bg-[#1c0f3b] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2e194a] transition-colors">
                    <CalendarIcon className="w-6 h-6 text-white"/>
                </button>
            )}
            {activeTab === 'home' && (
                <button className="w-12 h-12 bg-[#1c0f3b] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2e194a] transition-colors">
                    <GiftIcon className="w-6 h-6 text-white"/>
                </button>
            )}
            <button onClick={() => setCustomerServiceModalOpen(true)} className="w-12 h-12 bg-[#1c0f3b] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2e194a] transition-colors overflow-hidden">
                {platformSettings.customerServiceIconUrl && platformSettings.customerServiceIconUrl.startsWith('data:image/svg') ? (
                    <img src={platformSettings.customerServiceIconUrl} alt="Customer Service" className="w-6 h-6" />
                ) : (
                    <img src={platformSettings.customerServiceIconUrl} alt="Customer Service" className="w-full h-full object-cover" />
                )}
            </button>
            <button onClick={() => navigateTo('notifications')} className="relative w-12 h-12 bg-[#1c0f3b] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2e194a] transition-colors">
                <EnvelopeIcon className="w-6 h-6 text-white"/>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 border-2 border-[#1c0f3b]"></span>
                )}
            </button>
        </div>
      )}

      {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} />
      ))}

      <LanguageSelector
          isOpen={isLanguageSelectorOpen}
          onClose={() => setIsLanguageSelectorOpen(false)}
          selectedLanguageCode={selectedLanguageCode}
          onSelectLanguage={handleLanguageSelect}
        />
        
      {isLoginRewardsModalOpen && (
          <LoginRewardsModal 
              isOpen={isLoginRewardsModalOpen} 
              onClose={() => setLoginRewardsModalOpen(false)} 
              user={user}
              onRewardClaimed={onUserUpdate}
              platformSettings={platformSettings}
          />
      )}
      <CustomerServiceModal 
          isOpen={isCustomerServiceModalOpen}
          onClose={() => setCustomerServiceModalOpen(false)}
          serviceName={platformSettings.customerServiceName}
          serviceLink={platformSettings.customerServiceLink}
      />
      <InfoModal
        isOpen={!!infoModal}
        onClose={() => setInfoModal(null)}
        title={infoModal?.title || ''}
        message={infoModal?.message || ''}
        type={infoModal?.type || 'info'}
      />
    </div>
  );
};