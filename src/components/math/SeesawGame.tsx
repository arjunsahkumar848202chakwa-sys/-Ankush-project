import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import { RewardModal } from '../RewardModal';

interface SeesawGameProps {
  lang: Language;
  onAddStars: (n: number) => void;
  onBack: () => void;
}

interface SeesawRound {
  questionHi: string;
  questionEn: string;
  leftItem: { icon: string; labelHi: string; labelEn: string; weight: number };
  rightItem: { icon: string; labelHi: string; labelEn: string; weight: number };
  target: 'heavier' | 'lighter' | 'greater';
}

const ROUNDS: SeesawRound[] = [
  {
    questionHi: 'झूले पर कौन सा जानवर भारी (Heavy) है?',
    questionEn: 'Which animal is heavier on the seesaw?',
    leftItem: { icon: '🐘', labelHi: 'हाथी (Elephant)', labelEn: 'Elephant', weight: 100 },
    rightItem: { icon: '🐭', labelHi: 'चूहा (Mouse)', labelEn: 'Mouse', weight: 5 },
    target: 'heavier',
  },
  {
    questionHi: 'कौन सी संख्या बड़ी (Greater) है?',
    questionEn: 'Which number is greater (bigger)?',
    leftItem: { icon: '4️⃣', labelHi: 'संख्या 4', labelEn: 'Number 4', weight: 4 },
    rightItem: { icon: '9️⃣', labelHi: 'संख्या 9', labelEn: 'Number 9', weight: 9 },
    target: 'greater',
  },
  {
    questionHi: 'कौन सी वस्तु हल्की (Lighter) है?',
    questionEn: 'Which item is lighter (weighs less)?',
    leftItem: { icon: '🪶', labelHi: 'पंख (Feather)', labelEn: 'Feather', weight: 1 },
    rightItem: { icon: '🍉', labelHi: 'तरबूज (Watermelon)', labelEn: 'Watermelon', weight: 50 },
    target: 'lighter',
  },
  {
    questionHi: 'कौन सी संख्या बड़ी है?',
    questionEn: 'Which number is greater?',
    leftItem: { icon: '7️⃣', labelHi: 'संख्या 7', labelEn: 'Number 7', weight: 7 },
    rightItem: { icon: '2️⃣', labelHi: 'संख्या 2', labelEn: 'Number 2', weight: 2 },
    target: 'greater',
  },
  {
    questionHi: 'कौन भारी है?',
    questionEn: 'Which is heavier?',
    leftItem: { icon: '🚗', labelHi: 'कार (Car)', labelEn: 'Car', weight: 80 },
    rightItem: { icon: '🚲', labelHi: 'साइकिल (Bicycle)', labelEn: 'Bicycle', weight: 20 },
    target: 'heavier',
  },
];

