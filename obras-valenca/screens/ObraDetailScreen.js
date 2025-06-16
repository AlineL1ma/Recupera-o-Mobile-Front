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
    try {
      const res = await fetch(`https://recupera-o-mobile.onrender.com/fiscalizacoes/obra/${obraId}`);
      if (res.ok) {
        const data = await res.json();
        setFiscalizacoes(Array.isArray(data) ? data : []);
      } else {
        const res2 = await fetch(`https://recupera-o-mobile.onrender.com/obras/${obraId}/detalhes`);
        if (res2.ok) {
          const data2 = await res2.json();
          setFiscalizacoes(Array.isArray(data2.fiscalizacoes) ? data2.fiscalizacoes : []);
        } else {
          setFiscalizacoes([]);
        }
      }
    } catch (e) {
      setFiscalizacoes([]);
    }
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
        keyExtractor={item => item._id}
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
