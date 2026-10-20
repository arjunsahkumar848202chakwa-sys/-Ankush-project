import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Sparkles, Rocket, Globe, Compass } from 'lucide-react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import { RewardModal } from '../RewardModal';

interface SolarSystemGameProps {
  lang: Language;
  onAddStars: (n: number) => void;
  onBack: () => void;
}

interface Planet {
  id: string;
  nameHi: string;
  nameEn: string;
  icon: string;
  color: string;
  factHi: string;
  factEn: string;
  tagHi: string;
  tagEn: string;
}

const PLANETS: Planet[] = [
  {
    id: 'sun',
    nameHi: 'सूर्य (सूरज)',
    nameEn: 'The Sun',
    icon: '☀️',
    color: 'from-amber-400 to-orange-500',
    factHi: 'सूरज एक विशाल तारा है जो हमारे पूरे सौरमंडल को रोशनी और ऊर्जा देता है!',
    factEn: 'The Sun is a glowing star at the center that warms all planets!',
    tagHi: 'ऊर्जा का स्रोत',
    tagEn: 'Center Star',
  },
  {
    id: 'mercury',
    nameHi: 'बुध (Mercury)',
    nameEn: 'Mercury',
    icon: '🪐',
    color: 'from-slate-300 to-slate-400',
    factHi: 'बुध सूरज के सबसे नजदीक है और यह सौरमंडल का सबसे छोटा ग्रह है!',
    factEn: 'Mercury is the smallest planet and closest to the Sun!',
    tagHi: 'सबसे छोटा ग्रह',
    tagEn: 'Smallest Planet',
  },
  {
    id: 'venus',
    nameHi: 'शुक्र (Venus)',
    nameEn: 'Venus',
    icon: '🌕',
    color: 'from-amber-300 to-yellow-400',
    factHi: 'शुक्र रात के आसमान में सबसे चमकदार और सबसे गर्म ग्रह है!',
    factEn: 'Venus is the brightest and hottest planet in our solar system!',
    tagHi: 'सबसे गर्म ग्रह',
    tagEn: 'Hottest Planet',
  },
  {
    id: 'earth',
    nameHi: 'पृथ्वी (Earth)',
    nameEn: 'Earth',
    icon: '🌍',
    color: 'from-blue-400 to-emerald-400',
    factHi: 'हमारी प्यारी पृथ्वी! जहाँ नीला समंदर, हवा और जीवन है!',
    factEn: 'Our beautiful blue home! The only known planet with water and life!',
    tagHi: 'हमारा घर',
    tagEn: 'Our Home',
  },
  {
    id: 'mars',
    nameHi: 'मंगल (Mars)',
    nameEn: 'Mars',
    icon: '🔴',
    color: 'from-red-500 to-orange-600',
    factHi: 'मंगल को "लाल ग्रह" कहते हैं क्योंकि यहाँ की मिट्टी में जंग लगे लोहे का रंग है!',
    factEn: 'Mars is called the "Red Planet" because of rusty iron dust on its surface!',
    tagHi: 'लाल ग्रह',
    tagEn: 'Red Planet',
  },
  {
    id: 'jupiter',
    nameHi: 'बृहस्पति (Jupiter)',
    nameEn: 'Jupiter',
    icon: '🟠',
    color: 'from-amber-600 to-yellow-600',
    factHi: 'बृहस्पति सौरमंडल का सबसे बड़ा दानव ग्रह है, इसमें बाकी सभी ग्रह समा सकते हैं!',
    factEn: 'Jupiter is the biggest planet! It is so huge all other planets fit inside!',
    tagHi: 'सबसे बड़ा ग्रह',
    tagEn: 'Giant Planet',
  },
  {
    id: 'saturn',
    nameHi: 'शनि (Saturn)',
    nameEn: 'Saturn',
    icon: '🪐',
    color: 'from-yellow-400 to-amber-500',
    factHi: 'शनि के चारों ओर बर्फ और चट्टानों के चमकीले सुंदर छल्ले (Rings) हैं!',
    factEn: 'Saturn is famous for its dazzling rings made of ice, dust, and rock!',
    tagHi: 'छल्लों वाला ग्रह',
    tagEn: 'Ringed Planet',
  },
];

interface SpaceQuiz {
  questionHi: string;
  questionEn: string;
  options: { labelHi: string; labelEn: string; icon: string; isCorrect: boolean }[];
}

