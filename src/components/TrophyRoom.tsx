import React, { useState } from 'react';
import { ArrowLeft, Award, Star, Lock, Sparkles, CheckCircle2, User, Printer } from 'lucide-react';
import { Language, Badge } from '../types';
import { sound } from '../utils/audio';

interface TrophyRoomProps {
  lang: Language;
  stars: number;
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
  badges: Badge[];
  onBack: () => void;
}

export const TrophyRoom: React.FC<TrophyRoomProps> = ({
  lang,
  stars,
  playerName,
  onUpdatePlayerName,
  badges,
  onBack,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      sound.playPop();
      onUpdatePlayerName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const unlockedCount = badges.filter(b => stars >= b.requiredStars).length;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            sound.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-amber-300 font-bold text-amber-900 shadow-sm hover:bg-amber-50 active:scale-95 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-xs sm:text-sm font-black text-amber-900">
          <span>🏆 {lang === 'hi' ? 'ट्रॉफी रूम' : 'Trophy Room'}</span>
        </div>
      </div>

      {/* Player Profile & Stats Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 border-4 border-white rounded-3xl p-5 sm:p-6 shadow-xl text-white mb-6 select-none">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-4xl sm:text-5xl flex items-center justify-center shadow-lg border-4 border-amber-200 animate-wiggle">
              🧑‍🎓
            </div>
            <div className="text-center sm:text-left">
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex gap-1.5 items-center">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    maxLength={15}
                    className="bg-white text-slate-800 font-black px-2.5 py-1 rounded-xl text-sm w-36 outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded-xl text-xs"
                  >
                    OK
                  </button>
                </form>
              ) : (
                <div 
                  onClick={() => setIsEditingName(true)}
                  className="group flex items-center gap-1.5 cursor-pointer"
                  title={lang === 'hi' ? 'नाम बदलने के लिए टैप करें' : 'Tap to edit name'}
                >
                  <h2 className="text-xl sm:text-2xl font-black text-amber-950 group-hover:underline">
                    {playerName}
                  </h2>
                  <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full font-bold">
                    ✏️ {lang === 'hi' ? 'बदलें' : 'Edit'}
                  </span>
                </div>
              )}
              <p className="text-xs sm:text-sm font-bold text-amber-950/80">
                {lang === 'hi' ? 'नन्हा जीनियस वैज्ञानिक' : 'Little Genius Explorer'}
              </p>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-2xl border border-white/40 text-center">
              <div className="text-xs font-black uppercase text-amber-100">
                {lang === 'hi' ? 'कुल सितारे' : 'Total Stars'}
              </div>
              <div className="text-2xl font-black text-amber-950 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span>{stars}</span>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-2xl border border-white/40 text-center">
              <div className="text-xs font-black uppercase text-amber-100">
                {lang === 'hi' ? 'जीते मेडल' : 'Badges'}
              </div>
              <div className="text-2xl font-black text-amber-950 flex items-center justify-center gap-1">
                <Award className="w-5 h-5 text-amber-950" />
                <span>{unlockedCount} / {badges.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Button */}
        <div className="mt-4 pt-3 border-t border-white/30 flex justify-center sm:justify-end">
          <button
            onClick={() => {
              sound.playStar();
              setShowCertificate(true);
            }}
            className="flex items-center gap-2 bg-white text-amber-900 hover:bg-amber-50 font-black px-4 py-2 rounded-2xl shadow-md active:scale-95 transition-all text-xs sm:text-sm cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>{lang === 'hi' ? 'सम्मान प्रमाण-पत्र देखें (Certificate)' : 'View Certificate of Achievement'}</span>
          </button>
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="bg-white border-4 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-xl">
        <h3 className="text-lg sm:text-xl font-black text-amber-950 mb-4 flex items-center gap-2">
          <span>🎖️ {lang === 'hi' ? 'आपके जादुई मेडल और उपलब्धियाँ:' : 'Your Magical Badges & Trophies:'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {badges.map((badge) => {
            const isUnlocked = stars >= badge.requiredStars;

            return (
              <div
                key={badge.id}
                className={`relative p-4 rounded-3xl border-3 flex items-center gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-tr from-amber-50 to-yellow-50 border-amber-300 shadow-md'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-white animate-wiggle'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isUnlocked ? badge.icon : <Lock className="w-6 h-6 text-slate-400" />}
                </div>

                <div className="flex-1 text-left">
                  <h4 className="text-base font-black text-slate-800 leading-tight">
                    {lang === 'hi' ? badge.titleHi : badge.titleEn}
                  </h4>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    {lang === 'hi' ? badge.descHi : badge.descEn}
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-[11px] font-black">
                    {isUnlocked ? (
                      <span className="text-emerald-600 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {lang === 'hi' ? 'अनलॉक हुआ!' : 'Unlocked!'}
                      </span>
                    ) : (
                      <span className="text-amber-700 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {lang === 'hi' ? `${badge.requiredStars} सितारे चाहिए` : `Need ${badge.requiredStars} Stars`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-gradient-to-b from-amber-50 via-white to-amber-50 border-8 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-center">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setShowCertificate(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="text-4xl sm:text-5xl mb-2">🏅</div>
            <h3 className="text-xs uppercase tracking-widest font-black text-amber-700 mb-1">
              Little Genius World
            </h3>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-950 mb-3 border-b-2 border-amber-300 pb-2">
              {lang === 'hi' ? 'सम्मान प्रमाण-पत्र' : 'Certificate of Excellence'}
            </h2>

            <p className="text-sm font-bold text-slate-600 mb-2">
              {lang === 'hi' ? 'यह गौरवमयी सम्मान दिया जाता है हमारे नन्हे वैज्ञानिक:' : 'This proud award is presented to our Little Explorer:'}
            </p>

            <div className="my-3 py-2 px-6 bg-gradient-to-r from-amber-200 to-yellow-200 border-2 border-amber-400 rounded-2xl inline-block shadow-inner">
              <span className="text-2xl sm:text-3xl font-black text-amber-950">{playerName}</span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed mb-6">
              {lang === 'hi'
                ? `खेल-खेल में गणित और विज्ञान की बुनियादी अवधारणाओं को सफलतापूर्वक सीखने और ${stars} सितारे अर्जित करने के उपलक्ष्य में!`
                : `For outstanding curiosity, mastering math and science foundations, and collecting ${stars} shining stars!`}
            </p>

            <div className="flex items-center justify-between border-t border-amber-200 pt-3 text-xs font-black text-amber-900">
              <span>🌟 Little Genius World</span>
              <span>🤖 रोबो जीनी (Robo Geni)</span>
            </div>

            <button
              onClick={() => {
                sound.playPop();
                window.print();
              }}
              className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-6 py-2.5 rounded-2xl shadow-lg active:scale-95 transition-all text-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'hi' ? 'प्रमाण-पत्र प्रिंट करें' : 'Print Certificate'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
