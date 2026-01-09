// Servicios para gestión de membresías
export const fetchMembershipInfo = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        type: 'Mensual',
        start_date: new Date(Date.now() - 15 * 86400000).toISOString(), // 15 días atrás
        end_date: new Date(Date.now() + 15 * 86400000).toISOString(), // 15 días futuro
        status: 'active',
        days_remaining: 15,
        price: 499.00,
        payment_method: 'Efectivo',
        auto_renew: false,
        history: [
          {
            date: '2023-12-01',
            type: 'Mensual',
            amount: 499.00,
            status: 'paid',
          },
          {
            date: '2023-11-01',
            type: 'Mensual',
            amount: 499.00,
            status: 'paid',
          },
          {
            date: '2023-10-01',
            type: 'Mensual',
            amount: 499.00,
            status: 'paid',
          },
        ],
      });
    }, 300);
  });
};

export const updateMembership = async (userId, membershipType) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const prices = {
        'Día': 50.00,
        'Semana': 150.00,
        'Mes': 499.00,
        'Trimestre': 1350.00,
        'Anual': 4800.00,
      };
      
      resolve({
        success: true,
        message: `Membresía actualizada a: ${membershipType}`,
        new_end_date: calculateNewEndDate(membershipType),
        amount: prices[membershipType] || 0,
        next_payment: new Date(Date.now() + 30 * 86400000).toISOString(),
      });
    }, 800);
  });
};

export const cancelMembership = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Membresía cancelada exitosamente',
        cancellation_date: new Date().toISOString(),
        refund_amount: 0, // No hay reembolso por política
        access_until: new Date(Date.now() + 15 * 86400000).toISOString(), // Acceso hasta fin del periodo
      });
    }, 800);
  });
};

const calculateNewEndDate = (membershipType) => {
  const now = new Date();
  let daysToAdd = 30; // Por defecto mensual
  
  const durations = {
    'Día': 1,
    'Semana': 7,
    'Mes': 30,
    'Trimestre': 90,
    'Anual': 365,
  };
  
  daysToAdd = durations[membershipType] || 30;
  
  return new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
};

// Para admin
export const fetchAllMemberships = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          clientId: 1,
          clientName: 'Ana López',
          type: 'Mensual',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'active',
          daysLeft: 15,
          paymentStatus: 'paid',
          amount: 499.00,
        },
        {
          id: 2,
          clientId: 2,
          clientName: 'Carlos Ruiz',
          type: 'Semanal',
          startDate: '2024-01-08',
          endDate: '2024-01-15',
          status: 'expiring',
          daysLeft: 2,
          paymentStatus: 'pending',
          amount: 150.00,
        },
        {
          id: 3,
          clientId: 3,
          clientName: 'María García',
          type: 'Diario',
          startDate: '2024-01-15',
          endDate: '2024-01-16',
          status: 'expired',
          daysLeft: 0,
          paymentStatus: 'paid',
          amount: 50.00,
        },
        {
          id: 4,
          clientId: 4,
          clientName: 'Juan Pérez',
          type: 'Mensual',
          startDate: '2023-12-20',
          endDate: '2024-01-20',
          status: 'active',
          daysLeft: 5,
          paymentStatus: 'paid',
          amount: 499.00,
        },
        {
          id: 5,
          clientId: 5,
          clientName: 'Sofía Martínez',
          type: 'Trimestral',
          startDate: '2023-11-01',
          endDate: '2024-01-31',
          status: 'active',
          daysLeft: 16,
          paymentStatus: 'paid',
          amount: 1350.00,
        },
      ]);
    }, 500);
  });
};