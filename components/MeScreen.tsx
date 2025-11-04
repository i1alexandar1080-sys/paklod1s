import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
    StarIcon, 
    CreditCardIcon, 
    WithdrawIcon, 
    AccountIcon, 
    FinancialRecordsIcon, 
    LockIcon,
    PowerIcon,
    ChevronRightIcon,
    GlobeIcon,
    HeadsetIcon,
    EnvelopeIcon
} from './icons';
import { db, User, PlatformSettingsData } from '../lib/mockDatabase';

interface MeScreenProps {
    onSignOut: () => void;
    navigateTo: (view: string) => void;
    user: User;
    setIsLanguageSelectorOpen: (isOpen: boolean) => void;
    selectedLanguageCode: string;
    getLanguageName: (code: string) => string;
    platformSettings: PlatformSettingsData;
}

export const MeScreen: React.FC<MeScreenProps> = ({ onSignOut, navigateTo, user, setIsLanguageSelectorOpen, selectedLanguageCode, getLanguageName, platformSettings }) => {
    const { t } = useTranslation();

    const ListItem: React.FC<{ label: string, icon: React.ReactNode, onClick?: () => void }> = ({ label, icon, onClick }) => (
        <button onClick={onClick} className="w-full flex items-center justify-between p-3.5 text-white hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
                <div style={{ backgroundColor: platformSettings.cardColor }} className="w-8 h-8 rounded-full flex items-center justify-center">
                    {icon}
                </div>
                <span className="font-medium">{label}</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </button>
    );

    const menuItems = [
        { label: t('recharge'), icon: <CreditCardIcon className="w-5 h-5" />, action: () => navigateTo('recharge_select') },
        { label: t('withdraw'), icon: <WithdrawIcon className="w-5 h-5" />, action: () => navigateTo('withdraw') },
        { label: t('account'), icon: <AccountIcon className="w-5 h-5" />, action: () => navigateTo('account') },
        { label: t('financialRecords'), icon: <FinancialRecordsIcon className="w-5 h-5" />, action: () => navigateTo('financial_records') },
        { label: t('changePassword'), icon: <LockIcon className="w-5 h-5" />, action: () => navigateTo('change_password') },
    ];
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow p-4 space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                        <img src={user.avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="font-semibold text-lg">{user.email}</p>
                        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-400/20 px-2 py-0.5 rounded-full text-xs w-fit mt-1">
                            <StarIcon className="w-3 h-3" />
                            <span>{user.vipLevel}</span>
                        </div>
                    </div>
                </div>

                {/* Balances Card */}
                <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4 flex justify-between items-center">
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-gray-400">{t('mainAccount')}</p>
                            <p className="font-bold text-lg">{user.mainBalance.toFixed(2)} USDT</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">{t('withdrawalAccountTab')}</p>
                            <p className="font-bold text-lg">{user.withdrawalBalance.toFixed(4)} USDT</p>
                        </div>
                    </div>
                    <img src={user.safeBoxImageUrl} alt="safe box" className="w-20 h-20 object-contain" />
                </div>

                {/* Menu List */}
                <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg divide-y divide-white/10">
                    {menuItems.map(item => (
                         <ListItem key={item.label} label={item.label} icon={item.icon} onClick={item.action} />
                    ))}
                </div>

                {/* Sign Out Button */}
                <div className="pt-4">
                    <button onClick={onSignOut} style={{ backgroundColor: platformSettings.cardColor }} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold hover:brightness-125 transition-all">
                        <PowerIcon className="w-5 h-5"/>
                        <span>{t('signOut')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
