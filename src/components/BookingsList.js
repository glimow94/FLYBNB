//componente che restituisce le prenotazioni che ha inviato il cliente
import React, { Component } from 'react';
import {View, FlatList, StyleSheet, Text, Platform, Dimensions } from 'react-native';
import colors from "../style/colors/index";
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import host from '../configHost'
import dateConverter from '../components/dateConverter';
import moment from 'moment'
var itemWidth = '50%';
if(Platform.OS === 'android' || Dimensions.get('window').width < 700){
  itemWidth = '90%';
}

export default class StructuresList extends Component {
  
   constructor(props){
     
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      userToken: null,
      status:'',
      today: '' //data di oggi
    }
   }
   _isMounted = false;
   componentDidMount = () => {
    /* OPERAZIONI PER IL CONTROLLO DELLA SCADENZA DI UNA RICHISTA IN ATTESA DI APPROVAZIONE, CALCOLO DATA ODIERNA IN FORMATO STRINGA DD-MM-YYYY*/
    /* Calcoliamo la data di oggi e la convertiamo nel formato accettabile dalla libreria moment... cioè DD/MM/YYYY */
    var date = new Date(),
    todayDate = dateConverter(date),//converte data in formato Date in una stringa DD-MM-YYYY
    today_ = moment(todayDate,'DD-MM-YYYY');
    console.log(today_)
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
        const url = `http://${host.host}:3055/bookings/profile/${this.state.userToken}`;
        axios.get(url, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
            }
          })
          .then(res => {
            console.log(res.data);
            if(this._isMounted){
              const structures = res.data;
              this.setState({
                isLoading:false,
                data: structures,
              })
            }
        })
      }
      });
  }

  render(){
    
    const { navigation } = this.props;

    return (
      
      <View style={styles.container}>
        {this.state.data.length >0 ? 
        <FlatList
          data= {this.state.data}
          keyExtractor = {(item, index) => index.toString()}
          inverted={true}
          renderItem = {({item}) =>
            <View style={styles.item}>

                <View style={styles.viewRow}>
                    {
                      item.request== 0 ?
                      <View>
                        { moment(dateConverter(new Date(item.checkIn.substring(6,10),(parseInt(item.checkIn.substring(3,5))-1).toString(),item.checkIn.substring(0,2))),'DD-MM-YYYY') >= this.state.today ?
                          <Text style={styles.requestWaiting}>In attesa di approvazione</Text> 
                            :
                          <Text style={styles.requestDontApproved}>Scaduta e Rimborsata</Text> 
                        }
                      </View>
                        :
                      null
                    }
                    {
                      item.request== 1 ? <Text style={styles.requestApproved}>Richiesta Approvata</Text>
                      : null
                    }
                    {
                      item.request== 2 ? <Text style={styles.requestDontApproved}>Richiesta Rifiutata e Rimborsata</Text>
                      : null
                    }
                  <Text style={styles.titleStructure}>{item.title}, {item.type} </Text>
                  <Text style={styles.streetInfoText}>{item.place} </Text>
                  <Text style={styles.streetInfoText}>{item.street}, {item.number}</Text>
                  <View style={styles.hostInfoBox}>
                    <Text style={[styles.hostInfo,{color: colors.transparent}]}>HOST:</Text>
                    <Text style={styles.hostInfo}> {item.name} {item.surname} </Text>
                    <Text style={styles.hostInfo}> {item.email.toLowerCase()}</Text>
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
                    {item.request == 2 ? 
                      <View style={styles.priceBox}>
                        <Text style={[{textDecorationLine:'line-through'},styles.priceText]}>Totale: </Text>
                        <Text style={[{textDecorationLine:'line-through'},styles.priceText]}>{item.totPrice} € </Text>
                      </View> : <View style={styles.priceBox}>
                                <Text style={styles.priceText}>Totale: </Text>
                                <Text style={styles.price}>{item.totPrice} € </Text>
                              </View>
                    }
                </View>
              </View>}
          contentContainerStyle={{paddingTop:40}}
        />  : <Text>Nessuna Prenotazione effettuata</Text>}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flexGrow:1,
  },
  item: {
   borderColor: colors.tertiary,
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
    alignSelf:'center',
    marginLeft:0,
  },
  requestDontApproved:{
    color:colors.red,
    fontSize: 16,
    fontWeight: "700",
    borderBottomColor:colors.red,
    borderBottomWidth:2,
    alignSelf:'flex-start',
  },
  requestWaiting:{
    color:colors.blue,
    fontSize: 16,
    fontWeight: "700",
    borderBottomColor:colors.blue,
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
  streetInfoText:{
    flexDirection:'row',
    fontWeight:"700",
    color:colors.black,
    alignSelf:'flex-start',
  },
  hostInfoBox:{
    alignSelf:'flex-start',
    marginVertical: 10
  },
  hostInfo:{
    fontSize:12,
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
  price:{
    fontSize: 16,
    fontWeight:"700",
    color: colors.green02
  }
  
});