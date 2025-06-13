import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors as newColor } from '@/constants/theme';
import React from 'react';
import useNotification from './notification.hook';
import RejectionModal from './reject-modal';
import styles from './styles';

export default function NotificationsScreen() {

    const {
        colors,
        isRefreshing,
        onRefresh,
        isLoading,
        requests,
        formatTimeAgo,
        handleApprove,
        handleReject,
        showRejectionModal,
        rejectionReason,
        setRejectionReason,
        setShowRejectionModal,
        setSelectedRequestId,
        handleRejectionSubmit,
    } = useNotification();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: newColor.background.primary }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
            </View>

            <ScrollView
                style={styles.notificationsList}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                        progressBackgroundColor={colors.card}
                    />
                }>
                {isLoading ? (
                    <View style={[styles.notificationCard, { backgroundColor: colors.card, alignItems: 'center' }]}>
                        <Text style={[styles.notificationTitle, { color: colors.text }]}>Loading requests...</Text>
                    </View>
                ) : requests.length === 0 ? (
                    <View style={[styles.notificationCard, { backgroundColor: colors.card, alignItems: 'center' }]}>
                        <Text style={[styles.notificationTitle, { color: colors.text }]}>No pending requests</Text>
                    </View>
                ) : (
                    requests.map((request) => (
                        <View
                            key={request.request_id}
                            style={[styles.notificationCard, { backgroundColor: colors.card }]}>
                            <Text style={[styles.notificationTitle, { color: colors.text }]}>
                                {request.type === 'override_checkin'
                                    ? 'Check-in Override Request'
                                    : 'Overtime Request'}
                            </Text>
                            <Text style={[styles.contractorName, { color: colors.text }]}>
                                {request.vendor.name}
                            </Text>
                            <Text style={[styles.eventTitle, { color: colors.text }]}>
                                Event: {request.event.title}
                            </Text>
                            <Text style={[styles.reason, { color: colors.text }]}>
                                Reason: {request.reason}
                            </Text>
                            <Text style={[styles.time, { color: colors.secondaryText }]}>
                                {formatTimeAgo(request.created_at)}
                            </Text>
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={[styles.button, styles.approveButton]}
                                    onPress={() => handleApprove(request.request_id)}>
                                    <Text style={styles.buttonText}>Approve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.rejectButton]}
                                    onPress={() => handleReject(request.request_id)}>
                                    <Text style={styles.buttonText}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
            <RejectionModal
                visible={showRejectionModal}
                value={rejectionReason}
                onChange={setRejectionReason}
                onCancel={() => {
                    setShowRejectionModal(false);
                    setRejectionReason('');
                    setSelectedRequestId(null);
                }}
                onSubmit={handleRejectionSubmit}
                colors={colors}
            />
        </SafeAreaView>
    );
}
