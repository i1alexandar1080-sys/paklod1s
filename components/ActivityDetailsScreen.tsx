import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db, PlatformSettingsData, User } from '../lib/mockDatabase';
import { UploadIcon, GlobeIcon } from './icons';
import { GoogleGenAI } from '@google/genai';
import { languages } from '../lib/languages';

interface ActivityDetailsScreenProps {
    activityId: string;
    platformSettings: PlatformSettingsData;
    user: User;
    showInfoModal: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const translationCache: { [key: string]: { title: string; content: string; steps: string } } = {};

export const ActivityDetailsScreen: React.FC<ActivityDetailsScreenProps> = ({ activityId, platformSettings, user, showInfoModal }) => {
    const { t, i18n } = useTranslation();
    const activity = db.activitiesData.find(a => a.id === activityId);
    
    const [copied, setCopied] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [completionNotes, setCompletionNotes] = useState('');

    const [displayTitle, setDisplayTitle] = useState(activity?.title || '');
    const [displayContent, setDisplayContent] = useState(activity?.taskContent || '');
    const [displaySteps, setDisplaySteps] = useState(activity?.taskSteps || '');
    const [isTranslating, setIsTranslating] = useState(false);
    const [translationError, setTranslationError] = useState('');
    
    const customDomain = db.platformSettings.referralDomain;
    const baseUrl = customDomain && customDomain.startsWith('http') 
        ? customDomain.replace(/\/$/, '') 
        : window.location.origin;
    const referralLink = `${baseUrl}/?ref=${user.invitationCode}`;

    useEffect(() => {
        if (!activity) return;

        const targetLangCode = i18n.language;
        const targetLangName = languages.find(l => l.code === targetLangCode)?.name || targetLangCode;
        const cacheKey = `activity-${activity.id}-${targetLangCode}`;
        const sourceLanguageCode = 'ar';
        
        const sourceTitle = activity.title;
        const sourceContent = activity.taskContent;
        const sourceSteps = activity.taskSteps;

        const translate = async () => {
            if (targetLangCode.startsWith(sourceLanguageCode)) {
                setDisplayTitle(sourceTitle);
                setDisplayContent(sourceContent);
                setDisplaySteps(sourceSteps);
                setIsTranslating(false);
                setTranslationError('');
                return;
            }

            if (translationCache[cacheKey]) {
                setDisplayTitle(translationCache[cacheKey].title);
                setDisplayContent(translationCache[cacheKey].content);
                setDisplaySteps(translationCache[cacheKey].steps);
                setIsTranslating(false);
                setTranslationError('');
                return;
            }
            
            setDisplayTitle(sourceTitle);
            setDisplayContent(sourceContent);
            setDisplaySteps(sourceSteps);
            setIsTranslating(true);
            setTranslationError('');

            try {
                if (!process.env.API_KEY) throw new Error("API key not configured.");
                
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                const jsonSafeContent = sourceContent.replace(/"/g, '\\"').replace(/\n/g, '\\n');
                const jsonSafeSteps = sourceSteps.replace(/"/g, '\\"').replace(/\n/g, '\\n');

                const prompt = `Translate ONLY the text values in the following JSON to ${targetLangName}. Maintain the exact JSON structure of the output. Do not add any extra text, explanations, or markdown formatting.
{
  "title": "${sourceTitle}",
  "content": "${jsonSafeContent}",
  "steps": "${jsonSafeSteps}"
}`;

                const response = await ai.models.generateContent({
                  model: 'gemini-flash-latest',
                  contents: prompt,
                });

                let fullText = response.text.trim();
                if (fullText.startsWith('```json')) {
                    fullText = fullText.substring(7, fullText.length - 3).trim();
                } else if (fullText.startsWith('```')) {
                     fullText = fullText.substring(3, fullText.length - 3).trim();
                }
                
                const translated = JSON.parse(fullText);

                const finalTitle = translated.title || sourceTitle;
                const finalContent = translated.content || sourceContent;
                const finalSteps = translated.steps || sourceSteps;
                
                translationCache[cacheKey] = { title: finalTitle, content: finalContent, steps: finalSteps };
                setDisplayTitle(finalTitle);
                setDisplayContent(finalContent);
                setDisplaySteps(finalSteps);

            } catch (err) {
                console.error("Translation error:", err);
                setTranslationError(t('translationError'));
            } finally {
                setIsTranslating(false);
            }
        };

        translate();

    }, [activity, i18n.language, t]);


    if (!activity) {
        return <div className="p-4 text-center text-gray-400">Activity not found</div>;
    }

    const { amount } = activity;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!imageFile || !completionNotes.trim()) {
            showInfoModal(t('errorTitle'), t('submissionError'), 'error');
            return;
        }
        
        const imageBase64 = await fileToBase64(imageFile);
        
        db.addActivitySubmission({
            userId: user.id,
            userEmail: user.email,
            activityId: activity.id,
            activityTitle: activity.title,
            sampleImage: imageBase64,
            completionNotes: completionNotes
        });

        showInfoModal(t('submissionSuccessTitle'), t('submissionSuccessMessage'), 'success');

        // Reset form or navigate away
        setImageFile(null);
        setImagePreview(null);
        setCompletionNotes('');
    };
    
    const direction = i18n.dir();

    return (
        <div className="px-4 pb-4 space-y-4" dir={direction}>
            <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4">
                {/* عنوان */}
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-sm text-gray-300">{t('ad_titleLabel')}</span>
                    <span className="font-semibold text-white text-right text-sm flex items-center gap-2">
                        {displayTitle}
                        {isTranslating && <span className="animate-spin"><GlobeIcon className="w-4 h-4 text-gray-400"/></span>}
                    </span>
                </div>
                {/* فوائد المهمة */}
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-sm text-gray-300">{t('ad_benefitsLabel')}</span>
                    <span className="font-bold text-green-400">{amount.toFixed(2)} USDT</span>
                </div>
                 {/* تاريخ المراجعة */}
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-sm text-gray-300">{t('ad_reviewDateLabel')}</span>
                    <span className="text-sm text-white">{t('ad_reviewDateLabel')}</span>
                </div>
                 {/* إرسال العينة */}
                <div className="py-3 border-b border-white/10">
                    <div className="text-right mb-3">
                        <span className="text-sm text-gray-300">{t('ad_sampleSubmissionLabel')}</span>
                    </div>
                    <label htmlFor="sample-upload" className="cursor-pointer border-2 border-dashed border-gray-600 rounded-lg p-1 flex flex-col items-center justify-center h-32 w-32 ml-auto mr-auto hover:bg-black/20 transition-colors">
                         {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                        ) : (
                            <>
                                <UploadIcon className="w-8 h-8 text-gray-500" />
                                <span className="text-gray-500 text-sm mt-2">{t('ad_upload_placeholder')}</span>
                            </>
                        )}
                        <input id="sample-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>
                {/* تعليمات الانتهاء */}
                <div className="py-2">
                     <div className="text-right mb-2">
                        <span className="text-sm text-gray-300">{t('ad_completionInstructionsLabel')}</span>
                    </div>
                    <textarea
                        value={completionNotes}
                        onChange={(e) => setCompletionNotes(e.target.value)}
                        rows={4}
                        placeholder={t('completionInstructionsPlaceholder')}
                        className="w-full bg-gray-700/50 p-2 rounded-md text-white text-sm"
                    />
                </div>
            </div>

            {translationError && <p className="text-center text-red-400 text-sm">{translationError}</p>}
            
            <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4 mt-4 text-right">
                <h3 className="font-semibold mb-2">{t('ad_taskContentLabel')}</h3>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{displayContent}</p>
            </div>

            <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4 mt-4 text-right">
                <h3 className="font-semibold mb-2">{t('ad_taskStepsLabel')}</h3>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{displaySteps}</p>
            </div>
            
            <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4 mt-4">
                <h3 className="font-semibold mb-2 text-right">{t('ad_socialLinkSharingLabel')}</h3>
                <div className="flex items-center gap-2 bg-black/30 p-2 rounded-md" dir="ltr">
                    <p className="text-sm text-gray-300 truncate flex-grow text-left">{referralLink}</p>
                    <button onClick={() => copyToClipboard(referralLink)} className="bg-purple-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold flex-shrink-0 hover:bg-purple-800 transition-colors">
                        {copied ? t('copiedToClipboard') : t('ad_copyButton')}
                    </button>
                </div>
            </div>

             <div className="mt-4">
                <button onClick={handleSubmit} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-purple-900 disabled:opacity-50 transition-all">
                    {t('submitButton')}
                </button>
            </div>
        </div>
    );
};