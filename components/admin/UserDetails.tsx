import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../lib/mockDatabase';
import type { User } from '../../lib/mockDatabase';
import { ChevronLeftIcon } from '../icons';

interface UserDetailsProps {
    user: User;
    onBack: () => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user: initialUser, onBack, showToast }) => {
    const { t } = useTranslation();
    
    // Use state to manage user data and force re-renders on updates
    const [user, setUser] = useState(initialUser);
    
    const referrals = db.getReferrals(user.invitationCode);

    const [customFee, setCustomFee] = useState<string>(user.withdrawalFeePercentageOverride?.toString() ?? '');
    const [customCommissions, setCustomCommissions] = useState<{ [key: number]: string | number }>(
        user.commissionRatesOverride || { 1: '', 2: '', 3: '' }
    );
    // FIX: Cast `set` to a typed object to resolve 'Property 'enabled' does not exist on type 'unknown'' error.
    const [isCrawlerEnabled, setIsCrawlerEnabled] = useState(Object.values(user.crawlSets || {}).some(set => (set as { enabled: boolean }).enabled));
    
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
    const [balanceModalMode, setBalanceModalMode] = useState<'add' | 'deduct'>('add');
    const [balanceAmount, setBalanceAmount] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<'main' | 'withdrawal'>('main');

    const handleSaveFee = () => {
        // Parse float or set to undefined if empty string
        const feeValue = customFee === '' ? undefined : parseFloat(customFee);
        db.updateUser(user.id, { withdrawalFeePercentageOverride: feeValue });
        const updatedUser = db.findUserById(user.id);
        if (updatedUser) setUser(updatedUser);
        showToast(t('admin.users.feeUpdatedSuccess'));
    };

    const handleResetFee = () => {
        setCustomFee('');
        db.updateUser(user.id, { withdrawalFeePercentageOverride: undefined });
        const updatedUser = db.findUserById(user.id);
        if (updatedUser) setUser(updatedUser);
        showToast(t('admin.users.feeUpdatedSuccess'));
    };

    const handleCommissionChange = (level: number, value: string) => {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setCustomCommissions(prev => ({ ...prev, [level]: value }));
        }
    };

    const handleSaveCommissions = () => {
        const newRates: { [key: number]: number } = {};
        let hasOverrides = false;

        for (const level of [1, 2, 3]) {
            const rateStr = String(customCommissions[level] || '');
            if (rateStr.trim() !== '') {
                const rateNum = parseFloat(rateStr);
                if (!isNaN(rateNum)) {
                    newRates[level] = rateNum;
                    hasOverrides = true;
                }
            }
        }

        db.updateUser(user.id, { commissionRatesOverride: hasOverrides ? newRates : undefined });
        const updatedUser = db.findUserById(user.id);
        if (updatedUser) setUser(updatedUser);
        showToast(t('admin.users.commissionUpdatedSuccess'));
    };
    
    const handleResetCommissions = () => {
        setCustomCommissions({ 1: '', 2: '', 3: '' });
        db.updateUser(user.id, { commissionRatesOverride: undefined });
        const updatedUser = db.findUserById(user.id);
        if (updatedUser) setUser(updatedUser);
        showToast(t('admin.users.commissionUpdatedSuccess'));
    };

    const handleToggleCrawler = () => {
        const newStatus = !isCrawlerEnabled;
        setIsCrawlerEnabled(newStatus);
        
        // This is a simplified toggle. It enables/disables the first crawl set.
        // A more complex UI would allow managing each set individually.
        const updatedCrawlSets = {
            ...(user.crawlSets || {}),
            1: {
                ...(user.crawlSets?.[1] || { activeTaskIds: [], completedTasks: [] }),
                enabled: newStatus,
            }
        };

        db.updateUser(user.id, { crawlSets: updatedCrawlSets });
        const updatedUser = db.findUserById(user.id);
        if (updatedUser) setUser(updatedUser);
        showToast(t('admin.users.crawlerStatusUpdated'));
    };

    const openBalanceModal = (mode: 'add' | 'deduct') => {
        setBalanceModalMode(mode);
        setBalanceAmount('');
        setSelectedAccount('main');
        setIsBalanceModalOpen(true);
    };
    
    const handleBalanceAdjustment = () => {
        const numericAmount = parseFloat(balanceAmount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            showToast('Please enter a valid positive amount.', 'error');
            return;
        }
    
        const result = db.adminAdjustBalance(user.id, numericAmount, selectedAccount, balanceModalMode);
    
        if (result.success) {
            const accountName = selectedAccount === 'main' ? t('mainAccount') : t('withdrawalAccountTab');
            const successMessage = balanceModalMode === 'add' 
                ? t('admin.users.additionSuccess', { amount: numericAmount.toFixed(2), account: accountName })
                : t('admin.users.deductionSuccess', { amount: numericAmount.toFixed(2), account: accountName });
            showToast(successMessage, 'success');
            
            const updatedUser = db.findUserById(user.id);
            if (updatedUser) setUser({ ...updatedUser }); // Re-render with new balances
            
            setIsBalanceModalOpen(false);
        } else {
            showToast(t(result.message as any) || 'An error occurred.', 'error');
        }
    };


    const DetailItem: React.FC<{ label: string; value: string | number | null | undefined }> = ({ label, value }) => (
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="font-medium text-white">{value || 'N/A'}</p>
        </div>
    );
    
    const ReferralList: React.FC<{level: number, users: User[]}> = ({ level, users }) => (
         <div>
            <h4 className="text-md font-semibold text-white mb-2 border-b border-gray-700 pb-2">{t(`admin.users.level${level}`)} ({users.length})</h4>
            {users.length > 0 ? (
                <ul className="space-y-2 max-h-40 overflow-y-auto pe-2">
                    {users.map(ref => (
                        <li key={ref.id} className="text-sm flex justify-between bg-gray-700/50 p-2 rounded-md">
                           <span>{ref.email}</span>
                           <span className="text-gray-400">{new Date(ref.registrationDate).toLocaleDateString()}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">{t('admin.users.noReferrals')}</p>
            )}
        </div>
    );
    
    const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
                <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                    <h3 className="text-lg font-semibold mb-4">{title}</h3>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-300 hover:text-white">
                <ChevronLeftIcon className="w-5 h-5" />
                <span>{t('admin.users.backToList')}</span>
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Info Card */}
                <div className="lg:col-span-1 bg-gray-800 rounded-lg shadow p-6 space-y-4 self-start">
                    <h3 className="text-xl font-bold text-white">{user.email}</h3>
                    <DetailItem label={t('admin.users.password')} value={user.mockPassword} />
                    <DetailItem label={t('admin.users.phone')} value={user.phone} />
                    <DetailItem label={t('admin.users.ipAddress')} value={user.ipAddress} />
                    <DetailItem label={t('admin.users.registrationDate')} value={new Date(user.registrationDate).toLocaleString()} />
                    <DetailItem label={t('admin.users.lastLogin')} value={new Date(user.lastLogin).toLocaleString()} />
                    <hr className="border-gray-700"/>
                    <DetailItem label={t('admin.users.balance')} value={`$${(user.mainBalance + user.withdrawalBalance).toFixed(2)}`} />
                    <DetailItem label={t('admin.users.vipLevel')} value={user.vipLevel} />
                    <DetailItem label={t('admin.users.status')} value={t(`admin.users.status${user.status.charAt(0).toUpperCase() + user.status.slice(1)}`)} />
                    <hr className="border-gray-700"/>
                    <DetailItem label={t('admin.users.invitationCode')} value={user.invitationCode} />
                    <DetailItem label={t('admin.users.invitedBy')} value={user.invitedBy} />
                    <hr className="border-gray-700"/>
                    
                    <h4 className="text-md font-semibold text-white pt-2">{t('admin.users.balanceAdjustment')}</h4>
                    <div className="flex gap-2 pt-2">
                        <button onClick={() => openBalanceModal('add')} className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">{t('admin.users.addBalance')}</button>
                        <button onClick={() => openBalanceModal('deduct')} className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700">{t('admin.users.deductBalance')}</button>
                    </div>

                    <hr className="border-gray-700"/>
                    <h4 className="text-md font-semibold text-white pt-2">{t('admin.users.feeManagement')}</h4>
                    <DetailItem 
                        label={t('admin.settings.withdrawalFeePercentage')} 
                        value={`${user.withdrawalFeePercentageOverride ?? db.platformSettings.withdrawalFeePercentage}%`} 
                    />
                    <div>
                        <label htmlFor="custom-fee" className="text-sm text-gray-400">{t('admin.users.customWithdrawalFee')}</label>
                        <input
                            id="custom-fee"
                            type="number"
                            step="0.01"
                            value={customFee}
                            onChange={(e) => setCustomFee(e.target.value)}
                            placeholder={db.platformSettings.withdrawalFeePercentage.toString()}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">{t('admin.users.feeOverrideNotice', { globalFee: db.platformSettings.withdrawalFeePercentage })}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button onClick={handleResetFee} className="flex-1 px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500">{t('admin.users.resetToDefault')}</button>
                        <button onClick={handleSaveFee} className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{t('admin.common.saveChanges')}</button>
                    </div>
                     <hr className="border-gray-700"/>
                    <h4 className="text-md font-semibold text-white pt-2">{t('admin.users.commissionManagement')}</h4>
                    <div>
                        <label htmlFor="custom-commission-1" className="text-sm text-gray-400">{t('admin.settings.commissionRateLevel1')}</label>
                         <input id="custom-commission-1" type="number" step="0.01" value={customCommissions[1]} onChange={(e) => handleCommissionChange(1, e.target.value)} placeholder={db.platformSettings.commissionRates[1].toString()} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white mt-1" />
                    </div>
                     <div>
                        <label htmlFor="custom-commission-2" className="text-sm text-gray-400">{t('admin.settings.commissionRateLevel2')}</label>
                        <input id="custom-commission-2" type="number" step="0.01" value={customCommissions[2]} onChange={(e) => handleCommissionChange(2, e.target.value)} placeholder={db.platformSettings.commissionRates[2].toString()} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white mt-1" />
                    </div>
                     <div>
                        <label htmlFor="custom-commission-3" className="text-sm text-gray-400">{t('admin.settings.commissionRateLevel3')}</label>
                        <input id="custom-commission-3" type="number" step="0.01" value={customCommissions[3]} onChange={(e) => handleCommissionChange(3, e.target.value)} placeholder={db.platformSettings.commissionRates[3].toString()} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white mt-1" />
                    </div>
                     <p className="text-xs text-gray-500 mt-1">{t('admin.users.commissionOverrideNotice')}</p>
                    <div className="flex gap-2 pt-2">
                        <button onClick={handleResetCommissions} className="flex-1 px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500">{t('admin.users.resetToDefault')}</button>
                        <button onClick={handleSaveCommissions} className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{t('admin.common.saveChanges')}</button>
                    </div>
                    <hr className="border-gray-700"/>
                    <h4 className="text-md font-semibold text-white pt-2">{t('admin.users.crawlerManagement')}</h4>
                    <div className="flex items-center justify-between">
                        <label htmlFor="crawler-toggle" className="text-sm text-gray-300">{t('admin.users.enableCrawler')}</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="crawler-toggle"
                                className="sr-only peer"
                                checked={isCrawlerEnabled}
                                onChange={handleToggleCrawler}
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                {/* Referral Network Card */}
                <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">{t('admin.users.referralNetwork')}</h3>
                    <div className="space-y-6">
                        <ReferralList level={1} users={referrals.level1} />
                        <ReferralList level={2} users={referrals.level2} />
                        <ReferralList level={3} users={referrals.level3} />
                    </div>
                </div>
            </div>

            <Modal 
                isOpen={isBalanceModalOpen} 
                onClose={() => setIsBalanceModalOpen(false)} 
                title={balanceModalMode === 'add' ? `${t('admin.users.addBalanceTo')} ${user.email}` : `${t('admin.users.deductBalanceFrom')} ${user.email}`}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('admin.users.selectAccount')}</label>
                        <div className="space-y-2">
                            <label className="flex items-center p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600">
                                <input type="radio" name="account" value="main" checked={selectedAccount === 'main'} onChange={() => setSelectedAccount('main')} className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2" />
                                <span className="ml-3 block text-sm font-medium text-white">{t('admin.users.mainAccountBalance', { balance: user.mainBalance.toFixed(2) })}</span>
                            </label>
                            <label className="flex items-center p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600">
                                <input type="radio" name="account" value="withdrawal" checked={selectedAccount === 'withdrawal'} onChange={() => setSelectedAccount('withdrawal')} className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2" />
                                <span className="ml-3 block text-sm font-medium text-white">{t('admin.users.withdrawalAccountBalance', { balance: user.withdrawalBalance.toFixed(4) })}</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="balance-amount" className="block text-sm font-medium text-gray-400 mb-1">{t('admin.users.amount')}</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            id="balance-amount"
                            value={balanceAmount}
                            onChange={(e) => setBalanceAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => setIsBalanceModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500">{t('admin.common.cancel')}</button>
                        <button onClick={handleBalanceAdjustment} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{t('admin.common.confirm')}</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};