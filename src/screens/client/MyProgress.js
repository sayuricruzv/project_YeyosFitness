// src/screens/client/MyProgress.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const MyProgress = ({ navigation }) => {
  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.white]}
      style={styles.container}
    >
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.dark} />
          </TouchableOpacity>
          <Text style={styles.title}>Mi Progreso</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Contenido */}
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Estadísticas Generales</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Clases Totales</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>85%</Text>
                <Text style={styles.statLabel}>Asistencia</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>30</Text>
                <Text style={styles.statLabel}>Días Activo</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>150</Text>
                <Text style={styles.statLabel}>Monedas</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📈 Progreso Mensual</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.placeholderText}>Gráfico de progreso</Text>
              <View style={styles.barChart}>
                {[40, 60, 80, 70, 90, 85, 95].map((height, index) => (
                  <View
                    key={index}
                    style={[
                      styles.bar,
                      { height: height, backgroundColor: colors.primary }
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎯 Metas</Text>
            {[
              { title: '4 clases por semana', progress: 75, current: 3, total: 4 },
              { title: 'Perder 5kg este mes', progress: 40, current: 2, total: 5 },
              { title: '30 minutos diarios', progress: 60, current: 18, total: 30 }
            ].map((goal, index) => (
              <View key={index} style={styles.goalItem}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalProgress}>{goal.current}/{goal.total}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${goal.progress}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{goal.progress}% completado</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🏆 Logros</Text>
            <View style={styles.achievements}>
              {[
                { icon: '🏃', title: 'Primera Clase', date: '15/01/2024' },
                { icon: '🔥', title: 'Racha 7 días', date: '22/01/2024' },
                { icon: '⭐', title: 'Clase Perfecta', date: '25/01/2024' },
                { icon: '💪', title: 'Nivel 5', date: '30/01/2024' }
              ].map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDate}>{achievement.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.darkGray,
    marginTop: 5,
    textAlign: 'center',
  },
  chartPlaceholder: {
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    color: colors.darkGray,
    marginBottom: 20,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    justifyContent: 'space-around',
    width: '100%',
  },
  bar: {
    width: 30,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  goalItem: {
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 16,
    color: colors.dark,
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.darkGray,
  },
  achievements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  achievementDate: {
    fontSize: 12,
    color: colors.darkGray,
    marginTop: 2,
  },
});

export default MyProgress;