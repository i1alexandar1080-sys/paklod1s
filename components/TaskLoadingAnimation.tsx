import React from 'react';

export const TaskLoadingAnimation: React.FC = () => (
    <div className="fixed inset-0 bg-[#121212] bg-opacity-95 z-[100] flex flex-col items-center justify-center">
        <style>{`
            .loading-bars-container-task {
                width: 50px;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            .bar-wrapper-task {
                width: 100%;
                height: 6px;
                background-color: rgba(255, 255, 255, 0.2);
                overflow: hidden;
            }
            .bar-fill-task {
                width: 100%;
                height: 100%;
                background-color: white;
                animation: wipe-right-task 2s infinite cubic-bezier(0.5, 0, 0.5, 1);
            }
            .bar-fill-1-task { animation-delay: 0s; }
            .bar-fill-2-task { animation-delay: 0.2s; }
            .bar-fill-3-task { animation-delay: 0.4s; }

            @keyframes wipe-right-task {
                0% { transform: scaleX(0); transform-origin: left; }
                45% { transform: scaleX(1); transform-origin: left; }
                50% { transform: scaleX(1); transform-origin: right; }
                95% { transform: scaleX(0); transform-origin: right; }
                100% { transform: scaleX(0); transform-origin: right; }
            }

            .loading-text-task {
                color: white;
                letter-spacing: 0.5em;
                font-size: 0.75rem; /* 12px */
                margin-top: 1rem;
                padding-left: 0.5em; /* to align with letter spacing */
                font-family: monospace;
                text-transform: uppercase;
                animation: pulse-text-task 2s infinite ease-in-out;
            }

            @keyframes pulse-text-task {
                0%, 100% {
                    opacity: 0.4;
                }
                50% {
                    opacity: 1;
                }
            }
        `}</style>
        <div className="loading-bars-container-task">
            <div className="bar-wrapper-task"><div className="bar-fill-task bar-fill-1-task"></div></div>
            <div className="bar-wrapper-task"><div className="bar-fill-task bar-fill-2-task"></div></div>
            <div className="bar-wrapper-task"><div className="bar-fill-task bar-fill-3-task"></div></div>
        </div>
        <p className="loading-text-task">Loading</p>
    </div>
);