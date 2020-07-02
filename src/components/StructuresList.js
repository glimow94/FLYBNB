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
      <BookingButton text='Prenota' 
        onPress={()=>navigation.navigate('Structure',{
          /* parametri da passare alla schermata succesiva */
          itemTitle: title,
          itemPrice: price,
          itemID: id,
          ItemPlace: place,
          kitchen: kitchen,
          fullBoard: fullBoard,
          airConditioner: airConditioner,
          wifi: wifi,
          parking: parking
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
  dataFilter(DATA){
    var newData = [];

    if(this.props.wifi==true){
        DATA.forEach(function (item){
        if(item.wifi==true)
          newData.push(item)
      })
      return newData
    }
    else return DATA
    
  }

  render(){
    return (
      
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.dataCityFilter(DATA)}
          renderItem={(
            { item }) => <Item 
                            title={item.title} 
                            price={item.price} 
                            id={item.id} 
                            place={item.place} 
                            parking={item.parking} 
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
    paddingTop:8
  },
});