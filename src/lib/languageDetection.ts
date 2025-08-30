// Language detection and translation utilities
export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  confidence: number;
}

// Supported languages with their codes and native names
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', nativeName: 'English' },
  de: { name: 'German', nativeName: 'Deutsch' },
  fr: { name: 'French', nativeName: 'Français' },
  ar: { name: 'Arabic', nativeName: 'العربية' },
  ber: { name: 'Berber', nativeName: 'Tamazight' },
  es: { name: 'Spanish', nativeName: 'Español' },
  it: { name: 'Italian', nativeName: 'Italiano' },
  pt: { name: 'Portuguese', nativeName: 'Português' },
  nl: { name: 'Dutch', nativeName: 'Nederlands' },
  ru: { name: 'Russian', nativeName: 'Русский' },
  zh: { name: 'Chinese', nativeName: '中文' },
  ja: { name: 'Japanese', nativeName: '日本語' },
  ko: { name: 'Korean', nativeName: '한국어' },
} as const;

export type SupportedLanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Simple language detection based on common patterns
export function detectLanguage(text: string): LanguageInfo {
  const lowerText = text.toLowerCase();
  
  // German patterns
  if (/\b(ich|du|er|sie|es|wir|ihr|sie|der|die|das|und|oder|aber|nicht|sein|haben|werden|können|müssen|sollen|wollen|möchten)\b/.test(lowerText)) {
    return { code: 'de', name: 'German', nativeName: 'Deutsch', confidence: 0.9 };
  }
  
  // French patterns
  if (/\b(je|tu|il|elle|nous|vous|ils|elles|le|la|les|et|ou|mais|pas|être|avoir|faire|aller|venir|voir|savoir)\b/.test(lowerText)) {
    return { code: 'fr', name: 'French', nativeName: 'Français', confidence: 0.9 };
  }
  
  // Arabic patterns
  if (/[\u0600-\u06FF]/.test(text)) {
    return { code: 'ar', name: 'Arabic', nativeName: 'العربية', confidence: 0.95 };
  }
  
  // Spanish patterns
  if (/\b(yo|tú|él|ella|nosotros|vosotros|ellos|ellas|el|la|los|las|y|o|pero|no|ser|estar|tener|hacer|ir|venir|ver)\b/.test(lowerText)) {
    return { code: 'es', name: 'Spanish', nativeName: 'Español', confidence: 0.9 };
  }
  
  // Italian patterns
  if (/\b(io|tu|lui|lei|noi|voi|loro|il|la|i|gli|e|o|ma|non|essere|avere|fare|andare|venire|vedere)\b/.test(lowerText)) {
    return { code: 'it', name: 'Italian', nativeName: 'Italiano', confidence: 0.9 };
  }
  
  // Portuguese patterns
  if (/\b(eu|tu|ele|ela|nós|vós|eles|elas|o|a|os|as|e|ou|mas|não|ser|estar|ter|fazer|ir|vir|ver)\b/.test(lowerText)) {
    return { code: 'pt', name: 'Portuguese', nativeName: 'Português', confidence: 0.9 };
  }
  
  // Dutch patterns
  if (/\b(ik|jij|hij|zij|wij|jullie|zij|de|het|en|of|maar|niet|zijn|hebben|worden|kunnen|moeten|willen|gaan|komen|zien)\b/.test(lowerText)) {
    return { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', confidence: 0.9 };
  }
  
  // Russian patterns
  if (/[\u0400-\u04FF]/.test(text)) {
    return { code: 'ru', name: 'Russian', nativeName: 'Русский', confidence: 0.95 };
  }
  
  // Chinese patterns
  if (/[\u4e00-\u9fff]/.test(text)) {
    return { code: 'zh', name: 'Chinese', nativeName: '中文', confidence: 0.95 };
  }
  
  // Japanese patterns
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
    return { code: 'ja', name: 'Japanese', nativeName: '日本語', confidence: 0.95 };
  }
  
  // Korean patterns
  if (/[\uac00-\ud7af]/.test(text)) {
    return { code: 'ko', name: 'Korean', nativeName: '한국어', confidence: 0.95 };
  }
  
  // Default to English
  return { code: 'en', name: 'English', nativeName: 'English', confidence: 0.7 };
}

// Get language-specific prompts
export function getLanguagePrompt(languageCode: SupportedLanguageCode): string {
  const language = SUPPORTED_LANGUAGES[languageCode];
  
  const prompts = {
    en: "Respond in English. Be professional, friendly, and helpful.",
    de: "Antworte auf Deutsch. Sei professionell, freundlich und hilfsbereit.",
    fr: "Réponds en français. Sois professionnel, amical et serviable.",
    ar: "أجب باللغة العربية. كن مهنياً وودوداً ومفيداً.",
    ber: "Erreɣ s Tmaziɣt. Ilaq ad tiliḍ amahnu, amɣar d amɛiwen.",
    es: "Responde en español. Sé profesional, amigable y servicial.",
    it: "Rispondi in italiano. Sii professionale, amichevole e disponibile.",
    pt: "Responda em português. Seja profissional, amigável e prestativo.",
    nl: "Antwoord in het Nederlands. Wees professioneel, vriendelijk en behulpzaam.",
    ru: "Отвечай на русском языке. Будь профессиональным, дружелюбным и полезным.",
    zh: "用中文回答。要专业、友好和乐于助人。",
    ja: "日本語で答えてください。プロフェッショナルで、親切で、役立つようにしてください。",
    ko: "한국어로 답변하세요. 전문적이고 친절하며 도움이 되도록 하세요.",
  };
  
  return prompts[languageCode] || prompts.en;
}

// Get language-specific greetings
export function getLanguageGreeting(languageCode: SupportedLanguageCode): string {
  const greetings = {
    en: "Hello! How can I assist you today?",
    de: "Hallo! Wie kann ich Ihnen heute helfen?",
    fr: "Bonjour! Comment puis-je vous aider aujourd'hui?",
    ar: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
    ber: "Azul! Amek ara k-ɛiwen ass-a?",
    es: "¡Hola! ¿Cómo puedo ayudarte hoy?",
    it: "Ciao! Come posso aiutarti oggi?",
    pt: "Olá! Como posso ajudá-lo hoje?",
    nl: "Hallo! Hoe kan ik u vandaag helpen?",
    ru: "Привет! Как я могу помочь вам сегодня?",
    zh: "你好！今天我能为您做些什么？",
    ja: "こんにちは！今日はどのようにお手伝いできますか？",
    ko: "안녕하세요! 오늘 어떻게 도와드릴까요?",
  };
  
  return greetings[languageCode] || greetings.en;
} 