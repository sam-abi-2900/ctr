import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Calendar, Settings, Clock } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { colors as newColor } from '@/constants/theme';
export default function TabLayout() {
    const { colors, theme } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: newColor.background.new,
                    borderTopWidth: 0,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondaryText,
                tabBarLabelStyle: {
                    fontFamily: 'Inter_500Medium',
                },
            }}>
            <Tabs.Screen
                name="admin"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}

            />
            {/* <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Calendar',
                    tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
                }}
            /> */}
            <Tabs.Screen
                name="summary"
                options={{
                    title: 'Summary',
                    tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}