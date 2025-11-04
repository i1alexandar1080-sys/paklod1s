import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadIcon } from './icons';
import { db, User, PlatformSettingsData } from '../lib/mockDatabase';

interface RechargeDetailsScreenProps {
    config: { amount: number, currency: string, network: string } | null;
    onBack: () => void;
    user: User;
    platformSettings: PlatformSettingsData;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export const RechargeDetailsScreen: React.FC<RechargeDetailsScreenProps> = ({ config, onBack, user, platformSettings }) => {
    const { t } = useTranslation();
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    
    if (!config) {
        return <div>{t('noRechargeDetails')}</div>;
    }

    const { amount, currency, network } = config;
    const walletInfo = db.getWalletAddress(currency, network);
    const address = walletInfo?.address || t('addressNotConfigured');
    const qrCodeUrl = walletInfo?.qrCodeUrl;


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert(t('copiedToClipboard'));
        });
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentProof(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!paymentProof) {
            alert(t('uploadProofRequired'));
            return;
        }
        
        const proofBase64 = await fileToBase64(paymentProof);

        db.addRechargeRequest({
            userId: user.id,
            amount,
            currency,
            network,
            paymentProof: proofBase64
        });
        
        setSuccessModalOpen(true);
    };

    const handleCloseSuccessModal = () => {
        setSuccessModalOpen(false);
        onBack();
    };

    return (
        <div className="space-y-6 text-center">
            <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-6">
                <p className="text-sm text-gray-400">{t('rechargeAmount')}</p>
                <p className="text-3xl font-bold text-white my-2">{amount.toFixed(2)} <span className="text-lg">{currency}</span></p>
                <p className="text-sm text-gray-400">{t('selectedNetwork')}: {network}</p>
            </div>

             <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-6 flex flex-col items-center">
                <p className="text-sm text-gray-400 mb-4">{t('scanQrCode')}</p>
                <div className="bg-white p-2 rounded-lg">
                    {qrCodeUrl ? (
                        <img src={qrCodeUrl} alt="QR Code" width="150" height="150" />
                    ) : (
                        <div className="w-[150px] h-[150px] flex items-center justify-center bg-gray-200 text-gray-700 text-xs text-center p-2">
                           {t('qrNotAvailable')}
                        </div>
                    )}
                </div>
             </div>

             <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{t('rechargeAddress')}</span>
                    <button onClick={() => copyToClipboard(address)} className="text-sm text-blue-400 hover:text-blue-300 font-semibold">{t('copy')}</button>
                </div>
                <p className="text-xs text-start text-white break-all bg-black/30 p-2 rounded-md">{address}</p>
             </div>
             
             <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4 text-center">
                <label htmlFor="payment-proof-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 hover:bg-black/30 transition-colors">
                        <UploadIcon className="w-10 h-10 mx-auto text-gray-400 mb-2"/>
                        <p className="text-sm font-semibold text-white">{t('uploadPaymentProof')}</p>
                        <p className="text-xs text-gray-400">{t('clickToUpload')}</p>
                        <input
                            id="payment-proof-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </label>
                {paymentProof && (
                    <p className="text-xs text-gray-300 mt-2 text-start">{t('fileSelected')} {paymentProof.name}</p>
                )}
            </div>

             <div>
                <button 
                    onClick={handleSubmit}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-[#2a3a6b] hover:bg-[#3b4a7c] transition-colors font-semibold"
                >
                    <span>{t('submitRecharge')}</span>
                </button>
            </div>

            {/* Success Modal */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-sm text-black p-6 text-center">
                        <h3 className="font-bold text-lg mb-4">{t('rechargeRequestSuccessTitle')}</h3>
                        <p className="mb-6 text-gray-700">{t('rechargeRequestSuccessMessage')}</p>
                        <div className="flex gap-4">
                            <button onClick={handleCloseSuccessModal} className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">{t('confirm')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};