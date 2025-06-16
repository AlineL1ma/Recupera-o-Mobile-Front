import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, RefreshControl } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [obras, setObras] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchObras = async () => {
    try {
      const res = await fetch('https://recupera-o-mobile.onrender.com/obras');
      const data = await res.json();
      setObras(Array.isArray(data) ? data : []);
    } catch (error) {
      setObras([]);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchObras();
    });
    fetchObras();
    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchObras().finally(() => setRefreshing(false));
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Nova Obra" onPress={() => navigation.navigate('ObraForm')} />
      <FlatList
        data={obras}
        keyExtractor={item => (item._id ? item._id.toString() : String(item.id))}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ObraDetail', { obraId: item._id || item.id })}>
            <View style={{ padding: 16, borderBottomWidth: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.nome}</Text>
              <Text>Responsável: {item.responsavel}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Nenhuma obra cadastrada.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}