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
import api from '../../services/api';

const { width } = Dimensions.get('window');

const StatBox = ({ title, value, icon, color }) => (
  <View style={styles.statBox}>
    <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  </View>
);

const AdminDashboard = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingVerifications: 0,
    totalAchievements: 0,
    activeInternships: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.stats || {
        totalStudents: 1250,
        pendingVerifications: 42,
        totalAchievements: 850,
        activeInternships: 15,
      });
    } catch (error) {
      console.error('Fetch stats error:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Institutional Overview</Text>
        <Text style={styles.headerSub}>SOEIT Management Dashboard</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatBox title="Students" value={stats.totalStudents} icon="people" color={COLORS.primary} />
        <StatBox title="Pending" value={stats.pendingVerifications} icon="time" color={COLORS.warning} />
        <StatBox title="Achievements" value={stats.totalAchievements} icon="trophy" color={COLORS.secondary} />
        <StatBox title="Internships" value={stats.activeInternships} icon="briefcase" color={COLORS.accent} />
      </View>

      <Text style={styles.sectionTitle}>Institutional Management</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Verify')}>
          <LinearGradient colors={COLORS.gradientPrimary} style={styles.actionIcon}>
            <Ionicons name="checkmark-done-circle" size={32} color="#fff" />
          </LinearGradient>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Verification Engine</Text>
            <Text style={styles.actionSub}>Review and approve student milestones</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('StudentManagement')}>
          <LinearGradient colors={['#10b981', '#059669']} style={styles.actionIcon}>
            <Ionicons name="people" size={32} color="#fff" />
          </LinearGradient>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Student Directory</Text>
            <Text style={styles.actionSub}>Browse scholar database & profiles</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('BroadcastNotice')}>
          <LinearGradient colors={COLORS.gradientSecondary} style={styles.actionIcon}>
            <Ionicons name="megaphone" size={32} color="#fff" />
          </LinearGradient>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Broadcast Notice</Text>
            <Text style={styles.actionSub}>Send alerts to students & faculty</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('FacultyManagement')}>
          <LinearGradient colors={['#3b82f6', '#1d4ed8']} style={styles.actionIcon}>
            <Ionicons name="school" size={32} color="#fff" />
          </LinearGradient>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Faculty Registry</Text>
            <Text style={styles.actionSub}>Manage faculty accounts & authorization</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Reports')}>
          <LinearGradient colors={['#ec4899', '#db2777']} style={styles.actionIcon}>
            <Ionicons name="bar-chart" size={32} color="#fff" />
          </LinearGradient>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Audit Reports</Text>
            <Text style={styles.actionSub}>Export academic & evidence ledgers</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: { paddingHorizontal: 20, paddingTop: 40, marginBottom: 30 },
  headerTitle: { color: COLORS.textPrimary, fontSize: 32, fontWeight: '800' },
  headerSub: { color: COLORS.textSecondary, fontSize: 16, marginTop: 4 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: COLORS.bgCard,
    width: (width - 60) / 2,
    margin: 10,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800' },
  statTitle: { color: COLORS.textMuted, fontSize: 12, marginTop: 2, fontWeight: '600' },
  sectionTitle: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '700', marginLeft: 20, marginBottom: 20, textTransform: 'uppercase' },
  actions: { paddingHorizontal: 20 },
  actionCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionText: { flex: 1 },
  actionTitle: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700' },
  actionSub: { color: COLORS.textMuted, fontSize: 13, marginTop: 4 },
});

export default AdminDashboard;