const SPACE_QUIZZES: SpaceQuiz[] = [
  {
    questionHi: 'अंतरिक्ष में "लाल ग्रह (Red Planet)" किसे कहते हैं?',
    questionEn: 'Which planet is known as the "Red Planet"?',
    options: [
      { labelHi: 'पृथ्वी', labelEn: 'Earth', icon: '🌍', isCorrect: false },
      { labelHi: 'मंगल', labelEn: 'Mars', icon: '🔴', isCorrect: true },
      { labelHi: 'शनि', labelEn: 'Saturn', icon: '🪐', isCorrect: false },
    ],
  },
  {
    questionHi: 'सौरमंडल का सबसे बड़ा भीमकाय ग्रह कौन सा है?',
    questionEn: 'Which is the largest giant planet in our solar system?',
    options: [
      { labelHi: 'बृहस्पति', labelEn: 'Jupiter', icon: '🟠', isCorrect: true },
      { labelHi: 'बुध', labelEn: 'Mercury', icon: '🪐', isCorrect: false },
      { labelHi: 'शुक्र', labelEn: 'Venus', icon: '🌕', isCorrect: false },
    ],
  },
  {
    questionHi: 'सुंदर बर्फ के छल्ले (Rings) किस ग्रह के पास हैं?',
    questionEn: 'Which planet has beautiful shining rings?',
    options: [
      { labelHi: 'शनि', labelEn: 'Saturn', icon: '🪐', isCorrect: true },
      { labelHi: 'मंगल', labelEn: 'Mars', icon: '🔴', isCorrect: false },
      { labelHi: 'पृथ्वी', labelEn: 'Earth', icon: '🌍', isCorrect: false },
    ],
  },
];

