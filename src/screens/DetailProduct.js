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

export default function DetailProduct({route, navigation}) {
  
  const [productData, setProductData] = useState([]);
  const [movData, setMovData] = useState([]);
  
  useEffect(() => {
    setMovData([]);
    Realm.open({
      path: 'ESADATABASE.realm',
    }).then(realm => {
      const products = realm.objects('Product');
      const openProducts = products.filtered('_id = ' + route.params.ProductId);
      
      const moviments = realm.objects('Moviment');
      const openMoviments = moviments.filtered('product_id = ' + route.params.ProductId);
      const movimentsByData = openMoviments.sorted([["dtMov",true], ["_id", true]]);
    
      // set state to the initial value of your realm objects
      setProductData(openProducts);
      setMovData(movimentsByData);


      movimentsByData.addListener(() => {
        // update state of tasks to the updated value
        setMovData(movimentsByData);
      });
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 15}} onPress={ () => navigation.navigate('FormEditProduct', {ProductId: route.params.ProductId}) }>
              <Icon name="edit" color='white' size={24}>
              </Icon>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  

  return (
    <View style={styles.container}>
      <ScrollView
        vertical
        showsVerticalScrollIndicator={true}
        style={{marginTop: 1, marginBottom: 10}}>
        {productData.map(openProduct => {
          return (
            <View key={openProduct._id}>
                {!openProduct.dirphoto 
                  ? <Image  source={require('../assets/img/noPhoto.png')} style={styles.image}/> 
                  : <Image source={{ uri: openProduct.dirphoto }} style={styles.image}/> 
                }
              <Text style={styles.title}>{openProduct.name}</Text>
              <Text style={styles.subtitle}>
                Estoque: {openProduct.estoque}
              </Text>
            </View>
          );
        })}

        <Text style={styles.titleMov}>Últimas Movimentações</Text>

        {movData.map(value => {
            return (
              <TouchableOpacity
              style={{
                backgroundColor: '#c0d5ec',
                marginVertical: 5,
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginHorizontal: 15,
                borderRadius: 5,
              }}
              onPress={() =>
                navigation.navigate('DetailMovProduct', {MovId: value._id})
              }
              key={value._id}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>
                {Moment(value.dtMov.toISOString().substring(0, 10)).format('DD/MM/Y')}
                </Text>
                <Text>{value.tipo}</Text>
                <Text style={{color: 'black'}}>
                  Qtd:{value.quantidade}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>{value.tipo == 'Entrada' ? 
                        'Fornecedor: '+value.fornecedor
                        : 'Cliente:' +value.cliente}</Text>
              </View>
            </TouchableOpacity>

            );
      })}
        <Image source={require('../assets/img/logo.png')} style={styles.logo} />
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
        onPress={() =>
          navigation.navigate('MovEstProduct', {
            ProductId: route.params.ProductId,
          })
        }>
        <Icon name="truck" color="white" size={24}></Icon>
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
  image: {
    width: '100%',
    height: 250,
    top: 0,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
    marginTop: 10,
  },
  subtitle: {
    fontWeight: 'bold',
    opacity: 0.4,
    textAlign: 'center',
    fontSize: 22,
    marginTop: 8,
  },
  titleMov: {
    fontWeight: 'bold',
    paddingTop: 25,
    textAlign: 'center',
    fontSize: 20,
  },
  logo: {
    width: '100%',
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 15,
  },
});