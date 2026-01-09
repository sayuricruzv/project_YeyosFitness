// src/screens/admin/ClientsManagement.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

const ClientsManagement = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Clientes</Text>
      <Text style={styles.text}>Pantalla en desarrollo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  text: {
    fontSize: 16,
    color: colors.darkGray,
    marginTop: 20,
  },
});
export default ClientsManagement;