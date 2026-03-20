import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const HackathonsPage = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHackathons = useCallback(async () => {
    try {
      const res = await api.get('/hackathons');
      setHackathons(res.data.hackathons || []);
    } catch (error) {
      console.error('Fetch hackathons error:', error);
      setHackathons([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHackathons();
  }, [fetchHackathons]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHackathons();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <View style={styles.bannerContainer}>
        <Image 
          source={{ uri: item.banner || 'https://via.placeholder.com/400x150' }} 
          style={styles.banner} 
          resizeMode="cover"
        />
        <LinearGradient 
          colors={['transparent', 'rgba(0,0,0,0.8)']} 
          style={styles.bannerGradient}
        />
        <View style={styles.prizeBadge}>
          <Ionicons name="trophy" size={14} color="#fff" />
          <Text style={styles.prizeText}>{item.prizes}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.organizer}>{item.organizer.toUpperCase()}</Text>
          <View style={[styles.modeBadge, { backgroundColor: item.mode === 'Online' ? '#10b981' : '#3b82f6' }]}>
            <Text style={styles.modeText}>{item.mode}</Text>
          </View>
        </View>
        
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.metaValue}>{item.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.metaValue}>Teams of 3-4</Text>
          </View>
        </View>

        <View style={styles.tagRow}>
          {item.tags.map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.registerBtn}>
            <Text style={styles.registerBtnText}>Join Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={hackathons}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Upcoming Hackathons</Text>
              <Text style={styles.headerSub}>Explore national and international tech challenges</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  list: { padding: 20 },
  header: { marginBottom: 20 },
  headerTitle: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '800' },
  headerSub: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bannerContainer: { width: '100%', height: 160 },
  banner: { width: '100%', height: '100%' },
  bannerGradient: { ...StyleSheet.absoluteFillObject },
  prizeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  prizeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cardContent: { padding: 20 },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8,
  },
  organizer: { 
    color: COLORS.primary, 
    fontSize: 12, 
    fontWeight: '800', 
    letterSpacing: 1,
  },
  modeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  modeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  title: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800', marginBottom: 12 },
  metaInfo: { 
    flexDirection: 'row', 
    marginBottom: 20, 
    gap: 20,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaValue: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '500' },
  tagRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: COLORS.bgSecondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700' },
  registerBtn: {
    marginLeft: 'auto',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  registerBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});

export default HackathonsPage;
