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
import Icon from 'react-native-vector-icons/FontAwesome5';
import Realm from 'realm';


const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

function HomeProducts({navigation}) {
  const [productsData, setProductsData] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    Realm.open({
      path: 'ESADATABASE.realm',
    }).then(realm => {
      const products = realm.objects('Product').sorted('name', false);
      // set state to the initial value of your realm objects
      setProductsData([...products]);
      products.addListener(() => {
        // update state of tasks to the updated value
        setProductsData([...products]);
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

  function search() {
    console.log('Search Rodando');
    if (searchInput.length > 0) {
      Realm.open({
        path: 'ESADATABASE.realm',
      }).then(realm => {
        const productsAll = realm.objects('Product');

        const productsfiltered = realm
          .objects('Product')
          .filtered(`name CONTAINS[c] "${searchInput}"`)
          .sorted('name', false);

        setProductsData([...productsfiltered]);
        return () => {
          const products = realm.objects('products').sorted('name', false);
          products.removeAllListeners();
          realm.close();
        };
      });
    } else {
      Realm.open({
        path: 'ESADATABASE.realm',
      }).then(realm => {
        const products = realm.objects('Product').sorted('name', false);

        setProductsData([...products]);

        return () => {
          const products = realm.objects('products').sorted('name', false);
          products.removeAllListeners();
          realm.close();
        };
      });
    }
  }

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/img/logo.png')} style={styles.logo} />

      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          marginBottom: 5,
          backgroundColor: '#D3D3D3',
          padding: 5,
          borderRadius: 10,
        }}>
        <Icon
          name={'search'}
          color="black"
          size={25}
          style={{paddingHorizontal: 10}}></Icon>
        <TextInput
          placeholder="Search"
          style={{
            color: 'black',
            fontWeight: '500',
            width: 300,
            padding: 0,
          }}
          onChangeText={searchInput => setSearchInput(searchInput)}
          onKeyPress={search}
        />
      </View>

      <ScrollView
        vertical
        showsVerticalScrollIndicator={true}
        style={{marginTop: 10}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            paddingBottom: 200,
          }}>
          {productsData.map(product => {
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate('DetailProduct', {ProductId: product._id})
                }
                key={product._id}>
                <View>
                  {!product.dirphoto ? (
                    <Image
                      source={require('../assets/img/noPhoto.png')}
                      style={styles.cardImage}
                    />
                  ) : (
                    <Image
                      source={{uri: product.dirphoto}}
                      style={styles.cardImage}
                    />
                  )}

                  <Text style={styles.cardTitle}>{product.name}</Text>
                  <Text style={styles.cardSubTitle}>
                    Estoque: {product.estoque}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
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
        onPress={() => navigation.navigate({name: 'FormProduct'})}>
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
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  categoryText: {
    fontSize: 18,
  },
  categoryContainer: {
    paddingRight: 20,
    paddingVertical: 5,
  },
  card: {
    width: '45%',
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    margin: 5,
    borderRadius: 15,
    paddingBottom: 10,
  },  
  cardImage: {
    width: 130,
    height: 150,
    alignSelf: 'center',
    marginTop: 0,
    paddingHorizontal: 5,    
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: 'center',
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
export default HomeProducts;
