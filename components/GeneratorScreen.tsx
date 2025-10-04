import React, { useState } from 'react';
import { generateCaptions } from '../services/geminiService';
import { CaptionResult } from '../types';
import ResultCard from './ResultCard';
import CustomSelect, { SelectOption } from './CustomSelect';
import { SparklesIcon, CloseIcon } from './icons/ActionIcons';
import { 
    InstagramIcon, TikTokIcon, LinkedInIcon, XIcon, FacebookIcon, ThreadsIcon, YouTubeIcon, PinterestIcon,
    CasualIcon, FormalIcon, HumorousIcon, InspirationalIcon, ProfessionalIcon, WittyIcon, SarcasticIcon, EnthusiasticIcon, PoeticIcon, MysteriousIcon, UrgentIcon
} from './icons/FeatureIcons';

// Moved the wrapper outside the main component to prevent re-creation on every render,
// which fixes the input focus loss and keyboard dismissal issue.
const GlassmorphicInputWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl backdrop-blur-lg p-1 transition-colors ${className}`}>
        {children}
    </div>
);

const tones: SelectOption[] = [
    { value: "Casual", icon: <CasualIcon /> },
    { value: "Formal", icon: <FormalIcon /> },
    { value: "Humorous", icon: <HumorousIcon /> },
    { value: "Inspirational", icon: <InspirationalIcon /> },
    { value: "Professional", icon: <ProfessionalIcon /> },
    { value: "Witty", icon: <WittyIcon /> },
    { value: "Sarcastic", icon: <SarcasticIcon /> },
    { value: "Enthusiastic", icon: <EnthusiasticIcon /> },
    { value: "Poetic", icon: <PoeticIcon /> },
    { value: "Mysterious", icon: <MysteriousIcon /> },
    { value: "Urgent", icon: <UrgentIcon /> }
];

const platforms: SelectOption[] = [
    { value: "Instagram", icon: <InstagramIcon /> },
    { value: "TikTok", icon: <TikTokIcon /> },
    { value: "LinkedIn", icon: <LinkedInIcon /> },
    { value: "Twitter (X)", icon: <XIcon /> },
    { value: "Facebook", icon: <FacebookIcon /> },
    { value: "Threads", icon: <ThreadsIcon /> },
    { value: "YouTube", icon: <YouTubeIcon /> },
    { value: "Pinterest", icon: <PinterestIcon /> },
];

interface GeneratorScreenProps {
  onSave: (result: CaptionResult) => void;
  history: CaptionResult[];
  result: CaptionResult | null;
  setResult: (result: CaptionResult | null) => void;
}

const GeneratorScreen: React.FC<GeneratorScreenProps> = ({ onSave, history, result, setResult }) => {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState(tones[0].value);
    const [platform, setPlatform] = useState(platforms[0].value);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const MAX_TOPIC_LENGTH = 1000;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Clear previous errors first

        if (!topic.trim()) {
            setError('Please provide a topic. It cannot be empty or contain only spaces.');
            return;
        }
        if (topic.length > MAX_TOPIC_LENGTH) {
            setError(`Topic cannot exceed ${MAX_TOPIC_LENGTH} characters.`);
            return;
        }
        if (!tone) {
            setError('Please select a tone for your captions.');
            return;
        }
        if (!platform) {
            setError('Please select a platform for your captions.');
            return;
        }
        
        setLoading(true);
        setResult(null);

        try {
            const generatedData = await generateCaptions(topic, tone, platform);
            const fullResult: CaptionResult = {
                ...generatedData,
                inputDetails: { topic, tone, platform }
            };
            setResult(fullResult);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 pt-8 animate-fade-in">
            <header className="text-center">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF00EE] to-[#00FFFF]">
                    Captionly AI
                </h1>
                <p className="text-gray-400 mt-2">What's your topic today?</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <GlassmorphicInputWrapper>
                    <div className="relative">
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Launching a new line of eco-friendly skincare products..."
                            className="w-full h-28 bg-transparent p-4 pb-8 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF00EE]/50 resize-none"
                            aria-invalid={!!error && (error.includes('topic') || error.includes('character'))}
                            aria-describedby="topic-error"
                            maxLength={MAX_TOPIC_LENGTH}
                        />
                        {topic && (
                            <button
                                type="button"
                                onClick={() => setTopic('')}
                                className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                                aria-label="Clear topic"
                            >
                                <CloseIcon />
                            </button>
                        )}
                        <div className={`absolute bottom-3 right-4 text-xs ${topic.length > MAX_TOPIC_LENGTH ? 'text-red-400' : 'text-gray-400'}`}>
                            {topic.length}/{MAX_TOPIC_LENGTH}
                        </div>
                    </div>
                </GlassmorphicInputWrapper>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomSelect
                        className="select-wrapper"
                        options={tones}
                        value={tone}
                        onChange={setTone}
                        ariaLabel="Select a tone"
                    />
                    <CustomSelect
                        className="select-wrapper"
                        options={platforms}
                        value={platform}
                        onChange={setPlatform}
                        ariaLabel="Select a platform"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 font-bold py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF00EE] to-[#F0B3FF] text-white transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-[#FF00EE]/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <SparklesIcon /> Generate
                        </>
                    )}
                </button>
            </form>

            {error && <p id="topic-error" className="text-center text-[#FF4D4D]" role="alert">{error}</p>}

            {result && (
                <div className="mt-6">
                    <ResultCard
                      result={result}
                      onSave={onSave}
                      isSaved={history.some(item => item.historyId === result.historyId)}
                      onClear={() => setResult(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default GeneratorScreen;