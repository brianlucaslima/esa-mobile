import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Realm from 'realm';

let realm;
// import SQLite from 'react-native-sqlite-storage';

// import { Container } from './styles';
// const db = SQLite.openDatabase('esa.db');
function FormProduct({navigation}){

  realm = new Realm({
    path: "ESADATABASE.realm"
  });



      let [productName, setProductName] = useState('');
      let [productEstoque, setProductEstoque] = useState('');
      let [productPhoto, setProductPhoto] = useState('');
      let [productCategory, setProductCategory] = useState('');

      const setData = () => {
            if (!productName) {
                  alert('Por favor preencha o nome do produto!');
                  return;
            }
            if (!productEstoque) {
                  alert('Por favor insira a quantidade de estoque!');
                  return;
            }
            if (!productCategory) {
                  alert('Por favor insira a categoria do produto!');
                  return;
            }
            realm.write(() => {
              var id = realm.objects('Product').sorted('_id', true).length > 0
                ? realm.objects('Product').sorted('_id', true)[0]
                    ._id + 1
                : 1;
              const product = realm.create("Product", {   
                _id: id,             
                name: productName.toUpperCase(),
                estoque: parseInt(productEstoque),
                category: productCategory.toUpperCase(),
                dirphoto: productPhoto,
              });

              Alert.alert(
              'Sucesso',
              `Produto ${product._id} - ${product.name} cadastrado com sucesso!`,
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('HomeProducts'),
                },
              ],
              { cancelable: false }
            );
            });
      }

  return <View style={styles.container}>
      
        <ScrollView
        vertical
        showsVerticalScrollIndicator={true}
        style={{marginTop: 0}}>
        <View style={{bottom: 5}}>
          <Image source={require('../assets/img/logo.png')} style={styles.logo}/>
        </View>
        <View style={{ paddingTop: 5}}>
            <Text style={styles.textLabel}>Descrição</Text>
            <TextInput 
            placeholder='Descrição do produto' 
            style={styles.input}
            onPress={this}
            onChangeText={(productName) => setProductName(productName)}
            />
            <Text style={styles.textLabel}>Estoque</Text>
            <TextInput placeholder='Quantidade em Estoque' style={styles.input} keyboardType='numeric'
              onChangeText={(productEstoque) => setProductEstoque(productEstoque)}
            />
            <Text style={styles.textLabel}>URL Foto</Text>
            <TextInput placeholder='URL Foto do Produto para listagem' style={styles.input}
              onChangeText={(productPhoto) => setProductPhoto(productPhoto)}
            />
            <Text style={styles.textLabel}>Categoria</Text>
            <TextInput placeholder='Categoria do Produto' style={styles.input}
              onChangeText={(productCategory) => setProductCategory(productCategory)}
            />
        </View>
        </ScrollView>
        
        <Text style={{alignSelf: 'center', fontSize: 10, marginBottom: 1}}>
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
        onPress={setData}
      >
        <Icon name="save" size={24} color="white" />
      </TouchableOpacity>
        
  </View>
  ;
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
  titlePage:{
      color: 'black',
      textAlign: 'center',
      fontSize: 22,
      fontWeight: 'bold'
  },
  textLabel:{
        fontWeight: '700', 
        color: '#3a3a3a',
        marginTop: 10
  },
  input:{  
        borderBottomWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        paddingVertical: 4,
        marginTop: 2,
  }
})

export default FormProduct;

