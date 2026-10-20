import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.post('/api/ask-anything', async (req, res) => {
  try {
    const { question, lang = 'hi' } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        answer: lang === 'hi' 
          ? `वाह! "${question}" बहुत बढ़िया सवाल है! विज्ञान और प्रकृति में इसके बारे में बहुत से जादुई नियम और कारण होते हैं। सीखते रहो नन्हे जीनियस! 🌟`
          : `Awesome question about "${question}"! Science and nature hold so many wonderful secrets. Keep learning, little genius! 🌟`,
        source: 'local-knowledge',
      });
    }

    const systemInstruction = `You are "रोबो जीनी" (Robo Geni 🤖), a warm, encouraging, delightful teacher for kids (ages 4-12) and parents in the game "Little Genius World".
When the user asks ANY question on any topic:
1. Explain it simply, joyfully, and clearly in 2 to 4 sentences that a child can easily understand and love.
2. Include fun emojis!
3. If the user asks in Hindi or asks for Hindi, answer in friendly, cheerful Hindi. If in English, answer in English.
4. End with a short "✨ मजेदार तथ्य (Fun Fact):" suitable for kids.`;

    // Fast 4-second timeout to guarantee instantaneous response for kids
    const fetchWithTimeout = async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: question,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
      return response.text;
    };

    const timeoutPromise = new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timeout')), 4000)
    );

    const generatedText = await Promise.race([fetchWithTimeout(), timeoutPromise]);
    const answer = generatedText || (lang === 'hi' ? 'बहुत अच्छा सवाल है दोस्त!' : 'Great question friend!');
    return res.json({ answer, source: 'gemini' });
  } catch (err: unknown) {
    console.log('Using smart instant kid-friendly knowledge answer:', err);
    const qLower = (req.body?.question || '').toLowerCase();
    let fallback = '';

    if (qLower.includes('सूरज') || qLower.includes('sun')) {
      fallback = req.body.lang === 'en'
        ? 'The Sun produces immense heat and light through nuclear fusion of hydrogen atoms into helium! ✨ Fun Fact: Sunlight takes about 8 minutes to travel from the Sun to Earth!'
        : 'सूरज में बहुत सारी हाइड्रोजन गैस होती है जो लगातार हीलियम में बदलती रहती है, जिससे अपार रोशनी और ऊर्जा निकलती है! ☀️✨ मजेदार तथ्य: सूरज की रोशनी को पृथ्वी तक पहुँचने में लगभग 8 मिनट 20 सेकंड लगते हैं!';
    } else if (qLower.includes('चाँद') || qLower.includes('moon')) {
      fallback = req.body.lang === 'en'
        ? 'The Moon orbits around Earth and reflects sunlight! ✨ Fun Fact: The Moon has no air or atmosphere, so footprints made by astronauts will stay there for millions of years!'
        : 'चाँद हमारी पृथ्वी का चक्कर लगाता है और सूरज की धूप चमकने से सुंदर दिखाई देता है! 🌕✨ मजेदार तथ्य: चाँद पर हवा नहीं है, इसलिए अंतरिक्ष यात्रियों के कदमों के निशान लाखों सालों तक वैसे ही रहेंगे!';
    } else if (qLower.includes('पेड़') || qLower.includes('पौध') || qLower.includes('plant')) {
      fallback = req.body.lang === 'en'
        ? 'Plants use sunlight, water, and air to cook sweet food through photosynthesis! ✨ Fun Fact: In return, plants give us fresh, pure oxygen to breathe!'
        : 'पेड़-पौधे अपनी हरी पत्तियों से धूप, पानी और हवा लेकर प्रकाश संश्लेषण (Photosynthesis) द्वारा अपना भोजन बनाते हैं! 🍃✨ मजेदार तथ्य: पेड़ हमें सांस लेने के लिए ताजी ऑक्सीजन (O₂) देते हैं!';
    } else {
      fallback = req.body.lang === 'en'
        ? `What a smart and curious question about "${req.body?.question}"! In science and nature, every wonder has an exciting reason and natural law! 🌟✨ Fun Fact: Keep asking questions, that is how every great scientist learns!`
        : `"${req.body?.question}" बहुत ही प्यारा और ज्ञानवर्धक सवाल है! विज्ञान और प्रकृति में हर चीज़ के पीछे एक सुंदर नियम और कारण होता है! 🌟✨ मजेदार तथ्य: हर रोज नए सवाल पूछने वाले बच्चे ही बड़े होकर महान वैज्ञानिक बनते हैं!`;
    }

    return res.json({ answer: fallback, source: 'smart-knowledge' });
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();
