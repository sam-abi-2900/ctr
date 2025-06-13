import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, Search, MapPin, ChevronLeft } from 'lucide-react-native';
import { colors as newColor } from '@/constants/theme';
import YearModal from './year-modal';
import MonthModal from './month-modal';
import DayModal from './day-modal';
import useAssignedEvents from './assigned-events.hook';
import styles from './styles';


export default function AssignedScreen() {

    const {
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

    } = useAssignedEvents();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: newColor.background.primary }]}>
            <View style={[styles.header, { backgroundColor: newColor.background.primary }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Assigned Events</Text>
            </View>

            <View style={styles.filterContainer}>
                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[styles.filterButton, { backgroundColor: colors.card }]}
                        onPress={() => setShowYearPicker(true)}>
                        <Text style={[styles.filterButtonText, { color: colors.text }]}>
                            Year: {selectedYear}
                        </Text>
                        <ChevronDown size={16} color={colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, { backgroundColor: colors.card }]}
                        onPress={() => setShowMonthPicker(true)}>
                        <Text style={[styles.filterButtonText, { color: colors.text }]}>
                            Month: {selectedMonth}
                        </Text>
                        <ChevronDown size={16} color={colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, { backgroundColor: colors.card }]}
                        onPress={() => setShowDayPicker(true)}>
                        <Text style={[styles.filterButtonText, { color: colors.text }]}>
                            Day: {selectedDay || 'All'}
                        </Text>
                        <ChevronDown size={16} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
                    <Search size={20} color={colors.secondaryText} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search events..."
                        placeholderTextColor={colors.secondaryText}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <ScrollView
                style={styles.eventList}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                        progressBackgroundColor={colors.card}
                    />
                }>
                {filteredEvents.map((event) => (
                    <View key={event.event_id} style={[styles.eventCard, { backgroundColor: newColor.background.new }]}>
                        <View style={styles.eventHeader}>
                            <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
                            <View style={[styles.statusTag, { backgroundColor: getStatusColor(event.assigned_vendors[0].status) }]}>
                                <Text style={styles.statusText}>{event.assigned_vendors[0].status}</Text>
                            </View>
                        </View>

                        <View style={styles.eventLocation}>
                            <MapPin size={16} color={colors.secondaryText} />
                            <Text style={[styles.locationText, { color: colors.secondaryText }]}>{event.city}</Text>
                        </View>

                        <View style={styles.vendorList}>
                            <Text style={[styles.vendorTitle, { color: colors.text }]}>
                                Assigned Vendors ({event.assigned_vendors.length})
                            </Text>
                            {event.assigned_vendors.map((vendor) => (
                                <TouchableOpacity
                                    key={vendor.id}
                                    style={styles.vendorItem}
                                    onPress={() => handleVendorPress(event.event_id, vendor.id)}>
                                    <Text style={[styles.vendorName, { color: colors.text }]}>{vendor.name}</Text>
                                    <View style={[styles.vendorStatus, { backgroundColor: getStatusColor(vendor.status) }]}>
                                        <Text style={styles.vendorStatusText}>{vendor.status}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>

            <YearModal
                showYearPicker={showYearPicker}
                setShowYearPicker={setShowYearPicker}
                years={years}
                setSelectedYear={setSelectedYear}
                selectedYear={selectedYear}
            />

            <MonthModal
                showMonthPicker={showMonthPicker}
                setShowMonthPicker={setShowMonthPicker}
                months={months}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
            />

            <DayModal
                showDayPicker={showDayPicker}
                setShowDayPicker={setShowDayPicker}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                days={days}
            />
        </SafeAreaView>
    );
}
