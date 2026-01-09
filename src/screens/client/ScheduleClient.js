import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { fetchAvailableClasses, reserveClass } from '../../services/supabase/classes';
import { colors } from '../../constants/colors';

const ScheduleClient = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const availableClasses = await fetchAvailableClasses();
      setClasses(availableClasses);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las clases');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (classId) => {
    try {
      const result = await reserveClass(classId);
      if (result.success) {
        Alert.alert('Éxito', 'Clase reservada correctamente');
        loadClasses(); // Recargar lista
      } else {
        Alert.alert('Error', result.message || 'No se pudo reservar la clase');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al reservar');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Horarios de Clases</Text>
        <Text style={styles.subtitle}>Reserva tu clase favorita</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Cargando clases...</Text>
          </View>
        ) : classes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color={colors.lightGray} />
            <Text style={styles.emptyText}>No hay clases disponibles</Text>
          </View>
        ) : (
          classes.map((classItem) => (
            <View key={classItem.id} style={styles.classCard}>
              <View style={styles.classHeader}>
                <Text style={styles.className}>{classItem.name}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: classItem.available ? colors.success : colors.error }
                ]}>
                  <Text style={styles.statusText}>
                    {classItem.available ? 'Disponible' : 'Lleno'}
                  </Text>
                </View>
              </View>

              <View style={styles.classDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color={colors.darkGray} />
                  <Text style={styles.detailText}>
                    {new Date(classItem.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    {' - '}
                    {new Date(classItem.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="person-outline" size={16} color={colors.darkGray} />
                  <Text style={styles.detailText}>
                    {classItem.attending}/{classItem.capacity} personas
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="fitness-outline" size={16} color={colors.darkGray} />
                  <Text style={styles.detailText}>Coach: {classItem.coach}</Text>
                </View>
              </View>

              <CustomButton
                title={classItem.available ? "Reservar" : "Lista de espera"}
                onPress={() => handleReserve(classItem.id)}
                disabled={!classItem.available}
                style={styles.reserveButton}
              />
            </View>
          ))
        )}
      </ScrollView>

      <CustomButton
        title="Mis reservas"
        onPress={() => navigation.navigate('MyReservations')}
        variant="outline"
        style={styles.bottomButton}
      />
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    marginTop: 10,
    color: colors.darkGray,
  },
  classCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  classDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: colors.darkGray,
    fontSize: 14,
  },
  reserveButton: {
    marginTop: 5,
  },
  bottomButton: {
    margin: 15,
    marginBottom: 30,
  },
});

export default ScheduleClient;