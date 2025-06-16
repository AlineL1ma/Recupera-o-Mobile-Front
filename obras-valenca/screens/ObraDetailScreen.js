import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import * as MailComposer from 'expo-mail-composer';

export default function ObraDetailScreen({ route, navigation }) {
  const { obraId } = route.params;
  const [obra, setObra] = useState(null);
  const [fiscalizacoes, setFiscalizacoes] = useState([]);

  useEffect(() => {
    fetchObra();
    fetchFiscalizacoes();
  }, []);

  const fetchObra = async () => {
    const res = await fetch(`https://recupera-o-mobile.onrender.com/obras/${obraId}`);
    const data = await res.json();
    setObra(data);
  };

  const fetchFiscalizacoes = async () => {
    const res = await fetch(`https://recupera-o-mobile.onrender.com/obras/${obraId}/fiscalizacoes`);
    const data = await res.json();
    setFiscalizacoes(data);
  };

  const excluirObra = async () => {
    await fetch(`https://recupera-o-mobile.onrender.com/obras/${obraId}`, { method: 'DELETE' });
    navigation.goBack();
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
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1 }}>
            <Text>Data: {item.data}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Obs: {item.observacoes}</Text>
          </View>
        )}
      />
      <Button title="Editar" onPress={() => navigation.navigate('ObraForm', { obra })} />
      <Button title="Excluir" onPress={excluirObra} color="red" />
      <Button title="Enviar por E-mail" onPress={enviarEmail} />
    </View>
  );
}
