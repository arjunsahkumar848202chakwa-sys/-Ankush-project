import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  Star, 
  Award, 
  Compass, 
  HelpCircle, 
  Calculator, 
  FlaskConical, 
  Smile, 
  Heart 
} from 'lucide-react';
import { Language, GameId, GameCategory, Badge } from './types';
import { GAMES_LIST, INITIAL_BADGES } from './data/learningContent';
import { sound } from './utils/audio';

// Components
import { Header } from './components/Header';
import { Mascot } from './components/Mascot';
import { TrophyRoom } from './components/TrophyRoom';
import { CuriousQuestions } from './components/CuriousQuestions';

// Math Games
import { CountingGame } from './components/math/CountingGame';
import { AdditionSubtractionGame } from './components/math/AdditionSubtractionGame';
import { ShapesPatternsGame } from './components/math/ShapesPatternsGame';
import { SeesawGame } from './components/math/SeesawGame';

// Science Games
import { PlantGrowExperiment } from './components/science/PlantGrowExperiment';
import { SinkOrFloatExperiment } from './components/science/SinkOrFloatExperiment';
import { SolarSystemGame } from './components/science/SolarSystemGame';
import { AnimalHabitatsGame } from './components/science/AnimalHabitatsGame';
import { FiveSensesGame } from './components/science/FiveSensesGame';

// Kids 1000 GK Hub
import { KidsGkHub } from './components/gk/KidsGkHub';

