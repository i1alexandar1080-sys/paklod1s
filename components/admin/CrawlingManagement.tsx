import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { db, User, CrawlTask, customizableTaskIds, VipCrawlTaskOverrides } from '../../lib/mockDatabase';
import { SearchIcon } from '../icons';

interface CrawlingManagementProps {
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

const InputField: React.FC<{label: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'], placeholder?: string}> = ({ label, value, onChange, type = "text", inputMode, placeholder }) => (
    <div>
        <label className="block text-xs text-gray-400 mb-1">{label}</label>
        <input
            type={type}
            inputMode={inputMode}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
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

export const CrawlingManagement: React.FC<CrawlingManagementProps> = ({ showToast }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'user' | 'global'>('user');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // State for User Overrides tab
    const [enabledSets, setEnabledSets] = useState<Record<number, boolean>>({});
    const [taskOverrides, setTaskOverrides] = useState<Record<number, Record<string, { price?: string, income?: string }>>>({});

    // State for Global Tasks tab
    const [selectedVipId, setSelectedVipId] = useState<string>(db.vipLevelsData[0]?.id || '');
    const [editableVipTasks, setEditableVipTasks] = useState<Record<number, CrawlTask[]>>({});


    const allBaseTasks = useMemo(() => {
        const tasks: Record<number, CrawlTask[]> = {};
        for (const setIndexStr in customizableTaskIds) {
            const setIndex = parseInt(setIndexStr, 10);
            tasks[setIndex] = [];
            const taskIds = customizableTaskIds[setIndex];
            for (const id of taskIds) {
                const task = db.crawlTaskPools[setIndex]?.find(t => t.id === id);
                if (task) {
                    tasks[setIndex].push(task);
                }
            }
        }
        return tasks;
    }, []);

    // Effect for User Overrides tab
    useEffect(() => {
        if (activeTab === 'user' && selectedUser) {
            const initialEnabled: Record<number, boolean> = {};
            const initialOverrides: Record<number, Record<string, { price?: string, income?: string }>> = {};

            [1, 2, 3].forEach(index => {
                const userCrawlSet = selectedUser.crawlSets?.[index];
                initialEnabled[index] = userCrawlSet?.enabled || false;
                initialOverrides[index] = {};

                customizableTaskIds[index].forEach(id => {
                    const override = userCrawlSet?.taskOverrides?.[id];
                    initialOverrides[index][id] = {
                        price: override?.price?.toString() ?? '',
                        income: override?.income?.toString() ?? ''
                    };
                });
            });
            setEnabledSets(initialEnabled);
            setTaskOverrides(initialOverrides);

        } else {
            setEnabledSets({});
            setTaskOverrides({});
        }
    }, [selectedUser, activeTab]);
    
    // Effect for Global Tasks tab
    useEffect(() => {
        if (activeTab === 'global' && selectedVipId) {
            const vipLevel = db.vipLevelsData.find(v => v.id === selectedVipId);
            if (!vipLevel) return;
    
            const effectiveTasks: Record<number, CrawlTask[]> = JSON.parse(JSON.stringify(db.crawlTaskPools));
            const vipOverrides = db.vipCrawlTaskSettings[vipLevel.name];
    
            if (vipOverrides) {
                for (const setIndexStr in vipOverrides) {
                    const setIndex = parseInt(setIndexStr, 10);
                    if (effectiveTasks[setIndex]) {
                        for (const taskId in vipOverrides[setIndex]) {
                            const taskIndex = effectiveTasks[setIndex].findIndex(t => t.id === taskId);
                            if (taskIndex !== -1) {
                                Object.assign(effectiveTasks[setIndex][taskIndex], vipOverrides[setIndex][taskId]);
                            }
                        }
                    }
                }
            }
            setEditableVipTasks(effectiveTasks);
        }
    }, [selectedVipId, activeTab]);

    
    // Search logic for User Overrides tab
    const filteredUsers = useMemo(() => {
        if (!searchQuery) return db.users; // Show all users by default
        const lowercasedQuery = searchQuery.toLowerCase();
        return db.users.filter(u =>
            u.email.toLowerCase().includes(lowercasedQuery) ||
            (u.phone && u.phone.includes(lowercasedQuery)) ||
            u.invitationCode.toLowerCase().includes(lowercasedQuery) ||
            u.ipAddress.includes(lowercasedQuery)
        );
    }, [searchQuery]);

    // Handlers for User Overrides tab
    const handleTaskOverrideChange = (setIndex: number, taskId: string, field: 'price' | 'income', value: string) => {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setTaskOverrides(prev => ({
                ...prev,
                [setIndex]: {
                    ...prev[setIndex],
                    [taskId]: {
                        ...prev[setIndex]?.[taskId],
                        [field]: value,
                    }
                }
            }));
        }
    };

    const handleSaveChanges = () => {
        if (!selectedUser) return;

        const finalCrawlSets = { ...selectedUser.crawlSets };

        for (const setIndex of [1, 2, 3]) {
            const finalOverrides: { [taskId: string]: { price?: number; income?: number } } = {};
            let hasOverrides = false;
            
            const currentOverrides = taskOverrides[setIndex] || {};
            Object.entries(currentOverrides).forEach(([taskId, values]) => {
                const price = parseFloat(values.price ?? '');
                const income = parseFloat(values.income ?? '');
                const currentOverride: { price?: number; income?: number } = {};
                let taskHasOverride = false;

                if (!isNaN(price)) {
                    currentOverride.price = price;
                    taskHasOverride = true;
                }
                if (!isNaN(income)) {
                    currentOverride.income = income;
                    taskHasOverride = true;
                }

                if (taskHasOverride) {
                    finalOverrides[taskId] = currentOverride;
                    hasOverrides = true;
                }
            });

            finalCrawlSets[setIndex] = {
                ...(finalCrawlSets[setIndex] || { activeTaskIds: [], completedTasks: [] }),
                enabled: enabledSets[setIndex],
                taskOverrides: hasOverrides ? finalOverrides : undefined,
            };
        }
        
        db.updateUser(selectedUser.id, { crawlSets: finalCrawlSets });
        showToast(`Settings for ${selectedUser.email} saved successfully.`);
        
        const updatedUser = db.findUserById(selectedUser.id);
        if (updatedUser) setSelectedUser({ ...updatedUser }); // Force state update
    };
    
    // Handlers for Global Tasks tab
    const handleGlobalTaskChange = (setIndex: number, taskId: string, field: 'name' | 'price' | 'income', value: string) => {
        const isNumeric = ['price', 'income'].includes(field);
        if (isNumeric && value !== '' && !/^\d*\.?\d*$/.test(value)) return;
    
        setEditableVipTasks(prev => {
            const newTasks = JSON.parse(JSON.stringify(prev));
            const taskIndex = newTasks[setIndex].findIndex((t: CrawlTask) => t.id === taskId);
            if (taskIndex !== -1) {
                newTasks[setIndex][taskIndex][field] = value;
            }
            return newTasks;
        });
    };
    
    const handleGlobalTaskImageChange = async (setIndex: number, taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            setEditableVipTasks(prev => {
                const newTasks = JSON.parse(JSON.stringify(prev));
                const taskIndex = newTasks[setIndex].findIndex((t: CrawlTask) => t.id === taskId);
                if (taskIndex !== -1) {
                    newTasks[setIndex][taskIndex].imageSrc = base64;
                }
                return newTasks;
            });
        }
    };

