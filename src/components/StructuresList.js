import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';
import colors from "../style/colors/index";
import BookingButton from "../components/buttons/bookingButton";
import { useNavigation } from '@react-navigation/native';


const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Struttura 1',
    price: 34,
    place: 'Palermo',
    kitchen: false,
    fullBoard: true,
    airConditioner:true,
    wifi:false,
    parking:false
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Struttura 2',
    price: 45,
    place: 'Catania',
    kitchen: true,
    fullBoard: false,
    airConditioner:false,
    wifi:true,
    parking:true

  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'struttura 3',
    price: 120,
    place: 'Firenze',
    kitchen: true,
    fullBoard: true,
    airConditioner:true,
    wifi:false,
    parking:true

  },
  {
    id: '58694a0f-s3da1-471f-bd96-145571e29d72',
    title: 'Struttura 4',
    price: 68,
    place: 'Roma',
    kitchen: true,
    fullBoard: false,
    airConditioner:true,
    wifi:true,
    parking:false

  },
  {
    id: '58694a0f-3dda1-471f-bd96-145571e29d72',
    title: 'Struttura 5',
    price: 50,
    place: 'Palermo',
    kitchen: false,
    fullBoard: true,
    airConditioner:false,
    wifi:false,
    parking:true
  },
  
];





function Item({ title,price,id,place,kitchen,fullBoard,airConditioner,wifi,parking }) {
  
  const navigation = useNavigation();

  return (
    
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.place}>{place}</Text>

      <Text style={styles.services}>Servizi inclusi :</Text>
      <BookingButton text={parseInt(price)+'€ a Notte'} 
        onPress={()=>navigation.navigate('Structure',{
            /* parametri da passare alla schermata successiva */
            itemTitle: title,
            itemPrice: price,
            itemID: id,
            ItemPlace: place,
            kitchen: kitchen,
            fullBoard: fullBoard,
            airConditioner: airConditioner,
            wifi: wifi,
            parking: parking,
        })}></BookingButton>
    </View>
  );
}

export default class StructuresList extends Component {
   constructor(props){
     super(props);
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
            && !(fullBoard==true&&item.fullBoard==false && (item.price < selectedPrice)) ){
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

  render(){
    return (
      
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.dataServicesFilter(this.dataCityFilter(this.dataPriceFilter(DATA)))}
          renderItem={(
            { item }) => <Item 
                            title={item.title} 
                            price={item.price} 
                            priceString={item.price.toString()}
                            id={item.id} 
                            place={item.place} 
                            parking={item.parking} 
                            price={item.price}
                          />}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  item: {
    backgroundColor: colors.white,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderTopRightRadius: 20,
    borderTopLeftRadius:20
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