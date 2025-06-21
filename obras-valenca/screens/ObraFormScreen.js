import React, { useState } from 'react';
import { View, TextInput, Button, Image, Text, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ObraFormScreen({ navigation, route }) {
  const obraEdit = route?.params?.obra;
  const [nome, setNome] = useState(obraEdit ? obraEdit.nome : '');
  const [responsavel, setResponsavel] = useState(obraEdit ? obraEdit.responsavel : '');
  const [dataInicio, setDataInicio] = useState(obraEdit ? obraEdit.dataInicio : '');
  const [previsaoTermino, setPrevisaoTermino] = useState(obraEdit ? obraEdit.previsaoTermino : '');
  const [descricao, setDescricao] = useState(obraEdit ? obraEdit.descricao : '');
  const [localizacao, setLocalizacao] = useState(obraEdit ? obraEdit.localizacao : null);
  const [foto, setFoto] = useState(obraEdit ? { uri: obraEdit.foto } : null);

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

  const salvarObra = async () => {
    try {
      const novaObra = {
        id: obraEdit ? obraEdit.id : Date.now().toString(),
        nome,
        responsavel,
        dataInicio: formatarDataBRparaISO(dataInicio),
        previsaoTermino: formatarDataBRparaISO(previsaoTermino),
        descricao,
        localizacao: localizacao ? {
          latitude: localizacao.latitude,
          longitude: localizacao.longitude
        } : undefined,
        foto: foto && foto.uri ? foto.uri : null
      };
      const salvas = await AsyncStorage.getItem('obras');
      let lista = salvas ? JSON.parse(salvas) : [];
      if (obraEdit) {
        lista = lista.map(o => (o.id === obraEdit.id ? novaObra : o));
      } else {
        lista.push(novaObra);
      }
      await AsyncStorage.setItem('obras', JSON.stringify(lista));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao salvar obra', error.message);
    }
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
      {foto && foto.uri && <Image source={{ uri: foto.uri }} style={{ width: 100, height: 100 }} />}
      <Button title="Salvar" onPress={salvarObra} />
    </View>
  );
}
