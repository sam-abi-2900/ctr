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
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Inter_600SemiBold',
    },
    notificationsList: {
        flex: 1,
        padding: 16,
    },
    notificationCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderColor: newColor.border,
        borderWidth: 1
    },
    notificationTitle: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 4,
    },
    contractorName: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        marginBottom: 4,
    },
    eventTitle: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        marginBottom: 4,
    },
    reason: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        marginBottom: 4,
    },
    time: {
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    approveButton: {
        backgroundColor: '#4CAF50',
    },
    rejectButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: newColor.background.secondary,
        borderRadius: 12,
        padding: 24,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Inter_600SemiBold',
        color: '#fff',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: '#aaa',
        marginBottom: 16,
    },
    reasonInput: {
        backgroundColor: newColor.background.primary,
        borderRadius: 8,
        padding: 16,
        color: '#fff',
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: newColor.background.tertiary || '#333',
    },
    submitButton: {
        backgroundColor: '#F44336',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
});

export default styles;