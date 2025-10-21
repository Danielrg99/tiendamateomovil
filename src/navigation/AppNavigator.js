import React, { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import InicioScreen from '../screens/InicioScreen';
import ListaScreen from '../screens/ListaScreen';
import UsuarioScreen from '../screens/UsuarioScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

function MainTabs() {
  return (
    <TopTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fff', height: 60 },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Lista') iconName = 'list';
          else if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Usuario') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarItemStyle: {
          paddingTop: 5,
          paddingBottom: 0,
        },
      })}
    >
      <TopTab.Screen name="Inicio" component={InicioScreen} />
      <TopTab.Screen name="Lista" component={ListaScreen} />
      <TopTab.Screen name="Usuario" component={UsuarioScreen} />
    </TopTab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../../assets/Logo.png')}
                  style={{ width: 50, height: 50, marginRight: 8 }}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Panel Principal</Text>
              </View>
            ),
            headerStyle: { backgroundColor: '#f5f6fa' },
          }}
        />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}