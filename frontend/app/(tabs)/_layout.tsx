import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#0B1D37' },
        headerTintColor: '#FFFFFF',
        tabBarActiveTintColor: '#0B1D37'
      }}
    >
      <Tabs.Screen
        name="jobs/index"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="assignment" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="jobs/[id]"
        options={{ href: null, title: 'Job Details' }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
