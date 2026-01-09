// src/navigation/AdminStack.js - NUEVO ARCHIVO
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importar pantallas de administrador
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import UserDetailScreen from '../screens/admin/UserDetailScreen';

const Stack = createStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="AdminHome"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen 
        name="AdminHome" 
        component={AdminHomeScreen}
        options={{
          title: 'Panel Admin',
          headerBackTitle: 'Atrás',
        }}
      />
      <Stack.Screen 
  name="UserDetail" 
  component={UserDetailScreen}
  options={{ title: 'Detalles del Usuario' }}
/>
    </Stack.Navigator>
  );
};

export default AdminStack;