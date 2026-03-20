import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

const Button = ({
  title,
  onPress,
  loading = false,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  style,
  textStyle,
  disabled = false,
}) => {
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';

  const getGradientColors = () => {
    if (disabled) return [COLORS.textMuted, COLORS.textMuted];
    if (isSecondary) return COLORS.gradientSecondary;
    if (isDanger) return [COLORS.danger, COLORS.danger];
    return COLORS.gradientPrimary;
  };

  const getBorderColor = () => {
    if (disabled) return COLORS.textMuted;
    if (isSecondary) return COLORS.accent;
    if (isDanger) return COLORS.danger;
    return COLORS.primary;
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : COLORS.textPrimary} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            size === 'sm' && styles.textSm,
            size === 'lg' && styles.textLg,
            isOutline && { color: COLORS.primary },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </>
  );

  if (isOutline) {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          styles.outline,
          { borderColor: getBorderColor() },
          size === 'sm' && styles.btnSm,
          size === 'lg' && styles.btnLg,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        size === 'sm' && styles.btnSm,
        size === 'lg' && styles.btnLg,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {content}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 10,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  outline: {
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
  textSm: { fontSize: 13 },
  textLg: { fontSize: 18 },
  btnSm: { borderRadius: 8 },
  btnLg: { borderRadius: 16 },
});

export default Button;
