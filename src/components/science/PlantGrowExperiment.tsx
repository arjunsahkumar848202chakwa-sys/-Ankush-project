import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Sparkles, Droplets, Sun, Sprout } from 'lucide-react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import { RewardModal } from '../RewardModal';

interface PlantGrowExperimentProps {
  lang: Language;
  onAddStars: (n: number) => void;
  onBack: () => void;
}

type GrowthStage = 'empty-pot' | 'seeded' | 'watered' | 'sunlit' | 'sprouted' | 'growing' | 'bloomed';

export const PlantGrowExperiment: React.FC<PlantGrowExperimentProps> = ({
  lang,
  onAddStars,
  onBack,
}) => {
  const [stage, setStage] = useState<GrowthStage>('empty-pot');
  const [showReward, setShowReward] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [isShining, setIsShining] = useState(false);

  // Narration based on stage
  useEffect(() => {
    let msg = '';
    if (stage === 'empty-pot') {
      msg = lang === 'hi' 
        ? 'गमले में मिट्टी तैयार है! सबसे पहले नन्हा बीज (Seed) बोइए।' 
        : 'The soil is ready in the pot! First, plant the tiny seed.';
    } else if (stage === 'seeded') {
      msg = lang === 'hi' 
        ? 'शाबाश! बीज मिट्टी में चला गया। अब उसे प्यास लगी है, पानी की झारी से पानी दीजिए!' 
        : 'Great! The seed is planted. Now it is thirsty, give it water!';
    } else if (stage === 'watered') {
      msg = lang === 'hi' 
        ? 'पानी मिल गया! अब पौधे को खाना बनाने के लिए सूरज की धूप दिखाइए!' 
        : 'Water added! Now give it warm sunshine to make food!';
    } else if (stage === 'sunlit' || stage === 'sprouted') {
      msg = lang === 'hi' 
        ? 'वाह! नन्हा अंकुर फूट पड़ा! थोड़ा और पानी और प्यार दीजिए।' 
        : 'Look! A tiny green sprout popped up! Keep caring for it.';
    } else if (stage === 'growing') {
      msg = lang === 'hi' 
        ? 'पौधा बड़ा हो रहा है, हरी पत्तियाँ निकल आईं! अब फूल खिलने वाला है!' 
        : 'The plant is growing leaves! Soon it will bloom a flower!';
    } else if (stage === 'bloomed') {
      msg = lang === 'hi' 
        ? 'कमाल! सुंदर खुशबूदार फूल खिल गया और तितलियाँ आ गईं! आप सच्चे वैज्ञानिक हैं!' 
        : 'Hooray! A gorgeous flower bloomed with butterflies! You are a true botanist!';
    }
    sound.speak(msg, lang);
  }, [stage, lang]);

  const handlePlantSeed = () => {
    if (stage !== 'empty-pot') return;
    sound.playPop();
    setStage('seeded');
  };

  const handleGiveWater = () => {
    if (stage !== 'seeded' && stage !== 'sprouted') return;
    setIsWatering(true);
    sound.playSplash();
    setTimeout(() => {
      setIsWatering(false);
      if (stage === 'seeded') setStage('watered');
      if (stage === 'sprouted') setStage('growing');
    }, 1000);
  };

  const handleGiveSun = () => {
    if (stage !== 'watered' && stage !== 'growing') return;
    setIsShining(true);
    sound.playStar();
    setTimeout(() => {
      setIsShining(false);
      if (stage === 'watered') setStage('sprouted');
      if (stage === 'growing') {
        setStage('bloomed');
        onAddStars(10);
        setTimeout(() => setShowReward(true), 1500);
      }
    }, 1200);
  };

  const speakCurrent = () => {
    let msg = '';
    if (stage === 'empty-pot') {
      msg = lang === 'hi' ? 'गमले में बीज डालिए!' : 'Plant the seed in the pot!';
    } else if (stage === 'seeded') {
      msg = lang === 'hi' ? 'पौधे को पानी दीजिए!' : 'Water the plant!';
    } else if (stage === 'watered') {
      msg = lang === 'hi' ? 'पौधे को सूरज की धूप दीजिए!' : 'Give the plant sunshine!';
    } else if (stage === 'sprouted') {
      msg = lang === 'hi' ? 'नन्हे पौधे को फिर से पानी दीजिए!' : 'Water the little sprout!';
    } else if (stage === 'growing') {
      msg = lang === 'hi' ? 'सूरज की धूप देकर फूल खिलाइए!' : 'Give sunlight to bloom the flower!';
    } else {
      msg = lang === 'hi' ? 'बधाई हो! सुंदर फूल खिल चुका है!' : 'Congratulations! A pretty flower has bloomed!';
    }
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-emerald-300 font-bold text-emerald-900 shadow-sm hover:bg-emerald-50 active:scale-95 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-1 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full text-xs sm:text-sm font-black text-emerald-900">
          <span>{lang === 'hi' ? 'प्रयोगशाला: पौधा कैसे बढ़ता है' : 'Science Lab: Plant Growth'}</span>
        </div>
      </div>

      {/* Main Experiment Arena */}
      <div className="bg-white border-4 border-emerald-300 rounded-3xl p-4 sm:p-8 shadow-xl text-center overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-center gap-2 mb-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 rounded-2xl border-2 border-emerald-200">
          <span className="text-3xl">🌱</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            {lang === 'hi' ? 'आओ एक बीज से सुंदर फूल उगाएँ!' : "Let's grow a flower from a seed!"}
          </h2>
          <button
            onClick={speakCurrent}
            className="p-2 rounded-full bg-emerald-200 hover:bg-emerald-300 text-emerald-900 transition-colors shadow-sm"
            title={lang === 'hi' ? 'सुनिए' : 'Listen'}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Experiment Visual Garden Area */}
        <div className="relative h-64 sm:h-80 max-w-xl mx-auto bg-gradient-to-b from-sky-200 via-sky-100 to-amber-100 border-4 border-sky-300 rounded-3xl overflow-hidden shadow-inner flex flex-col justify-end items-center select-none">
          {/* Animated Sun in Sky */}
          <div
            className={`absolute top-4 right-6 transition-all duration-700 ${
              isShining ? 'scale-150 animate-spin-slow' : 'scale-100'
            }`}
          >
            <span className="text-5xl sm:text-6xl filter drop-shadow-lg">☀️</span>
            {isShining && (
              <div className="absolute inset-0 bg-yellow-300/40 rounded-full blur-xl scale-150 pointer-events-none" />
            )}
          </div>

          {/* Cloud in Sky */}
          <div className="absolute top-4 left-6 text-4xl sm:text-5xl opacity-80 animate-float">
            ☁️
          </div>

          {/* Watering Animation Sprinkles */}
          {isWatering && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
              <span className="text-5xl animate-bounce">🫖</span>
              <div className="flex gap-2 mt-2">
                <span className="text-2xl animate-ping">💧</span>
                <span className="text-2xl animate-bounce">💧</span>
                <span className="text-2xl animate-ping">💧</span>
              </div>
            </div>
          )}

          {/* Butterflies if bloomed */}
          {stage === 'bloomed' && (
            <>
              <div className="absolute top-20 left-12 text-3xl sm:text-4xl animate-float">
                🦋
              </div>
              <div className="absolute top-16 right-20 text-3xl sm:text-4xl animate-bounce">
                🐝
              </div>
              <div className="absolute top-28 right-10 text-2xl sm:text-3xl animate-float">
                🌸
              </div>
            </>
          )}

          {/* The Growing Plant Stage View */}
          <div className="relative z-10 flex flex-col items-center mb-16 transition-all duration-700">
            {stage === 'empty-pot' && (
              <div className="text-slate-400 font-bold text-xs bg-white/70 px-3 py-1 rounded-full mb-2">
                {lang === 'hi' ? 'बीज बोने के लिए नीचे टैप करें 👇' : 'Tap seed below to plant 👇'}
              </div>
            )}

            {stage === 'seeded' && (
              <div className="flex flex-col items-center animate-bounce">
                <span className="text-2xl">🌰</span>
                <span className="text-xs font-black text-amber-800 bg-white/80 px-2 py-0.5 rounded-full mt-1">
                  {lang === 'hi' ? 'बीज (Seed)' : 'Seed'}
                </span>
              </div>
            )}

            {stage === 'watered' && (
              <div className="flex flex-col items-center">
                <span className="text-2xl">🌰💧</span>
                <span className="text-xs font-black text-blue-800 bg-white/80 px-2 py-0.5 rounded-full mt-1">
                  {lang === 'hi' ? 'सींचा हुआ बीज' : 'Moist Seed'}
                </span>
              </div>
            )}

            {stage === 'sprouted' && (
              <div className="flex flex-col items-center animate-bounce">
                <span className="text-4xl">🌱</span>
                <span className="text-xs font-black text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full mt-1">
                  {lang === 'hi' ? 'नन्हा अंकुर (Sprout)' : 'Sprout'}
                </span>
              </div>
            )}

            {stage === 'growing' && (
              <div className="flex flex-col items-center scale-110">
                <span className="text-5xl">🌿</span>
                <span className="text-xs font-black text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full mt-1">
                  {lang === 'hi' ? 'पौधा (Young Plant)' : 'Young Plant'}
                </span>
              </div>
            )}

            {stage === 'bloomed' && (
              <div className="flex flex-col items-center scale-125 animate-wiggle">
                <span className="text-6xl sm:text-7xl filter drop-shadow-md">🌻</span>
                <span className="text-xs font-black text-rose-800 bg-white/90 px-3 py-1 rounded-full mt-1 shadow">
                  {lang === 'hi' ? 'खिला हुआ फूल (Bloomed Flower) 🌟' : 'Bloomed Flower 🌟'}
                </span>
              </div>
            )}
          </div>

          {/* Plant Pot with Soil */}
          <div className="relative z-10 w-36 sm:w-44 h-16 sm:h-20 bg-gradient-to-b from-amber-700 to-amber-900 border-4 border-amber-950 rounded-b-3xl shadow-2xl flex items-start justify-center pt-1">
            <div className="w-full h-3 bg-amber-950/80 rounded-full mx-2" />
          </div>

          {/* Ground Layer */}
          <div className="w-full h-8 bg-amber-800 border-t-4 border-amber-900" />
        </div>

        {/* Interactive Lab Tools Bar */}
        <div className="mt-6 max-w-xl mx-auto">
          <p className="text-xs sm:text-sm font-black text-slate-700 mb-3 uppercase tracking-wider">
            🛠️ {lang === 'hi' ? 'वैज्ञानिक उपकरण (उपयुक्त उपकरण पर टैप करें):' : 'Scientist Tools (Tap appropriate tool):'}
          </p>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {/* Tool 1: Seed */}
            <button
              onClick={handlePlantSeed}
              disabled={stage !== 'empty-pot'}
              className={`p-3 sm:p-4 rounded-2xl border-4 flex flex-col items-center justify-center transition-all ${
                stage === 'empty-pot'
                  ? 'bg-amber-100 border-amber-400 hover:border-amber-600 hover:scale-105 active:scale-95 shadow-md cursor-pointer animate-pulse'
                  : 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="text-3xl sm:text-4xl mb-1">🌰</span>
              <span className="text-xs sm:text-sm font-black text-slate-800">
                1. {lang === 'hi' ? 'बीज बोओ' : 'Plant Seed'}
              </span>
            </button>

            {/* Tool 2: Water */}
            <button
              onClick={handleGiveWater}
              disabled={stage !== 'seeded' && stage !== 'sprouted'}
              className={`p-3 sm:p-4 rounded-2xl border-4 flex flex-col items-center justify-center transition-all ${
                stage === 'seeded' || stage === 'sprouted'
                  ? 'bg-sky-100 border-sky-400 hover:border-sky-600 hover:scale-105 active:scale-95 shadow-md cursor-pointer animate-pulse'
                  : 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="text-3xl sm:text-4xl mb-1">💧</span>
              <span className="text-xs sm:text-sm font-black text-slate-800">
                2. {lang === 'hi' ? 'पानी दो' : 'Add Water'}
              </span>
            </button>

            {/* Tool 3: Sunlight */}
            <button
              onClick={handleGiveSun}
              disabled={stage !== 'watered' && stage !== 'growing'}
              className={`p-3 sm:p-4 rounded-2xl border-4 flex flex-col items-center justify-center transition-all ${
                stage === 'watered' || stage === 'growing'
                  ? 'bg-yellow-100 border-yellow-400 hover:border-yellow-600 hover:scale-105 active:scale-95 shadow-md cursor-pointer animate-pulse'
                  : 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="text-3xl sm:text-4xl mb-1">☀️</span>
              <span className="text-xs sm:text-sm font-black text-slate-800">
                3. {lang === 'hi' ? 'धूप दिखाओ' : 'Give Sunlight'}
              </span>
            </button>
          </div>
        </div>

        {/* Science Lesson Card */}
        <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-left max-w-xl mx-auto">
          <h4 className="text-xs sm:text-sm font-black text-emerald-900 mb-1 flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'hi' ? 'विज्ञान तथ्य: पौधों को क्या चाहिए?' : 'Science Fact: What do plants need?'}</span>
          </h4>
          <p className="text-xs font-bold text-emerald-800 leading-relaxed">
            {lang === 'hi'
              ? 'पौधों को बढ़ने के लिए चार मुख्य चीजों की जरूरत होती है: 1) मिट्टी (Soil), 2) पानी (Water), 3) धूप (Sunlight), और 4) ताजी हवा (Air)। धूप की मदद से वे अपना खाना खुद बनाते हैं, जिसे प्रकाश संश्लेषण (Photosynthesis) कहते हैं!'
              : 'Plants need 4 essentials to grow: 1) Soil, 2) Water, 3) Sunlight, and 4) Air. Using sunlight, green leaves make sweet energy through Photosynthesis!'}
          </p>
        </div>
      </div>

      <RewardModal
        isOpen={showReward}
        lang={lang}
        starsEarned={15}
        title={lang === 'hi' ? 'फूल खिल गया! शाबाश!' : 'Flower Bloomed! Hooray!'}
        message={lang === 'hi' ? 'आपने सफलता पूर्वक एक पौधे को उगाना सीखा!' : 'You successfully learned how plants grow!'}
        onPlayAgain={() => {
          setStage('empty-pot');
          setShowReward(false);
        }}
        onGoHome={onBack}
      />
    </div>
  );
};
