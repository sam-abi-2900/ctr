import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, CheckCircle } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';

export default function VerificationScreen() {
    const router = useRouter();
    const { title, type } = useLocalSearchParams<{ title: string; type: string }>();

    const handleProceedToTasks = () => {
        console.log('Event title:', title); // Debug log
        console.log('Event type:', type); // Debug log
        if (type === 'warehouse2') {
            console.log('Redirecting to warehouse tasks'); // Debug log
            router.push('/warehouse-tasks');
        } else {
            console.log('Redirecting to regular tasks'); // Debug log
            router.push('/tasks');
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
                <Text style={styles.title}>Verification</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <CheckCircle size={80} color={colors.success} style={styles.icon} />
                    </View>
                    <Text style={styles.verifyTitle}>Event Verified</Text>
                    <Text style={styles.verifyText}>
                        You have successfully verified your attendance for this event.
                    </Text>

                    <View style={styles.infoContainer}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Event:</Text>
                            <Text style={styles.infoValue}>{title || 'Event'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Date:</Text>
                            <Text style={styles.infoValue}>April 12, 2024</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Location:</Text>
                            <Text style={styles.infoValue}>Distribution Center</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleProceedToTasks}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Proceed to Tasks</Text>
                    </TouchableOpacity>
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
    verifyTitle: {
        ...typography.title2,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    verifyText: {
        ...typography.callout,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    infoContainer: {
        width: '100%',
        marginBottom: spacing.xl,
        backgroundColor: colors.background.newLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    infoLabel: {
        ...typography.callout,
        fontWeight: '600',
        color: colors.text.tertiary,
    },
    infoValue: {
        ...typography.callout,
        color: colors.text.primary,
    },
    button: {
        backgroundColor: colors.success,
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
}); 