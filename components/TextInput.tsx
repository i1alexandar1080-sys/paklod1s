import React from 'react';

interface TextInputProps {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ id, label, placeholder, type = "text", value, onChange }) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      className="w-full bg-transparent border-0 border-b border-gray-500 focus:border-white focus:ring-0 pb-2 text-white placeholder-gray-400 transition-colors"
      autoComplete="off"
      value={value}
      onChange={onChange}
    />
  </div>
);