import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { ROUTES } from '../../constants/api';

const StatCard = ({ label, value, icon, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const FacultyDashboard = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, studentsRes] = await Promise.all([
        api.get(ROUTES.ADMIN_STATS),
        api.get(ROUTES.ADMIN_STUDENTS, { params: { limit: 10 } })
      ]);
      setStats(statsRes.data.stats);
      setStudents(studentsRes.data.data || []);
    } catch (error) {
      console.error('Faculty Dashboard Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.studentCard}
      onPress={() => Alert.alert('Student Insight', `Viewing portfolio of ${item.name}`)}
    >
      <View style={styles.studentAvatar}>
        <Text style={styles.avatarText}>{item.name[0]}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentDetail}>{item.enrollmentNo || 'No ID'} • Sem {item.semester}</Text>
      </View>
      <View style={styles.pointBadge}>
        <Text style={styles.pointText}>{item.achievementCounts?.points || 0}</Text>
        <Text style={styles.pointLabel}>Pts</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      <LinearGradient
        colors={[COLORS.bgSecondary, COLORS.bgPrimary]}
        style={styles.header}
      >
        <Text style={styles.greeting}>Faculty Dashboard</Text>
        <Text style={styles.subGreeting}>Manage students and monitor progress</Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <StatCard label="Total Students" value={stats?.totalStudents || 0} icon="people" color={COLORS.primary} />
        <StatCard label="Pending" value={stats?.pendingCount || 0} icon="time" color={COLORS.warning} />
      </View>
      <View style={styles.statsRow}>
        <StatCard label="Approved" value={stats?.approvedCount || 0} icon="checkmark-circle" color={COLORS.success} />
        <StatCard label="Verifications" value="Check" icon="shield-checkmark" color={COLORS.secondary} />
      </View>

      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('VerifyDetail')}>
            <LinearGradient colors={['#8b5cf6', '#6d28d9']} style={styles.actionGradient}>
              <Ionicons name="checkmark-done" size={24} color="#fff" />
              <Text style={styles.actionText}>Verify Queue</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('BroadcastNotice')}>
            <LinearGradient colors={['#ec4899', '#be185d']} style={styles.actionGradient}>
              <Ionicons name="megaphone" size={24} color="#fff" />
              <Text style={styles.actionText}>Send Notice</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Students</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={students}
          renderItem={renderStudentItem}
          keyExtractor={item => (item.id || item._id).toString()}
          scrollEnabled={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No students found</Text>}
        />
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: { padding: 25, paddingBottom: 40 },
  greeting: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary },
  subGreeting: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 15, paddingHorizontal: 20, marginBottom: 15 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  actionSection: { padding: 20 },
  actionButtons: { flexDirection: 'row', gap: 15, marginTop: 15 },
  actionBtn: { flex: 1 },
  actionGradient: {
    padding: 15,
    borderRadius: 18,
    alignItems: 'center',
    gap: 8,
  },
  actionText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  seeAll: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  studentAvatar: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: { color: COLORS.primary, fontSize: 18, fontWeight: '800' },
  studentName: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700' },
  studentDetail: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  pointBadge: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  pointText: { color: COLORS.primary, fontSize: 16, fontWeight: '900' },
  pointLabel: { color: COLORS.textMuted, fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  emptyText: { color: COLORS.textMuted, textAlign: 'center', marginTop: 20 },
});

export default FacultyDashboard;