export const SolarSystemGame: React.FC<SolarSystemGameProps> = ({
  lang,
  onAddStars,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz'>('explore');
  const [selectedPlanet, setSelectedPlanet] = useState<Planet>(PLANETS[3]); // Earth by default
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedQuizOpt, setSelectedQuizOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (activeTab === 'explore') {
      const msg = lang === 'hi' 
        ? `${selectedPlanet.nameHi} - ${selectedPlanet.factHi}` 
        : `${selectedPlanet.nameEn} - ${selectedPlanet.factEn}`;
      sound.speak(msg, lang);
    }
  }, [selectedPlanet, lang, activeTab]);

  const handleSelectPlanet = (planet: Planet) => {
    sound.playPop();
    setSelectedPlanet(planet);
  };

  const handleQuizAnswer = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedQuizOpt(optIdx);
    setIsAnswered(true);

    const isCorrect = SPACE_QUIZZES[quizIdx].options[optIdx].isCorrect;

    if (isCorrect) {
      sound.playCorrect();
      onAddStars(5);

      setTimeout(() => {
        if (quizIdx + 1 < SPACE_QUIZZES.length) {
          setQuizIdx(prev => prev + 1);
          setIsAnswered(false);
          setSelectedQuizOpt(null);
        } else {
          setShowReward(true);
        }
      }, 1200);
    } else {
      sound.playTryAgain();
      const hint = lang === 'hi' ? 'फिर से कोशिश करो!' : 'Try again!';
      sound.speak(hint, lang);
      setTimeout(() => {
        setIsAnswered(false);
        setSelectedQuizOpt(null);
      }, 1200);
    }
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-indigo-300 font-bold text-indigo-900 shadow-sm hover:bg-indigo-50 active:scale-95 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        {/* Tab switch */}
        <div className="flex bg-indigo-100 p-1 rounded-2xl border border-indigo-300">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('explore');
            }}
            className={`px-3 py-1 rounded-xl font-black text-xs sm:text-sm transition-all ${
              activeTab === 'explore'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-indigo-800 hover:text-indigo-950'
            }`}
          >
            🚀 {lang === 'hi' ? 'ग्रह खोजें' : 'Explore'}
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('quiz');
            }}
            className={`px-3 py-1 rounded-xl font-black text-xs sm:text-sm transition-all ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-indigo-800 hover:text-indigo-950'
            }`}
          >
            ⭐ {lang === 'hi' ? 'क्विज' : 'Space Quiz'}
          </button>
        </div>
      </div>

      {activeTab === 'explore' ? (
        /* Explore Mode */
        <div className="bg-slate-900 border-4 border-indigo-500 rounded-3xl p-4 sm:p-8 shadow-2xl text-white text-center select-none relative overflow-hidden">
          {/* Stars background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Active Planet Showcase */}
          <div className="relative z-10 max-w-lg mx-auto mb-6 p-6 rounded-3xl bg-slate-800/80 border-2 border-indigo-400 backdrop-blur shadow-2xl">
            <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-3 rounded-full flex items-center justify-center bg-gradient-to-tr from-indigo-900 to-slate-900 border-4 border-indigo-300 shadow-[0_0_30px_rgba(99,102,241,0.5)] animate-float">
              <span className="text-6xl sm:text-7xl">{selectedPlanet.icon}</span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="text-2xl sm:text-3xl font-black text-amber-300">
                {lang === 'hi' ? selectedPlanet.nameHi : selectedPlanet.nameEn}
              </h3>
              <button
                onClick={() => {
                  const msg = lang === 'hi' 
                    ? `${selectedPlanet.nameHi} - ${selectedPlanet.factHi}` 
                    : `${selectedPlanet.nameEn} - ${selectedPlanet.factEn}`;
                  sound.speak(msg, lang);
                }}
                className="p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                title={lang === 'hi' ? 'सुनिए' : 'Listen'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <span className="inline-block px-3 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-black border border-indigo-400 mb-3">
              {lang === 'hi' ? selectedPlanet.tagHi : selectedPlanet.tagEn}
            </span>

            <p className="text-sm sm:text-base font-bold text-slate-200 leading-relaxed">
              {lang === 'hi' ? selectedPlanet.factHi : selectedPlanet.factEn}
            </p>
          </div>

          {/* Planets Orbit Carousel / Selector */}
          <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-3">
            🌌 {lang === 'hi' ? 'किसी भी ग्रह पर टैप करके उसके बारे में जानें:' : 'Tap any planet to learn:'}
          </p>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {PLANETS.map((planet) => {
              const isSelected = selectedPlanet.id === planet.id;
              return (
                <button
                  key={planet.id}
                  onClick={() => handleSelectPlanet(planet)}
                  className={`flex flex-col items-center p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 border-amber-400 scale-110 shadow-lg'
                      : 'bg-slate-800 border-slate-700 hover:border-indigo-400 hover:scale-105'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl mb-1">{planet.icon}</span>
                  <span className="text-[10px] sm:text-xs font-black text-white">
                    {lang === 'hi' ? planet.nameHi.split(' ')[0] : planet.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Quiz Mode */
        <div className="bg-white border-4 border-indigo-400 rounded-3xl p-5 sm:p-8 shadow-xl text-center">
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 mb-6">
            <span className="text-xs font-black text-indigo-700 uppercase">
              {lang === 'hi' ? `अंतरिक्ष सवाल ${quizIdx + 1} / ${SPACE_QUIZZES.length}` : `Space Question ${quizIdx + 1} / ${SPACE_QUIZZES.length}`}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              {lang === 'hi' ? SPACE_QUIZZES[quizIdx].questionHi : SPACE_QUIZZES[quizIdx].questionEn}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto">
            {SPACE_QUIZZES[quizIdx].options.map((opt, i) => {
              const isSelected = selectedQuizOpt === i;
              const isCorrect = isAnswered && opt.isCorrect;
              const isWrong = isSelected && !opt.isCorrect;

              let style = 'bg-white hover:bg-indigo-50 border-indigo-300';
              if (isCorrect) style = 'bg-emerald-400 border-emerald-600 text-white scale-105';
              if (isWrong) style = 'bg-rose-400 border-rose-600 text-white animate-wiggle';

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleQuizAnswer(i)}
                  className={`p-4 rounded-3xl border-4 flex flex-col items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer ${style}`}
                >
                  <span className="text-4xl mb-2">{opt.icon}</span>
                  <span className="text-base font-black text-slate-800">
                    {lang === 'hi' ? opt.labelHi : opt.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <RewardModal
        isOpen={showReward}
        lang={lang}
        starsEarned={15}
        title={lang === 'hi' ? 'अंतरिक्ष यात्री सम्मान!' : 'Astronaut Victory!'}
        message={lang === 'hi' ? 'बधाई हो! आपने अंतरिक्ष क्विज पूरा कर लिया!' : 'Congrats! You completed the Space Quiz!'}
        onPlayAgain={() => {
          setQuizIdx(0);
          setShowReward(false);
          setIsAnswered(false);
          setSelectedQuizOpt(null);
        }}
        onGoHome={onBack}
      />
    </div>
  );
};
