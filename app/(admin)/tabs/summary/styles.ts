import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    userList: {
        flex: 1,
        padding: 16,
    },
    userCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderColor: '#3F3C39',
        borderWidth: 1,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 8,
    },
    hoursContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    hourItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    hourText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    selectorContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#3F3C39',
    },
    selectorButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        gap: 4,
    },
    selectorText: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        width: '90%',
        maxHeight: 350,
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: '#3F3C39',
        alignSelf: 'center',
    },
    dropdownItem: {
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 4,
        marginBottom: 2,
    },
    dropdownItemText: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
});
export default styles;