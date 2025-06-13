import { StyleSheet } from "react-native";
import { colors as newColor } from "@/constants/theme";


export const staticStyles = StyleSheet.create({
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    notificationButton: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    tab: {
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    eventList: {
        padding: 16,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    eventActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priorityText: {
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    eventLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    eventFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    attendees: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarStack: {
        flexDirection: 'row',
        marginLeft: 12,
    },
    attendeeAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#fff',
    },
    fabIcon: {
        fontSize: 24,
        color: '#000',
        fontFamily: 'Inter_500Medium',
    },
});

export const themedStyles = ({ colors, theme }: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            // backgroundColor: colors.background,
            backgroundColor: newColor.background.primary,

        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            // backgroundColor: '#1B1916',
            backgroundColor: newColor.background.primary,
        },
        title: {
            fontSize: 20,
            fontFamily: 'Inter_600SemiBold',
            color: colors.text,
        },
        notificationBadge: {
            position: 'absolute',
            top: -4,
            right: -4,
            backgroundColor: colors.danger,
            borderRadius: 10,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        notificationCount: {
            color: '#fff',
            fontSize: 12,
            fontFamily: 'Inter_500Medium',
        },
        searchContainer: {
            padding: 16,
            // backgroundColor: '#1B1916',
            backgroundColor: newColor.background.primary,
        },
        searchInput: {
            backgroundColor: '#1B1916',
            borderRadius: 12,
            padding: 12,
            fontFamily: 'Inter_400Regular',
            fontSize: 16,
            color: colors.text,
        },
        tabBar: {
            flexDirection: 'row',
            // backgroundColor: '#1B1916',
            backgroundColor: newColor.background.primary,
            paddingHorizontal: 16,
            paddingBottom: 16,
            justifyContent: 'center',
            gap: 32,
        },
        tabText: {
            fontSize: 16,
            fontFamily: 'Inter_500Medium',
            color: colors.secondaryText,
        },
        activeTabText: {
            color: '#F3A326',
        },
        activeTab: {
            borderBottomWidth: 2,
            borderBottomColor: colors.primary,
            paddingBottom: 8,
        },
        eventCard: {
            // backgroundColor: colors.card,
            backgroundColor: newColor.background.new,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            // shadowColor: theme === 'dark' ? '#000' : '#000',
            // shadowColor: '#fff',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: theme === 'dark' ? 0.4 : 0.05,
            // shadowRadius: 8,
            // elevation: 2,
        },
        eventTitle: {
            fontSize: 18,
            fontFamily: 'Inter_600SemiBold',
            color: colors.text,
            marginBottom: 4,
        },
        eventDateTime: {
            fontSize: 14,
            fontFamily: 'Inter_400Regular',
            color: colors.secondaryText,
        },
        priorityTag: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            marginRight: 8,
        },
        highPriorityTag: {
            backgroundColor: colors.highPriorityBg,
        },
        mediumPriorityTag: {
            backgroundColor: colors.mediumPriorityBg,
        },
        lowPriorityTag: {
            backgroundColor: colors.lowPriorityBg,
        },
        highPriorityText: {
            color: colors.highPriorityText,
        },
        mediumPriorityText: {
            color: colors.mediumPriorityText,
        },
        lowPriorityText: {
            color: colors.lowPriorityText,
        },
        tag: {
            backgroundColor: theme === 'dark' ? '#4B5563' : '#F3E8FF',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
            marginRight: 8,
        },
        tagText: {
            color: theme === 'dark' ? '#E9D5FF' : '#9333EA',
            fontSize: 12,
            fontFamily: 'Inter_500Medium',
        },
        locationText: {
            marginLeft: 8,
            fontSize: 14,
            fontFamily: 'Inter_400Regular',
            color: colors.secondaryText,
        },
        attendeesText: {
            marginLeft: 8,
            fontSize: 14,
            fontFamily: 'Inter_400Regular',
            color: colors.secondaryText,
        },
        moreAttendees: {
            backgroundColor: theme === 'dark' ? '#374151' : '#E5E7EB',
            justifyContent: 'center',
            alignItems: 'center',
        },
        moreAttendeesText: {
            fontSize: 10,
            fontFamily: 'Inter_500Medium',
            color: colors.secondaryText,
        },
        assignButton: {
            borderColor: '#F3A326',
            borderWidth: 1,
            backgroundColor: '#201E1B',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
        },
        assignButtonText: {
            color: '#F3A326',
            fontSize: 14,
            fontFamily: 'Inter_500Medium',
        },
        fab: {
            position: 'absolute',
            right: 16,
            bottom: 16,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
        },
    });
