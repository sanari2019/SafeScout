import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}

export const PrimaryButton = ({ title, onPress, disabled = false, icon }: Props) => {
  return (
    <Pressable style={[styles.button, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
      {icon}
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0B1D37',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  disabled: {
    opacity: 0.6
  }
});
