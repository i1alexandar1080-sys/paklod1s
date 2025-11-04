import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, RechargeCurrency, PlatformSettingsData } from '../lib/mockDatabase';

interface RechargeSelectScreenProps {
    onProceed: (config: { amount: number, currency: string, network: string }) => void;
    platformSettings: PlatformSettingsData;
}

export const RechargeSelectScreen: React.FC<RechargeSelectScreenProps> = ({ onProceed, platformSettings }) => {
    const { t } = useTranslation();
    const currencies = db.platformSettings.rechargeCurrencies || [];

    const [amount, setAmount] = useState<string>('');
    const [selectedCurrency, setSelectedCurrency] = useState<RechargeCurrency | undefined>(currencies[0]);
    const [selectedNetwork, setSelectedNetwork] = useState(currencies[0]?.networks[0]);

    if(currencies.length === 0 || !selectedCurrency) {
        return <div className="text-center text-gray-400 p-8">{t('noRechargeCurrencies')}</div>
    }

    const handleCurrencyChange = (currencyName: string) => {
        const newCurrency = currencies.find(c => c.name === currencyName)!;
        setSelectedCurrency(newCurrency);
        setSelectedNetwork(newCurrency.networks[0]);
    };
    
    const handleProceed = () => {
        const numericAmount = parseFloat(amount);
        if (!isNaN(numericAmount) && numericAmount > 0) {
            onProceed({ amount: numericAmount, currency: selectedCurrency.name, network: selectedNetwork });
        } else {
            alert(t('pleaseEnterValidAmount'));
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };
    
    return (
        <div className="space-y-6">
            <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4">
                <label htmlFor="recharge-amount" className="block text-sm font-medium text-gray-400 mb-2">{t('rechargeAmount')}</label>
                <div className="relative">
                    <span className="absolute start-3 top-1/2 -translate-y-1/2 text-white font-semibold text-lg">$</span>
                    <input
                        id="recharge-amount"
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="18.00 - 50000.00"
                        className="w-full bg-transparent border-0 border-b-2 border-gray-600 focus:border-white focus:ring-0 ps-8 pb-2 text-white text-lg placeholder-gray-500 transition-colors"
                    />
                </div>
            </div>

            <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4">
                <p className="text-sm font-medium text-gray-400 mb-3">{t('selectCurrency')}</p>
                <div className="grid grid-cols-4 gap-3">
                    {currencies.map(currency => (
                        <button key={currency.name} onClick={() => handleCurrencyChange(currency.name)} className={`p-2 rounded-lg flex flex-col items-center gap-1.5 transition-colors ${selectedCurrency.name === currency.name ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}>
                            <img src={currency.iconUrl} alt={currency.name} className="w-7 h-7" />
                            <span className="text-xs font-semibold">{currency.name}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4">
                <p className="text-sm font-medium text-gray-400 mb-3">{t('selectNetwork')}</p>
                <div className="flex flex-wrap gap-3">
                    {selectedCurrency.networks.map(network => (
                        <button key={network} onClick={() => setSelectedNetwork(network)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${selectedNetwork === network ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
                            {network}
                        </button>
                    ))}
                </div>
            </div>
            
             <div>
                <button 
                    onClick={handleProceed}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-[#2a3a6b] hover:bg-[#3b4a7c] transition-colors font-semibold"
                >
                    <span>{t('nextStep')}</span>
                </button>
            </div>
        </div>
    );
};
