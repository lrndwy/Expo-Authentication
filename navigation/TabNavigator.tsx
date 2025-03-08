import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@/components/ui/icon';
import { Home, User } from 'lucide-react-native';
import HomeScreen from '@/screens/Home';
import AccountScreen from '@/screens/Account';
import ProfileScreen from '@/screens/ProfileScreen';
import PasswordScreen from '@/screens/PasswordScreen';
import { VStack } from '@/components/ui/vstack';
import { Pressable, Text } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccountMain" component={AccountScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Password" component={PasswordScreen} />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 4,
          borderRadius: 20,
          height: 60,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          marginHorizontal: 20,
          shadowOpacity: 0.25,
          shadowRadius: 5,
          borderColor: '#e5e5e5',
          borderTopWidth: 0.5,
          borderLeftWidth: 0.5,
          borderRightWidth: 0.5,
          borderBottomWidth: 0.5,
        },
        tabBarActiveTintColor: '#84d3a2',
        tabBarInactiveTintColor: '#6B7280',
        tabBarItemStyle: {
          marginVertical: 5,
        },
        tabBarLabelStyle: {
          marginBottom: 5,
        },

        
        tabBarButton: (props) => (
          <Pressable {...props} android_ripple={null} style={props.style} />
        ),
      }}
    >
      <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <VStack
                style={{
                  backgroundColor: focused ? '#F3F4F6' : 'transparent',
                  padding: 10,
                  borderRadius: 100,
                  alignItems: 'center',
                  marginBottom: -10
                }}
              >
                <Icon as={Home} size="xl" color={color} />
              </VStack>
            ),
          }}
        />
      
      <Tab.Screen 
        name="Account" 
        component={AccountStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, focused }) => (
            <VStack
              style={{
                backgroundColor: focused ? '#F3F4F6' : 'transparent',
                padding: 10,
                borderRadius: 100,
                alignItems: 'center',
                marginBottom: -10
              }}
            >
              <Icon as={User} size="xl" color={color} />
            </VStack>
          ),
        }}
      />
    </Tab.Navigator>
  );
} 