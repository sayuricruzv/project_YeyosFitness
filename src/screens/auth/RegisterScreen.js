// src/screens/auth/RegisterScreen.js - VERSIÓN COMPLETA CORREGIDA
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/colors';

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Términos y condiciones
  const [terms, setTerms] = useState({
    recording: false,
    dataSharing: false,
    medicalData: false,
    marketing: false,
  });

  const { signUpClient } = useAuth();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'Mínimo 2 caracteres';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Mínimo 2 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        newErrors.phone = 'Teléfono inválido (mínimo 10 dígitos)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    } else if (formData.password.length > 20) {
      newErrors.password = 'Máximo 20 caracteres';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    // Validar términos obligatorios
    if (!terms.recording || !terms.dataSharing || !terms.medicalData) {
      newErrors.terms = 'Debes aceptar todos los términos obligatorios (*)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      console.log('📤 Iniciando registro REAL...');
      
      // Validación final
      if (!validateStep1() || !validateStep2()) {
        Alert.alert('Error', 'Por favor completa todos los campos correctamente');
        setLoading(false);
        return;
      }

      // Preparar datos para registro
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone.replace(/\D/g, ''), // Solo números
      };

      console.log('📤 Enviando datos REALES a Supabase...');
      
      const result = await signUpClient(userData);
      
      if (result.success) {
        console.log('✅ Registro REAL exitoso');
        
        Alert.alert(
          '🎉 ¡Registro Exitoso!',
          '¡Bienvenido a Yeyos Fitness! Por favor verifica tu email.',
          [
            {
              text: 'Continuar',
              onPress: () => {
                // Navegar al login para que inicie sesión después de verificar email
                navigation.navigate('Login', {
                  email: formData.email,
                  message: 'Por favor verifica tu email y luego inicia sesión'
                });
              }
            }
          ]
        );
      }
      
    } catch (error) {
      console.error('❌ Error REAL en registro:', error);
      
      let errorMessage = 'Error al crear la cuenta. ';
      
      if (error.message.includes('User already registered') || 
          error.message.includes('already registered') ||
          error.message.includes('user_already_exists')) {
        errorMessage = 'Este email ya está registrado. ';
        
        Alert.alert('Cuenta Existente', errorMessage, [
          { text: 'Iniciar Sesión', onPress: () => navigation.navigate('Login', { email: formData.email }) },
          { text: 'Intentar otro email', style: 'cancel' }
        ]);
        
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
        
        Alert.alert('Contraseña Inválida', errorMessage, [{ text: 'OK' }]);
        setStep(2);
        
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Email inválido. Por favor ingresa un email válido.';
        
        Alert.alert('Email Inválido', errorMessage, [{ text: 'OK' }]);
        setStep(1);
        
      } else if (error.message.includes('Network request failed') || 
                 error.message.includes('fetch')) {
        errorMessage = 'Problemas de conexión. Verifica tu conexión a internet.';
        
        Alert.alert('Error de Conexión', errorMessage, [{ text: 'OK' }]);
        
      } else {
        errorMessage = `Error: ${error.message || 'Error desconocido'}`;
        
        Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (text) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0,3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0,3)}) ${numbers.slice(3,6)}-${numbers.slice(6,10)}`;
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((stepNumber) => (
        <View key={stepNumber} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            step >= stepNumber ? styles.stepCircleActive : styles.stepCircleInactive
          ]}>
            <Text style={[
              styles.stepNumber,
              step >= stepNumber ? styles.stepNumberActive : styles.stepNumberInactive
            ]}>
              {stepNumber}
            </Text>
          </View>
          <Text style={styles.stepLabel}>
            {stepNumber === 1 ? 'Datos' : stepNumber === 2 ? 'Seguridad' : 'Confirmar'}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>Información Personal</Text>
      <Text style={styles.stepDescription}>
        Por favor, proporciona tus datos básicos
      </Text>

      <View style={styles.nameRow}>
        <View style={styles.nameInput}>
          <CustomInput
            label="Nombre *"
            value={formData.firstName}
            onChangeText={(value) => handleChange('firstName', value)}
            placeholder="Juan"
            icon="person-outline"
            error={errors.firstName}
            editable={!loading}
            autoCapitalize="words"
          />
        </View>
        
        <View style={styles.nameInput}>
          <CustomInput
            label="Apellido *"
            value={formData.lastName}
            onChangeText={(value) => handleChange('lastName', value)}
            placeholder="Pérez"
            icon="person-outline"
            error={errors.lastName}
            editable={!loading}
            autoCapitalize="words"
          />
        </View>
      </View>

      <CustomInput
        label="Email *"
        value={formData.email}
        onChangeText={(value) => handleChange('email', value.toLowerCase())}
        placeholder="ejemplo@correo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        icon="mail-outline"
        error={errors.email}
        editable={!loading}
        containerStyle={styles.inputSpacing}
      />

      <CustomInput
        label="Teléfono *"
        value={formData.phone}
        onChangeText={(value) => handleChange('phone', formatPhone(value))}
        placeholder="(555) 123-4567"
        keyboardType="phone-pad"
        icon="call-outline"
        error={errors.phone}
        editable={!loading}
        maxLength={14}
        containerStyle={styles.inputSpacing}
      />
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>Seguridad y Términos</Text>
      <Text style={styles.stepDescription}>
        Crea una contraseña y acepta los términos
      </Text>

      <CustomInput
        label="Contraseña *"
        value={formData.password}
        onChangeText={(value) => handleChange('password', value)}
        placeholder="Mínimo 6 caracteres"
        secureTextEntry={!showPassword}
        icon="lock-closed-outline"
        error={errors.password}
        editable={!loading}
        rightIcon={showPassword ? 'eye-off' : 'eye'}
        onRightIconPress={() => setShowPassword(!showPassword)}
        maxLength={20}
        containerStyle={styles.inputSpacing}
      />

      <CustomInput
        label="Confirmar Contraseña *"
        value={formData.confirmPassword}
        onChangeText={(value) => handleChange('confirmPassword', value)}
        placeholder="Repite tu contraseña"
        secureTextEntry={!showConfirmPassword}
        icon="lock-closed-outline"
        error={errors.confirmPassword}
        editable={!loading}
        rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
        onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
        maxLength={20}
        containerStyle={styles.inputSpacing}
      />

      <View style={styles.termsSection}>
        <Text style={styles.termsTitle}>Términos y Condiciones *</Text>
        
        {[
          {
            key: 'recording',
            title: 'Consentimiento de Grabación',
            description: 'Autorizo que pueda ser grabado durante las clases',
            required: true,
          },
          {
            key: 'dataSharing',
            title: 'Compartir Datos Personales',
            description: 'Autorizo compartir mis datos con entrenadores',
            required: true,
          },
          {
            key: 'medicalData',
            title: 'Datos Médicos',
            description: 'Declaro que mi información médica es verídica',
            required: true,
          },
          {
            key: 'marketing',
            title: 'Comunicaciones de Marketing',
            description: 'Deseo recibir ofertas y promociones (opcional)',
            required: false,
          },
        ].map((term) => (
          <TouchableOpacity
            key={term.key}
            style={styles.termItem}
            onPress={() => setTerms(prev => ({ ...prev, [term.key]: !prev[term.key] }))}
            disabled={loading}
          >
            <View style={[
              styles.termCheckbox,
              terms[term.key] && styles.termCheckboxChecked
            ]}>
              {terms[term.key] && (
                <Ionicons name="checkmark" size={14} color={colors.white} />
              )}
            </View>
            <View style={styles.termContent}>
              <Text style={styles.termTitle}>
                {term.title} {term.required && '*'}
              </Text>
              <Text style={styles.termDescription}>{term.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
        
        {errors.terms && (
          <Text style={styles.errorText}>{errors.terms}</Text>
        )}
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <View style={styles.confirmationHeader}>
        <View style={styles.confirmationIcon}>
          <Ionicons name="checkmark-circle" size={60} color={colors.success} />
        </View>
        <Text style={styles.confirmationTitle}>¡Listo para registrarse!</Text>
        <Text style={styles.confirmationDescription}>
          Revisa que toda tu información sea correcta
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumen de Registro</Text>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Nombre:</Text>
          <Text style={styles.summaryValue}>
            {formData.firstName} {formData.lastName}
          </Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Email:</Text>
          <Text style={styles.summaryValue}>{formData.email}</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Teléfono:</Text>
          <Text style={styles.summaryValue}>{formData.phone || 'No proporcionado'}</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Términos aceptados:</Text>
          <Text style={styles.summaryValue}>
            {terms.recording && terms.dataSharing && terms.medicalData ? 'Sí' : 'No'}
          </Text>
        </View>
      </View>

      <Text style={styles.finalNote}>
        Al confirmar, serás registrado como <Text style={styles.roleText}>Cliente</Text> en Yeyos Fitness
      </Text>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* FONDO */}
      <LinearGradient
        colors={[colors.pinkLight, colors.pinkLighter]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => step === 1 ? navigation.goBack() : handlePrevStep()}
              disabled={loading}
            >
              <Ionicons name="arrow-back" size={24} color={colors.pinkDark} />
            </TouchableOpacity>
            
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Registro de Cliente</Text>
              <Text style={styles.subtitle}>Paso {step} de 3</Text>
            </View>
          </View>

          {/* Indicador de pasos */}
          {renderStepIndicator()}

          {/* Formulario */}
          <View style={styles.formContainer}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {/* Botones de navegación */}
            <View style={styles.navigationButtons}>
              {step > 1 && (
                <CustomButton
                  title="Anterior"
                  onPress={handlePrevStep}
                  disabled={loading}
                  style={styles.prevButton}
                  variant="outline"
                  textStyle={{ color: colors.pinkDark }}
                />
              )}
              
              {step < 3 ? (
                <CustomButton
                  title="Siguiente"
                  onPress={handleNextStep}
                  disabled={loading}
                  style={styles.nextButton}
                  icon="arrow-forward"
                />
              ) : (
                <CustomButton
                  title={loading ? "Registrando..." : "Confirmar Registro"}
                  onPress={handleRegister}
                  loading={loading}
                  disabled={loading}
                  style={styles.confirmButton}
                  gradientColors={[colors.pinkDark, colors.primaryDark]}
                  icon="checkmark"
                />
              )}
            </View>

            {/* Ya tengo cuenta */}
            {step === 1 && (
              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
                disabled={loading}
              >
                <Text style={styles.loginText}>
                  ¿Ya tienes cuenta? <Text style={styles.loginLinkText}>Inicia Sesión</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white + '80',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.pinkDark,
  },
  subtitle: {
    fontSize: 16,
    color: colors.brownGray,
    marginTop: 5,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: colors.pinkDark,
  },
  stepCircleInactive: {
    backgroundColor: colors.brownLight + '40',
    borderWidth: 2,
    borderColor: colors.brownLight + '80',
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: colors.white,
  },
  stepNumberInactive: {
    color: colors.brownGray,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.brownGray,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 35,
    minHeight: 500,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.pinkDark,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 15,
    color: colors.brownGray,
    marginBottom: 25,
    lineHeight: 22,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  nameInput: {
    width: '48%',
  },
  inputSpacing: {
    marginBottom: 20,
  },
  termsSection: {
    marginTop: 20,
    marginBottom: 25,
  },
  termsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.pinkDark,
    marginBottom: 15,
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    backgroundColor: colors.brownLight + '20',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.brownLight + '40',
  },
  termCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.brownLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  termCheckboxChecked: {
    backgroundColor: colors.pinkDark,
    borderColor: colors.pinkDark,
  },
  termContent: {
    flex: 1,
  },
  termTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  termDescription: {
    fontSize: 13,
    color: colors.brownGray,
    lineHeight: 18,
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
    marginTop: 10,
    textAlign: 'center',
  },
  confirmationHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  confirmationIcon: {
    marginBottom: 15,
  },
  confirmationTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: 10,
  },
  confirmationDescription: {
    fontSize: 16,
    color: colors.brownGray,
    textAlign: 'center',
    lineHeight: 24,
  },
  summaryCard: {
    backgroundColor: colors.brownLight + '20',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.brownLight + '40',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.pinkDark,
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.brownLight,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: colors.brownGray,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    color: colors.dark,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  finalNote: {
    fontSize: 14,
    color: colors.brownGray,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  roleText: {
    color: colors.pinkDark,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  prevButton: {
    flex: 1,
    borderColor: colors.pinkDark,
    borderWidth: 2,
  },
  nextButton: {
    flex: 2,
  },
  confirmButton: {
    flex: 1,
  },
  loginLink: {
    marginTop: 25,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 15,
    color: colors.brownGray,
  },
  loginLinkText: {
    color: colors.pinkDark,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;