
import React from 'react';

import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import styles from './styles';
import { useTheme } from '../context/ThemeContext';

const DayModal = ({ showDayPicker, setShowDayPicker, selectedDay, setSelectedDay, days }: any) => {
    const { colors, theme } = useTheme();
    return (
        <Modal
            visible={showDayPicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDayPicker(false)}>
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Select Day</Text>
                    <ScrollView style={styles.pickerList}>
                        <TouchableOpacity
                            style={[styles.pickerItem, selectedDay === null && styles.selectedPickerItem]}
                            onPress={() => {
                                setSelectedDay(null);
                                setShowDayPicker(false);
                            }}>
                            <Text style={[styles.pickerItemText, { color: colors.text }]}>All</Text>
                        </TouchableOpacity>
                        {days.map((day: number) => (
                            <TouchableOpacity
                                key={day}
                                style={[styles.pickerItem, selectedDay === day && styles.selectedPickerItem]}
                                onPress={() => {
                                    setSelectedDay(day);
                                    setShowDayPicker(false);
                                }}>
                                <Text style={[styles.pickerItemText, { color: colors.text }]}>{day}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

export default DayModal;