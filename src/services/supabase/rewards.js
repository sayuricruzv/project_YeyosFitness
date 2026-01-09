// Servicios para sistema de recompensas
export const fetchRewardsCatalog = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Bebida Energética',
          description: 'Bebida isotónica para recuperación post-entrenamiento',
          price: 8,
          image: 'https://via.placeholder.com/150x150/FFD166/000?text=Bebida',
          category: 'Bebidas',
          stock: 10,
          popular: true,
          requiresPickup: true,
          pickupLocation: 'Recepción',
        },
        {
          id: 2,
          name: 'Clase Gratis',
          description: 'Una clase adicional sin costo en cualquier horario',
          price: 20,
          image: 'https://via.placeholder.com/150x150/4CC9F0/000?text=Clase',
          category: 'Experiencias',
          stock: 5,
          popular: true,
          requiresPickup: false,
          validFor: '1 mes',
        },
        {
          id: 3,
          name: 'Semana Gratis',
          description: 'Acceso ilimitado por una semana completa',
          price: 30,
          image: 'https://via.placeholder.com/150x150/7209B7/FFF?text=Semana',
          category: 'Membresías',
          stock: 3,
          popular: false,
          requiresPickup: true,
          pickupLocation: 'Administración',
        },
        {
          id: 4,
          name: 'Toalla de Gym',
          description: 'Toalla deportiva de microfibra de alta calidad',
          price: 15,
          image: 'https://via.placeholder.com/150x150/F72585/FFF?text=Toalla',
          category: 'Productos',
          stock: 8,
          popular: true,
          requiresPickup: true,
          pickupLocation: 'Recepción',
        },
        {
          id: 5,
          name: 'Smoothie Proteico',
          description: 'Batido de proteína personalizado',
          price: 12,
          image: 'https://via.placeholder.com/150x150/4361EE/FFF?text=Smoothie',
          category: 'Bebidas',
          stock: 15,
          popular: false,
          requiresPickup: true,
          pickupLocation: 'Bar de Smoothies',
        },
        {
          id: 6,
          name: 'Sesión Personalizada',
          description: '30 minutos de entrenamiento personal con coach',
          price: 25,
          image: 'https://via.placeholder.com/150x150/F8961E/000?text=Sesión',
          category: 'Experiencias',
          stock: 4,
          popular: false,
          requiresPickup: false,
          validFor: '2 semanas',
        },
      ]);
    }, 400);
  });
};

export const redeemReward = async (rewardId, userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '¡Recompensa canjeada exitosamente!',
        redemptionCode: 'RED-' + Date.now(),
        rewardId: rewardId,
        redeemedAt: new Date().toISOString(),
        pickupInstructions: 'Pasa por recepción con este código',
        expiresIn: 5, // días para reclamar
      });
    }, 800);
  });
};

export const fetchUserRewards = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalCoins: 150,
        pendingRewards: [
          {
            id: 101,
            rewardId: 1,
            rewardName: 'Bebida Energética',
            redeemedAt: '2024-01-10T14:30:00',
            status: 'pending',
            pickupCode: 'PICK-12345',
            expiresAt: '2024-01-15T23:59:59',
          },
          {
            id: 102,
            rewardId: 4,
            rewardName: 'Toalla de Gym',
            redeemedAt: '2024-01-12T10:15:00',
            status: 'pending',
            pickupCode: 'PICK-12346',
            expiresAt: '2024-01-17T23:59:59',
          },
        ],
        redeemedHistory: [
          {
            id: 100,
            rewardId: 2,
            rewardName: 'Clase Gratis',
            redeemedAt: '2023-12-20T16:45:00',
            status: 'claimed',
            claimedAt: '2023-12-22T18:30:00',
          },
        ],
      });
    }, 400);
  });
};

// Para admin
export const fetchPendingRedemptions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 101,
          clientId: 1,
          clientName: 'Ana López',
          rewardId: 1,
          rewardName: 'Bebida Energética',
          redeemedAt: '2024-01-10T14:30:00',
          pickupCode: 'PICK-12345',
          expiresAt: '2024-01-15T23:59:59',
          status: 'pending',
        },
        {
          id: 102,
          clientId: 2,
          clientName: 'Carlos Ruiz',
          rewardId: 4,
          rewardName: 'Toalla de Gym',
          redeemedAt: '2024-01-12T10:15:00',
          pickupCode: 'PICK-12346',
          expiresAt: '2024-01-17T23:59:59',
          status: 'pending',
        },
        {
          id: 103,
          clientId: 4,
          clientName: 'Juan Pérez',
          rewardId: 5,
          rewardName: 'Smoothie Proteico',
          redeemedAt: '2024-01-13T09:20:00',
          pickupCode: 'PICK-12347',
          expiresAt: '2024-01-18T23:59:59',
          status: 'pending',
        },
      ]);
    }, 400);
  });
};

export const markRewardAsClaimed = async (redemptionId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Recompensa marcada como entregada',
        redemptionId: redemptionId,
        claimedAt: new Date().toISOString(),
        claimedBy: 'Admin Yeyos',
      });
    }, 500);
  });
};