// src/screens/client/HomeScreen.js - VERSIÓN SIMPLE
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user, isDemoMode } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const getUserName = () => {
    if (!user) return 'Usuario';
    if (user.firstName) return user.firstName;
    return user.email?.split('@')[0] || 'Usuario';
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const quickActions = [
    { id: 1, title: 'Reservar Clase', icon: 'calendar', screen: 'ScheduleTab' },
    { id: 2, title: 'Mi Progreso', icon: 'stats-chart', screen: 'MyProgress' },
    { id: 3, title: 'Comunidad', icon: 'people', screen: 'SocialTab' },
    { id: 4, title: 'Recompensas', icon: 'gift', screen: 'RewardsTab' },
  ];

  const stats = [
    { label: 'Clases', value: '0', icon: 'calendar' },
    { label: 'Puntos', value: '0', icon: 'trophy' },
    { label: 'Días', value: '0', icon: 'flame' },
    { label: 'Calorías', value: '0', icon: 'fitness' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getTimeOfDay()}</Text>
            <Text style={styles.userName}>{getUserName()}</Text>
            {isDemoMode && (
              <Text style={styles.demoText}>Modo Demo</Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.white}
          />
        }
      >
        {/* Stats Section */}
        <View style={styles.statsSection}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name={stat.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                  <Ionicons name={action.icon} size={24} color={colors.white} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Membership Card */}
        <View style={styles.section}>
          <View style={[styles.membershipCard, { backgroundColor: colors.primary }]}>
            <View style={styles.membershipHeader}>
              <Ionicons name="trophy" size={30} color={colors.white} />
              <View style={styles.membershipInfo}>
                <Text style={styles.membershipTitle}>
                  Membresía {isDemoMode ? 'Demo' : 'Activa'}
                </Text>
                <Text style={styles.membershipSubtitle}>Acceso completo</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.detailsButton, { backgroundColor: colors.success }]}
              onPress={() => Alert.alert('Membresía', 'Detalles de tu membresía')}
            >
              <Text style={styles.detailsText}>Ver Detalles</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Classes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Clases Hoy</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ScheduleTab')}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.classesList}>
            <View style={styles.classItem}>
              <View style={[styles.classIcon, { backgroundColor: colors.success }]}>
                <Ionicons name="fitness" size={20} color={colors.white} />
              </View>
              <View style={styles.classInfo}>
                <Text style={styles.className}>HIIT Intenso</Text>
                <Text style={styles.classTime}>18:00 - 19:00</Text>
              </View>
              <TouchableOpacity 
                style={[styles.reserveBtn, { backgroundColor: colors.success }]}
                onPress={() => Alert.alert('Reserva', 'Clase reservada')}
              >
                <Text style={styles.reserveText}>Reservar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: StatusBar.currentHeight + 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    color: colors.white,
    fontWeight: 'bold',
    marginTop: 5,
  },
  demoText: {
    fontSize: 12,
    color: colors.success,
    marginTop: 5,
    fontWeight: '600',
  },
  notificationBtn: {
    padding: 10,
  },
  statsSection: {
    flexDirection: 'row',
    padding: 20,
    marginTop: -20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.darkGray,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 50) / 2,
    alignItems: 'center',
    marginBottom: 15,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    color: colors.dark,
    fontWeight: '600',
    textAlign: 'center',
  },
  membershipCard: {
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  membershipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  membershipInfo: {
    marginLeft: 15,
    flex: 1,
  },
  membershipTitle: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  membershipSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  detailsText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '600',
    marginRight: 8,
  },
  classesList: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  classIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: '600',
    marginBottom: 3,
  },
  classTime: {
    fontSize: 14,
    color: colors.darkGray,
  },
  reserveBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  reserveText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
});

export default HomeScreen;