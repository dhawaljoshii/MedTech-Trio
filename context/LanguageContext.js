"use client";
import { createContext, useContext, useState, useEffect } from "react";
import en from "@/locales/en/common.json";
import hi from "@/locales/hi/common.json";
import pa from "@/locales/pa/common.json";
import ta from "@/locales/ta/common.json";
import te from "@/locales/te/common.json";
import mr from "@/locales/mr/common.json";

const translations = { en, hi, pa, ta, te, mr };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState("en");
    const [t, setT] = useState(translations.en);

    useEffect(() => {
        // Determine language, fallback to 'en'
        setT(translations[language] || translations.en);
    }, [language]);

    const value = {
        language,
        setLanguage,
        t: (key) => t[key] || key, // Simple translator
        translations: t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
