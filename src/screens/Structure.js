import React, {Component, useEffect} from 'react';
import {View, Text, StyleSheet, Button, Image, ScrollView, Dimensions, Platform} from 'react-native';

import colors from '../style/colors';
import BookingButton from '../components/buttons/Button1'
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements';


import { useNavigation } from '@react-navigation/native';

import Login from './Login'

import BookingStructure from './BookingStructure';
import { color } from 'react-native-reanimated';

var {width} = Dimensions.get('window');
var height =  width;

Platform.OS === 'web' ? width= width *0.5 : width = width*0.9
Platform.OS === 'web' ? height = height*0.4 : height = height*0.9

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
      itemNumber,
      itemPostCode,
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
                  <View style={{flexDirection:'row', alignSelf:'center'}}>
                    <Text style = {[styles.important,{marginLeft:0}]}>{itemType} - {itemTitle}</Text>
                  </View>
                  <View style={styles.userInfo}>
                      <Text style={styles.normalText}>Proprietario: </Text><Text style = {styles.important}> {itemName} {itemSurname}, {itemEmail.toLowerCase()}</Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.normalText} >Prezzo per Notte: </Text><Text style = {styles.important}>{itemPrice}€</Text>
                  </View>
                  
                  <View style={{flexDirection:'row'}}>
                  <Text style={styles.normalText}>Luogo: </Text><Text style = {styles.important}>{itemPlace}, {itemPostCode}</Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                   <Text style={styles.normalText}>Indirizzo: </Text><Text style = {styles.important}>{itemStreet},{itemNumber}</Text>
                  </View>
                  
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.normalText}>Letti (per singola persona): </Text><Text style = {styles.important}> {itemBeds}</Text>
                  </View>
                  <View style={styles.description}>
                    <Text>{itemDescription}</Text>
                  </View>

              </View>
                            
              <View style={styles.structureServicesBox}> 
              
                  
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.service}>Pensione Completa: </Text>{itemFullBoard ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.service}>Parcheggio: </Text>{itemParking ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' style={{marginRight:5}} type='font-awesome' color={colors.red}/>}
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.service}>Cucina: </Text>{itemKitchen ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                    </View>
                  
                
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.service}>Aria Condizionata: </Text>{itemAirConditioner ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.service}>Wi-Fi: </Text>{itemWifi ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                    </View>
                  
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
      width: width,
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
      width: width,
    height: height,
    margin: 5,
    
    },
    userInfo:{
      marginBottom:20,
      marginTop:20,
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
      width: width
      
  },
  structureServicesBox:{
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.black,
    padding:20,
    paddingBottom:0,
    backgroundColor:colors.white,
    width: width
  },
  service:{
    textAlign:'left',
    fontSize: 16,
    fontWeight: '700',
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
    color:colors.black2,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 5
  },

  ownerInfo:{
    color:colors.black,
    fontWeight: '700',
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