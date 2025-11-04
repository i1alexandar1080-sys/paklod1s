import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from './icons';

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ id, label, placeholder, value, onChange }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder={placeholder}
          className="w-full bg-transparent border-0 border-b border-gray-500 focus:border-white focus:ring-0 pb-2 text-white placeholder-gray-400 transition-colors pe-10"
          autoComplete={id.includes('password') ? 'new-password' : 'current-password'}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute bottom-2 end-0 flex items-center pe-3 text-gray-400 hover:text-white"
          aria-label="Toggle password visibility"
        >
          {isPasswordVisible ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
};