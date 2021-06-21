import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Home from './screens/Home';
import FormProduct from './screens/FormProduct';
import HomeProducts from './screens/HomeProducts';
import DetailProduct from './screens/DetailProduct';
import MovEstProduct from './screens/MovEstProduct';
import HomeFinances from "./screens/HomeFinances";
import FormFinance from "./screens/FormFinance";
import DetailMovFinance from "./screens/DetailMovFinance";
import FormEditMovFinance from "./screens/FormEditMovFinance";
import FormEditProduct from "./screens/FormEditProduct";
import DetailMovProduct from "./screens/DetailMovProduct";


const Stack = createStackNavigator();
// function Routes() {
const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{header: () => null}} />
        <Stack.Screen name="HomeProducts" component={HomeProducts} options={{header: () => null}} />
        <Stack.Screen 
            name="FormProduct" component={FormProduct} options={{
            title: 'Cadastro de Produto',
            headerStyle: {
              backgroundColor: '#07add1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
            name="FormEditProduct" component={FormEditProduct} options={{
            title: 'Editar Produto',
            headerStyle: {
              backgroundColor: '#07add1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
            name="DetailProduct" component={DetailProduct} options={{
            title: 'Detalhes do Produto',
            headerStyle: {
              backgroundColor: '#07add1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
            name="MovEstProduct" component={MovEstProduct} options={{
            title: 'Movimentação de Estoque',
            headerStyle: {
              backgroundColor: '#07add1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen name="HomeFinances" component={HomeFinances} options={{header: () => null}} />

        <Stack.Screen 
            name="FormFinance" component={FormFinance} options={{
            title: 'Movimentação Financeira',
            headerStyle: {
              backgroundColor: '#07add1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
            name="DetailMovFinance" component={DetailMovFinance} options={{
            title: 'Detalhes da Movimentação',
            headerStyle: {
              backgroundColor: '#07add1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
            name="FormEditMovFinance" component={FormEditMovFinance} options={{
            title: 'Editar Movimentação',
            headerStyle: {
              backgroundColor: '#07add1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
            name="DetailMovProduct" component={DetailMovProduct} options={{
            title: 'Detalhes da Movimentação',
            headerStyle: {
              backgroundColor: '#07add1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;