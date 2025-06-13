import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import React from 'react';
import styles from './styles';
type RejectionModalProps = {
    visible: boolean;
    value: string;
    onChange: (text: string) => void;
    onCancel: () => void;
    onSubmit: () => void;
    colors: any;
};


const RejectionModal: React.FC<RejectionModalProps> = ({ visible, value, onChange, onCancel, onSubmit, colors }) => (
    <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onCancel}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Reject Request</Text>
                <Text style={styles.modalSubtitle}>Please provide a reason for rejecting this request</Text>
                <TextInput
                    style={styles.reasonInput}
                    placeholder="Enter your reason here..."
                    placeholderTextColor={colors.secondaryText}
                    multiline
                    numberOfLines={4}
                    value={value}
                    onChangeText={onChange}
                />
                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={onCancel}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modalButton, styles.submitButton]}
                        onPress={onSubmit}
                    >
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

export default RejectionModal;