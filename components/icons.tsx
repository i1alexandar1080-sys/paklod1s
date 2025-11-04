import React from 'react';

type IconProps = {
  className?: string;
};

export const RefreshIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l3.181-3.183a8.25 8.25 0 00-11.664 0l3.181 3.183z" />
  </svg>
);

export const GlobeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const EyeSlashIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`app-icon ${className || ''}`}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.125 1.125 0 011.591 0L21.75 12" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
  </svg>
);

export const TaskIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l2 2l4 -4" />
  </svg>
);

export const TeamIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={`app-icon ${className || ''}`} opacity="0.7">
        <circle cx="12" cy="7" r="4" />
        <ellipse cx="12" cy="16.5" rx="7" ry="4.5" />
        <g opacity="0.6">
            <circle cx="5.5" cy="8" r="3.5" />
            <ellipse cx="5.5" cy="17" rx="5" ry="4" />
        </g>
        <g opacity="0.6">
            <circle cx="18.5" cy="8" r="3.5" />
            <ellipse cx="18.5" cy="17" rx="5" ry="4" />
        </g>
    </svg>
);


export const VIPIcon: React.FC<IconProps> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`app-icon ${className || ''}`}
        style={{ filter: 'drop-shadow(0 0 2px currentColor) drop-shadow(0 0 5px currentColor)' }}
    >
        {/* Outer diamond shape */}
        <path d="M12 2 L22 10 L12 22 L2 10 Z" />
        {/* Inner facets */}
        <path d="M2 10 L22 10" />
        <path d="M7 10 L12 2 L17 10" />
        {/* Stylized 'V' */}
        <path d="M8.5 12 L12 17 L15.5 12" />
        <path d="M10 12 L12 15 L14 12" />
    </svg>
);

export const MeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`app-icon ${className || ''}`}>
        <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.9 3.926a1 1 0 00.95.69h4.11c.733 0 .937.99-.328 1.437l-3.323 2.414a1 1 0 00-.364 1.118l1.265 4.618c.236.86-.698 1.583-1.48.943l-3.68-2.66a1 1 0 00-1.175 0l-3.68 2.66c-.782.64-1.716-.083-1.48-.943l1.265-4.618a1 1 0 00-.364-1.118L2.48 8.937c-1.265-.447-1.06-1.437.328-1.437h4.11a1 1 0 00.95-.69l1.9-3.926z" clipRule="evenodd" />
    </svg>
);

export const CoinIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`app-icon ${className || ''}`}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.5 6.5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clipRule="evenodd" />
        <path d="M10.5 6.5a.5.5 0 011 0v7a.5.5 0 01-1 0v-7zM10 4a.5.5 0 00-.5.5v1a.5.5 0 001 0v-1A.5.5 0 0010 4zM10 15a.5.5 0 00-.5.5v1a.5.5 0 001 0v-1a.5.5 0 00-.5-.5z" />
    </svg>
);

export const RechargeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 5H9.5a4.5 4.5 0 0 0 0 9h5a4.5 4.5 0 0 1 0 9H6" />
  </svg>
);

export const WithdrawIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`app-icon ${className || ''}`}>
        <g transform="translate(0 -1.5)">
            {/* Banknote */}
            <rect x="7" y="9" width="10" height="5" rx="1" />
            <circle cx="12" cy="11.5" r="1" />
            {/* Hand */}
            <path d="M17.5,14.5 v1 a2.5,2.5 0 0 1 -2.5,2.5 h-6 a2.5,2.5 0 0 1 -2.5,-2.5 v-1" />
            <path d="M6.5,14.5 a1.5,1.5 0 0 0 -1.5,1.5 v2" />
        </g>
    </svg>
);


export const AppIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17.25v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v3.375M1.5 15.75c0-3.375 2.625-6.188 5.906-6.502.2-.016.4-.028.602-.028h.094c.202 0 .402.012.602.028 3.281.314 5.906 3.127 5.906 6.502v1.5a.75.75 0 01-.75.75H2.25a.75.75 0 01-.75-.75v-1.5zm15-1.5c0-3.375 2.625-6.188 5.906-6.502.2-.016.4-.028.602-.028h.094c.202 0 .402.012.602.028 3.281.314 5.906 3.127 5.906 6.502v1.5a.75.75 0 01-.75.75h-10.5a.75.75 0 01-.75-.75v-1.5z" />
    </svg>
);

export const CompanyProfileIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
      {/* Front building */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 21V9.75h8.25V21H6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12h.01M12 12h.01M8.25 15h.01M12 15h.01M8.25 18h.01M12 18h.01" />
      
      {/* Back building (visible parts) */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75V7.5h5.25v13.5h-5.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5h.01M16.5 13.5h.01M16.5 16.5h.01" />
    </svg>
);

export const InviteFriendsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={`app-icon ${className || ''}`}>
      <path d="M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13L3.74 7.84 12 3l8.26 4.84L12 13z"/>
    </svg>
);

export const AgencyCooperationIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25a2.25 2.25 0 01-2.25-2.25v-7.5a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25-2.25v7.5a2.25 2.25 0 01-2.25-2.25M13.5 21v-7.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21m-4.5 0H18" />
    </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

