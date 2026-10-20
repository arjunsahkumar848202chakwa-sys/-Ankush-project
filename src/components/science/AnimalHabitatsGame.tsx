import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import { RewardModal } from '../RewardModal';

interface AnimalHabitatsGameProps {
  lang: Language;
  onAddStars: (n: number) => void;
  onBack: () => void;
}

interface MatchChallenge {
  animalEmoji: string;
  animalNameHi: string;
  animalNameEn: string;
  questionHi: string;
  questionEn: string;
  options: { labelHi: string; labelEn: string; icon: string; isCorrect: boolean }[];
  funFactHi: string;
  funFactEn: string;
}

const HABITAT_CHALLENGES: MatchChallenge[] = [
  {
    animalEmoji: '🐦',
    animalNameHi: 'नन्ही चिड़िया',
    animalNameEn: 'Little Bird',
    questionHi: 'चिड़िया का घर (Habitat) कौन सा है?',
    questionEn: 'Where does the bird live?',
    options: [
      { labelHi: 'घोंसला', labelEn: 'Nest', icon: '🪺', isCorrect: true },
      { labelHi: 'गुफा', labelEn: 'Cave', icon: '⛰️', isCorrect: false },
      { labelHi: 'पानी', labelEn: 'Water', icon: '🌊', isCorrect: false },
    ],
    funFactHi: 'चिड़िया तिनके-तिनके जोड़कर अपने अंडों के लिए नरम घोंसला बनाती है!',
    funFactEn: 'Birds weave twigs and grass together to create a soft, safe nest!',
  },
  {
    animalEmoji: '🦁',
    animalNameHi: 'जंगल का राजा शेर',
    animalNameEn: 'King Lion',
    questionHi: 'शेर कहाँ रहता है?',
    questionEn: 'Where does the lion live?',
    options: [
      { labelHi: 'छत्ता', labelEn: 'Beehive', icon: '🍯', isCorrect: false },
      { labelHi: 'गुफा (Den)', labelEn: 'Den / Cave', icon: '⛰️', isCorrect: true },
      { labelHi: 'पेड़ का घोंसला', labelEn: 'Nest', icon: '🪺', isCorrect: false },
    ],
    funFactHi: 'शेर जंगल में अपने परिवार (Pride) के साथ गुफा के पास रहता है!',
    funFactEn: 'Lions live in family groups called prides and rest in dens!',
  },
  {
    animalEmoji: '🐝',
    animalNameHi: 'मधुमक्खी',
    animalNameEn: 'Honeybee',
    questionHi: 'मधुमक्खी मीठा शहद कहाँ बनाती है?',
    questionEn: 'Where does the honeybee store its sweet honey?',
    options: [
      { labelHi: 'छत्ता (Beehive)', labelEn: 'Beehive', icon: '🍯', isCorrect: true },
      { labelHi: 'बिल (Burrow)', labelEn: 'Burrow', icon: '🕳️', isCorrect: false },
      { labelHi: 'पानी', labelEn: 'Water', icon: '🌊', isCorrect: false },
    ],
    funFactHi: 'मधुमक्खियाँ फूलों से रस चूसकर जादुई शहद बनाती हैं!',
    funFactEn: 'Bees visit thousands of flowers and create sweet golden honey!',
  },
  {
    animalEmoji: '🐮',
    animalNameHi: 'गाय (Cow)',
    animalNameEn: 'Cow',
    questionHi: 'गाय क्या खाती है? (शाकाहारी)',
    questionEn: 'What does a cow eat? (Herbivore)',
    options: [
      { labelHi: 'हरी घास व चारा', labelEn: 'Green Grass', icon: '🌿', isCorrect: true },
      { labelHi: 'मछली', labelEn: 'Fish', icon: '🐟', isCorrect: false },
      { labelHi: 'हड्डियाँ', labelEn: 'Bones', icon: '🦴', isCorrect: false },
    ],
    funFactHi: 'पौधे और घास खाने वाले जानवरों को शाकाहारी (Herbivore) कहते हैं!',
    funFactEn: 'Animals that eat grass and plants are called Herbivores!',
  },
];

