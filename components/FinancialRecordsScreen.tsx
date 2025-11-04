import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, User, Transaction, PlatformSettingsData } from '../lib/mockDatabase';
import { FinancialRecordsIcon } from './icons';

interface FinancialRecordsScreenProps {
  user: User;
  platformSettings: PlatformSettingsData;
}

const TransactionItem: React.FC<{ tx: Transaction }> = ({ tx }) => {
  const { t } = useTranslation();
  const isPositive = tx.amount >= 0;

  return (
    <div className="flex justify-between items-center py-3 border-b border-white/10 last:border-b-0">
        <div>
            <p className="font-medium text-white">{t(tx.description as any)}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(tx.timestamp).toLocaleString()}</p>
        </div>
        <p className={`font-semibold text-lg ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{tx.amount.toFixed(4)} USDT
        </p>
    </div>
  );
};


export const FinancialRecordsScreen: React.FC<FinancialRecordsScreenProps> = ({ user, platformSettings }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'main' | 'withdrawal'>('withdrawal');

  const transactions = db.getTransactionsForUser(user.id);
  const filteredTxs = transactions.filter(tx => tx.account === activeTab);
  
  const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-1/2 py-3 text-center font-semibold transition-colors ${
        active
          ? 'bg-[#2a3a6b] text-white rounded-t-lg'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
    </button>
  );


  return (
    <div>
        <div style={{ backgroundColor: platformSettings.cardColor }} className="rounded-t-lg">
            <div className="flex">
                <TabButton active={activeTab === 'withdrawal'} onClick={() => setActiveTab('withdrawal')}>
                    {t('withdrawalAccountTab')}
                </TabButton>
                <TabButton active={activeTab === 'main'} onClick={() => setActiveTab('main')}>
                    {t('mainAccount')}
                </TabButton>
            </div>
            <div className="p-4 min-h-[60vh] flex flex-col">
                {filteredTxs.length > 0 ? (
                    <>
                        <div className="flex-grow">
                            {filteredTxs.map(tx => <TransactionItem key={tx.id} tx={tx} />)}
                        </div>
                        <div className="mt-6 text-center">
                            <button className="text-sm text-gray-400 hover:text-white">
                                {t('loadMore')}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
                        <FinancialRecordsIcon className="w-24 h-24 opacity-20 mb-4" />
                        <p>{t('noFinancialRecords')}</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