export const LockIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`app-icon ${className || ''}`}>
    <path d="M18,8H17V6a5,5,0,0,0-10,0V8H6a2,2,0,0,0-2,2V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V10A2,2,0,0,0,18,8ZM9,8V6a3,3,0,0,1,6,0V8Zm8,10H7v-2h10Zm0-3H7V13h10Z"/>
  </svg>
);

export const NadecIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.14 0H9.38L10.76 2.06L7 6.4L2.8 2.06L4.18 0H1.42L0 2.5V9.02C0 9.58 0.44 10 1 10H13C13.56 10 14 9.58 14 9.02V2.5L12.14 0Z" fill="white"/></svg>
);

export const NadecLogoIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="white" fillOpacity="0.8"/>
      <path d="M14 2V8H20" stroke="white" strokeOpacity="0.5" strokeWidth="0.8"/>
    </svg>
  );

export const MoonIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`app-icon ${className || ''}`}>
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`app-icon ${className || ''}`}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

export const ChevronDoubleRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
  </svg>
);

export const AccountIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`app-icon ${className || ''}`}>
      <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"/>
    </svg>
);

export const FinancialRecordsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`app-icon ${className || ''}`}>
        <path d="M20 6h-4V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v2H2v13h18V6zm-8-2h4v2h-4V4zM4 17V8h16v9H4z"/>
        <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4 4h8v2H8v-2z"/>
    </svg>
);

export const SignOutIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);

