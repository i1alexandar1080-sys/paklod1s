import React from 'react';
import { useTranslation } from 'react-i18next';

export const LoadingSpinner: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <style>{`
            .platform-loader {
                width: 120px;
                height: 120px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .platform-loader .spinner-ring {
                position: absolute;
                width: 100%;
                height: 100%;
            }
            .platform-loader .track {
                stroke: rgba(255, 255, 255, 0.1);
            }
            .platform-loader .arc {
                stroke-linecap: round;
                animation: platform-spin 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
            }

            .platform-loader .arc-1 {
                stroke: #fff;
            }
            .platform-loader .arc-2 {
                stroke: #be185d; /* Secondary color from platform settings */
                animation-name: platform-spin-reverse;
                animation-duration: 2.2s;
            }
            
            .platform-loader .logo-container {
                width: 60%;
                height: 60%;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: logo-spin 2.5s linear infinite;
            }
            .platform-loader .logo-svg {
                width: 70%;
                height: 70%;
                stroke: #fff;
                fill: none;
                filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
            }

            @keyframes platform-spin {
                0% {
                    stroke-dasharray: 1, 200;
                    stroke-dashoffset: 0;
                    transform: rotate(0deg);
                }
                50% {
                    stroke-dasharray: 120, 200;
                    stroke-dashoffset: -50px;
                }
                100% {
                    stroke-dasharray: 120, 200;
                    stroke-dashoffset: -340px;
                    transform: rotate(360deg);
                }
            }

            @keyframes platform-spin-reverse {
                 0% {
                    stroke-dasharray: 1, 200;
                    stroke-dashoffset: 0;
                    transform: rotate(0deg);
                }
                50% {
                    stroke-dasharray: 100, 200;
                    stroke-dashoffset: 60px;
                }
                100% {
                    stroke-dasharray: 100, 200;
                    stroke-dashoffset: 300px;
                    transform: rotate(-360deg);
                }
            }

            @keyframes logo-spin {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }

            .loading-text-platform {
                color: white;
                font-size: 0.875rem;
                font-weight: 500;
                opacity: 0.8;
                letter-spacing: 0.1em;
            }
        `}</style>
        <div className="platform-loader">
            <svg className="spinner-ring" viewBox="0 0 100 100">
                <circle className="track" cx="50" cy="50" r="45" fill="none" strokeWidth="6"></circle>
                <circle className="arc arc-1" cx="50" cy="50" r="45" fill="none" strokeWidth="6"></circle>
            </svg>
             <svg className="spinner-ring" style={{transform: 'scale(0.75)'}} viewBox="0 0 100 100">
                <circle className="track" cx="50" cy="50" r="45" fill="none" strokeWidth="8"></circle>
                <circle className="arc arc-2" cx="50" cy="50" r="45" fill="none" strokeWidth="8"></circle>
            </svg>
            <div className="logo-container">
                 <svg className="logo-svg" viewBox="0 0 100 100" strokeWidth="2.5">
                    <rect x="25" y="25" width="50" height="50"/>
                    <rect x="10" y="10" width="80" height="80"/>
                    <path d="M10 10 L 25 25"/>
                    <path d="M90 10 L 75 25"/>
                    <path d="M10 90 L 25 75"/>
                    <path d="M90 90 L 75 75"/>
                </svg>
            </div>
        </div>
        <p className="loading-text-platform">{t('loading')}</p>
    </div>
)};
