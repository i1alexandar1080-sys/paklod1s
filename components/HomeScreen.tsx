import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
// FIX: Added missing icons to resolve import errors.
import { 
    InfoIcon,
    DownloadIcon,
    CompanyProfileIcon,
    LockIcon,
    ChevronRightIcon,
    MoonIcon,
    NadecIcon,
    CalendarIcon,
    RechargeIcon,
    EnvelopeIcon,
    ThumbsUpIcon,
    SpeakerIcon,
    AgencyCooperationIcon,
    GiftIcon,
    BellIcon,
    CoffeeCupIcon,
    ChatBubbleIcon,
    WithdrawIcon,
    GlobeIcon,
    CoinIcon,
    HeadsetIcon,
    InviteFriendsIcon
} from './icons';
import { db, type User, type PlatformSettingsData } from '../lib/mockDatabase';
import { LoginRewardsModal } from './LoginRewardsModal';
import { VipLevel } from './VIPScreen';


interface HomeScreenProps {
    navigateTo: (view: string) => void;
    setIsLanguageSelectorOpen: (isOpen: boolean) => void;
    selectedLanguageCode: string;
    getLanguageName: (code: string) => string;
    user: User;
    platformSettings: PlatformSettingsData;
    onAppInstall: () => void;
    onUserUpdate: () => void;
    showInfoModal: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
    showToast: (message: string) => void;
}

const languages: { [key: string]: string } = {
    'ar': 'عربي',
    'en': 'English',
    'fr': 'Français',
    'it': 'Italiano',
    'ja': '日本語',
    'ko': '한국인',
    'de': 'Deutsch',
    'ru': 'Русский',
    'vi': 'Tiếng Việt',
    'pt': 'Português',
    'tr': 'Türkçe',
    'es': 'Español',
    'fa': 'فارسی',
    'id': 'Indonesia',
    'el': 'Ελληνικά',
    'ms': 'Melayu',
    'th': 'ไทย',
    'la': 'Latinus',
    'hi': 'हिंदी',
    'bn': 'বাংলা',
    'ur': 'اردو',
    'zh-Hant': '繁體中文'
};

const maskIdentifier = (identifier: string) => {
    if (identifier.includes('@')) {
        const [name, domain] = identifier.split('@');
        if (name.length > 4) {
            return `${name.substring(0, 2)}****@${domain}`;
        }
        return `${name.substring(0, 1)}****@${domain}`;
    }
    return identifier;
};


