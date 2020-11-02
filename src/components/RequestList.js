//componente che restituisce le strutture di uno specifico utente
import React, { Component } from 'react';
import {View, FlatList, StyleSheet, Text, Button, Platform, Dimensions } from 'react-native';
import colors from "../style/colors/index";
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import host from '../configHost'

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
      isLoading: true,
      userToken: null,
      status:'',
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
            this.getStructureGuest();
            var totalEarn = 0,
                possibleEarn = 0,//guadagni possibili se si accettano le richieste in sospeso
                waitingRequests = 0;
            //calcolo guadagni totali dalle prenotazioni approvate e numero di richieste in sospeso
            for(var i=0 ; i < res.data.length; i++){
              if(res.data[i].request == 1){
                totalEarn = totalEarn + res.data[i].totPrice;
              }
              if(res.data[i].request == 0){
                waitingRequests = waitingRequests +1;
                possibleEarn = possibleEarn + res.data[i].totPrice;
              }
            }
            
            if(this._isMounted){
              const structures = res.data;
              console.log(res.data)
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
      console.log(this.state.data)
    }

    async getStructureGuest() {
       const url = `http://${host.host}:3055/users/statement/${this.state.userToken}`;
       axios.get(url, {
           method: 'GET',
           headers: {
             'content-type': 'application/json',   
           }
         })
         .then(res => {
            const guests = res.data;
            this.setState({
              bookingGuests: guests
            })
            this.updateState({
              bookingGuests: guests
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
    
    const { navigation } = this.props;

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
                data= {this.state.data}
                keyExtractor = {(item, index) => index.toString()}
                inverted={true}
                renderItem = {({item}) =>
                  <View style={styles.item}>
                      <View style={styles.viewRow}>
                          {
                            item.request== 0 ? <Text style={styles.request}>In attesa di approvazione</Text> :null
                          }
                          {
                            item.request== 1 ? <Text style={styles.requestApproved}>Approvata</Text>:null
                          }
                          {
                            item.request== 2 ? <Text style={styles.requestDontApproved}>Rifiutata</Text>:null
                          }
                          
                        <Text style={styles.titleStructure}>{item.title}, {item.type} </Text>
                        <View style={styles.clientBox}>
                          <Text style={[styles.clientInfoText,{color: colors.transparent}]}>Cliente:</Text>
                          <Text style={styles.clientInfoText}>{item.name} {item.surname}</Text>
                          <Text style={styles.clientInfoText}>{item.email.toLowerCase()}</Text>
                        </View>
                      
                      </View>
                      <View style={styles.checkInOut}>
                
                          <View style={{flexDirection:'column'}}>
                            <Text style={styles.checkInOutText}>Check-In: </Text>
                            <Text>{item.checkIn}</Text>
                          </View>
                          <View style={styles.checkoutBox}>
                            <Text style={styles.checkInOutText}>Check-Out: </Text>
                            <Text>{item.checkOut}</Text>
                          </View>

                      </View>
                      <View style={styles.viewRow}>
                          
                          <View style={styles.priceBox}>
                            <Text style={styles.priceText}>Tassa soggiorno: </Text>
                            <Text style={styles.taxPrice}>{item.cityTax} € </Text>
                            <Text style={styles.priceText}>Totale: </Text>
                            <Text style={styles.totPrice}>{item.totPrice} € </Text>
                          </View>
                          
                      </View>
                      {item.request == 0 ? <View style={styles.buttonGroup}>
                          <View style={styles.button}>
                              <Button onPress = {()=> {this.postConfirm(item.id, item.totPrice)}} title="Accetta"color={colors.green02}></Button>
                          </View>
                          <View style={styles.button}>
                              <Button onPress = {()=> {this.postRefused(item.id)}} title="Rifiuta" color={colors.red}></Button>
                          </View>
                      </View>: null}
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
    fontWeight:"700",
    color:colors.black,
    marginTop:5
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