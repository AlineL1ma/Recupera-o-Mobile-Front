import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ObraDetailScreen({ route, navigation }) {
  const { obraId } = route.params;
  const [obra, setObra] = useState(null);
  const [fiscalizacoes, setFiscalizacoes] = useState([]);

  useEffect(() => {
    fetchObra();
    fetchFiscalizacoes();
  }, []);

  const fetchObra = async () => {
    try {
      const salvas = await AsyncStorage.getItem('obras');
      const lista = salvas ? JSON.parse(salvas) : [];
      const encontrada = lista.find(o => o.id === obraId || o._id === obraId);
      setObra(encontrada);
    } catch (e) {
      setObra(null);
    }
  };

  const fetchFiscalizacoes = async () => {
    try {
      const salvas = await AsyncStorage.getItem('fiscalizacoes');
      const lista = salvas ? JSON.parse(salvas) : [];
      const filtradas = lista.filter(f => f.obra === obraId || f.obraId === obraId);
      setFiscalizacoes(filtradas);
    } catch (e) {
      setFiscalizacoes([]);
    }
  };

  const excluirObra = async () => {
    try {
      const salvas = await AsyncStorage.getItem('obras');
      let lista = salvas ? JSON.parse(salvas) : [];
      lista = lista.filter(o => (o.id || o._id) !== obraId);
      await AsyncStorage.setItem('obras', JSON.stringify(lista));
      // Remove fiscalizações relacionadas
      const fiscalSalvas = await AsyncStorage.getItem('fiscalizacoes');
      let listaFiscal = fiscalSalvas ? JSON.parse(fiscalSalvas) : [];
      listaFiscal = listaFiscal.filter(f => (f.obra !== obraId && f.obraId !== obraId));
      await AsyncStorage.setItem('fiscalizacoes', JSON.stringify(listaFiscal));
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro ao excluir obra', e.message);
    }
  };

  const enviarEmail = async () => {
    const email = prompt('Digite o e-mail de destino:');
    if (!email) return;
    await MailComposer.composeAsync({
      recipients: [email],
      subject: `Dados da Obra: ${obra.nome}`,
      body: `Obra: ${obra.nome}\nResponsável: ${obra.responsavel}\nFiscalizações: ${JSON.stringify(fiscalizacoes)}`
    });
  };

  if (!obra) return <Text>Carregando...</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{obra.nome}</Text>
      <Text>Responsável: {obra.responsavel}</Text>
      <Text>Início: {obra.dataInicio}</Text>
      <Text>Previsão de término: {obra.previsaoTermino}</Text>
      <Text>Descrição: {obra.descricao}</Text>
      <Button title="Nova Fiscalização" onPress={() => navigation.navigate('FiscalizacaoForm', { obraId })} />
      <Text style={{ marginTop: 16, fontWeight: 'bold' }}>Fiscalizações:</Text>
      <FlatList
        data={fiscalizacoes}
        keyExtractor={item => item.id || item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1 }}>
            <Text>Data: {item.data}</Text>
            <Text>Status: {item.statusObra}</Text>
            <Text>Obs: {item.observacoes}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhuma fiscalização cadastrada.</Text>}
      />
      <Button title="Editar" onPress={() => navigation.navigate('ObraForm', { obra })} />
      <Button title="Excluir" onPress={excluirObra} color="red" />
      <Button title="Enviar por E-mail" onPress={enviarEmail} />
    </View>
  );
}
