//componente che restituisce le strutture di uno specifico utente
import React, { Component } from 'react';
import { SafeAreaView,Button, View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import colors from "../style/colors/index";
import BookingButton from "../components/buttons/bookingButton";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import host from '../configHost';
import moment from 'moment'

class StructuresList extends Component {
  
   constructor(props){
     
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      userToken: null,
      today:''
    }
   }
   _isMounted = false;
   monthNameToNum(monthname) {
    // da "Day Mon DayNumber Year" in "DD-MM-YYYY"
    var months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May',
        'Jun', 'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec'
    ]; //mesi dell'anno che mi servono per convertire il mese della data nel suo corrispondente numero MM
    var index = months.indexOf(monthname);
    
    //aggiungo lo 0 prima del numero del mese se questo è < 10, ovvero 1 diventa 01, 2 diventa 02, ecc.ecc.
    if(index+1 < 10 && index != -1){
      index = index +1;
      var month = '0'+index.toString()
      return month
    }
    else {
      return index!=-1 ? index+1 : undefined;
    }
  }
   componentDidMount = () => {
    var date = new Date()
    var date_mod = date.toString().replace("12:00:00 GMT+0200","").slice(4);
    var month_num = this.monthNameToNum(date_mod.substr(0,3));
    var date_mod_format = date_mod.substr(4,2)+"/"+month_num+"/"+date_mod.substr(6,5); //data in formato DD/MonthName/AAAA
    var final_date = date_mod_format.replace(/ /g, '');
    var today = moment(final_date,'DD-MM-YYYY');
    console.log(date)
    this._isMounted = true;
    //get current token
    const itemToken = AsyncStorage.getItem('userToken')
    itemToken.then(token => {
      this.setState({userToken: token})
      console.log("token state");
      console.log(this.state.userToken);
      if(this.state.userToken != null){
        const url = `http://${host.host}:3055/structures/profile/${this.state.userToken}`;
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
                today : today,
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
       { this.state.data.length != 0 ? <FlatList
          data= {this.state.data}
          keyExtractor = {(item, index) => index.toString()}
          inverted={true}
          renderItem = {({item}) =>
            <View style={styles.item}>
              
              <Text 
                style={styles.titleStructure}
                onPress={()=>{
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
                    itemDescription: item.description,
                    locationDescription: item.location_description,
                    image1: item.image1,
                    image2 : item.image2,
                    image3: item.image3,
                    image4 : item.image4,
                    start_date : item.start_date,
                    today_date : this.state.today
                });}}
              >{item.title}</Text>

              <Text>{item.place}</Text>

              {this.state.today.diff(moment(item.start_date,'DD-MM-YYYY'), 'days') > -1 ? 
              <Text style={styles.dateswarning} onPress={()=>{console.log('INVIA RENDICONTO')}}>INVIA RENDICONTO TREMESTRALE</Text>:null}

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
                  image1: item.image1,
                  image2 : item.image2,
                  image3: item.image3,
                  image4 : item.image4
              })} >Modifica</Text>
            </View>}
          contentContainerStyle={{paddingTop:40}}
        />:<Text>Non hai nessuna struttura registrata</Text>}
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
    color: colors.blue,
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
  },
  dateswarning:{
    color: colors.red,
    fontSize:10,
    textDecorationLine:'underline',
    fontWeight:'600'
    
  }
});