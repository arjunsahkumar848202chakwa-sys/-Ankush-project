import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { Language } from '../types';
import { sound } from '../utils/audio';

interface MascotProps {
  lang: Language;
  customMessage?: string;
}

export const Mascot: React.FC<MascotProps> = ({ lang, customMessage }) => {
  const [bounce, setBounce] = useState(false);

  const defaultMsgHi = "नमस्ते दोस्त! मैं हूँ रोबो जीनी 🤖 चलो मिलकर नई चीजें सीखते हैं!";
  const defaultMsgEn = "Hello friend! I am Robo Geni 🤖 Let's play and learn together!";

  const currentMsg = customMessage || (lang === 'hi' ? defaultMsgHi : defaultMsgEn);

  const handleSpeak = () => {
    setBounce(true);
    sound.playPop();
    sound.speak(currentMsg, lang);
    setTimeout(() => setBounce(false), 800);
  };

  return (
    <div className="flex items-center gap-3 bg-white/90 backdrop-blur border-2 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-md max-w-xl mx-auto my-2">
      {/* Animated Mascot Avatar */}
      <button
        onClick={handleSpeak}
        title={lang === 'hi' ? 'मुझसे बात करो!' : 'Tap me to hear!'}
        className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-400 to-purple-500 flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer ${
          bounce ? 'animate-bounce' : 'animate-float'
        }`}
      >
        <span className="text-3xl sm:text-4xl">🤖</span>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border border-white"></span>
        </span>
      </button>

      {/* Mascot Speech Bubble */}
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="text-xs font-black text-indigo-700 uppercase tracking-wide">
            {lang === 'hi' ? 'रोबो जीनी कहता है:' : 'Robo Geni says:'}
          </span>
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full transition-colors"
          >
            <Volume2 className="w-3 h-3" />
            <span>{lang === 'hi' ? 'सुनो' : 'Listen'}</span>
          </button>
        </div>
        <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
          {currentMsg}
        </p>
      </div>
    </div>
  );
};
