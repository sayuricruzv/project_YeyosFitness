# Yeyos Fitness - Aplicación Móvil de Gimnasio

Una aplicación móvil completa para gimnasios desarrollada con React Native, Expo y Supabase.

## 🚀 Características

- **Autenticación completa**: Login, registro y autenticación social (Google/Apple)
- **Cuestionario de salud obligatorio**: Formulario detallado para conocer el estado de salud de los usuarios
- **Perfil de usuario**: Gestión de información personal y preferencias
- **Historial de entrenamientos**: Seguimiento de rutinas y progreso
- **Videos interactivos**: Rutinas de entrenamiento con videos
- **Sistema de chat**: Comunicación personal y grupal con entrenadores
- **Diseño moderno**: UI/UX atractiva con colores personalizados

## 🛠️ Tecnologías Utilizadas

- **React Native** - Framework de desarrollo móvil
- **Expo SDK 54** - Plataforma de desarrollo y despliegue
- **Supabase** - Backend como servicio (autenticación, base de datos, storage)
- **React Navigation** - Navegación entre pantallas
- **Gifted Chat** - Sistema de chat
- **Expo AV** - Reproducción de videos
- **React Native Gifted Chat** - Componente de chat avanzado

## 📱 Pantallas Incluidas

### Autenticación
- **Login**: Inicio de sesión con email/contraseña y opciones sociales
- **Registro**: Formulario completo con validaciones

### Principal
- **Home**: Pantalla principal con estadísticas, videos destacados e historial
- **Perfil**: Información del usuario, foto de perfil y preferencias
- **Chat**: Sistema de mensajería personal y grupal

### Modales
- **Cuestionario**: Formulario obligatorio post-login con información de salud

## 🎨 Colores de la Aplicación

- **Primario**: #0D1164 (Azul oscuro)
- **Secundario**: #FF2DF1 (Rosa/Magenta)
- **Terciario**: #758694 (Gris)

## ⚙️ Configuración

### 1. Instalación de Dependencias

```bash
npm install
```

### 2. Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el archivo `supabase-schema.sql` en el SQL Editor de Supabase
3. Actualiza las credenciales en `src/config/supabase.js`:

```javascript
const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseAnonKey = 'TU_SUPABASE_ANON_KEY';
```

### 3. Configuración de Autenticación Social

#### Google OAuth
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto y habilita Google+ API
3. Crea credenciales OAuth 2.0
4. Actualiza `GOOGLE_CLIENT_ID` en `src/services/SocialAuth.js`

#### Apple OAuth
1. Ve a [Apple Developer Console](https://developer.apple.com)
2. Configura Sign in with Apple
3. Actualiza `APPLE_CLIENT_ID` en `src/services/SocialAuth.js`

### 4. Configuración de Storage

1. En Supabase, ve a Storage
2. Crea un bucket llamado `profile-images`
3. Configura las políticas de acceso (incluidas en el schema)

### 5. Instalar Dependencias Actualizadas

```bash
# Limpiar caché y reinstalar dependencias
npm install --force
# o
yarn install --force
```

### 6. Ejecutar la Aplicación

```bash
# Iniciar el servidor de desarrollo
npx expo start

# Para Android
npx expo start --android

# Para iOS
npx expo start --ios

# Para web
npx expo start --web
```

## 📊 Base de Datos

### Tablas Principales

- **user_profiles**: Información de usuarios y cuestionarios
- **chat_messages**: Mensajes del sistema de chat
- **workout_routines**: Rutinas de entrenamiento
- **workout_history**: Historial de entrenamientos
- **featured_videos**: Videos destacados

### Políticas de Seguridad

La aplicación utiliza Row Level Security (RLS) de Supabase para proteger los datos:
- Los usuarios solo pueden ver/editar su propia información
- Los entrenadores pueden gestionar rutinas y videos
- El chat es accesible para todos los usuarios autenticados

## 🔐 Funcionalidades de Seguridad

- Autenticación JWT con Supabase
- Validación de formularios en cliente
- Políticas de seguridad a nivel de base de datos
- Almacenamiento seguro de imágenes de perfil

## 📱 Características del Chat

- **Chat Personal**: Comunicación directa con entrenadores
- **Chat Grupal**: Conversación con otros miembros
- **Tiempo Real**: Mensajes instantáneos con Supabase Realtime
- **Botón Flotante**: Acceso rápido desde cualquier pantalla

## 🏃‍♂️ Cuestionario de Salud

Formulario obligatorio que incluye:
- Información personal (edad, peso, estatura)
- Nivel de actividad física
- Objetivos de entrenamiento
- Preferencias de ejercicio
- Historial médico y medicamentos
- Declaración de responsabilidad

## 🎥 Sistema de Videos

- Videos de rutinas de entrenamiento
- Categorización por tipo y dificultad
- Reproducción integrada con Expo AV
- Thumbnails y metadatos

## 📈 Estadísticas

La pantalla principal muestra:
- Calorías quemadas
- Tiempo total de entrenamiento
- Número de entrenamientos completados
- Progreso visual

## 🚀 Despliegue

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

## 📝 Notas Importantes

1. **Configuración de Supabase**: Asegúrate de configurar correctamente las políticas RLS
2. **Autenticación Social**: Requiere configuración adicional en las consolas de Google y Apple
3. **Storage**: Configura el bucket de imágenes con las políticas correctas
4. **Variables de Entorno**: Considera usar variables de entorno para las credenciales

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico o preguntas, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para Yeyos Fitness**
