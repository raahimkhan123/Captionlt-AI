import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { Screen, CaptionResult, User } from './types';
import { auth } from './services/firebase';
import * as firestoreService from './services/firestoreService';
import GeneratorScreen from './components/GeneratorScreen';
import HistoryScreen from './components/HistoryScreen';
import ProfileScreen from './components/ProfileScreen';
import BottomNav from './components/BottomNav';
import LoginScreen from './components/LoginScreen';
import Toast from './components/Toast';
import PricingScreen from './components/PricingScreen';
import { SparklesIcon } from './components/icons/ActionIcons';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Home);
  const [history, setHistory] = useState<CaptionResult[]>([]);
  const [currentResult, setCurrentResult] = useState<CaptionResult | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined for loading state
  const [toastMessage, setToastMessage] = useState<string>('');

  useEffect(() => {
    // If Firebase auth is not configured, set user to null and exit.
    if (!auth) {
      setUser(null);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userProfile = await firestoreService.getUserProfile(firebaseUser.uid);
        
        const appUser: User = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || userProfile?.name || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
        };

        setUser(appUser);
        
        const userHistory = await firestoreService.getUserHistory(firebaseUser.uid);
        setHistory(userHistory);

        setConnectedAccounts((userProfile?.connectedAccounts as string[]) || []);

      } else {
        setUser(null);
        setHistory([]);
        setConnectedAccounts([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
  };
  
  const handleSaveResult = async (resultToSave: CaptionResult) => {
    if (!user) return;
    if (history.some(item => item.historyId === resultToSave.historyId && item.historyId)) return;
    
    try {
      const newHistoryItem = await firestoreService.saveCaptionToHistory(user.uid, resultToSave);
      setHistory(prevHistory => [newHistoryItem, ...prevHistory]);
      setCurrentResult(newHistoryItem); // Update current result with the one that has an ID
      showToast("Caption saved successfully!");
    } catch (error) {
      console.error("Error saving caption: ", error);
      showToast("Could not save caption.");
    }
  };

  const handleDeleteHistoryItem = async (historyId: string) => {
    if (!user || !historyId) return;
    try {
      await firestoreService.deleteHistoryItem(user.uid, historyId);
      setHistory(prevHistory => prevHistory.filter(item => item.historyId !== historyId));
      showToast("Saved caption deleted.");
    } catch (error) {
      console.error("Error deleting history item: ", error);
      showToast("Could not delete caption.");
    }
  };

  const handleToggleIntegration = async (platformName: string) => {
    if (!user) return;
    const isConnecting = !connectedAccounts.includes(platformName);
    const newAccounts = isConnecting
      ? [...connectedAccounts, platformName]
      : connectedAccounts.filter(p => p !== platformName);

    try {
      await firestoreService.updateUserIntegrations(user.uid, newAccounts);
      setConnectedAccounts(newAccounts);
      showToast(isConnecting ? `${platformName} connected successfully` : `${platformName} integration removed`);
    } catch (error) {
      console.error("Error updating integrations: ", error);
      showToast("Could not update integrations.");
    }
  };
  
  const handleLogout = async () => {
    if (!auth) {
        // Handle logout in offline/unconfigured mode
        setUser(null);
        setActiveScreen(Screen.Home);
        return;
    }
    try {
      await signOut(auth);
      setActiveScreen(Screen.Home); // Reset to home screen on logout
    } catch (error) {
      console.error("Logout failed: ", error);
      showToast("Logout failed. Please try again.");
    }
  };
  
  const handleSignUpRedirect = () => {
     setUser(null);
     setActiveScreen(Screen.Home); // Go back to the login screen.
  };
  
  if (user === undefined) {
    return (
      <div className="min-h-screen w-full bg-[#121212] text-white flex flex-col items-center justify-center">
        <div className="absolute inset-0 animated-gradient opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center gap-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF00EE] to-[#00FFFF] flex items-center justify-center gap-2">
                <SparklesIcon /> Captionly AI
            </h1>
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen showToast={showToast} />;
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
                isGuest={!user}
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