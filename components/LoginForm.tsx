import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from './TextInput';
import { PasswordInput } from './PasswordInput';
import { PhoneInput } from './PhoneInput';

type LoginMode = 'email' | 'phone' | 'telegram';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onLoginAttempt: (email: string, pass: string) => Promise<{success: boolean; message?: string}>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onLoginAttempt }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<LoginMode>('email');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    
    if (mode !== 'email') {
      alert(t('loginNotImplemented'));
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = formData.get('login-email') as string || '';
    const password = formData.get('login-password-email') as string || '';
    
    const result = await onLoginAttempt(email, password);
    if (!result.success && result.message) {
        setError(result.message);
    }
  };
  
  const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-3 text-center text-sm font-medium transition-colors duration-300 ${
        active
          ? 'bg-white/20 text-white rounded-t-lg'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="text-white">
       <div className="flex bg-black/20 rounded-t-lg">
        <TabButton active={mode === 'email'} onClick={() => setMode('email')}>
          {t('emailLogin')}
        </TabButton>
        <TabButton active={mode === 'phone'} onClick={() => setMode('phone')}>
          {t('phoneLogin')}
        </TabButton>
        <TabButton active={mode === 'telegram'} onClick={() => setMode('telegram')}>
          {t('telegramLogin')}
        </TabButton>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pt-6">
        {mode === 'email' && (
            <>
                <TextInput
                id="login-email"
                label={t('emailLabel')}
                placeholder={t('emailPlaceholder')}
                type="email"
                />
                <PasswordInput
                id="login-password-email"
                label={t('passwordLabel')}
                placeholder={t('passwordPlaceholder')}
                />
            </>
        )}
        {mode === 'phone' && (
            <>
                <PhoneInput />
                <PasswordInput
                id="login-password-phone"
                label={t('passwordLabel')}
                placeholder={t('passwordPlaceholder')}
                />
            </>
        )}
        {mode === 'telegram' && (
            <>
                <TextInput
                id="telegram-id"
                label={t('telegramIdLabel')}
                placeholder={t('telegramIdPlaceholder')}
                />
                <PasswordInput
                id="login-password-telegram"
                label={t('passwordLabel')}
                placeholder={t('passwordPlaceholder')}
                />
            </>
        )}
        
        {error && <p className="text-red-400 text-sm text-center !mt-4">{error}</p>}

        <div className="pt-4 space-y-4">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-transparent disabled:opacity-50 transition-all"
          >
            {t('signInButton')}
          </button>
          <button type="button" onClick={onSwitchToRegister} className="w-full text-center font-medium text-white hover:text-gray-300">
                {t('signUpButton')}
          </button>
        </div>
      </form>
    </div>
  );
};