//componente che restituisce le strutture di uno specifico utente

 /* CALCOLO DATA SCADENZA RENDICONTO TRIMESTRALE: vengono usati 4 parametri,
  1- START_DATE -> attributo 'Data' della struttura, indica il giorno in cui è stata creata la struttura (dato salvato nel db)
  2- TODAY -> La data di oggi, inizializzata in componentDidMount
  3- STATEMENT -> attributo numerico della struttura, indica il numero di volte in cui è stato mandato il rendiconto (inizializata a 0 e salvata nel database)
  4- DEADLINE -> è inizializzata a 90, indica i 3 mesi di tempo, è un dato costante salvato in this.state, nel componente  

  CALCOLO: Quando vengono scaricate le strutture, deadline è inizializzato a 90
          Calcoliamo i giorni di differenza fra START_DATE e TODAY :
          DIFF_DAYS = (TODAY - START_DATE)

          Calcoliamo se è necessario mandare il rendiconto (quindi calcoliamo se sono passati 3 mesi dall'ultimo rendicont):
          DEADLINE * (STATEMENT + 1)

          Se DIFF_DAYS >= DEADLINE * (STATEMENT + 1) allora mostriamo un messaggio di avviso, cliccando sul bottone si verrà reindirizzati alla pagina del rendiconto

          Se viene mandato il rendiconto la variabile STATEMENT della struttura nel db viene aggiornata aggiungendo +1 al conteggio

  ESEMPIO: 1) l'utente crea una struttura, STATEMENT = 0, START_DATE = 1/1/2021 , DEADLINE = 90 * (STATEMENT + 1) = 90

          2) Arriviamo al 31/3/2020, passano quindi 90 giorni da quando l'ha creata,
            - Viene effettuato il controllo (31/3/2020 - 1/1/2021) > 90 * (0 + 1) 
            - L'utente viene avvisato di dover mandare il rendiconto
            - L'utente clicca su invia rendiconto all'ufficio del turismo
            - Il parametro STATEMENT della struttra, che conta le volte in cui si è mandato il rendiconto, diventa 0+1 = 1
                                STATEMENT = 1
          3) Passano altri 90 giorni, siamo al 29/6/2020
            - Viene effettuato il controllo (29/6/2020 - 31/3/2020) > 90 * (1 +1) 
              che sarebbe TODAY - (START_DATE + (DEADLINE * STATEMENT)) > DEADLINE * (STATEMENT + 1)
              Quindi se TODAY - (START_DATE + (DEADLINE * STATEMENT) )  >  180 viene mostrato l'avviso del rendiconto
            - l'utente invia il rendiconto e STATEMENT viene aggiornato a STATEMENT+1 = 2
          ...
          ...

          il procedimento si ripete n volte...
*/
import React, { Component } from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import colors from "../style/colors/index";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import host from '../configHost';
import moment from 'moment';
import dateConverter from '../components/dateConverter'

var itemWidth = '40%';
if(Platform.OS === 'android' || Dimensions.get('window').width < 700){
  itemWidth = '90%';
}
class StructuresList extends Component {
  
