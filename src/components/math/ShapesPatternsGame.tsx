import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import { RewardModal } from '../RewardModal';

interface ShapesPatternsGameProps {
  lang: Language;
  onAddStars: (n: number) => void;
  onBack: () => void;
}

interface ShapeItem {
  nameHi: string;
  nameEn: string;
  icon: string;
  color: string;
}

const ALL_SHAPES: ShapeItem[] = [
  { nameHi: 'वृत्त (गोला)', nameEn: 'Circle', icon: '🔴', color: 'text-red-500' },
  { nameHi: 'चौकोर (वर्ग)', nameEn: 'Square', icon: '🟦', color: 'text-blue-500' },
  { nameHi: 'त्रिकोण', nameEn: 'Triangle', icon: '🔺', color: 'text-rose-500' },
  { nameHi: 'सितारा', nameEn: 'Star', icon: '⭐', color: 'text-yellow-400' },
  { nameHi: 'हीरा (डायमंड)', nameEn: 'Diamond', icon: '🔷', color: 'text-sky-500' },
  { nameHi: 'दिल', nameEn: 'Heart', icon: '💖', color: 'text-pink-500' },
];

interface Challenge {
  type: 'identify' | 'pattern';
  questionHi: string;
  questionEn: string;
  patternSequence?: string[];
  options: { label: string; icon: string; isCorrect: boolean }[];
  hintHi: string;
  hintEn: string;
}

const CHALLENGES: Challenge[] = [
  {
    type: 'identify',
    questionHi: 'इनमें से "त्रिकोण (Triangle)" कौन सा है?',
    questionEn: 'Which one is the "Triangle"?',
    options: [
      { label: 'Circle', icon: '🔴', isCorrect: false },
      { label: 'Triangle', icon: '🔺', isCorrect: true },
      { label: 'Square', icon: '🟦', isCorrect: false },
      { label: 'Star', icon: '⭐', isCorrect: false },
    ],
    hintHi: 'त्रिकोण के 3 कोने होते हैं!',
    hintEn: 'A triangle has 3 pointy corners!',
  },
  {
    type: 'pattern',
    questionHi: 'जादुई पैटर्न को पूरा करो! आगे क्या आएगा?',
    questionEn: 'Complete the magical pattern! What comes next?',
    patternSequence: ['🔴', '🟦', '🔴', '🟦', '🔴'],
    options: [
      { label: 'Red Circle', icon: '🔴', isCorrect: false },
      { label: 'Blue Square', icon: '🟦', isCorrect: true },
      { label: 'Yellow Star', icon: '⭐', isCorrect: false },
    ],
    hintHi: 'लाल, नीला, लाल, नीला, लाल... फिर क्या आएगा?',
    hintEn: 'Red, Blue, Red, Blue, Red... then?',
  },
  {
    type: 'identify',
    questionHi: 'रात में चमकने वाला "सितारा (Star)" कौन सा है?',
    questionEn: 'Which shape is the shiny "Star"?',
    options: [
      { label: 'Square', icon: '🟦', isCorrect: false },
      { label: 'Heart', icon: '💖', isCorrect: false },
      { label: 'Star', icon: '⭐', isCorrect: true },
      { label: 'Diamond', icon: '🔷', isCorrect: false },
    ],
    hintHi: 'सितारा आसमान में चमकता है!',
    hintEn: 'Stars twinkle in the night sky!',
  },
  {
    type: 'pattern',
    questionHi: 'फल और आकृतियों का पैटर्न पूरा करो:',
    questionEn: 'Complete this fun pattern:',
    patternSequence: ['⭐', '💖', '⭐', '💖'],
    options: [
      { label: 'Star', icon: '⭐', isCorrect: true },
      { label: 'Heart', icon: '💖', isCorrect: false },
      { label: 'Circle', icon: '🔴', isCorrect: false },
    ],
    hintHi: 'तारा, दिल, तारा, दिल... फिर?',
    hintEn: 'Star, Heart, Star, Heart... then?',
  },
  {
    type: 'identify',
    questionHi: 'चार बराबर भुजाओं वाला "चौकोर (Square)" कौन सा है?',
    questionEn: 'Which shape is the "Square" with 4 equal sides?',
    options: [
      { label: 'Square', icon: '🟦', isCorrect: true },
      { label: 'Circle', icon: '🔴', isCorrect: false },
      { label: 'Triangle', icon: '🔺', isCorrect: false },
      { label: 'Star', icon: '⭐', isCorrect: false },
    ],
    hintHi: 'चौकोर की 4 बराबर दीवारें होती हैं!',
    hintEn: 'A square has four equal sides!',
  },
];

