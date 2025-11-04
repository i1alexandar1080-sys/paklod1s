import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../lib/mockDatabase';

interface NotificationManagementProps {
    showToast: (message: string, type?: 'success' | 'error') => void;
}

export const NotificationManagement: React.FC<NotificationManagementProps> = ({ showToast }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [messages, setMessages] = useState(db.messages.filter(m => m.recipientId === 'all'));

    const handleSend = () => {
        if (!title.trim() || !content.trim()) {
            showToast(t('admin.notifications.fieldsRequired'), 'error');
            return;
        }

        db.addMessage({
            title,
            content,
            recipientId: 'all'
        });

        showToast(t('admin.notifications.sentSuccess'));
        setTitle('');
        setContent('');
        setMessages([...db.messages.filter(m => m.recipientId === 'all')]);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-white mb-4">{t('admin.notifications.createNew')}</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="notif-title" className="block text-sm font-medium text-gray-300 mb-1">{t('admin.notifications.titleLabel')}</label>
                        <input
                            id="notif-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="notif-content" className="block text-sm font-medium text-gray-300 mb-1">{t('admin.notifications.contentLabel')}</label>
                        <textarea
                            id="notif-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={10}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <button
                            onClick={handleSend}
                            className="w-full px-4 py-2.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            {t('admin.notifications.sendToAll')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-white mb-4">{t('admin.notifications.sentMessages')}</h2>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {messages.length > 0 ? messages.map(msg => (
                        <div key={msg.id} className="bg-gray-700/50 p-3 rounded-md">
                            <p className="font-semibold text-white truncate">{msg.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-8">{t('admin.notifications.noSentMessages')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};