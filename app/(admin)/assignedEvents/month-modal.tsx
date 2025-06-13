
import React from 'react';

import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import styles from './styles';
import { useTheme } from '../context/ThemeContext';

const MonthModal = ({ showMonthPicker, setShowMonthPicker, months, selectedMonth, setSelectedMonth }: any) => {
    const { colors, theme } = useTheme();
    return (
        <Modal
            visible={showMonthPicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowMonthPicker(false)}>
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Select Month</Text>
                    <ScrollView style={styles.pickerList}>
                        {months.map((month: number) => (
                            <TouchableOpacity
                                key={month}
                                style={[styles.pickerItem, selectedMonth === month && styles.selectedPickerItem]}
                                onPress={() => {
                                    setSelectedMonth(month);
                                    setShowMonthPicker(false);
                                }}>
                                <Text style={[styles.pickerItemText, { color: colors.text }]}>{month}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

export default MonthModal;