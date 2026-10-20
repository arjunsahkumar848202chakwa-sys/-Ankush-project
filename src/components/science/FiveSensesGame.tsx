import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import { RewardModal } from '../RewardModal';

interface FiveSensesGameProps {
  lang: Language;
  onAddStars: (n: number) => void;
  onBack: () => void;
}

interface SenseQuestion {
  promptHi: string;
  promptEn: string;
  itemEmoji: string;
  correctSenseId: string;
}

const SENSES = [
  { id: 'eye', nameHi: 'आँखें (Eyes)', nameEn: 'Eyes (Sight)', icon: '👁️' },
  { id: 'ear', nameHi: 'कान (Ears)', nameEn: 'Ears (Hearing)', icon: '👂' },
  { id: 'nose', nameHi: 'नाक (Nose)', nameEn: 'Nose (Smell)', icon: '👃' },
  { id: 'tongue', nameHi: 'जीभ (Tongue)', nameEn: 'Tongue (Taste)', icon: '👅' },
  { id: 'hand', nameHi: 'त्वचा / हाथ (Touch)', nameEn: 'Touch (Feeling)', icon: '✋' },
];

const QUESTIONS: SenseQuestion[] = [
  {
    promptHi: 'स्वादिष्ट मीठी आइसक्रीम का स्वाद किस अंग से चखते हैं?',
    promptEn: 'Which super sense do we use to taste delicious ice cream?',
    itemEmoji: '🍦',
    correctSenseId: 'tongue',
  },
  {
    promptHi: 'आसमान में सुंदर इंद्रधनुष देखने के लिए क्या इस्तेमाल करते हैं?',
    promptEn: 'Which sense do we use to see the beautiful rainbow?',
    itemEmoji: '🌈',
    correctSenseId: 'eye',
  },
  {
    promptHi: 'गुलाब के फूल की खुशबू किस अंग से लेते हैं?',
    promptEn: 'Which sense helps us smell fresh red roses?',
    itemEmoji: '🌹',
    correctSenseId: 'nose',
  },
  {
    promptHi: 'घंटी की "टन-टन" आवाज किस अंग से सुनते हैं?',
    promptEn: 'Which sense do we use to hear the school bell ringing?',
    itemEmoji: '🔔',
    correctSenseId: 'ear',
  },
  {
    promptHi: 'मुलायम टेडी बियर को छूकर कैसे महसूस करते हैं?',
    promptEn: 'Which sense tells us that a teddy bear is soft and fluffy?',
    itemEmoji: '🧸',
    correctSenseId: 'hand',
  },
];

export const FiveSensesGame: React.FC<FiveSensesGameProps> = ({
  lang,
  onAddStars,
  onBack,
}) => {
  const [qIdx, setQIdx] = useState(0);
  const [selectedSenseId, setSelectedSenseId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const currentQ = QUESTIONS[qIdx];

  useEffect(() => {
    setSelectedSenseId(null);
    setIsAnswered(false);
    const msg = lang === 'hi' ? currentQ.promptHi : currentQ.promptEn;
    sound.speak(msg, lang);
  }, [qIdx, lang, currentQ]);

  const handleSelect = (senseId: string) => {
    if (isAnswered) return;
    setSelectedSenseId(senseId);
    setIsAnswered(true);

    if (senseId === currentQ.correctSenseId) {
      sound.playCorrect();
      onAddStars(3);

      setTimeout(() => {
        if (qIdx + 1 < QUESTIONS.length) {
          setQIdx(prev => prev + 1);
        } else {
          setShowReward(true);
        }
      }, 1300);
    } else {
      sound.playTryAgain();
      const hint = lang === 'hi' ? 'दोबारा सोचो! हम किस इंद्रिय से यह करते हैं?' : 'Think again! Which sense organ does this?';
      sound.speak(hint, lang);
      setTimeout(() => {
        setIsAnswered(false);
        setSelectedSenseId(null);
      }, 1200);
    }
  };

  const speakPrompt = () => {
    const msg = lang === 'hi' ? currentQ.promptHi : currentQ.promptEn;
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-teal-300 font-bold text-teal-900 shadow-sm hover:bg-teal-50 active:scale-95 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-1 bg-teal-100 border border-teal-300 px-3 py-1 rounded-full text-xs sm:text-sm font-black text-teal-900">
          <span>{lang === 'hi' ? `सवाल ${qIdx + 1} / ${QUESTIONS.length}` : `Question ${qIdx + 1} / ${QUESTIONS.length}`}</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border-4 border-teal-300 rounded-3xl p-5 sm:p-8 shadow-xl text-center">
        {/* Animated Item to Sense */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-teal-100 to-emerald-100 border-4 border-teal-300 flex items-center justify-center shadow-lg animate-float">
          <span className="text-6xl sm:text-7xl">{currentQ.itemEmoji}</span>
        </div>

        {/* Question Title */}
        <div className="flex items-center justify-center gap-2 mb-6 bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 p-4 rounded-2xl border-2 border-teal-200 max-w-xl mx-auto">
          <h2 className="text-lg sm:text-xl font-black text-slate-800">
            {lang === 'hi' ? currentQ.promptHi : currentQ.promptEn}
          </h2>
          <button
            onClick={speakPrompt}
            className="p-1.5 rounded-full bg-teal-200 hover:bg-teal-300 text-teal-900"
            title={lang === 'hi' ? 'सुनिए' : 'Listen'}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Senses Options Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-2xl mx-auto mb-6">
          {SENSES.map((sense) => {
            const isSelected = selectedSenseId === sense.id;
            const isCorrect = isAnswered && sense.id === currentQ.correctSenseId;
            const isWrong = isSelected && sense.id !== currentQ.correctSenseId;

            let style = 'bg-white hover:bg-teal-50 border-teal-200 hover:border-teal-400';
            if (isCorrect) style = 'bg-emerald-400 border-emerald-600 text-white scale-105 shadow-xl';
            if (isWrong) style = 'bg-rose-400 border-rose-600 text-white animate-wiggle';

            return (
              <button
                key={sense.id}
                disabled={isAnswered}
                onClick={() => handleSelect(sense.id)}
                className={`p-3 sm:p-4 rounded-3xl border-4 flex flex-col items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer ${style}`}
              >
                <span className="text-4xl sm:text-5xl mb-1 hover:scale-125 transition-transform">{sense.icon}</span>
                <span className="text-xs sm:text-sm font-black text-slate-800 text-center">
                  {lang === 'hi' ? sense.nameHi.split(' ')[0] : sense.nameEn.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs font-bold text-teal-800 bg-teal-50 py-2 px-4 rounded-full inline-block">
          ✨ {lang === 'hi' ? 'हमारी 5 इंद्रियां दुनिया को समझने में हमारी सबसे अच्छी दोस्त हैं!' : 'Our 5 senses help us explore and enjoy everything around us!'}
        </p>
      </div>

      <RewardModal
        isOpen={showReward}
        lang={lang}
        starsEarned={15}
        title={lang === 'hi' ? 'इंद्रियों के मास्टर!' : '5 Senses Master!'}
        message={lang === 'hi' ? 'आपने शरीर की 5 जादुई शक्तियों को बहुत अच्छे से सीखा!' : 'You mastered all 5 super senses!'}
        onPlayAgain={() => {
          setQIdx(0);
          setShowReward(false);
        }}
        onGoHome={onBack}
      />
    </div>
  );
};
