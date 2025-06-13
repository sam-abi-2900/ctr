import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import { colors as newColor } from '@/constants/theme';
import useVendorDetail from './vendor-detail.hook';
import { useLocalSearchParams } from 'expo-router';

export default function VendorDetailScreen() {
    const { eventId, vendorId } = useLocalSearchParams();
    const {
        router,
        isLoading,
        colors,
        vendorDetail,
        isRefreshing,
        onRefresh,
        getStatusColor,
        formatDateTime,
    } = useVendorDetail({ eventId, vendorId });

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: newColor.background.primary }]}>
                <View style={[styles.header, { backgroundColor: newColor.background.primary }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!vendorDetail) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: newColor.background.primary }]}>
                <View style={[styles.header, { backgroundColor: newColor.background.primary }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>Vendor Details</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: colors.text }]}>Failed to load vendor details</Text>
                </View>
            </SafeAreaView>
        );
    }

    const { event, assignment, tasks } = vendorDetail;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: newColor.background.primary }]}>
            <View style={[styles.header, { backgroundColor: newColor.background.primary }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Vendor Details</Text>
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                        progressBackgroundColor={colors.card}
                    />
                }>
                <View style={styles.detailContainer}>
                    <View style={{
                        flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: newColor.background.new, padding: 16, borderRadius: 16, marginBottom: 16, borderColor: newColor.border,
                        borderWidth: 1
                    }}>
                        <View style={styles.detailHeader}>
                            <Text style={[styles.detailTitle, { color: colors.text }]}>{event.title}</Text>
                            <View style={[styles.statusTag, { backgroundColor: getStatusColor(assignment.status) }]}>
                                <Text style={styles.statusText}>{assignment.status}</Text>
                            </View>
                        </View>

                        <View style={styles.detailInfo}>
                            <Text style={[styles.detailText, { color: colors.text }]}>
                                Type: {event.type}
                            </Text>
                            <View style={styles.locationContainer}>
                                <MapPin size={16} color={colors.secondaryText} />
                                <Text style={[styles.detailText, { color: colors.text }]}>
                                    Location: {event.city}
                                </Text>
                            </View>
                            <Text style={[styles.detailText, { color: colors.text }]}>
                                Event Schedule: {formatDateTime(event.event_datetime)}
                            </Text>
                        </View>
                    </View>

                    {assignment.status === 'rejected' && (
                        <View style={styles.rejectionContainer}>
                            <Text style={[styles.rejectionTitle, { color: colors.text }]}>Rejection Details</Text>
                            <Text style={[styles.rejectionText, { color: colors.text }]}>
                                Reason: {assignment.rejection_reason || 'No reason provided'}
                            </Text>
                            <Text style={[styles.rejectionText, { color: colors.text }]}>
                                Rejected at: {formatDateTime(assignment.action_time)}
                            </Text>
                        </View>
                    )}

                    {assignment.status === 'accepted' && (
                        <>
                            <View style={styles.checkinContainer}>
                                <Text style={[styles.checkinTitle, { color: colors.text }]}>Check-in Details</Text>
                                <Text style={[styles.checkinText, { color: colors.text }]}>
                                    Check-in: {formatDateTime(assignment.checkin?.time)}
                                </Text>
                                <Text style={[styles.checkinText, { color: colors.text }]}>
                                    Total Time: {(assignment.total_time_minutes || assignment.total_time_minutes == 0) ? `${assignment.total_time_minutes} minutes` : 'N/A'}
                                </Text>
                            </View>

                            <View style={styles.tasksContainer}>
                                <Text style={[styles.tasksTitle, { color: colors.text }]}>Tasks</Text>
                                {tasks.map((task) => (
                                    <View key={task.task_id} style={styles.taskItem}>
                                        <View style={styles.taskHeader}>
                                            <Text style={[styles.taskSequence, { color: colors.text }]}>
                                                Task {task.sequence}
                                            </Text>
                                            <View style={[styles.taskStatus, { backgroundColor: getStatusColor(task.status) }]}>
                                                <Text style={styles.taskStatusText}>{task.status}</Text>
                                            </View>
                                        </View>
                                        {task.status === 'rejected' && (
                                            <Text style={[styles.taskRejectionReason, { color: colors.text }]}>
                                                Reason: {task.rejection_reason || 'No reason provided'}
                                            </Text>
                                        )}
                                        {task.action_time && (
                                            <Text style={[styles.taskActionTime, { color: colors.text }]}>
                                                {task.status === 'accepted' ? 'Completed' : 'Rejected'} at: {formatDateTime(task.action_time)}
                                            </Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Inter_600SemiBold',
    },
    content: {
        flex: 1,
    },
    detailContainer: {
        padding: 16,
        gap: 16,

    },
    detailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    detailTitle: {
        fontSize: 24,
        fontFamily: 'Inter_600SemiBold',
        flex: 1,
    },
    statusTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    detailInfo: {
        marginTop: 16,
        gap: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    rejectionContainer: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    rejectionTitle: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
    },
    rejectionText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    checkinContainer: {
        backgroundColor: newColor.background.new,
        padding: 16,
        borderRadius: 12,
        gap: 8,
        borderColor: newColor.border,
        borderWidth: 1
    },
    checkinTitle: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
    },
    checkinText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    tasksContainer: {
        gap: 12,
    },
    tasksTitle: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
    },
    taskItem: {
        backgroundColor: newColor.background.new,
        padding: 12,
        borderRadius: 8,
        gap: 8,
        borderColor: newColor.border,
        borderWidth: 1
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskSequence: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    taskStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    taskStatusText: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    taskRejectionReason: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: '#EF4444',
    },
    taskActionTime: {
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        color: '#6B7280',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        textAlign: 'center',
    },
}); 