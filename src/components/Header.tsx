import React from 'react';
import { Volume2, VolumeX, Award, Home, Star, Sparkles } from 'lucide-react';
import { Language, GameId } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  stars: number;
  currentGame: GameId;
  onNavigate: (game: GameId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  stars,
  currentGame,
  onNavigate,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b-4 border-amber-300 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Logo / Brand */}
        <div 
          onClick={() => {
            sound.playPop();
            onNavigate('home');
          }}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-2xl sm:text-3xl animate-bounce">🌟</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-amber-900 tracking-tight leading-none group-hover:text-amber-700 transition-colors">
              Little Genius <span className="text-rose-500">World</span>
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-amber-700 hidden sm:block">
              {lang === 'hi' ? 'बच्चों का सीखने वाला जादुई गेम' : 'Kids Fun Learning Game'}
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Stars Counter */}
          <div 
            onClick={() => {
              sound.playStar();
              onNavigate('trophy-room');
            }}
            title={lang === 'hi' ? 'आपके कुल सितारे' : 'Your Total Stars'}
            className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-amber-100 to-yellow-200 border-2 border-amber-400 px-2.5 sm:px-4 py-1.5 rounded-full shadow-sm hover:scale-105 active:scale-95 cursor-pointer transition-all"
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400 animate-spin-slow" />
            <span className="text-base sm:text-lg font-black text-amber-900">{stars}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600 hidden sm:inline" />
          </div>

          {/* Home Button if inside a game */}
          {currentGame !== 'home' && (
            <button
              onClick={() => {
                sound.playPop();
                onNavigate('home');
              }}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-800 border-2 border-sky-300 font-bold text-xs sm:text-sm active:scale-95 transition-all"
              title={lang === 'hi' ? 'मुख्य पृष्ठ' : 'Go Home'}
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">{lang === 'hi' ? 'होम' : 'Home'}</span>
            </button>
          )}

          {/* Ask Anything AI Button */}
          <button
            onClick={() => {
              sound.playPop();
              onNavigate('ask-anything');
            }}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full font-black text-xs sm:text-sm border-2 active:scale-95 transition-all cursor-pointer ${
              currentGame === 'ask-anything'
                ? 'bg-purple-600 text-white border-purple-700 shadow'
                : 'bg-purple-100 hover:bg-purple-200 text-purple-900 border-purple-300'
            }`}
            title={lang === 'hi' ? 'रोबो जीनी से कोई भी सवाल पूछें' : 'Ask Robo Geni Anything'}
          >
            <span>🤖</span>
            <span className="hidden sm:inline">{lang === 'hi' ? 'सवाल पूछो' : 'Ask AI'}</span>
          </button>

          {/* Trophy Room Button */}
          <button
            onClick={() => {
              sound.playPop();
              onNavigate('trophy-room');
            }}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm border-2 active:scale-95 transition-all ${
              currentGame === 'trophy-room'
                ? 'bg-amber-500 text-white border-amber-600 shadow'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300'
            }`}
            title={lang === 'hi' ? 'ट्रॉफी और मेडल' : 'Trophies & Badges'}
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'ट्रॉफी रूम' : 'Badges'}</span>
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            className={`p-2 rounded-full border-2 transition-all active:scale-90 ${
              isMuted
                ? 'bg-rose-100 text-rose-600 border-rose-300'
                : 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200'
            }`}
            title={isMuted ? (lang === 'hi' ? 'आवाज चालू करें' : 'Turn Sound On') : (lang === 'hi' ? 'आवाज बंद करें' : 'Turn Sound Off')}
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Language Toggle (Hindi / English) */}
          <button
            onClick={() => {
              sound.playPop();
              onToggleLang();
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
            title="Change Language / भाषा बदलें"
          >
            <span>{lang === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
