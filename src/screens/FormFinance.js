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

// import SQLite from 'react-native-sqlite-storage';

// import { Container } from './styles';
// const db = SQLite.openDatabase('esa.db');
export default function FormFinance({navigation}) {
  const [financeDate, setFinanceDate] = useState();
  const [dateMax, setDateMax] = useState();
  const [financeTipo, setFinanceTipo] = React.useState('Receita');
  const [financeDescricao, setFinanceDescricao] = useState('');
  const [financeValor, setFinanceValor] = useState('');
  

  useEffect(() => {
    const dataAtual = new Date();
    const dataAtualFormatada = dataAtual.getDate() + '/' + (dataAtual.getMonth() + 1) + '/' + dataAtual.getFullYear();
    setDateMax(dataAtualFormatada);

  }, []);


  const FormataStringData = (data) =>{
    var mes = data.split('/')[1];
    var dia = data.split('/')[0];
    var ano = data.split('/')[2];

    return ano + '-' + ('0' + mes).slice(-2) + '-' + ('0' + dia).slice(-2);
    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
  }


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
      var id =
        realm.objects('MovFinance').sorted('_id', true).length > 0
          ? realm.objects('MovFinance').sorted('_id', true)[0]._id + 1
          : 1;
      const finance = realm.create('MovFinance', {
        _id: id,
        tipo: financeTipo,
        descricao: financeDescricao,
        valor: parseFloat(financeValor),
        data: FormataStringData(financeDate),
        status: 'A',
      });

      const saldo = realm.objects("Finance")[0];
      // Update some properties on the instance.
      // These changes are saved to the realm.
      let novoSaldo;
      if (financeTipo == 'Receita'){
        novoSaldo = saldo.saldo + parseFloat(financeValor) ;

      }
      if(financeTipo == 'Despesa'){
        novoSaldo =  saldo.saldo - parseFloat(financeValor) ;
      }
      saldo.saldo = parseFloat(novoSaldo.toFixed(2));

      Alert.alert(
        'Success',
        `Mivimentação ${finance.tipo}, ${finance._id} - ${finance.valor} cadastrada com sucesso!`,
        [
          {
            text: 'Ok',
            onPress: () => navigation.navigate('HomeFinances'),
          },
        ],
        {cancelable: false},
      );

      
    });
  });
    

      
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
          date={financeDate} // Initial date from state
          mode="date" // The enum of date, datetime and time
          placeholder="Selecionar Data"
          format="DD/MM/YYYY"
          minDate="01/01/2016"
          maxDate={dateMax}
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
          onChangeText={financeDescricao => setFinanceDescricao(financeDescricao)}
        />
        <Text style={styles.textLabel}>Valor</Text>
        <TextInput
          placeholder="Valor"
          style={styles.input}
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
