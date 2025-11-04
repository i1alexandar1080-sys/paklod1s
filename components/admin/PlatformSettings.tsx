import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../lib/mockDatabase';
import type { RechargeCurrency, PlatformSettingsData } from '../../lib/mockDatabase';
import { CloseIcon, PlusCircleIcon } from '../icons';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

type ImageFieldNames = 'userAvatarUrls' | 'safeBoxImageUrls' | 'companyProfileImages' | 'homeCarouselImages';

interface PlatformSettingsProps {
    showToast: (message: string, type?: 'success' | 'error') => void;
}

// Helper components
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
                {children}
            </div>
        </div>
    );
};

const InputField: React.FC<{ label: string, name: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string }> = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const ColorField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, value, onChange }) => (
    <div className="flex-1">
        <label className="block text-xs text-gray-400 mb-1">{label}</label>
        <input type="color" value={value} onChange={onChange} className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer" />
    </div>
);

const TextAreaField: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, rows?: number }> = ({ label, name, value, onChange, rows = 3 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
);

const ImageListManager: React.FC<{ label: string, fieldName: ImageFieldNames, images: string[], onAdd: (fieldName: ImageFieldNames, e: React.ChangeEvent<HTMLInputElement>) => void, onRemove: (fieldName: ImageFieldNames, index: number) => void }> = ({ label, fieldName, images, onAdd, onRemove }) => (
    <div className="bg-gray-700/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">{label}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {(images || []).map((src, index) => (
                <div key={index} className="relative group">
                    <img src={src} alt={`${label} ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                    <button
                        onClick={() => onRemove(fieldName, index)}
                        className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
        <div>
            <label htmlFor={`add-image-${fieldName}`} className="cursor-pointer text-sm text-blue-400 hover:text-blue-300">{`+ Add Image`}</label>
            <input
                id={`add-image-${fieldName}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onAdd(fieldName, e)}
            />
        </div>
    </div>
);

interface PlatformSettingsFormState extends Omit<PlatformSettingsData, 'minWithdrawal' | 'maxWithdrawal' | 'withdrawalFeePercentage' | 'commissionRates' | 'loginRewards'> {
    minWithdrawal: string | number;
    maxWithdrawal: string | number;
    withdrawalFeePercentage: string | number;
    commissionRates: { [key: number]: string | number };
    loginRewards: { day: string | number; amount: string | number }[];
}

export const PlatformSettings: React.FC<PlatformSettingsProps> = ({ showToast }) => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState<PlatformSettingsFormState>({
        ...db.platformSettings,
        loginRewards: db.platformSettings.loginRewards || []
    });

    const [isCurrencyModalOpen, setCurrencyModalOpen] = useState(false);
    const [newCurrency, setNewCurrency] = useState<{ name: string; iconUrl: string; networks: string[] }>({ name: '', iconUrl: '', networks: [] });

    const iconKeyToLabel: { [key: string]: string } = {
        recharge: 'rechargeBalance',
        withdraw: 'withdraw',
        appDownload: 'appDownload',
        companyProfile: 'companyProfile',
        inviteFriends: 'inviteFriends',
        agencyCooperation: 'agencyCooperation',
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setSettings(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCommissionRateChange = (level: number, value: string) => {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setSettings(prev => ({
                ...prev,
                commissionRates: {
                    ...prev.commissionRates,
                    [level]: value,
                }
            }));
        }
    };
    
    const handleImageAdd = async (fieldName: ImageFieldNames, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setSettings(prev => ({
                ...prev,
                [fieldName]: [...(prev[fieldName] || []), base64]
            }));
            e.target.value = ''; // Reset file input
        }
    };

    const handleImageRemove = (fieldName: ImageFieldNames, index: number) => {
        setSettings(prev => ({
            ...prev,
            [fieldName]: (prev[fieldName] || []).filter((_, i) => i !== index)
        }));
    };
    
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            setSettings(prev => ({ ...prev, logoUrl: base64 }));
        }
    };
    
    const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            setSettings(prev => ({ ...prev, faviconUrl: base64 }));
        }
    };

    const handleCustomerServiceIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            setSettings(prev => ({ ...prev, customerServiceIconUrl: base64 }));
        }
    };

    const handleIconColorChange = (iconName: string, fromOrTo: 'from' | 'to', value: string) => {
        setSettings(prev => ({
            ...prev,
            homeIconColors: {
                ...prev.homeIconColors,
                [iconName]: {
                    ...(prev.homeIconColors[iconName] || { from: '', to: '' }),
                    [fromOrTo]: value,
                }
            }
        }));
    };

    const handleIconImageChange = async (iconKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setSettings(prev => ({
                ...prev,
                homeIconImages: {
                    ...(prev.homeIconImages || {}),
                    [iconKey]: base64,
                }
            }));
        }
    };


    // Recharge currency functions
    const handleCurrencyChange = (index: number, field: keyof Omit<RechargeCurrency, 'id'>, value: string) => {
        const updatedCurrencies = [...settings.rechargeCurrencies];
        if (field === 'networks') {
            updatedCurrencies[index] = { ...updatedCurrencies[index], [field]: value.split(',').map(s => s.trim()) };
        } else {
            updatedCurrencies[index] = { ...updatedCurrencies[index], [field]: value };
        }
        setSettings(prev => ({ ...prev, rechargeCurrencies: updatedCurrencies }));
    };

    const handleCurrencyIconChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            handleCurrencyChange(index, 'iconUrl', base64);
        }
    };
    
    const handleRemoveCurrency = (index: number) => {
        const updatedCurrencies = settings.rechargeCurrencies.filter((_, i) => i !== index);
        setSettings(prev => ({ ...prev, rechargeCurrencies: updatedCurrencies }));
    };

    const handleAddCurrency = () => {
        if (!newCurrency.name || !newCurrency.iconUrl || newCurrency.networks.length === 0 || !newCurrency.networks[0]) {
            showToast('Please fill all fields for the new currency.', 'error');
            return;
        }
        const newId = newCurrency.name.toLowerCase().replace(/\s/g, '');
        const finalNewCurrency: RechargeCurrency = { id: newId, ...newCurrency };

        setSettings(prev => ({ ...prev, rechargeCurrencies: [...prev.rechargeCurrencies, finalNewCurrency] }));
        setNewCurrency({ name: '', iconUrl: '', networks: [] });
        setCurrencyModalOpen(false);
    };

     const handleNewCurrencyIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            setNewCurrency(prev => ({...prev, iconUrl: base64}));
        }
    };
    
    const handleLoginRewardChange = (index: number, field: 'day' | 'amount', value: string) => {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            const updatedRewards = [...settings.loginRewards];
            updatedRewards[index] = { ...updatedRewards[index], [field]: value };
            setSettings(prev => ({ ...prev, loginRewards: updatedRewards }));
        }
    };
    
    const handleAddLoginReward = () => {
        const newDay = settings.loginRewards.length > 0 ? Math.max(...settings.loginRewards.map(r => Number(r.day))) + 1 : 1;
        setSettings(prev => ({
            ...prev,
            loginRewards: [...prev.loginRewards, { day: newDay, amount: '0' }]
        }));
    };
    
    const handleRemoveLoginReward = (index: number) => {
        setSettings(prev => ({
            ...prev,
            loginRewards: prev.loginRewards.filter((_, i) => i !== index)
        }));
    };


    const handleSaveChanges = () => {
        const finalLoginRewards = settings.loginRewards.map(r => ({
            day: parseInt(String(r.day), 10) || 0,
            amount: parseFloat(String(r.amount)) || 0
        })).filter(r => r.day > 0);

        db.platformSettings = {
            ...settings,
            minWithdrawal: parseFloat(String(settings.minWithdrawal)) || 0,
            maxWithdrawal: parseFloat(String(settings.maxWithdrawal)) || 0,
            withdrawalFeePercentage: parseFloat(String(settings.withdrawalFeePercentage)) || 0,
            commissionRates: {
                1: parseFloat(String(settings.commissionRates[1])) || 0,
                2: parseFloat(String(settings.commissionRates[2])) || 0,
                3: parseFloat(String(settings.commissionRates[3])) || 0,
            },
            loginRewards: finalLoginRewards,
        };
        showToast(t('admin.settings.updateSuccess'));
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow p-6 max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold text-white">{t('admin.settings.title')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label={t('admin.settings.platformName')} name="name" value={settings.name} onChange={handleInputChange} />
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.vips.uploadImage')}</label>
                    <div className="flex items-center gap-4 mt-2">
                        {settings.logoUrl && <img src={settings.logoUrl} alt="Logo Preview" className="w-12 h-12 bg-white p-1 rounded-md object-contain" />}
                        <input
                            type="file"
                            accept="image/svg+xml, image/png, image/jpeg, image/gif"
                            onChange={handleLogoUpload}
                            className="w-full text-sm text-gray-300 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Favicon (Browser Tab Icon)</label>
                    <div className="flex items-center gap-4 mt-2">
                        {settings.faviconUrl && <img src={settings.faviconUrl} alt="Favicon Preview" className="w-12 h-12 bg-white p-1 rounded-md object-contain" />}
                        <input
                            type="file"
                            accept="image/svg+xml, image/png, image/jpeg, image/gif, image/x-icon"
                            onChange={handleFaviconUpload}
                            className="w-full text-sm text-gray-300 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                        />
                    </div>
                </div>


                <InputField label={t('admin.settings.primaryColor')} name="primaryColor" type="color" value={settings.primaryColor} onChange={handleInputChange} />
                <InputField label={t('admin.settings.secondaryColor')} name="secondaryColor" type="color" value={settings.secondaryColor} onChange={handleInputChange} />
                <InputField label={t('admin.settings.headerColor')} name="headerColor" type="color" value={settings.headerColor} onChange={handleInputChange} />
                <InputField label="Box/Card Background Color" name="cardColor" type="color" value={settings.cardColor} onChange={handleInputChange} />
                <InputField label={t('admin.settings.iconColor')} name="iconColor" type="color" value={settings.iconColor} onChange={handleInputChange} />
                <InputField label={t('admin.settings.customerServiceNameLabel')} name="customerServiceName" value={settings.customerServiceName} onChange={handleInputChange} />
                <InputField label={t('admin.settings.customerServiceLink')} name="customerServiceLink" value={settings.customerServiceLink} onChange={handleInputChange} />
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.settings.customerServiceIcon')}</label>
                    <div className="flex items-center gap-4 mt-2">
                        {settings.customerServiceIconUrl && <img src={settings.customerServiceIconUrl} alt="CS Icon Preview" className="w-12 h-12 bg-gray-600 p-1 rounded-full object-contain" />}
                        <input
                            type="file"
                            accept="image/svg+xml, image/png, image/jpeg, image/gif"
                            onChange={handleCustomerServiceIconUpload}
                            className="w-full text-sm text-gray-300 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                        />
                    </div>
                </div>
                <div className="md:col-span-2">
                    <InputField label={t('admin.settings.referralDomain')} name="referralDomain" value={settings.referralDomain} onChange={handleInputChange} />
                </div>
                <InputField label={t('admin.settings.minWithdrawal')} name="minWithdrawal" value={settings.minWithdrawal} onChange={handleNumericInputChange} />
                <InputField label={t('admin.settings.maxWithdrawal')} name="maxWithdrawal" value={settings.maxWithdrawal} onChange={handleNumericInputChange} />
                <InputField label={t('admin.settings.withdrawalFeePercentage')} name="withdrawalFeePercentage" value={settings.withdrawalFeePercentage} onChange={handleNumericInputChange} />
                <div className="md:col-span-2">
                    <TextAreaField label={t('admin.settings.homeMarqueeText')} name="homeMarqueeText" value={settings.homeMarqueeText} onChange={handleInputChange} />
                </div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Home Screen Icon Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(settings.homeIconColors || {}).map((iconKey) => {
                         const colors = settings.homeIconColors[iconKey] || { from: '#000000', to: '#000000' };
                        return (
                            <div key={iconKey} className="bg-gray-800 p-3 rounded-md">
                                <p className="font-medium text-white mb-2 capitalize">{t(iconKeyToLabel[iconKey])}</p>
                                <div className="flex gap-4">
                                    <ColorField label="From" value={colors.from} onChange={(e) => handleIconColorChange(iconKey, 'from', e.target.value)} />
                                    <ColorField label="To" value={colors.to} onChange={(e) => handleIconColorChange(iconKey, 'to', e.target.value)} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Home Screen Icon Images */}
            <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Home Screen Icon Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.keys(iconKeyToLabel).map((iconKey) => (
                        <div key={iconKey} className="bg-gray-800 p-3 rounded-md">
                            <p className="font-medium text-white mb-2 capitalize">{t(iconKeyToLabel[iconKey])}</p>
                            <div className="flex items-center gap-4">
                                <img src={settings.homeIconImages?.[iconKey] || 'https://placehold.co/64x64/2d3748/a0aec0?text=?'} alt={`${iconKey} preview`} className="w-16 h-16 object-cover rounded-full bg-gray-700" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleIconImageChange(iconKey, e)}
                                    className="w-full text-sm text-gray-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">{t('admin.settings.commissionRatesTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField 
                        label={t('admin.settings.commissionRateLevel1')} 
                        name="commissionRate1" 
                        value={settings.commissionRates[1]} 
                        onChange={(e) => handleCommissionRateChange(1, e.target.value)} 
                    />
                    <InputField 
                        label={t('admin.settings.commissionRateLevel2')} 
                        name="commissionRate2" 
                        value={settings.commissionRates[2]} 
                        onChange={(e) => handleCommissionRateChange(2, e.target.value)} 
                    />
                    <InputField 
                        label={t('admin.settings.commissionRateLevel3')} 
                        name="commissionRate3" 
                        value={settings.commissionRates[3]} 
                        onChange={(e) => handleCommissionRateChange(3, e.target.value)} 
                    />
                </div>
            </div>
            
            <ImageListManager label={t('admin.settings.userAvatars')} fieldName="userAvatarUrls" images={settings.userAvatarUrls} onAdd={handleImageAdd} onRemove={handleImageRemove} />
            <ImageListManager label={t('admin.settings.safeBoxImages')} fieldName="safeBoxImageUrls" images={settings.safeBoxImageUrls} onAdd={handleImageAdd} onRemove={handleImageRemove} />
            <ImageListManager label={t('admin.settings.homeCarouselImages')} fieldName="homeCarouselImages" images={settings.homeCarouselImages} onAdd={handleImageAdd} onRemove={handleImageRemove} />

            {/* Login Rewards Management */}
            <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">{t('admin.settings.loginRewardsTitle')}</h3>
                    <button onClick={handleAddLoginReward} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                        <PlusCircleIcon className="w-5 h-5"/>
                        <span>{t('admin.settings.addLoginReward')}</span>
                    </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {settings.loginRewards.map((reward, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 items-center">
                            <InputField 
                                label={t('admin.settings.rewardDay')}
                                name={`reward-day-${index}`}
                                value={reward.day}
                                onChange={(e) => handleLoginRewardChange(index, 'day', e.target.value)}
                            />
                            <InputField 
                                label={t('admin.settings.rewardAmount')}
                                name={`reward-amount-${index}`}
                                value={reward.amount}
                                onChange={(e) => handleLoginRewardChange(index, 'amount', e.target.value)}
                            />
                            <button onClick={() => handleRemoveLoginReward(index)} className="text-red-400 hover:text-red-300 text-sm font-semibold self-end mb-2">
                                {t('admin.settings.delete')}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recharge Currencies Management */}
            <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">{t('admin.settings.rechargeCurrenciesTitle')}</h3>
                    <button onClick={() => setCurrencyModalOpen(true)} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                        <PlusCircleIcon className="w-5 h-5"/>
                        <span>{t('admin.settings.addCurrency')}</span>
                    </button>
                </div>
                <div className="space-y-4">
                    {settings.rechargeCurrencies.map((currency, index) => (
                        <div key={currency.id} className="bg-gray-800 p-3 rounded-md grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                            <InputField label={t('admin.settings.currencyName')} name="name" value={currency.name} onChange={(e) => handleCurrencyChange(index, 'name', e.target.value)} />
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.settings.currencyIcon')}</label>
                                <div className="flex items-center gap-2">
                                    <img src={currency.iconUrl} alt={currency.name} className="w-8 h-8 rounded-full bg-white p-1 object-contain" />
                                    <input type="file" accept="image/*" onChange={(e) => handleCurrencyIconChange(index, e)} className="text-xs text-gray-400 file:text-xs file:p-1 file:rounded file:border-0 file:bg-gray-600 file:text-gray-300" />
                                </div>
                            </div>
                            
                            <div className="sm:col-span-2">
                                <InputField label={t('admin.settings.currencyNetworks')} name="networks" value={currency.networks.join(', ')} onChange={(e) => handleCurrencyChange(index, 'networks', e.target.value)} />
                            </div>
                            <div className="sm:col-span-1 flex justify-end">
                                <button onClick={() => handleRemoveCurrency(index)} className="text-red-400 hover:text-red-300 text-sm font-semibold">
                                    {t('admin.settings.delete')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-2">
                <button
                    onClick={handleSaveChanges}
                    className="w-full px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    {t('admin.common.saveChanges')}
                </button>
            </div>
            
             <Modal isOpen={isCurrencyModalOpen} onClose={() => setCurrencyModalOpen(false)} title={t('admin.settings.addCurrency')}>
                <div className="space-y-4">
                    <InputField label={t('admin.settings.currencyName')} name="name" value={newCurrency.name} onChange={(e) => setNewCurrency(prev => ({ ...prev, name: e.target.value }))} />
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.settings.currencyIcon')}</label>
                         {newCurrency.iconUrl && <img src={newCurrency.iconUrl} alt="New Icon Preview" className="w-8 h-8 rounded-full bg-white p-1 mb-2 object-contain"/>}
                        <input type="file" accept="image/*" onChange={handleNewCurrencyIconChange} className="text-sm text-gray-400 file:text-sm file:p-1 file:rounded file:border-0 file:bg-gray-600 file:text-gray-300"/>
                    </div>
                    <InputField label={t('admin.settings.currencyNetworks')} name="networks" value={newCurrency.networks.join(', ')} onChange={(e) => setNewCurrency(prev => ({ ...prev, networks: e.target.value.split(',').map(s => s.trim()) }))} />

                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={() => setCurrencyModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500">{t('admin.common.cancel')}</button>
                        <button onClick={handleAddCurrency} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{t('admin.common.confirm')}</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};