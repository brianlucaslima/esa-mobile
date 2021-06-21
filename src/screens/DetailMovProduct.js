import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

import Moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Realm from 'realm';

function DetailMovProduct({route, navigation}){
 

  const realm = new Realm({
    path: 'ESADATABASE.realm',
  });

  const [movData, setMovData] = useState([]);

  useEffect(() => {

    const openMoviments = realm.objectForPrimaryKey('Moviment',route.params.MovId);

    setMovData(openMoviments);

  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 15}} onPress={deletaAlert}>
              <Icon name="eraser" color='white' size={24}>
              </Icon>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);


  function deletaAlert(){
      Alert.alert(
        'Tem certeza?',
        `Você tem certeza que deseja exluir esse lançamento?`,
        [
        {
            text: 'Sim',
            onPress: deleteConfirm,
        },
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        ],
        {cancelable: true},
      )
  }

  const deleteConfirm = () =>
  {
      console.log('Delete confirm true print'+ route.params.MovId);
      realm.write(() => {
    
        const mov = realm.objectForPrimaryKey('Moviment', route.params.MovId);
        const product = realm.objectForPrimaryKey("Product", mov.product_id);
        let novoEstoque;
        if (mov.tipo === 'Entrada'){
            novoEstoque = parseInt(product.estoque) - parseInt(mov.quantidade);
        }
        if(mov.tipo === 'Saida'){
            novoEstoque = parseInt(product.estoque) + parseInt(mov.quantidade);
        }



        product.estoque = novoEstoque;

        
        realm.delete(mov);

        console.log(product._id)

    Alert.alert(
      'Success',
      `Movimentação excluída com sucesso!`,
      [
        {
          text: 'Ok',
          onPress: () => navigation.navigate('DetailProduct', {ProductId: product._id}),
        },
      ],
      {cancelable: false},
    );

    });


    
  }

  return (
    <View style={styles.container}>
      <ScrollView
        vertical
        showsVerticalScrollIndicator={true}
        style={{marginTop: 1, marginBottom: 10}}>
        <View style={styles.cardValor}>
          {movData.tipo == 'Entrada' && (
            <Text style={[styles.cardValorText ,{color: 'green'}]}>Entrada: {movData.quantidade}</Text>
          )}
          {movData.tipo == 'Saida' && (
            <Text style={[styles.cardValorText ,{color: 'red'}]}>Saída: {movData.quantidade}</Text>
          )}
        </View>
        <View style={styles.cardInfo}>
            <Icon name="calendar-alt" color="black" size={24}></Icon>
            <View style={{ paddingLeft: 15 }}>
                <Text style={styles.cardInfoTitle}>Data</Text>
                <Text style={styles.cardInfoValue}> { movData.dtMov && Moment(movData.dtMov.toISOString().substring(0, 10)).format('DD/MM/Y')}</Text>
            </View>
        </View>
        <View style={styles.cardInfo}>
            <Icon name="credit-card" color="black" size={24}></Icon>
            <View style={{ paddingLeft: 15 }}>
                <Text style={styles.cardInfoTitle}>Tipo</Text>
                <Text style={styles.cardInfoValue}>{movData.tipo}</Text>
            </View>
        </View>
        <View style={styles.cardInfo}>
            <Icon name="user" color="black" size={24}></Icon>
            <View style={{ paddingLeft: 15 }}>
                <Text style={styles.cardInfoTitle}>{movData.tipo == 'Entrada' ? 
                        'Fornecedor'
                        : 'Cliente'}</Text>
                <Text style={styles.cardInfoValue}>{movData.tipo == 'Entrada' ? 
                        'Fornecedor: '+movData.fornecedor
                        : 'Cliente:' +movData.cliente}</Text>
            </View>
        </View>
      </ScrollView>
      <Image
        source={require('../assets/img/logo.png')}
        style={[styles.logo, {marginBottom: 10}]}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
  },
  logo: {
    width: '100%',
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 15,
  },
  cardValor: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 130,
    borderBottomColor: '#ebf5ff',
    borderBottomWidth: 6,
  },
  cardValorText:{
      fontWeight: 'bold',
      fontSize: 24,
  },
  cardInfo:{
      backgroundColor: '#fff',
      paddingVertical: 10,
      paddingHorizontal: 15,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: '#ebf5ff',
        borderBottomWidth: 1,
  },
  cardInfoTitle:{
      fontSize: 12,
      padding: 0,
      margin: 0,
  },
  cardInfoValue:{
      fontSize: 14,
      padding: 0,
      margin: 0,
  }
});

export default DetailMovProduct;
