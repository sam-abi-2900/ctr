import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react-native';

export const ThemeToggle = () => {
    const { theme, toggleTheme, colors } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: theme === 'dark' ? colors.card : colors.background,
                    borderColor: colors.border
                }
            ]}
            onPress={toggleTheme}
        >
            {theme === 'dark' ? (
                <View style={styles.iconContainer}>
                    <Moon size={18} color={colors.primary} />
                    <Text style={[styles.text, { color: colors.text }]}>Dark</Text>
                </View>
            ) : (
                <View style={styles.iconContainer}>
                    <Sun size={18} color={colors.primary} />
                    <Text style={[styles.text, { color: colors.text }]}>Light</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};
// export default ThemeToggle;
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    text: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    }
}); 