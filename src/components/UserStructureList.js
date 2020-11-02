//componente che restituisce le strutture di uno specifico utente
import React, { Component } from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import colors from "../style/colors/index";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import host from '../configHost';
import moment from 'moment';

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
     this.setState({
      requestList: this.props.requestList,
      bookingGuests: this.props.bookingGuests
     })
    /* OPERAZIONI PER IL CONTROLLO PERIODICO DEL RENDICONTO */
    /* Calcoliamo la data di oggi e la convertiamo nel formato accettabile dalla libreria moment... cioè DD/MM/YYYY */
    var date = new Date();
    var date_mod = date.toString().replace("12:00:00 GMT+0200","").slice(4);
    var month_num = this.monthNameToNum(date_mod.substr(0,3));
    var date_mod_format = date_mod.substr(4,2)+"/"+month_num+"/"+date_mod.substr(6,5); //data in formato DD/MonthName/AAAA
    var final_date = date_mod_format.replace(/ /g, '');
    var today = moment(final_date,'DD-MM-YYYY');
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
            this.setState({
              isLoading:false,
              today : today,
              data: structures
            })
            
        })
      }
      });
  }

  render(){
    
    const { navigation } = this.props;

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
                onPress={()=>{
                  /* passo alla singola strutture solo le richieste(requestList) accettate per essa*/
                  var structureRequest = []; //richieste da passare alla navigazione
                  if(this.state.requestList.length != 0){
                    for(let i = 0; i < this.state.requestList.length ; i++){
                      if(this.state.requestList[i].structure_id == item.id && this.state.requestList[i].request == 1){
                        structureRequest.push(this.state.requestList[i]);
                      }
                    }
                  }
                  /* passo alla singola struttura solo gli ospiti correlati alle richieste di prenotazione per essa */
                  var guests = [];
                  if(this.state.bookingGuests.length!=0){
                    for(let j = 0; j < this.state.bookingGuests.length; j++){
                      if(this.state.bookingGuests[j].structure_id == item.id){
                        guests.push(this.state.bookingGuests[j]);
                      }
                    }
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
                    itemDescription: item.description,
                    locationDescription: item.location_description,
                    image1: item.image1,
                    image2 : item.image2,
                    image3: item.image3,
                    image4 : item.image4,
                    requestList : structureRequest,
                    guestsList : guests
                  });}
                }
              >
                <Text style={styles.titleStructure}>{item.title}</Text>
              </TouchableOpacity>


              {
                this.state.today.diff(moment(item.start_date,'DD-MM-YYYY'), 'days') > this.state.deadline ? 
                <Text style={styles.dateswarning}>INVIA RENDICONTO TRIMESTRALE</Text> : null
              }
              <Text style={{alignSelf:'flex-start',fontWeight:'700'}}>{item.place}</Text>
              <Text 
                style={styles.editButton} 
                onPress={()=>{ 
                  this.props.updateState({status2:false})
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
    backgroundColor: colors.orange2,
    borderColor: colors.red,
    borderWidth: 1,
    borderRadius: 10
  },
  dateswarning:{
    color: colors.red,
    fontSize:10,
    marginTop: 8,
    fontWeight:'600',
    textDecorationLine:'underline'

  },
  structureButton:{
    
  }
});