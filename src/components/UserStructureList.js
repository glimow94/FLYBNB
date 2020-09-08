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
          inverted={true}
          renderItem = {({item}) =>
            <View style={styles.item}>
              <Text
                style={styles.titleStructure}
                onPress={()=>navigation.navigate('UserStructure',{
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
                })}>
                {item.title} 
              </Text>
              <Text>{item.place}</Text>
              <Text style={styles.editButton} 
                onPress={()=> navigation.navigate('EditStructure',{
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
              })} >Modifica</Text>
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
   width: 300
  },
  titleStructure:{
    fontSize: 20,
    color: colors.black,
    textDecorationLine:'underline'
  },
  editButton:{
    color: colors.red, 
    fontSize:12, 
    fontWeight: "700",
    padding:4,
    width: 80,
    textAlign:'center',
    alignSelf:'flex-end',
    margin: 2,
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 10
  }
});