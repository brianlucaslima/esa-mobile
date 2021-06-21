import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Realm from 'realm';
import moment from 'moment';

import DatePicker from 'react-native-datepicker';

export default function MovEstProduct({route, navigation}) {
  // let data = new Date();
  // let dataFormatada =
  //   data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear();
  // var moment = require('moment');
  // moment.locale('pt-br');

  const [tipoMov, settipoMov] = React.useState('Saida');
  const [dateMov, setDate] = useState();
  const [dateMax, setDateMax] = useState();
  const [movQuantidade, setMovQuantidade] = useState('');
  const [movBeneficiario, setMovBeneficiario] = useState('');
  const [productData, setProductData] = useState([]);
  
  useEffect(() => {
    const dataAtual = new Date();
    const dataAtualFormatada = dataAtual.getDate() + '/' + (dataAtual.getMonth() + 1) + '/' + dataAtual.getFullYear();
    setDateMax(dataAtualFormatada);

    Realm.open({
      path: 'ESADATABASE.realm',
    }).then(realm => {
      const products = realm.objects('Product');
      const openProducts = products.filtered('_id = ' + route.params.ProductId)[0];
      setProductData(openProducts);


      openProducts.addListener(() => {
        // update state of tasks to the updated value
        setProductData(openProducts);
      });

      // cleanup function
      return () => {
        const products = realm.objects('products').sorted('name', false);
        // Remember to remove the listener when you're done!
        products.removeAllListeners();
        // Call the close() method when done with a realm instance to avoid memory leaks.
        realm.close();
      };
    });
  }, []);

  const FormataStringData = (data) =>{
    var mes = data.split('/')[1];
    var dia = data.split('/')[0];
    var ano = data.split('/')[2];

    return ano + '-' + ('0' + mes).slice(-2) + '-' + ('0' + dia).slice(-2);
    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
  }

  const setData = () => {
    var cliente;
    var fornecedor;
    var novoEstoque;
    var beneficiario;
    if(!dateMov) {
      alert('Por favor insira uma data válida!');
      return;
    }
    
    if (tipoMov == 'Entrada') {
      cliente = '';
      fornecedor = movBeneficiario;
      beneficiario = 'Fornecedor';
      novoEstoque = parseInt(productData.estoque) + parseInt(movQuantidade);
    } else {
      cliente = movBeneficiario;
      beneficiario = 'Cliente';
      fornecedor = '';
      novoEstoque = parseInt(productData.estoque) - parseInt(movQuantidade);
    }
    
    if (movQuantidade <= 0) {
      alert('Insira uma quantidade válida');
      return;
    }
    if (!movBeneficiario) {
      alert('Por favor insira o nome do ' + beneficiario);
      return;
    }

    Realm.open({
      path: 'ESADATABASE.realm',
    }).then(realm => {
    // codigo de insercao
    realm.write(() => {
      var id =
        realm.objects('Moviment').sorted('_id', true).length > 0
          ? realm.objects('Moviment').sorted('_id', true)[0]._id + 1
          : 1;
      const mov = realm.create('Moviment', {
        _id: id,
        dtMov: FormataStringData(dateMov),
        quantidade: parseInt(movQuantidade),
        cliente: cliente,
        tipo: tipoMov,
        fornecedor: fornecedor,
        product_id: route.params.ProductId,
      });
     
      productData.estoque = parseInt(novoEstoque);
    });
  });
    Alert.alert(
        'Success',
        `Movimentação de estoque salva com sucesso!`,
        [
          {
            text: 'Ok',
            onPress: () =>
              navigation.navigate('DetailProduct', {
                ProductId: route.params.ProductId,
              }),
          },
        ],
        {cancelable: false},
      );
  };
  return (
    <View style={styles.container}>
     
  <ScrollView
        vertical
        showsVerticalScrollIndicator={true}
        style={{marginTop: 0}}>
      <View
        style={{
          marginTop: 10,
          borderWidth: 1,
          borderColor: '#9c9c9c',
          margin: 10,
          paddingVertical: 15,
        }}>
         <Text style={styles.title}>Produto: {productData.name}</Text>
        <Text style={styles.subtitle}>Estoque: {productData.estoque}</Text>

        <Text
          style={{
            marginHorizontal: 15,
            color: 'black',
            fontWeight: 'bold',
            fontSize: 15,
          }}>
          Data
        </Text>
        <DatePicker
          style={styles.datePickerStyle}
          date={dateMov} // Initial date from state
          mode="date" // The enum of date, datetime and time
          placeholder="Selecionar Data"
          format="DD/MM/YYYY"
          minDate="01/01/2016"
          maxDate={dateMax}
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          onDateChange={dateMov => {
            setDate(dateMov);
          }}
        />
        <Text
          style={{
            marginTop: 10,
            marginHorizontal: 15,
            color: 'black',
            fontWeight: 'bold',
            fontSize: 15,
          }}>
          Tipo
        </Text>
        <RadioButton.Group
          onValueChange={tipoMov => settipoMov(tipoMov)}
          value={tipoMov}>
          <RadioButton.Item label="Entrada" value="Entrada" />
          <RadioButton.Item label="Saída" value="Saida" />
        </RadioButton.Group>
        <Text
          style={{
            marginTop: 10,
            marginHorizontal: 15,
            color: 'black',
            fontWeight: 'bold',
            fontSize: 15,
          }}>
          Quantidade
        </Text>
        <TextInput
          placeholder="Quantidade"
          style={styles.input}
          keyboardType="numeric"
          onPress={this}
          onChangeText={movQuantidade => setMovQuantidade(movQuantidade)}
        />
        <Text
          style={{
            marginTop: 10,
            marginHorizontal: 15,
            color: 'black',
            fontWeight: 'bold',
            fontSize: 15,
          }}>
          {tipoMov == 'Entrada' ? 'Fornecedor' : 'Cliente'}
        </Text>
        <TextInput
          placeholder="Nome"
          style={styles.input}
          onPress={this}
          onChangeText={movBeneficiario => setMovBeneficiario(movBeneficiario)}
        />
      </View>
  </ScrollView>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          width: 70,
          position: 'absolute',
          bottom: 10,
          right: 10,
          height: 70,
          backgroundColor: '#07add1',
          borderRadius: 100,
        }}
        onPress={setData}>
        <Icon name="save" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
  },
  subtitle: {
    fontWeight: 'bold',
    opacity: 0.4,
    textAlign: 'center',
    fontSize: 18,
    marginTop: 8,
  },
  input: {
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    paddingVertical: 4,
    marginTop: 2,
  },
  datePickerStyle: {
    width: '90%',
    marginTop: 5,
    marginHorizontal: 15,
    alignSelf: 'center',
  },
});
