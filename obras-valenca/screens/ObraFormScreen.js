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
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('responsavel', responsavel);
    formData.append('dataInicio', formatarDataBRparaISO(dataInicio));
    formData.append('previsaoTermino', formatarDataBRparaISO(previsaoTermino));
    formData.append('descricao', descricao);
    if (localizacao) {
      formData.append('localizacao', JSON.stringify({
        latitude: localizacao.latitude,
        longitude: localizacao.longitude
      }));
    }
    if (foto && foto.uri) {
      const fileName = foto.uri.split('/').pop();
      const match = /\.(\w+)$/.exec(fileName ?? '');
      const ext = match ? match[1] : 'jpg';
      const type = `image/${ext}`;
      formData.append('foto', {
        uri: foto.uri,
        name: fileName,
        type: type,
      });
    }
    try {
      await fetch('https://recupera-o-mobile.onrender.com/obras', {
        method: 'POST',
        body: formData,

      });
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
