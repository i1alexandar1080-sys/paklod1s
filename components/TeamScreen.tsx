import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    CalendarIcon, 
    XIcon, 
    FacebookIcon, 
    TelegramIcon, 
    LinkedInIcon, 
    InstagramIcon, 
    GlobeIcon,
    WhatsAppIcon,
    TikTokIcon,
    MedalIcon,
    HeadsetIcon,
    EnvelopeIcon,
    VideoCameraIcon,
    CloseIcon,
} from './icons';
import { db, User, PlatformSettingsData } from '../lib/mockDatabase';
import { CalendarModal } from './CalendarModal';

interface TeamScreenProps {
    navigateTo: (view: string) => void;
    setIsLanguageSelectorOpen: (isOpen: boolean) => void;
    selectedLanguageCode: string;
    getLanguageName: (code: string) => string;
    user: User;
    platformSettings: PlatformSettingsData;
}

const languages: { [key: string]: string } = {
    'ar': 'عربي',
    'en': 'English'
};

const calculateLevelStats = (levelUsers: User[], commissionRate: number) => {
    const count = levelUsers.length;
    const totalIncome = levelUsers.reduce((sum, user) => {
        const rechargeCommission = user.rechargeAmount * (commissionRate / 100);
        return sum + rechargeCommission;
    }, 0);
    return { count, totalIncome };
};


