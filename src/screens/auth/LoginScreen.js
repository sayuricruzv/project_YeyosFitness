// src/screens/auth/LoginScreen.js - VERSIÓN CORREGIDA
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/colors';
import { Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation, route }) => { // ✅ Añadir route como prop
  // Obtener parámetros de navegación con valor por defecto
  const routeEmail = route?.params?.email || '';
  const routeMessage = route?.params?.message || '';
  
  const [formData, setFormData] = useState({
    email: routeEmail, // Pre-llenar si viene de registro
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  // Mostrar mensaje si viene de registro exitoso
  useEffect(() => {
    if (routeMessage) {
      Alert.alert('¡Éxito!', routeMessage);
    }
  }, [routeMessage]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const { signIn } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        console.log('✅ Login exitoso como', result.role);
      }
    } catch (error) {
      let errorMessage = error.message;
      
      if (error.message.includes('intenta más tarde')) {
        errorMessage = 'Cuenta temporalmente bloqueada. Intenta más tarde.';
      } else if (error.message.includes('Email o contraseña incorrectos')) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Credenciales inválidas';
      }
      
      Alert.alert('❌ Error de autenticación', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterOption = (type) => {
    if (type === 'client') {
      navigation.navigate('Register'); 
    } else {
      navigation.navigate('RegisterAdmin');  
    }
  };

  const handleForgotPassword = () => {
    if (navigation) {
      navigation.navigate('ForgotPassword');
    } else {
      Alert.alert('Información', 'La función de recuperación de contraseña estará disponible pronto.');
    }
  };

  // ... (el resto del código permanece igual hasta el return) ...

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle="light-content" backgroundColor="#511D43" />
      
      {/* Fondo SIMPLIFICADO - sin animaciones que interfieran */}
      <View style={styles.backgroundContainer}>
        <Image
          source={require('../../../assets/images/fotoInicio.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        bounces={false}
      >
        {/* Logo y título SIN ANIMACIONES COMPLEJAS */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {/* Logo simple sin animaciones */}
            <View style={styles.logoWrapper}>
              <View style={styles.logoCircleMask}>
                <Image
                  source={require('../../../assets/images/logo.png')}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
              </View>
            </View>
            
            {/* Título */}
            <View style={styles.titleContainer}>
              <Text style={styles.appName}>
                <Text style={styles.gradientText}>Yeyos</Text>
                <Text style={styles.fitnessText}> Fitness</Text>
              </Text>
              
              <Text style={styles.appTagline}>
                Donde tu transformación comienza
              </Text>
              
              <View style={styles.titleLine} />
            </View>
          </View>
        </View>

        {/* Formulario de login SIN ANIMACIONES */}
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <View style={styles.titleRow}>
              <View style={styles.titleIcon}>
                <Ionicons name="log-in" size={24} color={colors.white} />
              </View>
              <View>
                <Text style={styles.formTitle}>Iniciar Sesión</Text>
                <Text style={styles.formSubtitle}>Accede a tu cuenta</Text>
              </View>
            </View>
          </View>

          {/* Campos del formulario */}
          <View style={styles.inputsContainer}>
            <CustomInput
              label="Correo electrónico"
              value={formData.email}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, email: text }));
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              placeholder="ejemplo@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
              error={errors.email}
              editable={!loading}
              returnKeyType="next"
            />

            <View style={styles.passwordContainer}>
              <CustomInput
                label="Contraseña"
                value={formData.password}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, password: text }));
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                icon="lock-closed-outline"
                rightIcon={showPassword ? 'eye-off' : 'eye'}
                onRightIconPress={() => setShowPassword(!showPassword)}
                error={errors.password}
                editable={!loading}
                returnKeyType="done"
              />
              
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.primaryLight} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botón de inicio de sesión */}
          <CustomButton
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
          />

          {/* Separador */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <View style={styles.separatorCircle}>
              <Text style={styles.separatorText}>O</Text>
            </View>
            <View style={styles.separatorLine} />
          </View>

          {/* Sección de registro */}
          <View style={styles.registerSection}>
            <Text style={styles.registerTitle}>¿No tienes una cuenta?</Text>
            <Text style={styles.registerSubtitle}>Selecciona tu tipo de registro</Text>
            
            <View style={styles.registerButtonsContainer}>
              {/* Botón para registro de cliente */}
              <TouchableOpacity
                style={styles.registerCard}
                onPress={() => handleRegisterOption('client')}
                disabled={loading}
              >
                <View style={styles.registerCardContent}>
                  <View style={styles.registerCardIcon}>
                    <Ionicons name="person-add" size={28} color={colors.white} />
                  </View>
                  <View style={styles.registerCardText}>
                    <Text style={styles.registerCardTitle}>Registrarme como Cliente</Text>
                    <Text style={styles.registerCardDescription}>
                      Acceso completo a clases y seguimiento
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color={colors.white} />
                </View>
              </TouchableOpacity>

              {/* Botón para registro de administrador */}
              <TouchableOpacity
                style={[styles.registerCard, styles.adminCard]}
                onPress={() => handleRegisterOption('admin')}
                disabled={loading}
              >
                <View style={styles.registerCardContent}>
                  <View style={[styles.registerCardIcon, styles.adminIcon]}>
                    <Ionicons name="shield-checkmark" size={28} color={colors.white} />
                  </View>
                  <View style={styles.registerCardText}>
                    <Text style={styles.registerCardTitle}>Registro de Administrador</Text>
                    <Text style={styles.registerCardDescription}>
                      Acceso exclusivo con código
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color={colors.white} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Frase motivacional */}
          <View style={styles.quoteContainer}>
            <Ionicons name="fitness" size={20} color={colors.primaryLight} />
            <Text style={styles.quoteText}>
              "Cada día es una nueva oportunidad para cambiar tu vida"
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Yeyos Fitness • Transformando vidas
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ... (los estilos permanecen igual) ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    zIndex: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(81, 29, 67, 0.85)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircleMask: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  gradientText: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(228, 0, 75, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  fitnessText: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(228, 0, 75, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  appTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 280,
    lineHeight: 20,
    marginTop: 5,
    letterSpacing: 0.5,
  },
  titleLine: {
    width: 80,
    height: 2,
    backgroundColor: 'rgba(239, 136, 173, 0.7)',
    borderRadius: 1,
    marginTop: 12,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  formHeader: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  titleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 2,
  },
  formSubtitle: {
    fontSize: 13,
    color: colors.darkGray,
    fontWeight: '500',
  },
  inputsContainer: {
    marginBottom: 15,
  },
  passwordContainer: {
    position: 'relative',
  },
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 15,
    paddingVertical: 6,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '500',
    marginRight: 5,
  },
  loginButton: {
    marginBottom: 15,
    borderRadius: 12,
    height: 52,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(209, 213, 219, 0.5)',
  },
  separatorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lightGray + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  separatorText: {
    color: colors.darkGray,
    fontSize: 12,
    fontWeight: '700',
  },
  registerSection: {
    marginBottom: 20,
  },
  registerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 5,
    textAlign: 'center',
  },
  registerSubtitle: {
    fontSize: 13,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: 15,
  },
  registerButtonsContainer: {
    gap: 12,
  },
  registerCard: {
    borderRadius: 15,
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  adminCard: {
    backgroundColor: colors.admin,
  },
  registerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 80,
  },
  registerCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adminIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  registerCardText: {
    flex: 1,
  },
  registerCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 3,
  },
  registerCardDescription: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 14,
  },
  quoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 136, 173, 0.1)',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primaryLight,
  },
  quoteText: {
    flex: 1,
    fontSize: 13,
    color: colors.primaryDark,
    fontStyle: 'italic',
    marginLeft: 10,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    textAlign: 'center',
  },
});

LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object
};
export default LoginScreen;
