import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeType = 'light' | 'dark';

// Define theme colors
export const themeColors = {
    light: {
        background: '#1B1916',
        card: '#1c1c1e',
        text: '#FFF',
        secondaryText: '#6B7280',
        border: '#AFACA7',
        primary: '#F3A326',
        secondary: '#9CA3AF',
        success: '#059669',
        warning: '#FBBF24',
        danger: '#EF4444',
        highlight: '#4169E1',
        inputBackground: '#000',
        lowPriorityBg: '#DCF3E5',
        mediumPriorityBg: '#EBF5FF',
        highPriorityBg: '#FEE2E2',
        lowPriorityText: '#059669',
        mediumPriorityText: '#4169E1',
        highPriorityText: '#DC2626',
        tabBarBackground: '#1B1916', // Dark tab bar for light theme
    },
    dark: {
        background: '#111827',
        card: '#1F2937',
        text: '#F9FAFB',
        secondaryText: '#D1D5DB',
        border: '#374151',
        primary: '#B7922A', // Dark gold instead of orange
        secondary: '#9CA3AF',
        success: '#10B981',
        warning: '#FBBF24',
        danger: '#EF4444',
        highlight: '#B7922A', // Dark gold to match primary
        inputBackground: '#374151',
        lowPriorityBg: '#065F46',
        mediumPriorityBg: '#1E3A8A',
        highPriorityBg: '#991B1B',
        lowPriorityText: '#34D399',
        mediumPriorityText: '#93C5FD',
        highPriorityText: '#FCA5A5',
        tabBarBackground: '#0F172A', // Even darker for tab bar
    },
};

type ThemeContextType = {
    theme: ThemeType;
    toggleTheme: () => void;
    colors: typeof themeColors.light;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => { },
    colors: themeColors.light,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemColorScheme = useColorScheme() as ThemeType;
    const [theme, setTheme] = useState<ThemeType>(systemColorScheme || 'light');

    // Update theme if system preference changes
    useEffect(() => {
        if (systemColorScheme) {
            setTheme(systemColorScheme);
        }
    }, [systemColorScheme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const colors = themeColors[theme];

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext); 