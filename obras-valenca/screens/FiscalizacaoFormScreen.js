import React, { useState } from 'react';
import { View, TextInput, Button, Image, Text, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FiscalizacaoFormScreen({ navigation, route }) {
  const { obraId } = route.params;
  const [data, setData] = useState('');
  const [statusObra, setStatusObra] = useState('Em dia');
  const [observacoes, setObservacoes] = useState('');
  const [localizacao, setLocalizacao] = useState(null);
  const [foto, setFoto] = useState(null);

  const obterLocalizacao = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada para acessar localização');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocalizacao(location.coords);
  };

  const tirarFoto = async () => {
    let result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.cancelled) {
      setFoto(result);
    }
  };

  function formatarDataBRparaISO(dataBR) {
    if (!dataBR) return null;
    const [dia, mes, ano] = dataBR.split('/');
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }

  const salvarFiscalizacao = async () => {
    try {
      const novaFiscalizacao = {
        data: formatarDataBRparaISO(data),
        statusObra,
        observacoes,
        localizacao: localizacao ? {
          latitude: localizacao.latitude,
          longitude: localizacao.longitude
        } : undefined,
        obra: obraId,
        foto: foto && foto.uri ? foto.uri : null
      };
      // Recupera fiscalizações já salvas
      const salvas = await AsyncStorage.getItem('fiscalizacoes');
      let lista = salvas ? JSON.parse(salvas) : [];
      lista.push(novaFiscalizacao);
      await AsyncStorage.setItem('fiscalizacoes', JSON.stringify(lista));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao salvar fiscalização', error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput placeholder="Data da fiscalização (dd/mm/yyyy)" value={data} onChangeText={setData} />
      <Text>Status da Obra:</Text>
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        {['Em dia', 'Atrasada', 'Parada'].map(status => (
          <Button
            key={status}
            title={status}
            onPress={() => setStatusObra(status)}
            color={statusObra === status ? 'blue' : 'gray'}
          />
        ))}
      </View>
      <TextInput placeholder="Observações" value={observacoes} onChangeText={setObservacoes} />
      <Button title="Obter Localização" onPress={obterLocalizacao} />
      {localizacao && <Text>Lat: {localizacao.latitude}, Lon: {localizacao.longitude}</Text>}
      <Button title="Tirar Foto" onPress={tirarFoto} />
      {foto && foto.uri && <Image source={{ uri: foto.uri }} style={{ width: 100, height: 100 }} />}
      <Button title="Salvar" onPress={salvarFiscalizacao} />
    </View>
  );
}