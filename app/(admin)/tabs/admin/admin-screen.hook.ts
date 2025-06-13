import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import { Bell, MoveVertical as MoreVertical, MapPin, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { colors as newColor } from '@/constants/theme';
import { useState, useCallback } from 'react';
import { staticStyles, themedStyles } from './styles';

type Event = {
    id: string;
    title: string;
    event_datetime: string;
    type: string;
    city: string;
    description: string;
    image_url: string;
    location_lat: string;
    location_lng: string;

};

const useAdminScreen = () => {
    let { colors, theme } = useTheme();
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'pending' | 'assigned'>('pending');
    const [requestsLength, setRequestsLength] = useState(0);

    const fetchEvents = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:3000/api/events/unassigned');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setEvents(data.events);
        } catch (error) {
            console.error('Error fetching events:', error);
            Alert.alert('Error', 'Failed to fetch events');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    const fetchRequests = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/requests/pending');
            const data = await response.json();
            setRequestsLength(data.length);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    }, []);

    const handleDelete = async (eventId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Remove the deleted event from the state
            setEvents(events.filter(event => event.id !== eventId));
            Alert.alert('Success', 'Event deleted successfully');
        } catch (error) {
            console.error('Error deleting event:', error);
            Alert.alert('Error', 'Failed to delete event');
        }
    };

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchEvents();
        fetchRequests();
    }, [fetchEvents, fetchRequests]);

    // Fetch events when the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (activeTab === 'pending') {
                fetchEvents();
            }
        }, [fetchEvents, activeTab])
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };
    const themedStyles1 = themedStyles({ colors, theme });
    return {
        colors,
        requestsLength,
        activeTab,
        setActiveTab,
        events,
        isRefreshing,
        onRefresh,
        isLoading,
        formatDate,
        formatTime,
        handleDelete,
        staticStyles,
        themedStyles1
    }
}

export default useAdminScreen;