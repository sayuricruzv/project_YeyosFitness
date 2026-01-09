// src/contexts/AuthContext.js - VERSIÓN COMPLETA CORREGIDA
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  registerClient, 
  registerAdmin, 
  loginUser, 
  logoutUser, 
  getCurrentUser,
  verifyAdminCode,
  supabase 
} from '../config/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Verificar usuario al iniciar
  useEffect(() => {
    checkUser();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (session?.user) {
          // Obtener perfil actualizado
          const currentUser = await getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setProfile(currentUser);
            setUserRole(currentUser.role || 'client');
            setIsDemoMode(false);
            console.log('✅ Usuario autenticado:', currentUser.email, 'Role:', currentUser.role);
          }
        } else {
          setUser(null);
          setProfile(null);
          setUserRole(null);
          setIsDemoMode(false);
          console.log('📭 Sesión cerrada');
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setProfile(currentUser);
        setUserRole(currentUser.role || 'client');
        setIsDemoMode(false);
        console.log('✅ Usuario cargado:', currentUser.email, 'Role:', currentUser.role);
      } else {
        console.log('📭 No hay usuario activo');
      }
    } catch (error) {
      console.error('❌ Error verificando usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  // Registrar cliente (con firstName y lastName)
  const signUpClient = async (userData) => {
    try {
      console.log('📤 Registrando cliente...', userData.email);
      
      const result = await registerClient(userData);
      
      if (result.success) {
        console.log('✅ Cliente registrado exitosamente');
        
        // IMPORTANTE: NO establecemos sesión automáticamente
        // El usuario debe verificar su email primero
        // El contexto se actualizará cuando el usuario inicie sesión
        
        return result;
      }
      
    } catch (error) {
      console.error('❌ Error en registro cliente:', error.message);
      
      // Manejo de errores específicos
      let errorMessage = error.message;
      
      if (error.message.includes('User already registered') || 
          error.message.includes('already registered') ||
          error.message.includes('user_already_exists')) {
        errorMessage = 'Este email ya está registrado. Por favor inicia sesión o usa otro email.';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Email inválido';
      } else if (error.message.includes('23505')) {
        errorMessage = 'Este usuario ya existe. Por favor inicia sesión.';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Registrar administrador (con firstName y lastName)
  const signUpAdmin = async (userData, adminCode) => {
    try {
      console.log('📤 Registrando administrador...', userData.email);
      console.log('📤 Datos recibidos:', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone
      });
      
      // Primero validar el código
      const codeValidation = await verifyAdminCode(adminCode);
      
      if (!codeValidation.isValid) {
        throw new Error(codeValidation.message);
      }
      
      // Registrar administrador
      const result = await registerAdmin(userData, adminCode);
      
      if (result.success) {
        console.log('✅ Administrador registrado exitosamente');
        
        // IMPORTANTE: NO establecemos sesión automáticamente
        // El usuario debe verificar su email primero
        // Cerramos cualquier sesión potencial
        try {
          await logoutUser();
        } catch (logoutError) {
          console.log('⚠️ No había sesión activa');
        }
        
        return result;
      }
      
    } catch (error) {
      console.error('❌ Error en registro admin:', error.message);
      
      let errorMessage = error.message;
      
      // Manejo de errores específicos
      if (error.message.includes('already registered')) {
        errorMessage = 'Este email ya está registrado. Por favor inicia sesión.';
      } else if (error.message.includes('Código de administrador')) {
        errorMessage = error.message;
      } else if (error.message.includes('23505')) {
        errorMessage = 'Este usuario ya existe. Por favor inicia sesión.';
      } else if (error.message.includes('cliente')) {
        errorMessage = 'Este email ya está registrado como cliente. Por favor usa otro email.';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Iniciar sesión
  const signIn = async (email, password) => {
    try {
      console.log('🔑 Intentando iniciar sesión con:', email);
      
      const result = await loginUser(email, password);
      
      if (result.success) {
        setUser(result.user);
        setProfile(result.user);
        setUserRole(result.user.role);
        setIsDemoMode(false);
        
        console.log('✅ Login exitoso. Rol:', result.user.role);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error en login:', error.message);
      
      let errorMessage = error.message;
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.';
      } else if (error.message.includes('User not found')) {
        errorMessage = 'Usuario no encontrado. Regístrate primero.';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Cerrar sesión
  const signOut = async () => {
    try {
      console.log('🚪 Cerrando sesión...');
      
      const result = await logoutUser();
      setUser(null);
      setProfile(null);
      setUserRole(null);
      setIsDemoMode(false);
      
      console.log('✅ Sesión cerrada exitosamente');
      return result;
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        userRole,
        isDemoMode,
        loading,
        signUpClient,
        signUpAdmin,
        signIn,
        signOut,
        checkUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;