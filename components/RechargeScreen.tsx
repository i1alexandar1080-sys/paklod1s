import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NadecIcon, UsdtIcon } from './icons';

interface Currency {
    name: string;
    icon: React.ReactNode;
}

interface RechargeScreenProps {
    currency: Currency;
}

export const RechargeScreen: React.FC<RechargeScreenProps> = ({ currency }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const walletAddress = 'TRrLWVoKU7xbSLtCbag3nguVCK29ckCoom';

    const handleCopy = () => {
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 mt-4">
            {/* QR Code Card */}
            <div className="bg-[#1c0f3b] rounded-2xl p-6 text-center">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-500 p-1 rounded-md flex items-center justify-center w-8 h-8">
                           <div className='flex flex-col items-center'>
                              <NadecIcon className='w-4 h-4' />
                              <span className="font-bold text-white text-xs leading-none">nadec</span>
                           </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {currency?.icon || <UsdtIcon className="w-6 h-6" />}
                        <span className="font-semibold">{currency?.name || 'TRC20-USDT'}</span>
                    </div>
                </div>

                <div className="bg-white p-2 inline-block rounded-lg">
                    <img 
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQMAAACXljzdAAAABlBMVEX///8AAABVwtN+AAABsklEQVRIie2WsQ3DMAxENf//Pztk2iCJEk/o4Zz3JgghYyNA9nS23N7t8xXL5P/yW/5LdCSh7EZEZEdkNkYf2VGR3YjIjshsjD5yoyK7EZEZkdkYfeRG5rZGUYfIishsiL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyL4PyIyI7EbEx5CsiMiOyD6yA2I7IjIjoy+87/8lv+SHRnsY/oA9/JdDE4b2gMAAAAASUVORK5CYII=" 
                        alt="QR Code" 
                        className="w-40 h-40" 
                    />
                </div>

                <p className="text-gray-400 text-sm mt-4 mb-2">{t('address')}</p>
                <div className="bg-black/30 rounded-lg p-2 flex items-center justify-between">
                    <span className="text-sm truncate text-left ml-2">{walletAddress}</span>
                    <button onClick={handleCopy} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-md flex-shrink-0">
                        {copied ? 'Copied!' : t('copy')}
                    </button>
                </div>

                <button className="w-full bg-[#0a2e4a] hover:bg-[#1a3e5a] text-white font-semibold py-3 mt-6 rounded-lg">
                    {t('rechargeCompleted')}
                </button>
            </div>

            {/* Instructions Card */}
            <div className="bg-[#1c0f3b] rounded-2xl p-6 text-right text-sm text-gray-300 space-y-3" dir="rtl">
                <h3 className="font-bold text-white text-center mb-4">{t('rechargeInstructionsTitle')}</h3>
                <p>{t('rechargeInstruction1')} <span className="text-green-400">✅</span></p>
                <p>{t('rechargeInstruction2')} <span className="text-green-400">✅</span></p>
                <p>{t('rechargeInstruction3')} <span className="text-green-400">✅</span></p>
                <p>{t('rechargeInstruction4')}</p>
            </div>
        </div>
    );
};