export const SeesawGame: React.FC<SeesawGameProps> = ({ lang, onAddStars, onBack }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const round = ROUNDS[roundIdx];

  useEffect(() => {
    setSelectedSide(null);
    setIsAnswered(false);
    const msg = lang === 'hi' ? round.questionHi : round.questionEn;
    sound.speak(msg, lang);
  }, [roundIdx, lang, round]);

  // Determine correct answer
  let correctSide: 'left' | 'right' = 'left';
  if (round.target === 'heavier' || round.target === 'greater') {
    correctSide = round.leftItem.weight > round.rightItem.weight ? 'left' : 'right';
  } else {
    // lighter
    correctSide = round.leftItem.weight < round.rightItem.weight ? 'left' : 'right';
  }

  // Calculate seesaw tilt
  // left heavier = tilts down on left (-12deg)
  // right heavier = tilts down on right (+12deg)
  let tilt = 0;
  if (selectedSide) {
    tilt = round.leftItem.weight > round.rightItem.weight ? -12 : 12;
  }

  const handlePick = (side: 'left' | 'right') => {
    if (isAnswered) return;
    setSelectedSide(side);
    setIsAnswered(true);

    if (side === correctSide) {
      sound.playCorrect();
      onAddStars(3);

      setTimeout(() => {
        if (roundIdx + 1 < ROUNDS.length) {
          setRoundIdx(prev => prev + 1);
        } else {
          setShowReward(true);
        }
      }, 1400);
    } else {
      sound.playTryAgain();
      const hint = lang === 'hi' ? 'फिर से सोचो! भारी चीज़ झूले को नीचे झुका देती है।' : 'Think again! Heavy objects push the seesaw down.';
      sound.speak(hint, lang);

      setTimeout(() => {
        setIsAnswered(false);
        setSelectedSide(null);
      }, 1300);
    }
  };

  const speakPrompt = () => {
    const msg = lang === 'hi' ? round.questionHi : round.questionEn;
    sound.speak(msg, lang);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            sound.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-rose-300 font-bold text-rose-900 shadow-sm hover:bg-rose-50 active:scale-95 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-1 bg-rose-100 border border-rose-300 px-3 py-1 rounded-full text-xs sm:text-sm font-black text-rose-900">
          <span>{lang === 'hi' ? `राउंड ${roundIdx + 1} / ${ROUNDS.length}` : `Round ${roundIdx + 1} / ${ROUNDS.length}`}</span>
        </div>
      </div>

      {/* Main Play Card */}
      <div className="bg-white border-4 border-rose-300 rounded-3xl p-5 sm:p-8 shadow-xl text-center">
        {/* Question Header */}
        <div className="flex items-center justify-center gap-2 mb-8 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 p-4 rounded-2xl border-2 border-rose-200">
          <span className="text-3xl">⚖️</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            {lang === 'hi' ? round.questionHi : round.questionEn}
          </h2>
          <button
            onClick={speakPrompt}
            className="p-2 rounded-full bg-rose-200 hover:bg-rose-300 text-rose-900 transition-colors shadow-sm"
            title={lang === 'hi' ? 'सुनिए' : 'Listen'}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Seesaw Animation Stage */}
        <div className="relative py-12 px-4 max-w-xl mx-auto select-none">
          {/* Seesaw Plank with smooth CSS transform */}
          <div
            className="relative h-6 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 rounded-full shadow-lg transition-transform duration-700 ease-out flex items-center justify-between px-4"
            style={{ transform: `rotate(${tilt}deg)` }}
          >
            {/* Left Seat Button */}
            <div className="absolute -top-24 left-2 sm:left-4">
              <button
                disabled={isAnswered}
                onClick={() => handlePick('left')}
                className={`flex flex-col items-center justify-center w-28 sm:w-32 p-3 rounded-3xl border-4 bg-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                  selectedSide === 'left'
                    ? selectedSide === correctSide
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-rose-500 bg-rose-50'
                    : 'border-amber-300 hover:border-amber-500'
                }`}
              >
                <span className="text-5xl sm:text-6xl mb-1 animate-bounce">
                  {round.leftItem.icon}
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-800">
                  {lang === 'hi' ? round.leftItem.labelHi : round.leftItem.labelEn}
                </span>
              </button>
            </div>

            {/* Right Seat Button */}
            <div className="absolute -top-24 right-2 sm:right-4">
              <button
                disabled={isAnswered}
                onClick={() => handlePick('right')}
                className={`flex flex-col items-center justify-center w-28 sm:w-32 p-3 rounded-3xl border-4 bg-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                  selectedSide === 'right'
                    ? selectedSide === correctSide
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-rose-500 bg-rose-50'
                    : 'border-amber-300 hover:border-amber-500'
                }`}
              >
                <span className="text-5xl sm:text-6xl mb-1 animate-bounce">
                  {round.rightItem.icon}
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-800">
                  {lang === 'hi' ? round.rightItem.labelHi : round.rightItem.labelEn}
                </span>
              </button>
            </div>
          </div>

          {/* Fulcrum / Triangle Base */}
          <div className="mx-auto w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[55px] border-b-slate-700 mt-0 drop-shadow-md" />
          {/* Ground Platform */}
          <div className="w-full h-4 bg-emerald-500 rounded-full shadow-inner mt-1" />
        </div>

        {/* Tap Prompt */}
        <p className="text-sm font-black text-rose-800 mt-6 animate-pulse">
          👉 {lang === 'hi' ? 'उत्तर चुनने के लिए ऊपर उस वस्तु या संख्या पर टैप करें!' : 'Tap on the object or number above to choose!'}
        </p>
      </div>

      <RewardModal
        isOpen={showReward}
        lang={lang}
        starsEarned={15}
        title={lang === 'hi' ? 'तराजू चैंपियन!' : 'Balance Master!'}
        message={lang === 'hi' ? 'आपने भारी, हल्के और बड़े-छोटे की सही पहचान की!' : 'You mastered heavy vs light and greater vs less!'}
        onPlayAgain={() => {
          setRoundIdx(0);
          setShowReward(false);
        }}
        onGoHome={onBack}
      />
    </div>
  );
};
