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
      locationDescription,
      image1,
      image2,
      image3,
      image4 
    } = route.params;
    var images = []
    if(image1 != null && image1.length != 0) images.push(image1)
    if(image2 != null && image2.length != 0) images.push(image2)
    if(image3 != null && image3.length != 0)  images.push(image3)
    if(image4 != null && image4.length != 0) images.push(image4)
    console.log(images)
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
          const clientBirthdate = await AsyncStorage.getItem('birthdate');
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
              clientBirthdate,
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
            navigation.navigate(Login)
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
      <View style={{alignContent:'center',alignItems:'center'}}>
      {images.length > 0 ? 
        <View style={styles.imageScrollWrapper}>
            <ScrollView 
              pagingEnabled 
              horizontal
              onScroll={imageChanged}
              scrollEventThrottle={16}
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
      </View>:null}
      
            
      <Text style={styles.title}>{itemTitle}</Text>
         <View style={styles.structureInfo}>

              <View style={styles.mainInfo}>
                  <View style={{flexDirection:'row'}}>
                    <Text style = {styles.important}>{itemType} - {itemTitle}</Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                      <Text style={styles.normalText}>Proprietario: </Text><Text style = {styles.important}> {itemName} {itemSurname}, {itemEmail}</Text>
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
                <BookingButton text="PRENOTA" backgroundColor={colors.green01} onPress={getToken}></BookingButton> 
          </View>
     
          </View>
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
      width: width*0.5,
      height: '100%',
      borderRadius:15,
      resizeMode:'contain'
    },
    imageScrollWrapper:{
      flex:1,
      height: '30%',
      marginBottom: 10,
      backgroundColor: colors.white,
      borderRadius: 10,
    },
    imageScrollView:{
      width: width*0.5,
    height: height*0.4,
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
      width: width*0.5
      
  },
  structureServicesBox:{
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.black,
    padding:20,
    paddingBottom:0,
    backgroundColor:colors.white,
    width: width*0.5
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
    color:colors.black,
    fontWeight: '400',
    fontSize: 16,
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