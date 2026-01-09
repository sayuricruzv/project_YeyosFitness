import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../constants/colors';

const RewardsStore = ({ navigation }) => {
  const [userCoins, setUserCoins] = useState(150); // Simulando monedas del usuario
  const [rewards, setRewards] = useState([
    {
      id: 1,
      name: 'Bebida Energética',
      description: 'Bebida isotónica para después del entrenamiento',
      price: 8,
      image: 'https://via.placeholder.com/100',
      category: 'Bebidas',
      stock: 10,
    },
    {
      id: 2,
      name: 'Clase Gratis',
      description: 'Una clase adicional sin costo',
      price: 20,
      image: 'https://via.placeholder.com/100',
      category: 'Experiencias',
      stock: 5,
    },
    {
      id: 3,
      name: 'Semana Gratis',
      description: 'Acceso ilimitado por una semana',
      price: 30,
      image: 'https://via.placeholder.com/100',
      category: 'Membresías',
      stock: 3,
    },
    {
      id: 4,
      name: 'Toalla de Gym',
      description: 'Toalla deportiva de alta calidad',
      price: 15,
      image: 'https://via.placeholder.com/100',
      category: 'Productos',
      stock: 8,
    },
  ]);

  const categories = ['Todos', 'Bebidas', 'Productos', 'Experiencias', 'Membresías'];
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const handleRedeem = (reward) => {
    if (userCoins < reward.price) {
      Alert.alert('Monedas insuficientes', `Necesitas ${reward.price} monedas. Tienes ${userCoins}.`);
      return;
    }

    Alert.alert(
      'Confirmar Canje',
      `¿Deseas canjear "${reward.name}" por ${reward.price} monedas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Canjear',
          onPress: () => {
            setUserCoins(userCoins - reward.price);
            Alert.alert(
              '¡Éxito!',
              `Has canjeado "${reward.name}". Pasa por recepción para reclamarla.`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const filteredRewards = selectedCategory === 'Todos' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Header con monedas */}
      <View style={styles.header}>
        <View style={styles.coinContainer}>
          <Ionicons name="logo-bitcoin" size={24} color={colors.gold} />
          <Text style={styles.coinText}>{userCoins} monedas</Text>
        </View>
        <Text style={styles.title}>Tienda de Recompensas</Text>
        <Text style={styles.subtitle}>Canjea tus monedas por recompensas</Text>
      </View>

      {/* Categorías */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de recompensas */}
      <ScrollView style={styles.rewardsList} showsVerticalScrollIndicator={false}>
        {filteredRewards.map((reward) => (
          <View key={reward.id} style={styles.rewardCard}>
            <View style={styles.rewardImageContainer}>
              <Image
                source={{ uri: reward.image }}
                style={styles.rewardImage}
                resizeMode="cover"
              />
              {reward.stock < 3 && (
                <View style={styles.lowStockBadge}>
                  <Text style={styles.lowStockText}>¡Últimos {reward.stock}!</Text>
                </View>
              )}
            </View>

            <View style={styles.rewardInfo}>
              <View style={styles.rewardHeader}>
                <Text style={styles.rewardName}>{reward.name}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{reward.category}</Text>
                </View>
              </View>

              <Text style={styles.rewardDescription}>{reward.description}</Text>

              <View style={styles.rewardFooter}>
                <View style={styles.priceContainer}>
                  <Ionicons name="logo-bitcoin" size={18} color={colors.gold} />
                  <Text style={styles.priceText}>{reward.price} monedas</Text>
                </View>

                <Text style={styles.stockText}>
                  {reward.stock > 0 ? `${reward.stock} disponibles` : 'Agotado'}
                </Text>
              </View>

              <CustomButton
                title="Canjear"
                onPress={() => handleRedeem(reward)}
                disabled={userCoins < reward.price || reward.stock === 0}
                style={styles.redeemButton}
                icon="gift"
                iconPosition="left"
              />
            </View>
          </View>
        ))}

        {/* Espacio al final */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Información del canje */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={colors.primary} />
        <Text style={styles.infoText}>
          Las recompensas canjeadas aparecerán en "Recompensas Pendientes" para que el administrador las entregue.
        </Text>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  coinText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.darkGray,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: colors.white,
  },
  rewardsList: {
    flex: 1,
    padding: 15,
  },
  rewardCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    padding: 15,
    elevation: 3,
  },
  rewardImageContainer: {
    position: 'relative',
  },
  rewardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  lowStockBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  lowStockText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  rewardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  rewardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 10,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  rewardDescription: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 10,
    lineHeight: 18,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gold,
  },
  stockText: {
    fontSize: 12,
    color: colors.darkGray,
    fontStyle: 'italic',
  },
  redeemButton: {
    paddingVertical: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '10',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    color: colors.darkGray,
    lineHeight: 16,
  },
});

export default RewardsStore;