export type Language = 'hi' | 'en';

export type GameCategory = 'math' | 'science' | 'gk' | 'explore';

export type GameId = 
  | 'home'
  | 'math-counting'
  | 'math-addition'
  | 'math-shapes'
  | 'math-seesaw'
  | 'science-plant'
  | 'science-sinkfloat'
  | 'science-solar'
  | 'science-animals'
  | 'science-senses'
  | 'kids-gk'
  | 'ask-anything'
  | 'curious-why'
  | 'trophy-room';

export interface Badge {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  icon: string;
  unlocked: boolean;
  requiredStars: number;
  category: GameCategory;
}

export interface UserStats {
  playerName: string;
  stars: number;
  mathScore: number;
  scienceScore: number;
  gkScore: number;
  gamesPlayed: number;
  unlockedBadgeIds: string[];
}

export interface QuestionCard {
  id: string;
  category: 'space' | 'nature' | 'animals' | 'body' | 'daily';
  questionHi: string;
  questionEn: string;
  answerHi: string;
  answerEn: string;
  funFactHi: string;
  funFactEn: string;
  icon: string;
}

export interface GkQuestion {
  id: number;
  category: 'india' | 'nature' | 'space' | 'science' | 'world' | 'sports' | 'fun';
  categoryHi: string;
  categoryEn: string;
  questionHi: string;
  questionEn: string;
  optionsHi: string[];
  optionsEn: string[];
  correctIndex: number; // 0-3
  funFactHi: string;
  funFactEn: string;
  icon: string;
  imageUrl?: string;
  imageLabel?: string;
}
