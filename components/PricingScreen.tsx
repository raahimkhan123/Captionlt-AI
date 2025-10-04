import React, { useState } from 'react';
import { CheckIcon, StarIcon } from './icons/ActionIcons';

interface PricingScreenProps {
    onSignUp: () => void;
    isGuest: boolean;
    showToast: (message: string) => void;
}

const PricingScreen: React.FC<PricingScreenProps> = ({ onSignUp, isGuest, showToast }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const handleUpgrade = () => {
        if (isGuest) {
            onSignUp();
        } else {
            showToast("Payment processing is coming soon!");
        }
    };
    
    const handleContactSales = () => {
        showToast("Sales contact form is coming soon!");
    };

    return (
        <div className="flex flex-col gap-8 pt-8 animate-fade-in text-white">
            <header className="text-center px-4">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF00EE] to-[#00FFFF]">
                    Unlock Your Full Potential
                </h1>
                <p className="text-gray-400 mt-2 max-w-md mx-auto">
                    Choose the plan that's right for you and take your social media content to the next level.
                </p>
            </header>

            {/* Billing Cycle Toggle */}
            <div className="flex justify-center items-center gap-4">
                <span className={`font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
                <label htmlFor="billing-toggle" className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        id="billing-toggle" 
                        className="sr-only peer"
                        checked={billingCycle === 'yearly'}
                        onChange={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')} 
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00FFFF]"></div>
                </label>
                <span className={`font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
                    Yearly <span className="text-xs text-green-400 font-bold">(Save 20%)</span>
                </span>
            </div>

            {/* Pricing Cards */}
            <div className="flex flex-col items-center gap-8 px-2">
                {/* Free Plan */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col w-full max-w-sm animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h3 className="text-xl font-semibold">Starter</h3>
                    <p className="text-gray-400 mt-1">For casual users and trying out the platform.</p>
                    <p className="my-6">
                        <span className="text-5xl font-bold">$0</span>
                        <span className="text-gray-400">/ month</span>
                    </p>
                    <ul className="space-y-3 text-gray-300 flex-grow">
                        <li className="flex items-center gap-3"><CheckIcon /> 5 AI Generations per Day</li>
                        <li className="flex items-center gap-3"><CheckIcon /> Access to Standard Tones</li>
                        <li className="flex items-center gap-3"><CheckIcon /> All Social Media Platforms</li>
                        <li className="flex items-center gap-3"><CheckIcon /> Save & Review Past Generations</li>
                    </ul>
                    <button disabled className="w-full mt-8 font-bold py-3 px-6 rounded-2xl text-white bg-white/10 cursor-not-allowed">
                        Your Current Plan
                    </button>
                </div>
                
                {/* Pro Plan - Most Popular */}
                <div className="relative bg-white/5 border-2 border-[#FF00EE] rounded-3xl p-6 flex flex-col shadow-lg shadow-[#FF00EE]/20 w-full max-w-sm transform scale-105 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF00EE] to-[#F0B3FF] text-white text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                    </div>
                    <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FF00EE] to-[#00FFFF]">Pro</h3>
                    <p className="text-gray-400 mt-1">For creators, marketers, and power users.</p>
                    <p className="my-6">
                        <span className="text-5xl font-bold">{billingCycle === 'monthly' ? '$9' : '$7.20'}</span>
                        <span className="text-gray-400">/ month</span>
                        {billingCycle === 'yearly' && <p className="text-sm text-gray-400 mt-1">Billed as $86.40 per year</p>}
                    </p>
                    <ul className="space-y-3 text-gray-300 flex-grow">
                        <li className="flex items-center gap-3"><StarIcon /> Unlimited AI Generations</li>
                        <li className="flex items-center gap-3"><StarIcon /> Access to All 20+ Content Tones</li>
                        <li className="flex items-center gap-3"><StarIcon /> Advanced Analytics & Insights (Soon)</li>
                        <li className="flex items-center gap-3"><StarIcon /> Priority Customer Support</li>
                    </ul>
                    <button onClick={handleUpgrade} className="w-full mt-8 font-bold py-3 px-6 rounded-2xl bg-gradient-to-r from-[#FF00EE] to-[#F0B3FF] text-white transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-[#FF00EE]/30 active:scale-95">
                        {isGuest ? 'Sign Up to Upgrade' : 'Upgrade to Pro'}
                    </button>
                </div>

                {/* Business Plan */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col w-full max-w-sm animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <h3 className="text-xl font-semibold">Business</h3>
                    <p className="text-gray-400 mt-1">For agencies, teams, and enterprises.</p>
                    <p className="my-6">
                        <span className="text-5xl font-bold">Let's Talk</span>
                    </p>
                    <ul className="space-y-3 text-gray-300 flex-grow">
                        <li className="flex items-center gap-3"><StarIcon /> Everything in Pro, plus:</li>
                        <li className="flex items-center gap-3"><StarIcon /> Multi-User & Team Collaboration</li>
                        <li className="flex items-center gap-3"><StarIcon /> Full API Access for Custom Workflows</li>
                        <li className="flex items-center gap-3"><StarIcon /> Dedicated Onboarding Manager</li>
                    </ul>
                    <button onClick={handleContactSales} className="w-full mt-8 font-bold py-3 px-6 rounded-2xl text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all">
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PricingScreen;