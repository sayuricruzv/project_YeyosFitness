// src/screens/auth/ForgotPasswordScreen.js - VERSIÓN REAL CON SUPABASE
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { supabase } from '../../config/supabase';
import { colors } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: Nueva contraseña
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Verificar si hay un token de recuperación en la URL (para web, pero útil para debugging)
  useEffect(() => {
    const checkResetToken = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user?.recovery_token) {
          setResetToken(data.session.user.recovery_token);
          setStep(2);
        }
      } catch (error) {
        console.log('No reset token in session:', error.message);
      }
    };
    
    checkResetToken();
  }, []);

  const validateEmail = () => {
    if (!email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido');
      return false;
    }
    return true;
  };

  const validatePasswords = () => {
    if (!newPassword) {
      setError('La nueva contraseña es requerida');
      return false;
    }
    if (newPassword.length < 6) {
      setError('Mínimo 6 caracteres');
      return false;
    }
    if (newPassword.length > 8) {
      setError('Máximo 8 caracteres');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  // Función REAL para enviar email de recuperación
  const handleSendResetEmail = async () => {
    if (!validateEmail()) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Enviando email de recuperación a:', email);
      
      // URL de redirección para tu app - IMPORTANTE PARA EMAIL DE RECUPERACIÓN
      const redirectUrl = process.env.EXPO_PUBLIC_SUPABASE_URL 
        ? `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/verify`
        : 'yeyosfitness://reset-password'; // URL de deep linking para tu app
      
      const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        // Manejar errores específicos
        if (error.message.includes('rate limit')) {
          throw new Error('Demasiados intentos. Intenta más tarde.');
        } else if (error.message.includes('not found')) {
          throw new Error('Este email no está registrado en nuestro sistema.');
        } else {
          throw error;
        }
      }
      
      // Éxito - mostrar mensaje
      setSuccess(true);
      
      Alert.alert(
        'Email enviado',
        `Hemos enviado un enlace de recuperación a:\n\n${email}\n\nRevisa tu bandeja de entrada (y spam) y sigue las instrucciones.`,
        [
          {
            text: 'Entendido',
            onPress: () => {
              // En React Native, usualmente el usuario debe abrir el email manualmente
              // Podrías usar Linking para abrir la app de email
            },
          }
        ]
      );
      
      // En una app nativa, esto permitiría al usuario cambiar la contraseña directamente
      // Para simplificar, vamos al paso 2 (pero en producción debería ser con el token del email)
      setTimeout(() => {
        setStep(2);
      }, 2000);
      
    } catch (error) {
      console.error('Error enviando email de recuperación:', error.message);
      setError(error.message || 'Error enviando el email de recuperación. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Función REAL para cambiar la contraseña
  const handleResetPassword = async () => {
    if (!validatePasswords()) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Cambiando contraseña para:', email);
      
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        if (error.message.includes('weak_password')) {
          throw new Error('La contraseña es muy débil. Usa al menos una mayúscula y un número.');
        } else if (error.message.includes('session expired')) {
          throw new Error('El enlace ha expirado. Solicita uno nuevo.');
        } else {
          throw error;
        }
      }
      
      // Contraseña cambiada exitosamente
      Alert.alert(
        '¡Contraseña cambiada!',
        'Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.',
        [
          {
            text: 'Iniciar Sesión',
            onPress: () => {
              // Limpiar estado
              setEmail('');
              setNewPassword('');
              setConfirmPassword('');
              setStep(1);
              setSuccess(false);
              // Navegar al login
              navigation.navigate('Login');
            },
          }
        ]
      );
      
    } catch (error) {
      console.error('Error cambiando contraseña:', error.message);
      setError(error.message || 'Error cambiando la contraseña. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el caso cuando el usuario llega con un token de reset
  const handleTokenReset = async () => {
    if (!validatePasswords()) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      Alert.alert(
        'Contraseña actualizada',
        'Tu contraseña ha sido cambiada exitosamente.',
        [{ text: 'Iniciar Sesión', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      setError('Error actualizando contraseña. Intenta solicitar un nuevo enlace.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepsContainer}>
      <View style={styles.stepsRow}>
        {[1, 2].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <View style={styles.stepItem}>
              <LinearGradient
                colors={step >= stepNumber ? ['#994f68ff', '#f835ffff'] : ['#D7D7D7', '#999999']}
                style={styles.stepCircle}
              >
                {step > stepNumber ? (
                  <Ionicons name="checkmark" size={18} color={colors.white} />
                ) : (
                  <Text style={styles.stepNumber}>{stepNumber}</Text>
                )}
              </LinearGradient>
              <Text style={[
                styles.stepLabel,
                step >= stepNumber && styles.stepLabelActive
              ]}>
                {stepNumber === 1 ? 'Solicitar' : 'Nueva Contraseña'}
              </Text>
            </View>
            {stepNumber < 2 && (
              <View style={[
                styles.stepLine,
                step > stepNumber && styles.stepLineActive
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <>
      <Text style={styles.stepDescription}>
        Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
      </Text>

      <CustomInput
        label="Email registrado"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError('');
        }}
        placeholder="ejemplo@correo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        icon="mail-outline"
        error={step === 1 ? error : ''}
        editable={!loading}
        containerStyle={styles.inputContainer}
      />

      {success && (
        <View style={styles.successMessage}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.successText}>
            Email enviado a {email}. Revisa tu bandeja de entrada.
          </Text>
        </View>
      )}

      <CustomButton
        title={success ? "Reenviar Email" : "Enviar enlace"}
        onPress={handleSendResetEmail}
        loading={loading}
        disabled={loading}
        style={styles.actionButton}
        icon="send"
        iconPosition="right"
      />

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={18} color={colors.primary} />
        <Text style={styles.infoText}>
          El enlace será válido por 24 horas. Si no ves el email, revisa tu carpeta de spam.
        </Text>
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>Nueva Contraseña</Text>
      <Text style={styles.stepDescription}>
        {resetToken 
          ? "Crea una nueva contraseña segura para tu cuenta."
          : `Ahora puedes crear una nueva contraseña para: ${email || 'tu cuenta'}`
        }
      </Text>

      <CustomInput
        label="Nueva contraseña"
        value={newPassword}
        onChangeText={(text) => {
          setNewPassword(text);
          setError('');
        }}
        placeholder="Mínimo 6, máximo 8 caracteres"
        secureTextEntry
        maxLength={8}
        icon="lock-closed-outline"
        error={step === 2 ? error : ''}
        editable={!loading}
        containerStyle={styles.inputContainer}
      />

      <CustomInput
        label="Confirmar nueva contraseña"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setError('');
        }}
        placeholder="Repite la contraseña"
        secureTextEntry
        maxLength={8}
        icon="lock-closed-outline"
        error={step === 2 ? error : ''}
        editable={!loading}
        containerStyle={styles.inputContainer}
      />

      <View style={styles.passwordRules}>
        <Text style={styles.rulesTitle}> Reglas de contraseña:</Text>
        <Text style={styles.ruleItem}>• Entre 6 y 8 caracteres</Text>
        <Text style={styles.ruleItem}>• Se recomienda usar mayúsculas y números</Text>
        <Text style={styles.ruleItem}>• No compartas tu contraseña con nadie</Text>
      </View>

      <CustomButton
        title="Restablecer Contraseña"
        onPress={resetToken ? handleTokenReset : handleResetPassword}
        loading={loading}
        disabled={loading}
        style={styles.actionButton}
        icon="shield-checkmark"
        gradientColors={['#34C759', '#007AFF']}
        iconPosition="right"
      />

      <TouchableOpacity
        style={styles.backToStep1}
        onPress={() => setStep(1)}
        disabled={loading}
      >
        <Ionicons name="arrow-back" size={16} color={colors.primary} />
        <Text style={styles.backToStep1Text}>Volver a solicitar enlace</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#511D43" />
      
      <LinearGradient
        colors={['#511D43', '#e4336eff']}
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
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.backButtonGradient}
              >
                <Ionicons name="arrow-back" size={24} color={colors.white} />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.iconContainer}
              >
                <Ionicons name="key" size={36} color={colors.white} />
              </LinearGradient>
              <Text style={styles.title}>Recuperar contraseña</Text>
              <Text style={styles.subtitle}>Sigue los pasos para recuperar tu cuenta</Text>
            </View>
          </Animated.View>

          {/* Indicador de pasos */}
          {renderStepIndicator()}

          {/* Formulario */}
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
          </Animated.View>

          {/* Enlace al login */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
          </TouchableOpacity>

          {/* Información de seguridad */}
          <View style={styles.securityInfo}>
            <Ionicons name="shield-checkmark" size={20} color={colors.white} />
            <Text style={styles.securityText}>
              Tus datos están protegidos
            </Text>
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
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 25,
    alignSelf: 'flex-start',
  },
  backButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  titleContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  stepsContainer: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  stepNumber: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  stepLabelActive: {
    color: colors.white,
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 5,
  },
  stepLineActive: {
    backgroundColor: colors.primaryLight,
  },
  formContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 15,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 15,
    color: colors.darkGray,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  actionButton: {
    marginTop: 10,
    marginBottom: 25,
    borderRadius: 14,
    height: 56,
  },
  passwordRules: {
    backgroundColor: colors.primary + '08',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  rulesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  ruleItem: {
    fontSize: 13,
    color: colors.darkGray,
    marginBottom: 4,
    marginLeft: 10,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '15',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  successText: {
    fontSize: 14,
    color: colors.successDark,
    marginLeft: 10,
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.info + '08',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.info + '20',
  },
  infoText: {
    fontSize: 13,
    color: colors.darkGray,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  backToStep1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 10,
  },
  backToStep1Text: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  loginLinkText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 10,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    marginTop: 25,
    padding: 15,
    borderRadius: 12,
  },
  securityText: {
    fontSize: 13,
    color: colors.white,
    marginLeft: 10,
    flex: 1,
    textAlign: 'center',
  },
});

ForgotPasswordScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};
export default ForgotPasswordScreen;
