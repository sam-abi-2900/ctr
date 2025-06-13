import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Truck, Clock } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';
import * as Location from 'expo-location';

export default function TruckCheckInOutScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [truckCheckedIn, setTruckCheckedIn] = useState(false);
    const [truckTimeElapsed, setTruckTimeElapsed] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [locationPermission, setLocationPermission] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setTruckTimeElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleTruckCheckIn = async () => {
        if (!locationPermission) {
            Alert.alert(
                'Location Permission Required',
                'Please enable location access to check in to truck.',
                [{ text: 'OK' }]
            );
            return;
        }

        try {
            const location = await Location.getCurrentPositionAsync({});
            
            const response = await fetch('http://localhost:3000/api/vendor/events/truck/checkin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assignment_id: params.assignmentId,
                    checkin_lat: location.coords.latitude,
                    checkin_lng: location.coords.longitude,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to check in to truck');
            }

            setTruckCheckedIn(true);
            setIsRunning(true);
        } catch (error) {
            console.error('Truck check-in error:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to check in to truck');
        }
    };

    const handleTruckCheckOut = async () => {
        if (!locationPermission) {
            Alert.alert(
                'Location Permission Required',
                'Please enable location access to check out from truck.',
                [{ text: 'OK' }]
            );
            return;
        }

        try {
            const location = await Location.getCurrentPositionAsync({});
            
            const response = await fetch('http://localhost:3000/api/vendor/events/truck/checkout', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assignment_id: params.assignmentId,
                    checkout_lat: location.coords.latitude,
                    checkout_lng: location.coords.longitude,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to check out from truck');
            }

            setIsRunning(false);

            // If this is a warehouse-event type, proceed to event check-in
            // Otherwise, return to events screen
            if (params.eventType === 'warehouse-event') {
                router.push({
                    pathname: "/(app)/check-in",
                    params: {
                        eventId: params.eventId,
                        title: params.title,
                        date: params.date,
                        location: params.location,
                        currentStage: 'event_checkin',
                        nextStage: 'event_checkout',
                        eventType: params.eventType,
                        warehouseTime: params.warehouseTime,
                        truckTime: truckTimeElapsed.toString(),
                        assignmentId: params.assignmentId,
                        imageUrl: params.imageUrl,
                        event_lat: params.event_lat,
                        event_lng: params.event_lng,
                        warehouse_lat: params.warehouse_lat,
                        warehouse_lng: params.warehouse_lng
                    }
                });
            } else {
                // For warehouse-only events, return to events screen
                router.push('/');
            }
        } catch (error) {
            console.error('Truck check-out error:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to check out from truck');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <ChevronLeft size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {truckCheckedIn ? 'Truck Check-out' : 'Truck Check-in'}
                </Text>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Truck size={80} color={colors.secondary} style={styles.icon} />
                    </View>
                    <Text style={styles.title}>
                        {truckCheckedIn ? 'Truck Check-out' : 'Truck Check-in'}
                    </Text>
                    <Text style={styles.description}>
                        {truckCheckedIn
                            ? 'Please complete your truck tasks and check out before proceeding to the event.'
                            : 'Please check in your truck before proceeding to the event location.'}
                    </Text>

                    {truckCheckedIn && (
                        <View style={styles.timerContainer}>
                            <Clock size={24} color={colors.secondary} />
                            <Text style={styles.timerText}>{formatTime(truckTimeElapsed)}</Text>
                        </View>
                    )}

                    {!truckCheckedIn ? (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleTruckCheckIn}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>Check into Truck</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleTruckCheckOut}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>Check Out from Truck</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        paddingTop: spacing.md,
        backgroundColor: colors.background.primary,
    },
    backButton: {
        marginRight: spacing.md,
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        ...typography.title1,
        color: colors.text.primary,
    },
    content: {
        flex: 1,
        padding: spacing.md,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: colors.background.new,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        ...shadows.medium,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: borderRadius.full,
        backgroundColor: colors.background.newLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        ...shadows.medium,
    },
    icon: {
        marginBottom: 0,
    },
    description: {
        ...typography.callout,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    button: {
        backgroundColor: colors.secondary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.md,
        width: '100%',
        alignItems: 'center',
        ...shadows.small,
    },
    buttonText: {
        ...typography.headline,
        color: colors.background.primary,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    timerText: {
        ...typography.title2,
        color: colors.text.primary,
        marginLeft: spacing.sm,
    },
}); 