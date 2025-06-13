import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, RefreshControl, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Clock, User, ChevronDown } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { colors as newColor } from '@/constants/theme';
import useSummary from '../tabs/summary/summary.hook';
import styles from '../tabs/summary/styles';
import renderDropdown from '../tabs/summary/render-dropdown';

const DAVID_AVATAR = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e';

type SummaryItem = {
    vendor_id: string;
    vendor_name: string;
    total_work_time: string | null;
    total_overtime: string | null;
    total_standby_time: string | null;
};


export default function SummaryScreen() {


    const {
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
    } = useSummary();



    return (
        <SafeAreaView style={[styles.container, { backgroundColor: newColor.background.primary }]}>
            <View style={[styles.header, { backgroundColor: newColor.background.primary }]}>
                <Text style={[styles.title, { color: colors.text }]}>Working Hours Summary</Text>
                <Text style={[styles.subtitle, { color: colors.secondaryText }]}>View and manage employee working hours</Text>
            </View>
            <View style={[styles.selectorContainer, { backgroundColor: newColor.background.primary }]}>
                <TouchableOpacity
                    style={[styles.selectorButton, { borderColor: colors.border }]}
                    onPress={() => setShowMonthDropdown(true)}>
                    <Text style={[styles.selectorText, { color: colors.text }]}>{months.find(m => m.value === selectedMonth)?.label}</Text>
                    <ChevronDown size={16} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.selectorButton, { borderColor: colors.border }]}
                    onPress={() => setShowYearDropdown(true)}>
                    <Text style={[styles.selectorText, { color: colors.text }]}>{selectedYear}</Text>
                    <ChevronDown size={16} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.selectorButton, { borderColor: colors.border }]}
                    onPress={() => setShowWeekDropdown(true)}>
                    <Text style={[styles.selectorText, { color: colors.text }]}>Week {selectedWeek}</Text>
                    <ChevronDown size={16} color={colors.text} />
                </TouchableOpacity>
            </View>
            {renderDropdown(months, selectedMonth, setSelectedMonth, showMonthDropdown, () => setShowMonthDropdown(false), true, colors)}
            {renderDropdown(years, selectedYear, setSelectedYear, showYearDropdown, () => setShowYearDropdown(false), false, colors)}
            {renderDropdown(weeks, selectedWeek, setSelectedWeek, showWeekDropdown, () => setShowWeekDropdown(false), false, colors)}
            <FlatList
                data={summary}
                keyExtractor={(item) => item.vendor_id}
                style={styles.userList}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                ListEmptyComponent={!loading ? (
                    <Text style={{ color: colors.secondaryText, textAlign: 'center', marginTop: 32 }}>No data found.</Text>
                ) : null}
                renderItem={({ item }: { item: SummaryItem }) => (
                    <TouchableOpacity
                        style={[styles.userCard, { backgroundColor: newColor.background.new }]}
                        onPress={() => navigateToUserDetails(item.vendor_id)}>
                        <View style={styles.userInfo}>
                            <Image source={{ uri: DAVID_AVATAR }} style={styles.avatar} />
                            <View style={styles.userDetails}>
                                <Text style={[styles.userName, { color: colors.text }]}>{item.vendor_name}</Text>
                                <View style={styles.hoursContainer}>
                                    <View style={styles.hourItem}>
                                        <Clock size={16} color={colors.primary} />
                                        <Text style={[styles.hourText, { color: colors.text }]}>{getTime(item.total_work_time)} total</Text>
                                    </View>
                                    <View style={styles.hourItem}>
                                        <Clock size={16} color={colors.danger} />
                                        <Text style={[styles.hourText, { color: colors.text }]}>{getTime(item.total_overtime)} overtime</Text>
                                    </View>
                                    <View style={styles.hourItem}>
                                        <Clock size={16} color={colors.secondaryText} />
                                        <Text style={[styles.hourText, { color: colors.text }]}>{getTime(item.total_standby_time)} standby</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}
