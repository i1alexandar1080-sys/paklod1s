import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db, User, PlatformSettingsData } from '../lib/mockDatabase';
import { 
    EyeIcon, 
    EyeSlashIcon,
    UsdtIcon,
    UsdcIcon,
    BnbIcon,
    EthIcon,
    PolygonIcon,
    PyusdIcon,
    HeadsetIcon,
    EnvelopeIcon,
    BanIcon
} from './icons';

// In a real app, these prices would be fetched from a live crypto API.
const MOCK_CRYPTO_PRICES_IN_USDT: { [key: string]: number } = {
    'USDT': 1,
    'USDC': 1.00,
    'BNB': 601.50,
    'ETH': 3520.75,
    'TRX': 0.12,
    'MATIC': 0.71, // Native token for Polygon network
    'PYUSD': 1.00,
};

interface WithdrawalMethod {
    name: string;
    icon: React.FC<{ className?: string }>;
    currency: string;
}

const withdrawalMethods: WithdrawalMethod[] = [
    { name: 'TRC20-USDT', icon: UsdtIcon, currency: 'USDT' },
    { name: 'BEP20-USDT', icon: UsdtIcon, currency: 'USDT' },
    { name: 'BEP20-USDC', icon: UsdcIcon, currency: 'USDC' },
    { name: 'BNB', icon: BnbIcon, currency: 'BNB' },
    { name: 'ETH', icon: EthIcon, currency: 'ETH' },
    { name: 'ETH-USDT', icon: UsdtIcon, currency: 'USDT' },
    { name: 'ETH-USDC', icon: UsdcIcon, currency: 'USDC' },
    { name: 'ETH-PYUSD', icon: PyusdIcon, currency: 'PYUSD' },
    { name: 'POLYGON', icon: PolygonIcon, currency: 'MATIC' },
    { name: 'POLYGON-USDT', icon: UsdtIcon, currency: 'USDT' },
    { name: 'POLYGON-USDC', icon: UsdcIcon, currency: 'USDC' },
];

const validateWalletAddress = (address: string, network: string): boolean => {
    if (network.includes('TRC20')) return /^T[a-zA-Z0-9]{33}$/.test(address);
    if (['ETH', 'BEP20', 'POLYGON'].some(n => network.includes(n))) return /^0x[a-fA-F0-9]{40}$/.test(address);
    if (network === 'BNB') return /^bnb[a-zA-Z0-9]{38}$/.test(address); // For native BNB chain
    // For simplicity, we assume other validations are not needed for this mock
    return true;
};

interface WithdrawScreenProps {
    user: User;
    showInfoModal: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
    platformSettings: PlatformSettingsData;
}