export const TeamScreen: React.FC<TeamScreenProps> = ({ user, navigateTo, setIsLanguageSelectorOpen, selectedLanguageCode, getLanguageName, platformSettings }) => {
    const { t, i18n } = useTranslation();
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    };

    const mainUser = user;
    const referrals = db.getReferrals(mainUser.invitationCode);

    // Filter referrals by selected date, or use all if no date is selected
    const referralsForStats = selectedDate ? {
        level1: referrals.level1.filter(user => isSameDay(new Date(user.registrationDate), selectedDate)),
        level2: referrals.level2.filter(user => isSameDay(new Date(user.registrationDate), selectedDate)),
        level3: referrals.level3.filter(user => isSameDay(new Date(user.registrationDate), selectedDate)),
    } : referrals;
    
    const allFilteredReferrals = [...referralsForStats.level1, ...referralsForStats.level2, ...referralsForStats.level3];

    // Calculate stats based on filtered users
    const teamSize = allFilteredReferrals.length;
    const teamRecharge = allFilteredReferrals.reduce((sum, user) => sum + user.rechargeAmount, 0);
    const teamWithdrawal = allFilteredReferrals.reduce((sum, user) => sum + user.totalWithdrawals, 0);
    const newTeamMembers = teamSize; // When filtered, this shows new members for that day.
    const firstTimeRecharge = allFilteredReferrals.filter(user => user.rechargeAmount > 0).length;
    const firstWithdrawal = allFilteredReferrals.filter(user => user.totalWithdrawals > 0).length;
    
    const invitationCode = mainUser.invitationCode;
    const customDomain = db.platformSettings.referralDomain;
    const baseUrl = customDomain && customDomain.startsWith('http') 
        ? customDomain.replace(/\/$/, '') 
        : window.location.origin;
    const referralLink = `${baseUrl}/?ref=${invitationCode}`;


     const socialLinks = [
        { Icon: XIcon, name: "X", url: "https://x.com" },
        { Icon: FacebookIcon, name: "Facebook", url: "https://facebook.com" },
        { Icon: TelegramIcon, name: "Telegram", url: "https://telegram.org" },
        { Icon: LinkedInIcon, name: "LinkedIn", url: "https://linkedin.com" },
        { Icon: WhatsAppIcon, name: "WhatsApp", url: "https://whatsapp.com" },
        { Icon: InstagramIcon, name: "Instagram", url: "https://instagram.com" },
        { Icon: TikTokIcon, name: "TikTok", url: "https://tiktok.com" },
        { Icon: VideoCameraIcon, name: "Kwai", url: "https://www.kwai.com" },
    ];

    const stats = [
      { label: t('teamSize'), value: teamSize },
      { label: t('teamRecharge'), value: `$${teamRecharge.toFixed(2)}` },
      { label: t('teamWithdrawal'), value: `$${teamWithdrawal.toFixed(2)}` },
      { label: t('newTeamMembers'), value: newTeamMembers },
      { label: t('firstTimeRecharge'), value: firstTimeRecharge },
      { label: t('firstWithdrawal'), value: firstWithdrawal },
    ];

    const effectiveCommissionRates = user.commissionRatesOverride || db.platformSettings.commissionRates;
    const level1Stats = calculateLevelStats(referralsForStats.level1, effectiveCommissionRates[1]);
    const level2Stats = calculateLevelStats(referralsForStats.level2, effectiveCommissionRates[2]);
    const level3Stats = calculateLevelStats(referralsForStats.level3, effectiveCommissionRates[3]);

    const levels = [
        { level: 1, registered: level1Stats.count, valid: level1Stats.count, commission: effectiveCommissionRates[1], income: level1Stats.totalIncome, color: 'from-cyan-500 to-teal-600' },
        { level: 2, registered: level2Stats.count, valid: level2Stats.count, commission: effectiveCommissionRates[2], income: level2Stats.totalIncome, color: 'from-purple-500 to-indigo-700' },
        { level: 3, registered: level3Stats.count, valid: level3Stats.count, commission: effectiveCommissionRates[3], income: level3Stats.totalIncome, color: 'from-rose-500 to-red-600' },
    ];


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert(t('copiedToClipboard'));
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    return (
        <div className="relative">
            <div className="space-y-4 pb-24 px-4">
                {/* Invitation Code Section */}
                <div className="bg-yellow-100 text-black rounded-lg p-2 space-y-2">
                    <div>
                        <p className="text-sm text-gray-700 text-end">{t('invitationCodeHeader')}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <button onClick={() => copyToClipboard(invitationCode)} className="bg-black text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-md">{t('copy')}</button>
                            <p className="text-lg sm:text-xl font-bold tracking-[0.25em] text-gray-800">{invitationCode}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-700">{t('shareReferralLink')}</p>
                        <div className="flex items-center gap-2">
                             <button onClick={() => copyToClipboard(referralLink)} className="bg-black text-white px-4 py-1 rounded-full text-xs font-semibold flex-shrink-0 shadow">{t('copy')}</button>
                            <p className="text-sm text-gray-800 break-all">{referralLink}</p>
                        </div>
                    </div>
                    <div className="flex justify-around items-center pt-1">
                        {socialLinks.map(({ Icon, name, url }) => (
                            <a
                                key={name}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Share on ${name}`}
                                className="text-black bg-black/5 p-2 rounded-full hover:bg-black/10 transition-colors"
                            >
                                <Icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Selection Period Stats */}
                <div>
                     <div className="flex items-center justify-between gap-2 mb-2">
                        <h2 className="font-semibold">{t('selectionPeriod')}</h2>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsCalendarOpen(true)} className="text-sm bg-black/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                                <span>
                                    {selectedDate
                                        ? selectedDate.toLocaleDateString(i18n.language.split('-')[0], { year: 'numeric', month: '2-digit', day: '2-digit' })
                                        : t('allTime')}
                                </span>
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                            </button>
                            {selectedDate && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedDate(null); }} 
                                    className="bg-black/20 p-1.5 rounded-full text-gray-400 hover:text-white"
                                    aria-label="Clear date filter"
                                >
                                    <CloseIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4 grid grid-cols-3 gap-y-4 text-center">
                        {stats.map(stat => (
                            <div key={stat.label}>
                                <p className="text-lg font-bold">{stat.value}</p>
                                <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Level Cards */}
                <div className="grid grid-cols-3 gap-2">
                    {levels.map(l => (
                        <div key={l.level} className={`bg-gradient-to-b ${l.color} rounded-lg p-2 text-white flex flex-col`}>
                            <div className="flex justify-between items-center mb-2">
                                <MedalIcon className="w-6 h-6 text-gray-300"/>
                                <h3 className="font-bold text-base">{t('level')} {l.level}</h3>
                            </div>
                            <div className="bg-black bg-opacity-20 rounded-md p-2 space-y-1 text-xs flex-grow mb-3 text-center">
                                <div>
                                    <p className="font-mono font-bold text-sm">{l.registered}/{l.valid}</p>
                                    <p className="opacity-80 text-[10px] scale-90 block">{t('registeredAndValid')}</p>
                                </div>
                                <div>
                                    <p className="font-mono font-bold text-sm">{l.commission}%</p>
                                    <p className="opacity-80 text-[10px] scale-90 block">{t('commissionRate')}</p>
                                </div>
                                <div>
                                    <p className="font-mono font-bold text-sm">{l.income.toFixed(4)}</p>
                                    <p className="opacity-80 text-[10px] scale-90 block">{t('totalIncome')}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigateTo(`team_details_${l.level}`)}
                                className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 text-black font-bold py-1.5 rounded-full text-sm shadow-md hover:from-yellow-500 hover:to-amber-600 transition-all">
                                {t('details')}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <CalendarModal 
                isOpen={isCalendarOpen} 
                onClose={() => setIsCalendarOpen(false)} 
                onSelect={handleDateSelect} 
                initialDate={selectedDate} 
            />
        </div>
    );
};
