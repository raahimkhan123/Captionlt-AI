import React, { useState } from 'react';
import { GoogleIcon } from './icons/BrandIcons';
import { SparklesIcon } from './icons/ActionIcons';

interface LoginScreenProps {
    onLogin: () => void;
    onGuest: () => void;
    showToast: (message: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGuest, showToast }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        // Simulate a successful login with specific credentials
        if (email === 'alex.j@example.com' && password === 'password123') {
            onLogin();
        } else {
            setError("Invalid credentials. Please try again.");
        }
    };

    const handleForgotPassword = () => {
        showToast("Password reset feature is coming soon!");
    };

    return (
        <div className="min-h-screen w-full bg-[#121212] text-white flex flex-col items-center justify-center p-4">
            <div className="absolute inset-0 animated-gradient opacity-20"></div>
            <div className="relative z-10 w-full max-w-sm text-center">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF00EE] to-[#00FFFF] flex items-center justify-center gap-2">
                        <SparklesIcon /> Captionly AI
                    </h1>
                    <p className="text-gray-400 mt-2">Your AI-powered social media assistant.</p>
                </header>

                <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg hover:bg-white/10 transition-colors">
                         <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full bg-transparent p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF00EE]/50"
                            aria-label="Email Address"
                        />
                    </div>
                     <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg hover:bg-white/10 transition-colors">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-transparent p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF00EE]/50"
                            aria-label="Password"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-400 text-left px-2" role="alert">
                            {error}
                        </p>
                    )}
                    
                    <button
                        type="submit"
                        className="w-full font-bold py-3 px-6 rounded-2xl bg-gradient-to-r from-[#FF00EE] to-[#F0B3FF] text-white transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-[#FF00EE]/30 active:scale-95"
                    >
                        Sign In
                    </button>
                </form>

                <div className="text-right mt-2">
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Forgot Password?
                    </button>
                </div>


                <div className="flex items-center my-6">
                    <hr className="flex-grow border-white/10" />
                    <span className="px-4 text-gray-400 text-sm">OR</span>
                    <hr className="flex-grow border-white/10" />
                </div>


                <div className="space-y-4">
                    <button
                        onClick={onLogin}
                        className="w-full flex items-center justify-center gap-3 font-semibold py-3 px-6 rounded-2xl bg-white text-black transition-all duration-300 ease-in-out hover:bg-gray-200 active:scale-95"
                    >
                        <GoogleIcon />
                        Sign in with Google
                    </button>
                    <button
                        onClick={onGuest}
                        className="w-full font-semibold py-3 px-6 rounded-2xl text-white bg-white/10 hover:bg-white/20 active:bg-white/5 active:scale-95 transition-all"
                    >
                        Continue as Guest
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-8">
                    By signing in, you agree to our terms of service (coming soon).
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;