// Servicios para gestión de clientes (modo simulado)
export const fetchClientStats = async (userId) => {
  // Simular API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        coins: 150,
        attendedClasses: 12,
        activeChallenges: 2,
        membershipDaysLeft: 15,
        streakDays: 5,
        totalChallenges: 8,
        monthlyAttendance: '85%',
      });
    }, 300);
  });
};

export const fetchUpcomingClasses = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Zumba Energético',
          start_time: new Date(Date.now() + 7200000).toISOString(), // 2 horas
          end_time: new Date(Date.now() + 10800000).toISOString(), // 3 horas
          attending: 15,
          capacity: 20,
          coach: 'Coach Ana',
          type: 'zumba',
          location: 'Sala Principal',
          description: 'Clase de Zumba de alta intensidad',
          available: true,
        },
        {
          id: 2,
          name: 'Entrenamiento Funcional',
          start_time: new Date(Date.now() + 86400000).toISOString(), // mañana
          end_time: new Date(Date.now() + 90000000).toISOString(),
          attending: 18,
          capacity: 20,
          coach: 'Coach Carlos',
          type: 'entrenamiento',
          location: 'Sala de Pesas',
          description: 'Ejercicios con peso corporal',
          available: true,
        },
        {
          id: 3,
          name: 'Yoga Restaurativo',
          start_time: new Date(Date.now() + 172800000).toISOString(), // pasado mañana
          end_time: new Date(Date.now() + 176400000).toISOString(),
          attending: 10,
          capacity: 15,
          coach: 'Coach Sofía',
          type: 'yoga',
          location: 'Sala de Yoga',
          description: 'Relajación y estiramientos',
          available: false, // Llena
        },
      ]);
    }, 300);
  });
};

export const fetchClientProfile = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        full_name: 'Ana López',
        email: 'ana@yeyosfitness.com',
        phone: '+52 55 1234 5678',
        membership_type: 'Mensual',
        membership_start: new Date(Date.now() - 15 * 86400000).toISOString(), // 15 días atrás
        membership_end: new Date(Date.now() + 15 * 86400000).toISOString(), // 15 días futuro
        membership_days_left: 15,
        classes_attended: 12,
        coins: 150,
        challenges_completed: 3,
        avatar_url: null,
        join_date: new Date(Date.now() - 90 * 86400000).toISOString(), // 90 días atrás
        medical_info: {
          allergies: 'Penicilina',
          conditions: 'Asma leve',
          medications: 'Inhalador ocasional',
          emergencyContact: 'Juan López - +52 55 8765 4321',
          bloodType: 'O+',
          notes: 'Puede hacer ejercicio moderado sin problemas',
        },
      });
    }, 300);
  });
};

export const updateMedicalInfo = async (userId, medicalData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Información médica actualizada para usuario', userId, ':', medicalData);
      resolve({
        success: true,
        message: 'Información médica actualizada correctamente',
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const updateProfile = async (userId, profileData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Perfil actualizado correctamente',
        updatedFields: Object.keys(profileData),
      });
    }, 500);
  });
};

// Para admin
export const fetchAllClients = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Ana López',
          email: 'ana@email.com',
          membership: 'Mensual',
          status: 'active',
          daysLeft: 15,
          coins: 150,
          lastAttendance: '2024-01-15',
          phone: '+52 55 1234 5678',
        },
        {
          id: 2,
          name: 'Carlos Ruiz',
          email: 'carlos@email.com',
          membership: 'Semanal',
          status: 'expiring',
          daysLeft: 2,
          coins: 45,
          lastAttendance: '2024-01-14',
          phone: '+52 55 2345 6789',
        },
        {
          id: 3,
          name: 'María García',
          email: 'maria@email.com',
          membership: 'Diario',
          status: 'expired',
          daysLeft: 0,
          coins: 18,
          lastAttendance: '2024-01-10',
          phone: '+52 55 3456 7890',
        },
        {
          id: 4,
          name: 'Juan Pérez',
          email: 'juan@email.com',
          membership: 'Mensual',
          status: 'active',
          daysLeft: 25,
          coins: 200,
          lastAttendance: '2024-01-15',
          phone: '+52 55 4567 8901',
        },
        {
          id: 5,
          name: 'Sofía Martínez',
          email: 'sofia@email.com',
          membership: 'Mensual',
          status: 'active',
          daysLeft: 10,
          coins: 85,
          lastAttendance: '2024-01-14',
          phone: '+52 55 5678 9012',
        },
      ]);
    }, 500);
  });
};