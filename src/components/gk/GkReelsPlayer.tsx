import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Heart, 
  ThumbsUp, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  Maximize2,
  ListFilter
} from 'lucide-react';
import { Language, GkQuestion } from '../../types';
import { ALL_1000_GK } from '../../data/kidsGkData';
import { sound } from '../../utils/audio';

interface GkReelsPlayerProps {
  lang: Language;
  onAddStars: (n: number) => void;
  onBack: () => void;
}

export const GkReelsPlayer: React.FC<GkReelsPlayerProps> = ({
  lang,
  onAddStars,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('lgw_reel_index');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [autoNext, setAutoNext] = useState<boolean>(true);
  const [likeCount, setLikeCount] = useState<number>(1284);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [jumpInput, setJumpInput] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQ = ALL_1000_GK[currentIndex] || ALL_1000_GK[0];

  // Save current index
  useEffect(() => {
    localStorage.setItem('lgw_reel_index', String(currentIndex));
  }, [currentIndex]);

  // Handle Question Change: Reset state, start voiceover & timer
  useEffect(() => {
    setTimeLeft(5);
    setIsAnswerRevealed(false);
    setSelectedOption(null);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (isPlaying) {
      // Speak Question & Options in Hindi
      if (voiceEnabled) {
        const letters = ['A', 'B', 'C', 'D'];
        const qSpeech = `आपका सवाल है: ${currentQ.questionHi}. आपके ऑप्शन हैं: A: ${currentQ.optionsHi[0]}. B: ${currentQ.optionsHi[1]}. C: ${currentQ.optionsHi[2]}. D: ${currentQ.optionsHi[3]}.`;
        sound.speak(qSpeech, 'hi');
      }

      // Start 5-second countdown timer
      let counter = 5;
      timerRef.current = setInterval(() => {
        counter -= 1;
        setTimeLeft(counter);
        sound.playTick();

        if (counter <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          revealAnswer();
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPlaying]);

  const revealAnswer = () => {
    setIsAnswerRevealed(true);
    sound.playBuzzer();
    sound.playCorrect();
    onAddStars(3);

    const letters = ['A', 'B', 'C', 'D'];
    const correctLetter = letters[currentQ.correctIndex];
    const correctText = currentQ.optionsHi[currentQ.correctIndex];

    if (voiceEnabled) {
      setTimeout(() => {
        sound.speak(`इसका सही जवाब है: ऑप्शन ${correctLetter}: ${correctText}!`, 'hi');
      }, 500);
    }

    // Auto next after 4 seconds if autoNext is on
    if (autoNext) {
      setTimeout(() => {
        handleNext();
      }, 4500);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    revealAnswer();
  };

  const handleNext = () => {
    sound.playPop();
    if (currentIndex + 1 < ALL_1000_GK.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handlePrev = () => {
    sound.playPop();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(jumpInput, 10);
    if (!isNaN(val) && val >= 1 && val <= ALL_1000_GK.length) {
      sound.playPop();
      setCurrentIndex(val - 1);
      setJumpInput('');
    }
  };

  const handleLike = () => {
    sound.playStar();
    if (!hasLiked) {
      setHasLiked(true);
      setLikeCount(prev => prev + 1);
      sound.speak('जय हिंद! तिरंगे के लिए धन्यवाद!', 'hi');
    }
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <button
          onClick={() => {
            sound.stopSpeaking();
            sound.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-amber-300 font-bold text-amber-900 shadow-sm hover:bg-amber-50 active:scale-95 transition-all text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'मुख्य पृष्ठ' : 'Back'}</span>
        </button>

        {/* Jump to question form */}
        <form onSubmit={handleJump} className="flex items-center gap-1">
          <input
            type="number"
            min={1}
            max={ALL_1000_GK.length}
            placeholder={`1 - ${ALL_1000_GK.length}`}
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
            className="w-24 px-2 py-1 bg-white border-2 border-purple-300 rounded-xl text-xs font-black text-center outline-none"
          />
          <button
            type="submit"
            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow active:scale-95 cursor-pointer"
          >
            Go
          </button>
        </form>

        {/* Audio voice toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setVoiceEnabled(v => !v);
              if (voiceEnabled) sound.stopSpeaking();
            }}
            className={`p-2 rounded-xl border-2 transition-all ${
              voiceEnabled ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
            title="Voice Narration On/Off"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setAutoNext(a => !a)}
            className={`px-3 py-1 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
              autoNext ? 'bg-emerald-500 text-white border-emerald-600 shadow' : 'bg-white text-slate-600 border-slate-300'
            }`}
          >
            ⚡ {autoNext ? 'ऑटो रील्स चालू' : 'ऑटो रील्स बंद'}
          </button>
        </div>
      </div>

      {/* REELS / SHORTS CANVAS FRAME (Matches video style) */}
      <div className="relative mx-auto w-full max-w-[420px] bg-white border-4 border-purple-600 rounded-[32px] shadow-2xl overflow-hidden flex flex-col justify-between select-none">
        {/* Top Video Header: Yellow bar with flame emojis and "Gk Challenge" */}
        <div className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 border-b-4 border-purple-600 py-2.5 px-4 flex items-center justify-center gap-2 shadow-sm">
          <span className="text-2xl animate-pulse">🔥</span>
          <h2 className="text-xl sm:text-2xl font-black text-purple-900 tracking-wide font-sans">
            Gk Challenge
          </h2>
          <span className="text-2xl animate-pulse">🔥</span>
        </div>

        {/* Question Counter Pill */}
        <div className="flex items-center justify-between px-4 pt-2">
          <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            GK #{currentIndex + 1} / {ALL_1000_GK.length}
          </span>
          <span className="text-[11px] font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            {currentQ.categoryHi}
          </span>
        </div>

        {/* Question Section: Red Bold Text */}
        <div className="px-5 pt-3 pb-2 text-center">
          <h3 className="text-2xl sm:text-3xl font-black text-red-600 leading-snug tracking-tight">
            Q. {currentQ.questionHi}
          </h3>
        </div>

        {/* Watermark / Channel Tag */}
        <div className="text-center my-0.5">
          <span className="inline-block text-[10px] font-black tracking-widest text-red-700 border border-red-300 bg-red-50/70 px-2 py-0.5 rounded">
            LITTLE GENIUS GK
          </span>
        </div>

        {/* Middle Body: Split layout (Left: Options, Right: Real Image) */}
        <div className="relative px-5 py-2 flex items-center justify-between gap-2 min-h-[220px]">
          {/* Left Column: Options A, B, C, D */}
          <div className="flex-1 space-y-2 z-10">
            {currentQ.optionsHi.map((opt, i) => {
              const isCorrect = i === currentQ.correctIndex;
              const isSelected = selectedOption === i;

              // Border styling matching the video (Red box on correct answer reveal)
              let borderClass = 'border-transparent text-slate-900';
              if (isAnswerRevealed && isCorrect) {
                borderClass = 'border-4 border-red-600 bg-red-50 text-red-950 font-black shadow-lg scale-102';
              } else if (isSelected && !isCorrect) {
                borderClass = 'border-2 border-slate-400 bg-slate-100 text-slate-500 line-through';
              }

              return (
                <div
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  className={`p-2 rounded-2xl flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${borderClass}`}
                >
                  <span className="text-xl sm:text-2xl font-black text-slate-900 w-8">
                    {letters[i]}.
                  </span>
                  <span className="text-lg sm:text-xl font-black tracking-wide">
                    {opt}
                  </span>
                  {isAnswerRevealed && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-red-600 ml-auto animate-bounce" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Real Image / Illustration ("ek side Hona chahie real") */}
          <div className="w-36 sm:w-44 h-48 sm:h-52 flex-shrink-0 flex flex-col items-center justify-center p-1 relative">
            <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-amber-50 to-orange-100 border-2 border-amber-300 shadow-md overflow-hidden flex flex-col items-center justify-center p-2 relative group">
              {currentQ.imageUrl ? (
                <img
                  src={currentQ.imageUrl}
                  alt={currentQ.imageLabel || currentQ.questionHi}
                  className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    // Fallback to high-quality SVG icon if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}

              {/* High-fidelity visual fallback / companion representation */}
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-6xl sm:text-7xl filter drop-shadow-md animate-float">
                  {currentQ.icon}
                </span>
                <span className="text-xs font-black text-amber-950 mt-1 px-2 py-0.5 rounded-full bg-white/90 shadow-sm border border-amber-200">
                  {currentQ.imageLabel || currentQ.optionsHi[currentQ.correctIndex]}
                </span>
              </div>

              {/* "REAL" Badge */}
              <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded shadow">
                REAL
              </span>
            </div>
          </div>
        </div>

        {/* 5-Second Countdown Timer Circle (matches video style at 00:12) */}
        <div className="relative py-2 flex flex-col items-center justify-center">
          <div className="relative w-14 h-14 flex items-center justify-center">
            {/* Circular Timer Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-1000 ${
                  timeLeft <= 2 ? 'text-red-600' : 'text-blue-600'
                }`}
                strokeDasharray={`${(timeLeft / 5) * 100}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span
              className={`absolute text-2xl font-black ${
                timeLeft <= 2 ? 'text-red-600 animate-ping-once' : 'text-blue-700'
              }`}
            >
              {timeLeft > 0 ? timeLeft : '0'}
            </span>
          </div>

          <span className="text-[11px] font-bold text-slate-500 mt-0.5">
            {isAnswerRevealed ? 'समय समाप्त (Time Up!)' : 'समय चल रहा है...'}
          </span>
        </div>

        {/* Patriotic Like Banner (from video) */}
        <div className="mx-4 my-2 p-2 rounded-2xl bg-gradient-to-r from-orange-100 via-white to-green-100 border border-amber-300 flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl animate-wiggle">🇮🇳</span>
            <p className="text-[11px] font-extrabold text-slate-800 leading-tight">
              तिरंगे के लिए 1 लाइक जरूर करें!
            </p>
          </div>
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl font-black text-xs shadow transition-all active:scale-90 cursor-pointer ${
              hasLiked
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:bg-blue-50 text-blue-700 border border-blue-300'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{likeCount}</span>
          </button>
        </div>

        {/* Fun Fact / Answer Banner */}
        {isAnswerRevealed && (
          <div className="mx-4 mb-2 p-2.5 rounded-2xl bg-yellow-50 border-2 border-yellow-300 text-left animate-fade-in">
            <p className="text-xs font-black text-yellow-900 flex items-center gap-1">
              <span>💡 सही उत्तर:</span>
              <span className="text-red-600 font-black underline">
                ऑप्शन {letters[currentQ.correctIndex]}: {currentQ.optionsHi[currentQ.correctIndex]}
              </span>
            </p>
            <p className="text-[11px] font-bold text-yellow-800 mt-0.5 leading-snug">
              {currentQ.funFactHi}
            </p>
          </div>
        )}

        {/* Bottom Video Player Action Bar */}
        <div className="bg-slate-50 border-t-2 border-purple-200 p-3 flex items-center justify-between gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 active:scale-95 disabled:opacity-30 cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
            <span>पिछला</span>
          </button>

          <button
            onClick={() => setIsPlaying(p => !p)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'रोकें' : 'चलाएं'}</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 cursor-pointer"
          >
            <span>अगला</span>
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
