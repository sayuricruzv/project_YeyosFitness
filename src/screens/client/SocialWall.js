import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../constants/colors';

const SocialWall = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      type: 'video',
      content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: '¡Entrenamiento de piernas intenso hoy! 💪',
      author: 'Coach Carlos',
      authorAvatar: 'https://via.placeholder.com/50',
      timestamp: '2024-01-15T10:30:00',
      likes: 24,
      userLiked: false,
      views: 156,
    },
    {
      id: 2,
      type: 'image',
      content: 'https://via.placeholder.com/400x300',
      description: 'Momento épico en la clase de Zumba 🕺💃',
      author: 'Coach Ana',
      authorAvatar: 'https://via.placeholder.com/50',
      timestamp: '2024-01-14T18:45:00',
      likes: 42,
      userLiked: true,
      views: 89,
    },
    {
      id: 3,
      type: 'motivation',
      content: 'quote',
      description: 'El único mal entrenamiento es el que no se hace. ¡Sigue adelante! 🔥',
      author: 'Yeyos Fitness',
      authorAvatar: 'https://via.placeholder.com/50',
      timestamp: '2024-01-13T08:00:00',
      likes: 18,
      userLiked: false,
      views: 120,
    },
    {
      id: 4,
      type: 'video',
      content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      description: 'Técnicas correctas para levantamiento de pesas 🏋️‍♂️',
      author: 'Coach Miguel',
      authorAvatar: 'https://via.placeholder.com/50',
      timestamp: '2024-01-12T16:20:00',
      likes: 31,
      userLiked: false,
      views: 210,
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simular carga de nuevos posts
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.userLiked ? post.likes - 1 : post.likes + 1,
          userLiked: !post.userLiked
        };
      }
      return post;
    }));
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Comunidad Yeyos</Text>
          <Text style={styles.subtitle}>¡Conéctate con la comunidad!</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={20} color={colors.primary} />
            <Text style={styles.statText}>248 miembros</Text>
          </View>
        </View>
      </View>

      {/* Feed de posts */}
      <ScrollView
        style={styles.feed}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Banner motivacional */}
        <View style={styles.banner}>
          <Ionicons name="megaphone" size={30} color={colors.white} />
          <Text style={styles.bannerTitle}>¡Comparte tu progreso!</Text>
          <Text style={styles.bannerText}>
            Los coaches publican contenido motivacional y tips de entrenamiento
          </Text>
        </View>

        {/* Lista de posts */}
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* Header del post */}
            <View style={styles.postHeader}>
              <Image
                source={{ uri: post.authorAvatar }}
                style={styles.authorAvatar}
              />
              <View style={styles.postHeaderInfo}>
                <Text style={styles.authorName}>{post.author}</Text>
                <Text style={styles.postTime}>{formatTimeAgo(post.timestamp)}</Text>
              </View>
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.darkGray} />
            </View>

            {/* Contenido del post */}
            <View style={styles.postContent}>
              {post.type === 'video' && (
                <Video
                  source={{ uri: post.content }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="cover"
                  isLooping={false}
                />
              )}

              {post.type === 'image' && (
                <Image
                  source={{ uri: post.content }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}

              {post.type === 'motivation' && (
                <View style={styles.quoteContainer}>
                  <Ionicons name="quote" size={40} color={colors.primary + '30'} />
                  <Text style={styles.quoteText}>{post.description}</Text>
                </View>
              )}

              {post.type !== 'motivation' && (
                <Text style={styles.postDescription}>{post.description}</Text>
              )}
            </View>

            {/* Stats del post */}
            <View style={styles.postStats}>
              <View style={styles.statRow}>
                <Ionicons name="eye" size={16} color={colors.darkGray} />
                <Text style={styles.statTextSmall}>{post.views} vistas</Text>
              </View>
            </View>

            {/* Acciones del post */}
            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(post.id)}
              >
                <Ionicons
                  name={post.userLiked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={post.userLiked ? colors.error : colors.darkGray}
                />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={22} color={colors.darkGray} />
                <Text style={styles.actionText}>Comentar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-social-outline" size={22} color={colors.darkGray} />
                <Text style={styles.actionText}>Compartir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Mensaje al final */}
        <View style={styles.endMessage}>
          <Ionicons name="checkmark-done-circle" size={40} color={colors.lightGray} />
          <Text style={styles.endMessageText}>¡Has visto todo por hoy!</Text>
          <Text style={styles.endMessageSubtext}>Vuelve mañana para más contenido</Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Reglas de la comunidad */}
      <View style={styles.communityRules}>
        <Text style={styles.rulesTitle}>Reglas de la comunidad:</Text>
        <Text style={styles.rulesText}>
          • Respeto mutuo • Sin spam • Contenido positivo • Sin contenido inapropiado
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginTop: 5,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statText: {
    color: colors.white,
    fontSize: 12,
    marginLeft: 5,
  },
  feed: {
    flex: 1,
    padding: 15,
  },
  banner: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 10,
    marginBottom: 5,
  },
  bannerText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 18,
  },
  postCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postHeaderInfo: {
    flex: 1,
    marginLeft: 10,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  postTime: {
    fontSize: 12,
    color: colors.darkGray,
    marginTop: 2,
  },
  postContent: {
    padding: 15,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  quoteContainer: {
    backgroundColor: colors.primary + '10',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.dark,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
  },
  postDescription: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
  },
  postStats: {
    paddingHorizontal: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTextSmall: {
    fontSize: 12,
    color: colors.darkGray,
    marginLeft: 5,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  actionText: {
    marginLeft: 8,
    color: colors.darkGray,
    fontSize: 14,
  },
  endMessage: {
    alignItems: 'center',
    padding: 40,
  },
  endMessageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginTop: 10,
  },
  endMessageSubtext: {
    fontSize: 14,
    color: colors.darkGray,
    marginTop: 5,
  },
  communityRules: {
    backgroundColor: colors.lightGray + '50',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  rulesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 5,
  },
  rulesText: {
    fontSize: 11,
    color: colors.darkGray,
    lineHeight: 14,
  },
});

export default SocialWall;