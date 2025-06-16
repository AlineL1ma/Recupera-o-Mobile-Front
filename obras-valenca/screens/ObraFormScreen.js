import React, { useState } from 'react';
import { View, TextInput, Button, Image, Text, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

export default function ObraFormScreen({ navigation, route }) {
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [previsaoTermino, setPrevisaoTermino] = useState('');
  const [descricao, setDescricao] = useState('');
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
    let result = await ImagePicker.launchCameraAsync({ base64: true });
    if (!result.cancelled) {
      setFoto(result.uri);
    }
  };

  const salvarObra = async () => {
    await fetch('https://recupera-o-mobile.onrender.com/obras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome, responsavel, dataInicio, previsaoTermino, descricao,
        latitude: localizacao?.latitude,
        longitude: localizacao?.longitude,
        foto
      })
    });
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput placeholder="Nome da obra" value={nome} onChangeText={setNome} />
      <TextInput placeholder="Responsável" value={responsavel} onChangeText={setResponsavel} />
      <TextInput placeholder="Data de início" value={dataInicio} onChangeText={setDataInicio} />
      <TextInput placeholder="Previsão de término" value={previsaoTermino} onChangeText={setPrevisaoTermino} />
      <TextInput placeholder="Descrição" value={descricao} onChangeText={setDescricao} />
      <Button title="Obter Localização" onPress={obterLocalizacao} />
      {localizacao && <Text>Lat: {localizacao.latitude}, Lon: {localizacao.longitude}</Text>}
      <Button title="Tirar Foto" onPress={tirarFoto} />
      {foto && <Image source={{ uri: foto }} style={{ width: 100, height: 100 }} />}
      <Button title="Salvar" onPress={salvarObra} />
    </View>
  );
}
