import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';
import colors from "../style/colors/index";
import BookingButton from "../components/buttons/bookingButton";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import host from '../configHost'

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
        const url = `http://${host.host}:3055/structures/${this.state.userToken}`;
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
      }else{
        console.log("userToken è null");
        const url = `http://${host.host}:3055/structures`;
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
        if(item.title.toUpperCase().includes(selectedName)){
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
        <FlatList
          data={this.dataServicesFilter(this.dataCityFilter(this.dataPriceFilter(this.dataStructureNameFilter(this.dataTypeFilter(this.dataBedsFilter(this.state.data))))))}
          keyExtractor = {(item, index) => index.toString()}
          renderItem = {({item}) =>
              <View style={styles.item}>
                <Text>{item.title}</Text>
                <Text>{item.email}</Text>
                <Text>{item.place}</Text>
                <Text>{item.type}</Text>
                <Text>{item.beds}</Text>
                <Text style={styles.services}>Servizi inclusi :</Text>
                <BookingButton 
                  text={parseInt(item.price)+'€ a Notte'} 
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
    height:'80%',
    width:'70%',
    marginBottom: '20%',
    borderTopColor: colors.white,
    borderTopWidth: 2,
    flexGrow:1,
    /* justifyContent:'center',
    alignContent:'center',
    alignItems:'center', */
    borderBottomWidth:2,
    borderBottomColor:colors.white
    
  },
  item: {
    backgroundColor: colors.white,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderTopRightRadius: 20,
    borderTopLeftRadius:20,
  },
  title: {
    fontSize: 18,
    paddingBottom: 8
  },
  price:{
    paddingTop:8,
    paddingBottom:8
  },
  
});