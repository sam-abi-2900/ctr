
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Check, ChevronLeft, CircleAlert as AlertCircle, X } from 'lucide-react-native';
import { colors as newColor } from '@/constants/theme';
import useAssignEvent from './assignEvent.hook';
import styles from './styles';

export default function AssignScreen() {

    const {
        isLoading,
        router,
        event,
        theme,
        colors,
        isRefreshing,
        onRefresh,
        vendors,
        selectedUsers,
        openCalendar,
        toggleUserSelection,
        isAssigning,
        handleAssign,
        calendarVisible,
        setCalendarVisible,
        selectedUser,
    } = useAssignEvent();


    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: newColor.background.primary }]}>
                <View style={[styles.header, { backgroundColor: newColor.background.primary }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color={'#fff'} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: '#fff' }]}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!event) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: newColor.background.primary }]}>
                <View style={[styles.header, { backgroundColor: newColor.background.primary }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color={'#fff'} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: '#fff' }]}>Event not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: newColor.background.primary }]}>
            <View style={[styles.header, { backgroundColor: newColor.background.primary }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={'#fff'} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={[styles.title, { color: '#fff' }]}>{event.title}</Text>
                    <Text style={[styles.subtitle, { color: '#fff' }]}>
                        {new Date(event.event_datetime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </Text>
                    <View style={[styles.taskCount, { backgroundColor: theme === 'dark' ? colors.inputBackground : '#fff' }]}>
                        <Text style={[styles.taskText, { color: '#1B1916' }]}>{event.task_count} Tasks to Assign</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={[styles.userList, { backgroundColor: newColor.background.primary, borderWidth: 1, borderColor: '#3F3C39', borderBottomColor: '#3F3C39' }]}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                        progressBackgroundColor={colors.card}
                    />
                }>
                {vendors.map((vendor) => (
                    <TouchableOpacity
                        key={vendor.id}
                        style={[
                            styles.userRow,
                            { backgroundColor: colors.card, shadowColor: '#F3A326', borderWidth: 1, borderColor: '#AFACA7' },
                            selectedUsers.has(vendor.id) && [
                                styles.selectedUserRow,
                                { borderColor: '#F3A326' }
                            ]
                        ]}
                        onPress={() => console.log('calendar modal visible')}>
                        <View style={styles.userInfo}>
                            <TouchableOpacity
                                style={[
                                    styles.checkbox,
                                    { borderColor: colors.border },
                                    selectedUsers.has(vendor.id) && [
                                        styles.checkboxSelected,
                                        { backgroundColor: colors.primary, borderColor: colors.primary }
                                    ]
                                ]}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    toggleUserSelection(vendor.id);
                                }}>
                                {selectedUsers.has(vendor.id) && <Check size={16} color="#fff" />}
                            </TouchableOpacity>
                            <Image source={{ uri: vendor.avatar }} style={styles.avatar} />
                            <View style={styles.userDetails}>
                                <Text style={[styles.userName, { color: colors.text }]}>{vendor.name}</Text>
                                <View style={[styles.assignedCount, { backgroundColor: theme === 'dark' ? colors.inputBackground : '#F3F4F6' }]}>
                                    <Text style={[styles.assignedText, { color: '#000' }]}>
                                        {vendor.assigned_event_count} events assigned
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {vendor.hasTimeOff && (
                            <View style={styles.timeOffWarning}>
                                <AlertCircle size={16} color={colors.danger} />
                                <Text style={[styles.warningText, { color: colors.danger }]}>Time-off conflict</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.card }]}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton, { backgroundColor: theme === 'dark' ? colors.inputBackground : '#F3F4F6' }]}
                    onPress={() => router.back()}>
                    <Text style={[styles.cancelButtonText, { color: colors.secondaryText }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.assignButton,
                        {
                            backgroundColor: colors.primary,
                            opacity: isAssigning ? 0.7 : 1
                        }
                    ]}
                    onPress={handleAssign}
                    disabled={isAssigning}>
                    <Text style={styles.assignButtonText}>
                        {isAssigning ? 'Assigning...' : `Assign (${selectedUsers.size} selected)`}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* TODO: Phase 2 of development */}
            {/* <Modal
                visible={calendarVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setCalendarVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {selectedUser?.name}'s Schedule
                            </Text>
                            <TouchableOpacity
                                onPress={() => setCalendarVisible(false)}
                                style={styles.closeButton}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.calendarContainer}>
                            <View style={styles.legend}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
                                    <Text style={[styles.legendText, { color: colors.secondaryText }]}>Time Off</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                                    <Text style={[styles.legendText, { color: colors.secondaryText }]}>Event Date</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: theme === 'dark' ? '#7E22CE' : '#7E22CE' }]} />
                                    <Text style={[styles.legendText, { color: colors.secondaryText }]}>Conflict</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal> */}
        </SafeAreaView>
    );
}
