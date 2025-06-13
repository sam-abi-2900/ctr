import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Platform,
    FlatList,
    Modal,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Clock, CircleAlert as AlertCircle, Plus, Minus, ChevronDown, Captions, Camera, Image as IMAGE } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';
import { Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import mime from 'mime';
import { colors as newColor } from '@/constants/theme';
import styles from './styles';
import useAddEvent from './add-event.hook';

type Task = {
    id: string;
    name: string;
    description?: string;
    isSelected?: boolean;
    dependsOn?: string; // ID of the task this depends on
};
type EventType = 'warehouse' | 'event' | 'warehouse-event';

const NewEventScreen = () => {
    const {
        router,
        colors,
        eventType,
        setEventType,
        title,
        setTitle,
        errors,
        setShowStartPicker,
        formatDate,
        formatTime,
        showStartPicker,
        startDate,
        setStartDate,
        city,
        setCity,
        handleSelectCoordinates,
        warehouseCoordinates,
        eventCoordinates,
        handleImagePicker,
        imageUri,
        description,
        setDescription,
        tasks,
        removeTask,
        setShowTaskPicker,
        selectedTaskId,
        availableTasks,
        addTask,
        showTaskPicker,
        setSelectedTaskId,
        showMap,
        setShowMap,
        mapType,
        handleConfirmLocation,
        handlePlaceSelect,
        handleMapPress,
        currentLocation,
        showImagePicker,
        handleTakePhoto,
        handlePickImage,
        setShowImagePicker,
        isLoading,
        handleSave,

    } = useAddEvent();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: newColor.background.primary }]}>
            <View style={[styles.header, { backgroundColor: newColor.background.primary }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>New Event</Text>
            </View>

            <ScrollView style={[styles.content, { backgroundColor: newColor.background.primary }]}>
                {/* Add Event Type Selector */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>Event Type</Text>
                    <View style={styles.typeButtons}>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                {
                                    backgroundColor: eventType === 'warehouse' ? colors.primary : newColor.background.new,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => setEventType('warehouse')}>
                            <Text
                                style={[
                                    styles.typeButtonText,
                                    { color: eventType === 'warehouse' ? '#000' : '#fff' }
                                ]}>
                                Warehouse
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                {
                                    backgroundColor: eventType === 'event' ? colors.primary : newColor.background.new,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => setEventType('event')}>
                            <Text
                                style={[
                                    styles.typeButtonText,
                                    { color: eventType === 'event' ? '#000' : '#fff' }
                                ]}>
                                Events
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                {
                                    backgroundColor: eventType === 'warehouse-event' ? colors.primary : newColor.background.new,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => setEventType('warehouse-event')}>
                            <Text
                                style={[
                                    styles.typeButtonText,
                                    { color: eventType === 'warehouse-event' ? '#000' : '#fff' }
                                ]}>
                                Warehouse - Events
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>Event Title</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: newColor.background.new,
                                color: colors.text,
                                borderColor: errors.title ? colors.danger : colors.border
                            }
                        ]}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter event title"
                        placeholderTextColor={colors.secondaryText}
                    />
                    {errors.title && (
                        <Text style={[styles.errorText, { color: colors.danger }]}>{errors.title}</Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>Date & Time</Text>
                    <TouchableOpacity
                        style={[styles.dateButton, { backgroundColor: newColor.background.new, borderColor: colors.border }]}
                        onPress={() => setShowStartPicker(true)}>
                        <Clock size={20} color={colors.secondaryText} />
                        <Text style={[styles.dateButtonText, { color: colors.text }]}>
                            {formatDate(startDate)} at {formatTime(startDate)}
                        </Text>
                        <ChevronDown size={20} color={colors.secondaryText} />
                    </TouchableOpacity>
                    {errors.date && (
                        <Text style={[styles.errorText, { color: colors.danger }]}>{errors.date}</Text>
                    )}

                    {(Platform.OS === 'ios' || showStartPicker) && (
                        <DateTimePicker
                            textColor='#fff'
                            value={startDate}
                            mode="datetime"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selectedDate) => {
                                setShowStartPicker(Platform.OS === 'ios');
                                if (selectedDate) {
                                    setStartDate(selectedDate);
                                }
                            }}
                        />
                    )}
                </View>
                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>City</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: newColor.background.new,
                                color: colors.text,
                                borderColor: errors.city ? colors.danger : colors.border
                            }
                        ]}
                        value={city}
                        onChangeText={setCity}
                        placeholder="Enter city name"
                        placeholderTextColor={colors.secondaryText}
                    />
                    {errors.city && (
                        <Text style={[styles.errorText, { color: colors.danger }]}>{errors.city}</Text>
                    )}
                </View>

                {(eventType === 'warehouse' || eventType === 'warehouse-event') && (
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: colors.text }]}>Warehouse Location</Text>
                        <TouchableOpacity
                            style={[styles.coordinatesButton, { backgroundColor: newColor.background.new, borderColor: colors.border }]}
                            onPress={() => handleSelectCoordinates('warehouse')}
                        >
                            <MapPin size={20} color={colors.primary} />
                            <Text style={[styles.coordinatesButtonText, { color: colors.secondaryText }]}>
                                {warehouseCoordinates
                                    ? `${warehouseCoordinates.latitude.toFixed(6)}, ${warehouseCoordinates.longitude.toFixed(6)}`
                                    : 'Select warehouse coordinates on map'}
                            </Text>
                        </TouchableOpacity>
                        {errors.warehouseLocation && (
                            <Text style={[styles.errorText, { color: colors.danger }]}>{errors.warehouseLocation}</Text>
                        )}
                    </View>
                )}

                {(eventType === 'event' || eventType === 'warehouse-event') && (
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: colors.text }]}>Event Location</Text>
                        <TouchableOpacity
                            style={[styles.coordinatesButton, { backgroundColor: newColor.background.new, borderColor: colors.border }]}
                            onPress={() => handleSelectCoordinates('event')}
                        >
                            <MapPin size={20} color={colors.primary} />
                            <Text style={[styles.coordinatesButtonText, { color: colors.secondaryText }]}>
                                {eventCoordinates
                                    ? `${eventCoordinates.latitude.toFixed(6)}, ${eventCoordinates.longitude.toFixed(6)}`
                                    : 'Select event coordinates on map'}
                            </Text>
                        </TouchableOpacity>
                        {errors.eventLocation && (
                            <Text style={[styles.errorText, { color: colors.danger }]}>{errors.eventLocation}</Text>
                        )}
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>Image</Text>
                    <TouchableOpacity
                        style={[styles.imageUploadContainer, { backgroundColor: newColor.background.new, borderColor: colors.border }]}
                        onPress={handleImagePicker}
                    >
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
                        ) : (
                            <View style={styles.uploadPlaceholder}>
                                <Camera size={24} color={colors.secondaryText} />
                                <Text style={[styles.uploadText, { color: colors.secondaryText }]}>
                                    Tap to upload image
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                    <TextInput
                        style={[
                            styles.input,
                            styles.textArea,
                            {
                                backgroundColor: newColor.background.new,
                                color: colors.text,
                                borderColor: colors.border
                            }
                        ]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter event description"
                        placeholderTextColor={colors.secondaryText}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                {/* Showing tasks for all types */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>Tasks</Text>
                    {tasks.map((task) => (
                        <View
                            key={task.id}
                            style={[
                                styles.taskItem,
                                { backgroundColor: newColor.background.new, borderColor: colors.border }
                            ]}
                        >
                            <Text style={[styles.taskText, { color: colors.text }]}>
                                {task.name}
                            </Text>
                            <TouchableOpacity
                                style={styles.removeTaskButton}
                                onPress={() => removeTask(task.id)}>
                                <Minus size={20} color={colors.danger} />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <View style={styles.addTaskContainer}>
                        <TouchableOpacity
                            style={[styles.dropdownContainer, { backgroundColor: newColor.background.new, borderColor: colors.border }]}
                            onPress={() => setShowTaskPicker(true)}
                        >
                            <Text style={[styles.dropdownText, { color: selectedTaskId ? colors.text : colors.secondaryText }]}>
                                {selectedTaskId ? availableTasks.find(task => task.id === selectedTaskId)?.name : 'Select a task'}
                            </Text>
                            <ChevronDown size={20} color={colors.secondaryText} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.addTaskButton, { backgroundColor: newColor.background.new, borderColor: colors.border }]}
                            onPress={addTask}
                            disabled={!selectedTaskId}>
                            <Plus size={20} color={!selectedTaskId ? colors.border : colors.primary} />
                        </TouchableOpacity>

                        <Modal
                            visible={showTaskPicker}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setShowTaskPicker(false)}
                        >
                            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                                    <View style={styles.modalHeader}>
                                        <Text style={[styles.modalTitle, { color: colors.text }]}>Select Task</Text>
                                        <TouchableOpacity onPress={() => setShowTaskPicker(false)}>
                                            <Text style={[styles.modalClose, { color: colors.primary }]}>Done</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <FlatList
                                        data={availableTasks}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => {
                                            console.log(item);
                                            return (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.modalItem,
                                                        {
                                                            backgroundColor: selectedTaskId === item.id ? colors.primary : 'transparent',
                                                            opacity: tasks.some(t => t.id === item.id) ? 0.5 : 1
                                                        }
                                                    ]}
                                                    onPress={() => {
                                                        if (!tasks.some(t => t.id === item.id)) {
                                                            setSelectedTaskId(item.id);
                                                        }
                                                    }}
                                                    disabled={tasks.some(t => t.id === item.id)}
                                                >
                                                    <Text style={[
                                                        styles.modalItemText,
                                                        {
                                                            color: selectedTaskId === item.id ? '#FFFFFF' : colors.text,
                                                            opacity: tasks.some(t => t.id === item.id) ? 0.5 : 1
                                                        }
                                                    ]}>
                                                        {item.name}
                                                    </Text>
                                                    {item.description && (
                                                        <Text style={[
                                                            styles.modalItemDescription,
                                                            {
                                                                color: selectedTaskId === item.id ? '#FFFFFF' : colors.secondaryText,
                                                                opacity: tasks.some(t => t.id === item.id) ? 0.5 : 1
                                                            }
                                                        ]}>
                                                            {item.description}
                                                        </Text>
                                                    )}
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>

                {/* Map Modal */}
                <Modal
                    visible={showMap}
                    animationType="slide"
                    transparent={true}
                >
                    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                        <View style={[styles.mapModalContainer, { backgroundColor: colors.background }]}>
                            <View style={[styles.mapHeader, { borderBottomColor: colors.border }]}>
                                <TouchableOpacity onPress={() => setShowMap(false)} style={styles.backButton}>
                                    <ChevronLeft size={24} color={colors.text} />
                                </TouchableOpacity>
                                <Text style={[styles.mapTitle, { color: colors.text }]}>
                                    Select {mapType === 'warehouse' ? 'Warehouse' : 'Event'} Location
                                </Text>
                                <TouchableOpacity
                                    onPress={handleConfirmLocation}
                                    style={[styles.confirmButton, { backgroundColor: colors.primary }]}
                                >
                                    <Text style={styles.confirmButtonText}>Done</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.searchContainer}>
                                <GooglePlacesAutocomplete
                                    placeholder="Search for a place"
                                    onPress={handlePlaceSelect}
                                    query={{
                                        key: 'YOUR_GOOGLE_PLACES_API_KEY',
                                        language: 'en',
                                    }}
                                    styles={{
                                        container: {
                                            flex: 0,
                                        },
                                        textInput: {
                                            height: 40,
                                            color: colors.text,
                                            backgroundColor: colors.card,
                                            borderColor: colors.border,
                                            borderWidth: 1,
                                            borderRadius: 8,
                                        },
                                        listView: {
                                            backgroundColor: colors.card,
                                            borderColor: colors.border,
                                            borderWidth: 1,
                                            borderRadius: 8,
                                        },
                                        row: {
                                            backgroundColor: colors.card,
                                        },
                                        description: {
                                            color: colors.text,
                                        },
                                    }}
                                />
                            </View>

                            <View style={styles.mapContainer}>
                                <MapView
                                    style={styles.map}
                                    onPress={handleMapPress}
                                    initialRegion={{
                                        latitude: currentLocation?.latitude || 0,
                                        longitude: currentLocation?.longitude || 0,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                >
                                    {mapType === 'warehouse' && warehouseCoordinates && (
                                        <Marker
                                            coordinate={warehouseCoordinates}
                                        />
                                    )}
                                    {mapType === 'event' && eventCoordinates && (
                                        <Marker
                                            coordinate={eventCoordinates}
                                        />
                                    )}
                                </MapView>
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>

                {/* Image Picker Modal */}
                <Modal
                    visible={showImagePicker}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={[styles.imagePickerModal, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                        <View style={[styles.imagePickerContent, { backgroundColor: colors.card }]}>
                            <TouchableOpacity
                                style={[styles.imagePickerOption, { borderBottomColor: colors.border }]}
                                onPress={handleTakePhoto}
                            >
                                <Camera size={24} color={colors.text} />
                                <Text style={[styles.imagePickerOptionText, { color: colors.text }]}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.imagePickerOption}
                                onPress={handlePickImage}
                            >
                                {/* <im size={24} color={colors.text} /> */}
                                <IMAGE size={24} color={colors.text} />
                                <Text style={[styles.imagePickerOptionText, { color: colors.text }]}>Choose from Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.imagePickerOption, { borderTopColor: colors.border }]}
                                onPress={() => setShowImagePicker(false)}
                            >
                                <Text style={[styles.imagePickerOptionText, { color: colors.danger }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: newColor.background.primary, borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton, { backgroundColor: newColor.background.new }]}
                    onPress={() => router.back()}>
                    <Text style={[styles.cancelButtonText, { color: '#FFFFFF' }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.saveButton,
                        { backgroundColor: colors.primary },
                        isLoading && styles.buttonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={isLoading}>
                    <Text style={styles.saveButtonText}>
                        {isLoading ? 'Saving...' : 'Save Event'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default NewEventScreen;
// Add new styles for the type selection buttons
