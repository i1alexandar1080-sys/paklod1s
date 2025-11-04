import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, Activity } from '../../lib/mockDatabase';
import { PlusCircleIcon } from '../icons';

interface ActivityManagementProps {
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold mb-4 text-white flex-shrink-0">{title}</h3>
                <div className="flex-grow overflow-y-auto pr-2 -mr-2">{children}</div>
            </div>
        </div>
    );
};

const InputField: React.FC<{ label: string; name: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }> = ({ label, name, value, onChange, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input type={type} name={name} value={value} onChange={onChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
    </div>
);

const TextAreaField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = ({ label, name, value, onChange, rows=3 }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <textarea name={name} value={value} onChange={onChange} rows={rows} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
    </div>
);

const ImageUploadField: React.FC<{label: string, imageSrc: string, altText: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ label, imageSrc, altText, onChange }) => (
     <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <img src={imageSrc} alt={altText} className="w-full h-32 object-contain rounded-md mb-2 bg-gray-700 p-2" />
        <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="w-full text-sm text-gray-300 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
        />
    </div>
);


export const ActivityManagement: React.FC<ActivityManagementProps> = ({ showToast }) => {
    const { t } = useTranslation();
    const [activities, setActivities] = useState(db.getActivities());
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Partial<Activity> | null>(null);

    const forceUpdate = () => setActivities([...db.getActivities()]);

    const openCreateModal = () => {
        setEditingActivity({ title: '', icon: '', amount: 0, taskContent: '', taskSteps: '' });
        setModalOpen(true);
    };

    const openEditModal = (activity: Activity) => {
        setEditingActivity({ ...activity });
        setModalOpen(true);
    };
    
    const closeModal = () => {
        setModalOpen(false);
        setEditingActivity(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingActivity) return;
        const { name, value } = e.target;
        if (name === 'icon') return; // Handled by image change handler
        setEditingActivity(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && editingActivity) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setEditingActivity(prev => ({ ...prev, icon: base64 }));
        }
    };


    const handleSave = () => {
        if (!editingActivity || !editingActivity.title) {
            showToast('Title is required.', 'error');
            return;
        }

        if (editingActivity.id) { // Editing
            db.updateActivity(editingActivity.id, editingActivity);
            showToast(t('admin.activities.updateSuccess'));
        } else { // Creating
            const { id, ...newActivityData } = editingActivity;
            db.addActivity(newActivityData as Omit<Activity, 'id'>);
            showToast(t('admin.activities.createSuccess'));
        }
        
        forceUpdate();
        closeModal();
    };

    const handleDelete = (activityId: string) => {
        if (window.confirm(t('admin.activities.deleteConfirm'))) {
            db.deleteActivity(activityId);
            showToast(t('admin.activities.deleteSuccess'));
            forceUpdate();
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">{t('admin.activities.title')}</h2>
                <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>{t('admin.activities.createNew')}</span>
                </button>
            </div>
            
            <div className="space-y-4">
                {activities.map(activity => (
                    <div key={activity.id} className="bg-gray-700/50 p-4 rounded-md flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <img src={activity.icon} alt={activity.title} className="w-12 h-12 object-contain bg-gray-800 p-1 rounded-md" />
                            <div>
                                <p className="font-semibold text-white">{activity.title}</p>
                                <p className="text-sm text-green-400">+{activity.amount} USDT</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => openEditModal(activity)} className="px-3 py-1.5 text-sm rounded-md bg-gray-600 hover:bg-gray-500">Edit</button>
                            <button onClick={() => handleDelete(activity.id)} className="px-3 py-1.5 text-sm rounded-md bg-red-800 hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingActivity?.id ? t('admin.activities.editTitle') : t('admin.activities.createNew')}>
                {editingActivity && (
                    <div className="space-y-4">
                        <InputField label={t('admin.activities.activityTitleLabel')} name="title" value={editingActivity.title || ''} onChange={handleFormChange as any} />
                        <InputField label={t('admin.activities.rewardAmountLabel')} name="amount" type="number" value={editingActivity.amount || 0} onChange={handleFormChange as any} />
                        <ImageUploadField 
                            label={t('admin.activities.iconUrlLabel')}
                            imageSrc={editingActivity.icon || ''}
                            altText="Activity Icon Preview"
                            onChange={handleImageChange}
                        />
                        <TextAreaField label={t('admin.activities.taskContentLabel')} name="taskContent" value={editingActivity.taskContent || ''} onChange={handleFormChange as any} rows={8} />
                        <TextAreaField label={t('admin.activities.taskStepsLabel')} name="taskSteps" value={editingActivity.taskSteps || ''} onChange={handleFormChange as any} rows={4} />
                        
                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={closeModal} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500">{t('admin.common.cancel')}</button>
                            <button onClick={handleSave} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{t('admin.common.saveChanges')}</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};