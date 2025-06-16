import React, { useState } from 'react';
import { View, TextInput, Button, Picker, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

export default function FiscalizacaoFormScreen({ route, navigation }) {
  const { obraId } = route.params;
  const [data, setData] = useState('');
  const [status, setStatus] = useState('Em dia');
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
    let result = await ImagePicker.launchCameraAsync({ base64: true });
    if (!result.cancelled) {
      setFoto(result.uri);
    }
  };

  const salvarFiscalizacao = async () => {
    await fetch(`https://recupera-o-mobile.onrender.com/obras/${obraId}/fiscalizacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data, status, observacoes,
        latitude: localizacao?.latitude,
        longitude: localizacao?.longitude,
        foto
      })
    });
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput placeholder="Data da fiscalização" value={data} onChangeText={setData} />
      <Picker selectedValue={status} onValueChange={setStatus}>
        <Picker.Item label="Em dia" value="Em dia" />
        <Picker.Item label="Atrasada" value="Atrasada" />
        <Picker.Item label="Parada" value="Parada" />
      </Picker>
      <TextInput placeholder="Observações" value={observacoes} onChangeText={setObservacoes} />
      <Button title="Obter Localização" onPress={obterLocalizacao} />
      <Button title="Tirar Foto" onPress={tirarFoto} />
      {foto && <Image source={{ uri: foto }} style={{ width: 100, height: 100 }} />}
      <Button title="Salvar" onPress={salvarFiscalizacao} />
    </View>
  );
}
