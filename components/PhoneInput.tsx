import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { countries, Country } from '../lib/countries';
import { SearchIcon, CheckCircleIcon } from './icons';

export const PhoneInput: React.FC = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries.find(c => c.code === 'US')!);
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

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.dialCode.includes(searchTerm)
    );

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="w-full">
            <label htmlFor="phone" className="block text-xs font-medium text-gray-400 mb-1">
                {t('phoneLabel')}
            </label>
            <div className="flex items-center border-b-2 border-gray-600 focus-within:border-white transition-colors">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="text-gray-400 hover:text-white ps-0 pe-3 pb-2 transition-colors"
                    aria-label={`Select country code, current is ${selectedCountry.name} ${selectedCountry.dialCode}`}
                >
                    {selectedCountry.dialCode}
                </button>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={t('phonePlaceholder')}
                    className="flex-grow bg-transparent pb-2 px-2 text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                />
            </div>

            {/* Country Selector Modal */}
            <div
                className={`fixed inset-0 bg-black/60 z-40 flex items-end justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                role="dialog"
                aria-modal="true"
                aria-labelledby="country-selector-title"
            >
                <div
                    ref={modalRef}
                    className={`w-full max-w-md bg-white text-black rounded-t-2xl p-4 transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative mb-4">
                         <h2 id="country-selector-title" className="sr-only">{t('selectCountry')}</h2>
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
                    <ul className="max-h-[60vh] overflow-y-auto">
                        {filteredCountries.length > 0 ? filteredCountries.map(country => (
                            <li key={country.code}>
                                <button
                                    type="button"
                                    onClick={() => handleCountrySelect(country)}
                                    className="w-full text-start px-2 py-3 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 transition-colors"
                                >
                                    <span>{country.name} <span className="text-gray-500">{country.code.toLowerCase()}</span> ({country.dialCode})</span>
                                    {selectedCountry.code === country.code && <CheckCircleIcon className="w-6 h-6 text-blue-600" />}
                                </button>
                            </li>
                        )) : (
                            <li className="text-center text-gray-500 py-4">{t('noCountriesFound')}</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};
