import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from './TextInput';
import { PasswordInput } from './PasswordInput';
import { PhoneInput } from './PhoneInput';
import { db } from '../lib/mockDatabase';

type RegisterMode = 'email' | 'phone';

interface RegistrationFormProps {
  onSwitchToLogin: () => void;
  onRegistrationSuccess: (email: string, pass: string) => void;
  initialInvitationCode?: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSwitchToLogin, onRegistrationSuccess, initialInvitationCode }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<RegisterMode>('email');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState(initialInvitationCode || '');
  const [error, setError] = useState('');
  
  const validatePassword = (pass: string): string => {
    if (pass.length < 6) {
        return t('passwordTooShort');
    }
    if (!(/[A-Z]/.test(pass) || /\d/.test(pass))) {
        return t('passwordInvalid');
    }
    return '';
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    // Common validation for password
    const passwordError = validatePassword(password);
    if (passwordError) {
        setError(passwordError);
        return;
    }
    if (password !== reenterPassword) {
        setError(t('passwordsDoNotMatch'));
        return;
    }

    let result;
    if (mode === 'email') {
        if (!email) {
            setError(t('emailRequired'));
            return;
        }
        result = db.addUser({ email, password, invitedBy: invitationCode });
    } else {
        // Phone registration is not fully implemented in this demo
        alert(t('phoneRegistrationNotImplemented'));
        return;
    }

    if (result.success) {
        onRegistrationSuccess(email, password);
    } else {
        if (result.message === 'email_exists') {
            setError(t('emailAlreadyExists'));
        } else {
            setError(t('unknownError'));
        }
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
          {t('registerByEmail')}
        </TabButton>
        <TabButton active={mode === 'phone'} onClick={() => setMode('phone')}>
          {t('registerByPhone')}
        </TabButton>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pt-6">
        {mode === 'email' ? (
          <TextInput
            id="register-email"
            label={t('emailLabel')}
            placeholder={t('emailPlaceholder')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <PhoneInput />
        )}
        <PasswordInput
          id="register-password"
          label={t('passwordLabel')}
          placeholder={t('passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput
          id="reenterPassword"
          label={t('reenterPasswordLabel')}
          placeholder={t('reenterPasswordPlaceholder')}
          value={reenterPassword}
          onChange={(e) => setReenterPassword(e.target.value)}
        />
        <TextInput
          id="invitationCode"
          label={t('invitationCodeLabel')}
          placeholder={t('invitationCodePlaceholder')}
          value={invitationCode}
          onChange={(e) => setInvitationCode(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm text-center !mt-4">{error}</p>}
        
        <div className="pt-4 space-y-4">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-transparent disabled:opacity-50 transition-all"
          >
            {t('signUpButton')}
          </button>
           <button type="button" onClick={onSwitchToLogin} className="w-full text-center font-medium text-white hover:text-gray-300">
                {t('signInButton')}
            </button>
        </div>
      </form>
    </div>
  );
};