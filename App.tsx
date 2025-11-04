import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RegistrationForm } from './components/RegistrationForm';
import { LoginForm } from './components/LoginForm';
import { LanguageSelector } from './components/LanguageSelector';
import { languages } from './lib/languages';
import { LoadingSpinner } from './components/LoadingSpinner';
import { MainLayout } from './components/MainLayout';
import { GlobeIcon, RefreshIcon } from './components/icons';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { db, User } from './lib/mockDatabase';
import { _0x5DECF5 } from './lib/d_0x5f3759df';

// Retrieve deobfuscated admin credentials.
const adminCreds = _0x5DECF5();

const ADMIN_EMAIL = adminCreds.email;
const ADMIN_PASSWORD = adminCreds.password;

function App() {
  const { i18n, t } = useTranslation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(i18n.language.split('-')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [platformSettings, setPlatformSettings] = useState(db.platformSettings);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [initialInvitationCode, setInitialInvitationCode] = useState('');

  const forceUserUpdate = () => {
    if (loggedInUser) {
        const freshUserData = db.findUserById(loggedInUser.id);
        if (freshUserData) {
            setLoggedInUser({...freshUserData});
        }
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
        setInitialInvitationCode(refCode);
        setIsRegistering(true); // Automatically switch to registration if ref code is present
    }

    const handleLanguageChanged = (lng: string) => {
      setSelectedLanguageCode(lng.split('-')[0]);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    handleLanguageChanged(i18n.language);
    
    // This is a mock way to listen for db changes.
    const interval = setInterval(() => {
        if (JSON.stringify(platformSettings) !== JSON.stringify(db.platformSettings)) {
            setPlatformSettings({...db.platformSettings});
        }
        // Poll for the logged-in user's data changes to ensure UI reactivity
        if (loggedInUser) {
            const freshUserData = db.findUserById(loggedInUser.id);
            if (freshUserData && JSON.stringify(loggedInUser) !== JSON.stringify(freshUserData)) {
                setLoggedInUser({...freshUserData});
            }
        }
    }, 500);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
      console.log('`beforeinstallprompt` event was fired.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);


    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
      clearInterval(interval);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [i18n, platformSettings, loggedInUser]);

  useEffect(() => {
    if (platformSettings.faviconUrl) {
      const faviconLink = document.getElementById('favicon-link') as HTMLLinkElement | null;
      if (faviconLink) {
        faviconLink.href = platformSettings.faviconUrl;
      }
    }
    document.documentElement.style.setProperty('--icon-color', platformSettings.iconColor);
  }, [platformSettings]);

  const switchView = (viewSetter: () => void) => {
    setIsLoading(true);
    setTimeout(() => {
      viewSetter();
      setIsLoading(false);
    }, 500);
  };

  const handleLanguageSelect = (languageCode: string) => {
    setIsLoading(true);
    i18n.changeLanguage(languageCode).finally(() => {
      setIsLoading(false);
    });
  };
  
  const handleAppInstall = async () => {
    if (!deferredInstallPrompt) {
      alert(t('appInstallPrompt'));
      return;
    }
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredInstallPrompt(null);
  };

  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  const handleLoginAttempt = (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);

    return new Promise((resolve) => {
        setTimeout(() => {
          if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && pass === ADMIN_PASSWORD) {
            setIsAdminAuthenticated(true);
            setIsLoading(false);
            resolve({ success: true });
          } else {
            const user = db.authenticateUser(email, pass);
            if (user) {
                if (user.status === 'banned') {
                    setIsLoading(false);
                    resolve({ success: false, message: t('accountBanned') });
                } else {
                    db.updateUser(user.id, { lastLogin: new Date().toISOString() });
                    setLoggedInUser(user);
                    setIsAuthenticated(true);
                    setIsLoading(false);
                    resolve({ success: true });
                }
            } else {
               setIsLoading(false);
               resolve({ success: false, message: t('invalidCredentials') });
            }
          }
        }, 1000);
    });
  };
  
  const handleSignOut = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLoggedInUser(null);
      setIsAuthenticated(false);
      setIsAdminAuthenticated(false);
      setIsLoading(false);
    }, 500);
  };

  if (isAdminAuthenticated) {
    return (
      <>
        {isLoading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
            <LoadingSpinner />
          </div>
        )}
        <AdminDashboard onSignOut={handleSignOut} />
      </>
    );
  }

  return (
    <div 
        className="min-h-screen text-white font-sans" 
        style={{ 
            backgroundImage: `linear-gradient(to bottom, ${platformSettings.primaryColor}, ${platformSettings.secondaryColor})`
        }}
    >
      <div className="w-full max-w-md mx-auto h-screen relative flex flex-col overflow-hidden shadow-2xl bg-transparent">
        
        {isLoading && (
          <div className="absolute inset-0 bg-[#1c0f3b] bg-opacity-80 flex items-center justify-center z-50">
            <LoadingSpinner />
          </div>
        )}
        
        {isAuthenticated && loggedInUser ? (
          <MainLayout
            user={loggedInUser}
            isLanguageSelectorOpen={isLanguageSelectorOpen}
            setIsLanguageSelectorOpen={setIsLanguageSelectorOpen}
            selectedLanguageCode={selectedLanguageCode}
            getLanguageName={getLanguageName}
            handleLanguageSelect={handleLanguageSelect}
            onSignOut={handleSignOut}
            platformSettings={platformSettings}
            onAppInstall={handleAppInstall}
            onUserUpdate={forceUserUpdate}
          />
        ) : (
           <div className="flex flex-col w-full h-full overflow-y-auto px-4 sm:px-6">
            <header className="w-full flex justify-between items-center pt-6 mb-8 flex-shrink-0">
              <button onClick={() => window.location.reload()} className="p-2 rounded-full bg-black bg-opacity-20 hover:bg-opacity-40 transition-colors" aria-label="Reset">
                <RefreshIcon className="w-6 h-6" />
              </button>
              <button onClick={() => setIsLanguageSelectorOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black bg-opacity-20 hover:bg-opacity-40 transition-colors text-sm" aria-label="Change Language">
                <GlobeIcon className="w-5 h-5" />
                <span>{getLanguageName(selectedLanguageCode)}</span>
              </button>
            </header>

            <div className="flex flex-col items-center flex-grow">
                <div className="flex items-center gap-4 self-start mb-8">
                  <div className="bg-blue-500 p-2 rounded-xl flex items-center justify-center w-14 h-14">
                     <div className='flex flex-col items-center'>
                        <img src={platformSettings.logoUrl} alt="logo" className="w-6 h-6" />
                        <span className="font-bold text-white text-sm leading-none mt-1">{platformSettings.name.toLowerCase()}</span>
                     </div>
                  </div>
                  <h1 className="text-2xl font-semibold text-start leading-tight">{t('welcomeTo', { platformName: platformSettings.name })}</h1>
                </div>

                <main style={{ backgroundColor: platformSettings.cardColor }} className="p-4 sm:p-6 rounded-2xl w-full max-w-sm">
                  {isRegistering ? (
                      <RegistrationForm onSwitchToLogin={() => switchView(() => setIsRegistering(false))} onRegistrationSuccess={handleLoginAttempt} initialInvitationCode={initialInvitationCode} />
                  ) : (
                      <LoginForm onSwitchToRegister={() => switchView(() => setIsRegistering(true))} onLoginAttempt={handleLoginAttempt}/>
                  )}
                </main>
            </div>
          </div>
        )}

        <LanguageSelector
          isOpen={isLanguageSelectorOpen}
          onClose={() => setIsLanguageSelectorOpen(false)}
          selectedLanguageCode={selectedLanguageCode}
          onSelectLanguage={handleLanguageSelect}
        />
      </div>
    </div>
  );
}

export default App;