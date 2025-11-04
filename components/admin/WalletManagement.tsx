import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../lib/mockDatabase';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

interface WalletManagementProps {
    showToast: (message: string, type?: 'success' | 'error') => void;
}

export const WalletManagement: React.FC<WalletManagementProps> = ({ showToast }) => {
    const { t } = useTranslation();
    const [wallets, setWallets] = useState(JSON.parse(JSON.stringify(db.walletAddresses)));

    const handleAddressChange = (currency: string, network: string, address: string) => {
        setWallets((prev: any) => ({
            ...prev,
            [currency]: {
                ...prev[currency],
                [network]: {
                    ...prev[currency][network],
                    address: address,
                },
            }
        }));
    };

    const handleQrCodeChange = async (currency: string, network: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setWallets((prev: any) => ({
                ...prev,
                [currency]: {
                    ...prev[currency],
                    [network]: {
                        ...prev[currency][network],
                        qrCodeUrl: base64,
                    }
                }
            }));
        }
    };

    const handleSaveChanges = () => {
        db.walletAddresses = JSON.parse(JSON.stringify(wallets));
        showToast(t('admin.wallets.saveSuccess'));
    };
    
    return (
        <div className="bg-gray-800 rounded-lg shadow p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-6">{t('admin.wallets.title')}</h2>
            <div className="space-y-6">
                {Object.entries(wallets).map(([currency, networks]) => (
                    <div key={currency} className="bg-gray-700/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-4">{currency}</h3>
                        <div className="space-y-4">
                            {Object.entries(networks as Record<string, { address: string, qrCodeUrl: string }>).map(([network, walletInfo]) => (
                                <div key={`${currency}-${network}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end border-t border-gray-600 pt-4 first:pt-0 first:border-t-0">
                                    <div>
                                        <label htmlFor={`wallet-${currency}-${network}`} className="block text-sm font-medium text-gray-300 mb-1">{network} {t('admin.wallets.address')}</label>
                                        <input
                                            id={`wallet-${currency}-${network}`}
                                            type="text"
                                            value={walletInfo.address}
                                            onChange={(e) => handleAddressChange(currency, network, e.target.value)}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`qr-${currency}-${network}`} className="block text-sm font-medium text-gray-300 mb-1">{t('admin.wallets.qrCodeImage')}</label>
                                        <div className="flex items-center gap-4">
                                            {walletInfo.qrCodeUrl ? (
                                                <img src={walletInfo.qrCodeUrl} alt="QR Code Preview" className="w-12 h-12 bg-white p-1 rounded-md object-contain" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-600 rounded-md flex items-center justify-center text-xs text-gray-400">{t('admin.wallets.noQrCode')}</div>
                                            )}
                                            <input
                                                id={`qr-${currency}-${network}`}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleQrCodeChange(currency, network, e)}
                                                className="w-full text-sm text-gray-300 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <button
                    onClick={handleSaveChanges}
                    className="w-full px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    {t('admin.common.saveChanges')}
                </button>
            </div>
        </div>
    );
};