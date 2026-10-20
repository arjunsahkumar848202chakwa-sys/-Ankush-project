import React, { useState } from 'react';
import { ArrowLeft, Volume2, Sparkles, HelpCircle, Send, Lightbulb } from 'lucide-react';
import { Language, QuestionCard } from '../types';
import { CURIOUS_QUESTIONS } from '../data/learningContent';
import { sound } from '../utils/audio';

interface CuriousQuestionsProps {
  lang: Language;
  onBack: () => void;
}

export const CuriousQuestions: React.FC<CuriousQuestionsProps> = ({ lang, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openCardId, setOpenCardId] = useState<string>(CURIOUS_QUESTIONS[0].id);
  const [userQuery, setUserQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const filteredQuestions = selectedCategory === 'all'
    ? CURIOUS_QUESTIONS
    : CURIOUS_QUESTIONS.filter(q => q.category === selectedCategory);

  const handleSpeak = (q: QuestionCard) => {
    sound.playPop();
    const text = lang === 'hi'
      ? `${q.questionHi} उत्तर: ${q.answerHi}. रोचक तथ्य: ${q.funFactHi}`
      : `${q.questionEn} Answer: ${q.answerEn}. Fun fact: ${q.funFactEn}`;
    sound.speak(text, lang);
  };

  const handleAskRobo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userQuery.trim()) return;

    sound.playPop();
    setIsAsking(true);
    setAiAnswer(null);

    const query = userQuery.trim();

    try {
      // Check if GEMINI_API_KEY is available in browser / env
      const apiKey = (import.meta as unknown as { env: { VITE_GEMINI_API_KEY?: string; GEMINI_API_KEY?: string } }).env.VITE_GEMINI_API_KEY || 
                     (import.meta as unknown as { env: { VITE_GEMINI_API_KEY?: string; GEMINI_API_KEY?: string } }).env.GEMINI_API_KEY;

      if (apiKey) {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are "रोबो जीनी" (Robo Geni), a warm, playful, delightful science and maths teacher for 5-9 year old kids. Answer in 2-3 enthusiastic, simple, easily understood sentences with emojis. If the user asks in Hindi, answer in friendly sweet Hindi. If English, answer in English.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemPrompt}\n\nKid asks: "${query}"`,
        });

        const reply = response.text || (lang === 'hi' ? 'बहुत अच्छा सवाल है दोस्त!' : 'Great question friend!');
        setAiAnswer(reply);
        sound.speak(reply, lang);
      } else {
        // Built-in intelligent answers
        setTimeout(() => {
          let fallback = '';
          const qLower = query.toLowerCase();
          if (qLower.includes('शून्य') || qLower.includes('zero')) {
            fallback = lang === 'hi'
              ? 'शून्य (0) की खोज महान भारतीय गणितज्ञ आर्यभट्ट जी के समय भारत में हुई थी! शून्य के बिना गणित आगे नहीं बढ़ सकता था!'
              : 'Zero was invented in ancient India! Without zero, modern mathematics, computers, and science wouldn’t exist!';
          } else if (qLower.includes('बिजली') || qLower.includes('thunder') || qLower.includes('lightning')) {
            fallback = lang === 'hi'
              ? 'बादलों के आपस में टकराने और घर्षण से तेज करंट (स्थैतिक बिजली) पैदा होती है! यह इतनी तेज चमकती है कि हवा गर्म होकर गूंजती है!'
              : 'Static electricity builds up when ice droplets rub inside thunderclouds. When it sparks down to Earth, that bright flash is lightning!';
          } else {
            fallback = lang === 'hi'
              ? `वाह! "${query}" बहुत ही प्यारा वैज्ञानिक सवाल है! विज्ञान हमें सिखाता है कि हर चीज़ के पीछे एक कारण और प्रकृति का सुंदर नियम होता है!`
              : `Wonderful scientific question about "${query}"! In science, everything happens because of curious natural laws and energy!`;
          }
          setAiAnswer(fallback);
          sound.speak(fallback, lang);
        }, 600);
      }
    } catch {
      const fallback = lang === 'hi'
        ? 'वाह! कितना बढ़िया सवाल! हमारे वैज्ञानिक भी इस पर लगातार नई खोजें करते रहते हैं!'
        : 'What a smart question! Scientists are always exploring and making new discoveries about this!';
      setAiAnswer(fallback);
      sound.speak(fallback, lang);
    } finally {
      setIsAsking(false);
    }
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-amber-300 font-bold text-amber-900 shadow-sm hover:bg-amber-50 active:scale-95 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-xs sm:text-sm font-black text-amber-900">
          <span>💡 {lang === 'hi' ? 'नन्हे सवाल - क्यों और कैसे?' : 'Curious Questions: Why & How?'}</span>
        </div>
      </div>

      {/* Hero Ask Box */}
      <div className="bg-gradient-to-r from-purple-500 via-indigo-600 to-sky-500 border-4 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-xl text-white mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl">
            🤖
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">
              {lang === 'hi' ? 'रोबो जीनी से अपना सवाल पूछो!' : 'Ask Robo Geni Anything!'}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-indigo-100">
              {lang === 'hi' ? 'विज्ञान या गणित का कोई भी सवाल पूछिए:' : 'Ask any science or maths question:'}
            </p>
          </div>
        </div>

        {/* Input box */}
        <form onSubmit={handleAskRobo} className="flex gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder={lang === 'hi' ? 'जैसे: शून्य की खोज किसने की? या बिजली क्यों कड़कती है?' : 'e.g., Why does lightning strike? Who found zero?'}
            className="flex-1 bg-white text-slate-800 font-bold px-4 py-2.5 rounded-2xl border-2 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm sm:text-base placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={isAsking || !userQuery.trim()}
            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-4 py-2.5 rounded-2xl active:scale-95 transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'पूछो' : 'Ask'}</span>
          </button>
        </form>

        {/* Quick query chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs font-bold text-indigo-100 self-center">
            {lang === 'hi' ? 'सुझाव:' : 'Try:'}
          </span>
          {[
            { hi: 'शून्य की खोज किसने की?', en: 'Who invented zero?' },
            { hi: 'बिजली क्यों कड़कती है?', en: 'Why does lightning strike?' },
            { hi: 'हवा का वजन होता है क्या?', en: 'Does air have weight?' },
          ].map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setUserQuery(lang === 'hi' ? item.hi : item.en);
              }}
              className="text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              {lang === 'hi' ? item.hi : item.en}
            </button>
          ))}
        </div>

        {/* AI Answer Box */}
        {aiAnswer && (
          <div className="mt-4 p-4 rounded-2xl bg-white/95 text-slate-900 border-2 border-amber-400 shadow-lg animate-scale-up">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-indigo-700 flex items-center gap-1">
                🤖 {lang === 'hi' ? 'रोबो जीनी का उत्तर:' : 'Robo Geni Answer:'}
              </span>
              <button
                type="button"
                onClick={() => sound.speak(aiAnswer, lang)}
                className="p-1 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900"
                title={lang === 'hi' ? 'सुनिए' : 'Listen'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
              {aiAnswer}
            </p>
          </div>
        )}
      </div>

      {/* Curated Questions Accordion List */}
      <div className="space-y-3">
        <h3 className="text-lg font-black text-amber-950 flex items-center gap-2">
          <span>🌟 {lang === 'hi' ? 'रोमांचक विज्ञान के रहस्य:' : 'Exciting Science Wonders:'}</span>
        </h3>

        {filteredQuestions.map((q) => {
          const isOpen = openCardId === q.id;

          return (
            <div
              key={q.id}
              className={`border-3 rounded-3xl bg-white shadow-md transition-all overflow-hidden ${
                isOpen ? 'border-amber-400 ring-2 ring-amber-200' : 'border-slate-200 hover:border-amber-300'
              }`}
            >
              {/* Question Header */}
              <div
                onClick={() => {
                  sound.playPop();
                  setOpenCardId(isOpen ? '' : q.id);
                }}
                className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">{q.icon}</span>
                  <h4 className="text-base sm:text-lg font-black text-slate-800 text-left">
                    {lang === 'hi' ? q.questionHi : q.questionEn}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(q);
                    }}
                    className="p-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                    title={lang === 'hi' ? 'सुनिए' : 'Listen'}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-bold text-amber-700">
                    {isOpen ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Answer Content */}
              {isOpen && (
                <div className="px-4 pb-4 pt-1 bg-amber-50/50 border-t border-amber-100 text-left animate-fade-in">
                  <p className="text-sm sm:text-base font-bold text-slate-700 leading-relaxed mb-3">
                    {lang === 'hi' ? q.answerHi : q.answerEn}
                  </p>
                  <div className="p-3 rounded-2xl bg-white border border-amber-200 flex items-start gap-2 shadow-sm">
                    <span className="text-xl">✨</span>
                    <p className="text-xs sm:text-sm font-extrabold text-amber-900">
                      <span className="underline">{lang === 'hi' ? 'रोचक तथ्य' : 'Fun Fact'}:</span>{' '}
                      {lang === 'hi' ? q.funFactHi : q.funFactEn}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
