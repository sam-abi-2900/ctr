import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, Modal, Alert, Platform } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MapPin, Upload, Check, Camera, X } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';
import { CameraView, useCameraPermissions } from 'expo-camera';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function CheckInScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [locationVerified, setLocationVerified] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [loading, setLoading] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [locationPermission, setLocationPermission] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    // Parse the event data from params
    const eventData = {
        id: params.eventId as string,
        assignmentId: params.assignmentId as string,
        title: params.title as string,
        date: params.date as string,
        location: params.location as string,
        latitude: parseFloat(params.latitude as string),
        longitude: parseFloat(params.longitude as string),
        warehouse_lat: parseFloat(params.warehouse_lat as string),
        warehouse_lng: parseFloat(params.warehouse_lng as string),
        event_lat: parseFloat(params.event_lat as string),
        event_lng: parseFloat(params.event_lng as string),
        imageUrl: params.imageUrl as string,
        currentStage: params.currentStage as string,
        nextStage: params.nextStage as string,
        eventType: params.eventType as string,
    };

    const EVENT_LOCATION = {
        latitude: eventData.event_lat || eventData.latitude,
        longitude: eventData.event_lng || eventData.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === 'granted');
        })();
    }, []);

    const handleTakePhoto = async () => {
        if (!cameraRef.current) return;

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.7,
                base64: true,
                skipProcessing: true,
            });
            if (photo?.uri) {
                setImageUri(photo.uri);
                setShowCamera(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    const handleVerifyLocation = async () => {
        if (!locationPermission) {
            Alert.alert(
                'Location Permission Required',
                'Please enable location access to verify your location.',
                [{ text: 'OK' }]
            );
            return;
        }

        try {
            const location = await Location.getCurrentPositionAsync({});
            const distance = calculateDistance(
                location.coords.latitude,
                location.coords.longitude,
                EVENT_LOCATION.latitude,
                EVENT_LOCATION.longitude
            );

            if (distance <= 0.5) { // Within 500 meters
                setLocationVerified(true);
            } else {
                Alert.alert(
                    'Location Verification Failed',
                    'You seem to be too far from the event location. Please make sure you are at the venue.',
                    [{ text: 'OK' }]
                );
                setLocationVerified(true);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to verify location. Please try again.');
        }
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const toRad = (value: number) => {
        return (value * Math.PI) / 180;
    };

    const handleOpenCamera = async () => {
        if (!permission?.granted) {
            const result = await requestPermission();
            if (!result.granted) {
                Alert.alert(
                    'Camera Permission Required',
                    'Please enable camera access in your device settings to take check-in photos.',
                    [{ text: 'OK' }]
                );
                return;
            }
        }
        setShowCamera(true);
    };

    const handleCheckIn = async () => {
        if (!locationVerified) {
            Alert.alert('Error', 'Please verify your location first');
            return;
        }

        try {
            setLoading(true);
            const location = await Location.getCurrentPositionAsync({});

            // Create FormData object
            const formData = new FormData();
            formData.append('assignment_id', eventData.assignmentId);
            formData.append('latitude', location.coords.latitude.toString());
            formData.append('longitude', location.coords.longitude.toString());
            formData.append('warehouse_lat', eventData.warehouse_lat.toString());
            formData.append('warehouse_lng', eventData.warehouse_lng.toString());
            formData.append('event_lat', eventData.event_lat.toString());
            formData.append('event_lng', eventData.event_lng.toString());
            formData.append('location_type', 'event');

            // If there's an image, append it to FormData
            if (imageUri) {
                // Get the file extension from the URI
                const uriParts = imageUri.split('.');
                const fileExtension = uriParts[uriParts.length - 1];

                // Create the file object
                const imageFile = {
                    uri: imageUri,
                    type: `image/${fileExtension}`,
                    name: `checkin_photo.${fileExtension}`,
                };

                formData.append('image', imageFile as any);
            }

            console.log('Sending check-in data:', {
                assignmentId: eventData.assignmentId,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                hasImage: !!imageUri
            });

            const response = await fetch('http://localhost:3000/api/vendor/events/checkin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to check in');
            }

            Alert.alert('Success', 'Check-in successful', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Navigate to the next stage or home
                        if (eventData.nextStage === 'completed') {
                            router.push('/');
                        } else {
                            router.push({
                                pathname: '/tasks',
                                params: {
                                    eventId: eventData.id,
                                    assignmentId: eventData.assignmentId,
                                    title: eventData.title,
                                    currentStage: eventData.nextStage,
                                    date: eventData.date
                                }
                            });
                        }
                    }
                }
            ]);
        } catch (error) {
            console.error('Check-in error:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to check in. Please try again.');
        } finally {
            setLoading(false);
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
                <Text style={styles.title}>Check In</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.eventCard}>
                    <Image source={{ uri: eventData.imageUrl }} style={styles.eventImage} />
                    <View style={styles.eventContent}>
                        <Text style={styles.eventTitle}>{eventData.title}</Text>
                        <Text style={styles.eventDetails}>{eventData.location}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Verify Location</Text>
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.mapImage}
                        initialRegion={EVENT_LOCATION}
                        mapType="standard"
                        showsUserLocation={locationPermission}
                        showsMyLocationButton={locationPermission}
                    >
                        <Marker
                            coordinate={{
                                latitude: EVENT_LOCATION.latitude,
                                longitude: EVENT_LOCATION.longitude,
                            }}
                        >
                            <View style={styles.customMarker}>
                                <MapPin size={24} color={colors.danger} />
                                <View style={styles.markerDot} />
                            </View>
                        </Marker>
                    </MapView>
                    <View style={styles.locationInfo}>
                        <Text style={styles.locationText}>{eventData.title}</Text>
                        <Text style={styles.locationSubtext}>{eventData.location}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.verifyLocationButton, locationVerified && styles.verifiedButton]}
                        onPress={handleVerifyLocation}
                        activeOpacity={0.8}
                    >
                        {locationVerified ? (
                            <View style={styles.verifiedContent}>
                                <Check size={20} color={colors.background.primary} />
                                <Text style={styles.verifyButtonText}>Location Verified</Text>
                            </View>
                        ) : (
                            <View style={styles.verifiedContent}>
                                <MapPin size={20} color={colors.background.primary} />
                                <Text style={styles.verifyButtonText}>Verify My Location</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Take Check-in Photo (Optional)</Text>
                <TouchableOpacity
                    style={styles.uploadContainer}
                    onPress={handleOpenCamera}
                    activeOpacity={0.7}
                >
                    {imageUri ? (
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.uploadedImage}
                        />
                    ) : (
                        <>
                            <Camera size={40} color={colors.secondary} />
                            <Text style={styles.uploadText}>Tap to take a check-in photo</Text>
                            <Text style={styles.uploadSubtext}>(Not mandatory)</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.verifyButton,
                        locationVerified ? styles.verifyButtonEnabled : styles.verifyButtonDisabled,
                        loading && styles.verifyButtonDisabled
                    ]}
                    onPress={handleCheckIn}
                    disabled={!locationVerified || loading}
                    activeOpacity={0.8}
                >
                    <Text style={styles.verifyButtonLabel}>
                        {loading ? "Checking in..." : locationVerified ? "Complete Check-in" : "Verify Location First"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.verifyButton, styles.overrideButton]}
                    onPress={() => router.push({
                        pathname: '/override-check-in',
                        params: {
                            type: 'event',
                            assignmentId: eventData.assignmentId,
                            eventId: eventData.id
                        }
                    })}
                    activeOpacity={0.8}
                >
                    <Text style={styles.verifyButtonLabel}>Override Check-in</Text>
                </TouchableOpacity>
            </ScrollView>

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
                        <Text style={styles.cameraTitle}>Take Check-in Photo</Text>
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
    eventCard: {
        backgroundColor: colors.background.new,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginBottom: spacing.lg,
        ...shadows.medium,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
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
        marginBottom: spacing.xs,
    },
    eventDetails: {
        ...typography.subhead,
        color: colors.text.tertiary,
    },
    sectionTitle: {
        ...typography.headline,
        color: colors.text.primary,
        marginBottom: spacing.md,
        marginTop: spacing.md,
    },
    mapContainer: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadows.medium,
        position: 'relative',
        height: 300,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    customMarker: {
        alignItems: 'center',
    },
    markerDot: {
        width: 12,
        height: 12,
        backgroundColor: colors.danger,
        borderRadius: borderRadius.full,
        position: 'absolute',
        bottom: 0,
    },
    locationInfo: {
        position: 'absolute',
        top: spacing.lg,
        left: spacing.md,
        right: spacing.md,
        backgroundColor: colors.background.secondary,
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        ...shadows.medium,
        opacity: 0.9,
    },
    locationText: {
        ...typography.callout,
        color: colors.text.primary,
        textAlign: 'center',
        fontWeight: '600',
    },
    locationSubtext: {
        ...typography.caption1,
        color: colors.text.tertiary,
        textAlign: 'center',
        marginTop: spacing.xs,
    },
    verifyLocationButton: {
        position: 'absolute',
        bottom: spacing.md,
        left: spacing.md,
        right: spacing.md,
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        ...shadows.medium,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifiedButton: {
        backgroundColor: colors.success,
    },
    verifiedContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verifyButtonText: {
        ...typography.callout,
        fontWeight: '600',
        color: colors.background.primary,
        marginLeft: spacing.sm,
    },
    uploadContainer: {
        backgroundColor: colors.background.new,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        marginBottom: spacing.xl,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: colors.secondary,
        minHeight: 200,
        justifyContent: 'center',
    },
    uploadText: {
        ...typography.callout,
        color: colors.text.primary,
        marginTop: spacing.md,
    },
    uploadSubtext: {
        ...typography.caption1,
        color: colors.text.tertiary,
        marginTop: spacing.xs,
    },
    uploadedImage: {
        width: '100%',
        height: 200,
        borderRadius: borderRadius.md,
    },
    verifyButton: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginBottom: spacing.xl,
        ...shadows.medium,
    },
    verifyButtonEnabled: {
        backgroundColor: colors.secondary,
    },
    verifyButtonDisabled: {
        backgroundColor: colors.background.tertiary,
    },
    verifyButtonLabel: {
        ...typography.headline,
        fontWeight: '600',
        color: colors.background.primary,
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
    overrideButton: {
        backgroundColor: colors.warning,
        marginTop: spacing.sm,
    },
}); 