import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../lib/mockDatabase';
import type { User } from '../../lib/mockDatabase';
import { BanIcon, ShieldCheckIcon, PlusCircleIcon, ArrowUpCircleIcon, SearchIcon, InfoIcon } from '../icons';

interface UserManagementProps {
    onNavigateToUserDetails: (userId: number) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

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

export const UserManagement: React.FC<UserManagementProps> = ({ onNavigateToUserDetails, showToast }) => {
    const { t } = useTranslation();
    const [users, setUsers] = useState(db.users);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isBalanceModalOpen, setBalanceModalOpen] = useState(false);
    const [isVipModalOpen, setVipModalOpen] = useState(false);
    const [balanceAmount, setBalanceAmount] = useState('0');
    const [selectedVip, setSelectedVip] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const forceUpdate = () => setUsers([...db.users]);
    
    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        const lowercasedQuery = searchQuery.toLowerCase();
        return users.filter(user =>
            user.email.toLowerCase().includes(lowercasedQuery) ||
            user.invitationCode.toLowerCase().includes(lowercasedQuery) ||
            user.phone?.includes(lowercasedQuery) ||
            user.ipAddress.includes(lowercasedQuery)
        );
    }, [users, searchQuery]);

    const handleToggleBan = (userId: number) => {
        const user = db.users.find(u => u.id === userId);
        if (user) {
            db.updateUser(userId, { status: user.status === 'active' ? 'banned' : 'active' });
            forceUpdate();
        }
    };

    const openAddBalanceModal = (user: User) => {
        setSelectedUser(user);
        setBalanceAmount('0');
        setBalanceModalOpen(true);
    };
    
    const handleAddBalance = () => {
        const numericAmount = parseFloat(balanceAmount);
        if (selectedUser && numericAmount > 0) {
            db.updateUser(selectedUser.id, { mainBalance: selectedUser.mainBalance + numericAmount });
            forceUpdate();
        }
        setBalanceModalOpen(false);
        setSelectedUser(null);
    };

    const handleBalanceAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setBalanceAmount(value);
        }
    };

    const openUpgradeVipModal = (user: User) => {
        setSelectedUser(user);
        setSelectedVip(user.vipLevel);
        setVipModalOpen(true);
    };

    const handleUpgradeVip = () => {
        if (selectedUser && selectedVip) {
            const vipLevelToUpgrade = db.vipLevelsData.find(level => level.name === selectedVip);
    
            if (vipLevelToUpgrade) {
                const result = db.adminUpgradeVipLevel(selectedUser.id, vipLevelToUpgrade.id);
                
                if (result.success) {
                    showToast(`User ${selectedUser.email} upgraded to ${selectedVip}.`);
                    forceUpdate();
                } else {
                    showToast(`Upgrade failed: ${result.message}`, 'error');
                }
            } else {
                showToast(`VIP level "${selectedVip}" not found.`, 'error');
            }
        }
        setVipModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow">
            <div className="p-4">
                 <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('admin.users.searchPlaceholder')}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 ps-10 pe-4 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-start text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin.users.id')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.users.email')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.users.balance')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.users.vipLevel')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.users.status')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.users.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                                <td className="px-6 py-4">{user.id}</td>
                                <td className="px-6 py-4 font-medium text-white">{user.email}</td>
                                <td className="px-6 py-4">${(user.mainBalance + user.withdrawalBalance).toFixed(2)}</td>
                                <td className="px-6 py-4">{user.vipLevel}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                        {t(`admin.users.status${user.status.charAt(0).toUpperCase() + user.status.slice(1)}`)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <button onClick={() => onNavigateToUserDetails(user.id)} className="p-1.5 text-gray-400 hover:text-white" title={t('admin.users.viewDetails')}><InfoIcon className="w-5 h-5"/></button>
                                    <button onClick={() => openAddBalanceModal(user)} className="p-1.5 text-blue-400 hover:text-blue-300" title={t('admin.users.addBalance')}><PlusCircleIcon className="w-5 h-5"/></button>
                                    <button onClick={() => openUpgradeVipModal(user)} className="p-1.5 text-yellow-400 hover:text-yellow-300" title={t('admin.users.upgradeVip')}><ArrowUpCircleIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleToggleBan(user.id)} className={`p-1.5 ${user.status === 'active' ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`} title={user.status === 'active' ? t('admin.users.banUser') : t('admin.users.unbanUser')}>
                                        {user.status === 'active' ? <BanIcon className="w-5 h-5"/> : <ShieldCheckIcon className="w-5 h-5"/>}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <Modal isOpen={isBalanceModalOpen} onClose={() => setBalanceModalOpen(false)} title={`${t('admin.users.addBalanceTo')} ${selectedUser?.email}`}>
                <div className="space-y-4">
                    <label htmlFor="balance-amount" className="block text-sm font-medium">{t('admin.users.amount')}</label>
                    <input
                        type="text"
                        inputMode="decimal"
                        id="balance-amount"
                        value={balanceAmount}
                        onChange={handleBalanceAmountChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setBalanceModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500">{t('admin.common.cancel')}</button>
                        <button onClick={handleAddBalance} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{t('admin.common.confirm')}</button>
                    </div>
                </div>
            </Modal>
            
            <Modal isOpen={isVipModalOpen} onClose={() => setVipModalOpen(false)} title={`${t('admin.users.upgradeVipFor')} ${selectedUser?.email}`}>
                 <div className="space-y-4">
                    <label htmlFor="vip-level" className="block text-sm font-medium">{t('admin.users.vipLevel')}</label>
                    <select
                        id="vip-level"
                        value={selectedVip}
                        onChange={(e) => setSelectedVip(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
                    >
                        {db.vipLevelsData.map(level => (
                            <option key={level.id} value={level.name}>{level.name}</option>
                        ))}
                    </select>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setVipModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500">{t('admin.common.cancel')}</button>
                        <button onClick={handleUpgradeVip} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{t('admin.common.confirm')}</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};