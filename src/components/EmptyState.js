import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from './CustomButton';
import { colors } from '../constants/colors';

const EmptyState = ({ 
  icon = 'alert-circle-outline',
  title,
  description,
  buttonTitle,
  onButtonPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={64} color={colors.lightGray} />
      </View>
      
      {title && <Text style={styles.title}>{title}</Text>}
      
      {description && <Text style={styles.description}>{description}</Text>}
      
      {buttonTitle && onButtonPress && (
        <CustomButton
          title={buttonTitle}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    minWidth: 150,
  },
});

EmptyState.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  buttonTitle: PropTypes.string,
  onButtonPress: PropTypes.func
};
export default EmptyState;
