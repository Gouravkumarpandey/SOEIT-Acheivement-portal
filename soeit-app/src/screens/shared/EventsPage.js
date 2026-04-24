import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'];

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    date: '',
    venue: '',
    registrationLink: '',
  });
  const [otherCategory, setOtherCategory] = useState('');

  const isStaff = user?.role === 'admin' || user?.role === 'faculty';

  const fetchEvents = useCallback(async () => {
    try {
      const params = selectedCategory !== 'All' ? { category: selectedCategory } : {};
      const res = await api.get('/events', { params });
      setEvents(res.data.data || []);
    } catch (error) {
      console.warn('Events API unavailable:', error.message);
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    setLoading(true);
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: String(d.getDate()).padStart(2, '0'),
      full: format(d, 'dd MMM yyyy'),
    };
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Technical',
      date: '',
      venue: '',
      registrationLink: '',
    });
    setOtherCategory('');
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditClick = (event) => {
    setEditingId(event._id);
    const isStandard = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar'].includes(event.category);
    setFormData({
      title: event.title,
      description: event.description,
      category: isStandard ? event.category : 'Other',
      date: event.date ? event.date.split('T')[0] : '',
      venue: event.venue,
      registrationLink: event.registrationLink || '',
    });
    if (!isStandard) setOtherCategory(event.category);
    setShowAddModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.date || !formData.venue) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const finalData = { ...formData };
      if (formData.category === 'Other' && otherCategory) {
        finalData.category = otherCategory;
      }

      if (editingId) {
        await api.put(`/events/${editingId}`, finalData);
        Alert.alert('Success', 'Event updated successfully');
      } else {
        await api.post('/events', finalData);
        Alert.alert('Success', 'Event added successfully');
      }
      setShowAddModal(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/events/${id}`);
              fetchEvents();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  const getCategoryColor = (category) => {
    const map = {
      Technical: '#4f46e5',
      Cultural: '#f59e0b',
      Sports: '#10b981',
      Workshop: '#8b5cf6',
      Seminar: '#06b6d4',
    };
    return map[category] || '#64748b';
  };

  const renderCategoryTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryContainer}
    >
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[
            styles.categoryChip,
            selectedCategory === cat && styles.categoryChipActive,
          ]}
          onPress={() => setSelectedCategory(cat)}
        >
          <Text
            style={[
              styles.categoryChipText,
              selectedCategory === cat && styles.categoryChipTextActive,
            ]}
          >
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderEventCard = ({ item }) => {
    const dateInfo = formatDate(item.date);
    const catColor = getCategoryColor(item.category);
    const canManage = isStaff && (user?.role === 'admin' || item.createdBy?._id === user?._id);

    return (
      <View style={styles.eventCard}>
        {/* Top section */}
        <View style={styles.cardTop}>
          {/* Date badge */}
          <View style={[styles.dateBadge, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.dateMonth}>{dateInfo.month}</Text>
            <Text style={styles.dateDay}>{dateInfo.day}</Text>
          </View>

          {/* Title + Category */}
          <View style={styles.cardTitleArea}>
            <View style={[styles.categoryBadge, { backgroundColor: catColor + '18' }]}>
              <Text style={[styles.categoryBadgeText, { color: catColor }]}>
                {item.category?.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.eventDescription} numberOfLines={3}>
          {item.description}
        </Text>

        {/* Meta info */}
        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <View style={styles.metaIconWrap}>
              <Ionicons name="location-outline" size={14} color={COLORS.primary} />
            </View>
            <Text style={styles.metaText}>{item.venue}</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaIconWrap}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.primary} />
            </View>
            <Text style={styles.metaText}>{dateInfo.full}</Text>
          </View>

          {item.registrationLink ? (
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => Linking.openURL(item.registrationLink)}
            >
              <Ionicons name="link-outline" size={14} color={COLORS.primary} />
              <Text style={styles.linkText}>Registration Link</Text>
              <Ionicons name="open-outline" size={12} color={COLORS.primary} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.creatorInfo}>
            <View style={styles.creatorAvatar}>
              <Text style={styles.creatorAvatarText}>
                {item.createdBy?.name?.charAt(0) || '?'}
              </Text>
            </View>
            <Text style={styles.creatorName}>{item.createdBy?.name || 'Admin'}</Text>
          </View>

          {canManage && (
            <View style={styles.actionBtns}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleEditClick(item)}
              >
                <Ionicons name="create-outline" size={18} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleDelete(item._id)}
              >
                <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => { setShowAddModal(false); resetForm(); }}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalKeyboard}
        >
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {editingId ? 'Edit Event' : 'Add New Event'}
                </Text>
                <Text style={styles.modalSubtitle}>Fill in the event details below</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => { setShowAddModal(false); resetForm(); }}
              >
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Title */}
              <Text style={styles.fieldLabel}>Event Title *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter event name..."
                placeholderTextColor={COLORS.textMuted}
                value={formData.title}
                onChangeText={(v) => setFormData({ ...formData, title: v })}
              />

              {/* Category */}
              <Text style={styles.fieldLabel}>Category *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.formCatRow}
              >
                {CATEGORIES.slice(1).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.formCatChip,
                      formData.category === cat && styles.formCatChipActive,
                    ]}
                    onPress={() => setFormData({ ...formData, category: cat })}
                  >
                    <Text
                      style={[
                        styles.formCatText,
                        formData.category === cat && styles.formCatTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Other Category */}
              {formData.category === 'Other' && (
                <>
                  <Text style={styles.fieldLabel}>Custom Category *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter category type..."
                    placeholderTextColor={COLORS.textMuted}
                    value={otherCategory}
                    onChangeText={setOtherCategory}
                  />
                </>
              )}

              {/* Date */}
              <Text style={styles.fieldLabel}>Date * (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 2026-05-15"
                placeholderTextColor={COLORS.textMuted}
                value={formData.date}
                onChangeText={(v) => setFormData({ ...formData, date: v })}
                keyboardType="numbers-and-punctuation"
              />

              {/* Venue */}
              <Text style={styles.fieldLabel}>Venue *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Auditorium"
                placeholderTextColor={COLORS.textMuted}
                value={formData.venue}
                onChangeText={(v) => setFormData({ ...formData, venue: v })}
              />

              {/* Registration Link */}
              <Text style={styles.fieldLabel}>Registration Link (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="https://external-link.com"
                placeholderTextColor={COLORS.textMuted}
                value={formData.registrationLink}
                onChangeText={(v) => setFormData({ ...formData, registrationLink: v })}
                keyboardType="url"
                autoCapitalize="none"
              />

              {/* Description */}
              <Text style={styles.fieldLabel}>Description *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Enter event details..."
                placeholderTextColor={COLORS.textMuted}
                value={formData.description}
                onChangeText={(v) => setFormData({ ...formData, description: v })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Submit */}
              <TouchableOpacity
                style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>
                    {editingId ? 'Save Changes' : 'Add Event'}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={(item) => item._id?.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListHeaderComponent={
            <View>
              <Text style={styles.headerSubtitle}>
                View all upcoming workshops, seminars, and fests on campus.
              </Text>
              {renderCategoryTabs()}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="calendar-outline" size={48} color={COLORS.border} />
              </View>
              <Text style={styles.emptyTitle}>No Events Found</Text>
              <Text style={styles.emptySubtitle}>
                No events found in this category.
              </Text>
            </View>
          }
        />
      )}

      {/* FAB for Add Event — Staff only */}
      {isStaff && (
        <TouchableOpacity style={styles.fab} onPress={handleOpenAdd} activeOpacity={0.85}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Add/Edit Modal */}
      {renderAddModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },

  // Category Tabs
  categoryContainer: {
    gap: 8,
    paddingBottom: 16,
    paddingRight: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  categoryChipTextActive: {
    color: '#fff',
  },

  // Event Card
  eventCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 0,
    gap: 14,
    alignItems: 'flex-start',
  },
  dateBadge: {
    width: 54,
    height: 60,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.5,
  },
  dateDay: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 26,
  },
  cardTitleArea: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 22,
  },

  // Description
  eventDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    paddingHorizontal: 20,
    paddingTop: 14,
  },

  // Meta
  metaSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Card Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: '#f8fafc',
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  creatorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorAvatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  creatorName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgPrimary,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalKeyboard: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  modalSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Form
  fieldLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginTop: 12,
  },
  textInput: {
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 100,
    paddingTop: 13,
  },
  formCatRow: {
    gap: 8,
    paddingVertical: 4,
  },
  formCatChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formCatChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  formCatText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  formCatTextActive: {
    color: '#fff',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default EventsPage;
