import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const StatCard = ({ title, value, icon, colors, label }) => (
  <TouchableOpacity style={styles.statCard}>
    <LinearGradient colors={colors} style={styles.statIcon}>
      <Ionicons name={icon} size={24} color="#fff" />
    </LinearGradient>
    <View style={styles.statContent}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const StudentDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    verified: 0,
    pending: 0,
    total: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/achievements/my');
      const achs = res.data.achievements || [];
      const stats = {
        verified: achs.filter(a => a.status === 'verified').length,
        pending: achs.filter(a => a.status === 'pending').length,
        total: achs.length,
      };
      setStats(stats);
    } catch (error) {
      console.error('Stats fetch error:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      <LinearGradient colors={COLORS.gradientDark} style={styles.header}>
        <View style={styles.userInfo}>
          <View>
            <Text style={styles.welcomeText}>Hello, {user?.name.split(' ')[0]} 👋</Text>
            <Text style={styles.enrollText}>{user?.enrollmentNo}</Text>
          </View>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => navigation.navigate('Profile')}
          >
            <LinearGradient colors={COLORS.gradientPrimary} style={styles.avatar}>
              <Text style={styles.avatarChar}>{user?.name[0]}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatCard 
            title="Verified" 
            value={stats.verified} 
            icon="checkmark-done-circle" 
            colors={['#10b981', '#059669']} 
          />
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            icon="time" 
            colors={['#f59e0b', '#d97706']} 
          />
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.actionsGrid}>
          {[
            { label: 'Upload', icon: 'cloud-upload-outline', color: COLORS.primary, route: 'Upload' },
            { label: 'Achievements', icon: 'trophy-outline', color: '#8b5cf6', route: 'Achievements' },
            { label: 'Academic', icon: 'book-outline', color: '#10b981', route: 'Courses' },
            { label: 'Projects', icon: 'code-slash-outline', color: '#f59e0b', route: 'Projects' },
            { label: 'Internships', icon: 'briefcase-outline', color: '#06b6d4', route: 'Internships' },
            { label: 'Portfolios', icon: 'globe-outline', color: '#ec4899', route: 'Profile' },
          ].map((action, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.actionItem}
              onPress={() => navigation.navigate(action.route)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon} size={28} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.banner} 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Hackathons')}
      >
        <LinearGradient
          colors={COLORS.gradientSecondary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bannerGradient}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>AJU Hackathons Hub</Text>
            <Text style={styles.bannerDesc}>Participate in 90+ upcoming hackathons</Text>
            <View style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>View Listing</Text>
            </View>
          </View>
          <Ionicons name="rocket-outline" size={80} color="rgba(255,255,255,0.2)" style={styles.bannerIcon} />
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  enrollText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 2,
  },
  avatar: {
    flex: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarChar: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: COLORS.bgCard,
    width: (width - 60) / 2,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  section: { padding: 20, marginTop: 10 },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: (width - 60) / 2,
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  banner: {
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
  },
  bannerGradient: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerContent: { flex: 1, zIndex: 1 },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  bannerDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    marginBottom: 16,
  },
  bannerBtn: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  bannerIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    transform: [{ rotate: '-15deg' }],
  },
});

export default StudentDashboard;
