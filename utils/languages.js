export const LANGUAGES = {
  en: {
    name: "English",
    selectLang: "Please select your language:\nEnglish / Hindi / Marathi / Tamil / Telugu",
    askSymptoms: "What symptoms are you facing today?",
    recommend: (type) =>
      `Based on your symptoms, we recommend a ${type} specialist. Let me show you available doctors...`,
    inputPlaceholder: "Describe your symptoms...",
    invalidLang: "Please select a valid language.",
  },

  hi: {
    name: "Hindi",
    selectLang: "कृपया अपनी भाषा चुनें:\nEnglish / Hindi / Marathi / Tamil / Telugu",
    askSymptoms: "आपको कौन से लक्षण महसूस हो रहे हैं?",
    recommend: (type) =>
      `आपके लक्षणों के आधार पर हम ${type} विशेषज्ञ की सलाह देते हैं।`,
    inputPlaceholder: "अपने लक्षण बताएं...",
    invalidLang: "कृपया मान्य भाषा चुनें।",
  },

  mr: {
    name: "Marathi",
    selectLang: "कृपया आपली भाषा निवडा:\nEnglish / Hindi / Marathi / Tamil / Telugu",
    askSymptoms: "आपल्याला कोणती लक्षणे जाणवत आहेत?",
    recommend: (type) =>
      `आपल्या लक्षणांनुसार आम्ही ${type} तज्ज्ञ सुचवतो.`,
    inputPlaceholder: "आपली लक्षणे सांगा...",
    invalidLang: "कृपया योग्य भाषा निवडा.",
  },

  ta: {
    name: "Tamil",
    selectLang: "தயவுசெய்து உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்:\nEnglish / Hindi / Marathi / Tamil / Telugu",
    askSymptoms: "உங்களுக்கு என்ன அறிகுறிகள் உள்ளன?",
    recommend: (type) =>
      `உங்கள் அறிகுறிகளின் அடிப்படையில் ${type} நிபுணரை பரிந்துரைக்கிறோம்.`,
    inputPlaceholder: "உங்கள் அறிகுறிகளை விளக்கவும்...",
    invalidLang: "சரியான மொழியை தேர்ந்தெடுக்கவும்.",
  },

  te: {
    name: "Telugu",
    selectLang: "దయచేసి మీ భాషను ఎంచుకోండి:\nEnglish / Hindi / Marathi / Tamil / Telugu",
    askSymptoms: "మీకు ఎలాంటి లక్షణాలు ఉన్నాయి?",
    recommend: (type) =>
      `మీ లక్షణాల ఆధారంగా మేము ${type} నిపుణుడిని సూచిస్తున్నాము.`,
    inputPlaceholder: "మీ లక్షణాలను వివరించండి...",
    invalidLang: "దయచేసి సరైన భాషను ఎంచుకోండి.",
  },
};