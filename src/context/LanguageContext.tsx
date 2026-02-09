"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'tr';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'tr' : 'en');
    };

    const translations: Record<string, Record<Language, string>> = {
        "features": { en: "Features", tr: "Özellikler" },
        "solutions": { en: "Solutions", tr: "Çözümler" },
        "docs": { en: "Docs", tr: "Dokümanlar" },
        "pricing": { en: "Pricing", tr: "Fiyatlandırma" },
        "get_started": { en: "Get Started", tr: "Başlayın" },
        "above_software": { en: "ABOVE THE SOFTWARE", tr: "YAZILIMIN ÖTESİNDE" },
        "layers_building": { en: "Layers keep building.", tr: "Katmanlar durmadan çoğalır." },
    };

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
