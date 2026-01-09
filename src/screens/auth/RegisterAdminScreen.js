// src/screens/auth/RegisterAdminScreen.js - VERSIÓN COMPLETA CORREGIDA
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

const RegisterAdminScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    adminCode: '',
    firstName: '',      // ← Cambiado de fullName
    lastName: '',       // ← Agregado
    email: '',
    phone: '',          // ← Opcional para admin
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);

  const { signUpAdmin } = useAuth();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateAdminCode = () => {
    if (!formData.adminCode.trim()) {
      setErrors({ adminCode: 'El código de administrador es requerido' });
      return false;
    }

    if (formData.adminCode.length > 20) {
      setErrors({ adminCode: 'Máximo 20 caracteres' });
      return false;
    }

    // Validación simple (sin API call)
    if (formData.adminCode.trim().length < 5) {
      setErrors({ adminCode: 'El código debe tener al menos 5 caracteres' });
      return false;
    }

    setStep(2);
    setErrors({});
    return true;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'Mínimo 2 caracteres';
    } else if (formData.firstName.length > 30) {
      newErrors.firstName = 'Máximo 30 caracteres';
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Mínimo 2 caracteres';
    } else if (formData.lastName.length > 30) {
      newErrors.lastName = 'Máximo 30 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar teléfono (opcional)
    if (formData.phone && formData.phone.trim() !== '') {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        newErrors.phone = 'Teléfono inválido (mínimo 10 dígitos)';
      }
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    } else if (formData.password.length > 20) {
      newErrors.password = 'Máximo 20 caracteres';
    }

    // Validar confirmación
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhone = (text) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0,3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0,3)}) ${numbers.slice(3,6)}-${numbers.slice(6,10)}`;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        phone: formData.phone ? formData.phone.replace(/\D/g, '') : null, // Solo números o null
      };

      const result = await signUpAdmin(userData, formData.adminCode.toUpperCase().trim());
      
      if (result.success) {
        Alert.alert(
          '¡Registro Exitoso! 🎉',
          'Tu cuenta de administrador ha sido creada exitosamente.\n\n📧 Por favor revisa tu email para verificar tu cuenta y luego inicia sesión.',
          [
            {
              text: 'Ir a Iniciar Sesión',
              onPress: () => {
                navigation.navigate('Login', { 
                  email: formData.email.toLowerCase().trim(),
                  message: '¡Registro exitoso! Por favor verifica tu email e inicia sesión.'
                });
              }
            }
          ]
        );
      }
    } catch (error) {
      let errorMessage = error.message || 'Error al registrar administrador';
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setErrors({});
    } else {
      navigation.goBack();
    }
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>Verificación de Identidad</Text>
      <Text style={styles.stepDescription}>
        Para garantizar la seguridad del sistema, necesitas un código especial 
        proporcionado por un administrador existente.
      </Text>

      <CustomInput
        label="Código de Administrador *"
        value={formData.adminCode}
        onChangeText={(value) => handleChange('adminCode', value.toUpperCase())}
        placeholder="Ej: ADMIN2024, YEYOS123"
        maxLength={20}
        error={errors.adminCode}
        editable={!loading}
        autoCapitalize="characters"
        icon="key-outline"
        containerStyle={styles.inputContainer}
      />

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={colors.primary} />
        <Text style={styles.infoText}>
          Códigos válidos: ADMIN2024, GYMOWNER, MANAGER123, YEYOS123
        </Text>
      </View>

      <CustomButton
        title="Validar código y continuar"
        onPress={validateAdminCode}
        loading={loading}
        disabled={loading}
        style={styles.nextButton}
        backgroundColor={colors.admin}
        icon="arrow-forward"
        iconPosition="right"
      />
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>Crear Cuenta Administrador</Text>
      <Text style={styles.stepDescription}>
        Completa tus datos personales para crear tu cuenta de administrador.
      </Text>

      {/* Campos de nombre separados */}
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
            maxLength={30}
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
            maxLength={30}
          />
        </View>
      </View>

      <CustomInput
        label="Correo Electrónico *"
        value={formData.email}
        onChangeText={(value) => handleChange('email', value.toLowerCase())}
        placeholder="admin@yeyosfitness.com"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
        editable={!loading}
        icon="mail-outline"
        containerStyle={styles.inputContainer}
      />

      <CustomInput
        label="Teléfono (Opcional)"
        value={formData.phone}
        onChangeText={(value) => handleChange('phone', formatPhone(value))}
        placeholder="(555) 123-4567"
        keyboardType="phone-pad"
        icon="call-outline"
        error={errors.phone}
        editable={!loading}
        maxLength={14}
        containerStyle={styles.inputContainer}
      />

      <CustomInput
        label="Contraseña *"
        value={formData.password}
        onChangeText={(value) => handleChange('password', value)}
        placeholder="Mínimo 6 caracteres"
        secureTextEntry={!showPassword}
        error={errors.password}
        editable={!loading}
        maxLength={20}
        icon="lock-closed-outline"
        rightIcon={showPassword ? 'eye-off' : 'eye'}
        onRightIconPress={() => setShowPassword(!showPassword)}
        containerStyle={styles.inputContainer}
      />

      <CustomInput
        label="Confirmar Contraseña *"
        value={formData.confirmPassword}
        onChangeText={(value) => handleChange('confirmPassword', value)}
        placeholder="Repite la contraseña"
        secureTextEntry={!showConfirmPassword}
        error={errors.confirmPassword}
        editable={!loading}
        maxLength={20}
        icon="lock-closed-outline"
        rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
        onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
        containerStyle={styles.inputContainer}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.backStepButton}
          onPress={() => setStep(1)}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backStepButtonText}>Volver al paso 1</Text>
        </TouchableOpacity>

        <CustomButton
          title="Crear Cuenta Administrador"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.registerButton}
          gradientColors={['#511D43', '#E4004B']}
          icon="shield-checkmark"
          iconPosition="right"
        />
      </View>

      <View style={styles.registerInfo}>
        <Ionicons name="shield-checkmark" size={18} color={colors.success} />
        <Text style={styles.registerInfoText}>
          Después del registro, recibirás un email de verificación. Debes verificar tu email antes de iniciar sesión.
        </Text>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#0F0A1E', '#2D1B47']}
        style={styles.gradient}
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
              onPress={goBack}
              disabled={loading}
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Registro de Administrador</Text>
              <Text style={styles.subtitle}>Paso {step} de 2</Text>
            </View>
          </View>

          {/* Contenido */}
          <View style={styles.formContainer}>
            {step === 1 ? renderStep1() : renderStep2()}
            
            {/* Ya tengo cuenta */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                ¿Ya tienes cuenta? <Text style={styles.loginLinkText}>Inicia Sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  gradient: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1, 
    paddingBottom: 30 
  },
  header: { 
    paddingHorizontal: 25, 
    paddingTop: 60, 
    paddingBottom: 20 
  },
  backButton: { 
    marginBottom: 25 
  },
  titleContainer: { 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: colors.white, 
    marginBottom: 5,
    textAlign: 'center'
  },
  subtitle: { 
    fontSize: 16, 
    color: 'rgba(255,255,255,0.7)' 
  },
  formContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 10,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 15,
    color: colors.darkGray,
    lineHeight: 22,
    marginBottom: 25,
    textAlign: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  nameInput: {
    width: '48%',
  },
  inputContainer: { 
    marginBottom: 18 
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  infoText: {
    fontSize: 13,
    color: colors.darkGray,
    marginLeft: 10,
    flex: 1,
  },
  nextButton: { 
    marginTop: 10, 
    marginBottom: 20 
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  backStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  backStepButtonText: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 15,
  },
  registerButton: { 
    flex: 1, 
    marginLeft: 15 
  },
  registerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.success + '10',
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    borderWidth: 1,
    borderColor: colors.success + '30',
  },
  registerInfoText: {
    fontSize: 13,
    color: colors.darkGray,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  loginLink: {
    marginTop: 25,
    alignItems: 'center',
    padding: 10,
  },
  loginText: {
    fontSize: 15,
    color: colors.darkGray,
  },
  loginLinkText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default RegisterAdminScreen;