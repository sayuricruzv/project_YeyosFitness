import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const EmergencyView = ({ route, navigation }) => {
  const { clientId } = route.params || {};
  
  const clientInfo = {
    id: clientId || 1,
    name: 'Ana López',
    phone: '+52 55 1234 5678',
    emergencyContact: 'Juan López - +52 55 8765 4321',
    medicalInfo: {
      allergies: 'Ninguna',
      conditions: 'Asma leve',
      medications: 'Inhalador salbutamol (uso ocasional)',
      bloodType: 'O+',
      notes: 'Puede realizar ejercicio moderado sin problemas. Evitar esfuerzos extremos prolongados.',
    },
  };

  const handleEmergencyCall = () => {
    // Aquí iría la lógica para llamar al contacto de emergencia
    alert(`Llamando a: ${clientInfo.emergencyContact.split(' - ')[1]}`);
  };

  const handle911 = () => {
    // Lógica para llamar al 911 o emergencias locales
    alert('Llamando a servicios de emergencia (911)');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con botón de emergencia */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Información Médica</Text>
          <Ionicons name="medical" size={24} color={colors.white} />
        </View>
        
        <Text style={styles.clientName}>{clientInfo.name}</Text>
        <Text style={styles.subtitle}>Información crítica en caso de emergencia</Text>
      </View>

      {/* Alertas importantes */}
      <View style={styles.warningCard}>
        <Ionicons name="warning" size={30} color={colors.error} />
        <Text style={styles.warningTitle}>¡ESTA ES INFORMACIÓN CRÍTICA!</Text>
        <Text style={styles.warningText}>
          Solo usar en caso de emergencia médica real
        </Text>
      </View>

      {/* Contacto de emergencia */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="call" size={24} color={colors.error} />
          <Text style={styles.sectionTitle}>Contacto de Emergencia</Text>
        </View>
        
        <View style={styles.contactCard}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>
              {clientInfo.emergencyContact.split(' - ')[0]}
            </Text>
            <Text style={styles.contactPhone}>
              {clientInfo.emergencyContact.split(' - ')[1]}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={handleEmergencyCall}
          >
            <Ionicons name="call" size={24} color={colors.white} />
            <Text style={styles.callButtonText}>Llamar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Información médica */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="medical" size={24} color={colors.primary} />
          <Text style={styles.sectionTitle}>Información Médica</Text>
        </View>
        
        <View style={styles.medicalGrid}>
          <View style={styles.medicalItem}>
            <Text style={styles.medicalLabel}>Alergias</Text>
            <Text style={styles.medicalValue}>{clientInfo.medicalInfo.allergies}</Text>
          </View>
          
          <View style={styles.medicalItem}>
            <Text style={styles.medicalLabel}>Condiciones</Text>
            <Text style={styles.medicalValue}>{clientInfo.medicalInfo.conditions}</Text>
          </View>
          
          <View style={styles.medicalItem}>
            <Text style={styles.medicalLabel}>Medicamentos</Text>
            <Text style={styles.medicalValue}>{clientInfo.medicalInfo.medications}</Text>
          </View>
          
          <View style={styles.medicalItem}>
            <Text style={styles.medicalLabel}>Tipo de Sangre</Text>
            <Text style={styles.medicalValue}>{clientInfo.medicalInfo.bloodType}</Text>
          </View>
        </View>
        
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>Notas Adicionales:</Text>
          <Text style={styles.notesText}>{clientInfo.medicalInfo.notes}</Text>
        </View>
      </View>

      {/* Botones de acción de emergencia */}
      <View style={styles.emergencyActions}>
        <TouchableOpacity 
          style={[styles.emergencyButton, { backgroundColor: colors.error }]}
          onPress={handle911}
        >
          <Ionicons name="medkit" size={24} color={colors.white} />
          <Text style={styles.emergencyButtonText}>LLAMAR 911</Text>
          <Text style={styles.emergencySubtext}>Servicios de emergencia</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.emergencyButton, { backgroundColor: colors.warning }]}
          onPress={() => navigation.navigate('FirstAid')}
        >
          <Ionicons name="bandage" size={24} color={colors.white} />
          <Text style={styles.emergencyButtonText}>PRIMEROS AUXILIOS</Text>
          <Text style={styles.emergencySubtext}>Guía paso a paso</Text>
        </TouchableOpacity>
      </View>

      {/* Protocolo de emergencia */}
      <View style={styles.protocolSection}>
        <Text style={styles.protocolTitle}>Protocolo en Caso de Emergencia:</Text>
        
        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>Verificar si la persona está consciente y respirando</Text>
        </View>
        
        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>Llamar inmediatamente al contacto de emergencia</Text>
        </View>
        
        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>Si no hay respuesta, llamar al 911</Text>
        </View>
        
        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <Text style={styles.stepText}>Proporcionar esta información médica al personal de emergencia</Text>
        </View>
        
        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>5</Text>
          </View>
          <Text style={styles.stepText}>No mover a la persona a menos que haya peligro inminente</Text>
        </View>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.error,
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  clientName: {
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
  warningCard: {
    backgroundColor: colors.error + '20',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.error,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.error,
    marginTop: 10,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    color: colors.dark,
    textAlign: 'center',
    marginTop: 5,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    margin: 20,
    marginVertical: 10,
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
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 10,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  contactPhone: {
    fontSize: 16,
    color: colors.darkGray,
    marginTop: 5,
  },
  callButton: {
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 15,
  },
  callButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  medicalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  medicalItem: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  medicalLabel: {
    fontSize: 12,
    color: colors.darkGray,
    marginBottom: 5,
    fontWeight: '600',
  },
  medicalValue: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: '600',
  },
  notesCard: {
    backgroundColor: colors.primary + '10',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
  },
  emergencyActions: {
    padding: 20,
  },
  emergencyButton: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 5,
  },
  emergencyButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  emergencySubtext: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.9,
    marginTop: 5,
  },
  protocolSection: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    margin: 20,
    marginTop: 0,
    elevation: 3,
  },
  protocolTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 15,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
  },
});

export default EmergencyView;