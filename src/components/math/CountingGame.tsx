import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, RotateCcw, ArrowLeft, Star, Sparkles } from 'lucide-react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import { RewardModal } from '../RewardModal';

interface CountingGameProps {
  lang: Language;
  onAddStars: (n: number) => void;
  onBack: () => void;
}

interface RoundConfig {
  target: number;
  fruitEmoji: string;
  fruitNameHi: string;
  fruitNameEn: string;
  colorBg: string;
}

const ROUNDS: RoundConfig[] = [
  { target: 3, fruitEmoji: '🍎', fruitNameHi: 'सेब (Apples)', fruitNameEn: 'Apples', colorBg: 'from-red-100 to-rose-200' },
  { target: 5, fruitEmoji: '🍌', fruitNameHi: 'केले (Bananas)', fruitNameEn: 'Bananas', colorBg: 'from-amber-100 to-yellow-200' },
  { target: 4, fruitEmoji: '🥭', fruitNameHi: 'रसीले आम (Mangoes)', fruitNameEn: 'Mangoes', colorBg: 'from-orange-100 to-amber-200' },
  { target: 6, fruitEmoji: '🍓', fruitNameHi: 'स्ट्रॉबेरी (Strawberries)', fruitNameEn: 'Strawberries', colorBg: 'from-pink-100 to-rose-200' },
  { target: 8, fruitEmoji: '🍊', fruitNameHi: 'संतरे (Oranges)', fruitNameEn: 'Oranges', colorBg: 'from-orange-100 to-amber-200' },
];

