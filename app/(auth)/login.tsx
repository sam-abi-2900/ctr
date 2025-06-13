import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withDelay,
    Easing,
    interpolate,
    runOnJS,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Checkbox from 'expo-checkbox';
import { useAuth } from '../_layout';

const { width, height } = Dimensions.get('window');

const columnImages = {
    left: [
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1920',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1920',
        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1920',
    ],
    middle: [
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920',
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1920',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920',
    ],
    right: [
        'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1920',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1920',
        'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=1920',
    ],
};

const descriptions = [
    {
        title: "Track Your Detailed\nEvent Activity",
        subtitle: "Monitor and analyze your event's progress\nwith detailed insights. Stay updated\non registrations, attendance, and\nother key metrics in real-time."
    },
    {
        title: "Manage Events\nLike a Pro",
        subtitle: "Create and organize events effortlessly.\nHandle registrations, send notifications,\nand track attendance all in one place."
    },
    {
        title: "Real-time\nAnalytics Dashboard",
        subtitle: "Get instant insights into your events.\nTrack engagement metrics, attendance\nrates, and participant feedback\nin real-time."
    }
];

const COLUMN_HEIGHT = height * 1.5;
const ANIMATION_DURATION = 15000; // 15 seconds for one complete scroll
const DIRECTION_CHANGE_INTERVAL = 3000; // Check for direction change every 3 seconds

export default function LoginScreen() {
    const scrollY1 = useSharedValue(0);
    const scrollY2 = useSharedValue(-COLUMN_HEIGHT / 3);
    const scrollY3 = useSharedValue(-COLUMN_HEIGHT / 2);
    const direction1 = useSharedValue(1);
    const direction2 = useSharedValue(1);
    const direction3 = useSharedValue(1);

    const textX = useSharedValue(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { isTermsAccepted, setIsTermsAccepted, login } = useAuth();

    const startColumnAnimation = (
        yValue: Animated.SharedValue<number>,
        direction: Animated.SharedValue<number>
    ) => {
        yValue.value = withRepeat(
            withSequence(
                withTiming(direction.value * -COLUMN_HEIGHT, {
                    duration: ANIMATION_DURATION,
                    easing: Easing.linear,
                }),
                withTiming(0, { duration: 0 }),
            ),
            -1,
            false
        );
    };

    useEffect(() => {
        const randomlyChangeDirection = () => {
            // Randomly select which column to change (0 to 2)
            const columnToChange = Math.floor(Math.random() * 3);

            // Get the current direction values
            const directions = [direction1, direction2, direction3];

            // Change the direction of the selected column
            directions[columnToChange].value *= -1;

            // Restart the animation for the changed column
            const scrollValues = [scrollY1, scrollY2, scrollY3];
            startColumnAnimation(scrollValues[columnToChange], directions[columnToChange]);
        };

        // Start initial animations
        startColumnAnimation(scrollY1, direction1);
        startColumnAnimation(scrollY2, direction2);
        startColumnAnimation(scrollY3, direction3);

        // Set up interval for random direction changes
        const interval = setInterval(randomlyChangeDirection, DIRECTION_CHANGE_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    const updateTextIndex = (index: number) => {
        setCurrentIndex(index);
    };

    const gesture = Gesture.Pan()
        .onBegin(() => {
            textX.value = withTiming(0);
        })
        .onUpdate((event) => {
            textX.value = event.translationX;
        })
        .onEnd((event) => {
            const direction = event.velocityX > 0 ? -1 : 1;
            const shouldSwipe = Math.abs(event.velocityX) > 500 || Math.abs(event.translationX) > width * 0.3;

            if (shouldSwipe) {
                const newIndex = (currentIndex + direction + descriptions.length) % descriptions.length;
                textX.value = withSequence(
                    withTiming(direction * -width),
                    withTiming(0, {}, () => {
                        runOnJS(updateTextIndex)(newIndex);
                    })
                );
            } else {
                textX.value = withTiming(0);
            }
        });

    const textStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: textX.value }],
    }));

    const column1Style = useAnimatedStyle(() => ({
        transform: [{ translateY: scrollY1.value }],
    }));

    const column2Style = useAnimatedStyle(() => ({
        transform: [{ translateY: scrollY2.value }],
    }));

    const column3Style = useAnimatedStyle(() => ({
        transform: [{ translateY: scrollY3.value }],
    }));

    const renderColumn = (images: string[], style: any) => (
        <Animated.View style={[styles.column, style]}>
            {[...images, ...images].map((image, index) => (
                <Animated.Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.backgroundImage}

                />
            ))}
        </Animated.View>
    );

    const handleLogin = () => {
        login();
    };

    return (
        <View style={styles.container}>
            <View style={styles.backgroundContainer}>
                {renderColumn(columnImages.left, column1Style)}
                {renderColumn(columnImages.middle, column2Style)}
                {renderColumn(columnImages.right, column3Style)}
            </View>

            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>EventTracker</Text>
                    </View>

                    <GestureDetector gesture={gesture}>
                        <Animated.View style={[styles.textContainer, textStyle]}>
                            <Text style={styles.title}>{descriptions[currentIndex].title}</Text>
                            <Text style={styles.subtitle}>{descriptions[currentIndex].subtitle}</Text>
                        </Animated.View>
                    </GestureDetector>

                    <View style={styles.pagination}>
                        {descriptions.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    { backgroundColor: index === currentIndex ? '#FFD700' : '#FFFFFF' }
                                ]}
                            />
                        ))}
                    </View>

                    <Pressable style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>SSO Login</Text>
                    </Pressable>
                    <Pressable style={styles.adminLoginButton} onPress={() => router.replace('/(admin)/(tabs)/admin')}>
                        <Text style={styles.loginButtonText}>Admin Login</Text>
                    </Pressable>
                    <Pressable style={styles.termsContainer} onPress={() => setIsTermsAccepted(!isTermsAccepted)}>
                        <Checkbox
                            style={styles.checkbox}
                            value={isTermsAccepted}
                            onValueChange={setIsTermsAccepted}
                            color={isTermsAccepted ? '#FFD700' : undefined}
                        />
                        <Text style={styles.termsText}>I accept the terms of use</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
    },
    column: {
        flex: 1,
        height: COLUMN_HEIGHT * 2,
    },
    backgroundImage: {
        width: '100%',
        height: COLUMN_HEIGHT / 3,
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    content: {
        padding: 24,
        paddingBottom: 48,
    },
    logoContainer: {
        marginBottom: 40,
    },
    logoText: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    textContainer: {
        width: '100%',
    },
    title: {
        fontSize: 32,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginBottom: 16,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.8,
        lineHeight: 24,
        marginBottom: 32,
    },
    pagination: {
        flexDirection: 'row',
        marginBottom: 32,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    loginButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 24,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 12,
        width: 20,
        height: 20,
    },
    termsText: {
        color: '#FFFFFF',
        opacity: 0.8,
    },
    adminLoginButton: {
        backgroundColor: '#888',  // Different color from SSO button
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 24,
    },
}); 