// Ask Anything AI
import { AskGeniAnything } from './components/AskGeniAnything';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('lgw_lang') as Language) || 'hi';
  });
  const [stars, setStars] = useState<number>(() => {
    const saved = localStorage.getItem('lgw_stars');
    return saved ? parseInt(saved, 10) : 5; // starter stars
  });
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('lgw_player_name') || 'नन्हा जीनियस';
  });
  const [currentGame, setCurrentGame] = useState<GameId>('home');
  const [categoryFilter, setCategoryFilter] = useState<'all' | GameCategory>('all');
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('lgw_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('lgw_stars', String(stars));
  }, [stars]);

  useEffect(() => {
    localStorage.setItem('lgw_player_name', playerName);
  }, [playerName]);

  const handleAddStars = (n: number) => {
    sound.playStar();
    setStars(prev => prev + n);
  };

  const handleToggleLang = () => {
    const nextLang = lang === 'hi' ? 'en' : 'hi';
    setLang(nextLang);
    const greeting = nextLang === 'hi' ? 'नमस्ते! हिंदी भाषा चुनी गई।' : 'Hello! English selected.';
    sound.speak(greeting, nextLang);
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleNavigate = (game: GameId) => {
    sound.playPop();
    setCurrentGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredGames = categoryFilter === 'all'
    ? GAMES_LIST
    : GAMES_LIST.filter(g => g.category === categoryFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/40 to-yellow-50 flex flex-col font-['Baloo_2',sans-serif]">
      {/* Top Header */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        stars={stars}
        currentGame={currentGame}
        onNavigate={handleNavigate}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Render specific game if active */}
        {currentGame === 'math-counting' && (
          <CountingGame
            lang={lang}
            onAddStars={handleAddStars}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentGame === 'math-addition' && (
          <AdditionSubtractionGame
            lang={lang}
            onAddStars={handleAddStars}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentGame === 'math-shapes' && (
          <ShapesPatternsGame
            lang={lang}
            onAddStars={handleAddStars}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentGame === 'math-seesaw' && (
          <SeesawGame
            lang={lang}
            onAddStars={handleAddStars}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentGame === 'science-plant' && (
          <PlantGrowExperiment
            lang={lang}
            onAddStars={handleAddStars}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentGame === 'science-sinkfloat' && (
          <SinkOrFloatExperiment
            lang={lang}
            onAddStars={handleAddStars}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentGame === 'science-solar' && (
          <SolarSystemGame
            lang={lang}
            onAddStars={handleAddStars}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentGame === 'science-animals' && (
          <AnimalHabitatsGame
            lang={lang}
            onAddStars={handleAddStars}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentGame === 'science-senses' && (
          <FiveSensesGame
            lang={lang}
            onAddStars={handleAddStars}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentGame === 'kids-gk' && (
          <KidsGkHub
            lang={lang}
            onAddStars={handleAddStars}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentGame === 'ask-anything' && (
          <AskGeniAnything
            lang={lang}
            onAddStars={handleAddStars}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentGame === 'curious-why' && (
          <CuriousQuestions
            lang={lang}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentGame === 'trophy-room' && (
          <TrophyRoom
            lang={lang}
            stars={stars}
            playerName={playerName}
            onUpdatePlayerName={setPlayerName}
            badges={INITIAL_BADGES}
            onBack={() => handleNavigate('home')}
          />
        )}

        {/* Home Screen Dashboard */}
        {currentGame === 'home' && (
          <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 animate-fade-in">
            {/* Mascot Banner */}
            <Mascot
              lang={lang}
              customMessage={
                lang === 'hi'
                  ? `नमस्ते ${playerName}! आज हम गणित और विज्ञान में क्या नया खेलें? कोई भी खेल चुनो!`
                  : `Hello ${playerName}! What math or science adventure shall we play today? Pick a game!`
              }
            />

            {/* Hero Welcome Banner */}
            <div className="relative overflow-hidden my-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 border-4 border-amber-300 shadow-xl text-white select-none">
              {/* Background decorative doodles */}
              <div className="absolute top-2 right-4 text-6xl opacity-20 pointer-events-none animate-float">
                🚀
              </div>
              <div className="absolute bottom-2 left-6 text-5xl opacity-20 pointer-events-none animate-spin-slow">
                ⭐
              </div>
              <div className="absolute -bottom-6 right-20 text-6xl opacity-20 pointer-events-none">
                🌱
              </div>

              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs sm:text-sm font-black mb-2 border border-white/30">
                  <Sparkles className="w-4 h-4 text-yellow-200" />
                  {lang === 'hi' ? 'खेल-खेल में सीखो और जीतो!' : 'Play, Learn & Win Stars!'}
                </span>

                <h2 className="text-2xl sm:text-4xl font-black leading-tight drop-shadow-sm mb-2">
                  {lang === 'hi' ? (
                    <>
                      नन्हे जीनियस की दुनिया में <span className="text-yellow-200 underline">स्वागत है!</span>
                    </>
                  ) : (
                    <>
                      Welcome to <span className="text-yellow-200 underline">Little Genius World!</span>
                    </>
                  )}
                </h2>

                <p className="text-sm sm:text-base font-bold text-amber-50 leading-relaxed mb-4">
                  {lang === 'hi'
                    ? 'यहाँ बच्चे फलों को गिनते हैं, प्यारे खरगोशों से जोड़-घटाव सीखते हैं, बीज से फूल उगाते हैं और अंतरिक्ष के ग्रहों की सैर करते हैं!'
                    : 'Count fresh fruits, learn math with cute animals, grow plants from seeds, and explore the planets of our solar system!'}
                </p>

                {/* Quick Action Chips */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => handleNavigate('ask-anything')}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black px-4 py-2 rounded-2xl shadow-lg active:scale-95 transition-all text-xs sm:text-sm cursor-pointer border-2 border-white animate-bounce"
                  >
                    <span>🤖 {lang === 'hi' ? 'कोई भी सवाल पूछो!' : 'Ask Anything!'}</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('kids-gk')}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-yellow-400 hover:from-red-600 hover:to-amber-500 text-white font-black px-4 py-2 rounded-2xl shadow-lg active:scale-95 transition-all text-xs sm:text-sm cursor-pointer border-2 border-white animate-pulse"
                  >
                    <span>🔥 {lang === 'hi' ? '2000 GK रील्स' : '2000 GK Reels'}</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('math-counting')}
                    className="flex items-center gap-1.5 bg-white text-amber-900 hover:bg-amber-50 font-black px-4 py-2 rounded-2xl shadow-md active:scale-95 transition-all text-xs sm:text-sm cursor-pointer"
                  >
                    <span>🍎 {lang === 'hi' ? 'फल गिनो' : 'Count Fruits'}</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('science-plant')}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-2xl shadow-md active:scale-95 transition-all text-xs sm:text-sm cursor-pointer"
                  >
                    <span>🌱 {lang === 'hi' ? 'पौधा उगाओ' : 'Grow Plant'}</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('curious-why')}
                    className="flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white font-black px-4 py-2 rounded-2xl shadow-md active:scale-95 transition-all text-xs sm:text-sm cursor-pointer"
                  >
                    <span>💡 {lang === 'hi' ? 'क्यों और कैसे?' : 'Why & How?'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center justify-center gap-2 my-6 flex-wrap select-none">
              <button
                onClick={() => {
                  sound.playPop();
                  setCategoryFilter('all');
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-amber-500 border-amber-600 text-white shadow-md scale-105'
                    : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-50'
                }`}
              >
                <span>🌈</span>
                <span>{lang === 'hi' ? 'सभी खेल' : 'All Games'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setCategoryFilter('gk');
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                  categoryFilter === 'gk'
                    ? 'bg-gradient-to-r from-red-500 to-amber-500 border-red-600 text-white shadow-md scale-105'
                    : 'bg-white border-amber-300 text-amber-900 hover:bg-amber-50'
                }`}
              >
                <span>🔥</span>
                <span>{lang === 'hi' ? '2000 GK रील्स व क्विज़' : '2000 GK Reels & Quiz'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setCategoryFilter('math');
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                  categoryFilter === 'math'
                    ? 'bg-rose-500 border-rose-600 text-white shadow-md scale-105'
                    : 'bg-white border-rose-200 text-rose-900 hover:bg-rose-50'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>{lang === 'hi' ? 'गणित का जादू (Maths)' : 'Maths Magic'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setCategoryFilter('science');
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                  categoryFilter === 'science'
                    ? 'bg-emerald-600 border-emerald-700 text-white shadow-md scale-105'
                    : 'bg-white border-emerald-200 text-emerald-900 hover:bg-emerald-50'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span>{lang === 'hi' ? 'विज्ञान की दुनिया (Science)' : 'Science Wonder'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setCategoryFilter('explore');
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                  categoryFilter === 'explore'
                    ? 'bg-purple-600 border-purple-700 text-white shadow-md scale-105'
                    : 'bg-white border-purple-200 text-purple-900 hover:bg-purple-50'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>{lang === 'hi' ? 'क्यों और कैसे? (Curious)' : 'Curious Q&A'}</span>
              </button>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  onClick={() => handleNavigate(game.id)}
                  className="group relative bg-white border-4 border-amber-200 hover:border-amber-400 rounded-3xl p-5 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-98 select-none"
                >
                  {/* Category Pill Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                        game.category === 'math'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : game.category === 'science'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      {lang === 'hi' ? game.badgeTagHi : game.badgeTagEn}
                    </span>

                    <span className="text-xs font-black text-amber-500 flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      +3~15
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${game.bgGradient} flex items-center justify-center text-3xl sm:text-4xl shadow-md group-hover:scale-110 transition-transform`}
                    >
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-tight group-hover:text-amber-800 transition-colors">
                        {lang === 'hi' ? game.titleHi : game.titleEn}
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1 line-clamp-2">
                        {lang === 'hi' ? game.subtitleHi : game.subtitleEn}
                      </p>
                    </div>
                  </div>

                  {/* Play Button Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700">
                      {lang === 'hi' ? 'खेलने के लिए टैप करें' : 'Tap to start'}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-black bg-amber-400 group-hover:bg-amber-500 text-amber-950 px-3 py-1.5 rounded-xl shadow-sm transition-colors">
                      <Play className="w-3.5 h-3.5 fill-amber-950" />
                      <span>{lang === 'hi' ? 'चलो खेलें' : 'Play'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Safe & Educational Badge */}
            <div className="mt-12 text-center p-4 bg-white/60 border-2 border-amber-200 rounded-3xl max-w-xl mx-auto flex items-center justify-center gap-3 shadow-xs">
              <span className="text-2xl">🛡️</span>
              <p className="text-xs sm:text-sm font-bold text-amber-900">
                {lang === 'hi'
                  ? 'बच्चों के लिए 100% सुरक्षित, विज्ञापन-मुक्त और खेल-खेल में ज्ञान बढ़ाने वाला ऐप!'
                  : '100% Kid-Safe, Ad-Free and designed for joyful foundational learning!'}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Playful Footer */}
      <footer className="bg-white border-t-2 border-amber-200 py-4 px-4 text-center select-none">
        <p className="text-xs sm:text-sm font-black text-amber-900 flex items-center justify-center gap-1.5">
          <span>Little Genius World</span>
          <span>•</span>
          <span>{lang === 'hi' ? 'बच्चों का सीखने वाला गेम' : 'Kids Learning World'}</span>
          <span>•</span>
          <span className="text-rose-500 flex items-center gap-0.5">
            <Heart className="w-3.5 h-3.5 fill-rose-500 inline" />
          </span>
        </p>
      </footer>
    </div>
  );
}
