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
var buttonAlign = 'flex-end';
var servicesFlexDirection='row';

if(Platform.OS === 'web'){
  width = width*0.6;
  height = height*0.3;
  buttonAlign = 'center',
  servicesFlexDirection = 'column'
}else{
  width = width;
  height = height*0.9;
}
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
            number:itemNumber,
            beds: itemBeds
          })
        }
        else{
          navigation.navigate(Login)
        }
      }
      catch(e){
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

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollwrapper}>
          <View style={{alignContent:'center',alignItems:'center'}}>
            {
              images.length > 0 ? 

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
              </View> : null  
            }     
            <Text style={styles.itemTitle}>{itemTitle}</Text>
            <View style={styles.structureInfo}>
              <View style={styles.mainInfo}>
                <View style={{flexDirection:'row', alignItems:'center',alignSelf:'center'}}>
                  <Text style = {styles.price}>{itemPrice}€</Text>
                  <Text style = {styles.priceLabel}> /Notte</Text>
                </View>
                <View>
                  <Text style = {styles.itemBeds}> {itemBeds} POSTI LETTO</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style = {styles.itemPlace}>{itemPlace}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style = {styles.itemAddress}>{itemStreet} {itemNumber}</Text>
                </View>
                <View style={styles.description}>
                  <Icon
                    size={10}
                    style={styles.infoIcon}
                    name='info'
                    type='font-awesome-5'
                    color={colors.transparent}
                  />
                  <Text style={styles.important}>Struttura:</Text>
                  <Text style={styles.descriptionText}>{itemDescription}</Text>                    
                </View>
              </View>
                                
              <View style={styles.structureServicesBox}> 
                <View style={styles.serviceList}>
                  <View style={styles.serviceWrapper}>
                    <Text style={styles.serviceLabel}>Pensione Completa: </Text>{itemFullBoard ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                  </View>
                  <View style={styles.serviceWrapper}>
                    <Text style={styles.serviceLabel}>Parcheggio: </Text>{itemParking ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' style={{marginRight:5}} type='font-awesome' color={colors.red}/>}
                  </View>
                  <View style={styles.serviceWrapper}>
                    <Text style={styles.serviceLabel}>Cucina: </Text>{itemKitchen ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                  </View>
                  <View style={styles.serviceWrapper}>
                    <Text style={styles.serviceLabel}>Aria Condizionata: </Text>{itemAirConditioner ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                  </View>
                  <View style={styles.serviceWrapper}>
                    <Text style={styles.serviceLabel}>Wi-Fi: </Text>{itemWifi ? <Icon size={20} name='check' type='font-awesome' color={colors.green02}/>:<Icon size={20} name='times' type='font-awesome' color={colors.red}/>}
                  </View>
                </View>
                <View style={styles.description}>
                  <Icon
                    size={10}
                    style={styles.infoIcon}
                    name='info'
                    type='font-awesome-5'
                    color={colors.transparent}
                  />
                  <Text style={[styles.important]}>Dintorni:</Text>
                  <Text style={styles.descriptionText}>{locationDescription}</Text>                    
                </View>
              </View>   
            </View>
            <View style={styles.hostInfo}>
              <View style={styles.hostInfoLabel}>
                <Icon
                  size={20}
                  style={{marginRight:2}}
                  name='user'
                  type='font-awesome-5'
                  color={colors.transparent}
                />
                <Text style={[styles.important,{marginTop:2}]}>Proprietario: </Text>
              </View>
              <View style={styles.hostInfoText}>
                  <Text style = {styles.hostText}> {itemName} {itemSurname} </Text>
                  <Text style = {styles.hostText}> {itemEmail.toLowerCase()}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.BookingButton}>
          <BookingButton text="PRENOTA" backgroundColor={colors.primary} onPress={getToken}></BookingButton> 
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    height:'100%',
    backgroundColor: colors.primary,
  },
  
  scrollwrapper:{
    height: height,
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
  },
  itemTitle:{
    fontSize: 30,
    color: colors.black2,
    fontWeight: "400",
    alignSelf:'flex-start',
    alignSelf:'center'
  },
  itemBeds:{
    fontSize: 16,
    fontWeight:'bold',
    color: colors.red,
    marginVertical: 5
  },
  itemPlace:{
    fontSize: 18,
    textDecorationLine:'underline',
    fontWeight: 'bold',
    color: colors.tertiary,
    marginBottom:1
  },
  itemAddress:{
    fontSize: 16,
    fontWeight: 'bold'
  },
  price:{
    color: colors.orange2,
    fontSize: 50
  },
  priceLabel:{
    fontWeight:'500',
    fontSize: 30,
    marginTop:13
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
    borderRadius:10,
    borderWidth: 2,
    borderColor: colors.secondary,
    padding:20,
    borderLeftWidth:0,
    borderRightWidth:0,
    backgroundColor: colors.white,
    marginTop:20,
    width: width
},
  structureServicesBox:{
    borderRadius: 10,
    borderBottomWidth: 2,
    borderColor: colors.secondary,
    padding:20,
    backgroundColor:colors.white,
    width: width
  },
  serviceList:{
    alignSelf:'center', 
    flexDirection: servicesFlexDirection, 
    flex:1, 
    flexWrap:'wrap'
  },
  serviceWrapper:{
    flexDirection: 'row',
    marginRight: 10
  },
  serviceLabel:{
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
  },
  hostInfo:{
    width: width,
    paddingVertical: 20,
    marginBottom:80,
    backgroundColor:colors.white
  },
  hostInfoLabel:{
    alignSelf:'flex-start',
    paddingLeft:20,
    flexDirection:'row',
    alignItems: 'flex-start',
    alignContent:'flex-start'
  },
  hostInfoText:{
    alignContent:'center',
    alignItems:'center',
  },
  hostText:{
    
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
  },

  ownerInfo:{
    color:colors.black,
    fontWeight: '700',
    fontSize: 16,
  },
  BookingButton:{
    padding: 5,
    alignSelf: buttonAlign
  },
  description:{
    marginTop: 20,
    marginBottom:20,
    flexDirection:'row'
  },
  descriptionText:{
    margin: 2,
    marginLeft: 4,
    flex:1,
    flexWrap:'wrap'
  },
  logo: {
    width:80,
    height:90,
    marginTop: 0,
    marginBottom: 0,
  },
  infoIcon:{
    borderWidth: 3,
    width: 20,
    marginRight:3,
    borderRadius: 50,
    borderColor: colors.transparent,
    padding: 2
  }
 
});