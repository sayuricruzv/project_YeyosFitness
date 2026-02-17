// src/screens/admin/DashboardAdmin.js - VERSIÓN CORREGIDA
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const DashboardAdmin = ({ navigation }) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.admin || '#8B5CF6' }]}>
      <ScrollView>
        <View style={styles.header}>
          <Ionicons name="shield" size={60} color={colors.white} />
          <Text style={styles.title}>Panel de Administrador</Text>
          <Text style={styles.subtitle}>Bienvenido, administrador</Text>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 Estadísticas del Día</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="people" size={30} color={colors.admin || '#8B5CF6'} />
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Clientes Activos</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={30} color={colors.admin || '#8B5CF6'} />
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Clases Hoy</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="cash" size={30} color={colors.admin || '#8B5CF6'} />
              <Text style={styles.statNumber}>$8,500</Text>
              <Text style={styles.statLabel}>Ingresos Mes</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={30} color={colors.admin || '#8B5CF6'} />
              <Text style={styles.statNumber}>+12%</Text>
              <Text style={styles.statLabel}>Crecimiento</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>⚡ Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            {[
              { icon: 'person-add', title: 'Agregar Cliente', screen: 'Clientes' },
              { icon: 'calendar-plus', title: 'Crear Clase', screen: 'Horarios' },
              { icon: 'card', title: 'Membresías', screen: 'Membresías' },
              { icon: 'gift', title: 'Recompensas', screen: 'Recompensas' },
            ].map((action, index) => (
              <View key={index} style={styles.actionCard}>
                <Ionicons name={action.icon} size={30} color={colors.admin || '#8B5CF6'} />
                <Text style={styles.actionText}>{action.title}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  statsContainer: {
    backgroundColor: colors.white,
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.admin || '#8B5CF6',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.darkGray,
    textAlign: 'center',
  },
  quickActions: {
    margin: 20,
    marginTop: 0,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 10,
    textAlign: 'center',
  },
});

DashboardAdmin.propTypes = {
  navigation: PropTypes.object.isRequired
};
export default DashboardAdmin;
