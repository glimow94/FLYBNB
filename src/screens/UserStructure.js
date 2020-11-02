import React, {Component, useEffect} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, Dimensions, Platform, TouchableOpacity, FlatList} from 'react-native';

import colors from '../style/colors';
import { Icon } from 'react-native-elements';
import MenuButton from '../components/buttons/Button1'
import moment from "moment";

var {width} = Dimensions.get('window');
var height =  width;
var titleFontSize = 18;

if(Platform.OS === 'web' && Dimensions.get('window').width > 700){
  width = width*0.6;
  height = height*0.3;
  titleFontSize = 30;
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
    requestList,
    guestsList
    } = route.params;
    var images = []
    if(image1 != null && image1.length != 0) images.push(image1)
    if(image2 != null && image2.length != 0) images.push(image2)
    if(image3 != null && image3.length != 0)  images.push(image3)
    if(image4 != null && image4.length != 0) images.push(image4)
    
    const [state,setState] = React.useState({
      activeImage : 0,
      horizontalScroll: true,
      /* variabili per la gestione del menu [INFO | RENDICONTO ] */
      button1Border: colors.secondary, //il bottone attivo avrà il bordo colorato
      button2Border: colors.primary, 
      status1: true, //se status1 è true mostra la sezione delle info struttura
      status2: false, // se status2 è true mostra la sezione del rendiconto

      /* variabili per la gestione delle prenotazioni per il rendiconto */
      requestList : requestList, //richieste accettate per questa struttura (utili al rendiconto)
      guestsList : guestsList, //lista degli ospiti per questa struttura, da suddividere in base alle prenotazioni
      bookingList : [], //lista delle prenotazioni integrata con gli ospiti
      bookingListFiltered: [],//lista delle prenotazioni effettivamente visualizzate nel rendering in base ai filtri
      /* range di date per filtrare le prenotazioni */
      startDate : '',
      endDate: ''
    })

    useEffect(() => {
      /* su android non verrà visualizzata la barra di scrolling per le immagini (si usa il touch) */
      var horizontalScroll_ = true;
      if(Platform.OS == 'android'){
        horizontalScroll_ = false;
      }
      /* Associo ad ogni prenotazione gli ospiti corrispondenti */
      var bookingList = [];
      for(var i = 0; i < state.requestList.length ; i++){
        var singleBooking = [],
            guests = [];
        singleBooking.push(state.requestList[i]);
        for(var j = 0; j < state.guestsList.length; j++){
          if(state.guestsList[j].id == state.requestList[i].id){
            guests.push(guestsList[j]);
          }
        }
        if(guests.length > 0) singleBooking.push(guests);
        bookingList.push(singleBooking);
      }
      console.log(bookingList)
      setState({
        ...state,
        bookingList: bookingList,
        bookingListFiltered : bookingList,
        horizontalScroll: horizontalScroll_
      })
    }, [])
    const imageChanged = ({nativeEvent}) => {
      const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width );
      //contentOffSet misura quanto una view (in questo caso l'img della scrollView) è stata spostataa dall'origine tramite evento di tocco/trascinamento
      if(slide !== state.activeImage){
        setState({
          ...state,
          activeImage: slide
        })
      }
    }

    /* funzioni di visibilità delle sezioni info e rendiconto del menu */
    const showInfo = ()=>{
      if(state.status1 == false){
        setState({
          ...state,
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
          ...state,
          status1 : false,
          status2 : true,
          button1Border : colors.primary,
          button2Border : colors.secondary
        })
      }
    }
    /* funzione che filtra le prenotazioni in base alle date selezionate */
    const bookingsFilter = (start, end)=>{
      var filteredData = [],
          bookingCheckIn,
          dateFormat = 'DD-MM-YYYY',
          startDate = moment(start,dateFormat),
          endDate = moment(end,dateFormat);
      for(var i = 0; i < state.bookingList.length ; i++){
        /* checkIn >= a startdate && checkIn <= endDate*/
        bookingCheckIn = moment(state.bookingList[i][0].checkIn, dateFormat);
        if( bookingCheckIn >= startDate && bookingCheckIn < endDate){
          filteredData.push(state.bookingList[i]);
        }
      }
      setState({
        ...state,
        bookingListFiltered : filteredData
      })
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
            <Text style={styles.headerTitle}>Resoconto prenotazioni per la struttura "{itemTitle}"</Text>
            <Text style={styles.headerSubtitle}>*Richieste accettate nella struttura</Text>
            { state.bookingList.length == 0 ?
              <Text style={styles.headerSubtitle}>Questa struttura non ha ancora ricevuto prenotazioni</Text> : 
              <View>
                <MenuButton text='FILTRA' onPress={()=>bookingsFilter('01/01/2021','29/01/2021')} ></MenuButton>
                <FlatList
                    data= {state.bookingListFiltered}
                    style={{marginVertical: 10}}
                    keyExtractor = {(item, index) => index.toString()}
                    inverted={true}
                    renderItem = {({item}) =>
                      <View style={styles.item}>
                          <View style={styles.checkInOut}>
                              <View style={{flexDirection:'column', marginRight:20}}>
                                <Text style={styles.checkInOutText}>Check-In: </Text>
                                <Text>{item[0].checkIn}</Text>
                              </View>
                              <View style={styles.checkoutBox}>
                                <Text style={styles.checkInOutText}>Check-Out: </Text>
                                <Text>{item[0].checkOut}</Text>
                              </View>
                          </View>
                          <View style={styles.clientInfo}>
                            <View style={styles.clientBox}>
                              <Text style={[styles.clientInfoText,{color: colors.transparent}]}>Cliente:</Text>
                              <Text style={styles.clientInfoText}>{item[0].name} {item[0].surname}</Text>
                              <Text style={styles.clientInfoText}>{item[0].email.toLowerCase()}</Text>
                            </View>
                          </View>
                          <View style={styles.guestInfo}>
                            <Text style={styles.clientInfoText,{color:colors.transparent}}>Ospiti:</Text>
                            <FlatList
                              data= {item[1]}
                              keyExtractor = {(item, index) => index.toString()}
                              renderItem = {({item}) =>
                                      <View style={styles.guestInfoWrapper}>
                                        <Text style={styles.guestInfoText}>{item.name}</Text>
                                        <Text style={styles.guestInfoText}>{item.surname}</Text>
                                        <Text style={styles.guestInfoText}>{item.date}</Text>
                                      </View>
                              }
                              contentContainerStyle={{paddingTop:40}}
                            />
                          </View>
                          <View style={styles.priceInfo}>
                              <View style={styles.priceBox}>
                                <Text style={styles.priceText}>Tassa soggiorno: </Text>
                                <Text style={styles.taxPrice}>{item[0].cityTax} € </Text>
                                <Text style={[styles.priceText,{marginLeft:20,alignSelf:'flex-end'}]}>Totale: </Text>
                                <Text style={styles.totPrice}>{item[0].totPrice} € </Text>
                              </View>             
                          </View>
                      </View>}
                    contentContainerStyle={{paddingTop:40}}
                />
              </View>
            }
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
    width:'100%'
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
  },
  /* stile per la sezione RENDICONTO */
  headerTitle:{
    fontSize: titleFontSize,
    fontWeight: "500",
    alignSelf:'center',
    marginHorizontal: 20
  },
  item:{
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 3,
    padding: 10,
    minWidth: width-5,
    borderColor: colors.secondary
  },
  checkInOut:{
    flexDirection:'row',
    alignSelf:'center',
    marginBottom: 6
  },
  clientInfo:{
    marginBottom: 6
  },
  guestInfo:{
    width:'100%',
    marginVertical:10,
  },
  guestInfoWrapper:{
    width:'100%',
    flexDirection:'row'
  },
  guestInfoText:{
    marginVertical: 5,
    marginRight:15
  },
  priceInfo:{
    borderTopWidth: 2,
    paddingTop: 10,
    borderTopColor: colors.secondary
  },
  priceBox:{
    flexDirection:'row'
  },
});