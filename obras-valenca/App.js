import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ObraFormScreen from './screens/ObraFormScreen';
import ObraDetailScreen from './screens/ObraDetailScreen';
import FiscalizacaoFormScreen from './screens/FiscalizacaoFormScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Obras em Andamento' }} />
        <Stack.Screen name="ObraForm" component={ObraFormScreen} options={{ title: 'Cadastrar/Editar Obra' }} />
        <Stack.Screen name="ObraDetail" component={ObraDetailScreen} options={{ title: 'Detalhes da Obra' }} />
        <Stack.Screen name="FiscalizacaoForm" component={FiscalizacaoFormScreen} options={{ title: 'Nova Fiscalização' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}