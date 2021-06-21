import React, {Component, useEffect, useState} from 'react';
import {
  RefreshControl,
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import Realm from 'realm';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};


function Home({navigation}) {
  const [finance, setFinance] = useState(['']);


  useEffect(() => {
    console.log('useEffect em acão');
    Realm.open({
      path: 'ESADATABASE.realm',
      schema: [
        {
          name: 'Product',
          properties: {
            _id: 'int',
            name: 'string',
            estoque: 'int',
            dirphoto: 'string?',
            category: 'string?',
          },
          primaryKey: '_id',
        },
        {
          name: 'Moviment',
          properties: {
            _id: 'int',
            cliente: 'string?',
            fornecedor: 'string?',
            quantidade: 'int',
            tipo: 'string',
            dtMov: 'date',
            product_id: 'int',
          },
          primaryKey: '_id',
        },
        {
          name: 'Finance',
          properties: {
            _id: 'int',
            saldo: 'double',
          },
          primaryKey: '_id',
        },
        {
          name: 'MovFinance',
          properties: {
            _id: 'int',
            tipo: 'string',
            descricao: 'string',
            valor: 'double',
            data: 'date',
            status: 'string',
          },
          primaryKey: '_id',
        },
      ],
      schemaVersion: 11,
    }).then(realm => {
      
      const financeExists = realm.objects('Finance');
      if(financeExists == '')
      {
        realm.write(() => {
          const finance = realm.create("Finance", {
          _id: 1,
          saldo: 0.00,
          });
        });
      }
      const finances = realm.objects('Finance');
      const MovFinance = realm.objects('MovFinance');

      setFinance([...finances]);

      MovFinance.addListener(() => {
        setFinance([...finances]);
      });

      return () => {
        const MovFinance = realm.objects('MovFinance');

        MovFinance.removeAllListeners();

        realm.close();
      };
    });
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setFinance([]);
    Realm.open({
      path: 'ESADATABASE.realm',
    }).then(realm => {

      const finance = realm.objects('Finance');

      setFinance(finance);
    });
    
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
       <ScrollView
        vertical
        showsVerticalScrollIndicator={true}
        style={{marginTop: 10}} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
      <Image source={require('../assets/img/logo.png')} style={styles.logo} />

      <ScrollView
        vertical
        showsVerticalScrollIndicator={true}
        style={{marginTop: 10}}>
        <View style={{flex: 1, flexDirection: 'column', marginHorizontal: 15}}>
          <Text style={styles.textWelcome}>Olá, bem vindo! 😍</Text>
          <TouchableOpacity style={styles.cardMoney}>
            <Text style={{marginBottom: 5, fontWeight: 'bold'}}>
              Saldo em Conta
            </Text>
            <Text style={styles.textMoney}>R$ {finance != '' && finance[0].saldo.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 15,
            justifyContent: 'space-between',
            marginHorizontal: 10,
          }}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate('HomeProducts');
            }}>
            <Image
              source={require('../assets/img/cart.png')}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>Produtos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('HomeFinances', {refresh: true})}>
            <Image
              source={require('../assets/img/finance.png')}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>Financeiro</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </ScrollView>
      <Text style={{alignSelf: 'center', fontSize: 10, marginBottom: 2}}>
        Desenvolvido por Tudo Design
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  logo: {
    width: '100%',
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textWelcome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#818181',
    marginLeft: 7,
    marginTop: 15,
    marginHorizontal: 15,
  },
  cardMoney: {
    width: '100%',
    backgroundColor: '#fff',
    elevation: 5,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginTop: 15,
  },
  textMoney: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#07add1',
  },
  card: {
    flex: 2,
    margin: 5,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 10,
  },
  cardImage: {
    width: '100%',
    height: 150,
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'center',
  },
  cardText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardSubTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    opacity: 0.4,
    textAlign: 'center',
  },
});
export default Home;
