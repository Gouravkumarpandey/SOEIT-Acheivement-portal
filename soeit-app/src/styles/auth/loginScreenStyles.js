import { StyleSheet } from 'react-native';
import { SPACING } from '../../constants/spacing';
import { getResponsiveFontSize } from '../../utils/responsive';
import { COLORS } from '../common/globalStyles';

/**
 * LoginScreen Styles
 */

export const loginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingTop: SPACING.xl * 1.5,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  headerSection: {
    marginBottom: SPACING.sm,
    alignItems: 'center',
    paddingTop: 0,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    width: '100%',
    marginBottom: SPACING.xs,
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  logoText: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
  },
  universityInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  universityName: {
    color: COLORS.secondary,
    fontSize: getResponsiveFontSize(13),
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  divider: {
    width: 2,
    height: 22,
    backgroundColor: COLORS.secondary,
    marginHorizontal: SPACING.sm,
  },
  universityLocation: {
    color: COLORS.gray500,
    fontSize: getResponsiveFontSize(11),
    marginTop: 2,
  },
  naacBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 55,
  },
  naacText: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(9),
    fontWeight: '700',
  },
  naacGrade: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(11),
    fontWeight: '900',
  },
  pageTitle: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
  },
  subtitle: {
    fontSize: getResponsiveFontSize(14),
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.lg,
    marginVertical: SPACING.md,
    elevation: 1,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    color: COLORS.gray700,
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.gray50,
    minHeight: 52,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    color: COLORS.gray700,
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
  },
  eyeIcon: {
    padding: SPACING.md,
  },
  rememberMeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  rememberText: {
    fontSize: getResponsiveFontSize(12),
    color: COLORS.textSecondary,
  },
  forgotLink: {
    fontSize: getResponsiveFontSize(12),
    color: COLORS.secondary,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SPACING.xl,
    elevation: 2,
    boxShadow: '0 3px 6px rgba(139, 0, 0, 0.3)',
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(16),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  signupText: {
    color: COLORS.textMuted,
    fontSize: getResponsiveFontSize(12),
  },
  signupLink: {
    color: COLORS.secondary,
    fontSize: getResponsiveFontSize(12),
    fontWeight: '700',
  },
});

export default loginScreenStyles;
