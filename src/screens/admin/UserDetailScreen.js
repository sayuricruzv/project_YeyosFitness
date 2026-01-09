// src/screens/admin/UserDetailScreen.js - NUEVO ARCHIVO
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';

const UserDetailScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const { userRole } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserDetails();
  }, [userId]);

  const loadUserDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      setUser(data);
    } catch (error) {
      console.error('Error cargando detalles:', error);
      Alert.alert('Error', 'No se pudieron cargar los detalles del usuario');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: !user.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Actualizar estado local
      setUser(prev => ({ ...prev, is_active: !prev.is_active }));
      
      Alert.alert(
        'Éxito',
        `Usuario ${user.is_active ? 'desactivado' : 'activado'} correctamente`
      );
    } catch (error) {
      console.error('Error cambiando estado:', error);
      Alert.alert('Error', 'No se pudo cambiar el estado del usuario');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color={colors.error} />
        <Text style={styles.errorText}>Usuario no encontrado</Text>
        <CustomButton
          title="Volver"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Detalles del Usuario</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Información del usuario */}
      <View style={styles.content}>
        {/* Avatar y nombre */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.first_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Sin nombre'}
          </Text>
          <View style={[
            styles.roleBadge,
            { backgroundColor: user.role === 'admin' ? colors.admin : colors.primary }
          ]}>
            <Text style={styles.roleText}>
              {user.role === 'admin' ? 'ADMINISTRADOR' : 'CLIENTE'}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: user.is_active ? colors.success : colors.error }
          ]}>
            <Text style={styles.statusText}>
              {user.is_active ? 'ACTIVO' : 'INACTIVO'}
            </Text>
          </View>
        </View>

        {/* Información detallada */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.infoCard}>
            <InfoRow 
              icon="mail" 
              label="Email" 
              value={user.email}
            />
            <InfoRow 
              icon="call" 
              label="Teléfono" 
              value={user.phone || 'No proporcionado'}
            />
            <InfoRow 
              icon="person" 
              label="Nombre completo" 
              value={user.full_name || 'No proporcionado'}
            />
            <InfoRow 
              icon="calendar" 
              label="Fecha de registro" 
              value={formatDate(user.created_at)}
            />
            <InfoRow 
              icon="time" 
              label="Último acceso" 
              value={user.last_login ? formatDate(user.last_login) : 'Nunca'}
            />
            <InfoRow 
              icon="document-text" 
              label="Términos aceptados" 
              value={user.accepted_terms ? 'Sí' : 'No'}
            />
            {user.medical_info && Object.keys(user.medical_info).length > 0 && (
              <InfoRow 
                icon="medical" 
                label="Información médica" 
                value="Disponible"
              />
            )}
          </View>
        </View>

        {/* Acciones (solo para administradores) */}
        {userRole === 'admin' && (
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Acciones</Text>
            
            <View style={styles.actionsCard}>
              <CustomButton
                title={user.is_active ? "Desactivar Usuario" : "Activar Usuario"}
                onPress={toggleUserStatus}
                variant={user.is_active ? "error" : "success"}
                icon={user.is_active ? "person-remove" : "person-add"}
                style={styles.actionButton}
              />
              
              <CustomButton
                title="Enviar mensaje"
                onPress={() => Alert.alert('Mensaje', 'Función en desarrollo')}
                variant="outline"
                icon="chatbubble"
                style={styles.actionButton}
              />
              
              <CustomButton
                title="Ver actividad"
                onPress={() => Alert.alert('Actividad', 'Función en desarrollo')}
                variant="outline"
                icon="stats-chart"
                style={styles.actionButton}
              />
            </View>
          </View>
        )}

        {/* Metadatos */}
        <View style={styles.metadataSection}>
          <Text style={styles.sectionTitle}>Información Técnica</Text>
          <View style={styles.metadataCard}>
            <Text style={styles.metadataLabel}>ID de usuario:</Text>
            <Text style={styles.metadataValue} selectable>
              {user.id}
            </Text>
            <Text style={styles.metadataLabel}>Última actualización:</Text>
            <Text style={styles.metadataValue}>
              {formatDate(user.updated_at)}
            </Text>
            <Text style={styles.metadataLabel}>Tipo de membresía:</Text>
            <Text style={styles.metadataValue}>
              {user.membership_type || 'Básica'}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

// Componente para filas de información
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>
      <Ionicons name={icon} size={18} color={colors.primary} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.darkGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    marginTop: 20,
    marginBottom: 30,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 10,
    textAlign: 'center',
  },
  roleBadge: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 8,
  },
  roleText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.darkGray,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: '500',
  },
  actionsSection: {
    marginBottom: 25,
  },
  actionsCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },
  actionButton: {
    marginBottom: 12,
  },
  metadataSection: {
    marginBottom: 25,
  },
  metadataCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },
  metadataLabel: {
    fontSize: 12,
    color: colors.darkGray,
    marginBottom: 5,
  },
  metadataValue: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 15,
    fontFamily: 'monospace',
  },
});

export default UserDetailScreen;