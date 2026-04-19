import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal,
  ScrollView,
  Linking,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { ROUTES } from '../../constants/api';

// ─── Category tag colors ─────────────────────────────────────────────────────
const TAG_COLORS = {
  Remote:    { bg: '#dcfce7', fg: '#166534' },
  'On-site': { bg: '#dbeafe', fg: '#1e40af' },
  Hybrid:    { bg: '#ede9fe', fg: '#5b21b6' },
  'In-office':{ bg: '#fef3c7', fg: '#92400e' },
};
const getTagColor = (type) => TAG_COLORS[type] || { bg: '#f1f5f9', fg: '#475569' };

// ─── Helper: deadline tag ────────────────────────────────────────────────────
const deadlineDaysLeft = (deadline) => {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
};

const InternshipOpportunitiesPage = () => {
  const [postings, setPostings]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [search, setSearch]               = useState('');
  const [selected, setSelected]           = useState(null);   // detail modal
  const searchTimer                       = useRef(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchPostings = useCallback(async (q = '') => {
    try {
      const res = await api.get(ROUTES.INTERNSHIP_POSTINGS, {
        params: { search: q || undefined, limit: 100 },
      });
      setPostings(res.data.data || res.data.internships || []);
    } catch {
      setPostings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchPostings(); }, [fetchPostings]);

  // debounced search
  const handleSearch = (text) => {
    setSearch(text);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchPostings(text), 400);
  };

  const onRefresh = () => { setRefreshing(true); fetchPostings(search); };

  // ── Card ───────────────────────────────────────────────────────────────────
  const renderCard = ({ item, index }) => {
    const tag      = getTagColor(item.type || item.work_type);
    const days     = deadlineDaysLeft(item.deadline);
    const urgent   = days !== null && days <= 5;

    return (
      <View style={[styles.card, { marginLeft: index % 2 !== 0 ? 8 : 0 }]}>
        {/* Top */}
        <View style={styles.cardTop}>
          {/* Company logo placeholder */}
          <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.companyIcon}>
            <Text style={styles.companyChar}>
              {(item.company_name || item.company || 'I').charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>

          {/* ACTIVE badge */}
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeBadgeText}>ACTIVE</Text>
          </View>
        </View>

        {/* Title & Company */}
        <Text style={styles.cardRole} numberOfLines={2}>
          {item.role || item.title}
        </Text>
        <Text style={styles.cardCompany} numberOfLines={1}>
          {item.company_name || item.company}
        </Text>

        {/* Meta */}
        <View style={styles.metaCol}>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.location || 'Remote'}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="cash-outline" size={13} color="#10b981" />
            <Text style={[styles.metaText, { color: '#10b981' }]} numberOfLines={1}>
              {item.stipend || 'Unpaid / Discussed'}
            </Text>
          </View>
          {days !== null && (
            <View style={styles.metaRow}>
              <Ionicons
                name="time-outline"
                size={13}
                color={urgent ? '#ef4444' : COLORS.textMuted}
              />
              <Text style={[styles.metaText, urgent && { color: '#ef4444', fontWeight: '700' }]}>
                {days <= 0 ? 'Deadline passed' : `${days} days left`}
              </Text>
            </View>
          )}
        </View>

        {/* Type tag */}
        {(item.type || item.work_type) && (
          <View style={[styles.typeTag, { backgroundColor: tag.bg }]}>
            <Text style={[styles.typeTagText, { color: tag.fg }]}>
              {item.type || item.work_type}
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.detailBtn}
            onPress={() => setSelected(item)}
          >
            <Text style={styles.detailBtnText}>View Details</Text>
          </TouchableOpacity>

          {(item.apply_link || item.applyLink) && (
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => Linking.openURL(item.apply_link || item.applyLink)}
            >
              <Text style={styles.applyBtnText}>Apply</Text>
              <Ionicons name="arrow-forward" size={13} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // ── Detail Modal ───────────────────────────────────────────────────────────
  const DetailModal = () => {
    if (!selected) return null;
    const days   = deadlineDaysLeft(selected.deadline);
    const urgent = days !== null && days <= 5;

    return (
      <Modal
        visible={!!selected}
        animationType="slide"
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* Modal hero header */}
            <LinearGradient colors={['#0f172a', '#1e3a8a']} style={styles.modalHero}>
              <View style={styles.modalHeroRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalRole}>
                    {selected.role || selected.title}
                  </Text>
                  <Text style={styles.modalCompany}>
                    {selected.company_name || selected.company}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelected(null)}
                  style={styles.modalCloseBtn}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Posted by */}
              {selected.creator?.name && (
                <View style={styles.postedByRow}>
                  <Ionicons name="shield-checkmark" size={13} color="#93c5fd" />
                  <Text style={styles.postedByText}>
                    Posted by {selected.creator.name} · VERIFIED
                  </Text>
                </View>
              )}
            </LinearGradient>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {/* Stats row */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>LOCATION</Text>
                  <Text style={styles.statValue}>
                    {selected.location || 'Remote'}
                  </Text>
                </View>
                <View style={[styles.statBox, styles.statBoxMid]}>
                  <Text style={styles.statLabel}>STIPEND</Text>
                  <Text style={[styles.statValue, { color: '#10b981' }]}>
                    {selected.stipend || 'N/A'}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>DEADLINE</Text>
                  <Text style={[styles.statValue, urgent && { color: '#ef4444' }]}>
                    {days === null
                      ? 'Open'
                      : days <= 0
                      ? 'Passed'
                      : `${days} days`}
                  </Text>
                </View>
              </View>

              {/* Description */}
              {selected.description ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>About the Role</Text>
                  <Text style={styles.sectionBody}>{selected.description}</Text>
                </View>
              ) : null}

              {/* Requirements */}
              {selected.requirements ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Requirements</Text>
                  <Text style={styles.sectionBody}>{selected.requirements}</Text>
                </View>
              ) : null}

              {/* Additional meta */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Details</Text>
                <View style={styles.detailGrid}>
                  {[
                    { label: 'Work Type', value: selected.type || selected.work_type || 'Not specified', icon: 'briefcase-outline' },
                    { label: 'Duration', value: selected.duration || 'Not specified', icon: 'time-outline' },
                    { label: 'Application Deadline', value: selected.deadline || 'Open', icon: 'calendar-outline' },
                  ].map(d => (
                    <View key={d.label} style={styles.detailItem}>
                      <Ionicons name={d.icon} size={16} color={COLORS.primary} />
                      <View style={{ marginLeft: 10 }}>
                        <Text style={styles.detailLabel}>{d.label}</Text>
                        <Text style={styles.detailValue}>{d.value}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Footer actions */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelected(null)}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>

              {(selected.apply_link || selected.applyLink) && (
                <TouchableOpacity
                  style={styles.applyBtnLg}
                  onPress={() => Linking.openURL(selected.apply_link || selected.applyLink)}
                >
                  <LinearGradient
                    colors={['#1e3a8a', '#3b82f6']}
                    style={styles.applyBtnLgInner}
                  >
                    <Ionicons name="open-outline" size={18} color="#fff" />
                    <Text style={styles.applyBtnLgText}>Apply Now</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // ── Main Render ────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by company or role..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => { setSearch(''); fetchPostings(''); }}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Finding opportunities…</Text>
        </View>
      ) : (
        <FlatList
          data={postings}
          renderItem={renderCard}
          keyExtractor={(item, idx) => (item.id || item._id || idx).toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListHeaderComponent={
            <View style={styles.pageHeader}>
              <Text style={styles.pageTitle}>Internship Postings</Text>
              <Text style={styles.pageSub}>
                {postings.length > 0
                  ? `${postings.length} active opportunit${postings.length !== 1 ? 'ies' : 'y'} from faculty & partners`
                  : 'Internship opportunities from faculty and partner companies'}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="briefcase-outline" size={42} color="#3b82f6" />
              </View>
              <Text style={styles.emptyTitle}>
                {search ? 'No results found' : 'No Opportunities Yet'}
              </Text>
              <Text style={styles.emptyDesc}>
                {search
                  ? `No internships matched "${search}". Try a different search.`
                  : 'Faculty and partner companies will post internship opportunities here. Check back soon!'}
              </Text>
            </View>
          }
        />
      )}

      <DetailModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },

  // ── Search ──────────────────────────────────────────────────────────────────
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    margin: 16, marginBottom: 8,
    borderRadius: 14, paddingHorizontal: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 13, color: COLORS.textPrimary, fontSize: 14, fontWeight: '500' },

  // ── List ────────────────────────────────────────────────────────────────────
  list: { padding: 16, paddingTop: 8, paddingBottom: 40 },
  row: { justifyContent: 'space-between' },
  pageHeader: { marginBottom: 16 },
  pageTitle: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '800' },
  pageSub: { color: COLORS.textSecondary, fontSize: 13, marginTop: 3, lineHeight: 18 },

  // ── Card ────────────────────────────────────────────────────────────────────
  card: {
    flex: 1, backgroundColor: COLORS.bgCard,
    borderRadius: 18, padding: 14, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  companyIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  companyChar: { color: '#fff', fontWeight: '900', fontSize: 18 },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#dcfce7', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#16a34a' },
  activeBadgeText: { color: '#166534', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },

  cardRole: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '800', lineHeight: 19, marginBottom: 3 },
  cardCompany: { color: '#3b82f6', fontSize: 13, fontWeight: '700', marginBottom: 10 },

  metaCol: { gap: 5, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: COLORS.textMuted, fontSize: 12, flex: 1 },

  typeTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7, marginBottom: 12 },
  typeTagText: { fontSize: 11, fontWeight: '700' },

  cardActions: { flexDirection: 'row', gap: 6 },
  detailBtn: {
    flex: 1, paddingVertical: 9, borderRadius: 10,
    borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.bgSecondary,
    alignItems: 'center',
  },
  detailBtnText: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 12 },
  applyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#1e3a8a', paddingHorizontal: 10, paddingVertical: 9, borderRadius: 10,
  },
  applyBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  // ── Loading / Empty ─────────────────────────────────────────────────────────
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: COLORS.textMuted, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 30 },
  emptyIconWrap: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  emptyDesc: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 },

  // ── Detail Modal ────────────────────────────────────────────────────────────
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.bgCard, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '92%', overflow: 'hidden' },

  modalHero: { padding: 22, paddingTop: 26 },
  modalHeroRow: { flexDirection: 'row', alignItems: 'flex-start' },
  modalRole: { color: '#fff', fontSize: 20, fontWeight: '900', lineHeight: 26 },
  modalCompany: { color: '#93c5fd', fontSize: 15, fontWeight: '700', marginTop: 4 },
  modalCloseBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  postedByRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  postedByText: { color: '#93c5fd', fontSize: 12, fontWeight: '600' },

  statsRow: {
    flexDirection: 'row', margin: 20, borderRadius: 16,
    backgroundColor: COLORS.bgSecondary, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
  },
  statBox: { flex: 1, padding: 14, alignItems: 'center' },
  statBoxMid: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: COLORS.border },
  statLabel: { color: COLORS.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  statValue: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '800', textAlign: 'center' },

  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '800', marginBottom: 8 },
  sectionBody: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22 },

  detailGrid: { gap: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgSecondary, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  detailLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', marginBottom: 2 },
  detailValue: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700' },

  modalFooter: {
    flexDirection: 'row', gap: 12, padding: 16,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    backgroundColor: COLORS.bgSecondary,
  },
  closeBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', backgroundColor: COLORS.bgCard },
  closeBtnText: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 15 },
  applyBtnLg: { flex: 1.5, borderRadius: 14, overflow: 'hidden' },
  applyBtnLgInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  applyBtnLgText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});

export default InternshipOpportunitiesPage;
