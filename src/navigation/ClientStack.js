// src/navigation/ClientStack.js - NUEVO ARCHIVO
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importar pantallas de cliente
import HomeScreen from '../screens/client/HomeScreen';

const Stack = createStackNavigator();

const ClientStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Inicio',
          headerBackTitle: 'Atrás',
        }}
      />
    </Stack.Navigator>
  );
};

export default ClientStack;