// src/screens/admin/AdminHomeScreen.js - NUEVO ARCHIVO
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

const AdminHomeScreen = ({ navigation }) => {
  const { user, profile, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0A1E" />
      
      {/* Header con gradiente oscuro */}
      <LinearGradient
        colors={['#0F0A1E', '#2D1B47']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Panel de Administración</Text>
            <Text style={styles.adminName}>
              {profile?.full_name || user?.email || 'Administrador'}
            </Text>
            <Text style={styles.adminEmail}>{user?.email}</Text>
          </View>
          
          <TouchableOpacity style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Contenido principal */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Estadísticas de administrador */}
        <View style={styles.adminStats}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <LinearGradient
                colors={['#FF6B35', '#FF8E53']}
                style={styles.statGradient}
              >
                <Ionicons name="people" size={28} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Usuarios Totales</Text>
            </View>
            
            <View style={styles.statItem}>
              <LinearGradient
                colors={['#4CAF50', '#8BC34A']}
                style={styles.statGradient}
              >
                <Ionicons name="calendar" size={28} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Clases Hoy</Text>
            </View>
          </View>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <LinearGradient
                colors={['#2196F3', '#03A9F4']}
                style={styles.statGradient}
              >
                <Ionicons name="cash" size={28} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.statNumber}>$0</Text>
              <Text style={styles.statLabel}>Ingresos Hoy</Text>
            </View>
            
            <View style={styles.statItem}>
              <LinearGradient
                colors={['#9C27B0', '#E91E63']}
                style={styles.statGradient}
              >
                <Ionicons name="alert-circle" size={28} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Alertas</Text>
            </View>
          </View>
        </View>

        {/* Módulos de administración */}
        <Text style={styles.sectionTitle}>Módulos de Administración</Text>
        
        <View style={styles.modulesGrid}>
          {/* Módulo: Usuarios */}
          <TouchableOpacity style={styles.moduleCard}>
            <LinearGradient
              colors={['rgba(255, 107, 53, 0.1)', 'rgba(255, 142, 83, 0.05)']}
              style={styles.moduleGradient}
            >
              <View style={[styles.moduleIcon, { backgroundColor: '#FF6B35' + '20' }]}>
                <Ionicons name="people" size={32} color="#FF6B35" />
              </View>
              <Text style={styles.moduleTitle}>Gestión de Usuarios</Text>
              <Text style={styles.moduleDescription}>
                Administra clientes, entrenadores y staff
              </Text>
              <View style={styles.moduleBadge}>
                <Text style={styles.moduleBadgeText}>CRUD</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Módulo: Clases */}
          <TouchableOpacity style={styles.moduleCard}>
            <LinearGradient
              colors={['rgba(76, 175, 80, 0.1)', 'rgba(139, 195, 74, 0.05)']}
              style={styles.moduleGradient}
            >
              <View style={[styles.moduleIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                <Ionicons name="calendar" size={32} color="#4CAF50" />
              </View>
              <Text style={styles.moduleTitle}>Horarios y Clases</Text>
              <Text style={styles.moduleDescription}>
                Programa y administra clases
              </Text>
              <View style={styles.moduleBadge}>
                <Text style={styles.moduleBadgeText}>AGENDA</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Módulo: Códigos Admin */}
          <TouchableOpacity style={styles.moduleCard}>
            <LinearGradient
              colors={['rgba(33, 150, 243, 0.1)', 'rgba(3, 169, 244, 0.05)']}
              style={styles.moduleGradient}
            >
              <View style={[styles.moduleIcon, { backgroundColor: '#2196F3' + '20' }]}>
                <Ionicons name="key" size={32} color="#2196F3" />
              </View>
              <Text style={styles.moduleTitle}>Códigos Admin</Text>
              <Text style={styles.moduleDescription}>
                Genera y administra códigos de acceso
              </Text>
              <View style={styles.moduleBadge}>
                <Text style={styles.moduleBadgeText}>SEGURIDAD</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Módulo: Reportes */}
          <TouchableOpacity style={styles.moduleCard}>
            <LinearGradient
              colors={['rgba(156, 39, 176, 0.1)', 'rgba(233, 30, 99, 0.05)']}
              style={styles.moduleGradient}
            >
              <View style={[styles.moduleIcon, { backgroundColor: '#9C27B0' + '20' }]}>
                <Ionicons name="stats-chart" size={32} color="#9C27B0" />
              </View>
              <Text style={styles.moduleTitle}>Reportes</Text>
              <Text style={styles.moduleDescription}>
                Genera reportes y estadísticas
              </Text>
              <View style={styles.moduleBadge}>
                <Text style={styles.moduleBadgeText}>ANÁLISIS</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Acciones rápidas */}
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FF6B35' + '15' }]}>
              <Ionicons name="add-circle" size={24} color="#FF6B35" />
            </View>
            <Text style={styles.quickActionText}>Nuevo Usuario</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#4CAF50' + '15' }]}>
              <Ionicons name="add-circle" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.quickActionText}>Nueva Clase</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#2196F3' + '15' }]}>
              <Ionicons name="key" size={24} color="#2196F3" />
            </View>
            <Text style={styles.quickActionText}>Generar Código</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFC107' + '15' }]}>
              <Ionicons name="settings" size={24} color="#FFC107" />
            </View>
            <Text style={styles.quickActionText}>Configuración</Text>
          </TouchableOpacity>
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error cerrando sesión:', error);
            }
          }}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Cerrar Sesión de Administrador</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  adminEmail: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  adminBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  adminStats: {
    marginBottom: 30,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  statGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.darkGray,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 15,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  moduleCard: {
    width: '48%',
    height: 180,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  moduleGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  moduleDescription: {
    fontSize: 11,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 10,
  },
  moduleBadge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  moduleBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  quickAction: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error + '10',
    padding: 18,
    borderRadius: 12,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: colors.error + '20',
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

AdminHomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};
export default AdminHomeScreen;
