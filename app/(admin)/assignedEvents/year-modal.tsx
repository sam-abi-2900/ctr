
import React from 'react';

import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import styles from './styles';
import { useTheme } from '../context/ThemeContext';

const YearModal = ({ showYearPicker, setShowYearPicker, years, setSelectedYear, selectedYear }: any) => {
    const { colors, theme } = useTheme();
    return (
        <Modal
            visible={showYearPicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowYearPicker(false)}>
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Select Year</Text>
                    <ScrollView style={styles.pickerList}>
                        {years.map((year: number) => (
                            <TouchableOpacity
                                key={year}
                                style={[styles.pickerItem, selectedYear === year && styles.selectedPickerItem]}
                                onPress={() => {
                                    setSelectedYear(year);
                                    setShowYearPicker(false);
                                }}>
                                <Text style={[styles.pickerItemText, { color: colors.text }]}>{year}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

export default YearModal;