export const HeadsetIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`app-icon ${className || ''}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a7.5 7.5 0 00-7.5-1.5A7.5 7.5 0 005.25 15v3a3 3 0 003 3h1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75v3.75a3 3 0 01-3 3h-1.5m0-3a3 3 0 00-3 3v3.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15a3 3 0 013 3v.75" />
    </svg>
);

export const EnvelopeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`app-icon ${className || ''}`}>
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

export const UsdtIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm-5.45-18.358h-3.328v-3.328h12.156v3.328h-3.328v10.716h-5.5v-10.716z" fill="#26A17B" fillRule="nonzero"/></svg>
);

export const UsdcIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><circle fill="#2775CA" cx="16" cy="16" r="16"/><path d="M16.48 20.371a1.91 1.91 0 0 1-1.492.656c-1.28 0-2.228-.971-2.228-2.618v-4.818c0-1.646.948-2.617 2.228-2.617a1.91 1.91 0 0 1 1.492.656c.404.423.632.996.632 1.631v.373h-3.076v4.89h3.076v.373c0 .635-.228 1.208-.632 1.631zm-1.492-7.668c-.616 0-1.044.47-1.044 1.393v4.818c0 .922.428 1.393 1.044 1.393.616 0 1.044-.47 1.044-1.393v-4.818c0-.922-.428-1.393-1.044-1.393zm6.38-2.345c.44.404.68.96.68 1.583v5.894c0 .624-.24 1.18-.68 1.583a1.86 1.86 0 0 1-1.464.632 2.01 2.01 0 0 1-1.52-.664c-.424-.431-.657-1.01-.657-1.63v-5.83c0-.62.233-1.199.656-1.63a2.01 2.01 0 0 1 1.52-.665c.576 0 1.08.223 1.464.632zM20.312 16c0 .823-.392 1.264-1.016 1.264s-1.016-.44-1.016-1.264c0-.823.392-1.264 1.016-1.264s1.016.44 1.016 1.264z" fill="#FFF"/></g></svg>
);

export const BnbIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M0 16L8 8l8 8-8 8zm16-8l8 8-8 8V8z" fill="#F3BA2F"/><path d="M8 24l8 8 8-8-8-8zm8-16L8 0l-8 8 8 8z" fill="#F3BA2F"/><path d="M16 11.315L13.657 9.01l-2.343 2.295 4.686 4.65 4.685-4.65-2.342-2.295z" fill="#F3BA2F"/></svg>
);

export const TrxIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 0l13.856 8v16L16 32 2.144 24V8zm9.513 10.932l-9.453 5.433-2.617 1.5-6.79-3.92V8.97l9.407-5.432 9.453 5.45v5.944zm-19.026 4.1l6.79 3.92 6.848-3.953v7.05L10.5 27.532v-6.556l-.026.015z" fill="#EB0029"/></svg>
);

export const EthIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><circle fill="#627EEA" cx="16" cy="16" r="16"/><g fill="#FFF" fillRule="nonzero"><path opacity=".602" d="M16.498 4v8.87l7.497 3.35z"/><path d="M16.498 4L9 16.22l7.498-3.35z"/><path opacity=".602" d="M16.498 21.968v6.027L24 17.616z"/><path d="M16.498 27.995v-6.027L9 17.616z"/><path opacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/><path opacity=".602" d="M9 16.22l7.498 4.353v-7.701z"/></g></g></svg>
);

export const PolygonIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M22.583 6.008L16.44 2.132a1.94 1.94 0 00-1.632 0L8.665 6.008a1.92 1.92 0 00-.976 1.684v10.598c0 .7.384 1.348.976 1.684l6.142 3.876c.5.316 1.132.316 1.632 0l6.142-3.876c.592-.336.976-.984.976-1.684V7.692a1.92 1.92 0 00-.976-1.684zm-2.08 11.232l-3.896 2.39-3.88-2.39V12.9l3.88-2.39 3.896 2.39v4.34z" fill="#8247E5"/></svg>
);

export const PyusdIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><circle fill="#002868" cx="16" cy="16" r="16"/><path fill="#FFF" d="M11.83 23.619V8h3.04v12.75h4.42v2.869h-7.46z"/></g></svg>
);

export const DollarSignIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.75 11 12 11c-.75 0-1.536.21-2.218.659-1.172.879-1.172 2.303 0 3.182s3.07.879 4.242 0l.879-.659" />
  </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" />
  </svg>
);

export const MedalIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3v-3m-3 0a3 3 0 00-3-3h-3a3 3 0 00-3 3m9 0V9.375m-9 9.375V9.375m0-3.375A3.375 3.375 0 017.5 2.25h9a3.375 3.375 0 013.375 3.375v3.375" />
  </svg>
);

export const CreditCardIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" />
  </svg>
);

export const PowerIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
  </svg>
);

export const XIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const FacebookIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

export const TelegramIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 2L2 9.5l7.5 2.5L12 22l2.5-7.5L22 2zm-3.5 3.5L10 14l-1.5-1.5L18.5 5.5z"/>
  </svg>
);

export const LinkedInIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/>
  </svg>
);

export const WhatsAppIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.77 3.05 1.18 4.79 1.18h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.5 14.3c-.28-.14-1.65-.81-1.9-.91-.25-.09-.43-.14-.61.14-.18.28-.72.91-.88 1.1-.16.18-.32.21-.59.06-.27-.14-1.14-.42-2.17-1.33-.81-.72-1.35-1.61-1.51-1.89-.16-.28-.01-.43.13-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.61-1.47-.84-2.01-.23-.54-.46-.47-.61-.47h-.53c-.18 0-.46.07-.7.35-.23.28-.88.86-.88 2.1s.9 2.44 1.03 2.62c.13.18 1.77 2.7 4.29 3.78 2.52 1.08 2.52.72 2.97.69.45-.03 1.65-.67 1.88-1.32.24-.65.24-1.21.16-1.32-.07-.12-.25-.2-.53-.34z"/>
  </svg>
);

export const TikTokIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.83-.97-6.46-2.99-1.63-2.02-2.4-4.58-2.2-7.18.21-2.61 1.15-5.1 2.99-6.84 1.94-1.83 4.59-2.79 7.18-2.89.02-.35.01-.7.01-1.06.01-1.77-.01-3.54.02-5.31z"/>
  </svg>
);

export const VideoCameraIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.964A3 3 0 0115 12a3 3 0 01-3 3H9m6-3a3 3 0 00-3-3H9a3 3 0 00-3 3m12 0a3 3 0 01-3 3H9a3 3 0 01-3-3m3-10.5a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const WalletIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m15 0a2.25 2.25 0 012.25 2.25v6a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25v-6a2.25 2.25 0 012.25-2.25m13.5 0V9" />
  </svg>
);

export const InboxArrowDownIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export const CogIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l-1.41-.513M5.106 17.785l1.15-.964m11.69-9.64l-1.149-.964M5.106 6.215l1.15.964m11.69 9.64l-1.149.964M12 4.5v.75m0 13.5v.75m3.077-15.457l-.513 1.41m-5.13 14.095l-.513-1.41M17.785 5.106l-.964 1.15m-9.64 11.69l-.964-1.149" />
  </svg>
);

export const BanIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
  </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ArrowUpCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const XCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ThumbsUpIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.422 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M6.633 10.5l-1.87-1.87a.75.75 0 00-1.06 0l-1.06 1.06a.75.75 0 000 1.06l1.87 1.87M6.633 10.5h.007v.008H6.633v-.008z" />
  </svg>
);

export const SpeakerIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

export const GiftIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>
);

export const BellIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

export const CoffeeCupIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5a.75.75 0 01.75-.75h9a.75.75 0 01.75.75v9a.75.75 0 01-.75.75h-9a.75.75 0 01-.75-.75v-9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 12h.75a2.25 2.25 0 012.25 2.25v.75a2.25 2.25 0 01-2.25 2.25h-.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5v-1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v-1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 4.5v-1.5" />
    </svg>
);

export const ChatBubbleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0-4.624 3.376-8.524 7.756-9.157C14.88 2.94 19.5 6.64 19.5 11.666c0 1.87-.582 3.6-1.588 5.048L21.75 21l-4.593-2.522a10.45 10.45 0 01-2.657.36c-4.992 0-9-3.906-9-8.578z" />
  </svg>
);

export const ClipboardListIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const InboxInIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`app-icon ${className || ''}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m-1.125 9l3 3m0 0l3-3m-3 3v-6.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v2.625a3.375 3.375 0 01-3.375 3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 013.375-3.375H19.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 14.25v2.625a3.375 3.375 0 003.375 3.375h1.5a1.125 1.125 0 001.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H4.5" />
    </svg>
);
