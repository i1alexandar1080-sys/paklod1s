import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, XCircleIcon, InfoIcon } from './icons';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, message, type }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const getIcon = () => {
    switch(type) {
      case 'success':
        return <CheckCircleIcon className="w-12 h-12 text-green-400 mx-auto" />;
      case 'error':
        return <XCircleIcon className="w-12 h-12 text-red-400 mx-auto" />;
      default:
        return <InfoIcon className="w-12 h-12 text-blue-400 mx-auto" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-[#1c0f3b] rounded-lg w-full max-w-sm text-white p-6 text-center shadow-2xl border border-purple-400/30"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4">
          {getIcon()}
        </div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        {message && <p className="text-gray-300 text-sm mb-6">{message}</p>}
        <button 
          onClick={onClose} 
          className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold"
        >
          {t('confirmButton')}
        </button>
      </div>
    </div>
  );
};
