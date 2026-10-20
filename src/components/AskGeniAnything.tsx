import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  RotateCcw,
  Bot,
  MessageCircleQuestion,
  Star
} from 'lucide-react';
import { Language } from '../types';
import { sound } from '../utils/audio';

interface AskGeniAnythingProps {
  lang: Language;
  onAddStars: (n: number) => void;
  onBack: () => void;
}

interface QnaHistoryItem {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

const POPULAR_QUESTIONS_HI = [
  'डायनासोर धरती से कैसे गायब हुए? 🦕',
  'सूरज में इतनी गर्मी और रोशनी कहाँ से आती है? ☀️',
  'आसमान में बादल कैसे बनते हैं और बारिश क्यों होती है? 🌧️',
  'समुद्र का पानी खारा (नमकीन) क्यों होता है? 🌊',
  'हवाई जहाज इतना भारी होकर भी हवा में कैसे उड़ता है? ✈️',
  'पेड़-पौधे धूप से अपना खाना कैसे बनाते हैं? 🍃',
  'चाँद पर गुरुत्वाकर्षण (Gravity) कम क्यों होता है? 🌕',
  'कंप्यूटर इंसानों की तरह कैसे काम करता है? 💻',
  'हमारे शरीर में हड्डियाँ कैसे मजबूत बनती हैं? 🦴',
  'तारे रात में क्यों टिमटिमाते हैं? ✨',
];

const POPULAR_QUESTIONS_EN = [
  'How did dinosaurs go extinct? 🦕',
  'Where does the Sun get all its energy and light? ☀️',
  'How do clouds form and why does it rain? 🌧️',
  'Why is ocean water salty? 🌊',
  'How do heavy airplanes fly in the sky? ✈️',
  'How do plants make food using sunlight? 🍃',
  'Why is gravity weaker on the Moon? 🌕',
  'How do computers process information? 💻',
  'How do bones in our body grow strong? 🦴',
  'Why do stars twinkle in the night sky? ✨',
];

export const AskGeniAnything: React.FC<AskGeniAnythingProps> = ({
  lang,
  onAddStars,
  onBack,
}) => {
  const [query, setQuery] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState<QnaHistoryItem[]>(() => {
    const saved = localStorage.getItem('lgw_ask_history');
    return saved ? JSON.parse(saved) : [];
  });

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('lgw_ask_history', JSON.stringify(history.slice(0, 15)));
  }, [history]);

  // Initial welcome greeting
  useEffect(() => {
    const welcome = lang === 'hi'
      ? 'मुझसे कोई भी सवाल पूछिए! चाहे विज्ञान हो, प्रकृति, अंतरिक्ष या रोजमर्रा की बातें, मैं आपके हर सवाल का जवाब दूँगा!'
      : 'Ask me any question! Whether it is science, nature, animals, space or daily curiosities, I will answer everything!';
    sound.speak(welcome, lang);
  }, [lang]);

  // Speech Recognition setup (Web Speech API)
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const errorMsg = lang === 'hi' 
        ? 'आपके ब्राउज़र में आवाज़ पहचानने की सुविधा उपलब्ध नहीं है, कृपया नीचे लिखकर पूछें।' 
        : 'Speech recognition is not supported in this browser. Please type your question below.';
      sound.speak(errorMsg, lang);
      return;
    }

    try {
      sound.playPop();
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        handleAsk(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleAsk = async (textToAsk?: string) => {
    const qText = (textToAsk || query).trim();
    if (!qText) return;

    sound.playPop();
    setIsLoading(true);
    setCurrentAnswer(null);
    setLastQuestion(qText);

    try {
      const res = await fetch('/api/ask-anything', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: qText,
          lang,
        }),
      });

      const data = await res.json();
      const reply = data.answer || (lang === 'hi' ? 'बहुत प्यारा सवाल है दोस्त!' : 'Great question friend!');

      setCurrentAnswer(reply);
      onAddStars(2);
      sound.playStar();
      sound.speak(reply, lang);

      // Add to history
      const newItem: QnaHistoryItem = {
        id: Date.now().toString(),
        question: qText,
        answer: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setHistory(prev => [newItem, ...prev.slice(0, 14)]);
      setQuery('');
    } catch (err) {
      const fallback = lang === 'hi'
        ? `"${qText}" बहुत ही सुंदर सवाल है! विज्ञान और प्रकृति में इसके बारे में बहुत से जादुई नियम होते हैं। नई चीजें सीखते रहो!`
        : `"${qText}" is a wonderful curious question! Science and nature hold so many marvelous answers!`;
      setCurrentAnswer(fallback);
      sound.speak(fallback, lang);
    } finally {
      setIsLoading(false);
    }
  };

  const popularList = lang === 'hi' ? POPULAR_QUESTIONS_HI : POPULAR_QUESTIONS_EN;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            sound.stopSpeaking();
            sound.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-amber-300 font-bold text-amber-900 shadow-sm hover:bg-amber-50 active:scale-95 transition-all text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 px-4 py-1.5 rounded-full border-2 border-white shadow text-xs sm:text-sm font-black text-amber-950">
          <Bot className="w-4 h-4 text-purple-700" />
          <span>{lang === 'hi' ? 'पूछो कोई भी सवाल!' : 'Ask Any Question!'}</span>
        </div>
      </div>

      {/* Hero Robot Asking Box */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 border-4 border-amber-300 rounded-3xl p-5 sm:p-8 shadow-2xl text-white mb-6 text-center select-none relative overflow-hidden">
        {/* Floating doodles */}
        <div className="absolute top-2 left-4 text-5xl opacity-20 pointer-events-none animate-float">
          ❓
        </div>
        <div className="absolute bottom-2 right-6 text-5xl opacity-20 pointer-events-none animate-spin-slow">
          💡
        </div>

        {/* Big Avatar */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 rounded-full bg-white text-5xl sm:text-6xl flex items-center justify-center shadow-2xl border-4 border-amber-300 animate-wiggle">
          🤖
        </div>

        <h2 className="text-2xl sm:text-3xl font-black mb-1 drop-shadow-sm">
          {lang === 'hi' ? 'रोबो जीनी से कोई भी सवाल पूछो!' : 'Ask Robo Geni Anything!'}
        </h2>
        <p className="text-xs sm:text-sm font-bold text-purple-100 max-w-xl mx-auto mb-6">
          {lang === 'hi'
            ? 'बोलकर या लिखकर विज्ञान, अंतरिक्ष, जानवर, गणित, इतिहास या कोई भी सवाल पूछें - रोबो जीनी तुरंत उत्तर देगा!'
            : 'Ask any question by speaking or typing - science, animals, space, history, daily life. Robo Geni answers instantly!'}
        </p>

        {/* Input Bar with Voice Mic & Send Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="relative max-w-2xl mx-auto flex items-center gap-2 bg-white p-2 rounded-3xl shadow-xl border-4 border-amber-300"
        >
          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white animate-pulse scale-110 shadow-lg'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
            }`}
            title={lang === 'hi' ? 'बोलकर पूछें (Tap to Speak)' : 'Tap to speak'}
          >
            {isListening ? <Mic className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isListening
                ? (lang === 'hi' ? 'सुन रहा हूँ... बोलिए!' : 'Listening... Speak now!')
                : (lang === 'hi' ? 'जैसे: आसमान में तारे क्यों चमकते हैं?' : 'e.g., Why do stars twinkle?')
            }
            className="flex-1 bg-transparent px-3 text-slate-800 font-bold text-sm sm:text-base outline-none placeholder:text-slate-400"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-4 sm:px-6 py-3 rounded-2xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-40 cursor-pointer text-sm sm:text-base"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'पूछो' : 'Ask'}</span>
          </button>
        </form>

        {isListening && (
          <div className="mt-3 inline-flex items-center gap-2 bg-red-500/80 text-white px-4 py-1 rounded-full text-xs font-black animate-pulse">
            <span>🎙️ {lang === 'hi' ? 'रोबो जीनी आपकी आवाज़ सुन रहा है...' : 'Listening to your voice...'}</span>
          </div>
        )}
      </div>

      {/* Loading Animation Card */}
      {isLoading && (
        <div className="bg-white border-4 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-xl text-center mb-6 animate-pulse">
          <div className="text-5xl animate-bounce mb-3">🤖✨</div>
          <h3 className="text-lg font-black text-slate-800">
            {lang === 'hi' ? 'रोबो जीनी जादुई ज्ञान खोज रहा है...' : 'Robo Geni is thinking of a great answer...'}
          </h3>
          <p className="text-xs font-bold text-slate-500 mt-1">
            {lang === 'hi' ? 'बस कुछ ही सेकंड में जवाब आ रहा है!' : 'Generating kid-friendly answer in a few seconds!'}
          </p>
        </div>
      )}

      {/* Live Answer Card */}
      {currentAnswer && !isLoading && (
        <div className="bg-gradient-to-b from-amber-50 via-white to-orange-50 border-4 border-amber-400 rounded-3xl p-5 sm:p-8 shadow-2xl mb-8 animate-scale-up text-left">
          <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🤖</span>
              <div>
                <span className="text-xs font-black uppercase text-purple-700">
                  {lang === 'hi' ? 'रोबो जीनी का उत्तर' : 'Robo Geni Answer'}
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  Q: {lastQuestion}
                </h4>
              </div>
            </div>

            <button
              onClick={() => sound.speak(currentAnswer, lang)}
              className="flex items-center gap-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 font-black px-3 py-1.5 rounded-xl shadow-sm text-xs cursor-pointer active:scale-95 transition-all"
              title="Listen Again"
            >
              <Volume2 className="w-4 h-4" />
              <span>{lang === 'hi' ? '🔊 फिर से सुनो' : 'Listen Again'}</span>
            </button>
          </div>

          <div className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed whitespace-pre-line mb-4">
            {currentAnswer}
          </div>

          <div className="p-3 bg-amber-100/70 border border-amber-300 rounded-2xl flex items-center justify-between text-xs font-black text-amber-900">
            <span>🌟 +2 {lang === 'hi' ? 'सितारे मिले!' : 'Stars Earned!'}</span>
            <span>💡 {lang === 'hi' ? 'जिज्ञासु बच्चे हमेशा आगे बढ़ते हैं!' : 'Curious minds shine the brightest!'}</span>
          </div>
        </div>
      )}

      {/* Popular Question Chips (Kids Can Tap To Ask Instantly) */}
      <div className="bg-white border-4 border-amber-200 rounded-3xl p-5 shadow-lg mb-6">
        <h3 className="text-base sm:text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span>{lang === 'hi' ? 'बच्चों के सबसे पसंदीदा सवाल (टैप करें और सुनें):' : 'Popular Kids Questions (Tap to ask instantly):'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {popularList.map((qText, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(qText);
                handleAsk(qText);
              }}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-400 text-left text-xs sm:text-sm font-bold text-slate-800 transition-all flex items-center justify-between gap-2 shadow-xs active:scale-98 cursor-pointer group"
            >
              <span>{qText}</span>
              <span className="text-amber-500 font-black group-hover:translate-x-1 transition-transform">➜</span>
            </button>
          ))}
        </div>
      </div>

      {/* History of Asked Questions */}
      {history.length > 0 && (
        <div className="bg-white border-4 border-purple-200 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-black text-purple-950 flex items-center gap-2">
              <MessageCircleQuestion className="w-5 h-5 text-purple-600" />
              <span>{lang === 'hi' ? 'आपके पूछे गए पिछले सवाल:' : 'Recent Questions Asked:'}</span>
            </h3>

            <button
              onClick={() => {
                sound.playPop();
                setHistory([]);
                localStorage.removeItem('lgw_ask_history');
              }}
              className="text-xs font-bold text-slate-400 hover:text-rose-500"
            >
              {lang === 'hi' ? 'इतिहास मिटाएं' : 'Clear'}
            </button>
          </div>

          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 text-left hover:border-purple-400 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs sm:text-sm font-black text-purple-900">
                    ❓ {item.question}
                  </span>
                  <button
                    onClick={() => sound.speak(item.answer, lang)}
                    className="p-1 rounded-full bg-purple-200 hover:bg-purple-300 text-purple-900 transition-colors"
                    title="Speak"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
