import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db, User, Message, PlatformSettingsData } from '../lib/mockDatabase';
import { EnvelopeIcon, BellIcon } from './icons';

interface NotificationsScreenProps {
    user: User;
    navigateTo: (view: string) => void;
    onUserUpdate: () => void;
    platformSettings: PlatformSettingsData;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ user, navigateTo, onUserUpdate, platformSettings }) => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([]);
    
    useEffect(() => {
        const userMessages = db.getMessagesForUser(user.id);
        setMessages(userMessages);
    }, [user.id, user.readMessageIds]);

    const handleMessageClick = (message: Message) => {
        if (!user.readMessageIds.includes(message.id)) {
            db.markMessageAsRead(user.id, message.id);
            onUserUpdate(); // Force a re-render in the parent to update the unread count
        }
        navigateTo(`notification_details_${message.id}`);
    };

    return (
        <div className="px-4">
            {messages.length > 0 ? (
                <div className="space-y-3">
                    {messages.map(msg => {
                        const isUnread = !user.readMessageIds.includes(msg.id);
                        return (
                            <button
                                key={msg.id}
                                onClick={() => handleMessageClick(msg)}
                                style={{ backgroundColor: platformSettings.cardColor }}
                                className={`w-full text-left p-4 rounded-lg shadow-md transition-all hover:brightness-125 ${isUnread ? 'border-l-4 border-blue-400' : ''}`}
                            >
                                <div className="flex items-start gap-4">
                                    <EnvelopeIcon className={`w-6 h-6 flex-shrink-0 mt-1 ${isUnread ? 'text-blue-300' : 'text-gray-500'}`} />
                                    <div className="flex-grow">
                                        <p className={`font-semibold ${isUnread ? 'text-white' : 'text-gray-300'}`}>{t(msg.title, msg.params)}</p>
                                        <p className="text-xs text-gray-400 mt-2">{new Date(msg.timestamp).toLocaleString()}</p>
                                    </div>
                                    <div className="text-xs text-gray-500">{t('noFiles')}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center text-gray-500 h-64">
                    <BellIcon className="w-16 h-16 opacity-30 mb-4" />
                    <p>{t('noNotifications')}</p>
                </div>
            )}
        </div>
    );
};
