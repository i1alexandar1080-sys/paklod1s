

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI } from '@google/genai';
import { db, PlatformSettingsData } from '../lib/mockDatabase';
import { languages } from '../lib/languages';
import { GlobeIcon } from './icons';

interface NotificationDetailsScreenProps {
    messageId: number;
    platformSettings: PlatformSettingsData;
}

// Simple in-memory cache for translations
const translationCache: { [key: string]: { title: string; content: string } } = {};

export const NotificationDetailsScreen: React.FC<NotificationDetailsScreenProps> = ({ messageId, platformSettings }) => {
    const { t, i18n } = useTranslation();
    const message = db.messages.find(m => m.id === messageId);

    const getInitialTitle = () => {
        if (!message) return '';
        return i18n.exists(message.title) ? t(message.title) : message.title;
    };

    const [displayTitle, setDisplayTitle] = useState(getInitialTitle());
    const [displayContent, setDisplayContent] = useState(message ? message.content : '');
    const [isTranslating, setIsTranslating] = useState(false);
    const [error, setError] = useState('');

    const sourceLanguageCode = 'ar'; // Assuming admin posts in Arabic

    useEffect(() => {
        if (!message) return;

        const targetLangCode = i18n.language;
        const targetLangName = languages.find(l => l.code === targetLangCode)?.name || targetLangCode;
        const cacheKey = `${message.id}-${targetLangCode}`;
        
        // Get the source text for translation. If the title is a key, get its 'ar' value.
        const sourceTitle = i18n.getResource(sourceLanguageCode, 'translation', message.title) || message.title;
        const sourceContent = message.content;


        const translateContent = async () => {
            const currentDisplayTitle = i18n.exists(message.title) ? t(message.title) : message.title;
            
            if (targetLangCode.startsWith(sourceLanguageCode)) {
                setDisplayTitle(currentDisplayTitle);
                setDisplayContent(message.content);
                setIsTranslating(false);
                setError('');
                return;
            }

            if (translationCache[cacheKey]) {
                setDisplayTitle(translationCache[cacheKey].title);
                setDisplayContent(translationCache[cacheKey].content);
                setIsTranslating(false);
                setError('');
                return;
            }

            // Optimistic UI: display original (translated via i18next if it's a key) first
            setDisplayTitle(currentDisplayTitle);
            setDisplayContent(message.content);
            setIsTranslating(true);
            setError('');

            try {
                if (!process.env.API_KEY) {
                    throw new Error("API key is not configured.");
                }
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

                const jsonSafeContent = sourceContent.replace(/"/g, '\\"').replace(/\n/g, '\\n');
                const prompt = `Translate ONLY the text values in the following JSON to ${targetLangName}. Maintain the exact JSON structure of the output. Do not add any extra text, explanations, or markdown formatting.
{
  "title": "${sourceTitle}",
  "content": "${jsonSafeContent}"
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
                const finalTitle = translated.title || currentDisplayTitle;
                const finalContent = translated.content || message.content;

                translationCache[cacheKey] = { title: finalTitle, content: finalContent };
                setDisplayTitle(finalTitle);
                setDisplayContent(finalContent);

            } catch (err) {
                console.error("Translation error:", err);
                setError("Failed to translate the message. Displaying original.");
                // Revert to original if translation fails
                setDisplayTitle(currentDisplayTitle);
                setDisplayContent(message.content);
            } finally {
                setIsTranslating(false);
            }
        };

        translateContent();

    }, [message, i18n.language, t]);

    if (!message) {
        return <div className="text-center text-gray-400 p-8">{t('noNotifications')}</div>;
    }

    const direction = i18n.dir();

    return (
        <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-6 relative min-h-[60vh]">
            <h3 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2" dir={direction}>
                <span>{displayTitle}</span>
                {isTranslating && (
                    <span className="animate-spin">
                        <GlobeIcon className="w-4 h-4 text-gray-400" />
                    </span>
                )}
            </h3>
            <p className="text-center text-xs text-gray-400 my-4 border-b border-t border-white/10 py-2">
                {new Date(message.timestamp).toLocaleString()}
            </p>
            {error && <p className="text-center text-red-400 text-sm mb-4">{error}</p>}
            <div 
                className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm relative"
                dir={direction}
            >
                {displayContent}
                {isTranslating && (
                    <div style={{ backgroundImage: `linear-gradient(to top, ${platformSettings.cardColor}, ${platformSettings.cardColor}80, transparent)` }} className="absolute inset-0 rounded-md animate-pulse"></div>
                )}
            </div>
        </div>
    );
};
