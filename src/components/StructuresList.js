import React, { Component } from 'react';
import {  View, FlatList, StyleSheet, Text, Platform, ImageBackground, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import colors from "../style/colors/index";
import BookingButton from "../components/buttons/bookingButton";
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import host from '../configHost'
import { TouchableOpacity } from 'react-native-gesture-handler';

var height='100%';
var width='100%';
var marginBottom = '10%';
var borderBottomWidth = 0;
if (Platform.OS == 'web'){
  height = '95%';
  width ='80%';
  marginBottom = 0;
  borderBottomWidth = 2;
}


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
      if(this.state.userToken != null){
        const url = `http://${host.host}:3055/structures/${this.state.userToken}`;
        axios.get(url, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
            }
          })
          .then(res => {

            if(this._isMounted){
              const structures = res.data;
              this.setState({
                isLoading:false,
                data: structures
              })
            }
        })
      }else{
 
        const url = `http://${host.host}:3055/structures`;
        axios.get(url, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
            }
          })
          .then(res => {
            
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

  dataCityFilter(DATA){
    var newData=[]
    var selectedCity = this.props.city
    if (selectedCity != 'Luogo'){
      DATA.forEach(function (item){
        if(item.place===selectedCity)
          newData.push(item)
      })
      return newData
    }
    else return DATA
  }
  dataServicesFilter(DATA){
    var newData = []
    var kitchen=this.props.kitchen 
    var airConditioner = this.props.airConditioner 
    var parking = this.props.parking 
    var fullBoard = this.props.fullBoard
    var wifi = this.props.wifi 


    if(wifi==true || kitchen == true || airConditioner == true || fullBoard == true || parking == true ){ 
      DATA.forEach(function (item){
        //controllo che vengano rispettati i filtri dei 'servizi' relativi alla camera
        if( !(wifi==true&&item.wifi==false) && !(kitchen==true&&item.kitchen==false) 
            && !(airConditioner==true&&item.airConditioner==false) && !(parking==true&&item.parking==false)
            && !(fullBoard==true&&item.fullBoard==false) ){
                newData.push(item)
        }
      })
      return newData
    }
    return DATA
    
  }

  dataPriceFilter(DATA){
    var newData = []
    var selectedPrice = this.props.price

    if(selectedPrice != 'Prezzo'){
      DATA.forEach(function (item){
        if(item.price <= parseInt(selectedPrice)){
          newData.push(item)
        }
      })
      return newData
    }
    else return DATA

  }
  //filtro per il tipo di struttura (beb o casa vacanze)
  dataTypeFilter(DATA){
    var newData=[]
    var type = this.props.type
    if (type != 'Qualsiasi'){
      DATA.forEach(function (item){
        if(item.type===type)
          newData.push(item)
      })
      return newData
    }
    else return DATA
  }
  //filtro per il numero di posti letto
  dataBedsFilter(DATA){
    var newData = []
    var beds = this.props.beds

    if(beds != 0){
      DATA.forEach(function (item){
        if(item.beds >= parseInt(beds)){
          newData.push(item)
        }
      })
      return newData
    }
    else return DATA

  }
  //filtro della searchBar
  dataStructureNameFilter(DATA){
    var newData = []
    var selectedName = this.props.selectedStructureName.toUpperCase()

    if(selectedName != null && !selectedName.trim()==''){
      DATA.forEach(function (item){
        if(item.title.toUpperCase().includes(selectedName) || item.place.toUpperCase().includes(selectedName)){
          newData.push(item)
        }
      })
      return newData
    }

    else return DATA
  }

  render(){
    
    const { navigation } = this.props;

    return (
      
      <View style={styles.container}>
        { 
        //se la citta è selezionata o se è stato scritto qualcosa sulla barra di ricerca allora renderizza gli oggetti che corrispondono 
        //altrimenti solo le ultime 10 strutture inserite
        this.props.city != 'Luogo' || this.props.selectedStructureName.length != 0 ?
        <FlatList
          data={this.dataServicesFilter(this.dataCityFilter(this.dataPriceFilter(this.dataStructureNameFilter(this.dataTypeFilter(this.dataBedsFilter(this.state.data))))))}
          keyExtractor = {(item, index) => index.toString()}
          renderItem = {({item}) =>
              <TouchableOpacity 
                style={styles.item}
                onPress={()=>navigation.navigate('Structure',{
                  /* parametri da passare alla schermata successiva */
                  itemName: item.name,
                  itemSurname: item.surname,
                  ownerID: item.user_id,
                  itemEmail: item.email,
                  itemTitle: item.title,
                  itemPrice: item.price,
                  itemID: item.id,
                  itemPlace: item.place,
                  itemNumber: item.number,
                  itemPostCode:item.post_code,
                  itemStreet: item.street,
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
              })}
              >
                <ImageBackground source={item.image1 ? {uri: item.image1} : null} style={styles.imageStyle} imageStyle={{opacity:0.35}} > 
                <Text style={styles.title}>{item.title.substring(item.title.lastIndexOf(",")+1,item.title.length)}</Text>
                  <Text style={styles.type}>{item.type}</Text>
                  <Text style={styles.place}>{item.place}</Text>
                  <View>
                    <Text style={styles.beds}>Posti letto: {item.beds}</Text>
                    <View style={styles.serviceBox}>
                      <View style={{flexDirection:'row'}}>
                        <Text style={styles.service}>Pensione Completa: </Text>{item.fullBoard ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                      </View>
                      <View style={{flexDirection:'row'}}>
                        <Text style={styles.service}>Parcheggio: </Text>{item.parking ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' style={{marginRight:5}} type='font-awesome' color={colors.red}/>}
                      </View>
                      
                    </View>
                    <View style={styles.serviceBox}>
                      <View style={{flexDirection:'row'}}>
                        <Text style={styles.service}>Aria Condizionata: </Text>{item.airConditioner ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                      </View>
                      <View style={{flexDirection:'row'}}>
                        <Text style={styles.service}>Wi-Fi: </Text>{item.wifi ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                      </View>
                      <View style={{flexDirection:'row'}}>
                        <Text style={styles.service}>Cucina: </Text>{item.kitchen ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                      </View>
                    </View>

                  </View>
                  <BookingButton 
                    text={parseInt(item.price)+'€ a Notte'} 
                  ></BookingButton>
                  </ImageBackground>
              </TouchableOpacity>}
          contentContainerStyle={{paddingTop:40}}
        />    : 
        <FlatList
        /* MOSTRO SOLO LE PRIME 10 STRUTTURE se l'utente non ha selezionato nessun luogo o non ha cercato nulla nella barra di ricerca (per evitae di appesantire il rendering nel caso in cui ci siano molte strutture salvate nel db) */
        data={this.state.data.slice(0,10)}
        keyExtractor = {(item, index) => index.toString()}
        renderItem = {({item}) =>
            <TouchableOpacity
              style={styles.item}
              onPress={()=>navigation.navigate('Structure',{
                /* parametri da passare alla schermata successiva */
                itemName: item.name,
                itemSurname: item.surname,
                ownerID: item.user_id,
                itemEmail: item.email,
                itemTitle: item.title,
                itemPrice: item.price,
                itemID: item.id,
                itemPlace: item.place,
                itemNumber: item.number,
                itemPostCode:item.post_code,
                itemStreet: item.street,
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
            })}
            >
              <ImageBackground source={item.image1 ? {uri: item.image1} : null} style={styles.imageStyle} imageStyle={{opacity:0.35}} > 

                <Text style={styles.title}>{item.title.substring(item.title.lastIndexOf(",")+1,item.title.length)}</Text>
                <Text style={styles.type}>{item.type}</Text>
                <Text style={styles.place}>{item.place}</Text>

                <View>
                  <View style={styles.serviceBox}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.service}>Pensione Completa: </Text>{item.fullboard ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.service}>Parcheggio: </Text>{item.parking ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' style={{marginRight:5}} type='font-awesome' color={colors.red}/>}
                    </View>
                  </View>
                  <View style={styles.serviceBox}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.service}>Aria Condizionata: </Text>{item.airConditioner ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.service}>Wi-Fi: </Text>{item.wifi ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={styles.service}>Cucina: </Text>{item.kitchen ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                    </View>
                  </View>
                  <Text style={styles.beds}>Posti letto: {item.beds}</Text>
                </View>
                <BookingButton 
                  text={parseInt(item.price)+'€ a Notte'} 
                  ></BookingButton>
              </ImageBackground>
            </TouchableOpacity>}
        contentContainerStyle={{paddingTop:40}}
      />}
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
    height:height,
    width:width,
    backgroundColor: colors.primary,
    marginBottom: marginBottom,
    borderTopColor: colors.secondary,
    borderTopWidth: 2,
    flexGrow:1,
    position:'absolute',
    /* justifyContent:'center',
    alignContent:'center',
    alignItems:'center', */
    borderBottomWidth: borderBottomWidth,
    borderBottomColor:colors.secondary
    
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 4,
    borderColor: colors.grey,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  title: {
    fontSize: 20,
    alignSelf:'center',
    fontWeight:"700",
  },
  type:{
    fontSize: 16,
    paddingBottom: 8,
    fontWeight:"700",
    alignSelf:'center',
  },
  imageStyle:{
    flex:1,
    resizeMode:"cover",
    justifyContent:"center",
    backgroundColor: 'rgba(255,255,255,.3)',
    padding: 20

  },
  place:{
    fontSize:15,
    color:colors.black2,
    fontWeight:"700",
    marginTop:5,
    marginBottom:10,
    marginLeft:8,
    alignSelf:'center'
  },
  price:{
    paddingTop:8,
    paddingBottom:8
  },
  beds:{
    fontSize:14,
    fontWeight:"700",
    marginLeft:10,
    alignSelf:'flex-end'
  },
  service:{
    fontSize:14,
    fontWeight:"700",
    color:colors.black2,
    marginLeft: 10,
  },
  serviceBox:{
    flex:1,
    flexWrap:'wrap',
    flexDirection:'row',
    marginTop:3
  }
  
});