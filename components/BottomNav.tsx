import React from 'react';
import { useTranslation } from 'react-i18next';
import { HomeIcon, TaskIcon, TeamIcon, VIPIcon, MeIcon } from './icons';
import { PlatformSettingsData } from '../lib/mockDatabase';

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tabName: string) => void;
    platformSettings: PlatformSettingsData;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, platformSettings }) => {
    const { t } = useTranslation();

    const navItems = [
        { name: 'home', label: t('navHome'), icon: <HomeIcon className="w-6 h-6" /> },
        { name: 'task', label: t('navTask'), icon: <TaskIcon className="w-6 h-6" /> },
        { name: 'team', label: t('navTeam'), icon: <TeamIcon className="w-6 h-6" /> },
        { name: 'vip', label: t('navVIP'), icon: <VIPIcon className="w-6 h-6" /> },
        { name: 'me', label: t('navMe'), icon: <MeIcon className="w-6 h-6" /> },
    ];

    return (
        <div style={{ backgroundColor: platformSettings.cardColor }} className="absolute bottom-0 left-0 w-full z-30">
            <div className="flex justify-around items-center text-xs text-gray-400">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => onTabChange(item.name)}
                        className={`flex flex-col items-center justify-center pt-2 pb-1 w-1/5 transition-colors ${
                            activeTab === item.name ? 'text-white' : 'hover:text-white'
                        }`}
                        aria-current={activeTab === item.name ? 'page' : undefined}
                    >
                        {item.icon}
                        <span className="mt-1">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
