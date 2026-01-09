import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const ClassCard = ({ classItem, onPress, showStatus = true }) => {
  const getClassColor = (type) => {
    const colorsMap = {
      'zumba': colors.secondary,
      'entrenamiento': colors.primary,
      'funcional': colors.success,
      'spinning': colors.warning,
    };
    return colorsMap[type] || colors.primary;
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.typeIndicator, { backgroundColor: getClassColor(classItem.type) }]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{classItem.name}</Text>
          {showStatus && (
            <View style={[
              styles.statusBadge,
              { backgroundColor: classItem.available ? colors.success + '20' : colors.error + '20' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: classItem.available ? colors.success : colors.error }
              ]}>
                {classItem.available ? 'Disponible' : 'Lleno'}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={colors.darkGray} />
            <Text style={styles.detailText}>
              {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={16} color={colors.darkGray} />
            <Text style={styles.detailText}>
              {classItem.attending}/{classItem.capacity} cupos
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="fitness-outline" size={16} color={colors.darkGray} />
            <Text style={styles.detailText}>{classItem.coach}</Text>
          </View>
        </View>
        
        {classItem.description && (
          <Text style={styles.description} numberOfLines={2}>
            {classItem.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  typeIndicator: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.darkGray,
  },
  description: {
    fontSize: 13,
    color: colors.darkGray,
    lineHeight: 18,
  },
});

export default ClassCard;