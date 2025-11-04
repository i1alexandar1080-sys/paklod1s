import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    UsersIcon,
    StarIcon,
    WalletIcon,
    InboxArrowDownIcon,
    SignOutIcon,
    CogIcon,
    WithdrawIcon,
    TaskIcon,
    BellIcon,
    PowerIcon,
    ClipboardListIcon,
    InboxInIcon,
} from '../icons';
import { UserManagement } from './UserManagement';
import { VipManagement } from './VipManagement';
import { WalletManagement } from './WalletManagement';
import { RechargeRequests } from './RechargeRequests';
import { PlatformSettings } from './PlatformSettings';
import { db } from '../../lib/mockDatabase';
import { WithdrawalRequests } from './WithdrawalRequests';
import { UserDetails } from './UserDetails';
import { CrawlingManagement } from './CrawlingManagement';
import { NotificationManagement } from './NotificationManagement';
import { WithdrawalManagement } from './WithdrawalManagement';
import { ActivityManagement } from './ActivityManagement';
import { ActivitySubmissions } from './ActivitySubmissions';


interface AdminDashboardProps {
    onSignOut: () => void;
}

type AdminView = 'users' | 'vips' | 'wallets' | 'recharges' | 'withdrawals' | 'settings' | 'crawling' | 'notifications' | 'withdrawalManagement' | 'activityManagement' | 'activitySubmissions';

interface ViewState {
    view: AdminView;
    subView?: 'userDetails';
    params?: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSignOut }) => {
    const { t } = useTranslation();
    const [activeView, setActiveView] = useState<ViewState>({ view: 'users' });
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const menuItems = [
        { id: 'users', label: t('admin.nav.users'), icon: <UsersIcon className="w-5 h-5" /> },
        { id: 'vips', label: t('admin.nav.vipLevels'), icon: <StarIcon className="w-5 h-5" /> },
        { id: 'activityManagement', label: t('admin.nav.activityManagement'), icon: <ClipboardListIcon className="w-5 h-5" /> },
        { id: 'activitySubmissions', label: t('admin.nav.activitySubmissions'), icon: <InboxInIcon className="w-5 h-5" /> },
        { id: 'crawling', label: t('admin.nav.crawling'), icon: <TaskIcon className="w-5 h-5" /> },
        { id: 'wallets', label: t('admin.nav.wallets'), icon: <WalletIcon className="w-5 h-5" /> },
        { id: 'recharges', label: t('admin.nav.rechargeRequests'), icon: <InboxArrowDownIcon className="w-5 h-5" /> },
        { id: 'withdrawals', label: t('admin.nav.withdrawalRequests'), icon: <WithdrawIcon className="w-5 h-5" /> },
        { id: 'withdrawalManagement', label: t('admin.nav.withdrawalManagement'), icon: <PowerIcon className="w-5 h-5" /> },
        { id: 'notifications', label: t('admin.nav.notifications'), icon: <BellIcon className="w-5 h-5" /> },
        { id: 'settings', label: t('admin.nav.platformSettings'), icon: <CogIcon className="w-5 h-5" /> },
    ];

    const handleNavigateToUserDetails = (userId: number) => {
        setActiveView(prev => ({ ...prev, subView: 'userDetails', params: { userId } }));
    };

    const renderContent = () => {
        if (activeView.subView === 'userDetails' && activeView.params?.userId) {
            const user = db.findUserById(activeView.params.userId);
            if (user) {
                return <UserDetails user={user} onBack={() => setActiveView({ view: activeView.view })} showToast={showToast} />;
            }
        }

        switch (activeView.view) {
            case 'users':
                return <UserManagement onNavigateToUserDetails={handleNavigateToUserDetails} showToast={showToast} />;
            case 'vips':
                return <VipManagement showToast={showToast} />;
            case 'crawling':
                return <CrawlingManagement showToast={showToast} />;
            case 'wallets':
                return <WalletManagement showToast={showToast} />;
            case 'recharges':
                return <RechargeRequests onNavigateToUserDetails={handleNavigateToUserDetails} showToast={showToast} />;
            case 'withdrawals':
                return <WithdrawalRequests onNavigateToUserDetails={handleNavigateToUserDetails} showToast={showToast} />;
            case 'withdrawalManagement':
                return <WithdrawalManagement showToast={showToast} />;
            case 'notifications':
                return <NotificationManagement showToast={showToast} />;
            case 'activityManagement':
                return <ActivityManagement showToast={showToast} />;
            case 'activitySubmissions':
                return <ActivitySubmissions showToast={showToast} />;
            case 'settings':
                return <PlatformSettings showToast={showToast} />;
            default:
                return <UserManagement onNavigateToUserDetails={handleNavigateToUserDetails} showToast={showToast} />;
        }
    };
    
    const getTitle = () => {
        if (activeView.subView === 'userDetails' && activeView.params?.userId) {
            const user = db.findUserById(activeView.params.userId);
            return user ? `${t('admin.users.viewDetails')}: ${user.email}` : t('admin.users.viewDetails');
        }
        return menuItems.find(item => item.id === activeView.view)?.label || 'Dashboard';
    }

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 flex flex-col flex-shrink-0">
                <div className="h-16 flex items-center justify-center px-4 bg-gray-900">
                     <div className="flex items-center gap-2">
                       <img src={db.platformSettings.logoUrl} alt="logo" className="h-6 w-auto" />
                       <h1 className="text-lg font-bold text-white">{db.platformSettings.name} Admin</h1>
                   </div>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto no-scrollbar">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView({ view: item.id as AdminView })}
                            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                activeView.view === item.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            <span className="ms-3">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="px-2 py-4">
                     <button
                        onClick={onSignOut}
                        className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                        <SignOutIcon className="w-5 h-5" />
                        <span className="ms-3">{t('signOut')}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
                    <h1 className="text-xl font-semibold">{getTitle()}</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
                    {renderContent()}
                </main>

                {/* Toast Notification */}
                {toast && (
                    <div 
                        className={`fixed top-5 right-5 p-4 rounded-md text-white shadow-lg transition-opacity duration-300 animate-fade-in-out z-50
                            ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`
                        }
                    >
                        {toast.message}
                    </div>
                )}
                <style>{`
                    @keyframes fade-in-out {
                        0% { opacity: 0; transform: translateY(-20px); }
                        10% { opacity: 1; transform: translateY(0); }
                        90% { opacity: 1; transform: translateY(0); }
                        100% { opacity: 0; transform: translateY(-20px); }
                    }
                    .animate-fade-in-out {
                        animation: fade-in-out 3s ease-in-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};