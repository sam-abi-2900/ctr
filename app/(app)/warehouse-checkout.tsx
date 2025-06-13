import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Package, Clock } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';

export default function WarehouseCheckoutScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [warehouseCheckedOut, setWarehouseCheckedOut] = useState(false);
    const [warehouseTimeElapsed, setWarehouseTimeElapsed] = useState(0);
    const [isRunning, setIsRunning] = useState(true); // Start running immediately since we're checking out

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setWarehouseTimeElapsed(prev => prev + 1);
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

    const handleWarehouseCheckout = async () => {
        try {
            // Here you would make an API call to update the warehouse checkout status
            // For now, we'll just simulate success
            setIsRunning(false);
            setWarehouseCheckedOut(true);

            // If this is a warehouse-event type, proceed to truck check-in
            // Otherwise, return to events screen
            console.log("SAKSHAM MATHUR @ WAREHOUSE CHECKOUT", params.eventType);
            if (params.eventType === 'warehouse-event') {
                router.push({
                    pathname: '/truck-check-in-out',
                    params: {
                        eventId: params.eventId,
                        title: params.title,
                        date: params.date,
                        location: params.location,
                        currentStage: 'truck_checkin',
                        nextStage: 'truck_checkout',
                        eventType: params.eventType,
                        warehouseTime: warehouseTimeElapsed.toString(),
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
            Alert.alert('Error', 'Failed to check out from warehouse');
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
                <Text style={styles.title}>Warehouse Checkout</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Package size={80} color={colors.secondary} style={styles.icon} />
                    </View>
                    <Text style={styles.title}>Warehouse Checkout</Text>
                    <Text style={styles.description}>
                        Please complete your warehouse tasks and check out before proceeding.
                    </Text>

                    <View style={styles.timerContainer}>
                        <Clock size={24} color={colors.secondary} />
                        <Text style={styles.timerText}>{formatTime(warehouseTimeElapsed)}</Text>
                    </View>

                    {!warehouseCheckedOut && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleWarehouseCheckout}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>Check Out from Warehouse</Text>
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