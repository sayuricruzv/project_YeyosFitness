// Servicios para gestión de clases
export const fetchAvailableClasses = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Zumba Avanzado',
          description: 'Clase de alta intensidad con ritmos latinos modernos. Perfecta para quemar calorías y mejorar coordinación.',
          start_time: new Date(Date.now() + 3600000).toISOString(), // 1 hora
          end_time: new Date(Date.now() + 7200000).toISOString(), // 2 horas
          attending: 15,
          capacity: 20,
          coach: 'Coach Ana Martínez',
          coach_avatar: 'https://via.placeholder.com/100',
          type: 'zumba',
          location: 'Sala Principal',
          difficulty: 'Intermedio-Avanzado',
          calories: '400-500',
          music: 'Latina',
          requirements: 'Ropa cómoda, tenis, toalla, agua',
          price: 'Incluido en membresía',
          available: true,
        },
        {
          id: 2,
          name: 'Entrenamiento Funcional',
          description: 'Ejercicios con peso corporal, kettlebells y resistencia. Enfoque en fuerza y movilidad.',
          start_time: new Date(Date.now() + 86400000).toISOString(), // mañana
          end_time: new Date(Date.now() + 90000000).toISOString(),
          attending: 18,
          capacity: 20,
          coach: 'Coach Carlos Rodríguez',
          coach_avatar: 'https://via.placeholder.com/100',
          type: 'entrenamiento',
          location: 'Sala de Pesas',
          difficulty: 'Todos los niveles',
          calories: '300-450',
          music: 'Electrónica',
          requirements: 'Guantes opcionales',
          price: 'Incluido en membresía',
          available: true,
        },
        {
          id: 3,
          name: 'Spinning Intenso',
          description: 'Entrenamiento cardiovascular en bicicleta estática. Intervalos de alta intensidad.',
          start_time: new Date(Date.now() + 172800000).toISOString(), // pasado mañana
          end_time: new Date(Date.now() + 176400000).toISOString(),
          attending: 12,
          capacity: 15,
          coach: 'Coach Miguel Torres',
          coach_avatar: 'https://via.placeholder.com/100',
          type: 'spinning',
          location: 'Sala de Spinning',
          difficulty: 'Avanzado',
          calories: '500-600',
          music: 'Rock/Electrónica',
          requirements: 'Toalla, agua, cambio de ropa',
          price: 'Incluido en membresía',
          available: true,
        },
        {
          id: 4,
          name: 'Yoga Restaurativo',
          description: 'Clase suave para reducir estrés, mejorar flexibilidad y recuperación muscular.',
          start_time: new Date(Date.now() + 259200000).toISOString(), // 3 días
          end_time: new Date(Date.now() + 262800000).toISOString(),
          attending: 10,
          capacity: 15,
          coach: 'Coach Sofía Hernández',
          coach_avatar: 'https://via.placeholder.com/100',
          type: 'yoga',
          location: 'Sala de Yoga',
          difficulty: 'Principiante',
          calories: '150-250',
          music: 'Meditación',
          requirements: 'Mat de yoga, ropa cómoda',
          price: 'Incluido en membresía',
          available: false, // Llena
        },
      ]);
    }, 400);
  });
};

export const reserveClass = async (classId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '¡Clase reservada exitosamente!',
        reservationId: 'RES-' + Date.now(),
        classId: classId,
        reservedAt: new Date().toISOString(),
        qrCode: 'demo-qr-code-' + Math.random().toString(36).substr(2, 9),
      });
    }, 800);
  });
};

export const cancelReservation = async (reservationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Reserva cancelada exitosamente',
        reservationId: reservationId,
        cancelledAt: new Date().toISOString(),
      });
    }, 800);
  });
};

export const fetchClassDetails = async (classId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const classes = {
        1: {
          id: 1,
          name: 'Zumba Avanzado',
          description: 'Clase de alta intensidad con ritmos latinos modernos. Coreografías emocionantes y mucho baile.',
          coach: {
            name: 'Ana Martínez',
            bio: 'Instructora certificada con 5 años de experiencia. Especialista en ritmos latinos y entrenamiento cardiovascular.',
            certifications: ['Zumba Basic 1', 'Zumba Toning', 'Aqua Zumba'],
            experience: '5 años',
          },
          schedule: {
            start: new Date(Date.now() + 3600000).toISOString(),
            end: new Date(Date.now() + 7200000).toISOString(),
            duration: '60 minutos',
            day: 'Lunes, Miércoles, Viernes',
          },
          stats: {
            averageRating: 4.8,
            totalSessions: 245,
            popularity: '95%',
            caloriesAvg: 450,
          },
          benefits: [
            'Mejora cardiovascular',
            'Quema hasta 500 calorías',
            'Mejora coordinación',
            'Reduce estrés',
            'Socialización',
          ],
          requirements: [
            'Ropa deportiva cómoda',
            'Tenis para baile',
            'Toalla personal',
            'Agua suficiente',
            'Actitud positiva',
          ],
        },
      };
      
      resolve(classes[classId] || classes[1]);
    }, 300);
  });
};

// Para admin
export const fetchClassAttendance = async (classId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        classId: classId,
        totalCapacity: 20,
        attending: 15,
        waitlist: 3,
        attendanceList: [
          { id: 1, name: 'Ana López', checkedIn: true, time: '17:55' },
          { id: 2, name: 'Carlos Ruiz', checkedIn: true, time: '17:58' },
          { id: 3, name: 'María García', checkedIn: false, time: null },
          { id: 4, name: 'Juan Pérez', checkedIn: true, time: '18:00' },
          { id: 5, name: 'Sofía Martínez', checkedIn: true, time: '17:52' },
        ],
      });
    }, 400);
  });
};