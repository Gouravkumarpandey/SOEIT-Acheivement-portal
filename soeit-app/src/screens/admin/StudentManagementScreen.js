import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { ROUTES } from '../../constants/api';

const StudentManagementScreen = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('all');

  const fetchStudents = useCallback(async () => {
    try {
      const params = {
        semester: semester === 'all' ? undefined : semester,
        search: search || undefined,
        limit: 50
      };
      const res = await api.get(ROUTES.ADMIN_STUDENTS, { params });
      setStudents(res.data.data || []);
    } catch (error) {
      console.error('Fetch students error:', error);
      setStudents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, semester]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => Alert.alert('Student Profile', `Managing ${item.name}`)}
    >
      <View style={styles.cardContent}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.detail}>{item.enrollmentNo || 'ID: ' + item.id} • Sem {item.semester}</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.points}>{item.achievementCounts?.points || 0}</Text>
          <Text style={styles.statLabel}>Pts</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.achievementCounts?.approved || 0} Approved</Text>
        </View>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="eye-outline" size={18} color={COLORS.primary} />
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="create-outline" size={18} color={COLORS.secondary} />
          <Text style={[styles.actionText, { color: COLORS.secondary }]}>Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or ID..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.filterBtn, semester === 'all' && styles.filterBtnActive]} 
            onPress={() => setSemester('all')}
          >
            <Text style={[styles.filterText, semester === 'all' && styles.filterTextActive]}>All Semesters</Text>
          </TouchableOpacity>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
            <TouchableOpacity 
              key={s}
              style={[styles.filterBtn, semester === s.toString() && styles.filterBtnActive]} 
              onPress={() => setSemester(s.toString())}
            >
              <Text style={[styles.filterText, semester === s.toString() && styles.filterTextActive]}>Sem {s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={item => (item.id || item._id).toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Students Found</Text>
            <Text style={styles.emptySub}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  searchContainer: { padding: 20, paddingTop: 10 },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 50,
  },
  searchInput: { flex: 1, color: COLORS.textPrimary, marginLeft: 10, fontSize: 16 },
  filterBar: { paddingHorizontal: 15, marginBottom: 15 },
  filterBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 13 },
  filterTextActive: { color: '#fff' },
  list: { padding: 20, paddingTop: 0 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: { color: COLORS.primary, fontSize: 20, fontWeight: '800' },
  name: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700' },
  detail: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  stats: { alignItems: 'center', minWidth: 50 },
  points: { color: COLORS.primary, fontSize: 20, fontWeight: '900' },
  statLabel: { color: COLORS.textMuted, fontSize: 10, fontWeight: '800' },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 15,
  },
  badge: {
    backgroundColor: COLORS.success + '15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: { color: COLORS.success, fontSize: 11, fontWeight: '800' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { color: COLORS.primary, fontSize: 13, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '800', marginTop: 20 },
  emptySub: { color: COLORS.textMuted, fontSize: 14, marginTop: 4 },
});

export default StudentManagementScreen;
