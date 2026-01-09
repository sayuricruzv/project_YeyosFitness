// src/screens/client/ProfileClient.js - VERSIÓN CORREGIDA
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/colors';

const ProfileClient = ({ navigation }) => {
  const { user, userRole, signOut, isDemoMode } = useAuth();
  
  const [medicalData, setMedicalData] = useState({
    allergies: '',
    conditions: '',
    medications: '',
    emergencyContact: '',
  });
  const [editingMedical, setEditingMedical] = useState(false);

  // Función para obtener el nombre del usuario
  const getUserName = () => {
    if (!user) return 'Usuario';
    
    if (user.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    
    return user.email?.split('@')[0] || 'Usuario';
  };

  // Función para obtener la inicial del avatar
  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', onPress: signOut, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con gradiente */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.editPhotoButton}
          onPress={() => Alert.alert('Info', 'Función para cambiar foto próxima')}
        >
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{getUserInitial()}</Text>
          </View>
          {isDemoMode && (
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>DEMO</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.name}>{getUserName()}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.membership}>
          Rol: {userRole} {isDemoMode && '(Demo)'}
        </Text>
      </LinearGradient>

      {/* Información Personal */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person-circle" size={24} color={colors.primary} />
          <Text style={styles.sectionTitle}>Información Personal</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nombre:</Text>
          <Text style={styles.infoValue}>{getUserName()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rol:</Text>
          <Text style={styles.infoValue}>{userRole} {isDemoMode && '(Demo)'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ID Usuario:</Text>
          <Text style={styles.infoValue}>{user?.id?.substring(0, 8) || 'N/A'}</Text>
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="stats-chart" size={24} color={colors.success} />
          <Text style={styles.sectionTitle}>Mi Progreso</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyProgress')}>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Clases asistidas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Puntos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Retos completados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Días activo</Text>
          </View>
        </View>
      </View>

      {/* Información de membresía */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="card" size={24} color={colors.warning} />
          <Text style={styles.sectionTitle}>Membresía</Text>
        </View>
        
        <View style={styles.membershipCard}>
          <Ionicons name="trophy" size={30} color={colors.gold} />
          <View style={styles.membershipInfo}>
            <Text style={styles.membershipType}>Membresía {isDemoMode ? 'Demo' : 'Activa'}</Text>
            <Text style={styles.membershipStatus}>
              {isDemoMode ? 'Modo demostración' : 'Estado: Activa'}
            </Text>
          </View>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeText}>Ver planes</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.actionsSection}>
        <CustomButton
          title="Ver notificaciones"
          onPress={() => navigation.navigate('Notifications')}
          variant="outline"
          icon="notifications"
          style={styles.actionButton}
        />
        <CustomButton
          title="Configuración"
          onPress={() => navigation.navigate('Settings')}
          variant="outline"
          icon="settings"
          style={styles.actionButton}
        />
        <CustomButton
          title="Cerrar sesión"
          onPress={handleSignOut}
          variant="error"
          icon="log-out"
          style={styles.actionButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          App Version: 1.0.0 • {new Date().toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  editPhotoButton: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  demoBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.white,
  },
  demoBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginTop: 5,
  },
  membership: {
    fontSize: 14,
    color: colors.white,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 10,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    margin: 15,
    marginVertical: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginLeft: 10,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.darkGray,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: colors.dark,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.darkGray,
    marginTop: 5,
  },
  membershipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    borderRadius: 10,
    padding: 15,
  },
  membershipInfo: {
    flex: 1,
    marginLeft: 15,
  },
  membershipType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 2,
  },
  membershipStatus: {
    fontSize: 14,
    color: colors.darkGray,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  actionsSection: {
    padding: 15,
    marginTop: 10,
  },
  actionButton: {
    marginBottom: 10,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: colors.darkGray,
  },
});

export default ProfileClient;