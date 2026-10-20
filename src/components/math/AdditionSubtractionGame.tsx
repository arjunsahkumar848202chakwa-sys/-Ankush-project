import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import { RewardModal } from '../RewardModal';

interface AdditionSubtractionGameProps {
  lang: Language;
  onAddStars: (n: number) => void;
  onBack: () => void;
}

interface Question {
  num1: number;
  num2: number;
  op: '+' | '-';
  animal: string;
  animalNameHi: string;
  animalNameEn: string;
  options: number[];
  answer: number;
}

function generateQuestions(): Question[] {
  const animals = [
    { emoji: '🐰', nameHi: 'खरगोश', nameEn: 'bunnies' },
    { emoji: '🦋', nameHi: 'तितलियाँ', nameEn: 'butterflies' },
    { emoji: '🐥', nameHi: 'चूजे', nameEn: 'chicks' },
    { emoji: '🐸', nameHi: 'मेंढक', nameEn: 'frogs' },
    { emoji: '🐟', nameHi: 'मछलियाँ', nameEn: 'fishes' },
  ];

  const list: Question[] = [];

  // Q1: Simple addition 2 + 3
  list.push(createQ(2, 3, '+', animals[0]));
  // Q2: Simple addition 4 + 2
  list.push(createQ(4, 2, '+', animals[1]));
  // Q3: Simple subtraction 5 - 2
  list.push(createQ(5, 2, '-', animals[2]));
  // Q4: Addition 3 + 4
  list.push(createQ(3, 4, '+', animals[3]));
  // Q5: Subtraction 6 - 3
  list.push(createQ(6, 3, '-', animals[4]));

  return list;
}

function createQ(num1: number, num2: number, op: '+' | '-', animal: { emoji: string; nameHi: string; nameEn: string }): Question {
  const ans = op === '+' ? num1 + num2 : num1 - num2;
  const optionsSet = new Set<number>([ans]);
  while (optionsSet.size < 4) {
    const delta = Math.floor(Math.random() * 5) - 2;
    const opt = ans + delta;
    if (opt >= 0 && opt !== ans) {
      optionsSet.add(opt);
    } else {
      optionsSet.add(ans + optionsSet.size);
    }
  }

  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  return {
    num1,
    num2,
    op,
    animal: animal.emoji,
    animalNameHi: animal.nameHi,
    animalNameEn: animal.nameEn,
    options,
    answer: ans,
  };
}

