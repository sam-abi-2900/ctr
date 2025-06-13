import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, TextInput, Alert, SafeAreaView } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Check, X, Upload, Clock, MapPin, Users, Camera } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';
import { StandbyTimer } from '@/components/StandbyTimer';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';

type Task = {
    id: string;
    name: string;
    type: string;
    description: string;
    task_status: string | null;
    image_url: string | null;
    rejection_reason: string | null;
    completedAt?: Date;
};

interface Event {
    id: string;
    assignment_id: string;
    title: string;
    type: string;
    city: string;
    event_datetime: string;
    image_url: string;
    latitude: string;
    longitude: string;
    status: string;
    current_stage: string;
    checkin_status: any;
    tasks: Task[];
}

interface EventsResponse {
    assigned: Event[];
    accepted: Event[];
    rejected: Event[];
}

export default function TasksScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [eventData, setEventData] = useState<Event | null>(null);
    const [expandedTask, setExpandedTask] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [timerActive, setTimerActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showCamera, setShowCamera] = useState(false);
    const [taskImageUri, setTaskImageUri] = useState<string | null>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [showPhotoConfirmation, setShowPhotoConfirmation] = useState(false);
    const [tempPhotoUri, setTempPhotoUri] = useState<string | null>(null);

    // Fetch event data and tasks
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const dateParam = params.date as string;
                // Extract just the date part (YYYY-MM-DD) from the datetime string
                console.log('dateParam', dateParam);
                const dateOnly = dateParam.split('T')[0];

                const response = await fetch(
                    `http://localhost:3000/api/vendor/events?vendor_id=1f30b1a0-d4c3-4d36-8f3d-263e6b1b00cd&date=${dateOnly}`
                );
                const data: EventsResponse = await response.json();

                // Find the current event in accepted events
                const currentEvent = data.accepted.find(
                    event => event.id === params.eventId
                );

                if (currentEvent) {
                    setEventData(currentEvent);
                    // Filter tasks based on event type (event tasks for this screen)
                    const eventTasks = currentEvent.tasks.filter(task => task.type === 'event');
                    setTasks(eventTasks);
                } else {
                    Alert.alert('Error', 'Event not found');
                    router.back();
                }
            } catch (error) {
                console.error('Error fetching event data:', error);
                Alert.alert('Error', 'Failed to fetch event data');
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [params.eventId, params.date]);

    // Calculate progress percentage
    const completedTasks = tasks.filter(task => task.task_status === 'accepted').length;
    const progressPercentage = Math.round((completedTasks / tasks.length) * 100);

    // Start the timer when the component mounts
    useEffect(() => {
        setStartTime(new Date());
        setTimerActive(true);
    }, []);

    // Timer logic
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (timerActive) {
            intervalId = setInterval(() => {
                if (startTime) {
                    const now = new Date();
                    const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
                    setElapsedTime(elapsed);
                }
            }, 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [timerActive, startTime]);

    // Format elapsed time as HH:MM:SS
    const formatTime = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleTaskPress = (taskId: string) => {
        setExpandedTask(expandedTask === taskId ? null : taskId);
    };

    const handleTaskComplete = (taskId: string) => {
        setCurrentTaskId(taskId);
        setUploadModalVisible(true);
    };

    const handleTaskReject = (taskId: string) => {
        setCurrentTaskId(taskId);
        setModalVisible(true);
    };

    const handleOpenCamera = async () => {
        if (!permission?.granted) {
            const result = await requestPermission();
            if (!result.granted) {
                Alert.alert(
                    'Camera Permission Required',
                    'Please enable camera access in your device settings to take task completion photos.',
                    [{ text: 'OK' }]
                );
                return;
            }
        }
        setUploadModalVisible(false);
        setShowCamera(true);
    };

    const handleTakePhoto = async () => {
        if (!cameraRef.current) return;

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.7,
                base64: true,
                skipProcessing: true,
            });
            if (photo?.uri) {
                setTempPhotoUri(photo.uri);
                setShowCamera(false);
                setShowPhotoConfirmation(true);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    const handlePhotoConfirm = () => {
        if (tempPhotoUri) {
            setTaskImageUri(tempPhotoUri);
            confirmTaskComplete(true);
        }
        setShowPhotoConfirmation(false);
        setTempPhotoUri(null);
    };

    const handlePhotoReject = () => {
        setShowPhotoConfirmation(false);
        setTempPhotoUri(null);
        handleOpenCamera();
    };

    const confirmTaskComplete = async (shouldUpload: boolean) => {
        if (!currentTaskId || !eventData) return;

        try {
            // Find the task in our tasks array to ensure we have the correct task_id
            const task = tasks.find(t => t.id === currentTaskId);
            if (!task) {
                throw new Error('Task not found');
            }

            // Create FormData object
            const formData = new FormData();
            formData.append('taskId', task.id);
            formData.append('assignmentId', eventData.assignment_id);
            formData.append('status', 'accepted');

            // If there's an image to upload
            if (shouldUpload && taskImageUri) {
                const uriParts = taskImageUri.split('.');
                const fileExtension = uriParts[uriParts.length - 1];

                const imageFile = {
                    uri: taskImageUri,
                    type: `image/${fileExtension}`,
                    name: `task_completion_${task.id}.${fileExtension}`,
                };
                formData.append('image', imageFile as any);
            }

            console.log('Sending task completion data:', {
                task_id: task.id,
                assignment_id: eventData.assignment_id,
                status: 'accepted',
                hasImage: !!taskImageUri
            });

            const response = await fetch('http://localhost:3000/api/vendor/task/action', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to update task status');
            }

            // Update local state
            setTasks(tasks.map(t =>
                t.id === task.id
                    ? { ...t, task_status: 'accepted', completedAt: new Date() }
                    : t
            ));
            setExpandedTask(null);
            setTaskImageUri(null);
        } catch (error) {
            console.error('Error updating task:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update task status');
        } finally {
            setUploadModalVisible(false);
            setCurrentTaskId(null);
        }
    };

    const confirmTaskReject = async () => {
        if (!currentTaskId || !eventData || !rejectionReason.trim()) return;

        try {
            // Find the task in our tasks array to ensure we have the correct task_id
            const task = tasks.find(t => t.id === currentTaskId);
            if (!task) {
                throw new Error('Task not found');
            }

            // Create FormData object
            const formData = new FormData();
            formData.append('taskId', task.id); // Use the task.id from our tasks array
            formData.append('assignmentId', eventData.assignment_id);
            formData.append('status', 'rejected');
            formData.append('rejection_reason', rejectionReason);

            console.log('Sending task rejection data:', {
                task_id: task.id,
                assignment_id: eventData.assignment_id,
                status: 'rejected',
                rejection_reason: rejectionReason
            });

            const response = await fetch('http://localhost:3000/api/vendor/task/action', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to update task status');
            }

            // Update local state
            setTasks(tasks.map(t =>
                t.id === task.id
                    ? { ...t, task_status: 'rejected', rejection_reason: rejectionReason, completedAt: new Date() }
                    : t
            ));
            setExpandedTask(null);
        } catch (error) {
            console.error('Error updating task:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update task status');
        } finally {
            setModalVisible(false);
            setRejectionReason('');
            setCurrentTaskId(null);
        }
    };

    const handleCheckout = async () => {
        try {
            // Request location permissions
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Error', 'Location permission is required for checkout');
                return;
            }

            // Get current location
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Make checkout API call
            const response = await fetch('http://localhost:3000/api/vendor/events/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assignment_id: params.assignmentId,
                    latitude,
                    longitude,
                    location_type: 'event'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to check out');
            }

            // If checkout is successful, proceed with navigation
            if (completedTasks < tasks.length / 2) {
                Alert.alert(
                    "Incomplete Tasks",
                    "You've completed less than half of the tasks. Are you sure you want to check out?",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Check out anyway",
                            onPress: () => router.push({
                                pathname: '/completion',
                                params: {
                                    eventId: params.eventId,
                                    assignmentId: params.assignmentId,
                                    image: eventData?.image_url,
                                    title: params.title,
                                    date: params.date,
                                    location: params.location,
                                    currentStage: 'event_checkout',
                                    nextStage: 'completed',
                                    eventType: params.eventType,
                                    eventTime: elapsedTime.toString()
                                }
                            })
                        }
                    ]
                );
            } else {
                router.push({
                    pathname: '/completion',
                    params: {
                        eventId: params.eventId,
                        assignmentId: params.assignmentId,
                        title: params.title,
                        date: params.date,
                        location: params.location,
                        currentStage: 'event_checkout',
                        nextStage: 'completed',
                        eventType: params.eventType,
                        eventTime: elapsedTime.toString()
                    }
                });
            }
            setTimerActive(false);
        } catch (error) {
            console.error('Error during checkout:', error);
            Alert.alert('Error', 'Failed to complete checkout process');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading tasks...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!eventData) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Event not found</Text>
                </View>
            </SafeAreaView>
        );
    }

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
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.timerContainer}>
                    <Clock size={18} color={colors.secondary} style={styles.timerIcon} />
                    <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.eventCard}>
                    <Image source={{ uri: eventData.image_url }} style={styles.eventImage} />
                    <View style={styles.eventCardContent}>
                        <Text style={styles.eventTitle}>{eventData.title}</Text>
                        <Text style={styles.eventDetails}>{eventData.city}</Text>

                        <View style={styles.progressContainer}>
                            <View style={styles.progressTextContainer}>
                                <Text style={styles.progressText}>Progress</Text>
                                <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
                            </View>
                            <View style={styles.progressBarBackground}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        { width: `${progressPercentage}%` }
                                    ]}
                                />
                            </View>
                            <View style={styles.progressDetails}>
                                <Text style={styles.progressDetailsText}>
                                    {completedTasks} of {tasks.length} tasks completed
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Task List</Text>

                {tasks.map((task, index) => (
                    <View
                        key={task.id}
                        style={[
                            styles.taskCard,
                            task.task_status === 'accepted' ? styles.completedTask :
                                task.task_status === 'rejected' ? styles.rejectedTask : null,
                            expandedTask === task.id ? styles.expandedTask : null
                        ]}
                    >
                        <View style={styles.sequenceNumber}>
                            <Text style={[
                                styles.sequenceText,
                                task.task_status === 'accepted' ? styles.completedSequenceText :
                                    task.task_status === 'rejected' ? styles.rejectedSequenceText : null
                            ]}>
                                {index + 1}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.taskContent}
                            onPress={() => (task.task_status === 'pending' || task.task_status === null) ? handleTaskPress(task.id) : null}
                            activeOpacity={0.7}
                        >
                            <View style={styles.taskHeader}>
                                <Text style={[
                                    styles.taskTitle,
                                    task.task_status === 'accepted' ? styles.completedTaskText :
                                        task.task_status === 'rejected' ? styles.rejectedTaskText : null
                                ]}>
                                    {task.name}
                                </Text>
                                {task.task_status !== 'pending' && task.task_status !== null && (
                                    <View style={[
                                        styles.statusIndicator,
                                        task.task_status === 'accepted' ? styles.completedIndicator : styles.rejectedIndicator
                                    ]}>
                                        {task.task_status === 'accepted' ?
                                            <Check size={14} color="#fff" /> :
                                            <X size={14} color="#fff" />
                                        }
                                    </View>
                                )}
                            </View>

                            <Text style={styles.taskDescription}>{task.description}</Text>

                            {task.completedAt && (
                                <Text style={styles.timestampText}>
                                    {task.task_status === 'accepted' ? 'Completed' : 'Rejected'} at: {task.completedAt.toLocaleTimeString()}
                                </Text>
                            )}
                        </TouchableOpacity>

                        {expandedTask === task.id && (
                            <View style={styles.taskActions}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleTaskComplete(task.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.actionIconContainer}>
                                        <Check size={20} color="#fff" />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleTaskReject(task.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.actionIconContainer, styles.rejectIconContainer]}>
                                        <X size={20} color="#fff" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={handleCheckout}
                    activeOpacity={0.8}
                >
                    <Text style={styles.checkoutButtonText}>Check Out</Text>
                </TouchableOpacity>
            </View>

            {/* Rejection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Why are you unable to complete this task?</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Enter reason here..."
                            placeholderTextColor={colors.text.tertiary}
                            multiline
                            value={rejectionReason}
                            onChangeText={setRejectionReason}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalCancelButton]}
                                onPress={() => setModalVisible(false)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalSubmitButton]}
                                onPress={confirmTaskReject}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.modalSubmitText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Upload Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={uploadModalVisible}
                onRequestClose={() => setUploadModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Complete Task</Text>
                        <Text style={styles.modalDescription}>
                            Would you like to take a photo for this task?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalCancelButton]}
                                onPress={() => {
                                    setUploadModalVisible(false);
                                    confirmTaskComplete(false);
                                }}
                            >
                                <Text style={styles.modalCancelText}>Skip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalSubmitButton]}
                                onPress={handleOpenCamera}
                            >
                                <Camera size={16} color="#fff" style={styles.uploadIcon} />
                                <Text style={styles.modalSubmitText}>Take Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Photo Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showPhotoConfirmation}
                onRequestClose={() => setShowPhotoConfirmation(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirm Photo</Text>
                        {tempPhotoUri && (
                            <Image 
                                source={{ uri: tempPhotoUri }} 
                                style={styles.confirmationImage} 
                            />
                        )}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalCancelButton]}
                                onPress={handlePhotoReject}
                            >
                                <Text style={styles.modalCancelText}>Retake</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalSubmitButton]}
                                onPress={handlePhotoConfirm}
                            >
                                <Check size={16} color="#fff" style={styles.uploadIcon} />
                                <Text style={styles.modalSubmitText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Camera Modal */}
            <Modal
                visible={showCamera}
                animationType="slide"
                onRequestClose={() => setShowCamera(false)}
            >
                <SafeAreaView style={styles.cameraContainer}>
                    <View style={styles.cameraHeader}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowCamera(false)}
                            activeOpacity={0.7}
                        >
                            <X size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                        <Text style={styles.cameraTitle}>Take Task Completion Photo</Text>
                    </View>

                    <CameraView
                        ref={cameraRef}
                        style={styles.camera}
                        facing="back"
                    >
                        <View style={styles.cameraOverlay}>
                            <View style={styles.cameraFrame} />
                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={handleTakePhoto}
                                activeOpacity={0.8}
                            >
                                <View style={styles.captureButtonInner} />
                            </TouchableOpacity>
                        </View>
                    </CameraView>
                </SafeAreaView>
            </Modal>
            <StandbyTimer />
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
        flex: 1,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.new,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
    },
    timerIcon: {
        marginRight: spacing.xs,
    },
    timerText: {
        ...typography.footnote,
        color: colors.secondary,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: spacing.md,
    },
    eventCard: {
        backgroundColor: colors.background.new,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginBottom: spacing.md,
        ...shadows.medium,
    },
    eventImage: {
        width: '100%',
        height: 120,
    },
    eventCardContent: {
        padding: spacing.md,
    },
    eventTitle: {
        ...typography.title3,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    eventDetails: {
        ...typography.subhead,
        color: colors.text.tertiary,
        marginBottom: spacing.md,
    },
    progressContainer: {
        marginTop: spacing.sm,
    },
    progressTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    progressText: {
        ...typography.callout,
        fontWeight: '600',
        color: colors.text.primary,
    },
    progressPercentage: {
        ...typography.callout,
        fontWeight: '600',
        color: colors.secondary,
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: colors.background.tertiary,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.sm,
    },
    progressDetails: {
        marginTop: spacing.sm,
    },
    progressDetailsText: {
        ...typography.footnote,
        color: colors.text.tertiary,
    },
    sectionTitle: {
        ...typography.headline,
        color: colors.text.primary,
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },
    taskCard: {
        backgroundColor: colors.background.new,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
        overflow: 'hidden',
        ...shadows.small,
        flexDirection: 'row',
    },
    completedTask: {
        borderLeftWidth: 4,
        borderLeftColor: colors.success,
    },
    rejectedTask: {
        borderLeftWidth: 4,
        borderLeftColor: colors.danger,
    },
    expandedTask: {
        borderWidth: 1,
        borderColor: colors.secondary,
    },
    sequenceNumber: {
        width: 40,
        backgroundColor: colors.background.newLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: colors.border,
    },
    sequenceText: {
        ...typography.title3,
        color: colors.secondary,
        fontWeight: '700',
    },
    completedSequenceText: {
        color: colors.success,
    },
    rejectedSequenceText: {
        color: colors.danger,
    },
    taskContent: {
        flex: 1,
        padding: spacing.md,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskTitle: {
        ...typography.callout,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.xs,
        flex: 1,
    },
    completedTaskText: {
        textDecorationLine: 'line-through',
        color: colors.success,
    },
    rejectedTaskText: {
        textDecorationLine: 'line-through',
        color: colors.danger,
    },
    statusIndicator: {
        width: 20,
        height: 20,
        borderRadius: borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing.sm,
    },
    completedIndicator: {
        backgroundColor: colors.success,
    },
    rejectedIndicator: {
        backgroundColor: colors.danger,
    },
    taskDescription: {
        ...typography.subhead,
        color: colors.text.tertiary,
        marginBottom: spacing.xs,
    },
    timestampText: {
        ...typography.caption2,
        color: colors.text.quaternary,
        marginTop: spacing.xs,
        fontStyle: 'italic',
    },
    taskActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: spacing.sm,
        backgroundColor: colors.background.tertiary,
    },
    actionButton: {
        marginLeft: spacing.sm,
    },
    actionIconContainer: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.success,
        ...shadows.small,
    },
    rejectIconContainer: {
        backgroundColor: colors.danger,
    },
    bottomBar: {
        padding: spacing.md,
        backgroundColor: colors.background.primary,
        ...shadows.medium,
    },
    checkoutButton: {
        backgroundColor: colors.secondary,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        ...shadows.small,
    },
    checkoutButtonText: {
        ...typography.headline,
        color: colors.background.primary,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        width: '80%',
        ...shadows.large,
    },
    modalTitle: {
        ...typography.headline,
        color: colors.text.primary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    modalInput: {
        backgroundColor: colors.background.tertiary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        color: colors.text.primary,
        minHeight: 100,
        marginBottom: spacing.md,
        ...typography.body,
    },
    modalDescription: {
        ...typography.callout,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginHorizontal: spacing.xs,
    },
    modalCancelButton: {
        backgroundColor: colors.background.tertiary,
    },
    modalSubmitButton: {
        backgroundColor: colors.primary,
    },
    modalCancelText: {
        ...typography.callout,
        color: colors.text.primary,
    },
    modalSubmitText: {
        ...typography.callout,
        fontWeight: '600',
        color: colors.text.primary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...typography.headline,
        color: colors.text.primary,
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    cameraHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        paddingTop: spacing.xxl + spacing.md,
        backgroundColor: colors.background.secondary,
    },
    closeButton: {
        marginRight: spacing.md,
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraTitle: {
        ...typography.title1,
        color: colors.text.primary,
    },
    camera: {
        flex: 1,
    },
    cameraOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraFrame: {
        width: 280,
        height: 280,
        borderWidth: 2,
        borderColor: colors.secondary,
        borderRadius: borderRadius.lg,
        position: 'absolute',
    },
    captureButton: {
        position: 'absolute',
        bottom: spacing.xl,
        width: 80,
        height: 80,
        borderRadius: borderRadius.full,
        backgroundColor: colors.background.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.medium,
    },
    captureButtonInner: {
        width: 70,
        height: 70,
        borderRadius: borderRadius.full,
        backgroundColor: colors.secondary,
    },
    uploadIcon: {
        marginRight: spacing.xs,
    },
    confirmationImage: {
        width: '100%',
        height: 200,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
    },
}); 