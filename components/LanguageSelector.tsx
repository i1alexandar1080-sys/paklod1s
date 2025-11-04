import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { languages, Language } from '../lib/languages';
import { SearchIcon, CheckCircleIcon } from './icons';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguageCode: string;
  onSelectLanguage: (languageCode: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isOpen, onClose, selectedLanguageCode, onSelectLanguage }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelect = (language: Language) => {
    onSelectLanguage(language.code);
    onClose();
    setSearchTerm('');
  };

  return (
    <div
      className={`fixed inset-0 bg-black/60 z-40 flex items-end justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-selector-title"
    >
      <div
        ref={modalRef}
        className={`w-full max-w-md bg-white text-black rounded-t-2xl p-4 transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mb-4">
          <h2 id="language-selector-title" className="sr-only">{t('selectLanguage')}</h2>
          <SearchIcon className="absolute start-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full bg-gray-100 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-2.5 ps-10 pe-4 text-black placeholder-gray-500"
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto pe-2">
          {filteredLanguages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {filteredLanguages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageSelect(lang)}
                  className={`relative p-2 rounded-lg text-center text-sm transition-colors flex items-center justify-center ${selectedLanguageCode === lang.code ? 'bg-gray-200 font-semibold' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <span className="truncate">{lang.name}</span>
                  {selectedLanguageCode === lang.code && (
                    <CheckCircleIcon className="absolute top-1.5 end-1.5 w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">{t('noLanguagesFound')}</div>
          )}
        </div>
      </div>
    </div>
  );
};
