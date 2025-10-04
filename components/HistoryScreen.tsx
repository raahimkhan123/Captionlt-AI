import React, { useState, useMemo } from 'react';
import { CaptionResult } from '../types';
import CustomSelect, { SelectOption } from './CustomSelect';
import { TrashIcon, CopyIcon, CheckIcon, SearchIcon, CloseIcon, FilterIcon } from './icons/ActionIcons';

interface HistoryScreenProps {
  history: CaptionResult[];
  onDelete: (historyId: string) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onDelete }) => {
  const [copiedHashtagsId, setCopiedHashtagsId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toneFilter, setToneFilter] = useState('All Tones');
  const [platformFilter, setPlatformFilter] = useState('All Platforms');

  const toneOptions = useMemo((): SelectOption[] => [
      { value: 'All Tones', icon: <FilterIcon /> },
      ...Array.from(new Set(history.map(item => item.inputDetails.tone)))
          .sort()
          // Fix: Explicitly type 'tone' as string to resolve TypeScript inference issue.
          .map((tone: string) => ({ value: tone, icon: <FilterIcon /> }))
  ], [history]);

  const platformOptions = useMemo((): SelectOption[] => [
      { value: 'All Platforms', icon: <FilterIcon /> },
      ...Array.from(new Set(history.map(item => item.inputDetails.platform)))
          .sort()
          // Fix: Explicitly type 'platform' as string to resolve TypeScript inference issue.
          .map((platform: string) => ({ value: platform, icon: <FilterIcon /> }))
  ], [history]);

  const filteredHistory = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return history.filter(item => {
        const matchesSearch = !query ||
            item.inputDetails.topic.toLowerCase().includes(query) ||
            item.inputDetails.tone.toLowerCase().includes(query) ||
            item.inputDetails.platform.toLowerCase().includes(query);

        const matchesTone = toneFilter === 'All Tones' || item.inputDetails.tone === toneFilter;
        const matchesPlatform = platformFilter === 'All Platforms' || item.inputDetails.platform === platformFilter;

        return matchesSearch && matchesTone && matchesPlatform;
    });
  }, [history, searchQuery, toneFilter, platformFilter]);


  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h1 className="text-3xl font-bold text-white mb-4">My Saved Captions</h1>
        <p className="text-gray-400">
          You haven't saved any captions yet. Go to the Home screen to generate and save your favorites!
        </p>
      </div>
    );
  }

  const handleCopyHashtags = (historyId: string, hashtags: string[]) => {
    navigator.clipboard.writeText(hashtags.join(' '));
    setCopiedHashtagsId(historyId);
    setTimeout(() => {
      setCopiedHashtagsId(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 pt-8 animate-fade-in">
      <header className="text-center mb-2">
        <h1 className="text-3xl font-bold text-white">My Saved Captions</h1>
      </header>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <SearchIcon />
        </div>
        <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, tone, or platform..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg p-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#FF00EE]/50 transition-colors"
            aria-label="Search saved captions"
        />
        {searchQuery && (
            <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                aria-label="Clear search"
            >
                <CloseIcon />
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelect
            className="select-wrapper"
            options={toneOptions}
            value={toneFilter}
            onChange={setToneFilter}
            ariaLabel="Filter by tone"
        />
        <CustomSelect
            className="select-wrapper"
            options={platformOptions}
            value={platformFilter}
            onChange={setPlatformFilter}
            ariaLabel="Filter by platform"
        />
      </div>

      {filteredHistory.length > 0 ? (
        <div className="space-y-6">
          {filteredHistory.map((item) => (
            <div key={item.historyId} className="relative bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-6 shadow-lg animate-fade-in-up space-y-4">
              {/* Input Details Header - More prominent */}
              <div className="pr-10">
                  <blockquote className="border-l-4 border-[#FF00EE] pl-4">
                      <p className="text-lg italic text-white/90">"{item.inputDetails.topic}"</p>
                  </blockquote>
                  <div className="flex items-center gap-4 mt-3 pl-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">TONE: <span className="text-white capitalize font-bold">{item.inputDetails.tone}</span></span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">PLATFORM: <span className="text-white capitalize font-bold">{item.inputDetails.platform}</span></span>
                  </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => onDelete(item.historyId)}
                className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400 active:scale-90 active:bg-red-500/10 transition-all"
                aria-label="Delete saved item"
              >
                <TrashIcon />
              </button>


              {/* Content Divider */}
              <div className="border-b border-white/10"></div>

              {/* Captions */}
              <div className="space-y-4">
                {item.captions.map((caption, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-[#FF00EE] font-mono text-sm pt-1">{index + 1}.</span>
                    <p className="text-white/90 leading-relaxed flex-1">
                      {caption}
                    </p>
                  </div>
                ))}
              </div>

              {/* Hashtags */}
              {item.hashtags.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {item.hashtags.map(tag => (
                      <span key={tag} className="text-xs bg-[#00FFFF]/10 text-[#00FFFF] px-2 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                      <button
                          onClick={() => handleCopyHashtags(item.historyId, item.hashtags)}
                          className="flex items-center gap-2 py-2 px-4 rounded-full text-white bg-white/10 hover:bg-white/20 active:scale-95 active:bg-white/5 transition-all text-sm"
                          aria-label="Copy hashtags"
                      >
                         {copiedHashtagsId === item.historyId ? <CheckIcon /> : <CopyIcon />}
                         <span>{copiedHashtagsId === item.historyId ? 'Copied!' : 'Copy Hashtags'}</span>
                      </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
         <div className="text-center text-gray-400 py-16">
            <p className="font-semibold text-lg">No Captions Found</p>
            <p className="text-sm mt-2">
                Try adjusting your search or filter criteria.
            </p>
        </div>
      )}
    </div>
  );
};

export default HistoryScreen;