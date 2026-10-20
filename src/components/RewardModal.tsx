import React, { useEffect } from 'react';
import { Star, RotateCcw, Home, ArrowRight, Award } from 'lucide-react';
import { Language } from '../types';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface RewardModalProps {
  isOpen: boolean;
  lang: Language;
  starsEarned: number;
  title?: string;
  message?: string;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onNextLevel?: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  lang,
  starsEarned,
  title,
  message,
  onPlayAgain,
  onGoHome,
  onNextLevel,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playFanfare();
      triggerConfetti(3000);
      const speech = lang === 'hi' 
        ? 'शाबाश! आपने कमाल कर दिया!' 
        : 'Awesome! You did a fantastic job!';
      sound.speak(speech, lang);
    }
  }, [isOpen, lang]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-gradient-to-b from-white via-amber-50 to-orange-50 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center overflow-hidden animate-scale-up">
        {/* Decorative background glow */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-yellow-300 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-rose-300 rounded-full blur-3xl opacity-50 pointer-events-none" />

        {/* Big Trophy / Medallion */}
        <div className="relative mx-auto mb-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white shadow-xl flex items-center justify-center animate-wiggle">
          <span className="text-5xl sm:text-6xl">🏆</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-black text-amber-900 mb-1">
          {title || (lang === 'hi' ? 'शानदार जीत! शाबाश!' : 'Super Victory! Yay!')}
        </h3>

        <p className="text-base sm:text-lg font-bold text-amber-800 mb-4">
          {message || (lang === 'hi' ? 'आपने यह स्तर सफलतापूर्वक पूरा कर लिया!' : 'You successfully completed this challenge!')}
        </p>

        {/* Stars earned badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black px-5 py-2.5 rounded-full shadow-md text-xl mb-6 border-2 border-amber-300">
          <Star className="w-6 h-6 fill-amber-100 text-amber-900 animate-spin-slow" />
          <span>+{starsEarned} {lang === 'hi' ? 'सितारे मिले!' : 'Stars Earned!'}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onNextLevel && (
            <button
              onClick={() => {
                sound.playPop();
                onNextLevel();
              }}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black py-3 px-5 rounded-2xl shadow-lg active:scale-95 transition-all text-base sm:text-lg"
            >
              <span>{lang === 'hi' ? 'अगला राउंड' : 'Next Round'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => {
              sound.playPop();
              onPlayAgain();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold py-3 px-4 rounded-2xl border-2 border-amber-300 active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{lang === 'hi' ? 'फिर से खेलो' : 'Play Again'}</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onGoHome();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold py-3 px-4 rounded-2xl border-2 border-rose-300 active:scale-95 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>{lang === 'hi' ? 'होम' : 'Home'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
