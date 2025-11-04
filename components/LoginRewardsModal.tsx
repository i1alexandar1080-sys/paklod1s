import React from 'react';
import { useTranslation } from 'react-i18next';
import { db, User, PlatformSettingsData } from '../lib/mockDatabase';
import { CloseIcon } from './icons';

interface LoginRewardsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onRewardClaimed: () => void;
    platformSettings: PlatformSettingsData;
}

export const LoginRewardsModal: React.FC<LoginRewardsModalProps> = ({ isOpen, onClose, user, onRewardClaimed, platformSettings }) => {
    const { t } = useTranslation();
    const rewards = (db.platformSettings.loginRewards || []).sort((a, b) => a.day - b.day);

    const handleClaimReward = () => {
        const result = db.claimLoginReward(user.id);
        if (result.success) {
            alert(t('loginRewardClaimed'));
            onRewardClaimed();
        } else {
            alert(t(result.message as any) || "An error occurred.");
        }
    };
    
    if (!isOpen) return null;

    const today = new Date().toISOString().split('T')[0];
    const canClaimToday = user.lastLoginDate !== today;


    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
              style={{ backgroundImage: `linear-gradient(to bottom, #2a1352, ${platformSettings.cardColor})` }}
              className="relative rounded-2xl w-full max-w-sm text-white p-6 pt-8 space-y-4 shadow-2xl border border-purple-400/30" 
              onClick={e => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-center">
                    {t('loginRewardsTitle')}
                </h2>
                <p className="text-center text-sm text-gray-300 px-4">
                    {t('loginRewardsSubtitle')}
                </p>

                <div className="max-h-[250px] overflow-y-auto no-scrollbar pr-4 -mr-2">
                    <div className="grid grid-cols-3 gap-x-4 gap-y-6 text-center">
                        {rewards.map(reward => {
                            const isClaimed = user.loginStreak >= reward.day;
                            return (
                                <div key={reward.day} className="flex flex-col items-center">
                                    <p className="text-yellow-400 font-semibold text-sm mb-1">{t('dayLabel', { day: reward.day })}</p>
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                        isClaimed ? 'bg-yellow-400 border-yellow-400' : 'border-yellow-400'
                                    }`}>
                                        {isClaimed && <span className="text-black font-bold text-lg">✓</span>}
                                    </div>
                                    <p className="text-yellow-400 font-bold mt-1">${reward.amount.toFixed(2)}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="text-center text-sm">
                    <p>{t('loginStreakLabel', { days: user.loginStreak })}</p>
                </div>
                
                <button 
                    onClick={handleClaimReward}
                    disabled={!canClaimToday}
                    className="w-full bg-[#0a2e4a] hover:bg-[#1a3e5a] text-white font-semibold py-3 rounded-lg shadow-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {t('claimLoginRewardButton')}
                </button>

                 <button 
                    onClick={onClose} 
                    className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-gray-800/80 rounded-full p-2 border-2 border-white/50 backdrop-blur-sm"
                 >
                    <CloseIcon className="w-6 h-6 text-white"/>
                </button>
            </div>
        </div>
    );
};
