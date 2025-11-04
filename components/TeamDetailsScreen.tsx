import React from 'react';
import { useTranslation } from 'react-i18next';
import { db, User, PlatformSettingsData } from '../lib/mockDatabase';
import { HeadsetIcon, EnvelopeIcon } from './icons';

interface TeamDetailsScreenProps {
    level: number;
    user: User;
    platformSettings: PlatformSettingsData;
}

const maskIdentifier = (identifier: string) => {
    if (identifier.includes('@')) {
        const [name, domain] = identifier.split('@');
        if (name.length > 4) {
            return `${name.substring(0, 3)}****@${domain}`;
        }
        return `${name.substring(0, 1)}****@${domain}`;
    }
    if (identifier.startsWith('+') && identifier.length > 8) {
        return `${identifier.substring(0, 4)}****${identifier.substring(identifier.length - 3)}`;
    }
    if(identifier.length > 5) {
        return `${identifier.substring(0, 3)}****${identifier.substring(identifier.length - 2)}`;
    }
    return identifier;
};

const TeamMemberCard: React.FC<{ user: User; commissionRate: number; platformSettings: PlatformSettingsData }> = ({ user, commissionRate, platformSettings }) => {
    const { t } = useTranslation();
    const rechargeCommission = user.rechargeAmount * (commissionRate / 100);
    
    return (
        <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{t('team_account')}</span>
                <span className="font-semibold">{maskIdentifier(user.email)}</span>
            </div>
            <div className="grid grid-cols-2 text-center">
                <div>
                    <p className="font-bold text-lg">{user.rechargeAmount.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{t('team_rechargeAmount')}</p>
                </div>
                <div>
                    <p className="font-bold text-lg">{rechargeCommission.toFixed(3)}</p>
                    <p className="text-xs text-gray-400">{t('team_rechargeCommission')}</p>
                </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-white/10">
                <span>{t('team_joinDate')}</span>
                <span>{new Date(user.registrationDate).toLocaleString()}</span>
            </div>
        </div>
    );
}

export const TeamDetailsScreen: React.FC<TeamDetailsScreenProps> = ({ level, user, platformSettings }) => {
    const { t } = useTranslation();
    const mainUser = user;
    const allReferrals = db.getReferrals(mainUser.invitationCode);
    const effectiveCommissionRates = user.commissionRatesOverride || db.platformSettings.commissionRates;
    const currentCommissionRate = effectiveCommissionRates[level] || 0;

    let users: User[] = [];
    if (level === 1) users = allReferrals.level1;
    else if (level === 2) users = allReferrals.level2;
    else if (level === 3) users = allReferrals.level3;
    
    return (
        <div className="relative pb-24">
            <div className="space-y-4">
                {users.length > 0 ? (
                    users.map(user => <TeamMemberCard key={user.id} user={user} commissionRate={currentCommissionRate} platformSettings={platformSettings} />)
                ) : (
                    <div className="text-center text-gray-400 py-16">
                        <p>{t('admin.users.noReferrals')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
