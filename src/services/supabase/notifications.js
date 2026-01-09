// Servicios para notificaciones
export const fetchUserNotifications = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          type: 'class',
          title: 'Recordatorio de clase',
          message: 'Tienes clase de Zumba a las 18:00 hoy',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
          read: false,
          icon: 'calendar',
          color: 'primary',
          action: { type: 'view_class', classId: 1 },
        },
        {
          id: 2,
          type: 'payment',
          title: 'Recordatorio de pago',
          message: 'Tu membresía vence mañana. ¡Renueva ahora!',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
          read: false,
          icon: 'card',
          color: 'warning',
          action: { type: 'renew_membership' },
        },
        {
          id: 3,
          type: 'achievement',
          title: '¡Logro desbloqueado!',
          message: 'Completaste el reto "Asistencia Semanal"',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 días atrás
          read: true,
          icon: 'trophy',
          color: 'gold',
          action: { type: 'view_achievements' },
        },
        {
          id: 4,
          type: 'reward',
          title: 'Recompensa disponible',
          message: 'Puedes reclamar tu bebida energética en recepción',
          timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 días atrás
          read: true,
          icon: 'gift',
          color: 'secondary',
          action: { type: 'view_rewards' },
        },
        {
          id: 5,
          type: 'system',
          title: 'Mantenimiento programado',
          message: 'El gimnasio cerrará a las 20:00 el viernes por mantenimiento',
          timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 días atrás
          read: true,
          icon: 'construct',
          color: 'darkGray',
          action: null,
        },
        {
          id: 6,
          type: 'social',
          title: 'Nuevo video en el muro',
          message: 'Coach Carlos subió un nuevo video de entrenamiento',
          timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 días atrás
          read: true,
          icon: 'videocam',
          color: 'success',
          action: { type: 'view_social' },
        },
      ]);
    }, 300);
  });
};

export const markNotificationAsRead = async (notificationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Notificación marcada como leída',
        notificationId: notificationId,
      });
    }, 300);
  });
};

export const markAllNotificationsAsRead = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Todas las notificaciones marcadas como leídas',
        count: 6,
      });
    }, 500);
  });
};

export const sendClassReminder = async (classId, hoursBefore = 2) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Recordatorio programado para ${hoursBefore} horas antes de la clase`,
        classId: classId,
        scheduledFor: new Date(Date.now() + (hoursBefore * 3600000)).toISOString(),
      });
    }, 500);
  });
};

export const sendMembershipReminder = async (userId, daysBefore = 3) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Recordatorio de membresía enviado`,
        userId: userId,
        daysBefore: daysBefore,
      });
    }, 500);
  });
};