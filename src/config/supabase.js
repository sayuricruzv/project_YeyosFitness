// src/config/supabase.js - VERSIÓN COMPLETAMENTE CORREGIDA
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validar variables de entorno
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Faltan variables de entorno de Supabase');
  console.error('EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Presente' : '❌ Ausente');
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Presente (longitud: ' + supabaseAnonKey.length + ')' : '❌ Ausente');
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ============================================
// FUNCIONES DE AUTENTICACIÓN CORREGIDAS
// ============================================

// Registrar cliente (MANTIENE teléfono obligatorio)
export const registerClient = async (userData) => {
  try {
    console.log('📤 Registrando cliente...', userData.email);

    // 1. Registrar usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
        }
      }
    });

    if (authError) {
      console.error('❌ Error en auth:', authError);
      
      if (authError.message.includes('already registered')) {
        throw new Error('Este email ya está registrado. Por favor inicia sesión o usa otro email.');
      }
      
      throw authError;
    }

    console.log('✅ Usuario Auth creado:', authData.user?.id);

    // 2. Crear perfil en profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: userData.email.toLowerCase().trim(),
        first_name: userData.firstName,
        last_name: userData.lastName,
        full_name: `${userData.firstName} ${userData.lastName}`.trim(),
        phone: userData.phone.replace(/\D/g, ''), // Solo números
        role: 'client',  // ← ROL CORRECTO: 'client'
        is_active: true,
        accepted_terms: true,
        terms_accepted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error creando perfil:', profileError);
      
      // Si es error de duplicado
      if (profileError.code === '23505') {
        throw new Error('Este usuario ya está registrado. Por favor inicia sesión.');
      }
      
      throw profileError;
    }

    console.log('✅ Perfil de cliente creado exitosamente');
    
    return {
      success: true,
      user: {
        ...authData.user,
        ...profileData
      },
      message: '¡Registro exitoso! Por favor verifica tu email.'
    };

  } catch (error) {
    console.error('❌ Error completo en registro cliente:', error);
    throw error;
  }
};

