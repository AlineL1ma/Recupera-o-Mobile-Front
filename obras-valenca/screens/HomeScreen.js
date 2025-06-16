import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [obras, setObras] = useState([]);

  useEffect(() => {
    fetchObras();
  }, []);

  const fetchObras = async () => {
    const res = await fetch('https://recupera-o-mobile.onrender.com/obras');
    const data = await res.json();
    setObras(data);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Nova Obra" onPress={() => navigation.navigate('ObraForm')} />
      <FlatList
        data={obras}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ObraDetail', { obraId: item.id })}>
            <View style={{ padding: 16, borderBottomWidth: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.nome}</Text>
              <Text>Responsável: {item.responsavel}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

