import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { EVENTS, URLs } from '@/app/utils/url-const';


type AssignedVendor = {
    id: string;
    name: string;
    status: 'assigned' | 'accepted' | 'rejected';
    rejection_reason: string | null;
    assignment_time: string;
};

type Event = {
    event_id: string;
    title: string;
    event_datetime: string;
    city: string;
    location_lat: string;
    location_lng: string;

    assigned_vendors: AssignedVendor[];
};

type Task = {
    task_id: string;
    sequence: number;
    status: 'pending' | 'accepted' | 'rejected';
    rejection_reason: string | null;
    action_time: string | null;
};

type Assignment = {
    status: 'assigned' | 'accepted' | 'rejected';
    rejection_reason: string | null;
    checkin: string | null;
    checkout: string | null;
    total_time_minutes: number | null;
    action_time: string | null;
};

type EventDetail = {
    id: string;
    title: string;
    type: string;
    city: string;
    location: {
        lat: string;
        lng: string;
    };
    image_url: string;
    event_datetime: string;
};

type VendorDetail = {
    event: EventDetail;
    assignment: Assignment;
    tasks: Task[];
};

const useAssignedEvents = () => {
    const router = useRouter();
    const { colors, theme } = useTheme();
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showDayPicker, setShowDayPicker] = useState(false);
    const [showVendorDetail, setShowVendorDetail] = useState(false);
    const [selectedVendorDetail, setSelectedVendorDetail] = useState<VendorDetail | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    // Get current date for default filters
    const currentDate = new Date();
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const fetchEvents = async () => {
        try {
            const params = new URLSearchParams({
                year: selectedYear.toString(),
                month: selectedMonth.toString(),
                ...(selectedDay && { day: selectedDay.toString() })
            });

            // const response = await fetch(`http://localhost:3000/api/events/assigned?${params}`);
            const response = await fetch(`${URLs.API_ADMIN_BASE_URL}${EVENTS.ASSIGNED_EVENTS}?${params}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [selectedYear, selectedMonth, selectedDay]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchEvents();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'assigned':
                return '#F3A326'; // Golden yellow
            case 'accepted':
                return '#10B981'; // Green
            case 'rejected':
                return '#EF4444'; // Red
            default:
                return colors.secondaryText;
        }
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // const fetchVendorDetail = async (eventId: string, vendorId: string) => {
    //     try {
    //         setIsLoadingDetail(true);
    //         const response = await fetch(`http://localhost:3000/api/event/detail/${eventId}/vendor/${vendorId}`);
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         const data = await response.json();
    //         setSelectedVendorDetail(data);
    //     } catch (error) {
    //         console.error('Error fetching vendor detail:', error);
    //         Alert.alert('Error', 'Failed to fetch vendor details');
    //     } finally {
    //         setIsLoadingDetail(false);
    //     }
    // };

    const handleVendorPress = (eventId: string, vendorId: string) => {
        router.push({
            pathname: '/(admin)/vendor-detail',
            params: { eventId, vendorId }
        });
    };

    // const formatDateTime = (dateString: string | null) => {
    //     if (!dateString) return 'N/A';
    //     const date = new Date(dateString);
    //     return date.toLocaleString('en-US', {
    //         year: 'numeric',
    //         month: 'short',
    //         day: 'numeric',
    //         hour: 'numeric',
    //         minute: '2-digit',
    //         hour12: true
    //     });
    // };

    return {
        router,
        colors,
        setShowYearPicker,
        selectedYear,
        setShowMonthPicker,
        selectedMonth,
        setShowDayPicker,
        selectedDay,
        searchQuery,
        setSearchQuery,
        isRefreshing,
        onRefresh,
        filteredEvents,
        getStatusColor,
        handleVendorPress,
        showYearPicker,
        years,
        setSelectedYear,
        showMonthPicker,
        months,
        setSelectedMonth,
        showDayPicker,
        setSelectedDay,
        days

    }
}

export default useAssignedEvents;