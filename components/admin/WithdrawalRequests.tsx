import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../lib/mockDatabase';
import type { WithdrawalRequest } from '../../lib/mockDatabase';
import { CheckCircleIcon, XCircleIcon } from '../icons';

interface WithdrawalRequestsProps {
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

export const WithdrawalRequests: React.FC<WithdrawalRequestsProps> = ({ onNavigateToUserDetails, showToast }) => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState(db.getWithdrawalRequests());
    const [confirmAction, setConfirmAction] = useState<{ action: 'approve' | 'reject', request: WithdrawalRequest } | null>(null);

    const forceUpdate = () => {
        setRequests(db.getWithdrawalRequests());
    };

    const handleApprove = (rechargeId: number) => {
        if (db.approveWithdrawal(rechargeId)) {
            showToast(t('admin.withdrawals.approvedSuccess'));
            forceUpdate();
        }
        setConfirmAction(null);
    };

    const handleReject = (rechargeId: number) => {
        if (db.rejectWithdrawal(rechargeId)) {
            showToast(t('admin.withdrawals.rejectedSuccess'));
            forceUpdate();
        }
        setConfirmAction(null);
    };

    const getStatusChip = (status: 'pending' | 'approved' | 'rejected') => {
        switch (status) {
            case 'pending':
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-900 text-yellow-300">{t('admin.withdrawals.pending')}</span>;
            case 'approved':
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-900 text-green-300">{t('admin.withdrawals.approved')}</span>;
            case 'rejected':
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-900 text-red-300">{t('admin.withdrawals.rejected')}</span>;
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow">
            <div className="p-4">
                <h2 className="text-xl font-semibold text-white">{t('admin.withdrawals.title')}</h2>
            </div>
            <div className="overflow-x-auto">
                 <table className="min-w-full text-sm text-start text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin.recharges.user')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.recharges.amount')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.withdrawals.address')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.recharges.date')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.withdrawals.status')}</th>
                            <th scope="col" className="px-6 py-3 text-center">{t('admin.users.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length > 0 ? requests.map(req => (
                            <tr key={req.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-white">
                                    <button
                                        onClick={() => onNavigateToUserDetails(req.userId)}
                                        className="hover:underline text-blue-400 hover:text-blue-300"
                                    >
                                        {req.userEmail}
                                    </button>
                                </td>
                                <td className="px-6 py-4">{req.amount.toFixed(4)} {req.currency} (~${req.usdtValue.toFixed(2)})</td>
                                <td className="px-6 py-4 font-mono text-xs truncate max-w-xs" title={req.address}>{req.address} <br/> <span className="text-gray-500">({req.network})</span></td>
                                <td className="px-6 py-4">{new Date(req.date).toLocaleString()}</td>
                                <td className="px-6 py-4">{getStatusChip(req.status)}</td>
                                <td className="px-6 py-4 text-center">
                                    {req.status === 'pending' && (
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => setConfirmAction({ action: 'reject', request: req })} className="p-1.5 text-red-400 hover:text-red-300" title={t('admin.recharges.reject')}><XCircleIcon className="w-5 h-5"/></button>
                                            <button onClick={() => setConfirmAction({ action: 'approve', request: req })} className="p-1.5 text-green-400 hover:text-green-300" title={t('admin.recharges.approve')}><CheckCircleIcon className="w-5 h-5"/></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">{t('admin.withdrawals.noPending')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={!!confirmAction} onClose={() => setConfirmAction(null)} title={t('admin.common.confirm')}>
                {confirmAction && (
                    <div className="space-y-4">
                        <p>
                            {t(confirmAction.action === 'approve' 
                                ? 'admin.withdrawals.confirmApprove'
                                : 'admin.withdrawals.confirmReject',
                                { 
                                    amount: confirmAction.request.amount.toFixed(4), 
                                    currency: confirmAction.request.currency,
                                    // FIX: Access grossUsdtValue which now exists on the WithdrawalRequest type.
                                    usdtValue: confirmAction.request.grossUsdtValue.toFixed(2),
                                    email: confirmAction.request.userEmail 
                                }
                            )}
                        </p>
                         <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmAction(null)} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500">{t('admin.common.cancel')}</button>
                            <button onClick={() => confirmAction.action === 'approve' ? handleApprove(confirmAction.request.id) : handleReject(confirmAction.request.id)} 
                                    className={`px-4 py-2 rounded-md text-sm font-medium text-white ${confirmAction.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                {t('admin.common.confirm')}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};