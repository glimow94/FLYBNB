//componente che restituisce le strutture di uno specifico utente
import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Button } from 'react-native';
import Constants from 'expo-constants';
import colors from "../style/colors/index";
import BookingButton from "../components/buttons/bookingButton";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import host from '../configHost'

export default class StructuresList extends Component {
  
   constructor(props){
     
    super(props);
    this.state = {
      data: [],
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

   async postResponse(itemID) {
      const url = `http://${host.host}:3055/bookings/profile/response/${itemID}`;
      axios.post(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',   
          }
        })
        .then(res => {
          console.log(res);
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
              waitingRequests: request_wait-1
            });
            this.props.updateState({
              waitingRequests:request_wait-1
            })
            break
          }
        }
        
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
    

  render(){
    
    const { navigation } = this.props;

    return (
      
      <View style={styles.container}>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.infoText}>Guadagni totali :</Text>
          <Text style={styles.totEarn}> {this.state.totEarn} €</Text>

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
                      item.request== 1 ? <Text style={styles.requestApproved}>Prenotazione Approvata</Text>:null
                    }
                    {
                      item.request== 2 ? <Text style={styles.requestDontApproved}>Prenotazione Rifiutata</Text>:null
                    }
                    
                  <Text style={styles.titleStructure}>{item.title}, {item.type} </Text>
                  <Text style={styles.streetInfoText}>Cliente: {item.name} {item.surname}, {item.email}</Text>
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
                      <Text style={styles.priceText}>Tassa soggiorno:</Text>
                      <Text style={styles.price}>{item.cityTax} € </Text>
                      <Text style={styles.priceText}>Totale: </Text>
                      <Text style={styles.price}>{item.totPrice} € </Text>
                    </View>
                    
                </View>
                {item.request == 0 ? <View style={styles.buttonGroup}>
                    <View style={styles.button}>
                        <Button onPress = {()=> {this.postResponse(item.id)}} title="Accetta"color={colors.green02}></Button>
                    </View>
                    <View style={styles.button}>
                        <Button onPress = {()=> {this.postRefused(item.id)}} title="Rifiuta" color={colors.red}></Button>
                    </View>
                </View>: null}
            </View>}
          contentContainerStyle={{paddingTop:40}}
        />

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flexGrow:1,
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
  },
  infoText:{
    fontSize:18,
    fontWeight: "500"
  },
  totEarn:{
    fontSize:20,
    color:colors.black
  },
  item: {
   borderColor: colors.black,
   borderWidth:2,
   borderRadius: 8,
   padding: 5,
   marginTop: 4,
   width: 300,
  },
  titleStructure:{
    fontSize:16,
    fontWeight: "700",
    color: colors.black,
    margin:5,
    marginLeft:0
  },
  request:{
    color:colors.blue,
    fontSize: 14,
    fontWeight: "700"
  },
  requestDontApproved:{
    color:colors.red,
    fontSize: 14,
    fontWeight: "700"
  },
  requestApproved:{
    color:colors.green02,
    fontSize: 14,
    fontWeight: "700"
  },
  streetInfoText:{
    flexDirection:'row',
    fontWeight:"700",
    color:colors.black
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
    color: colors.blue

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