export const CountingGame: React.FC<CountingGameProps> = ({ lang, onAddStars, onBack }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [basketFruits, setBasketFruits] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showReward, setShowReward] = useState(false);

  const round = ROUNDS[currentRoundIdx];

  const hindiNumbers = ['शून्य', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस'];

  useEffect(() => {
    // Speak instruction on round change
    setBasketFruits([]);
    setFeedback('idle');
    const msg = lang === 'hi'
      ? `टोकरी में ${round.target} ${round.fruitNameHi} डालिए!`
      : `Put ${round.target} ${round.fruitNameEn} in the basket!`;
    sound.speak(msg, lang);
  }, [currentRoundIdx, lang, round.fruitNameEn, round.fruitNameHi, round.target]);

  const handleAddFruit = () => {
    if (basketFruits.length >= 12) return;
    sound.playPop();
    const newCount = basketFruits.length + 1;
    setBasketFruits(prev => [...prev, Date.now()]);
    setFeedback('idle');

    // Speak count
    if (lang === 'hi') {
      const numWord = hindiNumbers[newCount] || `${newCount}`;
      sound.speak(numWord, 'hi');
    } else {
      sound.speak(`${newCount}`, 'en');
    }
  };

  const handleRemoveFruit = () => {
    if (basketFruits.length === 0) return;
    sound.playPop();
    setBasketFruits(prev => prev.slice(0, -1));
    setFeedback('idle');
  };

  const handleCheck = () => {
    if (basketFruits.length === round.target) {
      sound.playCorrect();
      setFeedback('correct');
      onAddStars(3);

      setTimeout(() => {
        if (currentRoundIdx + 1 < ROUNDS.length) {
          setCurrentRoundIdx(prev => prev + 1);
        } else {
          setShowReward(true);
        }
      }, 1200);
    } else {
      sound.playTryAgain();
      setFeedback('wrong');
      const hint = lang === 'hi'
        ? basketFruits.length < round.target
          ? `थोड़े और चाहिए! आपने सिर्फ ${basketFruits.length} डाले हैं।`
          : `अरे ज्यादा हो गए! हमें सिर्फ ${round.target} चाहिए।`
        : basketFruits.length < round.target
          ? `Need more! You put ${basketFruits.length}.`
          : `Too many! We only need ${round.target}.`;
      sound.speak(hint, lang);
    }
  };

  const speakPrompt = () => {
    const msg = lang === 'hi'
      ? `टोकरी में ${round.target} ${round.fruitNameHi} डालिए!`
      : `Put ${round.target} ${round.fruitNameEn} in the basket!`;
    sound.speak(msg, lang);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 animate-fade-in">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-4">
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

        {/* Level Indicator */}
        <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-xs sm:text-sm font-black text-amber-900">
          <span>{lang === 'hi' ? `राउंड ${currentRoundIdx + 1} / ${ROUNDS.length}` : `Round ${currentRoundIdx + 1} / ${ROUNDS.length}`}</span>
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="bg-white border-4 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-xl text-center">
        {/* Prompt Header */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-3 sm:p-4 rounded-2xl border-2 border-amber-200">
          <span className="text-3xl">{round.fruitEmoji}</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            {lang === 'hi' ? (
              <>
                टोकरी में <span className="text-rose-600 underline text-2xl sm:text-3xl font-black">{round.target}</span> {round.fruitNameHi} रखिए!
              </>
            ) : (
              <>
                Put <span className="text-rose-600 underline text-2xl sm:text-3xl font-black">{round.target}</span> {round.fruitNameEn} into the basket!
              </>
            )}
          </h2>
          <button
            onClick={speakPrompt}
            className="p-2 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 transition-colors shadow-sm"
            title={lang === 'hi' ? 'सुनिए' : 'Listen'}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Fruit Tree / Shelf to Pick From */}
        <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-emerald-100 via-green-50 to-emerald-100 border-2 border-emerald-300 shadow-inner">
          <p className="text-xs sm:text-sm font-extrabold text-emerald-800 mb-2">
            👇 {lang === 'hi' ? 'यहाँ फल पर टैप करें टोकरी में डालने के लिए:' : 'Tap the fruit here to add to basket:'}
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleAddFruit}
              className="group relative flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-3xl border-4 border-emerald-400 shadow-lg hover:border-emerald-500 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <span className="text-4xl sm:text-5xl group-hover:scale-125 transition-transform">
                {round.fruitEmoji}
              </span>
              <span className="text-[11px] font-black text-emerald-700 mt-1">
                + {lang === 'hi' ? 'डालो' : 'Add'}
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Fruit Basket */}
        <div className="relative mx-auto max-w-lg min-h-[180px] sm:min-h-[220px] bg-gradient-to-b from-amber-50 to-amber-100 border-4 border-dashed border-amber-400 rounded-3xl p-4 flex flex-col justify-between shadow-inner">
          {/* Basket Header Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-amber-900 flex items-center gap-1">
              🧺 {lang === 'hi' ? 'आपकी टोकरी' : 'Your Basket'}
            </span>
            <div className="bg-amber-400 text-amber-950 font-black px-3 py-1 rounded-full text-sm sm:text-base shadow-sm">
              {basketFruits.length} / {round.target}
            </div>
          </div>

          {/* Fruit Display in Basket */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-4 min-h-[70px]">
            {basketFruits.length === 0 ? (
              <p className="text-amber-700/70 font-bold text-sm italic">
                {lang === 'hi' ? 'टोकरी खाली है! ऊपर से फल डालिए...' : 'Basket is empty! Tap fruit above to add...'}
              </p>
            ) : (
              basketFruits.map((id, index) => (
                <div
                  key={id}
                  onClick={handleRemoveFruit}
                  title={lang === 'hi' ? 'हटाने के लिए टैप करें' : 'Tap to remove'}
                  className="flex flex-col items-center cursor-pointer hover:scale-110 active:scale-90 transition-transform bg-white/80 p-2 rounded-2xl shadow-sm border border-amber-200"
                >
                  <span className="text-3xl sm:text-4xl animate-bounce">{round.fruitEmoji}</span>
                  <span className="text-[10px] font-black text-slate-600">#{index + 1}</span>
                </div>
              ))
            )}
          </div>

          {/* Controls: Remove 1 & Clear */}
          {basketFruits.length > 0 && (
            <div className="flex justify-end gap-2">
              <button
                onClick={handleRemoveFruit}
                className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-300 px-2.5 py-1 rounded-xl active:scale-95 transition-all"
              >
                - {lang === 'hi' ? 'एक निकालो' : 'Remove one'}
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  setBasketFruits([]);
                }}
                className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-xl active:scale-95 transition-all"
              >
                {lang === 'hi' ? 'खाली करो' : 'Empty'}
              </button>
            </div>
          )}
        </div>

        {/* Feedback message */}
        {feedback === 'correct' && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-900 font-black text-lg animate-bounce flex items-center justify-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span>{lang === 'hi' ? 'शाबाश! बिल्कुल सही गिनती! 🎉' : 'Awesome! Exactly right count! 🎉'}</span>
          </div>
        )}

        {feedback === 'wrong' && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-100 border-2 border-rose-400 text-rose-900 font-black text-sm sm:text-base animate-wiggle">
            <span>
              {lang === 'hi'
                ? `अरे नहीं! टोकरी में ${basketFruits.length} हैं, लेकिन हमें ${round.target} चाहिए। फिर से कोशिश करो!`
                : `Oops! You have ${basketFruits.length}, but we need ${round.target}. Try again!`}
            </span>
          </div>
        )}

        {/* Check Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleCheck}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-lg sm:text-xl py-3 px-8 rounded-2xl shadow-xl active:scale-95 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>{lang === 'hi' ? 'जाँचो (Check)' : 'Check Count'}</span>
          </button>
        </div>
      </div>

      <RewardModal
        isOpen={showReward}
        lang={lang}
        starsEarned={15}
        title={lang === 'hi' ? 'फलों की गिनती पूरी हुई!' : 'Fruit Counting Complete!'}
        message={lang === 'hi' ? 'कमाल है! आप तो फलों की गिनती के उस्ताद बन गए!' : 'Super! You mastered fruit counting!'}
        onPlayAgain={() => {
          setCurrentRoundIdx(0);
          setBasketFruits([]);
          setShowReward(false);
        }}
        onGoHome={onBack}
      />
    </div>
  );
};
