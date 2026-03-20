import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const ProfileItem = ({ icon, label, value, color = COLORS.primary }) => (
  <View style={styles.profileItem}>
    <View style={[styles.itemIcon, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <View style={styles.itemContent}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value || 'Not Set'}</Text>
    </View>
  </View>
);

const ProfileScreen = () => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <LinearGradient
          colors={isAdmin ? COLORS.gradientSecondary : COLORS.gradientPrimary}
          style={styles.avatarLarge}
        >
          <Text style={styles.avatarChar}>{user?.name[0]}</Text>
        </LinearGradient>
        <Text style={styles.userName}>{user?.name}</Text>
        <View style={[styles.roleLabel, { backgroundColor: isAdmin ? COLORS.secondary + '20' : COLORS.primary + '20' }]}>
          <Text style={[styles.roleText, { color: isAdmin ? COLORS.secondary : COLORS.primary }]}>
            {user?.role.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.card}>
          <ProfileItem
            icon="mail-outline"
            label="Email Address"
            value={user?.email}
          />
          <View style={styles.divider} />
          {user?.enrollmentNo && (
            <>
              <ProfileItem
                icon="id-card-outline"
                label="Enrollment Number"
                value={user?.enrollmentNo}
                color={COLORS.secondary}
              />
              <View style={styles.divider} />
            </>
          )}
          {!isAdmin && (
            <>
              <TouchableOpacity
                style={styles.resumeBtn}
                activeOpacity={0.8}
                onPress={() => Alert.alert('Resume Hub', 'Your professional resume is being generated using the SOEIT Engine...')}
              >
                <LinearGradient
                  colors={['#06b6d4', '#3b82f6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.resumeGradient}
                >
                  <Ionicons name="document-text" size={20} color="#fff" />
                  <Text style={styles.resumeText}>Generate AI Resume</Text>
                  <Ionicons name="sparkles" size={16} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
              <View style={styles.divider} />
            </>
          )}
          <ProfileItem
            icon="call-outline"
            label="Joined On"
            value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'August 2024'}
            color="#ec4899"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings & Preferences</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.textSecondary} />
            <Text style={styles.menuText}>Push Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.textSecondary} />
            <Text style={styles.menuText}>Security & Privacy</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={22} color={COLORS.textSecondary} />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <Button
        title="Logout Account"
        onPress={handleLogout}
        variant="danger"
        style={styles.logoutBtn}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>SoEIT Achievement Portal v1.0.0</Text>
        <Text style={styles.footerSub}>Designed by Ritesh Kumar</Text>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: {
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: COLORS.bgSecondary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  avatarChar: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  roleLabel: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 16,
    marginLeft: 4,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemContent: { flex: 1 },
  itemLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 16,
  },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 40,
  },
  resumeBtn: {
    marginVertical: 12,
  },
  resumeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  resumeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  footerSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
});

export default ProfileScreen;
