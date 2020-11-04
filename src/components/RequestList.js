//componente che restituisce le strutture di uno specifico utente
import React, { Component } from 'react';
import {View, FlatList, StyleSheet, Text, Button, Platform, Dimensions } from 'react-native';
import colors from "../style/colors/index";
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import host from '../configHost'
import moment from "moment";
import dateConverter from '../components/dateConverter'
var itemWidth = '50%';
if(Platform.OS === 'android' || Dimensions.get('window').width < 700){
  itemWidth = '100%';
}

export default class StructuresList extends Component {
  
  constructor(props){
    
  super(props);
  this.state = {
    data: [],//lista di tutte le richieste di prenotazione a carico delle strutture dell'utente loggato
    bookingGuests: [],//lista di tutti gli ospiti
    bookingList:[],//lista delle prenotazioni+gli ospiti
    isLoading: true,
    userToken: null,
    status:'',
    today: '',
    totEarn:0, //guadagni totali,
    waitingRequests : 0, //richieste in sospeso
    possibleEarn : 0,//guadagni possibili se si accettano le richieste in sospeso
  }
  }
  updateState(data){
  this.props.updateState(data)
  }

  _isMounted = false;
  componentDidMount = () => {
    /* OPERAZIONI PER IL CONTROLLO DELLA SCADENZA DI UNA RICHISTA IN ATTESA DI APPROVAZIONE, CALCOLO DATA ODIERNA IN FORMATO STRINGA DD-MM-YYYY*/
  /* Calcoliamo la data di oggi e la convertiamo nel formato accettabile dalla libreria moment... cioè DD/MM/YYYY */
  var date = new Date(),
      todayDate = dateConverter(date),//converte data in formato Date in una stringa DD-MM-YYYY
      today_ = moment(todayDate,'DD-MM-YYYY');
  this.setState({
    today: today_
  })
  this._isMounted = true;
  //get current token
  const itemToken = AsyncStorage.getItem('userToken')
  itemToken.then(token => {
    this.setState({userToken: token})
    console.log("token booking state");
    console.log(this.state.userToken);
    if(this.state.userToken != null){
      const url = `http://${host.host}:3055/bookings/profile/request/${this.state.userToken}`;
      axios.get(url, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
          }
        })
        .then(res => {
          this.getStructureGuest(res.data);
          var totalEarn = 0,
              possibleEarn = 0,//guadagni possibili se si accettano le richieste in sospeso
              waitingRequests = 0;

          //calcolo guadagni totali dalle prenotazioni approvate e numero di richieste in sospeso
          for(var i=0 ; i < res.data.length; i++){
            if(res.data[i].request == 1){
              totalEarn = totalEarn + res.data[i].totPrice;
            }
            if(res.data[i].request == 0){
              //se la data di checkIn è passata e la richiesta non è stata accetatta alora viene automaticamente rifiutata e rimborata 
              //per evitare bug nelle date (es. 29 febbraio quando il mese non è bisestile) converto in formate Date e poi riconverto in formato stringa..abs
              var checkIn = new Date(res.data[i].checkIn.substring(6,10),(parseInt(res.data[i].checkIn.substring(3,5))-1).toString(),res.data[i].checkIn.substring(0,2)),
                  checkInDateString = dateConverter(checkIn);
              if( moment(checkInDateString,'DD-MM-YYYY') > today_){
                waitingRequests = waitingRequests +1;
                possibleEarn = possibleEarn + res.data[i].totPrice;
              }else{
                this.postRefused(res.data[i].id)
              }
              
            }
          }
          if(this._isMounted){
            const structures = res.data;
            this.setState({
              isLoading:false,
              data: structures,
              totEarn : totalEarn,
              possibleEarn:possibleEarn,
              waitingRequests:waitingRequests
            })
            /* qui aggiorniamo requestList presente nllo stato di Login (genitore) passandogli solo le richieste GIA ACCETTATE (per il rendiconto dei 3 mesi precedenti) */
            this.props.updateState({
              requestList : structures
            })
            /* qui aggiorniamo il numero di notifiche da passare al bottone...(se sono maggiori di 10 allora passiamo un '9+' generico) */
            if(waitingRequests < 10){
              this.props.updateState({
                waitingRequests:waitingRequests
              })
            }
            else this.props.updateState({waitingRequests:'9+'})
          }
      })
    }
    });
  }

  async getStructureGuest(bookingData) {
      console.log(bookingData)
      const url = `http://${host.host}:3055/users/statement/${this.state.userToken}`;
      axios.get(url, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',   
          }
        })
        .then(res => {
          const guests  = res.data;
          /* per ogni richiesta 'aggiungo' gli ospiti corrispondenti */
          var bookingList = [];
          for(var i = 0; i < bookingData.length; i++){
            var singleBooking = [],
                bookingGuests = [];
            singleBooking.push(bookingData[i])
            for(var j = 0; j < guests.length; j++){
              if(guests[j].id == bookingData[i].id){
                bookingGuests.push(guests[j]);
              }
            }
            singleBooking.push(bookingGuests);
            bookingList.push(singleBooking);
          }
          this.setState({
            bookingGuests: guests,
            bookingList: bookingList
          })
          this.updateState({
            bookingList : bookingList
          })
        })
        .catch(function (error) {
          console.log(error);
        });
    }

  async postConfirm(itemID, earn) {
    var totEarn_ = this.state.totEarn;
    const url = `http://${host.host}:3055/bookings/profile/response/${itemID}`;
    axios.post(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',   
        }
      })
      .then(res => {
          console.log(res);
          this.postEmailConfirm(itemID);
        })
      .catch(function (error) {
        console.log(error);
      });
      
      var data_ = this.state.data,
          request_wait = this.state.waitingRequests;

      for(var i = 0; i < data_.length; i++){
        if(itemID == data_[i].id){
          data_[i].request = 1;
          this.setState({
            data:data_,
            waitingRequests: request_wait-1,
            totEarn : totEarn_+earn
          });
          this.props.updateState({
            waitingRequests:request_wait-1
          })
          break
        }
      }
      
  }

  async postEmailConfirm(itemID){
    const url = `http://${host.host}:3055/bookings/send/confirm`;
    axios.post(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',   
    },
    id : parseInt(itemID)
    })
    .then(res => {
      console.log(res);
      })
    .catch(function (error) {
      console.log(error);
    });
  }


  async postRefused(itemID) {
    const url = `http://${host.host}:3055/bookings/profile/response/refused/${itemID}`;
    axios.post(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',   
        }
      })
      .then(res => {
        console.log(res);
        this.postEmailRefused(itemID);
        })
      .catch(function (error) {
        console.log(error);
      });

      var data_ = this.state.data,
          request_wait = this.state.waitingRequests;

      for(var i = 0; i < data_.length; i++){
        if(itemID == data_[i].id){
          data_[i].request = 2;
          this.setState({
            data:data_,
            waitingRequests: request_wait-1
          });
          this.props.updateState({
            waitingRequests:request_wait-1
          })
          break
        }
      }
  }
  
  async postEmailRefused(itemID){
    const url = `http://${host.host}:3055/bookings/send/refused`;
    axios.post(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',   
    },
    id : parseInt(itemID)
    })
    .then(res => {
      console.log(res);
      })
    .catch(function (error) {
      console.log(error);
    });
  }

  render(){
    return (
      <View style={styles.container}>
        {
          this.state.data.length != 0?      
          <View>
            <View style={{flexDirection:'row',alignContent:'center', alignSelf:'center'}}>
              <Text style={styles.infoText}>Guadagni totali :</Text>
              <Text style={styles.totEarn}> {this.state.totEarn} €</Text>
            </View>
            <View style={{flexDirection:'row',alignContent:'center', alignSelf:'center'}}>
              <Text style={styles.infoText}>Richieste in sospeso :</Text>
              <Text style={styles.totEarn}> {this.state.possibleEarn} €</Text>
            </View>
              <FlatList
                data= {this.state.bookingList}
                inverted={true}
                keyExtractor = {(item, index) => index.toString()}
                renderItem = {({item, index}) =>
                  <View style={styles.item}>
                      <View style={styles.viewRow}>
                          {
                            item[0].request== 0 ?
                            <View>
                              { moment(dateConverter(new Date(item[0].checkIn.substring(6,10),(parseInt(item[0].checkIn.substring(3,5))-1).toString(),item[0].checkIn.substring(0,2))),'DD-MM-YYYY') > this.state.today ?
                                <Text style={styles.request}>In attesa di approvazione</Text> 
                                  :
                                <Text style={styles.request}>Scaduta e Rimborsata</Text> 
                              }
                            </View>
                              :
                            null
                          }
                          {
                            item[0].request== 1 ? <Text style={styles.requestApproved}>Approvata</Text>:null
                          }
                          {
                            item[0].request== 2 ? <Text style={styles.requestDontApproved}>Rifiutata</Text>:null
                          }
                        <Text style={styles.titleStructure}>{item[0].title}, {item[0].type} </Text>
                        <View style={styles.clientBox}>
                          <Text style={[styles.clientInfoText,{color: colors.transparent}]}>Cliente:</Text>
                          <Text style={styles.clientInfoText}>{item[0].name} {item[0].surname}</Text>
                          <Text style={styles.clientInfoText}>{item[0].email.toLowerCase()}</Text>
                        </View>
                      </View>
                      <View style={styles.guestInfo}>
                        <Text style={styles.clientInfoText,{color:colors.transparent}}>Ospiti:</Text>
                        <FlatList
                              data= {item[1]}
                              keyExtractor = {(item, index) => index.toString()}
                              renderItem = {({item}) =>
                                      <View style={styles.guestInfoWrapper}>
                                        <Text style={styles.guestInfoText}>{item.name}</Text>
                                        <Text style={styles.guestInfoText}>{item.surname}</Text>
                                        <Text style={styles.guestInfoText}>{item.date}</Text>
                                      </View>
                              }
                        />
                      </View>
                      <View style={styles.checkInOut}>
                          <View style={{flexDirection:'column'}}>
                            <Text style={styles.checkInOutText}>Check-In: </Text>
                            <Text>{item[0].checkIn}</Text>
                          </View>
                          <View style={styles.checkoutBox}>
                            <Text style={styles.checkInOutText}>Check-Out: </Text>
                            <Text>{item[0].checkOut}</Text>
                          </View>
                      </View>
                      <View style={styles.viewRow}>
                          <View style={styles.priceBox}>
                            <Text style={styles.priceText}>Tassa soggiorno: </Text>
                            <Text style={styles.taxPrice}>{item[0].cityTax} € </Text>
                            <Text style={styles.priceText}>Totale: </Text>
                            <Text style={styles.totPrice}>{item[0].totPrice} € </Text>
                          </View>
                      </View>
                      {
                        item[0].request == 0 && (moment(dateConverter(new Date(item[0].checkIn.substring(6,10),(parseInt(item[0].checkIn.substring(3,5))-1).toString(),item[0].checkIn.substring(0,2))),'DD-MM-YYYY') > this.state.today ) ? 
                          <View style={styles.buttonGroup}>
                            <View style={styles.button}>
                              <Button onPress = {()=> {this.postConfirm(item[0].id, item[0].totPrice)}} title="Accetta"color={colors.green02}></Button>
                            </View>
                            <View style={styles.button}>
                              <Button onPress = {()=> {this.postRefused(item[0].id)}} title="Rifiuta" color={colors.red}></Button>
                            </View>
                          </View> 
                            : 
                          null
                      }
                  </View>}
                contentContainerStyle={{paddingTop:40}}
              />
          </View> : <Text>Non hai nessuna richiesta di prenotazioni</Text>
      }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flexGrow:1,
    justifyContent:'center',
    alignContent:'center',
    
  },
  infoText:{
    fontSize:18,
    fontWeight: "500"
  },
  totEarn:{
    fontSize:20,
    color:colors.black,
  },
  item: {
    borderColor: colors.secondary,
    borderWidth:3,
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    width: itemWidth,
    alignSelf:'center'
  },
  titleStructure:{
    fontSize:18,
    fontWeight: "700",
    color: colors.black,
    margin:5,
    alignSelf:'flex-start',
    marginLeft:0,
  },
  request:{
    color:colors.blue,
    fontSize: 16,
    fontWeight: "700",
    borderBottomColor:colors.blue,
    borderBottomWidth:2,
    alignSelf:'flex-start',
  },
  requestDontApproved:{
    color:colors.red,
    fontSize: 16,
    fontWeight: "700",
    borderBottomColor:colors.red,
    borderBottomWidth:2,
    alignSelf:'flex-start',
  },
  requestApproved:{
    color:colors.green02,
    fontSize: 16,
    fontWeight: "700",
    borderBottomColor:colors.green02,
    borderBottomWidth:2,
    alignSelf:'flex-start',
  },
  clientBox:{
    alignSelf:'flex-start',
    marginVertical: 10
  },
  clientInfoText:{
    fontSize:12,
    alignSelf:'flex-start',
    color:colors.black,
    marginTop:5
  },
  guestInfo:{
    width:'100%',
    marginVertical:10,
  },
  guestInfoWrapper:{
    width:'100%',
    flexDirection:'row'
  },
  guestInfoText:{
    marginVertical: 5,
    marginRight:15
  },
  checkInOut:{
    flexDirection: 'row',
    alignSelf:'center',
    margin:10
  },
  checkoutBox:{
    flexDirection:'column',
    marginLeft:20
  },
  checkInOutText:{
    fontWeight:"700"
  },
  priceBox:{
    flexDirection:'row',
    alignSelf:'center'
  },
  priceText:{
    flexDirection:'row',
    fontWeight:"700",
    color:colors.black
  },
  taxPrice:{
    fontSize: 16,
    fontWeight:"700",
    color: colors.blue
  },
  totPrice:{
    fontSize: 18,
    fontWeight:"700",
    color: colors.green02,
    alignSelf:'center'
  },
  buttonGroup:{
    alignSelf:'center',
    flexDirection:'row-reverse',
    width:'100%'
  },
  button:{
    margin:4,
    width: 85
  }
  
});