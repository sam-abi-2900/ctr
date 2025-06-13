import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Clock, CheckCircle2, Calendar, Warehouse, Truck } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';

const DUMMY_EVENT = {
    id: '2',
    title: 'Tomorrowland Belgium',
    organizer: 'TechHub',
    date: '2024-04-05',
    image: 'https://i.ytimg.com/vi/t-3ErVKHgl4/sddefault.jpg?v=6541128f',
    location: 'Convention Center',
};

export default function CompletionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { totalTime, completedTasks, totalTasks, warehouseTime, truckTime, timeElapsed } = params;

    const formatTime = (seconds: string | string[] | number): string => {
        const secs = typeof seconds === 'string' ? parseInt(seconds, 10) :
            typeof seconds === 'number' ? seconds : 0;
        if (isNaN(secs)) return '00:00:00';

        const hrs = Math.floor(secs / 3600);
        const mins = Math.floor((secs % 3600) / 60);
        const remainingSecs = secs % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
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
                <Text style={styles.title}>Event Completed</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.successIconContainer}>
                    <CheckCircle2 size={80} color={colors.success} />
                    <Text style={styles.successText}>Great job!</Text>
                </View>

                <View style={styles.eventCard}>
                    <Image source={{ uri: DUMMY_EVENT.image }} style={styles.eventImage} />
                    <View style={styles.eventContent}>
                        <Text style={styles.eventTitle}>{DUMMY_EVENT.title}</Text>
                        <View style={styles.eventDetailRow}>
                            <Calendar size={16} color={colors.text.tertiary} />
                            <Text style={styles.eventDetails}>{DUMMY_EVENT.date}</Text>
                        </View>
                        <View style={styles.eventDetailRow}>
                            <Clock size={16} color={colors.text.tertiary} />
                            <Text style={styles.eventDetails}>{DUMMY_EVENT.location}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statTitle}>Tasks Completed</Text>
                        <Text style={styles.statValue}>{completedTasks} / {totalTasks}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statTitle}>Total Time</Text>
                        <Text style={styles.statValue}>{formatTime(totalTime)}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Time Breakdown</Text>

                    {warehouseTime && (
                        <View style={styles.timeItem}>
                            <View style={styles.timeIcon}>
                                <Warehouse size={24} color={colors.secondary} />
                            </View>
                            <View style={styles.timeDetails}>
                                <Text style={styles.timeLabel}>Warehouse Time</Text>
                                <Text style={styles.timeValue}>{formatTime(warehouseTime)}</Text>
                            </View>
                        </View>
                    )}

                    {truckTime && (
                        <View style={styles.timeItem}>
                            <View style={styles.timeIcon}>
                                <Truck size={24} color={colors.secondary} />
                            </View>
                            <View style={styles.timeDetails}>
                                <Text style={styles.timeLabel}>Truck Driving Time</Text>
                                <Text style={styles.timeValue}>{formatTime(truckTime)}</Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.timeItem}>
                        <View style={styles.timeIcon}>
                            <Clock size={24} color={colors.secondary} />
                        </View>
                        <View style={styles.timeDetails}>
                            <Text style={styles.timeLabel}>Event Time</Text>
                            <Text style={styles.timeValue}>{formatTime(timeElapsed)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.messageCard}>
                    <Text style={styles.messageTitle}>Thank you for your participation!</Text>
                    <Text style={styles.messageText}>
                        Your contribution has been recorded and will help make this event a success.
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => router.push('/(app)/(tabs)')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.homeButtonText}>Return to Home</Text>
                </TouchableOpacity>
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
    },
    successIconContainer: {
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    successText: {
        ...typography.title2,
        color: colors.success,
        marginTop: spacing.md,
    },
    eventCard: {
        backgroundColor: colors.background.new,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginBottom: spacing.lg,
        ...shadows.medium,
    },
    eventImage: {
        width: '100%',
        height: 150,
    },
    eventContent: {
        padding: spacing.md,
    },
    eventTitle: {
        ...typography.title3,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    eventDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    eventDetails: {
        ...typography.subhead,
        color: colors.text.tertiary,
        marginLeft: spacing.sm,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.background.new,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginHorizontal: spacing.xs,
        alignItems: 'center',
        ...shadows.medium,
    },
    statTitle: {
        ...typography.caption1,
        color: colors.text.tertiary,
        marginBottom: spacing.xs,
    },
    statValue: {
        ...typography.title2,
        color: colors.secondary,
    },
    card: {
        backgroundColor: colors.background.new,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        marginBottom: spacing.md,
        ...shadows.medium,
    },
    sectionTitle: {
        ...typography.title2,
        color: colors.text.primary,
        marginBottom: spacing.md,
        alignSelf: 'flex-start',
    },
    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        width: '100%',
    },
    timeIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.background.tertiary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    timeDetails: {
        flex: 1,
    },
    timeLabel: {
        ...typography.subhead,
        color: colors.text.secondary,
    },
    timeValue: {
        ...typography.title2,
        color: colors.text.primary,
    },
    messageCard: {
        backgroundColor: colors.background.new,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadows.medium,
    },
    messageTitle: {
        ...typography.headline,
        color: colors.text.primary,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    messageText: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    bottomBar: {
        padding: spacing.md,
        backgroundColor: colors.background.primary,
        ...shadows.medium,
    },
    homeButton: {
        backgroundColor: colors.secondary,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        ...shadows.small,
    },
    homeButtonText: {
        ...typography.headline,
        color: colors.background.primary,
    },
}); 