export const ShapesPatternsGame: React.FC<ShapesPatternsGameProps> = ({
  lang,
  onAddStars,
  onBack,
}) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const current = CHALLENGES[levelIdx];

  useEffect(() => {
    setSelectedOpt(null);
    setIsAnswered(false);
    const msg = lang === 'hi' ? current.questionHi : current.questionEn;
    sound.speak(msg, lang);
  }, [levelIdx, lang, current]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = current.options[idx].isCorrect;

    if (isCorrect) {
      sound.playCorrect();
      onAddStars(3);

      setTimeout(() => {
        if (levelIdx + 1 < CHALLENGES.length) {
          setLevelIdx(prev => prev + 1);
        } else {
          setShowReward(true);
        }
      }, 1200);
    } else {
      sound.playTryAgain();
      const hint = lang === 'hi' ? current.hintHi : current.hintEn;
      sound.speak(hint, lang);
      setTimeout(() => {
        setIsAnswered(false);
        setSelectedOpt(null);
      }, 1300);
    }
  };

  const speakPrompt = () => {
    const msg = lang === 'hi' ? current.questionHi : current.questionEn;
    sound.speak(msg, lang);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            sound.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-violet-300 font-bold text-violet-900 shadow-sm hover:bg-violet-50 active:scale-95 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-1 bg-violet-100 border border-violet-300 px-3 py-1 rounded-full text-xs sm:text-sm font-black text-violet-900">
          <span>{lang === 'hi' ? `जासूस स्तर ${levelIdx + 1} / ${CHALLENGES.length}` : `Detective Level ${levelIdx + 1} / ${CHALLENGES.length}`}</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border-4 border-violet-300 rounded-3xl p-5 sm:p-8 shadow-xl text-center">
        {/* Question Header */}
        <div className="flex items-center justify-center gap-2 mb-6 bg-gradient-to-r from-violet-50 via-purple-50 to-violet-50 p-4 rounded-2xl border-2 border-violet-200">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            {lang === 'hi' ? current.questionHi : current.questionEn}
          </h2>
          <button
            onClick={speakPrompt}
            className="p-2 rounded-full bg-violet-200 hover:bg-violet-300 text-violet-900 transition-colors shadow-sm"
            title={lang === 'hi' ? 'सुनिए' : 'Listen'}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Pattern Display if Pattern Challenge */}
        {current.type === 'pattern' && current.patternSequence && (
          <div className="mb-8 p-4 sm:p-6 bg-slate-50 border-2 border-dashed border-violet-300 rounded-3xl flex flex-wrap items-center justify-center gap-3 sm:gap-4 shadow-inner">
            {current.patternSequence.map((shape, i) => (
              <div
                key={i}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-violet-200 shadow-sm flex items-center justify-center text-3xl sm:text-4xl animate-pulse"
              >
                {shape}
              </div>
            ))}
            <div className="text-2xl font-black text-violet-400">➜</div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 border-dashed border-violet-500 bg-violet-100 flex items-center justify-center text-3xl sm:text-4xl font-black text-violet-700 animate-bounce">
              ?
            </div>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
          {current.options.map((opt, i) => {
            const isSelected = selectedOpt === i;
            const isCorrect = isAnswered && opt.isCorrect;
            const isWrong = isSelected && !opt.isCorrect;

            let style = 'bg-white hover:bg-violet-50 border-violet-300 hover:border-violet-500';
            if (isCorrect) {
              style = 'bg-emerald-400 border-emerald-600 scale-105 shadow-xl';
            } else if (isWrong) {
              style = 'bg-rose-400 border-rose-600 animate-wiggle';
            }

            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => handleSelect(i)}
                className={`p-4 sm:p-6 rounded-3xl border-4 flex flex-col items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer ${style}`}
              >
                <span className="text-5xl sm:text-6xl mb-2 hover:scale-125 transition-transform">{opt.icon}</span>
                {isCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-800 animate-bounce" />
                )}
              </button>
            );
          })}
        </div>

        {/* Mascot Mini Hint */}
        <div className="mt-8 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-amber-900">
          <span>💡 {lang === 'hi' ? current.hintHi : current.hintEn}</span>
        </div>
      </div>

      <RewardModal
        isOpen={showReward}
        lang={lang}
        starsEarned={15}
        title={lang === 'hi' ? 'आकार जासूस की जीत!' : 'Shape Detective Victory!'}
        message={lang === 'hi' ? 'आपने सभी आकृतियाँ और पैटर्न सही पहचाने!' : 'You mastered all shapes and patterns!'}
        onPlayAgain={() => {
          setLevelIdx(0);
          setShowReward(false);
        }}
        onGoHome={onBack}
      />
    </div>
  );
};
