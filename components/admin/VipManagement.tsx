import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../lib/mockDatabase';
import type { VipLevel } from '../../components/VIPScreen';
import { PlusCircleIcon } from '../icons';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

interface VipManagementProps {
    showToast: (message: string, type?: 'success' | 'error') => void;
}

// --- Helper Components (moved outside) ---

const InputField: React.FC<{label: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']}> = ({ label, value, onChange, type = "text", inputMode }) => (
    <div>
        <label className="block text-xs text-gray-400 mb-1">{label}</label>
        <input
            type={type}
            inputMode={inputMode}
            value={value}
            onChange={onChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-white text-sm"
        />
    </div>
);

const ImageUploadField: React.FC<{label: string, imageSrc: string, altText: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ label, imageSrc, altText, onChange }) => (
     <div>
        <label className="block text-xs text-gray-400 mb-1">{label}</label>
        <img src={imageSrc} alt={altText} className="w-full h-32 object-cover rounded-md mb-2 bg-gray-700" />
        <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="w-full text-sm text-gray-300 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
        />
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

// --- Main Component ---

export const VipManagement: React.FC<VipManagementProps> = ({ showToast }) => {
    const { t } = useTranslation();
    const [levels, setLevels] = useState<any[]>(db.getVipLevels().map(l => ({
        ...l,
        unlockCost: String(l.unlockCost || '0'),
        benefit: String(l.benefit || '0'),
        dailyProfit: String(l.dailyProfit || '0'),
        totalProfit: String(l.totalProfit || '0'),
        tasks: String(l.tasks || '0'),
    })));
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    
    const initialNewLevelState = {
        name: '',
        imageSrc: 'https://images.unsplash.com/photo-1612187192690-f21d3f671198?w=300',
        unlockCost: '',
        benefit: '',
        dailyProfit: '',
        totalProfit: '',
        tasks: '1',
    };
    const [newLevel, setNewLevel] = useState<any>(initialNewLevelState);

    const handleInputChange = (id: string, field: string, value: string) => {
        const isNumericField = ['unlockCost', 'benefit', 'dailyProfit', 'totalProfit', 'tasks'].includes(field);
        if (isNumericField) {
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setLevels(prevLevels =>
                    prevLevels.map(level =>
                        level.id === id ? { ...level, [field]: value } : level
                    )
                );
            }
        } else {
             setLevels(prevLevels =>
                prevLevels.map(level =>
                    level.id === id ? { ...level, [field]: value } : level
                )
            );
        }
    };
    
    const handleImageChange = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setLevels(prevLevels =>
                prevLevels.map(level =>
                    level.id === id ? { ...level, imageSrc: base64 } : level
                )
            );
        }
    };
    
    const handleNewLevelChange = (field: string, value: string) => {
        const isNumericField = ['unlockCost', 'benefit', 'dailyProfit', 'totalProfit', 'tasks'].includes(field);
        if (isNumericField) {
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                 setNewLevel(prev => ({ ...prev, [field]: value }));
            }
        } else {
             setNewLevel(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleNewLevelImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setNewLevel(prev => ({ ...prev, imageSrc: base64 }));
        }
    };

    const handleSaveChanges = (id: string) => {
        const levelToSave = levels.find(level => level.id === id);
        if (levelToSave) {
            const index = db.vipLevelsData.findIndex(level => level.id === id);
            if (index !== -1) {
                const finalLevelData = {
                    ...levelToSave,
                    unlockCost: parseFloat(String(levelToSave.unlockCost)) || 0,
                    benefit: parseFloat(String(levelToSave.benefit)) || 0,
                    dailyProfit: parseFloat(String(levelToSave.dailyProfit)) || 0,
                    totalProfit: parseFloat(String(levelToSave.totalProfit)) || 0,
                    tasks: parseInt(String(levelToSave.tasks), 10) || 0,
                };
                db.vipLevelsData[index] = finalLevelData;
                showToast(`${finalLevelData.name} ${t('admin.vips.updateSuccess')}`);
            }
        }
    };
    
    const handleAddNewLevel = () => {
        if (!newLevel.name?.trim()) {
            showToast(t('admin.vips.nameRequired'), 'error');
            return;
        }
        
        const finalNewLevel: Partial<VipLevel> = {
            ...newLevel,
            unlockCost: parseFloat(newLevel.unlockCost) || 0,
            benefit: parseFloat(newLevel.benefit) || 0,
            dailyProfit: parseFloat(newLevel.dailyProfit) || 0,
            totalProfit: parseFloat(newLevel.totalProfit) || 0,
            tasks: parseInt(newLevel.tasks, 10) || 1,
        };

        const addedLevel = db.addVipLevel(finalNewLevel);
        showToast(t('admin.vips.createSuccess', { levelName: addedLevel.name }));
        setLevels(db.getVipLevels().map(l => ({
            ...l,
            unlockCost: String(l.unlockCost || '0'),
            benefit: String(l.benefit || '0'),
            dailyProfit: String(l.dailyProfit || '0'),
            totalProfit: String(l.totalProfit || '0'),
            tasks: String(l.tasks || '0'),
        })));
        setAddModalOpen(false);
        setNewLevel(initialNewLevelState);
    };

    return (
        <div>
            <div className="mb-6">
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>{t('admin.vips.addNewLevel')}</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levels.map(level => (
                    <div key={level.id} className="bg-gray-800 rounded-lg shadow p-4 space-y-4 flex flex-col">
                        <h3 className="text-lg font-semibold text-white sr-only">{level.name}</h3>
                        <div className="space-y-3 flex-grow">
                             <InputField 
                                label={t('admin.vips.levelName')}
                                value={level.name}
                                onChange={(e) => handleInputChange(level.id, 'name', e.target.value)}
                             />
                             <ImageUploadField
                                label={t('admin.vips.uploadImage')}
                                imageSrc={level.imageSrc}
                                altText={level.name}
                                onChange={(e) => handleImageChange(level.id, e)}
                             />
                             <InputField 
                                label={t('admin.vips.unlockCost')}
                                type="text" inputMode="decimal"
                                value={level.unlockCost}
                                onChange={(e) => handleInputChange(level.id, 'unlockCost', e.target.value)}
                             />
                             <InputField 
                                label={t('simpleBenefit')}
                                type="text" inputMode="decimal"
                                value={level.benefit}
                                onChange={(e) => handleInputChange(level.id, 'benefit', e.target.value)}
                             />
                             <InputField 
                                label={t('dailyProfit')}
                                type="text" inputMode="decimal"
                                value={level.dailyProfit}
                                onChange={(e) => handleInputChange(level.id, 'dailyProfit', e.target.value)}
                             />
                              <InputField 
                                label={t('totalProfit')}
                                type="text" inputMode="decimal"
                                value={level.totalProfit}
                                onChange={(e) => handleInputChange(level.id, 'totalProfit', e.target.value)}
                             />
                        </div>
                         <button
                            onClick={() => handleSaveChanges(level.id)}
                            className="w-full mt-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            {t('admin.common.saveChanges')}
                        </button>
                    </div>
                ))}
            </div>
            
            <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title={t('admin.vips.addNewLevel')}>
                <div className="space-y-4">
                    <InputField label={t('admin.vips.levelName')} value={newLevel.name || ''} onChange={e => handleNewLevelChange('name', e.target.value)} />
                    <ImageUploadField 
                        label={t('admin.vips.uploadImage')} 
                        imageSrc={newLevel.imageSrc || ''} 
                        altText="New level preview" 
                        onChange={handleNewLevelImageChange} 
                    />
                    <InputField label={t('admin.vips.unlockCost')} type="text" inputMode="decimal" value={newLevel.unlockCost} onChange={e => handleNewLevelChange('unlockCost', e.target.value)} />
                    <InputField label={t('simpleBenefit')} type="text" inputMode="decimal" value={newLevel.benefit} onChange={e => handleNewLevelChange('benefit', e.target.value)} />
                    <InputField label={t('dailyProfit')} type="text" inputMode="decimal" value={newLevel.dailyProfit} onChange={e => handleNewLevelChange('dailyProfit', e.target.value)} />
                    <InputField label={t('totalProfit')} type="text" inputMode="decimal" value={newLevel.totalProfit} onChange={e => handleNewLevelChange('totalProfit', e.target.value)} />
                    <InputField label={t('admin.vips.tasksPerDay')} type="text" inputMode="decimal" value={newLevel.tasks} onChange={e => handleNewLevelChange('tasks', e.target.value)} />
                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={() => setAddModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500">{t('admin.common.cancel')}</button>
                        <button onClick={handleAddNewLevel} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{t('admin.common.confirm')}</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};