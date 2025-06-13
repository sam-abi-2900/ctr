import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, RefreshControl, FlatList, Dimensions } from 'react-native';
import styles from './styles';
const DAVID_AVATAR = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e';

type SummaryItem = {
    vendor_id: string;
    vendor_name: string;
    total_work_time: string | null;
    total_overtime: string | null;
    total_standby_time: string | null;
};

type MonthOption = { label: string; value: string };
const renderDropdown = (
    items: string[] | MonthOption[],
    selected: string,
    onSelect: (item: string) => void,
    visible: boolean,
    onClose: () => void,
    isMonth = false,
    colors: any
) => {
    if (!visible) return null;
    const windowHeight = Dimensions.get('window').height;
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}>
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}>
                <View style={[styles.dropdown, { backgroundColor: colors.card, maxHeight: windowHeight * 0.5 }]}>
                    <ScrollView>
                        {(items as (string[] | MonthOption[])).map((item) => (
                            <TouchableOpacity
                                key={isMonth ? (item as MonthOption).value : (item as string)}
                                style={[
                                    styles.dropdownItem,
                                    (selected === (isMonth ? (item as MonthOption).value : (item as string))) && { backgroundColor: colors.primary + '20' }
                                ]}
                                onPress={() => {
                                    onSelect(isMonth ? (item as MonthOption).value : (item as string));
                                    onClose();
                                }}>
                                <Text style={[styles.dropdownItemText, { color: colors.text }]}>{isMonth ? (item as MonthOption).label : (item as string)}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};
export default renderDropdown;