export const HomeScreen: React.FC<HomeScreenProps> = ({
    navigateTo,
    setIsLanguageSelectorOpen,
    selectedLanguageCode,
    getLanguageName,
    user,
    platformSettings,
    onAppInstall,
    onUserUpdate,
    showInfoModal,
    showToast
}) => {
    const { t, i18n } = useTranslation();
    const vipLevels = db.getVipLevels(user.id);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselImages = platformSettings.homeCarouselImages || [];
    
    const fullMemberList = useMemo(() => {
        const vipLevelNames = db.getVipLevels().map(level => level.name);
        if (vipLevelNames.length === 0) return [];

        const nameStarts = ['ahm***', 'moh***', 'abd***', 'fat***', 'sai***', 'om***', 'kha***', 'ali***', 'yas***', 'mar***', 'sul***', 'ibr***'];
        const nameEnds = ['***ed', '***li', '***an', '***ma', '***ud', '***er', '***in', '***ah', '***an', '***ez'];

        const generateIdentifier = () => {
            const start = nameStarts[Math.floor(Math.random() * nameStarts.length)];
            const end = nameEnds[Math.floor(Math.random() * nameEnds.length)];
            return `${start}${end}@gmail.com`;
        };

        const list = [];
        for (let i = 0; i < 100; i++) { // Generate a pool of 100 fake members
            list.push({
                id: i,
                email: generateIdentifier(),
                vipLevel: vipLevelNames[Math.floor(Math.random() * vipLevelNames.length)],
                earnings: Math.random() * (1500 - 20) + 20,
            });
        }
        return list;
    }, []);

    const [scrollingMembers, setScrollingMembers] = useState<any[]>([]);
    
    const ITEM_HEIGHT = 56; // Item height (48px) + margin-bottom (8px)
    const [scrollIndex, setScrollIndex] = useState(0);
    const listContainerRef = useRef<HTMLDivElement>(null);
    const pauseAnimation = useRef(false);

    useEffect(() => {
        if (fullMemberList.length > 0) {
            // Take a larger, shuffled subset for the scrolling animation to make it look random
            const shuffled = [...fullMemberList].sort(() => 0.5 - Math.random());
            setScrollingMembers(shuffled.slice(0, 15).map(member => ({
                ...member,
                // Give each a slightly different random earning amount to look dynamic
                earnings: Math.random() * (1500 - 20) + 20,
            })));
        }
    }, [fullMemberList]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!pauseAnimation.current) {
                setScrollIndex(prevIndex => prevIndex + 1);
            }
        }, 3000); // Animate every 3 seconds
        return () => clearInterval(interval);
    }, []);

    const handleTransitionEnd = () => {
        // When we've scrolled past the first list, reset to the top without animation
        if (scrollIndex >= scrollingMembers.length) {
            if (listContainerRef.current) {
                listContainerRef.current.style.transition = 'none';
                setScrollIndex(0);
                // Force browser to apply the 'none' transition style before re-enabling it
                // This prevents a flicker.
                setTimeout(() => {
                    if (listContainerRef.current) {
                        listContainerRef.current.style.transition = 'transform 0.8s ease-in-out';
                    }
                }, 50);
            }
        }
    };


    useEffect(() => {
        if (carouselImages.length > 1) {
            const timer = setInterval(() => {
                setCurrentSlide(prev => (prev + 1) % carouselImages.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [carouselImages.length]);

    useEffect(() => {
        const calculateTime = () => {
            if (user.taskNextAvailableAt && user.taskNextAvailableAt > Date.now()) {
                const remainingSeconds = Math.floor((user.taskNextAvailableAt - Date.now()) / 1000);
                setTimeLeft(remainingSeconds);
            } else {
                setTimeLeft(0);
            }
        };

        calculateTime(); // Initial calculation
        const timer = setInterval(calculateTime, 1000);

        return () => clearInterval(timer);
    }, [user.taskNextAvailableAt]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };
    
    const handleLevelClick = (level: VipLevel) => {
        if (level.status === 'active' || level.status === 'owned') {
            navigateTo('task');
        } else {
            showToast(t('pleaseUpgradeLevel'));
        }
    };

    const quickActionsTop = [
        { key: 'recharge', label: t('rechargeBalance'), icon: <RechargeIcon className="w-8 h-8 text-white" />, action: () => navigateTo('recharge_select') },
        { key: 'withdraw', label: t('withdraw'), icon: <WithdrawIcon className="w-8 h-8 text-white" />, action: () => navigateTo('withdraw') },
        { key: 'appDownload', label: t('appDownload'), icon: <DownloadIcon className="w-8 h-8 text-white" />, action: onAppInstall },
        { key: 'companyProfile', label: t('companyProfile'), icon: <CompanyProfileIcon className="w-8 h-8 text-white" />, action: () => navigateTo('company_profile') },
    ];
     const quickActionsBottom = [
        { key: 'inviteFriends', label: t('inviteFriends'), icon: <InviteFriendsIcon className="w-8 h-8 text-white" />, action: () => navigateTo('team') },
        { key: 'agencyCooperation', label: t('agencyCooperation'), icon: <AgencyCooperationIcon className="w-8 h-8 text-white" />, action: () => {} },
    ];


    const activities = db.getActivities();
    
    const isRtl = i18n.dir() === 'rtl';
    const transformPercentage = (currentSlide * 100) / (carouselImages.length || 1);
    const transformSign = isRtl ? '' : '-';
    const transformValue = `${transformSign}${transformPercentage}%`;

    return (
        <div className="space-y-4 pb-24">
            <div className="px-4">
                {/* User Info */}
                <div
                    className="rounded-lg p-4 relative overflow-hidden flex justify-between items-center"
                    style={{
                        backgroundColor: platformSettings.cardColor,
                        backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')`
                    }}
                >
                    <div className="relative">
                        <p className="font-semibold">{user.email}</p>
                        <div className="flex items-center gap-1 bg-black/40 text-white px-2 py-0.5 rounded-full text-xs w-fit mt-1">
                            <DownloadIcon className="w-3 h-3" />
                            <span>{user.vipLevel}</span>
                        </div>
                    </div>
                    <div className="relative text-right flex items-center gap-2">
                        <CoinIcon className="w-6 h-6 text-white"/>
                        <p className="text-2xl font-bold">{(user.mainBalance + user.withdrawalBalance).toFixed(4)}</p>
                    </div>
                </div>

                {/* Notice Marquee */}
                <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-full p-2 flex items-center gap-2 text-sm overflow-hidden whitespace-nowrap mt-4">
                    <SpeakerIcon className="w-5 h-5 flex-shrink-0 text-yellow-400" />
                    <div className="w-full inline-block animate-marquee">
                        <span className="text-gray-300">{platformSettings.homeMarqueeText}</span>
                    </div>
                </div>
                <style>{`
                    .animate-marquee {
                        display: inline-block;
                        padding-left: 100%;
                        animation: marquee 30s linear infinite;
                    }
                    @keyframes marquee {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(-100%); }
                    }
                `}</style>


                {/* Image Carousel */}
                {carouselImages.length > 0 && (
                    <div className="rounded-lg overflow-hidden aspect-[16/7] w-full relative shadow-lg mt-4">
                        <div
                            className="flex transition-transform duration-700 ease-in-out h-full"
                            style={{
                                width: `${carouselImages.length * 100}%`,
                                transform: `translateX(${transformValue})`,
                            }}
                        >
                            {carouselImages.map((src, index) => (
                                <div
                                    key={index}
                                    className="h-full"
                                    style={{ width: `${100 / carouselImages.length}%` }}
                                >
                                    <img
                                        src={src}
                                        alt={`Promotional Banner ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Quick Actions */}
                <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-4 gap-4">
                        {quickActionsTop.map(item => {
                            const colors = platformSettings.homeIconColors?.[item.key] || { from: '#fb923c', to: '#ef4444' };
                            const imageUrl = platformSettings.homeIconImages?.[item.key];
                            return (
                                <button key={item.label} onClick={item.action} className="flex flex-col items-center gap-2">
                                    <div 
                                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                                        style={{ backgroundImage: !imageUrl ? `linear-gradient(to bottom right, ${colors.from}, ${colors.to})` : 'none', backgroundColor: !imageUrl ? 'transparent' : platformSettings.cardColor }}
                                    >
                                        {imageUrl ? (
                                            <img src={imageUrl} alt={item.label} className="w-full h-full object-cover" />
                                        ) : (
                                            item.icon
                                        )}
                                    </div>
                                    <span className="text-xs text-center">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 max-w-[15rem] mx-auto">
                         {quickActionsBottom.map(item => {
                            const colors = platformSettings.homeIconColors?.[item.key] || { from: '#fb923c', to: '#ef4444' };
                            const imageUrl = platformSettings.homeIconImages?.[item.key];
                             return (
                                <button key={item.label} onClick={item.action} className="flex flex-col items-center gap-2">
                                     <div 
                                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                                        style={{ backgroundImage: !imageUrl ? `linear-gradient(to bottom right, ${colors.from}, ${colors.to})` : 'none', backgroundColor: !imageUrl ? 'transparent' : platformSettings.cardColor }}
                                    >
                                        {imageUrl ? (
                                            <img src={imageUrl} alt={item.label} className="w-full h-full object-cover" />
                                        ) : (
                                            item.icon
                                        )}
                                    </div>
                                    <span className="text-xs text-center">{item.label}</span>
                                </button>
                             );
                        })}
                    </div>
                </div>

                {/* Activities */}
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold text-lg">{t('activities')}</h2>
                    </div>
                    <div className="space-y-2">
                        {activities.map((act) => (
                            <div key={act.id} style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-3 flex items-center gap-3">
                                {act.icon.startsWith('http') ? (
                                    <img src={act.icon} alt="activity icon" className="w-12 h-12 flex-shrink-0 object-contain"/>
                                ) : (
                                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                                        <GiftIcon className="w-8 h-8 text-yellow-400"/>
                                    </div>
                                )}
                                <div className="flex-grow text-sm min-w-0">
                                    <p className="font-bold text-yellow-400 mb-1">+{act.amount.toFixed(2)} USDT</p>
                                    <p className="leading-snug text-gray-300 text-xs">{act.title}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <button onClick={() => navigateTo(`activity_details_${act.id}`)} className="bg-purple-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full mt-2 hover:bg-purple-700 transition-colors">
                                        {t('viewTasks')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Task Reset Timer */}
                <div className="text-center my-4">
                    <p className="font-mono text-lg tracking-wider">{formatTime(timeLeft)}</p>
                    <p className="text-xs text-gray-400">{t('taskReset')}</p>
                </div>


                {/* Task List */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold text-lg">{t('taskList')}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {vipLevels.map(level => (
                            <button 
                                key={level.id} 
                                onClick={() => handleLevelClick(level)}
                                style={{ backgroundColor: platformSettings.cardColor }}
                                className="rounded-lg p-2.5 shadow-lg w-full text-left transition-transform duration-200 hover:scale-105 active:scale-95"
                            >
                                <div className="relative">
                                    <img src={level.imageSrc} alt={level.name} className="w-full h-24 object-cover rounded-md" />
                                    {level.status === 'locked' && (
                                         <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md">
                                            <LockIcon className="w-8 h-8 text-white/70" />
                                        </div>
                                    )}
                                    <div className="absolute top-1 left-1 bg-blue-600/70 backdrop-blur-sm rounded-full p-1.5">
                                        {level.name.toLowerCase().includes('nadec') ? <NadecIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div>
                                        <p className="text-sm font-semibold">${level.unlockCost?.toFixed(2)}</p>
                                        <p className="text-xs text-gray-400">{level.name}</p>
                                    </div>
                                    <div className="text-gray-500">
                                        <ChevronRightIcon className="w-5 h-5"/>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                
                 {/* Members List */}
                <div className="mt-6 mb-4">
                    <h2 className="font-bold text-lg mb-2">{t('membersList')}</h2>
                     <div 
                        className="h-[168px] overflow-hidden relative rounded-lg"
                        onMouseEnter={() => { pauseAnimation.current = true; }}
                        onMouseLeave={() => { pauseAnimation.current = false; }}
                    >
                        {scrollingMembers.length > 0 && (
                            <div
                                ref={listContainerRef}
                                className="absolute top-0 w-full"
                                style={{
                                    transform: `translateY(-${scrollIndex * ITEM_HEIGHT}px)`,
                                    transition: 'transform 0.8s ease-in-out',
                                }}
                                onTransitionEnd={handleTransitionEnd}
                            >
                                {[...scrollingMembers, ...scrollingMembers].map((member, index) => (
                                    <div key={`${member.id}-${index}`} className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 p-2 rounded-lg flex justify-between items-center text-sm mb-2 h-12">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="truncate">{member.email}</span>
                                            <span className="bg-yellow-400/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full flex-shrink-0">{member.vipLevel}</span>
                                        </div>
                                        <span className="font-semibold text-white whitespace-nowrap">+${member.earnings.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};