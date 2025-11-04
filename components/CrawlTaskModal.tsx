import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../lib/mockDatabase';
import type { CrawlTask } from '../lib/mockDatabase';

interface CrawlTaskModalProps {
    task: CrawlTask;
    user: User;
    onClose: () => void;
    onComplete: (taskId: string) => void;
    onRecharge: () => void;
}

export const CrawlTaskModal: React.FC<CrawlTaskModalProps> = ({ task, user, onClose, onComplete, onRecharge }) => {
    const { t } = useTranslation();
    const totalBalance = user.mainBalance + user.withdrawalBalance;
    const hasSufficientBalance = totalBalance >= task.price;
    const difference = Math.max(0, task.price - totalBalance);

    const handleComplete = () => {
        onComplete(task.id);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-[#fdfbf5] rounded-2xl w-full max-w-sm text-black p-6 space-y-4" 
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-center font-bold text-xl">{t('hint')}</h3>
                {!hasSufficientBalance && (
                    <p className="text-center text-red-500 font-semibold">{t('insufficientAmountHint')}</p>
                )}
                
                <div className="bg-white rounded-lg p-3 shadow-inner">
                    <img src={task.imageSrc} alt={task.name} className="w-full h-32 object-contain rounded-md" />
                </div>
                
                <p className="text-center text-gray-700 font-medium">{task.name}</p>

                <div className="space-y-3 text-sm pt-2">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('taskPrice')}</span>
                        <span className="font-semibold">${task.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('taskIncome')}</span>
                        <span className="font-semibold text-green-600">${task.income.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('totalBalance')}</span>
                        <span className="font-semibold">${totalBalance.toFixed(2)}</span>
                    </div>
                    {!hasSufficientBalance && (
                         <div className="flex justify-between items-center">
                            <span className="text-gray-600">{t('makeUpDifference')}</span>
                            <span className="font-semibold">${difference.toFixed(2)}</span>
                        </div>
                    )}
                </div>

                <div className="pt-2">
                    <button 
                        onClick={hasSufficientBalance ? handleComplete : onRecharge}
                        className="w-full py-3 rounded-lg bg-[#d9534f] text-white font-bold text-lg"
                    >
                        {hasSufficientBalance ? t('complete') : t('recharge')}
                    </button>
                </div>
            </div>
        </div>
    );
}