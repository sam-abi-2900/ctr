
import { StyleSheet } from 'react-native';



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    backButton: {
        marginBottom: 16,
    },
    headerContent: {
        gap: 4,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter_600SemiBold',
        color: '#1F2937',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        color: '#6B7280',
    },
    taskCount: {
        marginTop: 8,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    taskText: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: '#4B5563',
    },
    userList: {
        flex: 1,
        padding: 16,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -5,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: 'red',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    selectedUserRow: {
        borderWidth: 2,
        borderColor: '#4169E1',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#4169E1',
        borderColor: '#4169E1',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#1F2937',
        marginBottom: 4,
    },
    assignedCount: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    assignedText: {
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        color: '#6B7280',
    },
    timeOffWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    warningText: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: '#EF4444',
    },
    footer: {
        padding: 16,
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#4B5563',
    },
    assignButton: {
        backgroundColor: '#4169E1',
    },
    assignButtonText: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#fff',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Inter_600SemiBold',
        color: '#1F2937',
    },
    closeButton: {
        padding: 4,
    },
    calendarContainer: {
        gap: 16,
    },
    legend: {
        flexDirection: 'row',
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: '#6B7280',
    },
    calendarViewContainer: {
        marginTop: 16,
    },
    calendarMonthTitle: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    weekdayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    weekdayText: {
        width: 32,
        textAlign: 'center',
        fontFamily: 'Inter_500Medium',
        color: '#6B7280',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    calendarDay: {
        width: '14.28%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
    },
    calendarDayText: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#1F2937',
        width: 36,
        height: 36,
        borderRadius: 18,
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: 36,
        overflow: 'hidden',
    },
    calendarDayTextHighlight: {
        color: '#1F2937',
        fontFamily: 'Inter_600SemiBold',
    },
    eventDateHighlight: {
        backgroundColor: '#EBF5FF',
    },
    darkEventDateHighlight: {
        backgroundColor: '#1E3A8A',
    },
    timeOffHighlight: {
        backgroundColor: '#FEE2E2',
    },
    darkTimeOffHighlight: {
        backgroundColor: '#991B1B',
    },
    conflictHighlight: {
        backgroundColor: '#F3E8FF',
    },
    darkConflictHighlight: {
        backgroundColor: '#7E22CE',
    },
    eventIndicator: {
        backgroundColor: '#4169E1',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    eventIndicatorText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'Inter_500Medium',
    },
    timeOffIndicator: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    timeOffIndicatorText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'Inter_500Medium',
    },
    calendarPlaceholder: {
        height: 300,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
});

export default styles;