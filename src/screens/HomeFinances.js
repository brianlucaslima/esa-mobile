import React, {useEffect, useState} from 'react';
import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Moment from 'moment';

import Realm from 'realm';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function HomeFinances({navigation}) {
  

  const [financeData, setFinanceData] = useState([]);
  const [movData, setMovData] = useState([]);


  useEffect(() => {
    setFinanceData([]);
    setMovData([]);

    Realm.open({
      path: 'ESADATABASE.realm',
    }).then(realm => {

      const finance = realm.objects('Finance');

      setFinanceData(finance);

      const movfinance = realm.objects('MovFinance');
      const movFinanceActive = movfinance.filtered('status = "A"').sorted([['data', true], ['_id', true]]);


      setMovData([...movFinanceActive]);

      movFinanceActive.addListener(() => {
        console.log('passou aqui no listener');
        setMovData([...movFinanceActive]);
      });

      // cleanup function
      return () => {
        console.log('cleanup function listeners');
        const movfinance = realm.objects('MovFinance');
        const movFinanceActive = movfinance.filtered('status = "A"');

        // Remember to remove the listener when you're done!
        movFinanceActive.removeAllListeners();
        // Call the close() method when done with a realm instance to avoid memory leaks.
        realm.close();
      };




    });
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setFinanceData([]);
    setMovData([]);
    Realm.open({
      path: 'ESADATABASE.realm',
    }).then(realm => {

      const finance = realm.objects('Finance');

      setFinanceData(finance);

      const movfinance = realm.objects('MovFinance');
      const movFinanceActive = movfinance.filtered('status = "A"').sorted([['data', true], ['_id', true]]);


      setMovData([...movFinanceActive]);
    });
    
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  


  return (
    <View style={styles.container}>
      <Image source={require('../assets/img/logo.png')} style={styles.logo} />

      <ScrollView
        vertical
        showsVerticalScrollIndicator={true}
        style={{marginTop: 10}} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{flex: 1, flexDirection: 'column', marginHorizontal: 15}}>
          <TouchableOpacity style={styles.cardMoney}>
            
            <Text style={{marginBottom: 1, fontWeight: 'bold'}}>
              Saldo em Conta
            </Text>
            {financeData.map(finance => {
            return (
              <Text style={styles.textMoney} key={finance.id}>
                R$ {parseFloat(finance.saldo).toFixed(2)}
              </Text>
            );})}
            
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
          {movData != '' && movData.map(mov => (
            <TouchableOpacity
              style={{
                backgroundColor: '#c0d5ec',
                width: '100%',
                marginVertical: 5,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
              }}
              onPress={() =>
                navigation.navigate('DetailMovFinance', {MovFinanceId: mov._id})
              }
              key={mov._id}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>
                  {Moment(mov.data.toISOString().substring(0, 10)).format(
                    'DD/MM/Y',
                  )}
                </Text>
                {mov.tipo == 'Despesa' && (
                  <Text style={{color: 'red'}}>R$ -{mov.valor.toFixed(2)}</Text>
                )}
                {mov.tipo == 'Receita' && (
                  <Text style={{color: 'green'}}>
                    R$ {mov.valor.toFixed(2)}
                  </Text>
                )}
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>{mov.descricao}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {movData == '' && <Text style={{ textAlign: 'center', width: '100%'}}>Nenhuma movimentação cadastrada!</Text>}
        </View>
        <View style={{height: 50}}></View>
      </ScrollView>
      <Text style={{alignSelf: 'center', fontSize: 10, marginBottom: 2}}>
        Desenvolvido por Tudo Design
      </Text>
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
        onPress={() => navigation.navigate({name: 'FormFinance'})}>
        <Icon name="plus" color="white" size={24}></Icon>
      </TouchableOpacity>
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
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginTop: 15,
  },
  textMoney: {
    fontSize: 40,
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
