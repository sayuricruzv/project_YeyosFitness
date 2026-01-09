-- Esquema de base de datos para Yeyos Fitness App

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de perfiles de usuario
CREATE TABLE user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  profile_image TEXT,
  has_completed_questionnaire BOOLEAN DEFAULT FALSE,
  questionnaire_data JSONB,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de mensajes de chat
CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chat_type TEXT NOT NULL CHECK (chat_type IN ('personal', 'group')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de rutinas de entrenamiento
CREATE TABLE workout_routines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('strength', 'cardio', 'yoga', 'functional')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER,
  video_url TEXT,
  thumbnail_url TEXT,
  instructions JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de historial de entrenamientos
CREATE TABLE workout_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_id UUID REFERENCES workout_routines(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Tabla de videos destacados
CREATE TABLE featured_videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de seguridad (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_videos ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para chat_messages
CREATE POLICY "Users can view chat messages" ON chat_messages
  FOR SELECT USING (true);

CREATE POLICY "Users can insert chat messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para workout_routines
CREATE POLICY "Users can view workout routines" ON workout_routines
  FOR SELECT USING (true);

CREATE POLICY "Coaches can manage workout routines" ON workout_routines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND (preferences->>'role' = 'coach' OR preferences->>'role' = 'admin')
    )
  );

-- Políticas para workout_history
CREATE POLICY "Users can view own workout history" ON workout_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout history" ON workout_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para featured_videos
CREATE POLICY "Users can view featured videos" ON featured_videos
  FOR SELECT USING (true);

CREATE POLICY "Coaches can manage featured videos" ON featured_videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND (preferences->>'role' = 'coach' OR preferences->>'role' = 'admin')
    )
  );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_routines_updated_at
  BEFORE UPDATE ON workout_routines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos videos destacados de ejemplo
INSERT INTO featured_videos (title, description, video_url, thumbnail_url, duration_seconds, category, difficulty, is_featured) VALUES
('Rutina de Fuerza para Principiantes', 'Aprende los ejercicios básicos de fuerza con esta rutina completa', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'https://via.placeholder.com/300x200/0D1164/FFFFFF?text=Video+1', 1530, 'strength', 'beginner', true),
('Cardio HIIT Intenso', 'Quema calorías con este entrenamiento de alta intensidad', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 'https://via.placeholder.com/300x200/FF2DF1/FFFFFF?text=Video+2', 1215, 'cardio', 'advanced', true),
('Yoga para Relajación', 'Estira y relaja tu cuerpo después del entrenamiento', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'https://via.placeholder.com/300x200/758694/FFFFFF?text=Video+3', 2145, 'yoga', 'beginner', true);

-- Crear bucket para imágenes de perfil
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true);

-- Política para el bucket de imágenes de perfil
CREATE POLICY "Users can upload own profile images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Users can update own profile images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own profile images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
