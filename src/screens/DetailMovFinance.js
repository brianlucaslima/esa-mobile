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

function DetailMovFinance({route, navigation}){
 

  const realm = new Realm({
    path: 'ESADATABASE.realm',
  });

  const [movData, setMovData] = useState([]);

  useEffect(() => {

    const openMoviments = realm.objectForPrimaryKey('MovFinance',route.params.MovFinanceId);

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
      console.log('Delete confirm true print');
      realm.write(() => {
    
        const financeBack = realm.objects("Finance")[0];
        const mov = realm.objectForPrimaryKey('MovFinance', route.params.MovFinanceId);
        let saldoNovo;
        console.log('Tipo de Mov: ' + mov.tipo + ' Saldo Novo: '+saldoNovo);
        if (mov.tipo === 'Receita'){
            saldoNovo = parseFloat(financeBack.saldo.toFixed(2)) - parseFloat(mov.valor);
            console.log('Saldo Anterior: '+financeBack.saldo+ ' - Saldo do Mov: ' + mov.valor);
        }
        if(mov.tipo === 'Despesa'){
            saldoNovo = parseFloat(financeBack.saldo.toFixed(2)) + parseFloat(mov.valor);
            console.log('Saldo Anterior: '+financeBack.saldo+ ' + Saldo do Mov: ' + mov.valor);
        }



        financeBack.saldo = saldoNovo;

        
        realm.delete(mov);
      

        

    });

    realm.close();

    Alert.alert(
      'Success',
      `Movimentação excluída com sucesso!`,
      [
        {
          text: 'Ok',
          onPress: () => navigation.navigate('HomeFinances'),
        },
      ],
      {cancelable: false},
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        vertical
        showsVerticalScrollIndicator={true}
        style={{marginTop: 1, marginBottom: 10}}>
        <View style={styles.cardValor}>
          {movData.tipo == 'Despesa' && (
            <Text style={[styles.cardValorText ,{color: 'red'}]}>R$ -{movData.valor.toFixed(2)}</Text>
          )}
          {movData.tipo == 'Receita' && (
            <Text style={[styles.cardValorText ,{color: 'green'}]}>R$ {movData.valor.toFixed(2)}</Text>
          )}
        </View>
        <View style={styles.cardInfo}>
            <Icon name="calendar-alt" color="black" size={24}></Icon>
            <View style={{ paddingLeft: 15 }}>
                <Text style={styles.cardInfoTitle}>Data</Text>
                <Text style={styles.cardInfoValue}> { movData.data && Moment(movData.data.toISOString().substring(0, 10)).format('DD/MM/Y')}</Text>
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
            <Icon name="comment-dots" color="black" size={24}></Icon>
            <View style={{ paddingLeft: 15 }}>
                <Text style={styles.cardInfoTitle}>Descrição</Text>
                <Text style={styles.cardInfoValue}>{movData.descricao}</Text>
            </View>
        </View>
      </ScrollView>
      <Image
        source={require('../assets/img/logo.png')}
        style={[styles.logo, {marginBottom: 10}]}
      />
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
        onPress={() =>
            navigation.navigate('FormEditMovFinance', {MovFinanceId: movData._id})
        } 
        key={movData._id}
        >
        <Icon name="edit" color="white" size={24}></Icon>
      </TouchableOpacity>
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

export default DetailMovFinance;