    const handleGlobalSave = () => {
        if (!selectedVipId) return;
        const vipLevel = db.vipLevelsData.find(v => v.id === selectedVipId);
        if (!vipLevel) return;
    
        const vipLevelName = vipLevel.name;
        const vipOverridesForLevel: VipCrawlTaskOverrides[string] = {};
        let hasAnyOverridesForLevel = false;
    
        for (const setIndexStr in editableVipTasks) {
            const setIndex = parseInt(setIndexStr, 10);
            const baseTasks = db.crawlTaskPools[setIndex];
            const editedTasks = editableVipTasks[setIndex];
    
            const setOverrides: { [taskId: string]: Partial<CrawlTask> } = {};
            let hasOverridesInSet = false;
    
            for (const editedTask of editedTasks) {
                const baseTask = baseTasks.find(t => t.id === (editedTask as CrawlTask).id);
                if (!baseTask) continue;
    
                const taskOverride: Partial<CrawlTask> = {};
                let hasTaskOverride = false;
                
                // FIX: Cast `editedTask` to `CrawlTask` to access properties on the `unknown` type.
                const editedPrice = parseFloat(String((editedTask as CrawlTask).price));
                const editedIncome = parseFloat(String((editedTask as CrawlTask).income));
    
                if ((editedTask as CrawlTask).name !== baseTask.name) {
                    taskOverride.name = (editedTask as CrawlTask).name;
                    hasTaskOverride = true;
                }
                if ((editedTask as CrawlTask).imageSrc !== baseTask.imageSrc) {
                    taskOverride.imageSrc = (editedTask as CrawlTask).imageSrc;
                    hasTaskOverride = true;
                }
                if (!isNaN(editedPrice) && editedPrice !== baseTask.price) {
                    taskOverride.price = editedPrice;
                    hasTaskOverride = true;
                }
                if (!isNaN(editedIncome) && editedIncome !== baseTask.income) {
                    taskOverride.income = editedIncome;
                    hasTaskOverride = true;
                }
    
                if (hasTaskOverride) {
                    setOverrides[(editedTask as CrawlTask).id] = taskOverride;
                    hasOverridesInSet = true;
                }
            }
            if (hasOverridesInSet) {
                vipOverridesForLevel[setIndex] = setOverrides;
                hasAnyOverridesForLevel = true;
            }
        }
        
        if (hasAnyOverridesForLevel) {
            db.vipCrawlTaskSettings[vipLevelName] = vipOverridesForLevel;
        } else {
            delete db.vipCrawlTaskSettings[vipLevelName];
        }
        
        showToast(`Global settings for ${vipLevelName} saved successfully.`);
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-white mb-4">{t('admin.crawling.title')}</h2>
            
            <div className="flex border-b border-gray-700 mb-4">
                <button onClick={() => setActiveTab('user')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'user' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                    {t('admin.crawling.userOverridesTab')}
                </button>
                <button onClick={() => setActiveTab('global')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'global' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                    {t('admin.crawling.globalTasksTab')}
                </button>
            </div>
            
            {activeTab === 'user' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 bg-gray-900/50 rounded-lg p-4 h-[75vh] overflow-y-auto">
                        <div className="relative mb-4">
                            <SearchIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('admin.crawling.searchUsers')}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        {filteredUsers.length > 0 ? (
                            <ul className="space-y-2">
                                {filteredUsers.map(user => (
                                    <li key={user.id}>
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className={`w-full text-left p-3 rounded-md transition-colors ${selectedUser?.id === user.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                                        >
                                            <p className="font-medium">{user.email}</p>
                                            <p className="text-xs text-gray-400">ID: {user.id}</p>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-center text-gray-500 mt-4">{t('admin.crawling.noUsersFound')}</p>
                        )}
                    </div>
    
                    <div className="md:col-span-2 bg-gray-900/50 rounded-lg p-6 h-[75vh] overflow-y-auto">
                        {!selectedUser ? (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                {t('admin.crawling.noUserSelected')}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-white">{t('admin.crawling.manageUser')} {selectedUser.email}</h3>
                                
                                {[1, 2, 3].map(setIndex => (
                                    <div key={setIndex} className="bg-gray-800 p-4 rounded-md">
                                        <h4 className="font-semibold mb-3">{t('admin.crawling.crawlSet', { index: setIndex })}</h4>
                                        <div className="flex items-center justify-between mb-4">
                                            <label htmlFor={`crawler-toggle-${setIndex}`} className="text-sm text-gray-300">{t('admin.crawling.enableCrawlSet', { index: setIndex })}</label>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" id={`crawler-toggle-${setIndex}`} className="sr-only peer" checked={enabledSets[setIndex] || false} onChange={() => setEnabledSets(prev => ({ ...prev, [setIndex]: !prev[setIndex] }))} />
                                                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
    
                                        <h5 className="font-semibold text-sm mb-3 pt-3 border-t border-gray-700">{t('admin.crawling.taskOverrides')}</h5>
                                        <div className="space-y-4">
                                            {(allBaseTasks[setIndex] || []).map(task => (
                                                <div key={task.id} className="border-b border-gray-700 pb-3 last:border-b-0">
                                                    <p className="font-medium text-sm mb-2">{task.name}</p>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-xs text-gray-400">{t('admin.crawling.price')}</label>
                                                            <input
                                                                type="text"
                                                                inputMode="decimal"
                                                                value={taskOverrides[setIndex]?.[task.id]?.price ?? ''}
                                                                onChange={(e) => handleTaskOverrideChange(setIndex, task.id, 'price', e.target.value)}
                                                                placeholder={`${t('admin.crawling.default')} ${task.price.toFixed(2)}`}
                                                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 mt-1 text-white text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-400">{t('admin.crawling.income')}</label>
                                                            <input
                                                                type="text"
                                                                inputMode="decimal"
                                                                value={taskOverrides[setIndex]?.[task.id]?.income ?? ''}
                                                                onChange={(e) => handleTaskOverrideChange(setIndex, task.id, 'income', e.target.value)}
                                                                placeholder={`${t('admin.crawling.default')} ${task.income.toFixed(2)}`}
                                                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 mt-1 text-white text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                
                                <div>
                                    <button
                                        onClick={handleSaveChanges}
                                        className="w-full px-4 py-2.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        {t('admin.common.saveChanges')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {activeTab === 'global' && (
                 <div className="space-y-4 h-[75vh] flex flex-col">
                    <div className="flex-shrink-0">
                        <label htmlFor="vip-level-select" className="block text-sm font-medium text-gray-300 mb-2">{t('admin.crawling.globalDefaultsFor')}</label>
                        <select
                            id="vip-level-select"
                            value={selectedVipId}
                            onChange={(e) => setSelectedVipId(e.target.value)}
                            className="w-full md:w-1/2 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>{t('admin.crawling.selectVipLevel')}</option>
                            {db.vipLevelsData.map(level => (
                                <option key={level.id} value={level.id}>{level.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-grow overflow-y-auto pr-2 space-y-8">
                        {Object.entries(editableVipTasks).map(([setIndexStr, tasks]) => {
                            const setIndex = parseInt(setIndexStr, 10);
                            return (
                                <div key={setIndex} className="bg-gray-900/50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-white mb-4">{t('admin.crawling.crawlSet', { index: setIndex })}</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {(tasks as any[]).map(task => (
                                            <div key={task.id} className="bg-gray-800 p-4 rounded-md space-y-3">
                                                <InputField 
                                                    label={t('admin.crawling.taskName')} 
                                                    value={task.name} 
                                                    onChange={(e) => handleGlobalTaskChange(setIndex, task.id, 'name', e.target.value)} 
                                                />
                                                <ImageUploadField 
                                                    label={t('admin.crawling.taskImage')} 
                                                    imageSrc={task.imageSrc} 
                                                    altText={task.name} 
                                                    onChange={(e) => handleGlobalTaskImageChange(setIndex, task.id, e)} 
                                                />
                                                <InputField 
                                                    label={t('admin.crawling.price')} 
                                                    value={task.price} 
                                                    onChange={(e) => handleGlobalTaskChange(setIndex, task.id, 'price', e.target.value)} 
                                                    type="text" 
                                                    inputMode="decimal"
                                                />
                                                <InputField 
                                                    label={t('admin.crawling.income')} 
                                                    value={task.income} 
                                                    onChange={(e) => handleGlobalTaskChange(setIndex, task.id, 'income', e.target.value)} 
                                                    type="text" 
                                                    inputMode="decimal"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex-shrink-0 pt-4">
                        <button onClick={handleGlobalSave} className="w-full px-4 py-2.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                            {t('admin.common.saveChanges')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};