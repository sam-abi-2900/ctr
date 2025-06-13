import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { Moon, Bell, Lock, HelpCircle } from 'lucide-react-native';

export default function SettingsScreen() {
    const { colors, theme, toggleTheme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
            </View>
            <ScrollView style={styles.content}>
                <View style={[styles.section, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <View style={styles.iconContainer}>
                                <Moon size={20} color={colors.primary} />
                            </View>
                            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Theme</Text>
                        </View>
                        <Switch
                            value={theme === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                <View style={[styles.section, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <View style={styles.iconContainer}>
                                <Bell size={20} color={colors.primary} />
                            </View>
                            <Text style={[styles.settingLabel, { color: colors.text }]}>Event Reminders</Text>
                        </View>
                        <Switch
                            value={true}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                <View style={[styles.section, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy</Text>
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <View style={styles.iconContainer}>
                                <Lock size={20} color={colors.primary} />
                            </View>
                            <Text style={[styles.settingLabel, { color: colors.text }]}>Event Visibility</Text>
                        </View>
                        <Text style={[styles.settingValue, { color: colors.secondaryText }]}>Private</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <View style={styles.iconContainer}>
                                <HelpCircle size={20} color={colors.primary} />
                            </View>
                            <Text style={[styles.settingLabel, { color: colors.text }]}>App Version</Text>
                        </View>
                        <Text style={[styles.settingValue, { color: colors.secondaryText }]}>1.0.0</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter_600SemiBold',
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingLabel: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
    },
    settingValue: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
});