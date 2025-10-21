import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function InicioScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [horaActual, setHoraActual] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setHoraActual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hora = horaActual.getHours();
  const saludo =
    hora < 5 ? 'Buenas noches' :
    hora < 12 ? 'Buenos días' :
    hora < 19 ? 'Buenas tardes' :
    'Buenas noches';

  return (
    <View style={styles.container}>
      <Text style={styles.saludo}>{saludo}, {user?.displayName || user?.email || 'Usuario'} 👋</Text>
      <Text style={styles.hora}>{horaActual.toLocaleTimeString()}</Text>

      <View style={styles.botones}>
        <Button title="📋 Lista de Productos" onPress={() => navigation.navigate('Lista')}  />
        <Button title="👤 Usuario" onPress={() => navigation.navigate('Usuario')}  />
      </View>

      <View style={{ marginTop: 30 }}>
        <Button title="Cerrar sesión" onPress={logout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  saludo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  hora: {
    fontSize: 20,
    color: '#333',
    marginBottom: 30,
  },
  botones: {
    width: '100%',
    gap: 15,
    
  },
});