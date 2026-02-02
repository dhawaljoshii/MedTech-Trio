// Extended language support for 150+ languages
// Format: { code: 'language-code', name: 'Native Name', english: 'English Name' }

export const EXTENDED_LANGUAGES = [
    { code: 'en', name: 'English', english: 'English' },
    { code: 'hi', name: 'हिन्दी', english: 'Hindi' },
    { code: 'mr', name: 'मराठी', english: 'Marathi' },
    { code: 'ta', name: 'தமிழ்', english: 'Tamil' },
    { code: 'te', name: 'తెలుగు', english: 'Telugu' },

    // Additional Indian Languages
    { code: 'bn', name: 'বাংলা', english: 'Bengali' },
    { code: 'gu', name: 'ગુજરાતી', english: 'Gujarati' },
    { code: 'kn', name: 'ಕನ್ನಡ', english: 'Kannada' },
    { code: 'ml', name: 'മലയാളം', english: 'Malayalam' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
    { code: 'or', name: 'ଓଡ଼ିଆ', english: 'Odia' },
    { code: 'as', name: 'অসমীয়া', english: 'Assamese' },
    { code: 'ur', name: 'اردو', english: 'Urdu' },
    { code: 'sa', name: 'संस्कृत', english: 'Sanskrit' },
    { code: 'ne', name: 'नेपाली', english: 'Nepali' },
    { code: 'sd', name: 'سنڌي', english: 'Sindhi' },
    { code: 'ks', name: 'कॉशुर', english: 'Kashmiri' },
    { code: 'doi', name: 'डोगरी', english: 'Dogri' },

    // Major World Languages
    { code: 'zh-CN', name: '简体中文', english: 'Chinese (Simplified)' },
    { code: 'zh-TW', name: '繁體中文', english: 'Chinese (Traditional)' },
    { code: 'es', name: 'Español', english: 'Spanish' },
    { code: 'fr', name: 'Français', english: 'French' },
    { code: 'ar', name: 'العربية', english: 'Arabic' },
    { code: 'pt', name: 'Português', english: 'Portuguese' },
    { code: 'ru', name: 'Русский', english: 'Russian' },
    { code: 'ja', name: '日本語', english: 'Japanese' },
    { code: 'de', name: 'Deutsch', english: 'German' },
    { code: 'ko', name: '한국어', english: 'Korean' },
    { code: 'it', name: 'Italiano', english: 'Italian' },
    { code: 'tr', name: 'Türkçe', english: 'Turkish' },
    { code: 'pl', name: 'Polski', english: 'Polish' },
    { code: 'uk', name: 'Українська', english: 'Ukrainian' },
    { code: 'vi', name: 'Tiếng Việt', english: 'Vietnamese' },
    { code: 'nl', name: 'Nederlands', english: 'Dutch' },
    { code: 'th', name: 'ไทย', english: 'Thai' },
    { code: 'id', name: 'Bahasa Indonesia', english: 'Indonesian' },
    { code: 'ms', name: 'Bahasa Melayu', english: 'Malay' },
    { code: 'fa', name: 'فارسی', english: 'Persian' },
    { code: 'he', name: 'עברית', english: 'Hebrew' },
    { code: 'el', name: 'Ελληνικά', english: 'Greek' },
    { code: 'cs', name: 'Čeština', english: 'Czech' },
    { code: 'sv', name: 'Svenska', english: 'Swedish' },
    { code: 'ro', name: 'Română', english: 'Romanian' },
    { code: 'hu', name: 'Magyar', english: 'Hungarian' },
    { code: 'da', name: 'Dansk', english: 'Danish' },
    { code: 'fi', name: 'Suomi', english: 'Finnish' },
    { code: 'no', name: 'Norsk', english: 'Norwegian' },
    { code: 'sk', name: 'Slovenčina', english: 'Slovak' },
    { code: 'bg', name: 'Български', english: 'Bulgarian' },
    { code: 'hr', name: 'Hrvatski', english: 'Croatian' },
    { code: 'lt', name: 'Lietuvių', english: 'Lithuanian' },
    { code: 'sl', name: 'Slovenščina', english: 'Slovenian' },
    { code: 'sr', name: 'Српски', english: 'Serbian' },
    { code: 'lv', name: 'Latviešu', english: 'Latvian' },
    { code: 'et', name: 'Eesti', english: 'Estonian' },

    // African Languages
    { code: 'sw', name: 'Kiswahili', english: 'Swahili' },
    { code: 'am', name: 'አማርኛ', english: 'Amharic' },
    { code: 'yo', name: 'Yorùbá', english: 'Yoruba' },
    { code: 'ig', name: 'Igbo', english: 'Igbo' },
    { code: 'ha', name: 'Hausa', english: 'Hausa' },
    { code: 'zu', name: 'isiZulu', english: 'Zulu' },
    { code: 'xh', name: 'isiXhosa', english: 'Xhosa' },
    { code: 'af', name: 'Afrikaans', english: 'Afrikaans' },
    { code: 'so', name: 'Soomaali', english: 'Somali' },
    { code: 'rw', name: 'Kinyarwanda', english: 'Kinyarwanda' },
    { code: 'mg', name: 'Malagasy', english: 'Malagasy' },
    { code: 'sn', name: 'chiShona', english: 'Shona' },
    { code: 'st', name: 'Sesotho', english: 'Sesotho' },

    // Southeast Asian Languages
    { code: 'my', name: 'မြန်မာ', english: 'Burmese' },
    { code: 'km', name: 'ខ្មែរ', english: 'Khmer' },
    { code: 'lo', name: 'ລາວ', english: 'Lao' },
    { code: 'si', name: 'සිංහල', english: 'Sinhala' },
    { code: 'tl', name: 'Filipino', english: 'Filipino' },
    { code: 'ceb', name: 'Cebuano', english: 'Cebuano' },
    { code: 'jv', name: 'Basa Jawa', english: 'Javanese' },
    { code: 'su', name: 'Basa Sunda', english: 'Sundanese' },

    // Middle Eastern Languages
    { code: 'ku', name: 'Kurdî', english: 'Kurdish' },
    { code: 'az', name: 'Azərbaycan', english: 'Azerbaijani' },
    { code: 'uz', name: 'Oʻzbek', english: 'Uzbek' },
    { code: 'kk', name: 'Қазақ', english: 'Kazakh' },
    { code: 'ky', name: 'Кыргызча', english: 'Kyrgyz' },
    { code: 'tg', name: 'Тоҷикӣ', english: 'Tajik' },
    { code: 'tk', name: 'Türkmen', english: 'Turkmen' },
    { code: 'ps', name: 'پښتو', english: 'Pashto' },

    // European Languages
    { code: 'ca', name: 'Català', english: 'Catalan' },
    { code: 'eu', name: 'Euskara', english: 'Basque' },
    { code: 'gl', name: 'Galego', english: 'Galician' },
    { code: 'cy', name: 'Cymraeg', english: 'Welsh' },
    { code: 'ga', name: 'Gaeilge', english: 'Irish' },
    { code: 'is', name: 'Íslenska', english: 'Icelandic' },
    { code: 'sq', name: 'Shqip', english: 'Albanian' },
    { code: 'mk', name: 'Македонски', english: 'Macedonian' },
    { code: 'bs', name: 'Bosanski', english: 'Bosnian' },
    { code: 'mt', name: 'Malti', english: 'Maltese' },
    { code: 'lb', name: 'Lëtzebuergesch', english: 'Luxembourgish' },

    // Latin American Languages
    { code: 'qu', name: 'Runa Simi', english: 'Quechua' },
    { code: 'gn', name: 'Guarani', english: 'Guarani' },
    { code: 'ay', name: 'Aymar', english: 'Aymara' },
    { code: 'ht', name: 'Kreyòl', english: 'Haitian Creole' },

    // Pacific Languages
    { code: 'haw', name: 'ʻŌlelo Hawaiʻi', english: 'Hawaiian' },
    { code: 'sm', name: 'Gagana Samoa', english: 'Samoan' },
    { code: 'mi', name: 'Te Reo Māori', english: 'Maori' },
    { code: 'to', name: 'Lea Faka-Tonga', english: 'Tongan' },

    // Additional Asian Languages
    { code: 'mn', name: 'Монгол', english: 'Mongolian' },
    { code: 'bo', name: 'བོད་ཡིག', english: 'Tibetan' },
    { code: 'dz', name: 'རྫོང་ཁ', english: 'Dzongkha' },

    // Regional & Other Languages
    { code: 'be', name: 'Беларуская', english: 'Belarusian' },
    { code: 'hy', name: 'Հայերեն', english: 'Armenian' },
    { code: 'ka', name: 'ქართული', english: 'Georgian' },
    { code: 'la', name: 'Latina', english: 'Latin' },
    { code: 'eo', name: 'Esperanto', english: 'Esperanto' },
    { code: 'yi', name: 'ייִדיש', english: 'Yiddish' },

    // Additional Indian Regional Languages
    { code: 'sat', name: 'ᱥᱟᱱᱛᱟᱲᱤ', english: 'Santali' },
    { code: 'mai', name: 'मैथिली', english: 'Maithili' },
    { code: 'kok', name: 'कोंकणी', english: 'Konkani' },
    { code: 'mni', name: 'মৈতৈলোন্', english: 'Manipuri' },
    { code: 'brx', name: 'बड़ो', english: 'Bodo' },

    // Additional African Languages
    { code: 'ny', name: 'Chichewa', english: 'Chichewa' },
    { code: 'lg', name: 'Luganda', english: 'Luganda' },
    { code: 'ti', name: 'ትግርኛ', english: 'Tigrinya' },
    { code: 'om', name: 'Afaan Oromoo', english: 'Oromo' },
    { code: 'ee', name: 'Eʋegbe', english: 'Ewe' },
    { code: 'tw', name: 'Twi', english: 'Twi' },
    { code: 'ak', name: 'Akan', english: 'Akan' },
    { code: 'kr', name: 'Kanuri', english: 'Kanuri' },
    { code: 'ff', name: 'Fulfulde', english: 'Fulani' },
    { code: 'wo', name: 'Wolof', english: 'Wolof' },
    { code: 'ln', name: 'Lingála', english: 'Lingala' },
    { code: 'kg', name: 'Kikongo', english: 'Kongo' },
    { code: 'lua', name: 'Tshiluba', english: 'Luba-Kasai' },

    // Southeast Asian Minor Languages
    { code: 'hmn', name: 'Hmoob', english: 'Hmong' },
    { code: 'ilo', name: 'Iloko', english: 'Ilocano' },
    { code: 'pam', name: 'Kapampangan', english: 'Pampanga' },

    // Additional European Languages
    { code: 'gd', name: 'Gàidhlig', english: 'Scottish Gaelic' },
    { code: 'co', name: 'Corsu', english: 'Corsican' },
    { code: 'fy', name: 'Frysk', english: 'Frisian' },
    { code: 'sc', name: 'Sardu', english: 'Sardinian' },

    // Creoles and Pidgins
    { code: 'pap', name: 'Papiamento', english: 'Papiamento' },

    // Sign Languages (representation)
    { code: 'ase', name: 'ASL', english: 'American Sign Language' },
    { code: 'bfi', name: 'BSL', english: 'British Sign Language' },

    // Additional Languages
    { code: 'tt', name: 'Татарча', english: 'Tatar' },
    { code: 'ba', name: 'Башҡортса', english: 'Bashkir' },
    { code: 'cv', name: 'Чӑвашла', english: 'Chuvash' },
    { code: 'os', name: 'Ирон', english: 'Ossetian' },
    { code: 'ce', name: 'Нохчийн', english: 'Chechen' },
    { code: 'av', name: 'Авар', english: 'Avar' },
    { code: 'sah', name: 'Саха тыла', english: 'Sakha' },
];

// Primary languages with full translation support
export const PRIMARY_LANGUAGES = ['en', 'hi', 'mr', 'ta', 'te'];

// Check if a language has full translation support
export const hasFullSupport = (langCode) => {
    return PRIMARY_LANGUAGES.includes(langCode);
};

// Get language name by code
export const getLanguageName = (code) => {
    const lang = EXTENDED_LANGUAGES.find(l => l.code === code);
    return lang ? lang.name : 'Unknown';
};

// Get language English name by code
export const getLanguageEnglishName = (code) => {
    const lang = EXTENDED_LANGUAGES.find(l => l.code === code);
    return lang ? lang.english : 'Unknown';
};
