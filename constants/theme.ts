import { TextStyle, ViewStyle } from 'react-native';

// iOS-inspired design system
export const theme = {
    colors: {
        // Primary colors
        primary: '#F3A326',
        secondary: '#FFD60A', // Enhanced gold
        success: '#30D158',
        danger: '#FF453A',
        warning: '#FF9F0A',
        info: '#64D2FF',

        // Background colors
        background: {
            primary: '#000000',
            secondary: '#1C1C1E',
            tertiary: '#2C2C2E',
            elevated: '#3A3A3C',
            new: '#1B1916',
            newLight: '#24241e'
        },

        // Text colors
        text: {
            primary: '#FFFFFF',
            secondary: '#EBEBF5CC', // with 80% opacity
            tertiary: '#EBEBF599',  // with 60% opacity
            quaternary: '#EBEBF566', // with 40% opacity
        },

        // Border and divider
        border: '#38383A',
        divider: '#38383A',

        // Status colors for event cards
        status: {
            assigned: '#FFD60A',
            accepted: '#30D158',
            rejected: '#FF453A',
        }
    },

    // Typography scale - iOS SF Pro inspired
    typography: {
        largeTitle: {
            fontSize: 34,
            fontWeight: '700',
            letterSpacing: 0.37,
        } as TextStyle,
        title1: {
            fontSize: 28,
            fontWeight: '700',
            letterSpacing: 0.36,
        } as TextStyle,
        title2: {
            fontSize: 22,
            fontWeight: '700',
            letterSpacing: 0.35,
        } as TextStyle,
        title3: {
            fontSize: 18,
            fontWeight: '600',
            letterSpacing: 0.38,
        } as TextStyle,
        headline: {
            fontSize: 17,
            fontWeight: '600',
            letterSpacing: -0.41,
        } as TextStyle,
        body: {
            fontSize: 17,
            fontWeight: '400',
            letterSpacing: -0.41,
        } as TextStyle,
        callout: {
            fontSize: 16,
            fontWeight: '400',
            letterSpacing: -0.32,
        } as TextStyle,
        subhead: {
            fontSize: 15,
            fontWeight: '400',
            letterSpacing: -0.24,
        } as TextStyle,
        footnote: {
            fontSize: 13,
            fontWeight: '400',
            letterSpacing: -0.08,
        } as TextStyle,
        caption1: {
            fontSize: 12,
            fontWeight: '400',
            letterSpacing: 0,
        } as TextStyle,
        caption2: {
            fontSize: 11,
            fontWeight: '400',
            letterSpacing: 0.07,
        } as TextStyle,
    },

    // Spacing scale (in points)
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },

    // Border radius scale
    borderRadius: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        xxl: 32,
        full: 9999,
    },

    // Shadows
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
        } as ViewStyle,
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.22,
            shadowRadius: 4,
            elevation: 3,
        } as ViewStyle,
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
        } as ViewStyle,
    },

    // Animation durations
    animation: {
        fast: 200,
        medium: 300,
        slow: 500,
    },
};

// Re-export for convenient imports
export const { colors, typography, spacing, borderRadius, shadows, animation } = theme; 