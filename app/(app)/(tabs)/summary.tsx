import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, RefreshControl, Modal, Alert } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Calendar, ChevronLeft, ChevronRight, Clock, ChevronDown } from 'lucide-react-native';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, parseISO } from 'date-fns';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { StandbyTimer } from '@/components/StandbyTimer';

interface TimeData {
    workTime: number;
    overTime: number;
    standByTime: number;
}

interface SummaryResponse {
    day: {
        from: string;
        to: string;
        work_time_seconds: string;
        standby_time_seconds: number;
        overtime_count: number;
    };
    month: {
        from: string;
        to: string;
        work_time_seconds: string;
        standby_time_seconds: number;
        overtime_count: number;
    };
    year: {
        from: string;
        to: string;
        work_time_seconds: string;
        standby_time_seconds: number;
        overtime_count: number;
    };
    weekly: Array<{
        week: number;
        from: string;
        to: string;
        work_time_seconds: string;
        standby_time_seconds: number;
        overtime_count: number;
    }>;
}

const screenWidth = Dimensions.get('window').width;

export default function SummaryScreen() {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [availableDates, setAvailableDates] = useState<Date[]>([]);

    const fetchSummaryData = useCallback(async () => {
        try {
            const year = selectedMonth.getFullYear();
            const month = selectedMonth.getMonth() + 1;
            const day = format(selectedDate, 'yyyy-MM-dd');
            
            const response = await fetch(
                `http://localhost:3000/vendor/summary?vendor_id=1f30b1a0-d4c3-4d36-8f3d-263e6b1b00cd&day=${day}&month=${year}-${month.toString().padStart(2, '0')}&year=${year}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setSummaryData(data);

            // Generate available dates for the month
            const monthStart = startOfMonth(selectedMonth);
            const monthEnd = endOfMonth(selectedMonth);
            const dates = eachDayOfInterval({ start: monthStart, end: monthEnd });
            setAvailableDates(dates);
        } catch (error) {
            console.error('Error fetching summary data:', error);
            Alert.alert('Error', 'Failed to fetch summary data');
        } finally {
            setIsRefreshing(false);
        }
    }, [selectedMonth, selectedDate]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchSummaryData();
    }, [fetchSummaryData]);

    useEffect(() => {
        fetchSummaryData();
    }, [fetchSummaryData]);

    const nextMonth = () => {
        setSelectedMonth(current => addMonths(current, 1));
    };

    const previousMonth = () => {
        setSelectedMonth(current => subMonths(current, 1));
    };

    const convertSecondsToHours = (seconds: string | number) => {
        const numSeconds = typeof seconds === 'string' ? parseInt(seconds) : seconds;
        return (numSeconds / 3600).toFixed(1);
    };

    const getChartData = () => {
        if (!summaryData) return null;

        if (viewMode === 'daily') {
            return {
                labels: ['Work Time', 'Over Time', 'Stand By'],
                datasets: [{
                    data: [
                        parseFloat(convertSecondsToHours(summaryData.day.work_time_seconds)),
                        summaryData.day.overtime_count,
                        parseFloat(convertSecondsToHours(summaryData.day.standby_time_seconds))
                    ],
                    colors: [
                        (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,
                        (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                        (opacity = 1) => `rgba(255, 215, 0, ${opacity})`
                    ]
                }]
            };
        } else {
            const weekData = summaryData.weekly.find(w => w.week === selectedWeek);
            if (!weekData) return null;

            return {
                labels: ['Work Time', 'Over Time', 'Stand By'],
                datasets: [{
                    data: [
                        parseFloat(convertSecondsToHours(weekData.work_time_seconds)),
                        weekData.overtime_count,
                        parseFloat(convertSecondsToHours(weekData.standby_time_seconds))
                    ],
                    colors: [
                        (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,
                        (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                        (opacity = 1) => `rgba(255, 215, 0, ${opacity})`
                    ]
                }]
            };
        }
    };

    const getPieChartData = () => {
        if (!summaryData) return [];

        if (viewMode === 'daily') {
            return [
                {
                    name: 'Work Time',
                    time: parseFloat(convertSecondsToHours(summaryData.day.work_time_seconds)),
                    color: colors.primary,
                    legendFontColor: colors.text.primary,
                },
                {
                    name: 'Over Time',
                    time: summaryData.day.overtime_count,
                    color: '#FF6B6B',
                    legendFontColor: colors.text.primary,
                },
                {
                    name: 'Stand By',
                    time: parseFloat(convertSecondsToHours(summaryData.day.standby_time_seconds)),
                    color: '#4ECDC4',
                    legendFontColor: colors.text.primary,
                },
            ];
        } else {
            const weekData = summaryData.weekly.find(w => w.week === selectedWeek);
            if (!weekData) return [];

            return [
                {
                    name: 'Work Time',
                    time: parseFloat(convertSecondsToHours(weekData.work_time_seconds)),
                    color: colors.primary,
                    legendFontColor: colors.text.primary,
                },
                {
                    name: 'Over Time',
                    time: weekData.overtime_count,
                    color: '#FF6B6B',
                    legendFontColor: colors.text.primary,
                },
                {
                    name: 'Stand By',
                    time: parseFloat(convertSecondsToHours(weekData.standby_time_seconds)),
                    color: '#4ECDC4',
                    legendFontColor: colors.text.primary,
                },
            ];
        }
    };

    const chartData = getChartData();
    const pieChartData = getPieChartData();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                        progressBackgroundColor={colors.background.new}
                    />
                }
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Time Summary</Text>
                        <Text style={styles.subtitle}>Track your work hours</Text>
                    </View>
                </View>

                <View style={styles.overviewCard}>
                    <View style={styles.overviewHeader}>
                        <Text style={styles.overviewTitle}>Monthly Overview</Text>
                        <View style={styles.monthSelector}>
                            <TouchableOpacity
                                onPress={previousMonth}
                                style={styles.monthButton}
                                hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                            >
                                <ChevronLeft size={16} color={colors.primary} />
                            </TouchableOpacity>
                            <Text style={styles.monthText} numberOfLines={1} ellipsizeMode="middle">
                                {format(selectedMonth, 'MMM yyyy')}
                            </Text>
                            <TouchableOpacity
                                onPress={nextMonth}
                                style={styles.monthButton}
                                hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                            >
                                <ChevronRight size={16} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.viewModeSelector}>
                        <TouchableOpacity
                            style={[styles.viewModeButton, viewMode === 'daily' && styles.viewModeButtonActive]}
                            onPress={() => setViewMode('daily')}
                        >
                            <Text style={[styles.viewModeText, viewMode === 'daily' && styles.viewModeTextActive]}>Daily</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.viewModeButton, viewMode === 'weekly' && styles.viewModeButtonActive]}
                            onPress={() => setViewMode('weekly')}
                        >
                            <Text style={[styles.viewModeText, viewMode === 'weekly' && styles.viewModeTextActive]}>Weekly</Text>
                        </TouchableOpacity>
                    </View>

                    {viewMode === 'daily' ? (
                        <View style={styles.dateSelector}>
                            <Text style={styles.dateSelectorLabel}>Select Date:</Text>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateButtonText}>
                                    {format(selectedDate, 'MMM dd, yyyy')}
                                </Text>
                                <ChevronDown size={16} color="#000" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.weekSelector}>
                            <Text style={styles.weekSelectorLabel}>Select Week:</Text>
                            <View style={styles.weekButtons}>
                                {[1, 2, 3, 4].map((week) => (
                                    <TouchableOpacity
                                        key={week}
                                        style={[
                                            styles.weekButton,
                                            selectedWeek === week && styles.weekButtonActive
                                        ]}
                                        onPress={() => setSelectedWeek(week)}
                                    >
                                        <Text style={[
                                            styles.weekButtonText,
                                            selectedWeek === week && styles.weekButtonTextActive
                                        ]}>
                                            Week {week}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {chartData && (
                        <View style={styles.chartContainer}>
                            <BarChart
                                data={chartData}
                                width={screenWidth - 48}
                                height={220}
                                yAxisLabel=""
                                yAxisSuffix="h"
                                yAxisInterval={4}
                                fromZero
                                withInnerLines={true}
                                withHorizontalLabels={true}
                                withVerticalLabels={true}
                                chartConfig={{
                                    backgroundColor: colors.background.new,
                                    backgroundGradientFrom: colors.background.new,
                                    backgroundGradientTo: colors.background.new,
                                    decimalPlaces: 1,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, 0.9)`,
                                    style: {
                                        borderRadius: 16,
                                    },
                                    barPercentage: 0.6,
                                }}
                                style={styles.chart}
                            />
                        </View>
                    )}

                    {summaryData && (
                        <View style={styles.statsGrid}>
                            <View style={styles.statCard}>
                                <Clock size={24} color={colors.primary} />
                                <Text style={styles.statNumber}>
                                    {convertSecondsToHours(viewMode === 'daily' 
                                        ? summaryData.day.work_time_seconds 
                                        : summaryData.weekly.find(w => w.week === selectedWeek)?.work_time_seconds || '0')}h
                                </Text>
                                <Text style={styles.statLabel}>Work Time</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Clock size={24} color="#FF6B6B" />
                                <Text style={styles.statNumber}>
                                    {viewMode === 'daily'
                                        ? summaryData.day.overtime_count
                                        : summaryData.weekly.find(w => w.week === selectedWeek)?.overtime_count || 0}h
                                </Text>
                                <Text style={styles.statLabel}>Over Time</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Clock size={24} color="#4ECDC4" />
                                <Text style={styles.statNumber}>
                                    {convertSecondsToHours(viewMode === 'daily'
                                        ? summaryData.day.standby_time_seconds
                                        : summaryData.weekly.find(w => w.week === selectedWeek)?.standby_time_seconds || 0)}h
                                </Text>
                                <Text style={styles.statLabel}>Stand By</Text>
                            </View>
                        </View>
                    )}
                </View>

                {pieChartData.length > 0 && (
                    <View style={styles.pieChartCard}>
                        <Text style={styles.pieChartTitle}>Time Distribution</Text>
                        <PieChart
                            data={pieChartData}
                            width={screenWidth - 48}
                            height={220}
                            chartConfig={{
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            }}
                            accessor="time"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                            hasLegend={true}
                            center={[screenWidth / 4, 0]}
                        />
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={showDatePicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowDatePicker(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background.new }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Select Date</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                <Text style={[styles.modalClose, { color: colors.text.primary }]}>Close</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.datePickerList}>
                            {availableDates.map((date) => (
                                <TouchableOpacity
                                    key={date.toISOString()}
                                    style={[
                                        styles.datePickerItem,
                                        isSameMonth(date, selectedMonth) && styles.datePickerItemActive,
                                        format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') && styles.datePickerItemSelected
                                    ]}
                                    onPress={() => {
                                        setSelectedDate(date);
                                        setShowDatePicker(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.datePickerItemText,
                                        { color: colors.text.primary }
                                    ]}>
                                        {format(date, 'MMM dd, yyyy')}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <StandbyTimer />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
        padding: spacing.md,
    },
    header: {
        marginTop: spacing.md,
        marginBottom: spacing.xl,
        paddingLeft: spacing.md,
        paddingRight: spacing.md,
    },
    title: {
        ...typography.title1,
        color: colors.text.primary,
    },
    subtitle: {
        ...typography.subhead,
        color: colors.text.tertiary,
        marginTop: spacing.xs,
    },
    overviewCard: {
        backgroundColor: colors.background.new,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.medium,
    },
    pieChartCard: {
        backgroundColor: colors.background.new,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginTop: spacing.lg,
        ...shadows.medium,
    },
    pieChartTitle: {
        ...typography.title3,
        color: colors.text.primary,
        marginBottom: spacing.lg,
    },
    overviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    overviewTitle: {
        ...typography.title3,
        color: colors.text.primary,
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.newLight,
        borderRadius: borderRadius.full,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        maxWidth: 150,
    },
    monthButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.full,
    },
    monthText: {
        ...typography.footnote,
        color: colors.text.primary,
        flex: 1,
        textAlign: 'center',
    },
    viewModeSelector: {
        flexDirection: 'row',
        backgroundColor: colors.background.newLight,
        borderRadius: borderRadius.full,
        padding: spacing.xs,
        marginBottom: spacing.lg,
    },
    viewModeButton: {
        flex: 1,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.full,
        alignItems: 'center',
    },
    viewModeButtonActive: {
        backgroundColor: colors.primary,
    },
    viewModeText: {
        ...typography.footnote,
        color: colors.text.primary,
    },
    viewModeTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    chart: {
        marginVertical: spacing.md,
        borderRadius: borderRadius.lg,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.md,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.background.newLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginHorizontal: spacing.xs,
        alignItems: 'center',
        ...shadows.small,
    },
    statNumber: {
        ...typography.title2,
        color: colors.text.primary,
        marginVertical: spacing.xs,
    },
    statLabel: {
        ...typography.caption1,
        color: colors.text.tertiary,
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
        backgroundColor: colors.background.newLight,
        borderRadius: borderRadius.full,
        padding: spacing.sm,
    },
    dateSelectorLabel: {
        ...typography.footnote,
        color: colors.text.primary,
        marginRight: spacing.sm,
    },
    dateButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
    },
    dateButtonText: {
        ...typography.footnote,
        color: '#000',
        fontWeight: '600',
        textAlign: 'center',
    },
    weekSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    weekSelectorLabel: {
        ...typography.footnote,
        color: colors.text.primary,
        marginRight: spacing.sm,
    },
    weekButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    weekButton: {
        flex: 1,
        backgroundColor: colors.background.tertiary,
        borderRadius: borderRadius.full,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        marginHorizontal: spacing.xs,
        alignItems: 'center',
    },
    weekButtonActive: {
        backgroundColor: colors.primary,
    },
    weekButtonText: {
        ...typography.footnote,
        color: colors.text.primary,
    },
    weekButtonTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        ...typography.title3,
    },
    modalClose: {
        ...typography.body,
        color: colors.primary,
    },
    datePickerList: {
        maxHeight: 400,
    },
    datePickerItem: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    datePickerItemActive: {
        backgroundColor: colors.background.newLight,
    },
    datePickerItemSelected: {
        backgroundColor: colors.primary,
    },
    datePickerItemText: {
        ...typography.body,
    },
}); 