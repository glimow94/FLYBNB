//componente che restituisce le strutture di uno specifico utente
import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';
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
      status:''
    }
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
                      item.request== 0 ? <Text style={styles.requestWaiting}>In Attesa di Approvazione</Text>
                      : null
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

                  <Text style={styles.hostInfo}>HOST:</Text>
                  <Text style={styles.hostInfo}> {item.name} {item.surname} </Text>
                  <Text style={styles.hostInfo}> {item.email.toLowerCase()}</Text>

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
        />:<Text>Nessuna Prenotazione effettuata</Text>}
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
  item: {
   borderColor: colors.black,
   borderWidth:2,
   borderRadius: 8,
   padding: 5,
   marginTop: 4,
   width: 300,
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
    alignSelf:'center',
  },
  requestWaiting:{
    color:colors.blue,
    fontSize: 16,
    fontWeight: "700",
    borderBottomColor:colors.blue,
    borderBottomWidth:2,
    alignSelf:'center',
  },
  requestApproved:{
    color:colors.green02,
    fontSize: 16,
    fontWeight: "700",
    borderBottomColor:colors.green02,
    borderBottomWidth:2,
    alignSelf:'center',
  },
  streetInfoText:{
    flexDirection:'row',
    fontWeight:"700",
    color:colors.black,
    alignSelf:'center',
  },
  hostInfo:{
    fontSize:12,
    alignSelf:'center',
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
    color: colors.blue

  }
  
});