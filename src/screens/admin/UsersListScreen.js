// src/screens/admin/UsersListScreen.js - NUEVO ARCHIVO
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllUsers } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/colors';

const UsersListScreen = ({ navigation }) => {
  const { user, userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = async () => {
    try {
      if (userRole !== 'admin') {
        Alert.alert('Acceso denegado', 'Solo administradores pueden ver esta lista');
        navigation.goBack();
        return;
      }

      const result = await getAllUsers();
      if (result.success) {
        setUsers(result.users);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const getUserRoleBadge = (role) => {
    const colors = {
      admin: { bg: '#8B5CF6', text: '#FFFFFF' },
      client: { bg: '#10B981', text: '#FFFFFF' },
      trainer: { bg: '#3B82F6', text: '#FFFFFF' },
    };
    
    const roleColor = colors[role] || { bg: '#6B7280', text: '#FFFFFF' };
    
    return (
      <View style={[styles.roleBadge, { backgroundColor: roleColor.bg }]}>
        <Text style={[styles.roleText, { color: roleColor.text }]}>
          {role.toUpperCase()}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando usuarios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Usuarios Registrados</Text>
        <Text style={styles.count}>{users.length} usuarios</Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.list}
      >
        {users.map((userItem) => (
          <TouchableOpacity
            key={userItem.id}
            style={styles.userCard}
            onPress={() => navigation.navigate('UserDetail', { userId: userItem.id })}
          >
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>
                {userItem.first_name?.[0] || userItem.email[0].toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.userInfo}>
              <View style={styles.userHeader}>
                <Text style={styles.userName}>
                  {userItem.full_name || `${userItem.first_name || ''} ${userItem.last_name || ''}`.trim() || 'Sin nombre'}
                </Text>
                {getUserRoleBadge(userItem.role)}
              </View>
              
              <Text style={styles.userEmail}>{userItem.email}</Text>
              
              <View style={styles.userDetails}>
                {userItem.phone && (
                  <View style={styles.detailItem}>
                    <Ionicons name="call" size={14} color={colors.darkGray} />
                    <Text style={styles.detailText}>{userItem.phone}</Text>
                  </View>
                )}
                
                <View style={styles.detailItem}>
                  <Ionicons name="calendar" size={14} color={colors.darkGray} />
                  <Text style={styles.detailText}>
                    Registrado: {formatDate(userItem.created_at)}
                  </Text>
                </View>
                
                {userItem.last_login && (
                  <View style={styles.detailItem}>
                    <Ionicons name="time" size={14} color={colors.darkGray} />
                    <Text style={styles.detailText}>
                      Último login: {formatDate(userItem.last_login)}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: userItem.is_active ? colors.success : colors.error }
                ]} />
                <Text style={styles.statusText}>
                  {userItem.is_active ? 'Activo' : 'Inactivo'}
                </Text>
              </View>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color={colors.darkGray} />
          </TouchableOpacity>
        ))}
        
        {users.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color={colors.lightGray} />
            <Text style={styles.emptyText}>No hay usuarios registrados</Text>
          </View>
        )}
        
        <View style={{ height: 50 }} />
      </ScrollView>
      
      {/* Botón para crear nuevo usuario (admin) */}
      {userRole === 'admin' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateUser')}
        >
          <Ionicons name="person-add" size={24} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  count: {
    fontSize: 14,
    color: colors.white,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.darkGray,
  },
  list: {
    flex: 1,
    padding: 15,
  },
  userCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 10,
  },
  roleText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 8,
  },
  userDetails: {
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.darkGray,
    marginLeft: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    color: colors.darkGray,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.darkGray,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default UsersListScreen;