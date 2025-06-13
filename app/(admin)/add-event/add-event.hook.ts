import { useState, useEffect } from 'react';
import { Platform, } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import mime from 'mime';
import { EVENTS, URLs } from '@/app/utils/url-const';

type Task = {
    id: string;
    name: string;
    description?: string;
    isSelected?: boolean;
    dependsOn?: string; // ID of the task this depends on
};
type EventType = 'warehouse' | 'event' | 'warehouse-event';

const useAddEvent = () => {
    const router = useRouter();
    const { colors, theme } = useTheme();
    const [eventType, setEventType] = useState<EventType>('warehouse');
    const [title, setTitle] = useState('');
    const [city, setCity] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showTaskPicker, setShowTaskPicker] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [mapType, setMapType] = useState<'warehouse' | 'event'>('warehouse');
    const [warehouseCoordinates, setWarehouseCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);
    const [eventCoordinates, setEventCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentLocation, setCurrentLocation] = useState<{ latitude: number, longitude: number } | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const params = {
                    type: eventType
                };
                const queryString = new URLSearchParams(params).toString();
                // const response = await fetch(`http://localhost:3000/api/tasks/predefined?${queryString}`);
                const response = await fetch(`${URLs.API_ADMIN_BASE_URL}${EVENTS.FETCH_TASKS}?${queryString}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setAvailableTasks(data.tasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                Alert.alert('Error', 'Failed to fetch tasks');
            }
        };

        fetchTasks();
    }, [eventType]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = 'Event title is required';
        }

        if (eventType === 'warehouse' || eventType === 'warehouse-event') {
            if (!city.trim()) {
                newErrors.city = 'City is required';
            }
            if (!warehouseCoordinates) {
                newErrors.warehouseLocation = 'Warehouse location is required';
            }
        }

        if (eventType === 'event' || eventType === 'warehouse-event') {
            if (!eventCoordinates) {
                newErrors.eventLocation = 'Event location is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // const API_BASE_URL = 'http://localhost:3000';

    const handleSave = async () => {
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            const formData = new FormData();

            // Replace with real admin ID from auth/user context
            const adminId = '123e4567-e89b-12d3-a456-426614174000';
            formData.append('admin_id', adminId);
            formData.append('type', eventType);
            formData.append('title', title);
            formData.append('event_datetime', startDate.toISOString());
            formData.append('description', description);
            formData.append('city', city);

            // Add coordinates based on event type
            if (eventType === 'warehouse' || eventType === 'warehouse-event') {
                if (warehouseCoordinates) {
                    formData.append('warehouse_lat', warehouseCoordinates.latitude.toString());
                    formData.append('warehouse_lng', warehouseCoordinates.longitude.toString());
                    // For backward compatibility
                    formData.append('location_lat', warehouseCoordinates.latitude.toString());
                    formData.append('location_lng', warehouseCoordinates.longitude.toString());
                }
            }

            if (eventType === 'event' || eventType === 'warehouse-event') {
                if (eventCoordinates) {
                    formData.append('event_lat', eventCoordinates.latitude.toString());
                    formData.append('event_lng', eventCoordinates.longitude.toString());
                    // For backward compatibility
                    formData.append('location_lat', eventCoordinates.latitude.toString());
                    formData.append('location_lng', eventCoordinates.longitude.toString());
                }
            }

            //make changes to the returning array -> to return task_id, task_name, (sequence) new
            // Add ordered task IDs
            const taskIds = tasks.map(task => task.id);
            formData.append('tasks', JSON.stringify(taskIds));

            // Add image if selected
            if (imageUri) {
                const fileName = imageUri.split('/').pop() || 'image.jpg';
                const mimeType = mime.getType(imageUri) || 'image/jpeg';

                formData.append('image', {
                    uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
                    name: fileName,
                    type: mimeType,
                } as any);
            }
            // console.log(formData);
            const res = await fetch(`${URLs.API_ADMIN_BASE_URL}${EVENTS.CREATE_EVENT}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Server responded with:', errorText);
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const responseText = await res.text();
            let data;
            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('JSON parsing error:', parseError);
                    throw new Error('Invalid JSON response from server');
                }
            }

            console.log('Event created:', data);
            Alert.alert('Success', 'Event created successfully');
            router.back();

        } catch (err) {
            console.error('Error creating event:', err);
            Alert.alert(
                'Error',
                err instanceof Error ? err.message : 'Failed to create event'
            );
        } finally {
            setIsLoading(false);
        }
    };
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const addTask = () => {
        if (selectedTaskId) {
            const taskToAdd = availableTasks.find(task => task.id === selectedTaskId);
            if (taskToAdd && !tasks.some(task => task.id === selectedTaskId)) {
                setTasks([...tasks, { ...taskToAdd, isSelected: false }]);
                setSelectedTaskId('');
            }
        }
    };


    const removeTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to use this feature');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setCurrentLocation({ latitude, longitude });
            if (eventType === 'warehouse' || eventType === 'warehouse-event') {
                setWarehouseCoordinates({ latitude, longitude });
            } else if (eventType === 'event' || eventType === 'warehouse-event') {
                setEventCoordinates({ latitude, longitude });
            }
        } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert('Error', 'Failed to get current location');
        }
    };

    const handleSelectCoordinates = async (type: 'warehouse' | 'event') => {
        await getCurrentLocation();
        setMapType(type);
        setShowMap(true);
    };

    const handleMapPress = (e: any) => {
        if (mapType === 'warehouse') {
            setWarehouseCoordinates(e.nativeEvent.coordinate);
        } else {
            setEventCoordinates(e.nativeEvent.coordinate);
        }
    };

    const handleConfirmLocation = () => {
        if ((mapType === 'warehouse' && warehouseCoordinates) ||
            (mapType === 'event' && eventCoordinates)) {
            setShowMap(false);
        }
    };

    const handlePlaceSelect = (data: any, details: any) => {
        if (details) {
            const { lat, lng } = details.geometry.location;
            const newCoordinates = { latitude: lat, longitude: lng };
            if (mapType === 'warehouse') {
                setWarehouseCoordinates(newCoordinates);
            } else {
                setEventCoordinates(newCoordinates);
            }
            setSearchQuery(data.description);
        }
    };

    const handleImagePicker = async () => {
        setShowImagePicker(true);
    };

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera permissions to take photos');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
        setShowImagePicker(false);
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant photo library permissions');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
        setShowImagePicker(false);
    };
    return {
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

    }
}

export default useAddEvent;