   constructor(props){
     
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      userToken: null,
      today:'',
      deadline:90,//equivale a 3 mesi
      requestList:[] //lista delle richieste di prenotazione di TUTTE l estrutture dell'utente(da smistare in ogni singola struttura), ci servono per inviare il rendiconto
    }
   }
  
   componentDidMount = () => {
     this.setState({
      requestList: this.props.requestList,
     })
    /* OPERAZIONI PER IL CONTROLLO PERIODICO DEL RENDICONTO, CALCOLO DATA ODIERNA IN FORMATO STRINGA DD-MM-YYYY*/
    /* Calcoliamo la data di oggi e la convertiamo nel formato accettabile dalla libreria moment... cioè DD/MM/YYYY */
    var date = new Date(), //NOTA: indica la data di oggi, per testare il funzionamento del rendiconto cambiarla 
        dateString = dateConverter(date),
        today = moment(dateString,'DD-MM-YYYY');
    //get current token
    const itemToken = AsyncStorage.getItem('userToken')
    itemToken.then(token => {
      this.setState({userToken: token})
      if(this.state.userToken != null){
        const url = `http://${host.host}:3055/structures/profile/${this.state.userToken}`;
        axios.get(url, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
            }
          })
          .then(res => {
            const structures = res.data;
            console.log('STRUTTUREEEE')
            console.log(res.data)
            this.setState({
              isLoading:false,
              today : today,
              data: structures
            })
        })
      }
      });
  }
  navigateToStructure(item){
    const { navigation } = this.props;
    var statementStatus_ = false; //variabile che discrimina quale sezione aprire nella pagine successiva (INFO O RENDICONTO In UserStructure), se bisogna mandare il rendiconto viene settata a false e apre prima la sezione del rendiconto
    
    /* ***********CONTROLLO DEL RENDICONTO***********/ 
    //VEDI COMMENTI A INIZIO PAGINA PER LA SPIEGAZIONE
    //se deve essere mandato vengono modificate le informazioni passate alla navigazione sulla struttura
    if(this.state.today.diff(moment(item.start_date,'DD-MM-YYYY'), 'days') > this.state.deadline*(item.statement + 1)){
      statementStatus_ = true;
    }
 
    /* passo alla singola strutture solo le richieste(requestList) accettate per essa*/
    var structureRequest = []; //richieste da passare alla navigazione
    if(this.state.requestList.length != 0){
      for(let i = 0; i < this.state.requestList.length ; i++){
        if(this.state.requestList[i][0].structure_id == item.id && this.state.requestList[i][0].request == 1){
          structureRequest.push(this.state.requestList[i]);
        }
      }
    }
    if(statementStatus_){
      this.props.updateState({status2:false, status3: true, borderWidth3: 3, borderWidth2: 0})
    }
    navigation.navigate('UserStructure',{
      /* parametri da passare alla schermata successiva */
      userToken: this.state.userToken,
      itemName: item.name,
      temSurname: item.surname,
      itemEmail: item.email,
      itemTitle: item.title,
      itemPrice: item.price,
      itemID: item.id,
      itemPlace: item.place,
      itemStreet: item.street,
      itemNumber: item.number,
      itemPostCode: item.post_code,
      itemBeds: item.beds,
      itemType: item.type,
      itemKitchen: item.kitchen,
      itemFullBoard: item.fullboard,
      itemAirConditioner: item.airConditioner,
      itemWifi: item.wifi,
      itemParking: item.parking,
      itemStartDate : item.start_date, //data in cui la struttura è stata creata
      itemDescription: item.description,
      locationDescription: item.location_description,
      image1: item.image1,
      image2 : item.image2,
      image3: item.image3,
      image4 : item.image4,
      requestList : structureRequest,
      statementStatus: statementStatus_, //se statementStatus = true viene mostrata la pagina del rendiconto pre-impostata per inviarlo all'ufficio del turismo
      statementNumber : item.statement,//numero di volte in cui è stato mandato il rendiconto
      deadline : this.state.deadline,//90 giorni
      startDate : item.start_date,//data in cui è stata creata la struttura
    });
  }
  render(){
    

    return (
      
      <View style={styles.container}>
       { this.state.data.length != 0 ? 
       <FlatList
          data= {this.state.data}
          keyExtractor = {(item, index) => index.toString()}
          inverted={true}
          renderItem = {({item}) =>
            <View style={styles.item}>
              <TouchableOpacity
                style={styles.structureButton}
                onPress={()=>{this.navigateToStructure(item)}}
              >
                <Text style={styles.titleStructure}>{item.title}</Text>
              </TouchableOpacity>
              <Text style={{alignSelf:'flex-start',fontWeight:'700'}}>{item.place}</Text>
              <View style={{flexDirection:'row', alignSelf:'flex-end'}}>
                { /* ***********CONTROLLO DEL RENDICONTO***********/ 
                  //VEDI COMMENTI A INIZIO PAGINA PER LA SPIEGAZIONE
                  this.state.today.diff(moment(item.start_date,'DD-MM-YYYY'), 'days') > this.state.deadline*(item.statement + 1) ? 
                    <Text style={styles.dateswarning} onPress={()=>{this.navigateToStructure(item)}}>RENDICONTO TRIMESTRALE</Text> : null
                }
                <Text 
                  style={styles.editButton} 
                  onPress={()=>{ 
                    const { navigation } = this.props;
                    this.props.updateState({status2:false, status3: true, borderWidth3: 3, borderWidth2: 0})
                    navigation.navigate('EditStructure',{
                      /* parametri da passare alla schermata successiva */
                      userToken: this.state.userToken,
                      itemName: item.name,
                      temSurname: item.surname,
                      itemEmail: item.email,
                      itemTitle: item.title,
                      itemPrice: item.price,
                      itemID: item.id,
                      itemPlace: item.place,
                      itemStreet: item.street,
                      itemNumber: item.number,
                      itemPostCode: item.post_code,
                      itemBeds: item.beds,
                      itemType: item.type,
                      itemKitchen: item.kitchen,
                      itemFullBoard: item.fullboard,
                      itemAirConditioner: item.airConditioner,
                      itemWifi: item.wifi,
                      itemParking: item.parking,
                      itemDescription: item.description,
                      locationDescription: item.location_description,
                      image1: item.image1,
                      image2 : item.image2,
                      image3: item.image3,
                      image4 : item.image4
                    })}} >Modifica
                </Text>
              </View>
            </View>
          }
          contentContainerStyle={{paddingTop:40}}
        />  : <Text>Nessuna struttura registrata, aggungine una per diventare Host!</Text>}
      </View>
    );
  }
}

export default function(props) {
  const navigation = useNavigation();
  return <StructuresList {...props} navigation={navigation} />;
}

const styles = StyleSheet.create({
  container: {
    flexGrow:1,
  },
  item: {
    borderColor: colors.tertiary,
    borderWidth:3,
    borderRadius: 8,
    padding: 5,
    marginTop: 4,
    alignSelf:'center',
    height: 'auto',
    width: itemWidth
  },
  titleStructure:{
    fontSize: 18,
    color: colors.secondary,
    fontWeight:'700',
    alignSelf:'flex-start',
    textDecorationLine:'underline'
  },
  editButton:{
    color: colors.white, 
    fontSize:12, 
    fontWeight: "700",
    padding:4,
    width: 80,
    textAlign:'center',
    alignSelf:'flex-end',
    margin: 2,
    backgroundColor: colors.green01,
    borderColor: colors.green01,
    borderWidth: 1,
    borderRadius: 10
  },
  dateswarning:{
    color: colors.white, 
    fontSize:12, 
    fontWeight: "700",
    padding:4,
    textAlign:'center',
    alignSelf:'flex-end',
    margin: 2,
    backgroundColor: colors.red,
    borderColor: colors.orange2,
    borderWidth: 1,
    borderRadius: 4

  },
  
});