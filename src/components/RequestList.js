//componente che restituisce le strutture di uno specifico utente
import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Button } from 'react-native';
import Constants from 'expo-constants';
import colors from "../style/colors/index";
import BookingButton from "../components/buttons/bookingButton";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';


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
        const url = `http://localhost:3055/bookings/profile/request/${this.state.userToken}`;
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
      console.log(this.state.data)
    }

   async postResponse(itemID) {
      const url = `http://localhost:3055/bookings/profile/response/${itemID}`;
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
        this.updateState({
          status3:false
        })
    }
    

  render(){
    
    const { navigation } = this.props;

    return (
      
      <View style={styles.container}>
        <FlatList
          data= {this.state.data}
          keyExtractor = {(item, index) => index.toString()}
          inverted={true}
          renderItem = {({item}) =>
            <View style={styles.item}>

                <View style={styles.viewRow}>
                    {
                      item.request== 0 ? <Text style={styles.requestDontApproved}>In attesa di approvazione</Text>
                      : <Text style={styles.requestApproved}>Prenotazione approvata</Text>
                    }
                    
                  <Text style={styles.titleStructure}>{item.title}, {item.type} </Text>
                  <Text style={styles.streetInfoText}>{item.name} {item.surname}, {item.email}</Text>
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
                        <Button title="Rifiuta" color={colors.red}></Button>
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