import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, User, PlatformSettingsData } from '../lib/mockDatabase';
import { PasswordInput } from './PasswordInput';
import { LoadingSpinner } from './LoadingSpinner';

interface ChangePasswordScreenProps {
    user: User;
    onPasswordChanged: () => void;
    platformSettings: PlatformSettingsData;
}

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ user, onPasswordChanged, platformSettings }) => {
    const { t } = useTranslation();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validatePassword = (pass: string): string => {
        if (pass.length < 6) {
            return t('passwordTooShort');
        }
        if (!(/[A-Z]/.test(pass) || /\d/.test(pass))) {
            return t('passwordInvalid');
        }
        return '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        setTimeout(() => { // Simulate API call
            // 1. Check old password
            if (oldPassword !== user.mockPassword) {
                setError(t('incorrectOldPassword'));
                setIsLoading(false);
                return;
            }

            // 2. Check if new password is same as old
            if (newPassword === oldPassword) {
                setError(t('newPasswordSameAsOld'));
                setIsLoading(false);
                return;
            }

            // 3. Validate new password strength
            const passwordError = validatePassword(newPassword);
            if (passwordError) {
                setError(passwordError);
                setIsLoading(false);
                return;
            }

            // 4. Check if new passwords match
            if (newPassword !== confirmPassword) {
                setError(t('passwordsDoNotMatch'));
                setIsLoading(false);
                return;
            }

            // 5. Update password
            db.updateUser(user.id, { mockPassword: newPassword });
            setSuccess(t('passwordChangedSuccess'));
            setIsLoading(false);

            // Reset fields and navigate back after a delay
            setTimeout(() => {
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                onPasswordChanged();
            }, 1500);

        }, 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div style={{ backgroundColor: platformSettings.cardColor }} className="p-6 sm:p-8 rounded-2xl relative w-full max-w-sm">
                {isLoading && (
                    <div className="absolute inset-0 bg-[#1c0f3b] bg-opacity-80 flex items-center justify-center z-10 rounded-2xl">
                        <LoadingSpinner />
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <PasswordInput
                        id="old-password"
                        label={t('oldPasswordLabel')}
                        placeholder={t('oldPasswordPlaceholder')}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <PasswordInput
                        id="new-password"
                        label={t('newPasswordLabel')}
                        placeholder={t('newPasswordPlaceholder')}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <PasswordInput
                        id="confirm-new-password"
                        label={t('confirmNewPasswordLabel')}
                        placeholder={t('confirmNewPasswordPlaceholder')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    {success && <p className="text-green-400 text-sm text-center">{success}</p>}

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-[#2a3a6b] hover:bg-[#3b4a7c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b4a7c] focus:ring-offset-[#1c0f3b] disabled:opacity-50 transition-all"
                            disabled={isLoading}
                        >
                            {t('confirmButton')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
