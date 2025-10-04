
import React, { useState, useEffect } from 'react';
import { Screen, CaptionResult, User } from './types';
import GeneratorScreen from './components/GeneratorScreen';
import HistoryScreen from './components/HistoryScreen';
import ProfileScreen from './components/ProfileScreen';
import BottomNav from './components/BottomNav';
import LoginScreen from './components/LoginScreen';
import Toast from './components/Toast';
import PricingScreen from './components/PricingScreen';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Home);
  const [history, setHistory] = useState<CaptionResult[]>([]);
  const [currentResult, setCurrentResult] = useState<CaptionResult | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Load state from localStorage on initial mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('captionlyHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedAccounts = localStorage.getItem('connectedAccounts');
    if (savedAccounts) setConnectedAccounts(JSON.parse(savedAccounts));

    const savedUser = localStorage.getItem('captionlyUser');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
    } else {
        const guestStatus = localStorage.getItem('isGuest');
        if (guestStatus) setIsGuest(true);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('captionlyHistory', JSON.stringify(history));
  }, [history]);

  // Save connected accounts to localStorage whenever it changes
  useEffect(() => {
    // Only save for logged-in users, not guests
    if (user) {
        localStorage.setItem('connectedAccounts', JSON.stringify(connectedAccounts));
    }
  }, [connectedAccounts, user]);
  
  const showToast = (message: string) => {
    setToastMessage(message);
  };
  
  const handleSaveResult = (resultToSave: CaptionResult) => {
    // Prevent duplicates by checking historyId
    if (!history.some(item => item.historyId === resultToSave.historyId)) {
        setHistory(prevHistory => [resultToSave, ...prevHistory]);
    }
  };

  const handleDeleteHistoryItem = (historyId: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.historyId !== historyId));
  };

  const handleToggleIntegration = (platformName: string) => {
    const isConnecting = !connectedAccounts.includes(platformName);
    setConnectedAccounts(prev => 
      isConnecting
        ? [...prev, platformName] 
        : prev.filter(p => p !== platformName)
    );
    showToast(isConnecting ? `${platformName} connected successfully` : `${platformName} integration removed`);
  };
  
  const handleLogin = () => {
    // This is a simulated login. In a real app, this would involve an OAuth flow.
    const mockUser: User = {
        name: 'Alex Johnson',
        email: 'alex.j@example.com',
        avatar: `https://i.pravatar.cc/150?u=alexjohnson`
    };
    setUser(mockUser);
    setIsGuest(false);
    localStorage.setItem('captionlyUser', JSON.stringify(mockUser));
    localStorage.removeItem('isGuest');
  };

  const handleGuest = () => {
    setIsGuest(true);
    localStorage.setItem('isGuest', 'true');
  };

  const handleLogout = () => {
    setUser(null);
    setIsGuest(false);
    setConnectedAccounts([]); // Clear integrations on logout
    localStorage.removeItem('captionlyUser');
    localStorage.removeItem('connectedAccounts');
    localStorage.removeItem('isGuest');
  };
  
  const handleSignUpRedirect = () => {
    // This function logs the guest out and shows the login screen again
    handleLogout();
  };

  if (!user && !isGuest) {
    return <LoginScreen onLogin={handleLogin} onGuest={handleGuest} showToast={showToast} />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case Screen.Home:
        return (
            <GeneratorScreen 
                onSave={handleSaveResult} 
                history={history}
                result={currentResult}
                setResult={setCurrentResult}
            />
        );
      case Screen.History:
        return <HistoryScreen history={history} onDelete={handleDeleteHistoryItem} />;
      case Screen.Pricing:
        return (
            <PricingScreen
                onSignUp={handleSignUpRedirect}
                isGuest={isGuest || !user}
                showToast={showToast}
            />
        );
      case Screen.Profile:
        return (
            <ProfileScreen 
                user={user}
                connectedAccounts={connectedAccounts}
                onToggleIntegration={handleToggleIntegration}
                onLogout={handleLogout}
                onSignUp={handleSignUpRedirect}
            />
        );
      default:
        return (
            <GeneratorScreen 
                onSave={handleSaveResult} 
                history={history}
                result={currentResult}
                setResult={setCurrentResult}
            />
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#121212] text-white overflow-hidden relative">
      <div className="absolute inset-0 animated-gradient opacity-20"></div>
      <main className="relative z-10 flex flex-col h-screen p-4 sm:p-6 md:p-8 max-w-lg mx-auto">
        <div className="flex-grow overflow-y-auto pb-24 no-scrollbar">
          {renderScreen()}
        </div>
        <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      </main>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
};

export default App;
