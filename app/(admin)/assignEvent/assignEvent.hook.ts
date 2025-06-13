import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { EVENTS, URLs } from '@/app/utils/url-const';


type Vendor = {
    id: string;
    name: string;
    assigned_event_count: number;
    avatar?: string;
    hasTimeOff?: boolean;
};

type Event = {
    id: string;
    title: string;
    event_datetime: string;
    task_count: number;
};

const useAssignEvent = () => {
    const router = useRouter();
    const { eventId } = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Vendor | null>(null);
    const [event, setEvent] = useState<Event | null>(null);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAssigning, setIsAssigning] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchEventAndVendors = async () => {
        try {
            // const response = await fetch(`http://localhost:3000/api/assign/event-info/${eventId}`);
            const response = await fetch(`${URLs.API_ADMIN_BASE_URL}${EVENTS.EVENT_DETAILS}/${eventId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setEvent(data.event);

            // Add default avatar and hasTimeOff to vendors
            const vendorsWithDefaults = data.vendors.map((vendor: Vendor) => ({
                ...vendor,
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
                hasTimeOff: false
            }));
            setVendors(vendorsWithDefaults);
        } catch (error) {
            console.error('Error fetching event and vendors:', error);
            Alert.alert('Error', 'Failed to fetch event and vendors data');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEventAndVendors();
    }, [eventId]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchEventAndVendors();
    }, []);

    const toggleUserSelection = (userId: string) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    const openCalendar = (user: Vendor) => {
        setSelectedUser(user);
        setCalendarVisible(true);
    };

    const handleAssign = async () => {
        if (selectedUsers.size === 0) {
            Alert.alert('Error', 'Please select at least one vendor to assign');
            return;
        }

        try {
            setIsAssigning(true);
            // const response = await fetch('http://localhost:3000/api/event/vendors', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         event_id: eventId,
            //         vendor_ids: Array.from(selectedUsers)
            //     })
            // });
            const response = await fetch(`${URLs.API_ADMIN_BASE_URL}${EVENTS.ASSIGN_EVENT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event_id: eventId,
                    vendor_ids: Array.from(selectedUsers)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to assign vendors to event');
            }

            const data = await response.json();
            Alert.alert('Success', data.message, [
                {
                    text: 'OK',
                    onPress: () => router.back()
                }
            ]);
        } catch (error) {
            console.error('Error assigning vendors:', error);
            Alert.alert('Error', 'Failed to assign vendors to event');
        } finally {
            setIsAssigning(false);
        }
    };

    return {
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
    }
}

export default useAssignEvent;