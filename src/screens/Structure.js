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
export default function Structure({ route }){
    const {
      itemName,
      itemSurname,
      ownerID,
      itemEmail, 
      itemTitle,
      itemPrice,
      itemID,
      itemPlace,
      itemStreet,
      itemType,
      itemBeds,
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

      
      async function getToken(){
        try{
          const myToken = await AsyncStorage.getItem('userToken');
          const clientMail = await AsyncStorage.getItem('email');
          const clientName = await AsyncStorage.getItem('name');
          const clientSurname = await AsyncStorage.getItem('surname');
          if(myToken!=null){
            //abbiamo il token
            console.log("ecco il token")
            console.log(myToken)
            console.log(itemID);
            navigation.navigate('BookingStructure',{
              /* parametri da passare alla schermata successiva */
              itemTitle: itemTitle,
              itemPrice: itemPrice,
              ownerID: ownerID,
              itemID: itemID,
              userID: myToken,
              clientMail: clientMail,//email dell'ospite
              ownerMail: itemEmail,//email del proprietario di casa
              ownerName: itemName,
              ownerSurname: itemSurname,
              clientName: clientName,
              clientSurname: clientSurname,
              city: itemPlace, //citta, ci servirà anche per calcolare le tasse di soggiorno
              street: itemStreet,
              beds: itemBeds
            })
          }
          else{
            alert('non sei loggato')
            /* navigation.navigate(Login) */
          }
        }catch(e){
          console.log(e)
        }
      }

      const imageChanged = ({nativeEvent}) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width );
        //contentOffSet misura quanto una view (in questo caso l'img della scrollView) è stata spostataa dall'origine tramite evento di tocco/trascinamento
        if(slide !== state.activeImage){
          setState({
            activeImage: slide
          })
        }
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
      
      <View style={styles.imageScrollWrapper}>
            <ScrollView 
              pagingEnabled 
              horizontal
              onScroll={imageChanged}
              showsHorizontalScrollIndicator={state.horizontalScroll}
              style={styles.imageScrollView}>
                {
                  images.map((image,index)=>(
                    <Image
                      key={index}
                      source={{uri: image}}
                      style={styles.Image}
                    ></Image>
                  ))
                }
            </ScrollView>
            <View style={styles.pagination}>
              {
                images.map((i,k)=>(
                  <Text key={k} style={k == state.activeImage? styles.paginActiveDot :styles.paginDot}>⬤</Text>
                ))
              }
            </View>
      </View>
      <View style={{flexDirection:'row', alignSelf:'center'}}>
              <Text style={styles.normalText}>Proprietario: </Text><Text style = {styles.ownerInfo}> {itemName} {itemSurname}, {itemEmail}</Text>
      </View>
         
         <View style={styles.structureInfo}>

              <View style={styles.mainInfo}>
                  <View style={{flexDirection:'row'}}>
                    <Text style = {styles.important}>{itemType} - {itemTitle}</Text>

                  </View>
                  <View style={styles.description}>
                    <Text>{itemDescription}</Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.normalText} >Prezzo per Notte: </Text><Text style = {styles.important}>{itemPrice}€</Text>
                  </View>
                  
                  <View style={{flexDirection:'row'}}>
                     <Text style={styles.normalText}>Indirizzo: </Text><Text style = {styles.important}>{itemPlace}, {itemStreet}</Text>
                  </View>
                  
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.normalText}>Letti (per singola persona): </Text><Text style = {styles.important}> {itemBeds}</Text>
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
          
          <View style={styles.BookingButton}>
                <BookingButton text="PRENOTA" onPress={getToken}></BookingButton> 
          </View>
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: colors.green01,
    
  },
 
    Image:{
      width: width*0.9,
      height: '100%',
      borderRadius:15,
    },
    imageScrollWrapper:{
      height: 250,
      marginBottom: 20,
      backgroundColor: colors.white,
      borderRadius: 20,
      alignSelf:'center'
    },
    imageScrollView:{
      width: width*0.6,
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
    fontSize: 16,
    margin: 5
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
 
});