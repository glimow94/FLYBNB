//componente che restituisce le strutture di uno specifico utente
import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';
import colors from "../style/colors/index";
import BookingButton from "../components/buttons/bookingButton";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';


class StructuresList extends Component {
  
   constructor(props){
     
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      userToken: null,
    }
   }
   _isMounted = false;
   componentDidMount = () => {
    this._isMounted = true;
    //get current token
    const itemToken = AsyncStorage.getItem('userToken')
    itemToken.then(token => {
      this.setState({userToken: token})
      console.log("token state");
      console.log(this.state.userToken);
      if(this.state.userToken != null){
        const url = `http://localhost:3055/structures/profile/${this.state.userToken}`;
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
                data: structures
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
        <FlatList
          data= {this.state.data}
          keyExtractor = {(item, index) => index.toString()}
          renderItem = {({item}) =>
          <View style={styles.item}>
            <Text>{item.title}</Text>
            <Text>{item.place}</Text>
            <Text style={styles.services}>Servizi inclusi :</Text>
            <BookingButton 
              text={parseInt(item.price)+'€ a Notte'} 
              onPress={()=>navigation.navigate('Structure',{
                  /* parametri da passare alla schermata successiva */
                  itemName: item.name,
                  itemSurname: item.surname,
                  itemEmail: item.email,
                  itemTitle: item.title,
                  itemPrice: item.price,
                  itemID: item.id,
                  ItemPlace: item.place,
                  ItemStreet: item.street,
                  ItemBeds: item.beds,
                  ItemType: item.type,
                  itemKitchen: item.kitchen,
                  itemFullBoard: item.fullboard,
                  itemAirConditioner: item.airConditioner,
                  itemWifi: item.wifi,
                  itemParking: item.parking,
                  itemDescription: item.description,
                  locationDescription: item.location_description,
              })}></BookingButton>
          </View>}
          contentContainerStyle={{paddingTop:40}}
        />
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
   
    
  },
  item: {
   
  },
  title: {
    fontSize: 18,
    paddingBottom: 8
  },
  price:{
    paddingTop:8,
    paddingBottom:8
  },
  footer:{
    marginBottom:10
  },
  footerText:{
  }
});