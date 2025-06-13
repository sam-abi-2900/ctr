import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Clock } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { colors as newColor } from '@/constants/theme';
import { useEffect, useState, useCallback } from 'react';

// API response types
interface DailySummary {
    date: string;
    normal_work_time: string | null;
    overtime: string | null;
    standby_time: string | null;
}

interface VendorSummary {
    vendor_id: string;
    vendor_name: string;
    week: number;
    year: number;
    daily_summary: DailySummary[];
}

function getTime(time: string | null) {
    if (!time) return '0h';
    const [h, m, s] = time.split(':').map(Number);
    let str = '';
    if (h) str += `${h}h`;
    if (m) str += ` ${m}m`;
    if (s && !h && !m) str += `${s}s`;
    return str.trim() || '0h';
}

export default function UserHoursScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { colors } = useTheme();

    // Get id, week, year from params
    const id = params.id as string;
    const week = params.week as string | undefined;
    const year = params.year as string | undefined;

    const [data, setData] = useState<VendorSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const query = `?${week ? `week=${week}&` : ''}${year ? `year=${year}` : ''}`;
            const res = await fetch(`http://localhost:3000/api/admin/vendor-summary/${id}${query}`);
            const json = await res.json();
            setData(json);
        } catch (e) {
            setData(null);
        }
        setLoading(false);
    }, [id, week, year]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, [fetchData]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: newColor.background.primary }]}>
            <View style={[styles.header, { backgroundColor: newColor.background.primary }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={[styles.title, { color: colors.text }]}>{data?.vendor_name || 'User'}</Text>
                    <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Working Hours Breakdown</Text>
                </View>
            </View>
            <ScrollView
                style={[styles.content, { borderTopColor: '#fff', borderTopWidth: 1 }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
            >
                {data?.daily_summary && data.daily_summary.length > 0 ? (
                    data.daily_summary.map((day) => (
                        <View
                            key={day.date}
                            style={[styles.dayCard, { backgroundColor: newColor.background.new }]}
                        >
                            <Text style={[styles.dateText, { color: colors.text }]}>
                                {formatDate(day.date)}
                            </Text>
                            <View style={styles.hoursContainer}>
                                <View style={styles.hourItem}>
                                    <Clock size={16} color={colors.primary} />
                                    <Text style={[styles.hourText, { color: colors.text }]}>
                                        {getTime(day.normal_work_time)} normal
                                    </Text>
                                </View>
                                <View style={styles.hourItem}>
                                    <Clock size={16} color={colors.danger} />
                                    <Text style={[styles.hourText, { color: colors.text }]}>
                                        {getTime(day.overtime)} overtime
                                    </Text>
                                </View>
                                <View style={styles.hourItem}>
                                    <Clock size={16} color={colors.secondaryText} />
                                    <Text style={[styles.hourText, { color: colors.text }]}>
                                        {getTime(day.standby_time)} standby
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))
                ) : !loading ? (
                    <Text style={{ color: colors.secondaryText, textAlign: 'center', marginTop: 32 }}>
                        No data found.
                    </Text>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    dayCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderColor: '#3F3C39',
        borderWidth: 1,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    dateText: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 12,
    },
    hoursContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    hourItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    hourText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
}); 