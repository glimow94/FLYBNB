import React, {Component, useEffect} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, Dimensions, Platform, TouchableOpacity, FlatList} from 'react-native';

import colors from '../style/colors';
import { Icon } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';
import MenuButton from '../components/buttons/Button1'
import { Menu } from 'react-native-paper';

var {width} = Dimensions.get('window');
var height =  width;

if(Platform.OS === 'web'){
  width = width*0.6;
  height = height*0.3;
}else{
  width = width;
  height = height*0.9;
}

export default function UserStructure({ route }){
    const {
      userToken,
      itemName,
      itemSurname,
      itemEmail, 
      itemTitle,
      itemPrice,
      itemID,
      itemPlace,
      itemStreet,
      itemNumber,
      itemPostCode,
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
      image4,
      requestList
     } = route.params;
      var images = []
      if(image1 != null && image1.length != 0) images.push(image1)
      if(image2 != null && image2.length != 0) images.push(image2)
      if(image3 != null && image3.length != 0)  images.push(image3)
      if(image4 != null && image4.length != 0) images.push(image4)
      console.log(requestList)
      const [state,setState] = React.useState({
        activeImage : 0,
        horizontalScroll: true,
        /* variabili per la gestione del menu [INFO | RENDICONTO ] */
        button1Border: colors.secondary, //il bottone attivo avrà il bordo colorato
        button2Border: colors.primary, 
        status1: true, //se status1 è true mostra la sezione delle info struttura
        status2: false, // se status2 è true mostra la sezione del rendiconto
        requestList : requestList //richieste accettate per questa struttura (utili al rendiconto)
      })

      useEffect(() => {
        if(Platform.OS == 'android'){
          setState({
            horizontalScroll: false,
          })
        }
    
      }, [])
      
      const imageChanged = ({nativeEvent}) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width );
        //contentOffSet misura quanto una view (in questo caso l'img della scrollView) è stata spostataa dall'origine tramite evento di tocco/trascinamento
        if(slide !== state.activeImage){
          setState({
            activeImage: slide
          })
        }
      }

      /* funzioni di visibilità delle sezioni info e rendiconto del menu */
      const showInfo = ()=>{
        if(state.status1 == false){
          setState({
            status1 : true,
            status2 : false,
            button1Border : colors.secondary,
            button2Border : colors.primary
          })
        }
      }

      const showStatement = ()=>{
        if(state.status2 == false){
          setState({
            status1 : false,
            status2 : true,
            button1Border : colors.primary,
            button2Border : colors.secondary
          })
        }
      }
    return (
      <View style={styles.container}>
        <Text style={styles.itemTitle}>{itemTitle}</Text>
        <View style={styles.menuWrapper}>
          <MenuButton text='INFO' backgroundColor={colors.primary} borderColor={state.button1Border} onPress={showInfo}></MenuButton>
          <MenuButton text='RENDICONTO' backgroundColor={colors.primary} borderColor={state.button2Border} onPress={showStatement} ></MenuButton>
        </View>
        <ScrollView style={styles.scrollwrapper}>
        {state.status1 ? 
          <View style={{alignContent:'center',alignItems:'center'}}>
            <View style={styles.structureInfo}>
              <View style={styles.mainInfo}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Text style = {styles.infoLabel}>{itemPrice}€</Text>
                  <Text style = {styles.infoText}> /Notte</Text>
                </View>
                <View>
                  <Text style = {styles.infoText}>{itemBeds} POSTI LETTO</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style = {styles.infoLabel}>Luogo: </Text>
                  <Text style = {styles.infoText}>{itemPlace}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style = {styles.infoLabel}>Via: </Text>
                  <Text style = {styles.infoText}>{itemStreet} {itemNumber}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style = {styles.infoLabel}>Tipo: </Text>
                  <Text style = {styles.infoText}>{itemType}</Text>
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
          </View> : null
        }
        {state.status2 ? 
          <View style={{alignContent:'center',alignItems:'center'}}>
            <Text style={styles.itemTitle}>Resoconto prenotazioni per la struttura "{itemTitle}"</Text>
            <FlatList
                data= {requestList}
                keyExtractor = {(item, index) => index.toString()}
                inverted={true}
                renderItem = {({item}) =>
                  <View style={styles.item}>
                      <View style={styles.viewRow}>
                        <Text style={styles.titleStructure}>{item.title}, {item.type} </Text>
                        <View style={styles.clientBox}>
                          <Text style={[styles.clientInfoText,{color: colors.transparent}]}>Cliente:</Text>
                          <Text style={styles.clientInfoText}>{item.name} {item.surname}</Text>
                          <Text style={styles.clientInfoText}>{item.email.toLowerCase()}</Text>
                        </View>
                      
                      </View>
                      <View style={styles.checkInOut}>
                
                          <View style={{flexDirection:'column'}}>
                            <Text style={styles.checkInOutText}>Check-In: </Text>
                            <Text>{item.checkIn}</Text>
                          </View>
                          <View style={styles.checkoutBox}>
                            <Text style={styles.checkInOutText}>Check-Out: </Text>
                            <Text>{item.checkOut}</Text>
                          </View>

                      </View>
                      <View style={styles.viewRow}>
                          
                          <View style={styles.priceBox}>
                            <Text style={styles.priceText}>Tassa soggiorno: </Text>
                            <Text style={styles.taxPrice}>{item.cityTax} € </Text>
                            <Text style={styles.priceText}>Totale: </Text>
                            <Text style={styles.totPrice}>{item.totPrice} € </Text>
                          </View>
                          
                      </View>
                  </View>}
                contentContainerStyle={{paddingTop:40}}
              />
          </View> : null
        }
        </ScrollView>
      </View>
    )
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    height:'100%',
    alignContent:'center',
    alignItems:'center',
    backgroundColor: colors.primary,
  },
  menuWrapper:{
    flexDirection:'row',
    marginVertical: 10
  },
  scrollwrapper:{
    height: height,
  },
  /* stile per la sezione INFO */
  Image:{
    width: width,
    height: '100%',
    resizeMode:'contain'
  },
  imageScrollWrapper:{
    flex:1,
    height: '30%',
    marginVertical: 20,
    backgroundColor: colors.white,
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
  
  /* itemBeds:{
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
  }, */
  infoLabel:{
    color: colors.blue,
    fontSize: 18,
    marginVertical:5,
    fontWeight: '600'
  },
  infoText:{
    fontWeight:'500',
    marginVertical: 5,
    fontSize: 18,
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
    flexDirection: 'row', 
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
  /* stile per la sezione RENDICONTO */
});