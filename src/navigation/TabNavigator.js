// src/navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

// Importar pantallas
import HomeScreen from '../screens/client/HomeScreen';
import ScheduleClient from '../screens/client/ScheduleClient';
import SocialWall from '../screens/client/SocialWall';
import RewardsStore from '../screens/client/RewardsStore';
import ProfileClient from '../screens/client/ProfileClient';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ScheduleTab':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'SocialTab':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'RewardsTab':
              iconName = focused ? 'gift' : 'gift-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.darkGray,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.lightGray,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen 
        name="ScheduleTab" 
        component={ScheduleClient}
        options={{ title: 'Horarios' }}
      />
      <Tab.Screen 
        name="SocialTab" 
        component={SocialWall}
        options={{ title: 'Comunidad' }}
      />
      <Tab.Screen 
        name="RewardsTab" 
        component={RewardsStore}
        options={{ title: 'Recompensas' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileClient}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}