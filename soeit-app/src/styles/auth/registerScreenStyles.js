import { StyleSheet } from 'react-native';
import { SPACING } from '../../constants/spacing';
import { getResponsiveFontSize } from '../../utils/responsive';
import { COLORS } from '../common/globalStyles';

/**
 * RegisterScreen Styles
 * Organized for cleaner component code
 */

export const registerScreenStyles = StyleSheet.create({
  // Container & Layout
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
    backgroundColor: '#ffffff',
  },

  // Header Section
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  backButtonText: {
    color: '#455a64',
    fontSize: getResponsiveFontSize(13),
    fontWeight: '600',
  },
  headerSection: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    width: '100%',
    marginBottom: SPACING.lg,
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
  },
  universityInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  universityName: {
    color: COLORS.secondary,
    fontSize: getResponsiveFontSize(12),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    width: 2,
    height: 18,
    backgroundColor: COLORS.secondary,
  },
  universityLocation: {
    color: '#90a4ae',
    fontSize: getResponsiveFontSize(10),
    marginTop: 2,
    fontWeight: '500',
  },
  naacBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
  },
  naacText: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(8),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  naacGrade: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(10),
    fontWeight: '900',
  },
  pageTitle: {
    fontSize: getResponsiveFontSize(26),
    fontWeight: '800',
    color: '#0f172a',
    marginTop: SPACING.md,
    letterSpacing: -0.3,
  },

  // Form Card
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.xl,
    elevation: 0,
    boxShadow: 'none',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
    backgroundColor: '#fafafa',
    padding: SPACING.sm,
    borderRadius: 8,
    borderWidth: 0,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: COLORS.secondary,
  },
  tabText: {
    color: COLORS.gray600,
    fontSize: getResponsiveFontSize(13),
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.white,
  },

  // Form Fields
  formGroup: {
    marginBottom: SPACING.xl,
  },
  fieldGroup: {
    marginBottom: SPACING.xl,
  },
  fieldLabel: {
    color: '#0f172a',
    fontSize: getResponsiveFontSize(13),
    fontWeight: '600',
    letterSpacing: 0,
    marginBottom: SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4d8dd',
    borderRadius: 6,
    paddingHorizontal: SPACING.lg,
    backgroundColor: '#f8f9fb',
    minHeight: 48,
    elevation: 0,
    boxShadow: 'none',
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    color: '#1f2937',
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
  },
  inputContainerFocused: {
    borderColor: '#c0c5cc',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    elevation: 0,
    boxShadow: 'none',
  },

  // Picker
  pickerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 0,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d4d8dd',
    borderRadius: 6,
    backgroundColor: '#f8f9fb',
    minHeight: 48,
    elevation: 0,
  },
  picker: {
    flex: 1,
    color: '#1f2937',
    height: 48,
    backgroundColor: 'transparent',
  },
  pickerItem: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
    color: '#1f2937',
  },

  // Layout
  twoColumnRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },

  // Button
  signupBtn: {
    backgroundColor: '#1e293b',
    paddingVertical: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
    elevation: 0,
    boxShadow: 'none',
  },
  signupBtnDisabled: {
    opacity: 0.6,
  },
  signupBtnText: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(15),
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Login Link
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  loginText: {
    color: '#64748b',
    fontSize: getResponsiveFontSize(13),
  },
  loginLink: {
    color: COLORS.secondary,
    fontSize: getResponsiveFontSize(13),
    fontWeight: '700',
  },
});

export default registerScreenStyles;
