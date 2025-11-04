import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { db, User } from '../../lib/mockDatabase';
import { SearchIcon, PowerIcon } from '../icons';

interface WithdrawalManagementProps {
    showToast: (message: string, type?: 'success' | 'error') => void;
}

export const WithdrawalManagement: React.FC<WithdrawalManagementProps> = ({ showToast }) => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([...db.users]);
    const [globalLock, setGlobalLock] = useState(db.platformSettings.globalWithdrawalLock);
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

    const handleGlobalLockToggle = () => {
        const newStatus = !globalLock;
        setGlobalLock(newStatus);
        db.platformSettings.globalWithdrawalLock = newStatus;
        showToast(t('admin.withdrawals.globalStatusUpdated'));
    };

    const handleUserToggle = (userId: number, email: string) => {
        db.toggleWithdrawalStatus(userId);
        forceUpdate();
        showToast(t('admin.withdrawals.statusUpdated', { email }));
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow">
            <div className="p-4 space-y-4">
                <h2 className="text-xl font-semibold text-white">{t('admin.nav.withdrawalManagement')}</h2>
                
                <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-white">{t('admin.withdrawals.globalLock')}</h3>
                            <p className="text-sm text-gray-400">{t('admin.withdrawals.enableForAll')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={!globalLock}
                                onChange={handleGlobalLockToggle}
                            />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                    </div>
                </div>

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
                            <th scope="col" className="px-6 py-3">{t('admin.withdrawals.status')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.users.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                                <td className="px-6 py-4">{user.id}</td>
                                <td className="px-6 py-4 font-medium text-white">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isWithdrawalEnabled ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                        {user.isWithdrawalEnabled ? t('admin.withdrawals.enabled') : t('admin.withdrawals.disabled')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => handleUserToggle(user.id, user.email)} 
                                        className={`p-1.5 rounded-full transition-colors ${user.isWithdrawalEnabled ? 'text-gray-400 hover:text-red-400 bg-gray-700 hover:bg-red-900/50' : 'text-gray-400 hover:text-green-400 bg-gray-700 hover:bg-green-900/50'}`} 
                                        title={user.isWithdrawalEnabled ? t('admin.withdrawals.disableUser') : t('admin.withdrawals.enableUser')}
                                    >
                                        <PowerIcon className="w-5 h-5"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};