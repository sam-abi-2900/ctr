import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Clock, Check, X } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';

const ADMINS = [
    { id: '1', name: 'Tom Peeters', role: 'DC Manager Leuven/Antwerpen' },
    { id: '2', name: 'Janik Deryt', role: 'Events Warehouse & Technical Manager' }
];

export default function OverrideCheckInScreen() {
    const router = useRouter();
    const { type } = useLocalSearchParams<{ type: string }>();
    const [reason, setReason] = useState('');
    const [adminApprovals, setAdminApprovals] = useState<Record<string, boolean>>({});
    const [currentDateTime] = useState(new Date());

    const handleAdminApproval = (adminId: string) => {
        setAdminApprovals(prev => ({
            ...prev,
            [adminId]: !prev[adminId]
        }));
    };

    const handleSubmit = () => {
        if (!reason.trim()) {
            Alert.alert('Error', 'Please provide a reason for late check-in');
            return;
        }

        const allAdminsApproved = ADMINS.every(admin => adminApprovals[admin.id]);
        if (!allAdminsApproved) {
            Alert.alert('Error', 'All admins must approve the late check-in');
            return;
        }

        // Navigate to appropriate screen based on type
        if (type === 'warehouse') {
            router.push('/warehouse-tasks');
        } else {
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
                <Text style={styles.title}>Override Check-in</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <View style={styles.datetimeContainer}>
                        <Clock size={24} color={colors.secondary} />
                        <Text style={styles.datetimeText}>
                            {currentDateTime.toLocaleDateString()} at {currentDateTime.toLocaleTimeString()}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reason for Late Check-in</Text>
                    <TextInput
                        style={styles.reasonInput}
                        placeholder="Please explain why you are checking in late..."
                        placeholderTextColor={colors.text.tertiary}
                        multiline
                        numberOfLines={4}
                        value={reason}
                        onChangeText={setReason}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Admin Approvals Required</Text>
                    {ADMINS.map(admin => (
                        <View key={admin.id} style={styles.adminCard}>
                            <View style={styles.adminInfo}>
                                <Text style={styles.adminName}>{admin.name}</Text>
                                <Text style={styles.adminRole}>{admin.role}</Text>
                            </View>
                            <TouchableOpacity
                                // style={[
                                //     styles.approvalButton,
                                //     adminApprovals[admin.id] ? styles.approvedButton : styles.pendingButton
                                // ]}
                                onPress={() => handleAdminApproval(admin.id)}
                            >
                                {adminApprovals[admin.id] ? (
                                    <Check size={20} color={'#1C1C1E'} />
                                ) : (
                                    <X size={20} color={'#1C1C1E'} />
                                )}
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                >
                    <Text style={styles.submitButtonText}>Submit Override Request</Text>
                </TouchableOpacity>
            </ScrollView>
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
        backgroundColor: colors.background.secondary,
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
    section: {
        marginBottom: spacing.xl,
    },
    datetimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        ...shadows.medium,
    },
    datetimeText: {
        ...typography.headline,
        color: colors.text.primary,
        marginLeft: spacing.sm,
    },
    sectionTitle: {
        ...typography.headline,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    reasonInput: {
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        ...typography.body,
        color: colors.text.primary,
        ...shadows.medium,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    adminCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.background.secondary,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
        ...shadows.medium,
    },
    adminInfo: {
        flex: 1,
    },
    adminName: {
        ...typography.headline,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    adminRole: {
        ...typography.subhead,
        color: colors.text.tertiary,
    },
    approvalButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pendingButton: {
        backgroundColor: colors.danger,
    },
    approvedButton: {
        backgroundColor: colors.success,
    },
    submitButton: {
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    submitButtonText: {
        ...typography.headline,
        color: colors.background.primary,
    },
}); 