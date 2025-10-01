import { forwardRef } from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<TextInput, Props>(({ label, error, style, ...rest }, ref) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput ref={ref} style={[styles.input, style]} placeholderTextColor="#9BA4B5" {...rest} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  label: {
    marginBottom: 6,
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500'
  },
  input: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#111827'
  },
  error: {
    marginTop: 4,
    color: '#DC2626',
    fontSize: 13
  }
});

FormInput.displayName = 'FormInput';
