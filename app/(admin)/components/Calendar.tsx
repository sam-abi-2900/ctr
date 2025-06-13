import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isWithinInterval, isSameDay } from 'date-fns';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type CalendarProps = {
    selectedDate: Date;
    timeOffDates?: string[];
    eventDate: Date;
    onDatePress?: (date: Date) => void;
};

const Calendar: React.FC<CalendarProps> = ({
    selectedDate,
    timeOffDates = [],
    eventDate,
    onDatePress,
}) => {
    const startDate = startOfMonth(selectedDate);
    const endDate = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const timeOffDateObjects = timeOffDates.map(date => new Date(date));

    const isTimeOff = (date: Date) => {
        return timeOffDateObjects.some(timeOff => isSameDay(timeOff, date));
    };

    const isEvent = (date: Date) => {
        return isSameDay(eventDate, date);
    };

    const isConflict = (date: Date) => {
        return isTimeOff(date) && isEvent(date);
    };

    const getDayStyle = (date: Date) => {
        if (isConflict(date)) {
            return styles.conflictDay;
        } else if (isTimeOff(date)) {
            return styles.timeOffDay;
        } else if (isEvent(date)) {
            return styles.eventDay;
        }
        return {};
    };

    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.monthTitle}>{format(selectedDate, 'MMMM yyyy')}</Text>
            </View>
            <View style={styles.weekDays}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <Text key={day} style={styles.weekDay}>
                        {day}
                    </Text>
                ))}
            </View>
            <View style={styles.daysGrid}>
                {days.map((date) => (
                    <TouchableOpacity
                        key={date.toString()}
                        style={[styles.day, getDayStyle(date)]}
                        onPress={() => onDatePress?.(date)}
                    >
                        <Text style={[
                            styles.dayText,
                            (isTimeOff(date) || isEvent(date)) && styles.highlightedDayText
                        ]}>
                            {format(date, 'd')}
                        </Text>
                        {isConflict(date) && (
                            <View style={styles.conflictIndicator} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthTitle: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        color: '#1F2937',
    },
    weekDays: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    weekDay: {
        width: 40,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: '#6B7280',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    day: {
        width: '14.28%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    dayText: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        color: '#1F2937',
    },
    highlightedDayText: {
        color: '#FFFFFF',
    },
    timeOffDay: {
        backgroundColor: '#EF4444',
        borderRadius: 20,
    },
    eventDay: {
        backgroundColor: '#4169E1',
        borderRadius: 20,
    },
    conflictDay: {
        backgroundColor: '#9333EA',
        borderRadius: 20,
    },
    conflictIndicator: {
        position: 'absolute',
        bottom: 4,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
    },
});

export default Calendar;