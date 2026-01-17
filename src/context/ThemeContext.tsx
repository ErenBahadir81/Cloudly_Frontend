"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "pink";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark");

    // Optional: Check system preference or local storage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("cloudly-theme") as Theme;
        if (savedTheme) {
            setThemeState(savedTheme);
        }
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem("cloudly-theme", newTheme);
    };

    const toggleTheme = () => {
        setThemeState((prev) => {
            const newTheme = prev === "dark" ? "light" : "dark";
            localStorage.setItem("cloudly-theme", newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
