import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Animated, ScrollView, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react-native';
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { StandbyTimer } from '@/components/StandbyTimer';

interface EventSummary {
    total_events: number;
    assigned: number;
    accepted: number;
    total_tasks: number;
    completed: number;
    pending: number;
    upcoming_events: Array<{
        title: string;
        event_datetime: string;
        city: string;
        type: string;
        image_url: string;
    }>;
}

export default function HomeScreen() {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);
    const [eventData, setEventData] = useState<EventSummary | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchEventData = useCallback(async () => {
        try {
            const year = selectedMonth.getFullYear();
            const month = selectedMonth.getMonth() + 1;
            const response = await fetch(
                `http://localhost:3000/api/vendor/event-summary/1f30b1a0-d4c3-4d36-8f3d-263e6b1b00cd?year=${year}&month=${month}`
            );
            const data = await response.json();
            setEventData(data);
        } catch (error) {
            console.error('Error fetching event data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [selectedMonth]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchEventData();
    }, [fetchEventData]);

    // Fetch data when component mounts or month changes
    useEffect(() => {
        setLoading(true);
        fetchEventData();
    }, [fetchEventData]);

    const nextMonth = () => {
        setSelectedMonth(current => addMonths(current, 1));
    };

    const previousMonth = () => {
        setSelectedMonth(current => subMonths(current, 1));
    };

    const stats = eventData ? {
        totalEvents: eventData.total_events,
        assignedTasks: eventData.total_tasks,
        completed: eventData.completed,
        pending: eventData.pending,
    } : {
        totalEvents: 0,
        assignedTasks: 0,
        completed: 0,
        pending: 0,
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, Geralt!</Text>
                        <Text style={styles.subheading}>Event Support</Text>
                    </View>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces' }}
                            style={styles.avatar}
                        />
                    </View>
                </View>

                <View style={styles.overviewCard}>
                    <View style={styles.overviewHeader}>
                        <Text style={styles.overviewTitle}>Your Event Overview</Text>
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

                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{stats.totalEvents}</Text>
                            <Text style={styles.statLabel}>Events</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{stats.assignedTasks}</Text>
                            <Text style={styles.statLabel}>Tasks</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{stats.completed}</Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{stats.pending}</Text>
                            <Text style={styles.statLabel}>Pending</Text>
                        </View>
                    </View>

                    <Link href="/events" asChild>
                        <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.8}>
                            <Calendar size={20} color="#000" />
                            <Text style={styles.viewAllText}>View All Events</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Upcoming Events</Text>
                    <Link href="/events" asChild>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.upcomingEventsContainer}
                >
                    {eventData?.upcoming_events.map((event, index) => {
                        const eventDate = parseISO(event.event_datetime);
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.upcomingEventCard}
                                activeOpacity={0.7}
                            >
                                <Image source={{ uri: event.image_url }} style={styles.upcomingEventImage} />
                                <View style={styles.upcomingEventContent}>
                                    <Text style={styles.upcomingEventCategory}>{event.type}</Text>
                                    <Text style={styles.upcomingEventTitle}>{event.title}</Text>
                                    <View style={styles.upcomingEventDetails}>
                                        <View style={styles.upcomingEventDetailRow}>
                                            <Clock size={14} color={colors.text.tertiary} />
                                            <Text style={styles.upcomingEventDetailText}>
                                                {format(eventDate, 'yyyy-MM-dd')} • {format(eventDate, 'HH:mm')}
                                            </Text>
                                        </View>
                                        <View style={styles.upcomingEventDetailRow}>
                                            <MapPin size={14} color={colors.text.tertiary} />
                                            <Text style={styles.upcomingEventDetailText}>{event.city}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </ScrollView>
            <StandbyTimer />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
        padding: spacing.xs,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.xl,
        paddingLeft: spacing.md,
        paddingRight: spacing.md,
    },
    greeting: {
        ...typography.title1,
        color: colors.text.primary,
    },
    subheading: {
        ...typography.subhead,
        color: colors.text.tertiary,
        marginTop: spacing.xs,
    },
    avatarContainer: {
        ...shadows.medium,
        borderRadius: borderRadius.full,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.full,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    overviewCard: {
        backgroundColor: colors.background.new,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.medium,
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    statCard: {
        width: '48%',
        backgroundColor: colors.background.newLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.small,
    },
    statNumber: {
        ...typography.title2,
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    statLabel: {
        ...typography.caption1,
        color: colors.text.tertiary,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginTop: spacing.xs,
        ...shadows.small,
    },
    viewAllText: {
        ...typography.headline,
        marginLeft: spacing.sm,
        color: '#000',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.title3,
        color: colors.text.primary,
    },
    seeAllText: {
        ...typography.callout,
        color: colors.secondary,
        fontWeight: '600',
    },
    upcomingEventsContainer: {
        marginBottom: spacing.xl,
    },
    upcomingEventCard: {
        width: 300,
        backgroundColor: colors.background.new,
        borderRadius: borderRadius.lg,
        marginRight: spacing.md,
        overflow: 'hidden',
        ...shadows.medium,
    },
    upcomingEventImage: {
        width: '100%',
        height: 160,
    },
    upcomingEventContent: {
        padding: spacing.md,
    },
    upcomingEventCategory: {
        ...typography.caption1,
        color: colors.secondary,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    upcomingEventTitle: {
        ...typography.title3,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    upcomingEventDetails: {
        gap: spacing.xs,
    },
    upcomingEventDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    upcomingEventDetailText: {
        ...typography.footnote,
        color: colors.text.tertiary,
        marginLeft: spacing.xs,
    },
});