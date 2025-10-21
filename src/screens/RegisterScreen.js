import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { db } from '../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen({ navigation }) {
  const { signUp, logout } = useContext(AuthContext);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!nombre || !email || !password || !confirmPassword) {
      return Alert.alert('Error', 'Por favor completá todos los campos');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Las contraseñas no coinciden');
    }

    try {
      const userCredential = await signUp(email, password, nombre);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        nombre,
        email,
        createdAt: new Date(),
      });

      logout();

      Alert.alert('Éxito', 'Cuenta creada correctamente');
}
     catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.title}>Crear Cuenta</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              value={nombre}
              onChangeText={setNombre}
            />

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <View style={styles.buttonContainer}>
              <Button title="Registrarse" onPress={handleRegister} color="#007AFF" />
            </View>

            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Login')}
            >
              ¿Ya tenés cuenta? Iniciá sesión
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f6fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
  link: {
    marginTop: 10,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});