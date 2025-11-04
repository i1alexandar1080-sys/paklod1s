import React from 'react';
import { useTranslation } from 'react-i18next';
import { db, User, PlatformSettingsData } from '../lib/mockDatabase';
import { HeadsetIcon, EnvelopeIcon } from './icons';

interface AccountScreenProps {
    user: User;
    platformSettings: PlatformSettingsData;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ user, platformSettings }) => {
    const { t } = useTranslation();

    return (
        <div className="relative h-full flex flex-col">
            <div className="p-4">
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
            </div>
        </div>
    );
};
