import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../lib/mockDatabase';
import type { RechargeRequest } from '../../lib/mockDatabase';
import { CheckCircleIcon, XCircleIcon } from '../icons';

interface RechargeRequestsProps {
    onNavigateToUserDetails: (userId: number) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const DetailItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between text-sm py-2 border-b border-gray-700">
        <span className="text-gray-400">{label}</span>
        <span className="font-medium text-white">{value}</span>
    </div>
);

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; }> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export const RechargeRequests: React.FC<RechargeRequestsProps> = ({ onNavigateToUserDetails, showToast }) => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState(db.pendingRecharges);
    const [selectedRequest, setSelectedRequest] = useState<RechargeRequest | null>(null);

    const forceUpdate = () => {
        setRequests([...db.pendingRecharges]);
    };

    const handleApprove = (rechargeId: number) => {
        if (db.approveRecharge(rechargeId)) {
            showToast(t('admin.recharges.approvedSuccess'));
            forceUpdate();
            setSelectedRequest(null);
        }
    };

    const handleReject = (rechargeId: number) => {
        if (db.rejectRecharge(rechargeId)) {
            showToast(t('admin.recharges.rejectedSuccess'));
            forceUpdate();
            setSelectedRequest(null);
        }
    };
    
    const userForRequest = selectedRequest ? db.findUserById(selectedRequest.userId) : null;

    return (
        <div className="bg-gray-800 rounded-lg shadow">
            <div className="overflow-x-auto">
                 <table className="min-w-full text-sm text-start text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin.recharges.user')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.recharges.amount')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.recharges.currency')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.recharges.date')}</th>
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
                                <td className="px-6 py-4">${req.amount.toFixed(2)}</td>
                                <td className="px-6 py-4">{req.currency}/{req.network}</td>
                                <td className="px-6 py-4">{new Date(req.date).toLocaleString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => setSelectedRequest(req)} className="font-medium text-blue-500 hover:underline">
                                        {t('admin.recharges.review')}
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">{t('admin.recharges.noPending')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)}>
                {selectedRequest && userForRequest && (
                    <>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4 text-white">{t('admin.recharges.rechargeDetails')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-300 mb-2">{t('admin.recharges.paymentProof')}</h4>
                                    <img src={selectedRequest.paymentProof} alt="Payment Proof" className="rounded-lg w-full object-contain bg-gray-900" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-300 mb-2">{t('admin.recharges.userDetails')}</h4>
                                    <DetailItem label={t('admin.users.email')} value={userForRequest.email} />
                                    <DetailItem label={t('admin.recharges.currentBalance')} value={`$${(userForRequest.mainBalance + userForRequest.withdrawalBalance).toFixed(2)}`} />
                                    <DetailItem label={t('admin.users.vipLevel')} value={userForRequest.vipLevel} />
                                    <DetailItem label={t('admin.users.registrationDate')} value={new Date(userForRequest.registrationDate).toLocaleDateString()} />
                                    <hr className="border-gray-700 !my-4" />
                                    <h4 className="font-semibold text-gray-300 mb-2">{t('rechargeDetails')}</h4>
                                    <DetailItem label={t('admin.recharges.amount')} value={`$${selectedRequest.amount.toFixed(2)}`} />
                                    <DetailItem label={t('admin.recharges.currency')} value={`${selectedRequest.currency} (${selectedRequest.network})`} />
                                    <DetailItem label={t('admin.recharges.date')} value={new Date(selectedRequest.date).toLocaleString()} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-700/50 p-4 flex justify-end gap-4">
                            <button onClick={() => handleReject(selectedRequest.id)} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                                <XCircleIcon className="w-5 h-5"/>
                                <span>{t('admin.recharges.reject')}</span>
                            </button>
                            <button onClick={() => handleApprove(selectedRequest.id)} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                                <CheckCircleIcon className="w-5 h-5"/>
                                <span>{t('admin.recharges.approve')}</span>
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};