import React, {Component, useEffect} from 'react';
import {View, Text, StyleSheet, Button, Image, ScrollView, Dimensions, Platform} from 'react-native';

import colors from '../style/colors';
import BookingButton from '../components/buttons/Button1'
import AsyncStorage from '@react-native-community/async-storage';

import { useNavigation } from '@react-navigation/native';

import Login from './Login'

import BookingStructure from './BookingStructure';
import { color } from 'react-native-reanimated';

const {width} = Dimensions.get('window');
const height =  width*0.8//40% di width
const images =[
  'https://res.cloudinary.com/flybnb94/image/upload/v1594675659/flyBNB/prova_csplvy.jpg',
  'https://thumbnails.trvl-media.com/l3Y9880qRaNDeRcV0mCacf5zBdc=/500x333/smart/filters:quality(80)/images.trvl-media.com/hotels/17000000/16620000/16611100/16611049/063cc6c0_z.jpg',
  'https://res.cloudinary.com/flybnb94/image/upload/v1594675659/flyBNB/prova_csplvy.jpg',

]
export default function UserStructure({ route }){
    const {
      itemName,
      itemSurname,
      itemEmail, 
      itemTitle,
      itemPrice,
      itemID,
      ItemPlace,
      ItemStreet,
      ItemType,
      ItemBeds,
      itemKitchen,
      itemFullBoard,
      itemAirConditioner,
      itemWifi,
      itemParking,
      itemDescription,
      locationDescription } = route.params;

      const [state,setState] = React.useState({
        activeImage : 0,
        horizontalScroll: true,
      })
      const navigation = useNavigation();

      useEffect(() => {
        if(Platform.OS == 'android'){
          setState({
            horizontalScroll: false,
          })
        }
    
      }, [])

      
    function navigate(){
            navigation.navigate('EditStructure',{
              /* parametri da passare alla schermata successiva */
              itemTitle: itemTitle,
              itemPrice: itemPrice,
              itemID: itemID,//email dell'ospite
              ownerMail: itemEmail,//email del proprietario di casa
              ownerName: itemName,
              ownerSurname: itemSurname,
              city: ItemPlace, //citta, ci servirà anche per calcolare le tasse di soggiorno
              street: ItemStreet,
              beds: ItemBeds
            })
    }
      

      /* const getToken = async()=>{
        var userToken = null
        try{
          userToken = await AsyncStorage.getItem('userToken');
          console.log(userToken)
        }catch(e){
          console.log(e)
        }
        if (userToken != null){
          myToken=userToken
        }
      } */
      
    
    return (
    <ScrollView style={styles.container}>
      
      <Text style={styles.title}>{itemTitle}</Text>
      
      <View style={{flexDirection:'row', alignSelf:'center'}}>
      </View>
         
         <View style={styles.structureInfo}>

              <View style={styles.mainInfo}>
                  <View style={{flexDirection:'row'}}>
                    <Text style = {styles.important}>{ItemType} - {itemTitle}</Text>

                  </View>
                  <View style={styles.description}>
                    <Text>{itemDescription}</Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.normalText} >Prezzo per Notte: </Text><Text style = {styles.important}>{itemPrice}€</Text>
                  </View>
                  
                  <View style={{flexDirection:'row'}}>
                     <Text style={styles.normalText}>Indirizzo: </Text><Text style = {styles.important}>{ItemPlace}, {ItemStreet}</Text>
                  </View>
                  
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.normalText}>Letti (per singola persona): </Text><Text style = {styles.important}> {ItemBeds}</Text>
                  </View>


              </View>
                            
              <View style={styles.structureServicesBox}> 
                  {itemKitchen ? <Text style={styles.servicesText}>Cucina</Text> : null}
                  {itemFullBoard == true ? <Text style={styles.servicesText}>Pensione completa</Text> : null }
                  {itemAirConditioner == true ? <Text style={styles.servicesText}>Aria condizionata</Text> : null}
                  {itemWifi == true ? <Text style={styles.servicesText}>Wi-Fi</Text> : null }
                  {itemParking==true ? <Text style={styles.servicesText}>Parcheggio auto</Text> : null }   
                  <View style={styles.description}>
                    <Text>{locationDescription}</Text>
                  </View> 
              </View>   
          </View>
          
          <Text style={styles.structureButton} onPress={()=> navigate()} >Modifica</Text>


      
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    height:'100%',
    backgroundColor: colors.green01,
    
  },
 
    Image:{
      width: width*0.9,
      height: '100%',
      borderRadius:15,
    },
    imageScrollWrapper:{
      height: '30%',
      marginBottom: 20,
      backgroundColor: colors.white,
      borderRadius: 20,
      alignSelf:'center'
    },
    imageScrollView:{
      width: width*0.9,
      height: height,
      margin: 5,
      
    },
    pagination:{
      flexDirection: 'row', 
      position:'absolute', 
      bottom: 35, 
      alignSelf:'center'
    },
    paginDot:{
      color: colors.white,
      margin:3,
      opacity: 0.5
    },
    paginActiveDot:{
      color: colors.white,
      margin:3,
      opacity: 0.9
    },
    structureInfo:{
      alignContent:'center',
      alignItems:'center',
        
    },
    mainInfo:{
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.black,
      padding:20,
      backgroundColor: colors.white,
      marginBottom:20,
      width: width*0.9
      
  },
  structureServicesBox:{
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.black,
    padding:20,
    paddingBottom:0,
    backgroundColor:colors.white,
    width: width*0.9
  },
  servicesText:{
    textAlign:'left',
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,

  },
  title:{
    fontSize: 28,
    color: colors.white,
    fontWeight: "300",
    margin: 20,
    alignSelf:'center'
  },
  normalText:{
    fontSize:16,
    marginBottom: 5,
    textAlign:'center'
  },
  important:{
    color:colors.orange,
    fontWeight: '400',
    fontSize: 16
  },

  ownerInfo:{
    color:colors.white,
    fontWeight: '400',
    fontSize: 16
  },
  BookingButton:{
    alignContent:'center',
    alignItems:'center',
    padding: 20
  },
  description:{
    marginTop: 20,
    marginBottom:20
  },
  logo: {
    width:80,
    height:90,
    marginTop: 0,
    marginBottom: 0,
  },
  structureButton:{
    color: colors.white, 
    fontSize:14, 
    fontWeight: "700",
    padding:4,
    width: 90,
    textAlign:'center',
    alignSelf:'center',
    margin: 5,
    backgroundColor: colors.blue,
    borderColor: colors.black,
    borderWidth: 3,
    borderRadius: 10
  }
 
});