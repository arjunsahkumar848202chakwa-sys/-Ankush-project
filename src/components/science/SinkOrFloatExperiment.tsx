import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import { RewardModal } from '../RewardModal';

interface SinkOrFloatExperimentProps {
  lang: Language;
  onAddStars: (n: number) => void;
  onBack: () => void;
}

interface TestObject {
  id: string;
  nameHi: string;
  nameEn: string;
  icon: string;
  floats: boolean;
  reasonHi: string;
  reasonEn: string;
}

const ITEMS: TestObject[] = [
  {
    id: 'wood',
    nameHi: 'लकड़ी का गुटका',
    nameEn: 'Wooden Block',
    icon: '🪵',
    floats: true,
    reasonHi: 'लकड़ी पानी से हल्की (कम घनी) होती है, इसलिए यह तैरती है!',
    reasonEn: 'Wood is less dense than water, so it floats easily on top!',
  },
  {
    id: 'stone',
    nameHi: 'पत्थर',
    nameEn: 'Stone / Rock',
    icon: '🪨',
    floats: false,
    reasonHi: 'पत्थर बहुत भारी और सघन होता है, इसलिए यह तली में डूब जाता है!',
    reasonEn: 'Rock is dense and heavy, so gravity pulls it down to sink!',
  },
  {
    id: 'apple',
    nameHi: 'रसीला सेब',
    nameEn: 'Fresh Apple',
    icon: '🍎',
    floats: true,
    reasonHi: 'सेब के अंदर 25% हवा होती है, इसलिए वह मजे से तैरता है!',
    reasonEn: 'Apples have tiny air pockets inside (25% air), so they float!',
  },
  {
    id: 'key',
    nameHi: 'लोहे की चाबी',
    nameEn: 'Metal Key',
    icon: '🗝️',
    floats: false,
    reasonHi: 'लोहा पानी की तुलना में बहुत भारी होता है, इसलिए चाबी डूब जाती है!',
    reasonEn: 'Metal is much denser than water, so the key sinks instantly!',
  },
  {
    id: 'sponge',
    nameHi: 'स्पंज',
    nameEn: 'Dry Sponge',
    icon: '🧽',
    floats: true,
    reasonHi: 'स्पंज में बहुत सारे छेद और हवा भरी होती है, इसलिए यह तैरता है!',
    reasonEn: 'Sponge contains lots of air bubbles, making it float on water!',
  },
  {
    id: 'coin',
    nameHi: 'सिक्का',
    nameEn: 'Coin',
    icon: '🪙',
    floats: false,
    reasonHi: 'धातु का सिक्का भारी होने से पानी में नीचे बैठ जाता है!',
    reasonEn: 'A solid metal coin is heavy and sinks straight down!',
  },
];

