
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        padding: 16,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    locationInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    locationTextInput: {
        flex: 1,
        borderWidth: 0,
        padding: 12,
    },
    textArea: {
        height: 120,
        paddingTop: 12,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
    },
    dateButtonText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    errorText: {
        marginTop: 4,
        fontSize: 14,
    },
    priorityButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priorityButton: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    priorityButtonText: {
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        marginRight: 8,
    },
    saveButton: {
        marginLeft: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    cancelButtonText: {
        fontWeight: '600',
        fontSize: 16,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        padding: 12,
        borderRadius: 8,
    },
    taskText: {
        flex: 1,
        fontSize: 16,
    },
    removeTaskButton: {
        padding: 8,
    },
    addTaskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addTaskInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginRight: 8,
    },
    addTaskButton: {
        width: 50,
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Add type button styles
    typeButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    typeButton: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginHorizontal: 2,
    },
    typeButtonText: {
        fontWeight: '600',
    },
    predefinedTaskItem: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    predefinedTaskContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 12,
    },
    predefinedTaskText: {
        fontSize: 16,
        fontWeight: '500',
    },
    dropdownContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 8,
        marginRight: 8,
        paddingHorizontal: 12,
        height: 50,
    },
    dropdownText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        marginTop: 35
    },
    mapModalContainer: {
        flex: 1,
        marginTop: 35
    },
    mapModalContent: {
        flex: 1,
    },
    mapHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    mapTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    confirmButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    modalClose: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    modalItemText: {
        fontSize: 16,
    },
    imagePickerModal: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    imagePickerContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    imagePickerOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    imagePickerOptionText: {
        marginLeft: 12,
        fontSize: 16,
    },
    mapButton: {
        padding: 8,
    },
    imageUploadContainer: {
        height: 200,
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    uploadPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        marginTop: 8,
        fontSize: 16,
    },
    coordinatesButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
    },
    coordinatesButtonText: {
        marginLeft: 8,
        fontSize: 16,
    },
    searchContainer: {
        padding: 16,
        zIndex: 1,
    },
    searchModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchModalContent: {
        width: '90%',
        height: '80%',
        borderRadius: 16,
        overflow: 'hidden',
    },
    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    searchTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    searchClose: {
        fontSize: 16,
        fontWeight: '600',
    },
    searchItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    searchItemText: {
        fontSize: 16,
    },
    modalItemDescription: {
        fontSize: 14,
        marginTop: 4,
    },
});

export default styles;