export const WithdrawScreen: React.FC<WithdrawScreenProps> = ({ user, showInfoModal, platformSettings }) => {
    const { t } = useTranslation();
    const { minWithdrawal, maxWithdrawal, withdrawalFeePercentage, globalWithdrawalLock } = db.platformSettings;

    const [prices, setPrices] = useState(MOCK_CRYPTO_PRICES_IN_USDT);
    const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod>(withdrawalMethods[0]);

    const [displayBalance, setDisplayBalance] = useState(user.withdrawalBalance);
    const [displayCurrency, setDisplayCurrency] = useState('USDT');
    
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState<string>('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const isWithdrawalLocked = globalWithdrawalLock && !user.isWithdrawalEnabled;
    // FIX: Cast `set` to a typed object to resolve 'Property 'enabled' does not exist on type 'unknown'' error.
    const isCrawlerActive = Object.values(user.crawlSets || {}).some(set => (set as { enabled: boolean }).enabled);

    useEffect(() => {
        // In a real application, you would fetch prices from a crypto API.
        // This simulates an hourly update.
        const priceUpdateInterval = setInterval(() => {
            console.log("Simulating hourly price fetch...");
            // e.g., fetchPricesFromApi().then(newPrices => setPrices(newPrices));
        }, 3600 * 1000); // 1 hour

        return () => clearInterval(priceUpdateInterval);
    }, []);

    useEffect(() => {
        const price = prices[selectedMethod.currency] || 1;
        setDisplayBalance(user.withdrawalBalance / price);
        setDisplayCurrency(selectedMethod.currency);
    }, [selectedMethod, prices, user.withdrawalBalance]);


    // The user enters the GROSS amount to be withdrawn from their balance.
    const numericAmount = parseFloat(amount) || 0;
    const price = prices[selectedMethod.currency] || 1;
    const grossWithdrawalInUsdt = numericAmount * price;
    
    const effectiveFeePercentage = user.withdrawalFeePercentageOverride ?? withdrawalFeePercentage;
    const feeDecimal = effectiveFeePercentage / 100;
    
    // NEW CALCULATION: Fee is deducted from the gross amount.
    const feeInUsdt = grossWithdrawalInUsdt * feeDecimal;
    const netWithdrawalInUsdt = grossWithdrawalInUsdt - feeInUsdt;
    
    const feeInSelectedCurrency = feeInUsdt / price;
    const amountToReceive = netWithdrawalInUsdt / price;
    
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
            setError('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isWithdrawalLocked) {
            const title = isCrawlerActive ? t('completeTasksTitle') : t('withdrawalChannelClosedTitle');
            const message = isCrawlerActive ? t('completeTasksMessage') : t('withdrawalChannelClosedMessage');
            showInfoModal(title, message, 'error');
            return;
        }

        const numericAmount = parseFloat(amount) || 0; // This is the GROSS amount
        
        // --- VALIDATIONS ---
        if (numericAmount <= 0) {
            setError(t('pleaseEnterValidAmount'));
            return;
        }

        const grossWithdrawalInUsdt = numericAmount * price;

        if (grossWithdrawalInUsdt > user.withdrawalBalance) {
            setError(t('insufficientBalance'));
            return;
        }
        
        if (!address.trim()) {
            setError(t('pleaseEnterWalletAddress'));
            return;
        }

        if (!validateWalletAddress(address, selectedMethod.name)) {
            setError(t('invalidWalletAddress'));
            return;
        }

        // Validate min/max based on the GROSS amount user enters.
        if (grossWithdrawalInUsdt < minWithdrawal) {
            setError(t('amountBelowMinimum', { min: minWithdrawal }));
            return;
        }
        if (grossWithdrawalInUsdt > maxWithdrawal) {
            setError(t('amountAboveMaximum', { max: maxWithdrawal }));
            return;
        }

        if (!password) {
            setError(t('pleaseEnterTransactionPassword'));
            return;
        }

        if (password !== user.mockPassword) {
            setError(t('invalidPassword'));
            return;
        }
        
        // --- SUBMISSION ---
        // FIX: Add missing 'grossUsdtValue' property to fix type error.
        const result = db.addWithdrawalRequest({
            userId: user.id,
            amount: amountToReceive, // net amount in currency
            usdtValue: netWithdrawalInUsdt, // net usdt value
            grossUsdtValue: grossWithdrawalInUsdt, // gross usdt value
            currency: selectedMethod.currency,
            network: selectedMethod.name,
            address: address,
        });

        if (result.success) {
            showInfoModal(t('rechargeRequestSuccessTitle'), t('withdrawalSuccess'), 'success');
            // Reset form
            setAmount('');
            setAddress('');
            setPassword('');
        } else {
            setError(t(result.message || 'insufficientBalance'));
        }
    };

    return (
        <div className="relative pb-24">
            <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-lg p-4 sm:p-6 text-white max-w-lg mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-lg font-semibold">{t('withdrawalAccount')}</p>
                        <p className="text-xs text-gray-400">{t('twentyFourHourWithdrawal')}</p>
                    </div>
                     <div className="bg-blue-500 p-1 rounded-md flex items-center justify-center w-10 h-10">
                       <div className='flex flex-col items-center'>
                          <img src={db.platformSettings.logoUrl} alt="logo" className="w-3 h-3" />
                          <span className="font-bold text-white text-[8px] leading-none">{db.platformSettings.name.toLowerCase()}</span>
                       </div>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-400">{t('totalBalance')}</p>
                    <p className="text-3xl font-bold">{displayBalance.toFixed(4)} <span className="text-xl">{displayCurrency}</span></p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <p className="text-sm font-medium text-gray-400 mb-3">{t('withdrawalMethod')}</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {withdrawalMethods.map(method => (
                                <button
                                    type="button"
                                    key={method.name}
                                    onClick={() => setSelectedMethod(method)}
                                    className={`p-2 rounded-md border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                                        selectedMethod.name === method.name 
                                        ? 'bg-white/20 border-white/30' 
                                        : 'bg-transparent border-gray-600 hover:bg-white/10'
                                    }`}
                                >
                                    <method.icon className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{method.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                         <label htmlFor="withdraw-amount" className="text-sm font-medium text-gray-400">{t('withdrawalAmount')}</label>
                         <input
                            id="withdraw-amount"
                            type="text"
                            inputMode="decimal"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder={`${t('withdrawalAmount')}`}
                            className="w-full bg-transparent border-0 border-b border-gray-600 focus:border-white focus:ring-0 pb-2 text-white placeholder-gray-500 transition-colors"
                        />
                         <p className="text-xs text-gray-500">{t('withdrawalQuota')}: {maxWithdrawal.toFixed(3)} - {minWithdrawal.toFixed(3)} USDT</p>
                    </div>
                    
                     <div className="space-y-1">
                        <label htmlFor="wallet-address" className="text-sm font-medium text-gray-400">{t('withdrawalAddress')}</label>
                        <input
                            id="wallet-address"
                            type="text"
                            value={address}
                            onChange={(e) => { setAddress(e.target.value); setError(''); }}
                            className="w-full bg-transparent border-0 border-b border-gray-600 focus:border-white focus:ring-0 pb-2 text-white placeholder-gray-500 transition-colors"
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="transaction-password" className="text-sm font-medium text-gray-400">{t('password')}</label>
                         <div className="relative">
                            <input
                                id="transaction-password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                className="w-full bg-transparent border-0 border-b border-gray-600 focus:border-white focus:ring-0 pb-2 text-white placeholder-gray-500 transition-colors pe-10"
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordVisible(prev => !prev)}
                                className="absolute bottom-2 end-0 flex items-center pe-3 text-gray-400 hover:text-white"
                                aria-label="Toggle password visibility"
                            >
                                {isPasswordVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="text-sm text-gray-300 space-y-1 pt-2">
                        <div className="flex justify-between">
                            <span>{t('fees')} ({effectiveFeePercentage}%)</span>
                            <span>{displayCurrency} {feeInSelectedCurrency.toFixed(4)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>{t('actualArrival')}</span>
                            <span>{displayCurrency} {amountToReceive.toFixed(4)}</span>
                        </div>
                    </div>
                    
                    <div className="pt-4">
                        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
                        <button 
                            type="submit"
                            disabled={numericAmount <= 0 || !address || !password}
                            className="w-full py-3 px-4 rounded-lg bg-[#2a3a6b] hover:bg-[#3b4a7c] transition-colors font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {t('confirm')}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};