import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../constants/colors';

const ClassDetails = ({ route, navigation }) => {
  const { classId } = route.params || {};
  
  // Datos simulados de la clase
  const [classDetails, setClassDetails] = useState({
    id: classId || 1,
    name: 'Zumba Avanzado',
    type: 'zumba',
    description: 'Clase de Zumba de alta intensidad con coreografías modernas. Perfecta para quemar calorías y mejorar la coordinación.',
    coach: 'Coach Ana Martínez',
    coachAvatar: 'https://via.placeholder.com/100',
    coachBio: 'Instructora certificada con 5 años de experiencia. Especialista en ritmos latinos y entrenamiento cardiovascular.',
    start_time: '2024-01-16T18:00:00',
    end_time: '2024-01-16T19:00:00',
    capacity: 20,
    attending: 15,
    available: true,
    location: 'Sala Principal',
    difficulty: 'Intermedio',
    calories: '400-500',
    music: 'Latina',
    requirements: 'Ropa cómoda, tenis, toalla y agua',
    price: 'Incluido en membresía',
    isBooked: false,
  });

  const [loading, setLoading] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener detalles de la clase
    // fetchClassDetails(classId);
  }, []);

  const handleBooking = () => {
    setLoading(true);
    
    // Simular reserva
    setTimeout(() => {
      setLoading(false);
      setClassDetails({ ...classDetails, isBooked: true, attending: classDetails.attending + 1 });
      
      Alert.alert(
        '¡Reserva Confirmada!',
        `Has reservado tu lugar en "${classDetails.name}"`,
        [
          { 
            text: 'Ver mis reservas',
            onPress: () => navigation.navigate('MyReservations'),
          },
          { 
            text: 'OK', 
            style: 'default' 
          },
        ]
      );
    }, 1500);
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro de que quieres cancelar tu reserva?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => {
            setClassDetails({ ...classDetails, isBooked: false, attending: classDetails.attending - 1 });
            Alert.alert('Reserva cancelada', 'Tu lugar ha sido liberado');
          },
        },
      ]
    );
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (time) => {
    return new Date(time).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const classTime = new Date(classDetails.start_time);
    const diffMs = classTime - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 0) return 'Clase ya pasada';
    if (diffHours < 1) return '¡Comienza pronto!';
    if (diffHours < 24) return `En ${diffHours} horas`;
    return `En ${Math.floor(diffHours / 24)} días`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con imagen */}
      <View style={styles.header}>
        <View style={styles.classTypeBadge}>
          <Text style={styles.classTypeText}>{classDetails.type.toUpperCase()}</Text>
        </View>
        
        <Text style={styles.className}>{classDetails.name}</Text>
        <Text style={styles.classTime}>
          {formatDate(classDetails.start_time)} • {formatTime(classDetails.start_time)} - {formatTime(classDetails.end_time)}
        </Text>
        
        <View style={styles.timeRemaining}>
          <Ionicons name="time" size={16} color={colors.white} />
          <Text style={styles.timeRemainingText}>{getTimeRemaining()}</Text>
        </View>
      </View>

      {/* Información principal */}
      <View style={styles.infoSection}>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Ionicons name="people" size={20} color={colors.primary} />
            <Text style={styles.infoLabel}>Cupos</Text>
            <Text style={styles.infoValue}>
              {classDetails.attending}/{classDetails.capacity}
            </Text>
            <View style={styles.capacityBar}>
              <View 
                style={[
                  styles.capacityFill, 
                  { width: `${(classDetails.attending / classDetails.capacity) * 100}%` }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="barbell" size={20} color={colors.primary} />
            <Text style={styles.infoLabel}>Dificultad</Text>
            <Text style={styles.infoValue}>{classDetails.difficulty}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="flame" size={20} color={colors.primary} />
            <Text style={styles.infoLabel}>Calorías</Text>
            <Text style={styles.infoValue}>{classDetails.calories}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="musical-notes" size={20} color={colors.primary} />
            <Text style={styles.infoLabel}>Música</Text>
            <Text style={styles.infoValue}>{classDetails.music}</Text>
          </View>
        </View>
      </View>

      {/* Coach */}
      <View style={styles.coachSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person-circle" size={24} color={colors.secondary} />
          <Text style={styles.sectionTitle}>Instructor</Text>
        </View>
        
        <View style={styles.coachCard}>
          <Image
            source={{ uri: classDetails.coachAvatar }}
            style={styles.coachAvatar}
          />
          <View style={styles.coachInfo}>
            <Text style={styles.coachName}>{classDetails.coach}</Text>
            <Text style={styles.coachBio}>{classDetails.coachBio}</Text>
          </View>
        </View>
      </View>

      {/* Descripción */}
      <View style={styles.descriptionSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text" size={24} color={colors.darkGray} />
          <Text style={styles.sectionTitle}>Descripción</Text>
        </View>
        
        <Text style={styles.descriptionText}>{classDetails.description}</Text>
        
        {showMoreInfo && (
          <>
            <View style={styles.detailItem}>
              <Ionicons name="location" size={16} color={colors.darkGray} />
              <Text style={styles.detailText}>{classDetails.location}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="warning" size={16} color={colors.darkGray} />
              <Text style={styles.detailText}>{classDetails.requirements}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="cash" size={16} color={colors.darkGray} />
              <Text style={styles.detailText}>{classDetails.price}</Text>
            </View>
          </>
        )}
        
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => setShowMoreInfo(!showMoreInfo)}
        >
          <Text style={styles.showMoreText}>
            {showMoreInfo ? 'Mostrar menos' : 'Mostrar más detalles'}
          </Text>
          <Ionicons
            name={showMoreInfo ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Beneficios */}
      <View style={styles.benefitsSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          <Text style={styles.sectionTitle}>Beneficios</Text>
        </View>
        
        <View style={styles.benefitsGrid}>
          <View style={styles.benefitItem}>
            <Ionicons name="heart" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Mejora cardiovascular</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="fitness" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Quema calorías</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="happy" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Reduce estrés</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="people" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Socialización</Text>
          </View>
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.actionsSection}>
        {classDetails.isBooked ? (
          <>
            <CustomButton
              title="Cancelar Reserva"
              onPress={handleCancelBooking}
              variant="error"
              icon="close-circle"
              style={styles.actionButton}
            />
            <Text style={styles.bookedText}>
              ✅ Tienes un lugar reservado
            </Text>
            <Text style={styles.reminderText}>
              Recuerda llegar 10 minutos antes
            </Text>
          </>
        ) : (
          <CustomButton
            title={classDetails.available ? "Reservar Mi Lugar" : "Lista de Espera"}
            onPress={handleBooking}
            loading={loading}
            disabled={!classDetails.available}
            icon="calendar"
            style={styles.actionButton}
          />
        )}
        
        <View style={styles.shareContainer}>
          <Text style={styles.shareText}>Compartir esta clase:</Text>
          <View style={styles.shareButtons}>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="logo-whatsapp" size={24} color={colors.success} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="logo-facebook" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="send" size={24} color={colors.secondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  classTypeBadge: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  classTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  className: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 5,
  },
  classTime: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 15,
    textAlign: 'center',
  },
  timeRemaining: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timeRemainingText: {
    color: colors.white,
    marginLeft: 5,
    fontSize: 14,
  },
  infoSection: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    margin: 15,
    marginTop: -20,
    elevation: 5,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.darkGray,
    marginTop: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 2,
  },
  capacityBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 2,
    marginTop: 5,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  coachSection: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    margin: 15,
    marginTop: 0,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginLeft: 10,
  },
  coachCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coachAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  coachInfo: {
    flex: 1,
    marginLeft: 15,
  },
  coachName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  coachBio: {
    fontSize: 14,
    color: colors.darkGray,
    lineHeight: 18,
  },
  descriptionSection: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    margin: 15,
    marginTop: 0,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 22,
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.darkGray,
    flex: 1,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  showMoreText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  benefitsSection: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    margin: 15,
    marginTop: 0,
    elevation: 3,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  benefitItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.dark,
    flex: 1,
  },
  actionsSection: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    margin: 15,
    marginTop: 0,
    elevation: 3,
    alignItems: 'center',
  },
  actionButton: {
    width: '100%',
    marginBottom: 15,
  },
  bookedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: 5,
  },
  reminderText: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 20,
  },
  shareContainer: {
    width: '100%',
    alignItems: 'center',
  },
  shareText: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 10,
  },
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shareButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
});

export default ClassDetails;