import { Tabs } from 'expo-router';
import { House, Calendar, User, BarChart2 } from 'lucide-react-native';
import { colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.new,
          borderTopWidth: 0,
        },

        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#888',

      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <House size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ size, color }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: 'Summary',
          tabBarIcon: ({ size, color }) => <BarChart2 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="warehouse-tasks"
        options={{
          title: 'Warehouse Tasks',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      /> */}

    </Tabs>
  );
}