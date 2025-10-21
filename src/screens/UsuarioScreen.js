import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { updateProfile, updateEmail } from 'firebase/auth';

export default function UsuarioScreen() {
  const { user } = useContext(AuthContext);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (user) {
      setNombre(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const guardarCambios = async () => {
    try {
      if (user) {
        await updateProfile(user, { displayName: nombre });
        await updateEmail(user, email);
        
        await user.reload();
        
        Alert.alert('Éxito', 'Datos actualizados correctamente');
        setEditando(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron actualizar los datos: ' + error.message);
    }
  };

  const getInputStyle = (isEditable) => ({
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: isEditable ? '#fff' : '#f5f5f5',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Datos del Usuario</Text>

      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={getInputStyle(editando)}
        value={nombre}
        onChangeText={setNombre}
        editable={editando}
        placeholder="Nombre"
      />
      
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={getInputStyle(editando)}
        value={email}
        onChangeText={setEmail}
        editable={editando}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.buttonContainer}>
        {editando ? (
          <>
            <Button title="Guardar Cambios" onPress={guardarCambios} color="#007bff" />
            <Button title="Cancelar" onPress={() => {
              setEditando(false);
              setNombre(user.displayName || '');
              setEmail(user.email || '');
            }} color="gray" />
          </>
        ) : (
          <Button title="Editar" onPress={() => setEditando(true)} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  buttonContainer: {
    gap: 10,
    marginTop: 10,
  },
});