// Registrar administrador (CORREGIDO - usa firstName y lastName)
export const registerAdmin = async (userData, adminCode) => {
  try {
    console.log('📤 Registrando administrador...', userData.email, 'con código:', adminCode);

    // 1. Validar código de administrador
    const { data: codeData, error: codeError } = await supabase
      .from('admin_codes')
      .select('*')
      .eq('code', adminCode.toUpperCase().trim())
      .eq('is_active', true)
      .single();

    if (codeError || !codeData) {
      throw new Error('Código de administrador inválido o inactivo');
    }

    // Verificar expiración
    if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
      throw new Error('El código de administrador ha expirado');
    }

    // Verificar usos máximos
    if (codeData.current_uses >= codeData.max_uses) {
      throw new Error('Este código ya ha sido utilizado el máximo de veces permitido');
    }

    // 2. Verificar si el email ya existe
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('email', userData.email.toLowerCase().trim())
      .maybeSingle();

    if (existingProfile) {
      console.log('⚠️ Email ya registrado:', existingProfile.email, 'Rol:', existingProfile.role);
      
      if (existingProfile.role === 'admin') {
        throw new Error('Ya eres administrador. Por favor inicia sesión.');
      } else {
        throw new Error('Este email ya está registrado como cliente. Contacta al soporte.');
      }
    }

    // 3. Registrar usuario en auth (usando firstName y lastName)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          // Phone es OPCIONAL para admin
        },
        emailRedirectTo: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/verify`
      }
    });

    if (authError) {
      console.error('❌ Error en auth admin:', authError);
      
      if (authError.message.includes('already registered')) {
        throw new Error('Este email ya está registrado. Por favor inicia sesión.');
      }
      
      throw authError;
    }

    console.log('✅ Usuario Auth creado para admin:', authData.user?.id);

    // 4. Crear perfil de administrador (CORREGIDO - usa firstName y lastName)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: userData.email.toLowerCase().trim(),
        first_name: userData.firstName,
        last_name: userData.lastName,
        full_name: `${userData.firstName} ${userData.lastName}`.trim(),
        phone: userData.phone || null,  // ← Phone OPCIONAL para admin
        role: 'admin',  // ← ¡IMPORTANTE: ROL 'admin' NO 'client'!
        is_active: true,
        accepted_terms: true,
        terms_accepted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error creando perfil admin:', profileError);
      
      // Si es error de duplicado (aunque verificamos antes)
      if (profileError.code === '23505') {
        throw new Error('Este usuario ya está registrado. Por favor inicia sesión.');
      }
      
      throw profileError;
    }

    console.log('✅ Perfil de administrador creado con rol:', profileData.role);

    // 5. Actualizar el código de administrador
    const { error: updateCodeError } = await supabase
      .from('admin_codes')
      .update({
        used_by: authData.user.id,
        current_uses: codeData.current_uses + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', codeData.id);

    if (updateCodeError) {
      console.error('⚠️ Error actualizando código admin:', updateCodeError);
      // No lanzamos error aquí porque el usuario ya fue creado
    }

    console.log('✅ Administrador registrado exitosamente');
    
    // 6. Cerrar sesión para forzar verificación de email
    await supabase.auth.signOut();
    
    return {
      success: true,
      user: {
        ...authData.user,
        ...profileData
      },
      message: '¡Administrador registrado exitosamente! Por favor verifica tu email e inicia sesión.'
    };

  } catch (error) {
    console.error('❌ Error en registro admin:', error);
    
    // Cerrar sesión si se creó alguna
    try {
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.error('Error cerrando sesión:', signOutError);
    }
    
    throw error;
  }
};

// Función auxiliar para actualizar usuario existente a administrador
export const upgradeToAdmin = async (userId, adminCode) => {
  try {
    console.log('🔄 Actualizando usuario a administrador...', userId);

    // Validar código
    const { data: codeData, error: codeError } = await supabase
      .from('admin_codes')
      .select('*')
      .eq('code', adminCode.toUpperCase().trim())
      .eq('is_active', true)
      .single();

    if (codeError || !codeData) {
      throw new Error('Código inválido');
    }

    if (codeData.current_uses >= codeData.max_uses) {
      throw new Error('Código ya utilizado');
    }

    // Actualizar rol del usuario
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        role: 'admin',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      throw new Error('Error actualizando rol');
    }

    // Actualizar código
    await supabase
      .from('admin_codes')
      .update({
        used_by: userId,
        current_uses: codeData.current_uses + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', codeData.id);

    return {
      success: true,
      user: updatedProfile,
      message: 'Usuario actualizado a administrador exitosamente'
    };

  } catch (error) {
    console.error('❌ Error actualizando a admin:', error);
    throw error;
  }
};

// Verificar código de administrador
export const verifyAdminCode = async (code) => {
  try {
    const { data, error } = await supabase
      .from('admin_codes')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return { isValid: false, message: 'Código inválido o inactivo' };
    }

    // Verificar expiración
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { isValid: false, message: 'El código ha expirado' };
    }

    // Verificar usos máximos
    if (data.current_uses >= data.max_uses) {
      return { isValid: false, message: 'Código ya utilizado el máximo de veces' };
    }

    return { 
      isValid: true, 
      message: 'Código válido',
      data 
    };

  } catch (error) {
    console.error('❌ Error verificando código:', error);
    return { isValid: false, message: 'Error validando código' };
  }
};

// Iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }

    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('❌ Error obteniendo perfil:', profileError);
      throw profileError;
    }

    // Actualizar último login
    await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);

    console.log('✅ Login exitoso. Rol:', profile.role);

    return {
      success: true,
      user: {
        ...data.user,
        ...profile
      }
    };

  } catch (error) {
    console.error('❌ Error completo en login:', error);
    throw error;
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error en logout:', error);
    throw error;
  }
};

// Obtener usuario actual
export const getCurrentUser = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log('📭 No hay sesión activa');
      return null;
    }

    // Obtener perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('❌ Error obteniendo perfil:', profileError);
      return {
        ...session.user,
        role: 'client'
      };
    }

    console.log('✅ Usuario obtenido:', session.user.email, 'Rol:', profile.role);
    return {
      ...session.user,
      ...profile
    };

  } catch (error) {
    console.error('❌ Error obteniendo usuario:', error);
    return null;
  }
};

// Obtener todos los usuarios (solo para administradores)
export const getAllUsers = async () => {
  try {
    // Verificar que el usuario actual es administrador
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Obtener rol del usuario actual
    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!currentUserProfile || currentUserProfile.role !== 'admin') {
      throw new Error('No tienes permisos de administrador');
    }

    // Obtener todos los perfiles
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        first_name,
        last_name,
        phone,
        role,
        is_active,
        membership_type,
        created_at,
        last_login,
        accepted_terms
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log('✅ Usuarios obtenidos:', data.length);
    return { success: true, users: data };
    
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error);
    throw error;
  }
};

// Función para actualizar perfil
export const updateProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, profile: data };
  } catch (error) {
    console.error('❌ Error actualizando perfil:', error);
    throw error;
  }
};