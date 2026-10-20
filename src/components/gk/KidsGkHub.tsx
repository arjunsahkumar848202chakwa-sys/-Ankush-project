import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Award, 
  BookOpen, 
  Zap, 
  ShieldCheck, 
  RotateCcw, 
  Flame,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Language, GkQuestion } from '../../types';
import { ALL_1000_GK } from '../../data/kidsGkData';
import { sound } from '../../utils/audio';
import { RewardModal } from '../RewardModal';
import { GkReelsPlayer } from './GkReelsPlayer';

interface KidsGkHubProps {
  lang: Language;
  onAddStars: (n: number) => void;
  onBack: () => void;
}

export const KidsGkHub: React.FC<KidsGkHubProps> = ({ lang, onAddStars, onBack }) => {
  const [activeTab, setActiveTab] = useState<'reels' | 'quiz' | 'library'>('reels');

  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState(() => {
    const saved = localStorage.getItem('lgw_gk_qindex');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [showHintText, setShowHintText] = useState(false);
  const [showReward, setShowReward] = useState(false);

  // Library / Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Persist current question
  useEffect(() => {
    localStorage.setItem('lgw_gk_qindex', String(currentQIndex));
  }, [currentQIndex]);

  const currentQ = ALL_1000_GK[currentQIndex] || ALL_1000_GK[0];

  // Shuffled options for current question
  const [shuffledOptions, setShuffledOptions] = useState<{ textHi: string; textEn: string; origIndex: number }[]>([]);

  useEffect(() => {
    if (!currentQ) return;
    const opts = currentQ.optionsHi.map((hi, i) => ({
      textHi: hi,
      textEn: currentQ.optionsEn[i] || hi,
      origIndex: i,
    }));
    // deterministic shuffle based on question id
    const seed = currentQ.id;
    opts.sort((a, b) => ((a.origIndex * 17 + seed) % 5) - ((b.origIndex * 17 + seed) % 5));
    setShuffledOptions(opts);
    setSelectedOpt(null);
    setIsAnswered(false);
    setHiddenOptions([]);
    setUsedFiftyFifty(false);
    setUsedHint(false);
    setShowHintText(false);

    // Speak question aloud
    const qText = lang === 'hi' ? currentQ.questionHi : currentQ.questionEn;
    sound.speak(qText, lang);
  }, [currentQIndex, lang, currentQ]);

  // Answer handling
  const handleSelectAnswer = (idx: number) => {
    if (isAnswered) return;
    const picked = shuffledOptions[idx];
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = picked.origIndex === currentQ.correctIndex;

    if (isCorrect) {
      sound.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      const earned = newStreak >= 3 ? 5 : 3;
      onAddStars(earned);

      // Check for level milestones (every 5 questions)
      if ((currentQIndex + 1) % 5 === 0) {
        setTimeout(() => setShowReward(true), 1300);
      } else {
        setTimeout(() => {
          if (currentQIndex + 1 < ALL_1000_GK.length) {
            setCurrentQIndex(prev => prev + 1);
          }
        }, 1400);
      }
    } else {
      sound.playTryAgain();
      setStreak(0);
      const hint = lang === 'hi' 
        ? `गलत उत्तर! सही उत्तर था: ${currentQ.optionsHi[currentQ.correctIndex]}` 
        : `Oops! The correct answer was: ${currentQ.optionsEn[currentQ.correctIndex]}`;
      sound.speak(hint, lang);
    }
  };

  // 50-50 Lifeline
  const handleFiftyFifty = () => {
    if (usedFiftyFifty || isAnswered) return;
    sound.playPop();
    setUsedFiftyFifty(true);

    // Find 2 wrong options to hide
    const wrongIndices = shuffledOptions
      .map((opt, i) => ({ i, isWrong: opt.origIndex !== currentQ.correctIndex }))
      .filter(x => x.isWrong)
      .slice(0, 2)
      .map(x => x.i);

    setHiddenOptions(wrongIndices);
    const speech = lang === 'hi' ? '50-50 लाइफलाइन! 2 गलत उत्तर हटा दिए गए।' : '50-50 Lifeline! Two wrong answers removed.';
    sound.speak(speech, lang);
  };

  // Hint Lifeline
  const handleUseHint = () => {
    if (usedHint || isAnswered) return;
    sound.playPop();
    setUsedHint(true);
    setShowHintText(true);
    const hintMsg = lang === 'hi' ? currentQ.funFactHi : currentQ.funFactEn;
    sound.speak(hintMsg, lang);
  };

  const speakCurrent = () => {
    const qText = lang === 'hi' ? currentQ.questionHi : currentQ.questionEn;
    sound.speak(qText, lang);
  };

  // Library filtered items
  const filteredLibrary = useMemo(() => {
    return ALL_1000_GK.filter(q => {
      const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
      const qText = (q.questionHi + ' ' + q.questionEn + ' ' + q.optionsHi.join(' ')).toLowerCase();
      const matchesSearch = !searchQuery.trim() || qText.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredLibrary.length / itemsPerPage);
  const currentLibraryItems = filteredLibrary.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button
          onClick={() => {
            sound.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-amber-300 font-bold text-amber-900 shadow-sm hover:bg-amber-50 active:scale-95 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        {/* Tab switch between GK Reels, Quiz & 2000 GK Library */}
        <div className="flex bg-amber-100 p-1 rounded-2xl border-2 border-amber-300 shadow-sm flex-wrap gap-1">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('reels');
            }}
            className={`flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'reels'
                ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-200/50'
            }`}
          >
            <span>🔥</span>
            <span>{lang === 'hi' ? '2000 GK रील्स (Shorts)' : 'GK Video Reels'}</span>
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('quiz');
            }}
            className={`flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-200/50'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{lang === 'hi' ? 'क्विज़ गेम' : 'Play Quiz'}</span>
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('library');
            }}
            className={`flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'library'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-900 hover:bg-purple-200/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'hi' ? '2000 GK लाइब्रेरी' : '2000 GK Library'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'reels' ? (
        <GkReelsPlayer
          lang={lang}
          onAddStars={onAddStars}
          onBack={onBack}
        />
      ) : activeTab === 'quiz' ? (
        /* QUIZ MODE */
        <div className="space-y-4">
          {/* Header Stats Bar */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 border-4 border-white rounded-3xl p-4 sm:p-5 text-white shadow-lg flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl">
                {currentQ.icon}
              </div>
              <div>
                <span className="text-xs font-black uppercase text-amber-100 tracking-wider">
                  {lang === 'hi' ? currentQ.categoryHi : currentQ.categoryEn}
                </span>
                <h2 className="text-lg sm:text-xl font-black">
                  {lang === 'hi' ? `जीके सवाल #${currentQIndex + 1}` : `GK Question #${currentQIndex + 1}`}
                  <span className="text-xs font-bold text-amber-100 ml-2">
                    (कुल 2000 GK)
                  </span>
                </h2>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-2">
              {streak >= 2 && (
                <div className="flex items-center gap-1 bg-rose-500/80 px-3 py-1 rounded-full text-xs font-black animate-bounce shadow">
                  <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>{streak} Streak! (+5 ⭐)</span>
                </div>
              )}

              {/* Lifeline Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={usedFiftyFifty || isAnswered}
                  onClick={handleFiftyFifty}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black border transition-all ${
                    usedFiftyFifty
                      ? 'bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed opacity-50'
                      : 'bg-white text-amber-900 border-white hover:bg-amber-50 active:scale-95 shadow cursor-pointer'
                  }`}
                  title="50:50 Lifeline"
                >
                  50:50
                </button>
                <button
                  disabled={usedHint || isAnswered}
                  onClick={handleUseHint}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black border transition-all flex items-center gap-1 ${
                    usedHint
                      ? 'bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed opacity-50'
                      : 'bg-white text-purple-900 border-white hover:bg-purple-50 active:scale-95 shadow cursor-pointer'
                  }`}
                  title="Hint Lifeline"
                >
                  💡 {lang === 'hi' ? 'संकेत' : 'Hint'}
                </button>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white border-4 border-amber-300 rounded-3xl p-5 sm:p-8 shadow-xl text-center">
            {/* Question Text */}
            <div className="flex items-center justify-center gap-2 mb-6 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-4 rounded-2xl border-2 border-amber-200">
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
                {lang === 'hi' ? currentQ.questionHi : currentQ.questionEn}
              </h3>
              <button
                onClick={speakCurrent}
                className="p-2 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 transition-colors shadow-sm flex-shrink-0"
                title={lang === 'hi' ? 'सुनिए' : 'Listen'}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Hint Box if activated */}
            {showHintText && (
              <div className="mb-6 p-3 rounded-2xl bg-purple-50 border-2 border-purple-200 text-purple-900 text-sm font-bold animate-fade-in flex items-center gap-2 text-left">
                <span className="text-xl">💡</span>
                <span>{lang === 'hi' ? currentQ.funFactHi : currentQ.funFactEn}</span>
              </div>
            )}

            {/* 4 Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto mb-6">
              {shuffledOptions.map((opt, i) => {
                const isHidden = hiddenOptions.includes(i);
                if (isHidden) {
                  return (
                    <div
                      key={i}
                      className="p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 opacity-40 flex items-center justify-center text-xs font-bold text-slate-400 select-none"
                    >
                      ✕ {lang === 'hi' ? 'हटाया गया' : 'Eliminated'}
                    </div>
                  );
                }

                const isSelected = selectedOpt === i;
                const isCorrect = isAnswered && opt.origIndex === currentQ.correctIndex;
                const isWrong = isSelected && opt.origIndex !== currentQ.correctIndex;

                let style = 'bg-white hover:bg-amber-50 border-amber-200 hover:border-amber-400 text-slate-800';
                if (isCorrect) {
                  style = 'bg-emerald-500 border-emerald-600 text-white scale-102 shadow-lg';
                } else if (isWrong) {
                  style = 'bg-rose-500 border-rose-600 text-white animate-wiggle';
                }

                return (
                  <button
                    key={i}
                    disabled={isAnswered}
                    onClick={() => handleSelectAnswer(i)}
                    className={`p-4 rounded-2xl border-3 flex items-center justify-between text-left font-black text-base sm:text-lg shadow-sm active:scale-95 transition-all cursor-pointer ${style}`}
                  >
                    <span>{lang === 'hi' ? opt.textHi : opt.textEn}</span>
                    {isCorrect && <CheckCircle2 className="w-6 h-6 text-white" />}
                    {isWrong && <XCircle className="w-6 h-6 text-white" />}
                  </button>
                );
              })}
            </div>

            {/* Fun Fact Reveal after answer */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-left max-w-2xl mx-auto animate-fade-in flex items-start gap-2.5">
                <span className="text-2xl">{currentQ.icon}</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-amber-900 mb-0.5">
                    ✨ {lang === 'hi' ? 'रोचक ज्ञान (Fun Fact):' : 'Fun Fact:'}
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-amber-800 leading-relaxed">
                    {lang === 'hi' ? currentQ.funFactHi : currentQ.funFactEn}
                  </p>
                </div>
              </div>
            )}

            {/* Next Question Button if answered */}
            {isAnswered && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    sound.playPop();
                    if (currentQIndex + 1 < ALL_1000_GK.length) {
                      setCurrentQIndex(prev => prev + 1);
                    }
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-8 py-3 rounded-2xl shadow-lg active:scale-95 transition-all text-base sm:text-lg cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'अगला सवाल ➜' : 'Next Question ➜'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 1000 GK LIBRARY / FLASHCARD BROWSER */
        <div className="space-y-4">
          {/* Search & Category Filter Bar */}
          <div className="bg-white border-4 border-purple-300 rounded-3xl p-4 sm:p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={lang === 'hi' ? '2000 GK में खोजें (जैसे: गांधी जी, बाघ, चाँद, भारत, विटामिन...)' : 'Search 2000 GK (e.g. Gandhi ji, Tiger, Moon, India...)'}
                  className="w-full bg-slate-50 border-2 border-purple-200 rounded-2xl pl-10 pr-4 py-2.5 font-bold text-sm sm:text-base outline-none focus:border-purple-500"
                />
              </div>

              <span className="text-xs font-black text-purple-900 bg-purple-100 px-3 py-2 rounded-2xl whitespace-nowrap">
                {lang === 'hi' ? `मिले: ${filteredLibrary.length} सवाल` : `Found: ${filteredLibrary.length} Questions`}
              </span>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', hi: 'सभी (All 2000 GK)', en: 'All 2000 GK' },
                { id: 'india', hi: '🇮🇳 भारत', en: 'India' },
                { id: 'nature', hi: '🦁 पशु-पक्षी', en: 'Nature' },
                { id: 'space', hi: '🚀 अंतरिक्ष', en: 'Space' },
                { id: 'science', hi: '🧪 विज्ञान', en: 'Science' },
                { id: 'world', hi: '🌍 दुनिया', en: 'World' },
                { id: 'sports', hi: '⚽ खेल', en: 'Sports' },
                { id: 'fun', hi: '💡 पहेलियां', en: 'Fun' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playPop();
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-slate-100 hover:bg-purple-100 text-slate-700'
                  }`}
                >
                  {lang === 'hi' ? cat.hi : cat.en}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentLibraryItems.map((q) => (
              <div
                key={q.id}
                className="bg-white border-3 border-amber-200 hover:border-amber-400 rounded-3xl p-4 shadow-md flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span>{q.icon}</span>
                      <span>#{q.id} {lang === 'hi' ? q.categoryHi : q.categoryEn}</span>
                    </span>

                    <button
                      onClick={() => {
                        const txt = lang === 'hi'
                          ? `${q.questionHi} सही उत्तर है: ${q.optionsHi[q.correctIndex]}. रोचक तथ्य: ${q.funFactHi}`
                          : `${q.questionEn} Correct answer: ${q.optionsEn[q.correctIndex]}. Fun fact: ${q.funFactEn}`;
                        sound.speak(txt, lang);
                      }}
                      className="p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
                      title={lang === 'hi' ? 'सुनिए' : 'Listen'}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-base font-black text-slate-800 mb-2 leading-snug">
                    {lang === 'hi' ? q.questionHi : q.questionEn}
                  </h4>

                  <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-2.5 mb-2">
                    <div className="text-[11px] font-black text-emerald-800 uppercase">
                      ✓ {lang === 'hi' ? 'सही उत्तर' : 'Correct Answer'}
                    </div>
                    <div className="text-sm font-black text-emerald-950">
                      {lang === 'hi' ? q.optionsHi[q.correctIndex] : q.optionsEn[q.correctIndex]}
                    </div>
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  💡 {lang === 'hi' ? q.funFactHi : q.funFactEn}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  sound.playPop();
                  setCurrentPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 100, behavior: 'smooth' });
                }}
                className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-white border-2 border-purple-300 font-bold text-xs sm:text-sm text-purple-900 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{lang === 'hi' ? 'पिछला' : 'Previous'}</span>
              </button>

              <span className="text-xs sm:text-sm font-black text-purple-900 bg-purple-100 px-3 py-1.5 rounded-xl">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  sound.playPop();
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 100, behavior: 'smooth' });
                }}
                className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-white border-2 border-purple-300 font-bold text-xs sm:text-sm text-purple-900 disabled:opacity-40"
              >
                <span>{lang === 'hi' ? 'अगला' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reward Modal */}
      <RewardModal
        isOpen={showReward}
        lang={lang}
        starsEarned={20}
        title={lang === 'hi' ? 'जीके सुपर स्टार!' : 'GK Super Star!'}
        message={lang === 'hi' ? 'शाबाश! आपने सामान्य ज्ञान के सवाल बहुत ही तेजी से सही हल किए!' : 'Awesome! You solved General Knowledge questions brilliantly!'}
        onPlayAgain={() => {
          setShowReward(false);
          if (currentQIndex + 1 < ALL_1000_GK.length) {
            setCurrentQIndex(prev => prev + 1);
          }
        }}
        onNextLevel={() => {
          setShowReward(false);
          if (currentQIndex + 1 < ALL_1000_GK.length) {
            setCurrentQIndex(prev => prev + 1);
          }
        }}
        onGoHome={onBack}
      />
    </div>
  );
};
