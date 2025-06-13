import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Component that adjusts StatusBar based on theme -> TODO remove the theme functionality overall, no requirements as of now
const ThemedStatusBar = () => {
    const { theme } = useTheme();
    return <StatusBar style={theme === 'dark' ? 'light' : 'light'} />;
};

export default function RootLayout() {
    useFrameworkReady();

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                    <Stack.Screen name="notification/index" options={{ headerShown: false }} />
                </Stack>
                <ThemedStatusBar />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}