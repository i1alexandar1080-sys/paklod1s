import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, User, PlatformSettingsData } from '../lib/mockDatabase';

export interface VipLevel {
    id: string;
    name: string;
    imageSrc: string;
    tasks: number;
    benefit: number;
    dailyProfit: number;
    totalProfit: number;
    status: 'active' | 'locked' | 'owned';
    effectiveTime?: string;
    unlockCost?: number;
}

interface VIPCardProps extends VipLevel {
    onUnlock: (level: VipLevel) => void;
    platformSettings: PlatformSettingsData;
}

const VIPCard: React.FC<VIPCardProps> = (props) => {
    const { t } = useTranslation();
    const { onUnlock, platformSettings, ...levelData } = props;

    return (
        <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4 relative overflow-hidden mb-4">
            <div className="absolute top-3 -start-10 transform -rotate-45 bg-yellow-400 w-32 text-center text-black text-xs font-bold py-1">
                {props.name}
            </div>
            
            <div className="ps-2">
                <div className="flex gap-3">
                    <img src={props.imageSrc} alt={props.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />

                    <div className="flex-1 flex justify-between">
                        <div className="flex flex-col justify-between text-sm text-gray-300">
                            <p>{t('dailyTasks')}</p>
                            <p>{t('simpleBenefit')}</p>
                            <p>{t('dailyProfit')}</p>
                            <p>{t('totalProfit')}</p>
                        </div>
                        <div className="flex flex-col items-end text-end justify-between">
                            <p className="font-semibold text-white">{props.tasks}</p>
                            <p className="font-semibold text-white">{props.benefit.toFixed(2)}</p>
                            <p className="font-semibold text-white">{props.dailyProfit.toFixed(2)} USDT</p>
                            <p className="font-semibold text-white">{props.totalProfit.toFixed(2)} USDT</p>
                        </div>
                    </div>
                </div>

                {props.status === 'active' ? (
                    <div className="flex justify-between items-center mt-3">
                        <p className="text-xs text-green-400">{t('effectiveTime')}: {props.effectiveTime}</p>
                        <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md">{t('unlockActive')}</span>
                    </div>
                ) : props.status === 'owned' ? (
                    <div className="flex justify-end mt-3">
                        <span className="bg-gray-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md">{t('vipFinished')}</span>
                    </div>
                ) : (
                    <div className="flex justify-end mt-3">
                        <button onClick={() => onUnlock(levelData)} className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-md">
                            {t('openNow')} {props.unlockCost?.toFixed(2)} USDT
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

interface VIPScreenProps {
    navigateTo: (view: string) => void;
    user: User;
    platformSettings: PlatformSettingsData;
}

export const VIPScreen: React.FC<VIPScreenProps> = ({ navigateTo, user, platformSettings }) => {
    const { t } = useTranslation();
    const [key, setKey] = useState(0); // Used to force re-render
    const [confirmationModal, setConfirmationModal] = useState<VipLevel | null>(null);
    const [insufficientFundsModal, setInsufficientFundsModal] = useState<VipLevel | null>(null);

    const vipLevels = db.getVipLevels(user.id);

    const handleUnlockClick = (level: VipLevel) => {
        setConfirmationModal(level);
    };

    const handlePurchaseConfirm = () => {
        if (!confirmationModal) return;

        const result = db.upgradeVipLevel(user.id, confirmationModal.id);
        
        if (result.success) {
            alert(t('vipUpgradeSuccess'));
            setKey(prev => prev + 1); // Force re-render
        } else if (result.message === 'insufficient_balance') {
            setInsufficientFundsModal(confirmationModal);
        } else {
            alert(result.message);
        }
        setConfirmationModal(null);
    };
    
    const handleRechargeConfirm = () => {
        setInsufficientFundsModal(null);
        navigateTo('recharge_select');
    };

    return (
        <div key={key} className="px-4">
            <div className="flex justify-end mb-4">
                <button className="bg-black bg-opacity-20 px-4 py-2 rounded-md text-sm">
                    {t('promotionRecord')}
                </button>
            </div>
            
            <div>
                {vipLevels.map(level => (
                    <VIPCard key={level.id} {...level} onUnlock={handleUnlockClick} platformSettings={platformSettings} />
                ))}
            </div>

            {/* Confirmation Modal */}
            {confirmationModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-sm text-black p-6 text-center">
                        <h3 className="font-bold text-lg mb-4">{t('confirmVipPurchaseTitle')}</h3>
                        <p className="mb-6">{t('confirmVipPurchaseMessage', { vipName: confirmationModal.name, cost: confirmationModal.unlockCost?.toFixed(2) })}</p>
                        <div className="flex gap-4">
                            <button onClick={() => setConfirmationModal(null)} className="flex-1 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">{t('admin.common.cancel')}</button>
                            <button onClick={handlePurchaseConfirm} className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">{t('confirm')}</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Insufficient Funds Modal */}
            {insufficientFundsModal && (
                 <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-xs text-black p-6 text-center space-y-4">
                        <p className="font-semibold">{t('rechargeNeededMessage')}</p>
                        <p className="text-2xl font-bold text-red-600">{insufficientFundsModal.unlockCost?.toFixed(2)}$</p>
                        <button onClick={handleRechargeConfirm} className="w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold">{t('confirm')}</button>
                    </div>
                </div>
            )}
        </div>
    );
};
