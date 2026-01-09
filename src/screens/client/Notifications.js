import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../constants/colors';

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'class',
      title: 'Recordatorio de clase',
      message: 'Tienes clase de Zumba a las 18:00 hoy',
      timestamp: '2024-01-15T17:00:00',
      read: false,
      icon: 'calendar',
      color: colors.primary,
    },
    {
      id: 2,
      type: 'payment',
      title: 'Recordatorio de pago',
      message: 'Tu membresía vence mañana',
      timestamp: '2024-01-15T10:30:00',
      read: false,
      icon: 'card',
      color: colors.warning,
    },
    {
      id: 3,
      type: 'achievement',
      title: '¡Logro desbloqueado!',
      message: 'Completaste el reto "Asistencia Semanal"',
      timestamp: '2024-01-14T19:45:00',
      read: true,
      icon: 'trophy',
      color: colors.gold,
    },
    {
      id: 4,
      type: 'reward',
      title: 'Recompensa disponible',
      message: 'Puedes reclamar tu bebida energética en recepción',
      timestamp: '2024-01-14T15:20:00',
      read: true,
      icon: 'gift',
      color: colors.secondary,
    },
    {
      id: 5,
      type: 'system',
      title: 'Mantenimiento programado',
      message: 'El gimnasio cerrará temprano el viernes por mantenimiento',
      timestamp: '2024-01-13T09:00:00',
      read: true,
      icon: 'construct',
      color: colors.darkGray,
    },
    {
      id: 6,
      type: 'social',
      title: 'Nuevo video en el muro',
      message: 'Coach Carlos subió un nuevo video de entrenamiento',
      timestamp: '2024-01-12T14:30:00',
      read: true,
      icon: 'videocam',
      color: colors.success,
    },
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    classReminders: true,
    paymentReminders: true,
    achievements: true,
    rewards: true,
    systemUpdates: true,
    socialUpdates: false,
    sound: true,
    vibration: true,
  });

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - date) / 3600000);

    if (diffHours < 24) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 48) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Notificaciones</Text>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount}</Text>
          </View>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Marcar todas como leídas</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        <TouchableOpacity style={styles.filterButtonActive}>
          <Text style={styles.filterTextActive}>Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>No leídas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Clases</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Pagos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Logros</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Lista de notificaciones */}
      <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color={colors.lightGray} />
            <Text style={styles.emptyTitle}>No hay notificaciones</Text>
            <Text style={styles.emptyText}>
              Todas tus notificaciones aparecerán aquí
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard,
              ]}
              onPress={() => markAsRead(notification.id)}
              onLongPress={() => {
                // Opción para eliminar en hold largo
                deleteNotification(notification.id);
              }}
            >
              <View style={styles.notificationContent}>
                <View style={[styles.iconContainer, { backgroundColor: notification.color + '20' }]}>
                  <Ionicons name={notification.icon} size={20} color={notification.color} />
                </View>

                <View style={styles.notificationText}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>
                    {formatTime(notification.timestamp)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteNotification(notification.id)}
                >
                  <Ionicons name="close" size={18} color={colors.darkGray} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Configuración rápida */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Configuración de notificaciones</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={20} color={colors.darkGray} />
            <Text style={styles.settingText}>Recordatorios de clases</Text>
          </View>
          <Switch
            value={notificationSettings.classReminders}
            onValueChange={(value) => setNotificationSettings({
              ...notificationSettings,
              classReminders: value
            })}
            trackColor={{ false: colors.lightGray, true: colors.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="card" size={20} color={colors.darkGray} />
            <Text style={styles.settingText}>Recordatorios de pagos</Text>
          </View>
          <Switch
            value={notificationSettings.paymentReminders}
            onValueChange={(value) => setNotificationSettings({
              ...notificationSettings,
              paymentReminders: value
            })}
            trackColor={{ false: colors.lightGray, true: colors.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="trophy" size={20} color={colors.darkGray} />
            <Text style={styles.settingText}>Logros y recompensas</Text>
          </View>
          <Switch
            value={notificationSettings.achievements}
            onValueChange={(value) => setNotificationSettings({
              ...notificationSettings,
              achievements: value
            })}
            trackColor={{ false: colors.lightGray, true: colors.primary }}
          />
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        <CustomButton
          title="Limpiar todas"
          onPress={clearAll}
          variant="outline"
          style={styles.clearButton}
          disabled={notifications.length === 0}
        />
        <CustomButton
          title="Configuración avanzada"
          onPress={() => navigation.navigate('NotificationSettings')}
          variant="outline"
          style={styles.settingsButton}
        />
      </View>
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
    paddingTop: 40,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  unreadBadge: {
    backgroundColor: colors.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  markAllButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  markAllText: {
    color: colors.white,
    fontSize: 14,
  },
  filters: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
  },
  filterButtonActive: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.darkGray,
  },
  filterTextActive: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 14,
    color: colors.darkGray,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  notificationCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: 10,
    padding: 15,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationText: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.darkGray,
    lineHeight: 18,
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.darkGray,
  },
  deleteButton: {
    padding: 5,
  },
  settingsSection: {
    backgroundColor: colors.white,
    padding: 20,
    margin: 15,
    borderRadius: 15,
    elevation: 3,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 14,
    color: colors.dark,
    marginLeft: 10,
  },
  actions: {
    flexDirection: 'row',
    padding: 15,
    paddingBottom: 30,
  },
  clearButton: {
    flex: 1,
    marginRight: 10,
  },
  settingsButton: {
    flex: 1,
    marginLeft: 10,
  },
});

export default Notifications;