export const SinkOrFloatExperiment: React.FC<SinkOrFloatExperimentProps> = ({
  lang,
  onAddStars,
  onBack,
}) => {
  const [testedItems, setTestedItems] = useState<{ [id: string]: boolean }>({});
  const [activeItem, setActiveItem] = useState<TestObject | null>(null);
  const [prediction, setPrediction] = useState<'float' | 'sink' | null>(null);
  const [dropState, setDropState] = useState<'none' | 'dropping' | 'settled'>('none');
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    const intro = lang === 'hi'
      ? 'ट्रे में से कोई भी वस्तु चुनिए और बताइए कि क्या वह तैरेगी या डूबेगी!'
      : 'Pick any object from the tray and guess whether it sinks or floats!';
    sound.speak(intro, lang);
  }, [lang]);

  const handleSelectItem = (item: TestObject) => {
    sound.playPop();
    setActiveItem(item);
    setPrediction(null);
    setDropState('none');

    const msg = lang === 'hi'
      ? `आपने ${item.nameHi} चुना। क्या यह तैरेगा या डूबेगा?`
      : `You picked ${item.nameEn}. Will it float or sink?`;
    sound.speak(msg, lang);
  };

  const handlePredict = (guess: 'float' | 'sink') => {
    if (!activeItem || dropState !== 'none') return;
    setPrediction(guess);
    setDropState('dropping');
    sound.playSplash();

    setTimeout(() => {
      setDropState('settled');
      const isCorrect = (guess === 'float' && activeItem.floats) || (guess === 'sink' && !activeItem.floats);

      if (isCorrect) {
        sound.playCorrect();
        onAddStars(3);
      } else {
        sound.playTryAgain();
      }

      // Mark tested
      setTestedItems(prev => {
        const next = { ...prev, [activeItem.id]: true };
        if (Object.keys(next).length === ITEMS.length) {
          setTimeout(() => setShowReward(true), 2000);
        }
        return next;
      });

      const explanation = lang === 'hi' ? activeItem.reasonHi : activeItem.reasonEn;
      sound.speak(explanation, lang);
    }, 1200);
  };

  const resetAll = () => {
    setTestedItems({});
    setActiveItem(null);
    setPrediction(null);
    setDropState('none');
    setShowReward(false);
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-cyan-300 font-bold text-cyan-900 shadow-sm hover:bg-cyan-50 active:scale-95 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-1 bg-cyan-100 border border-cyan-300 px-3 py-1 rounded-full text-xs sm:text-sm font-black text-cyan-900">
          <span>{lang === 'hi' ? `जांचे गए: ${Object.keys(testedItems).length} / ${ITEMS.length}` : `Tested: ${Object.keys(testedItems).length} / ${ITEMS.length}`}</span>
        </div>
      </div>

      {/* Main Experiment Card */}
      <div className="bg-white border-4 border-cyan-300 rounded-3xl p-4 sm:p-8 shadow-xl text-center">
        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-4 bg-gradient-to-r from-cyan-50 via-sky-50 to-cyan-50 p-3 sm:p-4 rounded-2xl border-2 border-cyan-200">
          <span className="text-3xl">⛵</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            {lang === 'hi' ? 'तैरना या डूबना? पानी की जादुई दुनिया' : 'Sink or Float? Water Physics Lab'}
          </h2>
        </div>

        {/* The Water Tank (Aquarium) */}
        <div className="relative mx-auto max-w-lg h-60 sm:h-72 border-4 border-cyan-400 rounded-3xl bg-gradient-to-b from-sky-100 via-sky-300/40 to-blue-400 overflow-hidden shadow-inner flex flex-col justify-between p-3 select-none">
          {/* Water Surface Line */}
          <div className="absolute top-16 left-0 right-0 h-4 bg-cyan-300/50 backdrop-blur-xs border-b border-cyan-400 flex items-center justify-around">
            <span className="text-xs font-black text-cyan-900 opacity-70">
              ~~~ {lang === 'hi' ? 'पानी की सतह (Water Surface)' : 'Water Surface'} ~~~
            </span>
          </div>

          {/* Bubbles in water */}
          <div className="absolute bottom-6 left-12 text-sm opacity-60 animate-bounce">🫧</div>
          <div className="absolute bottom-12 right-16 text-xs opacity-60 animate-float">🫧</div>
          <div className="absolute bottom-20 left-1/3 text-base opacity-40 animate-pulse">🫧</div>

          {/* Dropping / Resting Object in Tank */}
          <div className="relative flex-1 flex items-center justify-center">
            {activeItem && dropState !== 'none' && (
              <div
                className={`transition-all duration-1000 ease-in-out flex flex-col items-center ${
                  dropState === 'dropping'
                    ? 'translate-y-0 scale-110'
                    : activeItem.floats
                    ? '-translate-y-8 animate-float' // bobs on water surface
                    : 'translate-y-16' // rests on aquarium floor
                }`}
              >
                <span className="text-5xl sm:text-6xl filter drop-shadow-md">{activeItem.icon}</span>
                {dropState === 'settled' && (
                  <span
                    className={`mt-1 text-xs font-black px-2.5 py-0.5 rounded-full shadow ${
                      activeItem.floats
                        ? 'bg-amber-300 text-amber-950 border border-amber-400'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {activeItem.floats
                      ? (lang === 'hi' ? 'तैर रहा है! (Floats ⛵)' : 'Floating! ⛵')
                      : (lang === 'hi' ? 'डूब गया! (Sunk ⚓)' : 'Sunk to Bottom ⚓')}
                  </span>
                )}
              </div>
            )}

            {!activeItem && (
              <p className="text-cyan-900/70 font-black text-sm sm:text-base italic bg-white/70 px-4 py-2 rounded-2xl border border-cyan-200">
                {lang === 'hi' ? '👇 नीचे से कोई भी चीज चुनकर पानी में डालिए!' : '👇 Pick an item from below to test in water!'}
              </p>
            )}
          </div>

          {/* Aquarium Bottom Pebbles */}
          <div className="relative z-10 w-full h-6 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 rounded-b-2xl border-t-2 border-amber-400 flex items-center justify-center gap-1">
            <span className="text-xs">🪨 🐚 🪨 🐚 🪨</span>
          </div>
        </div>

        {/* Prediction Controls (Active when item is picked but not yet dropped) */}
        {activeItem && dropState === 'none' && (
          <div className="mt-4 p-4 rounded-3xl bg-amber-50 border-3 border-amber-300 max-w-lg mx-auto animate-scale-up">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-3xl">{activeItem.icon}</span>
              <p className="text-base sm:text-lg font-black text-amber-950">
                {lang === 'hi'
                  ? `क्या "${activeItem.nameHi}" तैरेगा या डूबेगा?`
                  : `Will "${activeItem.nameEn}" Float or Sink?`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handlePredict('float')}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black py-3 px-4 rounded-2xl shadow-lg active:scale-95 transition-all text-base sm:text-lg cursor-pointer"
              >
                <span>⛵ {lang === 'hi' ? 'तैरेगा (Float)' : 'Float'}</span>
              </button>
              <button
                onClick={() => handlePredict('sink')}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-black py-3 px-4 rounded-2xl shadow-lg active:scale-95 transition-all text-base sm:text-lg cursor-pointer"
              >
                <span>⚓ {lang === 'hi' ? 'डूबेगा (Sink)' : 'Sink'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Result & Science Explanation */}
        {activeItem && dropState === 'settled' && (
          <div className="mt-4 p-4 rounded-2xl bg-sky-50 border-2 border-sky-300 max-w-lg mx-auto text-left animate-fade-in">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-black text-sky-900 flex items-center gap-1">
                <span>💡 {lang === 'hi' ? 'वैज्ञानिक कारण (Science Reason):' : 'Science Reason:'}</span>
              </h4>
              <button
                onClick={() => {
                  const explanation = lang === 'hi' ? activeItem.reasonHi : activeItem.reasonEn;
                  sound.speak(explanation, lang);
                }}
                className="p-1 rounded-full bg-sky-200 hover:bg-sky-300 text-sky-900"
                title={lang === 'hi' ? 'सुनिए' : 'Listen'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm font-bold text-sky-800">
              {lang === 'hi' ? activeItem.reasonHi : activeItem.reasonEn}
            </p>
          </div>
        )}

        {/* Item Selection Tray */}
        <div className="mt-6 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm font-black text-slate-700 mb-3 uppercase tracking-wider">
            📦 {lang === 'hi' ? 'प्रयोग के लिए वस्तु चुनें (Tap to test):' : 'Objects Tray (Tap to test):'}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {ITEMS.map((item) => {
              const isDone = testedItems[item.id];
              const isCurrent = activeItem?.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`relative p-2.5 rounded-2xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-100 border-amber-500 scale-105 shadow-md'
                      : isDone
                      ? 'bg-emerald-50 border-emerald-300 opacity-90'
                      : 'bg-white border-slate-200 hover:border-cyan-400 hover:scale-105'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl mb-1">{item.icon}</span>
                  <span className="text-[11px] font-black text-slate-800 line-clamp-1">
                    {lang === 'hi' ? item.nameHi : item.nameEn}
                  </span>
                  {isDone && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <RewardModal
        isOpen={showReward}
        lang={lang}
        starsEarned={15}
        title={lang === 'hi' ? 'प्रयोग सफल हुआ!' : 'Experiment Complete!'}
        message={lang === 'hi' ? 'आपने सभी वस्तुओं के तैरने और डूबने का रहस्य समझ लिया!' : 'You discovered the secrets of density and buoyancy!'}
        onPlayAgain={resetAll}
        onGoHome={onBack}
      />
    </div>
  );
};
