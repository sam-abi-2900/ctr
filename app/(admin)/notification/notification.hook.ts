import { Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';

import { useState, useCallback, useEffect } from 'react';
import { URLs, NOTIFICATION } from '@/app/utils/url-const';

type Vendor = {
    id: string;
    name: string;
};

type Event = {
    id: string;
    title: string;
    event_datetime: string;
    type: string;
    city: string;

};
type Request = {
    request_id: string;
    type: 'override_checkin' | 'overtime';
    reason: string;
    created_at: string;
    vendor: Vendor;
    event: Event;
};

const useNotification = () => {

    const { colors, theme } = useTheme();
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            // const response = await fetch('http://localhost:3000/api/requests/pending');
            const response = await fetch(`${URLs.API_ADMIN_BASE_URL}${NOTIFICATION.PENDING_NOTIFICATION}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
            Alert.alert('Error', 'Failed to fetch requests');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchRequests();
    }, []);

    const handleApprove = async (requestId: string) => {
        try {
            // const response = await fetch(`http://localhost:3000/api/requests/${requestId}`, {
            //     method: 'PATCH',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ status: 'approved' }),
            // });
            const response = await fetch(`${URLs.API_ADMIN_BASE_URL}${NOTIFICATION.ACTION}/${requestId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'approved' }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Remove the approved request from the list
            setRequests(requests.filter(request => request.request_id !== requestId));
            Alert.alert('Success', 'Request approved successfully');
        } catch (error) {
            console.error('Error approving request:', error);
            Alert.alert('Error', 'Failed to approve request');
        }
    };

    const handleReject = (requestId: string) => {
        setSelectedRequestId(requestId);
        setShowRejectionModal(true);
    };

    const handleRejectionSubmit = async () => {
        if (!rejectionReason.trim()) {
            Alert.alert('Error', 'Please provide a reason for rejection');
            return;
        }
        if (!selectedRequestId) return;
        try {
            // const response = await fetch(`http://localhost:3000/api/requests/${selectedRequestId}`, {
            //     method: 'PATCH',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ status: 'rejected', rejection_reason: rejectionReason }),
            // });

            const response = await fetch(`${URLs.API_ADMIN_BASE_URL}${NOTIFICATION.ACTION}/${selectedRequestId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'rejected', rejection_reason: rejectionReason }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setRequests(requests.filter(request => request.request_id !== selectedRequestId));
            Alert.alert('Success', 'Request rejected successfully');
        } catch (error) {
            console.error('Error rejecting request:', error);
            Alert.alert('Error', 'Failed to reject request');
        }
        setShowRejectionModal(false);
        setRejectionReason('');
        setSelectedRequestId(null);
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    return {
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

    }
}

export default useNotification;