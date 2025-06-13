import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { URLs,EVENTS } from '@/app/utils/url-const';

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
    checkin: {
        time: string | null;
        image_url: string | null;
    } | null;
    checkout: {
        time: string | null;
    } | null;
    total_time_minutes: number | null;
    action_time: string | null;
};

type EventDetail = {
    id: string;
    title: string;
    event_datetime: string;
    type: string;
    city: string;
    location: {
        lat: string;
        lng: string;
    };
    image_url: string;

};

type VendorDetail = {
    event: EventDetail;
    assignment: Assignment;
    tasks: Task[];
};

const useVendorDetail = ({ eventId, vendorId }: any) => {
    const router = useRouter();
    // const { eventId, vendorId } = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const [vendorDetail, setVendorDetail] = useState<VendorDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchVendorDetail = async () => {
        try {
            // const response = await fetch(`http://localhost:3000/api/event/detail/${eventId}/vendor/${vendorId}`);
            const response = await fetch(`${URLs.API_ADMIN_BASE_URL}${EVENTS.VENDOR_DETAILS}/${eventId}/vendor/${vendorId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // console.log('data vendor detail', data);
            setVendorDetail(data);
        } catch (error) {
            console.error('Error fetching vendor detail:', error);
            Alert.alert('Error', 'Failed to fetch vendor details');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchVendorDetail();
    }, [eventId, vendorId]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchVendorDetail();
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

    const formatDateTime = (dateString: any) => {
        // console.log('dateString', dateString);
        // dateString = '2025-05-13T04:00:00.000Z';
        if (!dateString) {
            console.log('dateString is null');
            return 'N/A';
        }
        const date = new Date(dateString);
        // console.log('date', date);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return {
        router,
        isLoading,
        colors,
        vendorDetail,
        isRefreshing,
        onRefresh,
        getStatusColor,
        formatDateTime,
    }

}

export default useVendorDetail;