export const AdditionSubtractionGame: React.FC<AdditionSubtractionGameProps> = ({
  lang,
  onAddStars,
  onBack,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    const qList = generateQuestions();
    setQuestions(qList);
    setQIndex(0);
  }, []);

  const currentQ = questions[qIndex];

  useEffect(() => {
    if (!currentQ) return;
    setSelectedOpt(null);
    setIsAnswered(false);

    // Speak question aloud
    const opWord = currentQ.op === '+' 
      ? (lang === 'hi' ? 'जमा' : 'plus') 
      : (lang === 'hi' ? 'घटाव' : 'minus');
    const msg = lang === 'hi'
      ? `${currentQ.num1} ${currentQ.animalNameHi} ${opWord} ${currentQ.num2} ${currentQ.animalNameHi} बराबर कितने?`
      : `${currentQ.num1} ${currentQ.animalNameEn} ${opWord} ${currentQ.num2} ${currentQ.animalNameEn} equals how many?`;
    sound.speak(msg, lang);
  }, [currentQ, lang]);

  if (!currentQ) return null;

  const handleSelectOption = (opt: number) => {
    if (isAnswered) return;
    setSelectedOpt(opt);
    setIsAnswered(true);

    if (opt === currentQ.answer) {
      sound.playCorrect();
      onAddStars(3);

      setTimeout(() => {
        if (qIndex + 1 < questions.length) {
          setQIndex(prev => prev + 1);
        } else {
          setShowReward(true);
        }
      }, 1300);
    } else {
      sound.playTryAgain();
      const hint = lang === 'hi' ? 'दोबारा सोचो! चित्रों को गिनो।' : 'Try again! Count the animals.';
      sound.speak(hint, lang);
      setTimeout(() => {
        setIsAnswered(false);
        setSelectedOpt(null);
      }, 1200);
    }
  };

  const speakCurrent = () => {
    const opWord = currentQ.op === '+' ? (lang === 'hi' ? 'जमा' : 'plus') : (lang === 'hi' ? 'घटाव' : 'minus');
    const msg = lang === 'hi'
      ? `${currentQ.num1} ${currentQ.animalNameHi} ${opWord} ${currentQ.num2} ${currentQ.animalNameHi} बराबर कितने?`
      : `${currentQ.num1} ${currentQ.animalNameEn} ${opWord} ${currentQ.num2} ${currentQ.animalNameEn} equals how many?`;
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-emerald-300 font-bold text-emerald-900 shadow-sm hover:bg-emerald-50 active:scale-95 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-1 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full text-xs sm:text-sm font-black text-emerald-900">
          <span>{lang === 'hi' ? `सवाल ${qIndex + 1} / ${questions.length}` : `Question ${qIndex + 1} / ${questions.length}`}</span>
        </div>
      </div>

      {/* Main Play Card */}
      <div className="bg-white border-4 border-emerald-300 rounded-3xl p-5 sm:p-8 shadow-xl text-center">
        {/* Title bar */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            {lang === 'hi' ? 'गिनो और सही संख्या चुनो!' : 'Count and pick the right answer!'}
          </h2>
          <button
            onClick={speakCurrent}
            className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition-colors"
            title={lang === 'hi' ? 'सुनिए' : 'Listen'}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Animal Math Equation */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-200 rounded-3xl p-4 sm:p-6 mb-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 shadow-inner">
          {/* Group 1 */}
          <div className="flex flex-col items-center">
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-3 bg-white rounded-2xl shadow-sm border border-emerald-200 min-w-[70px]">
              {Array.from({ length: currentQ.num1 }).map((_, i) => (
                <span key={i} className="text-3xl sm:text-4xl hover:scale-125 transition-transform cursor-pointer">
                  {currentQ.animal}
                </span>
              ))}
            </div>
            <span className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">{currentQ.num1}</span>
          </div>

          {/* Operation Sign */}
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl font-black shadow-md animate-pulse-scale">
            {currentQ.op}
          </div>

          {/* Group 2 */}
          <div className="flex flex-col items-center">
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-3 bg-white rounded-2xl shadow-sm border border-emerald-200 min-w-[70px]">
              {Array.from({ length: currentQ.num2 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-3xl sm:text-4xl hover:scale-125 transition-transform cursor-pointer ${
                    currentQ.op === '-' ? 'opacity-60 line-through' : ''
                  }`}
                >
                  {currentQ.animal}
                </span>
              ))}
            </div>
            <span className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">{currentQ.num2}</span>
          </div>

          {/* Equals Sign */}
          <div className="text-3xl sm:text-4xl font-black text-slate-700">
            =
          </div>

          {/* Question mark placeholder */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 border-dashed border-emerald-400 bg-white flex items-center justify-center text-3xl sm:text-4xl font-black text-emerald-600 shadow-sm animate-bounce">
            {isAnswered && selectedOpt === currentQ.answer ? currentQ.answer : '?'}
          </div>
        </div>

        {/* 4 Interactive Answer Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOpt === opt;
            const isCorrect = isAnswered && opt === currentQ.answer;
            const isWrong = isSelected && opt !== currentQ.answer;

            let btnStyle = 'bg-white hover:bg-emerald-50 border-emerald-300 text-slate-800 hover:border-emerald-500';
            if (isCorrect) {
              btnStyle = 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-xl';
            } else if (isWrong) {
              btnStyle = 'bg-rose-500 border-rose-600 text-white animate-wiggle';
            }

            return (
              <button
                key={opt}
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt)}
                className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl border-4 text-3xl sm:text-4xl font-black shadow-md transition-all active:scale-95 cursor-pointer ${btnStyle}`}
              >
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <RewardModal
        isOpen={showReward}
        lang={lang}
        starsEarned={15}
        title={lang === 'hi' ? 'जोड़-घटाव चैंपियन!' : 'Math Champion!'}
        message={lang === 'hi' ? 'अद्भुत! आपने सभी जोड़-घटाव सवाल सही किए!' : 'Incredible! You solved all math problems!'}
        onPlayAgain={() => {
          setQuestions(generateQuestions());
          setQIndex(0);
          setShowReward(false);
        }}
        onGoHome={onBack}
      />
    </div>
  );
};
