import React from 'react';
import { useTranslation } from 'react-i18next';
import { db, PlatformSettingsData } from '../lib/mockDatabase';
import { HeadsetIcon, EnvelopeIcon } from './icons';

interface CompanyProfileScreenProps {
    platformSettings: PlatformSettingsData;
}


export const CompanyProfileScreen: React.FC<CompanyProfileScreenProps> = ({ platformSettings }) => {
    const { t } = useTranslation();
    const { companyProfileText, companyProfileImages } = platformSettings;

    return (
        <div className="relative pb-24">
            <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4 md:p-6 text-white">
                <h2 className="text-2xl font-bold text-center mb-4">{t('companyProfile')}</h2>
                <div className="text-right text-gray-300 whitespace-pre-wrap leading-relaxed text-sm" dir="rtl">
                    {companyProfileText}
                </div>
                
                {companyProfileImages && companyProfileImages.length > 0 && (
                    <div className="mt-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {companyProfileImages.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`${t('companyProfile')} image ${index + 1}`}
                                    className="w-full h-auto object-cover rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
