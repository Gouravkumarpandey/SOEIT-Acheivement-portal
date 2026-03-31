import React, { useState, useCallback, useMemo } from 'react';
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
  TextInput,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { HACKATHONS } from '../../constants/hackathons';

const { width } = Dimensions.get('window');

const HackathonsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const categories = useMemo(() => {
    const types = Array.from(new Set(HACKATHONS.map(h => h.type)));
    return ['All', ...types.sort()];
  }, []);

  const filteredHackathons = useMemo(() => {
    return HACKATHONS.filter(h => {
      const matchesCategory = activeCategory === 'All' || h.type === activeCategory;
      const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            h.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleApply = (link) => {
    if (link) Linking.openURL(link);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryBtn,
        activeCategory === item && styles.categoryBtnActive
      ]}
      onPress={() => setActiveCategory(item)}
    >
      <Text style={[
        styles.categoryText,
        activeCategory === item && styles.categoryTextActive
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderHackathonCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.img }} style={styles.cardBanner} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.cardGradient}
      />
      <View style={styles.badgeContainer}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        {item.badge && (
          <View style={[styles.typeBadge, { backgroundColor: COLORS.secondary }]}>
            <Text style={styles.typeText}>{item.badge}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="people-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.statText}>{item.students}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.statText}>{item.days}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.prizeLabel}>Prize Pool</Text>
            <Text style={styles.prizeValue} numberOfLines={1}>{item.prize}</Text>
          </View>
          <TouchableOpacity 
            style={styles.applyBtn}
            onPress={() => handleApply(item.link)}
          >
            <Text style={styles.applyBtnText}>Apply</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hackathons..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <FlatList
        data={filteredHackathons}
        renderItem={renderHackathonCard}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="rocket-outline" size={60} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Hackathons Found</Text>
            <Text style={styles.emptySub}>Try adjusting your search or category</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: { padding: 20, paddingBottom: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: { flex: 1, color: COLORS.textPrimary, marginLeft: 10, fontSize: 16 },
  categoryContainer: { marginBottom: 15 },
  categoryList: { paddingHorizontal: 15 },
  categoryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.bgCard,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoryText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 14 },
  categoryTextActive: { color: '#fff' },
  list: { padding: 15 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  cardBanner: { width: '100%', height: 160 },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  badgeContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  typeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  cardContent: { padding: 20 },
  cardTitle: { color: COLORS.textPrimary, fontSize: 19, fontWeight: '800', marginBottom: 10 },
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  prizeLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  prizeValue: { color: COLORS.success, fontSize: 17, fontWeight: '800', marginTop: 2 },
  applyBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  applyBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '800', marginTop: 20 },
  emptySub: { color: COLORS.textMuted, fontSize: 14, marginTop: 4 },
});

export default HackathonsPage;
