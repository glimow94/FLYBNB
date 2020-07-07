import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text ,Button, TextInput } from 'react-native';
import Constants from 'expo-constants';
import colors from "../style/colors/index";
import BookingButton from "../components/buttons/bookingButton";
import { useNavigation } from '@react-navigation/native';
import Axios from 'axios';


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
            itemKitchen: kitchen,
            itemFullBoard: fullBoard,
            itemAirConditioner: airConditioner,
            itemWifi: wifi,
            itemParking: parking,
        })}></BookingButton>
    </View>
  );
}

export default class StructuresList extends Component {
   constructor(props){
     super(props);
     this.state={
         data:[]
     }
   }
   myPost(){
    var url = 'http://192.168.16.2:3210/data';
    Axios.post(url, {
      id: parseInt(this.state.structure_id),
      structure_name: this.state.structure_name,
      user_id: parseInt(this.state.user_id),
      type: this.state.type,
      city: this.state.city,
      street: this.state.street,
      number: parseInt(this.state.street_number),
      post_code: this.state.post_code,
      description: this.state.descript,
      location_description: this.state.location,
      beds: parseInt(this.state.beds_number),
      price: this.state.price,
      fullboard: this.state.fullboard,
      wifi:this.state.wifi,
      parking: this.state.parking,
      kitchen: this.state.kitchen,
      airConditioner: this.state.airConditioner
      
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    this.state.input1 = '';
    this.state.input2 = '';
  };
    dataGet(){
        var url = 'http://localhost:3210/data';
        Axios.get(url)
            .then((structureData)=>{
                console.log(structureData.data);
                this.setState({
                    data: structureData.data,
                })
            })
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

  render(){
    const dataMySQL = this.state.data.map((item, index)=>{
      var array = ['Nome:', item.structure_name,'Città: ', item.city].join(' ');
      return (
        <Text style={{fontSize:20,fontWeight:'bold'}} key={index}>{array}</Text>

      );
    })
    return (
      
      <View style={styles.container}>
          <Button title='premi' onPress={this.dataGet.bind(this)}></Button>

          <View style={{flexDirection:'column',alignItems:'center'}}>
            {dataMySQL}
          </View>
          <TextInput
            placeholder='Nome della struttura'
            style={{height: 55, width: 350, fontSize: 15, backgroundColor: colors.white}}
            onChangeText={(structure_name) => this.setState({
              structure_name
            })}
            value={this.state.structure_name}
            />

          <TextInput
            placeholder='citta'
            style={{height: 55, width: 350, fontSize: 15,backgroundColor: colors.white}}
            onChangeText={(city) => this.setState({
              city
            })}
            value={this.state.city}
          />
          <TextInput
            placeholder='id'
            style={{height: 55, width: 350, fontSize: 15, backgroundColor: colors.white}}
            onChangeText={(structure_id) => this.setState({
              structure_id
            })}
            value={this.structure_id}
            />
            <TextInput
            placeholder='user_id'
            style={{height: 55, width: 350, fontSize: 15, backgroundColor: colors.white}}
            onChangeText={(user_id) => this.setState({
              user_id
            })}
            value={this.user_id}
            />
            <TextInput
            placeholder='tipo'
            style={{height: 55, width: 350, fontSize: 15, backgroundColor: colors.white}}
            onChangeText={(type) => this.setState({
              type
            })}
            value={this.type}
            />
            <TextInput
            placeholder='number'
            style={{height: 55, width: 350, fontSize: 15, backgroundColor: colors.white}}
            onChangeText={(number) => this.setState({
              number
            })}
            value={this.number}
            />
            <TextInput
            placeholder='letti'
            style={{height: 55, width: 350, fontSize: 15, backgroundColor: colors.white}}
            onChangeText={(beds) => this.setState({
              beds
            })}
            value={this.beds}
            />
          <Button title='post' onPress={this.myPost.bind(this)}></Button>
        <FlatList
          data={this.dataServicesFilter(this.dataCityFilter(this.dataPriceFilter(DATA)))}
          renderItem={(
            { item }) => <Item 
                            title={item.title} 
                            price={item.price} 
                            id={item.id} 
                            kitchen={item.kitchen}
                            fullBoard={item.fullBoard}
                            airConditioner={item.airConditioner}
                            wifi={item.wifi}
                            place={item.place} 
                            parking={item.parking} 
                            price={item.price}
                          />}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingTop:40}}
          ListFooterComponent={
            <View styles={styles.footer}>
              <Text styles={styles.footerText}>*la disponibilità può variare in base alle date di permanenza</Text>
            </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height:'80%',
    marginBottom: '20%',
    borderTopColor: colors.white,
    borderTopWidth: 2,
    flexGrow:1,
    justifyContent:'center',
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
  footer:{
    marginBottom:10
  },
  footerText:{
  }
});