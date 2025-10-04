import React from 'react';
import { User } from '../types';
import { CheckCircleIcon, LogoutIcon } from './icons/ActionIcons';
import { 
    InstagramIcon, 
    TikTokIcon, 
    LinkedInIcon, 
    XIcon, 
    FacebookIcon, 
    ThreadsIcon, 
    YouTubeIcon, 
    PinterestIcon
} from './icons/FeatureIcons';

const integrations = [
    { name: 'Instagram', icon: <InstagramIcon /> },
    { name: 'TikTok', icon: <TikTokIcon /> },
    { name: 'LinkedIn', icon: <LinkedInIcon /> },
    { name: 'Twitter', icon: <XIcon /> },
    { name: 'Facebook', icon: <FacebookIcon /> },
    { name: 'Threads', icon: <ThreadsIcon /> },
    { name: 'YouTube', icon: <YouTubeIcon /> },
    { name: 'Pinterest', icon: <PinterestIcon /> },
];

interface ProfileScreenProps {
    user: User | null;
    connectedAccounts: string[];
    onToggleIntegration: (platformName: string) => void;
    onLogout: () => void;
    onSignUp: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, connectedAccounts, onToggleIntegration, onLogout }) => {

    if (!user) {
        // This should theoretically not be reached if routing is handled in App.tsx
        // but it's a good fallback.
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                 <h1 className="text-2xl font-bold text-white mb-4">Profile</h1>
                 <p className="text-gray-400">Please log in to view your profile.</p>
            </div>
        )
    }

  return (
    <div className="flex flex-col items-center h-full text-center p-4 sm:p-8 animate-fade-in pt-12">
       <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF00EE] to-[#00FFFF] mb-4 flex items-center justify-center ring-4 ring-white/10">
         <img src={user.avatar} alt="User Avatar" className="w-22 h-22 rounded-full border-2 border-[#121212]"/>
       </div>
       <h2 className="text-2xl font-semibold">{user.name}</h2>
       <p className="text-gray-400">{user.email}</p>
      
       <div className="mt-10 w-full max-w-md">
           <h3 className="text-lg font-semibold text-gray-300 mb-4">
               Manage Account Integrations
           </h3>
           <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg p-4 text-center space-y-3">
               <p className="text-gray-400 text-sm">
                   Connect your accounts to streamline your workflow in the future.
               </p>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                   {integrations.map((integration) => {
                       const isConnected = connectedAccounts.includes(integration.name);
                       return (
                           <button 
                               key={integration.name} 
                               onClick={() => onToggleIntegration(integration.name)}
                               className={`p-3 bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 ${isConnected ? 'ring-2 ring-[#00FFFF]' : 'opacity-60 hover:opacity-100'} active:scale-95`}
                               aria-pressed={isConnected}
                           >
                               <div className="w-8 h-8 flex items-center justify-center">
                                   {integration.icon}
                               </div>
                               <span className="text-xs font-semibold">{integration.name}</span>
                               <div className="flex items-center gap-1 text-xs">
                                   {isConnected ? (
                                       <>
                                           <CheckCircleIcon />
                                           <span className="text-green-400">Connected</span>
                                       </>
                                   ) : (
                                       <span className="text-gray-400">Connect</span>
                                   )}
                               </div>
                           </button>
                       )
                   })}
               </div>
           </div>
       </div>

       <button onClick={onLogout} className="mt-8 flex items-center gap-2 text-gray-400 hover:text-white transition-all py-2 px-4 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 active:bg-black/20">
           <LogoutIcon />
           Sign Out
       </button>
    </div>
  );
};

export default ProfileScreen;