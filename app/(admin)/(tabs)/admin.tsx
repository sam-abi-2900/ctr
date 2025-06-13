import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import { Bell, MoveVertical as MoreVertical, MapPin, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import useAdminScreen from '../tabs/admin/admin-screen.hook';

export default function HomeScreen() {
    const {
        colors,
        requestsLength,
        activeTab,
        setActiveTab,
        events,
        isRefreshing,
        onRefresh,
        isLoading,
        formatDate,
        formatTime,
        handleDelete,
        staticStyles,
        themedStyles1: themedStyles
    } = useAdminScreen();

    return (
        <SafeAreaView style={themedStyles.container} >
            <View style={themedStyles.header}>
                <View style={staticStyles.headerLeft}>
                    {/* <TouchableOpacity>
                        <Menu size={24} color={colors.text} />
                    </TouchableOpacity> */}
                    <View style={{ marginLeft: 12 }}>
                        <Text style={themedStyles.title}>Janik</Text>
                        <Text style={themedStyles.eventDateTime}>Events Technical Manager</Text>
                    </View>
                </View>
                <View style={staticStyles.headerRight}>
                    <TouchableOpacity
                        style={staticStyles.notificationButton}
                        onPress={() => router.push('/(admin)/notification')}>
                        <Bell size={24} color={colors.text} />

                        {requestsLength > 0 && (
                            <View style={themedStyles.notificationBadge}>
                                <Text style={themedStyles.notificationCount}>
                                    {requestsLength > 5 ? <Text style={{ fontSize: 10 }}> 5+ </Text> : requestsLength}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces' }}
                        style={staticStyles.avatar}
                    />
                </View>
            </View>

            <View style={themedStyles.searchContainer}>
                <TextInput
                    style={[themedStyles.searchInput, { borderWidth: 1, borderColor: '#AFACA7' }]}
                    placeholder="Search events..."
                    placeholderTextColor={colors.secondaryText}
                />
            </View>

            <View style={themedStyles.tabBar}>
                <TouchableOpacity
                    style={[staticStyles.tab, activeTab === 'pending' && themedStyles.activeTab]}
                    onPress={() => setActiveTab('pending')}>
                    <Text style={[themedStyles.tabText, activeTab === 'pending' && themedStyles.activeTabText]}>
                        Pending({events.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[staticStyles.tab, activeTab === 'assigned' && themedStyles.activeTab]}
                    onPress={() => router.push('/(admin)/assignedEvents')}>
                    <Text style={[themedStyles.tabText, activeTab === 'assigned' && themedStyles.activeTabText]}>
                        Assigned
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={staticStyles.eventList}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                        progressBackgroundColor={colors.card}
                    />
                }>
                {isLoading ? (
                    <View style={[themedStyles.eventCard, { alignItems: 'center', padding: 20 }]}>
                        <Text style={[themedStyles.eventTitle, { color: colors.secondaryText }]}>Loading events...</Text>
                    </View>
                ) : events.length === 0 ? (
                    <View style={[themedStyles.eventCard, { alignItems: 'center', padding: 20 }]}>
                        <Text style={[themedStyles.eventTitle, { color: colors.secondaryText }]}>No pending events</Text>
                    </View>
                ) : (
                    events.map((event) => (
                        <View key={event.id} style={[themedStyles.eventCard, { borderWidth: 1, borderColor: '#AFACA7' }]}>
                            <View style={staticStyles.eventHeader}>
                                <View>
                                    <Text style={themedStyles.eventTitle}>{event.title}</Text>
                                    <Text style={themedStyles.eventDateTime}>
                                        {formatDate(event.event_datetime)} • {formatTime(event.event_datetime)}
                                    </Text>
                                </View>
                            </View>

                            <View style={staticStyles.eventLocation}>
                                <MapPin size={16} color={colors.secondaryText} />
                                <Text style={themedStyles.locationText}>{event.city}</Text>
                            </View>

                            <View style={staticStyles.eventFooter}>
                                <TouchableOpacity
                                    style={[themedStyles.assignButton, { backgroundColor: '#EF4444' }]}
                                    onPress={() => {
                                        Alert.alert(
                                            'Delete Event',
                                            'Are you sure you want to delete this event?',
                                            [
                                                {
                                                    text: 'Cancel',
                                                    style: 'cancel'
                                                },
                                                {
                                                    text: 'Delete',
                                                    style: 'destructive',
                                                    onPress: () => handleDelete(event.id)
                                                }
                                            ]
                                        );
                                    }}>
                                    <Text style={[themedStyles.assignButtonText, { color: '#fff' }]}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={themedStyles.assignButton}
                                    onPress={() => router.push({
                                        pathname: '/(admin)/assignEvent',
                                        params: { eventId: event.id }
                                    })}>
                                    <Text style={themedStyles.assignButtonText}>Assign</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <TouchableOpacity style={themedStyles.fab} onPress={() => router.push('/(admin)/add-event')}>
                <Text style={staticStyles.fabIcon}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}