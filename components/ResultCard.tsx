import React, { useState, useEffect } from 'react';
import { CaptionResult } from '../types';
import { useTypewriter } from '../hooks/useTypewriter';
import { CopyIcon, CheckIcon, ShareAltIcon, SaveIcon, TrashIcon } from './icons/ActionIcons';
import Confetti from './Confetti';

interface ResultCardProps {
  result: CaptionResult;
  onSave: (resultToSave: CaptionResult) => void;
  isSaved: boolean;
  onClear: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onSave, isSaved, onClear }) => {
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFirstCopy, setIsFirstCopy] = useState(true);

  const displayedCaptions = result.captions.map(caption => useTypewriter(caption, 20));
  const displayedHashtags = useTypewriter(result.hashtags.join(' '), 30);

  // Reset confetti trigger when a new result is generated (historyId will be undefined)
  useEffect(() => {
    setIsFirstCopy(true);
  }, [result.historyId]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));

    if (isFirstCopy) {
      setShowConfetti(true);
      setIsFirstCopy(false);
      setTimeout(() => setShowConfetti(false), 4000);
    }

    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleShare = async (caption: string) => {
    const shareText = `${caption}\n\n${result.hashtags.join(' ')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Caption by Captionly AI`,
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Sharing is not supported on this browser. Please copy the content manually.');
    }
  };

  const handleSave = () => {
    onSave(result);
  };

  return (
    <div className="relative bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-6 shadow-2xl shadow-black/20 animate-fade-in-up">
      {showConfetti && <Confetti />}

      <button
        onClick={onClear}
        className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white active:scale-90 active:bg-white/5 transition-all"
        aria-label="Clear result"
      >
        <TrashIcon />
      </button>

      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-400 pr-8">
            Based on '{result.inputDetails.topic.slice(0, 20)}...', '{result.inputDetails.tone}', '{result.inputDetails.platform}'
          </p>
        </div>

        {displayedCaptions.map((caption, i) => (
          <div key={i} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start gap-2">
              <p className="flex-grow text-white/90 leading-relaxed">{caption}</p>
              <div className="flex flex-col sm:flex-row gap-1">
                <button
                  onClick={() => handleCopy(result.captions[i], `caption-${i}`)}
                  className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white active:scale-90 active:bg-white/5 transition-all"
                  aria-label="Copy caption"
                >
                  {copiedStates[`caption-${i}`] ? <CheckIcon /> : <CopyIcon />}
                </button>
                 <button
                  onClick={() => handleShare(result.captions[i])}
                  className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white active:scale-90 active:bg-white/5 transition-all"
                  aria-label="Share caption"
                >
                  <ShareAltIcon />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div>
            <div className="flex justify-between items-start">
                <p className="text-[#FF00EE] font-semibold break-words flex-grow">{displayedHashtags}</p>
                <button
                    onClick={() => handleCopy(result.hashtags.join(' '), 'hashtags')}
                    className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white active:scale-90 active:bg-white/5 transition-all"
                    aria-label="Copy hashtags"
                >
                    {copiedStates['hashtags'] ? <CheckIcon /> : <CopyIcon />}
                </button>
            </div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-white/10 flex justify-end gap-2">
         <button
          onClick={handleSave}
          disabled={isSaved}
          className="flex items-center gap-2 py-2 px-4 rounded-full text-white bg-white/10 hover:bg-white/20 active:scale-95 active:bg-white/5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Save result"
        >
          {isSaved ? <CheckIcon /> : <SaveIcon />}
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
};

export default ResultCard;