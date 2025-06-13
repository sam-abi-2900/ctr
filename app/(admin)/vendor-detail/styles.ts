
import { StyleSheet } from 'react-native';
import { colors as newColor } from '@/constants/theme';


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Inter_600SemiBold',
    },
    content: {
        flex: 1,
    },
    detailContainer: {
        padding: 16,
        gap: 16,

    },
    detailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    detailTitle: {
        fontSize: 24,
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
    detailInfo: {
        marginTop: 16,
        gap: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        backgroundColor: newColor.background.new,
        padding: 16,
        borderRadius: 12,
        gap: 8,
        borderColor: newColor.border,
        borderWidth: 1
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
        backgroundColor: newColor.background.new,
        padding: 12,
        borderRadius: 8,
        gap: 8,
        borderColor: newColor.border,
        borderWidth: 1
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
        color: '#000',
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        textAlign: 'center',
    },
});
export default styles;