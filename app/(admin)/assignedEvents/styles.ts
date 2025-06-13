import { StyleSheet } from "react-native";
import { colors as newColor } from '@/constants/theme';

const styles = StyleSheet.create({
    backButton: {
        marginRight: 16,
    },
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter_600SemiBold',
    },
    filterContainer: {
        padding: 16,
        gap: 12,
    },
    filterRow: {
        flexDirection: 'row',
        gap: 8,
    },
    filterButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 8,
    },
    filterButtonText: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    eventList: {
        flex: 1,
        padding: 16,
    },
    eventCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderColor: newColor.border,
        borderWidth: 1
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    eventTitle: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        flex: 1,
    },
    statusTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    eventLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    locationText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    vendorList: {
        gap: 8,
    },
    vendorTitle: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    vendorItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    vendorName: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    vendorStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    vendorStatusText: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
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
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 16,
    },
    pickerList: {
        maxHeight: 300,
    },
    pickerItem: {
        padding: 16,
        borderRadius: 8,
    },
    selectedPickerItem: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    pickerItemText: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    detailContainer: {
        gap: 16,
    },
    detailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailTitle: {
        fontSize: 20,
        fontFamily: 'Inter_600SemiBold',
        flex: 1,
    },
    detailInfo: {
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    rejectionContainer: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    rejectionTitle: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
    },
    rejectionText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    checkinContainer: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    checkinTitle: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
    },
    checkinText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    tasksContainer: {
        gap: 12,
    },
    tasksTitle: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
    },
    taskItem: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskSequence: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    taskStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    taskStatusText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    taskRejectionReason: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: '#EF4444',
    },
    taskActionTime: {
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        color: '#6B7280',
    },
    loadingContainer: {
        padding: 24,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
    },
    closeButton: {
        padding: 4,
    },
});
export default styles;