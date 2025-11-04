import React from 'react';
import { useTranslation } from 'react-i18next';
import { TelegramIcon, ChevronRightIcon } from './icons';

interface CustomerServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  serviceLink: string;
}

export const CustomerServiceModal: React.FC<CustomerServiceModalProps> = ({ isOpen, onClose, serviceName, serviceLink }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`fixed inset-0 bg-black/60 z-40 flex items-end justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-lg bg-gray-100 text-black rounded-t-2xl p-4 transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h2 className="font-bold text-lg">{t('internetService')}</h2>
          <p className="text-sm text-gray-500">{t('chooseContactMethod')}</p>
        </div>
        <a
          href={serviceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-full">
              <TelegramIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold">{serviceName}</span>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </a>
      </div>
    </div>
  );
};
