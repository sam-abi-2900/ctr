import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const StandbyTimer = () => {
    const [isActive, setIsActive] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);

    useEffect(() => {
        // Load saved timer state
        const loadTimerState = async () => {
            try {
                const savedState = await AsyncStorage.getItem('standbyTimer');
                if (savedState) {
                    const { isActive: savedIsActive, startTime: savedStartTime, elapsedTime: savedElapsedTime } = JSON.parse(savedState);
                    setIsActive(savedIsActive);
                    setElapsedTime(savedElapsedTime);
                    setStartTime(savedStartTime);
                }
            } catch (error) {
                console.error('Error loading timer state:', error);
            }
        };

        loadTimerState();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && startTime) {
            interval = setInterval(() => {
                const currentTime = Date.now();
                const newElapsedTime = Math.floor((currentTime - startTime) / 1000) + elapsedTime;
                setElapsedTime(newElapsedTime);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, startTime, elapsedTime]);

    const toggleTimer = async () => {
        if (isActive) {
            // Stop timer
            setIsActive(false);
            setStartTime(null);
        } else {
            // Start timer
            const currentTime = Date.now();
            setIsActive(true);
            setStartTime(currentTime);
        }

        // Save timer state
        try {
            await AsyncStorage.setItem('standbyTimer', JSON.stringify({
                isActive: !isActive,
                startTime: !isActive ? Date.now() : null,
                elapsedTime
            }));
        } catch (error) {
            console.error('Error saving timer state:', error);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.fab, isActive && styles.fabActive]}
                onPress={toggleTimer}
            >
                <Clock size={24} color={isActive ? '#000' : '#000'} />
                {isActive && (
                    <View style={styles.timerTextContainer}>
                        <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20, // Position above tab bar
        right: 10,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.medium,
    },
    fabActive: {
        backgroundColor: colors.primary,
    },
    timerTextContainer: {
        position: 'absolute',
        top: -20,
        backgroundColor: colors.background.tertiary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    timerText: {
        ...typography.caption1,
        color: colors.text.primary,
    },
}); 