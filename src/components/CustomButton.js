// src/components/CustomButton.js (actualización parcial)
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const CustomButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style = {},
  textStyle = {},
  variant = 'primary',
  icon,
  iconPosition = 'left',
  gradientColors,
  ...props
}) => {
  
  // Determinar colores según variante
  const getButtonColors = () => {
    switch (variant) {
      case 'success':
        return {
          gradient: [colors.success, colors.successDark],
          solid: colors.success,
          text: colors.white
        };
      case 'error':
        return {
          gradient: [colors.error, '#FF3333'],
          solid: colors.error,
          text: colors.white
        };
      case 'outline':
        return {
          gradient: [colors.white, colors.white],
          solid: colors.white,
          text: colors.primary,
          border: colors.primary
        };
      case 'primary':
      default:
        return {
          gradient: gradientColors || [colors.primary, colors.primaryDark],
          solid: colors.primary,
          text: colors.white
        };
    }
  };

  const buttonColors = getButtonColors();
  
  const ButtonContent = () => (
    <>
      {icon && iconPosition === 'left' && !loading && (
        <Ionicons name={icon} size={20} color={buttonColors.text} style={styles.leftIcon} />
      )}
      
      {loading ? (
        <ActivityIndicator size="small" color={buttonColors.text} />
      ) : (
        <Text style={[styles.buttonText, { color: buttonColors.text }, textStyle]}>
          {title}
        </Text>
      )}
      
      {icon && iconPosition === 'right' && !loading && (
        <Ionicons name={icon} size={20} color={buttonColors.text} style={styles.rightIcon} />
      )}
    </>
  );

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          styles.outlineButton,
          { borderColor: buttonColors.border },
          style,
          disabled && styles.disabled
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...props}
      >
        <ButtonContent />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.buttonContainer, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <LinearGradient
        colors={buttonColors.gradient}
        style={[styles.gradient, disabled && styles.disabled]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <ButtonContent />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default CustomButton;