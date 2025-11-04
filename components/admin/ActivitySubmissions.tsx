import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, ActivitySubmission } from '../../lib/mockDatabase';
import { CheckCircleIcon, XCircleIcon } from '../icons';

interface ActivitySubmissionsProps {
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>{children}</div>
        </div>
    );
};

export const ActivitySubmissions: React.FC<ActivitySubmissionsProps> = ({ showToast }) => {
    const { t } = useTranslation();
    const [submissions, setSubmissions] = useState(db.activitySubmissions);
    const [selectedSubmission, setSelectedSubmission] = useState<ActivitySubmission | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ action: 'approve' | 'reject', submissionId: number } | null>(null);

    const forceUpdate = () => setSubmissions([...db.activitySubmissions]);

    const handleApprove = (submissionId: number) => {
        if (db.approveSubmission(submissionId)) {
            showToast(t('admin.submissions.approveSuccess'));
            forceUpdate();
        }
        setConfirmAction(null);
        setSelectedSubmission(null);
    };

    const handleReject = (submissionId: number) => {
        if (db.rejectSubmission(submissionId)) {
            showToast(t('admin.submissions.rejectSuccess'));
            forceUpdate();
        }
        setConfirmAction(null);
        setSelectedSubmission(null);
    };

    const getStatusChip = (status: 'pending' | 'approved' | 'rejected') => {
        const styles = {
            pending: 'bg-yellow-900 text-yellow-300',
            approved: 'bg-green-900 text-green-300',
            rejected: 'bg-red-900 text-red-300',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{t(`admin.withdrawals.${status}`)}</span>;
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow">
            <div className="p-4"><h2 className="text-xl font-semibold text-white">{t('admin.submissions.title')}</h2></div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-start text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin.submissions.user')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.submissions.activity')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.submissions.date')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.submissions.status')}</th>
                            <th scope="col" className="px-6 py-3 text-center">{t('admin.submissions.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.length > 0 ? submissions.map(sub => (
                            <tr key={sub.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-white">{sub.userEmail}</td>
                                <td className="px-6 py-4">{sub.activityTitle}</td>
                                <td className="px-6 py-4">{new Date(sub.submissionDate).toLocaleString()}</td>
                                <td className="px-6 py-4">{getStatusChip(sub.status)}</td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => setSelectedSubmission(sub)} className="font-medium text-blue-500 hover:underline">{t('admin.submissions.view')}</button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">{t('admin.submissions.noPending')}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={!!selectedSubmission} onClose={() => setSelectedSubmission(null)} title={t('admin.submissions.submissionDetails')}>
                {selectedSubmission && (
                    <>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-300 mb-2">{t('admin.submissions.submittedImage')}</h4>
                                    <img src={selectedSubmission.sampleImage} alt="Submitted Proof" className="rounded-lg w-full object-contain bg-gray-900" />
                                </div>
                                <div className="space-y-3">
                                    <div><h4 className="font-semibold text-gray-300 mb-2">{t('admin.submissions.completionNotes')}</h4><p className="text-white bg-gray-700/50 p-3 rounded-md text-sm">{selectedSubmission.completionNotes}</p></div>
                                    <p><span className="text-gray-400">{t('admin.submissions.user')}: </span><span className="font-medium">{selectedSubmission.userEmail}</span></p>
                                    <p><span className="text-gray-400">{t('admin.submissions.activity')}: </span><span className="font-medium">{selectedSubmission.activityTitle}</span></p>
                                    <p><span className="text-gray-400">{t('admin.submissions.date')}: </span><span className="font-medium">{new Date(selectedSubmission.submissionDate).toLocaleString()}</span></p>
                                </div>
                            </div>
                        </div>
                        {selectedSubmission.status === 'pending' && (
                            <div className="bg-gray-700/50 p-4 flex justify-end gap-4">
                                <button onClick={() => setConfirmAction({ action: 'reject', submissionId: selectedSubmission.id })} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"><XCircleIcon className="w-5 h-5"/><span>{t('admin.submissions.reject')}</span></button>
                                <button onClick={() => setConfirmAction({ action: 'approve', submissionId: selectedSubmission.id })} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"><CheckCircleIcon className="w-5 h-5"/><span>{t('admin.submissions.approve')}</span></button>
                            </div>
                        )}
                    </>
                )}
            </Modal>
            
            <Modal isOpen={!!confirmAction} onClose={() => setConfirmAction(null)} title={t('admin.common.confirm')}>
                {confirmAction && (
                    <div className="space-y-4 p-4 text-center">
                        <p>{t(confirmAction.action === 'approve' ? 'admin.submissions.approveConfirm' : 'admin.submissions.rejectConfirm')}</p>
                        <div className="flex justify-center gap-4 pt-4">
                            <button onClick={() => setConfirmAction(null)} className="px-6 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500">{t('admin.common.cancel')}</button>
                            <button onClick={() => confirmAction.action === 'approve' ? handleApprove(confirmAction.submissionId) : handleReject(confirmAction.submissionId)} className={`px-6 py-2 rounded-md text-sm font-medium text-white ${confirmAction.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>{t('admin.common.confirm')}</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};