export const AnimalHabitatsGame: React.FC<AnimalHabitatsGameProps> = ({
  lang,
  onAddStars,
  onBack,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const current = HABITAT_CHALLENGES[currentIdx];

  useEffect(() => {
    setSelectedOpt(null);
    setIsAnswered(false);
    const msg = lang === 'hi' ? current.questionHi : current.questionEn;
    sound.speak(msg, lang);
  }, [currentIdx, lang, current]);

  const handlePick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = current.options[idx].isCorrect;

    if (isCorrect) {
      sound.playCorrect();
      onAddStars(3);

      setTimeout(() => {
        if (currentIdx + 1 < HABITAT_CHALLENGES.length) {
          setCurrentIdx(prev => prev + 1);
        } else {
          setShowReward(true);
        }
      }, 1400);
    } else {
      sound.playTryAgain();
      const hint = lang === 'hi' ? 'फिर से सोचो दोस्त!' : 'Think again friend!';
      sound.speak(hint, lang);
      setTimeout(() => {
        setIsAnswered(false);
        setSelectedOpt(null);
      }, 1200);
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-amber-300 font-bold text-amber-900 shadow-sm hover:bg-amber-50 active:scale-95 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-xs sm:text-sm font-black text-amber-900">
          <span>{lang === 'hi' ? `सफारी स्तर ${currentIdx + 1} / ${HABITAT_CHALLENGES.length}` : `Safari Level ${currentIdx + 1} / ${HABITAT_CHALLENGES.length}`}</span>
        </div>
      </div>

      {/* Main Safari Card */}
      <div className="bg-white border-4 border-amber-300 rounded-3xl p-5 sm:p-8 shadow-xl text-center">
        {/* Safari Subject */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-100 to-yellow-200 border-4 border-amber-300 flex items-center justify-center shadow-lg animate-float">
          <span className="text-6xl sm:text-7xl">{current.animalEmoji}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-amber-950 mb-1">
          {lang === 'hi' ? current.animalNameHi : current.animalNameEn}
        </h3>

        {/* Question Banner */}
        <div className="flex items-center justify-center gap-2 mb-6 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-3 sm:p-4 rounded-2xl border-2 border-amber-200 max-w-xl mx-auto">
          <h2 className="text-lg sm:text-xl font-black text-slate-800">
            {lang === 'hi' ? current.questionHi : current.questionEn}
          </h2>
          <button
            onClick={speakPrompt}
            className="p-1.5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900"
            title={lang === 'hi' ? 'सुनिए' : 'Listen'}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Option Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto mb-6">
          {current.options.map((opt, i) => {
            const isSelected = selectedOpt === i;
            const isCorrect = isAnswered && opt.isCorrect;
            const isWrong = isSelected && !opt.isCorrect;

            let style = 'bg-white hover:bg-amber-50 border-amber-200 hover:border-amber-400';
            if (isCorrect) style = 'bg-emerald-400 border-emerald-600 text-white scale-105 shadow-xl';
            if (isWrong) style = 'bg-rose-400 border-rose-600 text-white animate-wiggle';

            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => handlePick(i)}
                className={`p-4 sm:p-6 rounded-3xl border-4 flex flex-col items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer ${style}`}
              >
                <span className="text-5xl mb-2">{opt.icon}</span>
                <span className="text-base sm:text-lg font-black text-slate-800">
                  {lang === 'hi' ? opt.labelHi : opt.labelEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Nature Fun Fact */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl max-w-lg mx-auto text-xs sm:text-sm font-bold text-amber-900">
          🐾 {lang === 'hi' ? current.funFactHi : current.funFactEn}
        </div>
      </div>

      <RewardModal
        isOpen={showReward}
        lang={lang}
        starsEarned={15}
        title={lang === 'hi' ? 'सफारी चैंपियन!' : 'Safari Explorer!'}
        message={lang === 'hi' ? 'आपने जानवरों और उनके घरों को पहचानना सीख लिया!' : 'You learned all about animal habitats and foods!'}
        onPlayAgain={() => {
          setCurrentIdx(0);
          setShowReward(false);
        }}
        onGoHome={onBack}
      />
    </div>
  );
};
