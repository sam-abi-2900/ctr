import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, RefreshControl, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Clock, User, ChevronDown, ShowerHead } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { colors as newColor } from '@/constants/theme';
import { URLs,SUMMARY } from '@/app/utils/url-const';

const DAVID_AVATAR = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e';

type SummaryItem = {
    vendor_id: string;
    vendor_name: string;
    total_work_time: string | null;
    total_overtime: string | null;
    total_standby_time: string | null;
};

type MonthOption = { label: string; value: string };

const useSummary = () => {
    const router = useRouter();
    const { colors, theme } = useTheme();
    const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedWeek, setSelectedWeek] = useState(getWeekNumber(new Date()).toString());
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [showWeekDropdown, setShowWeekDropdown] = useState(false);
    const [summary, setSummary] = useState<SummaryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    function getWeekNumber(date: Date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    const months: MonthOption[] = [
        { label: 'January', value: '1' },
        { label: 'February', value: '2' },
        { label: 'March', value: '3' },
        { label: 'April', value: '4' },
        { label: 'May', value: '5' },
        { label: 'June', value: '6' },
        { label: 'July', value: '7' },
        { label: 'August', value: '8' },
        { label: 'September', value: '9' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' },
    ];
    const years = ['2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
    const weeks = Array.from({ length: 52 }, (_, i) => (i + 1).toString());

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        try {
            const params = [];
            if (selectedMonth) params.push(`month=${selectedMonth}`);
            if (selectedYear) params.push(`year=${selectedYear}`);
            if (selectedWeek) params.push(`week=${selectedWeek}`);
            const query = params.length ? `?${params.join('&')}` : '';
            // const res = await fetch(`http://localhost:3000/api/vendor/admin/summary${query}`);
            const res=await fetch(`${URLs.API_ADMIN_BASE_URL}${SUMMARY.GET_ALL}${query}`);
            const data = await res.json();
            setSummary(data.summary || []);
        } catch (e) {
            setSummary([]);
        }
        setLoading(false);
    }, [selectedMonth, selectedYear, selectedWeek]);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchSummary();
        setRefreshing(false);
    }, [fetchSummary]);

    const navigateToUserDetails = (userId: string) => {
        router.push({ pathname: '../summary/[id]', params: { id: userId, week: selectedWeek, year: selectedYear } });
    };

    const getTime = (time: string | null) => {
        if (!time) return '0h';
        const [h, m, s] = time.split(':').map(Number);
        let str = '';
        if (h) str += `${h}h`;
        if (m) str += ` ${m}m`;
        if (s && !h && !m) str += `${s}s`;
        return str.trim() || '0h';
    };

    return {
        colors,
        setShowMonthDropdown,
        setShowYearDropdown,
        setShowWeekDropdown,
        months,
        selectedMonth,
        setSelectedMonth,
        showMonthDropdown,
        years,
        selectedYear,
        setSelectedYear,
        showYearDropdown,
        weeks,
        selectedWeek,
        setSelectedWeek,
        showWeekDropdown,
        summary,
        refreshing,
        loading,
        onRefresh,
        navigateToUserDetails,
        getTime,
    }

}
export default useSummary;