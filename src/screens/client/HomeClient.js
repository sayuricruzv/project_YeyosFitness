// src/screens/client/HomeClient.js - COMPLETO CORREGIDO
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

// Componente de imagen seguro con placeholder
const SafeImage = ({ uri, style }) => {
  const [error, setError] = useState(false);
  
  if (error || !uri) {
    return (
      <View style={[style, styles.imagePlaceholder]}>
        <Ionicons name="people" size={40} color="white" />
      </View>
    );
  }
  
  return (
    <Image
      source={{ uri }}
      style={style}
      onError={() => setError(true)}
      defaultSource={require('../../../assets/images/placeholder-image.jpg')}
    />
  );
};

const CommunityCard = ({ item }) => {
  return (
    <TouchableOpacity style={styles.communityCard}>
      <View style={styles.communityImageContainer}>
        <SafeImage 
          uri={item.image} 
          style={styles.communityImage}
        />
        <View style={styles.communityOverlay}>
          <View style={styles.communityBadge}>
            <Ionicons name="flame" size={12} color={colors.white} />
            <Text style={styles.communityBadgeText}>Trending</Text>
          </View>
        </View>
      </View>
      <View style={styles.communityContent}>
        <Text style={styles.communityTitle}>{item.title}</Text>
        <Text style={styles.communityDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.communityStats}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={14} color={colors.darkGray} />
            <Text style={styles.statText}>{item.members}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={14} color={colors.darkGray} />
            <Text style={styles.statText}>{item.posts}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HomeClient = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  
  const communityData = [
    {
      id: '1',
      title: 'Reto 30 Días Fitness',
      description: 'Únete a nuestro reto de transformación en 30 días',
      members: '245',
      posts: '1.2k',
      image: 'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=400',
    },
    {
      id: '2',
      title: 'Grupo de Yoga Matutino',
      description: 'Comienza tu día con energía y paz mental',
      members: '189',
      posts: '856',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    },
    {
      id: '3',
      title: 'CrossFit Warriors',
      description: 'Para los amantes del alto rendimiento',
      members: '312',
      posts: '2.1k',
      image: 'https://images.unsplash.com/photo-1534367507877-0edd93bd013b?w=400',
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola, Cliente!</Text>
            <Text style={styles.subtitle}>Bienvenido a tu comunidad fitness</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={40} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Sección de comunidad */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Comunidad Activa</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.communityScroll}
          >
            {communityData.map((item) => (
              <CommunityCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* Sección de próximas clases */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximas Clases</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver calendario</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.classesContainer}>
            {[1, 2, 3].map((item) => (
              <TouchableOpacity key={item} style={styles.classCard}>
                <View style={styles.classTime}>
                  <Text style={styles.classHour}>09:00</Text>
                  <Text style={styles.classAmPm}>AM</Text>
                </View>
                <View style={styles.classInfo}>
                  <Text style={styles.className}>Yoga Matutino</Text>
                  <Text style={styles.classTrainer}>Con Ana Pérez</Text>
                  <View style={styles.classDetails}>
                    <Ionicons name="time" size={12} color={colors.darkGray} />
                    <Text style={styles.classDetailText}>60 min</Text>
                    <Ionicons name="people" size={12} color={colors.darkGray} style={styles.classDetailIcon} />
                    <Text style={styles.classDetailText}>12/20</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.classAction}>
                  <Ionicons name="calendar" size={20} color={colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sección de retos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Retos Activos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.challengeCard}>
            <LinearGradient
              colors={['#E4004B', '#FF6B35']}
              style={styles.challengeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.challengeContent}>
                <View>
                  <Text style={styles.challengeTitle}>Reto Mensual</Text>
                  <Text style={styles.challengeSubtitle}>15 clases en 30 días</Text>
                </View>
                <View style={styles.challengeProgress}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '60%' }]} />
                  </View>
                  <Text style={styles.progressText}>9/15 clases</Text>
                </View>
              </View>
              <Ionicons name="trophy" size={40} color="rgba(255,255,255,0.3)" />
            </LinearGradient>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  subtitle: {
    fontSize: 14,
    color: colors.darkGray,
    marginTop: 4,
  },
  profileButton: {
    padding: 5,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  communityScroll: {
    marginHorizontal: -5,
  },
  communityCard: {
    width: width * 0.7,
    marginRight: 15,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  communityImageContainer: {
    position: 'relative',
    height: 140,
  },
  communityImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  communityOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  communityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(228, 0, 75, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  communityBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  communityContent: {
    padding: 15,
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  communityDescription: {
    fontSize: 13,
    color: colors.darkGray,
    lineHeight: 18,
    marginBottom: 10,
  },
  communityStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: colors.darkGray,
    marginLeft: 5,
  },
  classesContainer: {
    gap: 12,
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  classTime: {
    alignItems: 'center',
    marginRight: 15,
    minWidth: 50,
  },
  classHour: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  classAmPm: {
    fontSize: 12,
    color: colors.darkGray,
    marginTop: 2,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 2,
  },
  classTrainer: {
    fontSize: 13,
    color: colors.darkGray,
    marginBottom: 6,
  },
  classDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classDetailText: {
    fontSize: 12,
    color: colors.darkGray,
    marginLeft: 4,
    marginRight: 12,
  },
  classDetailIcon: {
    marginLeft: 12,
  },
  classAction: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.lightGray + '30',
  },
  challengeCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  challengeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  challengeSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  challengeProgress: {
    marginTop: 15,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
});

export default HomeClient;