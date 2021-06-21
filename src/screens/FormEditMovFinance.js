import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Realm from 'realm';
import DatePicker from 'react-native-datepicker';
import {RadioButton} from 'react-native-paper';
import Moment from 'moment';


// import SQLite from 'react-native-sqlite-storage';

// import { Container } from './styles';
// const db = SQLite.openDatabase('esa.db');
function FormEditMovFinance({route, navigation}) {  

  const [financeTipo, setFinanceTipo] = useState();
  const [financeDescricao, setFinanceDescricao] = useState();
  const [financeValor, setFinanceValor] = useState();
  const [financeDate, setFinanceDate] = useState();

  const [movData, setMovData] = useState([]);

  useEffect(() => {


    Realm.open({
      path: 'ESADATABASE.realm',
    }).then(realm => {
      const openMoviments = realm.objectForPrimaryKey(
        'MovFinance',
        route.params.MovFinanceId,
      );
      setFinanceTipo(openMoviments.tipo);
      setFinanceDescricao(openMoviments.descricao);
      setFinanceValor(openMoviments.valor);
      setFinanceDate(openMoviments.data);
      setMovData(openMoviments);

      // cleanup function
      return () => {
        const openMoviments = realm.objectForPrimaryKey('MovFinance',route.params.MovFinanceId);
        // Remember to remove the listener when you're done!
        openMoviments.removeAllListeners();
        // Call the close() method when done with a realm instance to avoid memory leaks.
        realm.close();
      };
    });
  }, []);

  const setData = () => {
    if( !financeDate) {
      alert('Por favor insira uma data válida!');
      return;
    }
    if (!financeTipo) {
      alert('Por favor selecione o tipo de Movimentação!');
      return;
    }
    if (!financeDescricao) {
      alert('Por favor insira a descrição da movimentação!');
      return;
    }
    if (!financeValor) {
      alert('Por favor insira o valor!');
      return;
    }
    if (!financeDate) {
      alert('Por favor insira uma data válida!');
      return;
    }


    Realm.open({
      path: 'ESADATABASE.realm',
    }).then(realm => {
    
    realm.write(() => {
    
        const financeBack = realm.objects("Finance")[0];
        let saldoNovo;
        if (movData.tipo == 'Receita'){
            saldoNovo = parseFloat(financeBack.saldo) - parseFloat(movData.valor);
        }
        if(movData.tipo == 'Despesa'){
            saldoNovo =  parseFloat(financeBack.saldo) + parseFloat(movData.valor) ;
        }
        financeBack.saldo = parseFloat(saldoNovo.toFixed(2));

    });

    realm.write(() => {
        const moviment = realm.objectForPrimaryKey(
        'MovFinance',
        route.params.MovFinanceId,
        );

        moviment.valor = parseFloat(financeValor);
        moviment.tipo = financeTipo;
        moviment.descricao = financeDescricao;
   
    
        const finance = realm.objects("Finance")[0];
        let saldoNovo;
        if (movData.tipo == 'Receita'){
            saldoNovo = parseFloat(finance.saldo) + parseFloat(movData.valor);
        }
        if(movData.tipo == 'Despesa'){
            saldoNovo =  parseFloat(finance.saldo) - parseFloat(movData.valor) ;
        }
        finance.saldo = parseFloat(saldoNovo.toFixed(2));

        Alert.alert(
        'Success',
        `Movimentação de ${moviment.tipo}, ${moviment._id} - ${moviment.valor.toString()} atualizada com sucesso!`,
        [
          {
            text: 'Ok',
            onPress: () => navigation.navigate('HomeFinances'),
          },
        ],
        {cancelable: false},
      );
    });
})
  };

  return (
    <View style={styles.container}>     

      {/* <View style={{ paddingTop: 20}}>
            <Text style={styles.titlePage}>Cadastro de Produto</Text>
        </View> */}
      <View
        style={{
          marginTop: 35,
          borderWidth: 1,
          borderColor: '#9c9c9c',
          margin: 10,
          paddingVertical: 10,
        }}>
        <ScrollView
        vertical
        showsVerticalScrollIndicator={true}
        style={{marginTop: 0}}>
        
        <Text
          style={styles.textLabel} >
          Data
        </Text>
        <DatePicker
          style={styles.datePickerStyle}
          date={movData.data && Moment(movData.data.toISOString().substring(0, 10)).format('DD/MM/Y')} // Initial date from state
          mode="date" // The enum of date, datetime and time
          placeholder="Selecionar Data"
          format="DD/MM/YYYY"
          minDate={movData.data && Moment(movData.data.toISOString().substring(0, 10)).format('DD/MM/Y')}
          maxDate={movData.data && Moment(movData.data.toISOString().substring(0, 10)).format('DD/MM/Y')}
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          onDateChange={financeDate => {
            setFinanceDate(financeDate);
          }}
        />
        <Text
          style={styles.textLabel}>
          Tipo
        </Text>
        <RadioButton.Group
          onValueChange={financeTipo => setFinanceTipo(financeTipo)}
          value={financeTipo}>
            <RadioButton.Item label="Receita" value="Receita" />
            <RadioButton.Item label="Despesa" value="Despesa"/>
        </RadioButton.Group>
        <Text style={styles.textLabel}>Descrição</Text>
        <TextInput
          placeholder="Descrição"
          style={styles.input}
          onPress={this}
          value={financeDescricao}
          onChangeText={financeDescricao => setFinanceDescricao(financeDescricao)}
        />
        <Text style={styles.textLabel}>Valor</Text>
        <TextInput
          placeholder="Valor"
          style={styles.input}
          onPress={this}
          value={financeValor && financeValor.toString()}
          onChangeText={financeValor => setFinanceValor(financeValor)}
        />
        <Image source={require('../assets/img/logo.png')} style={styles.logo} />
        </ScrollView>
      </View>

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
  logo: {
    width: '100%',
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  datePickerStyle: {
    width: '90%',
    marginTop: 5,
    marginHorizontal: 15,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titlePage: {
    color: 'black',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  textLabel: {
    marginLeft: 15,
    fontWeight: '700',
    color: '#3a3a3a',
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    marginTop: 2,
  },
});

export default FormEditMovFinance;
