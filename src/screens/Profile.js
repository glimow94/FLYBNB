import React, {Component, useEffect} from 'react';
import {View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, Platform,TouchableHighlight} from 'react-native';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import UserStructures from '../components/UserStructureList'
import * as ImagePicker from 'expo-image-picker';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import colors from '../style/colors';
import host from '../configHost';
import { UserContext } from "../components/context";

import BookingsList from '../components/BookingsList';
import RequestList from '../components/RequestList';
import axios from "axios";

var {width} = Dimensions.get('window');
var height = Dimensions.get('window').height;
var containerFlexDirection = 'row';
/* variabili di stile responsive per le sezioni scrrollabili (PRENOTAZIONI,STRUTTURE,RICHIESTE) */
var ScrollHeight = height-125;

var infoboxWidth = '100%';
/* variabili di stile responsive per la profile-card */
var profileCardTextSize = 16;
var profileImageDim = 100;
var profileCardHeight = '100%';
var profileCardBorderWidth = 3;
var profileCardWidth = 250;
var profileInfoAlign = 'center';
var profileMargin=0;
var profilePadding = 20;
var flexDirectionUserInfo = 'column';
/*variabili di stile menu section responsive */
var menuSectionWidth = width-250;
var menuAlign = 'center';

if(Platform.OS === 'android'){
  containerFlexDirection = 'column';
  width = width*0.8;
  ScrollHeight = '90%';
  infoboxWidth = width+40;
  profileCardTextSize = 12;
  flexDirectionUserInfo = 'row';
  profileImageDim = 50;
  profileCardHeight = '15%';
  profileCardBorderWidth = 0;
  profileMargin = 15;
  profilePadding = 4;
  menuSectionWidth = '100%';
  profileCardWidth = '100%';
  menuAlign = 'center'
}


class Profile extends Component{
static contextType = UserContext


  constructor(props){
    super(props);
    this.state={
      structuresList:0, //se questo valore è 0 l'utente non ha struttre e viene mostrato un avviso altrimenti se è 1 viene mostrata la lista delle strutture
      bookingsId: [],
      name:'',
      surname:'',
      city:'',
      birthdate:'' ,
      email:'',
      userToken:'',
      //status per visualizzare le prenotazioni oppure le strutture personali
      status: false,
      status2: false,
      status3: true,
      profileImage: null,
      waitingRequests:0,
      /* variabile borderwidth che assegna il bordo al bottone attivo */
      borderWidth1: 0,
      borderWidth2: 0,
      borderWidth3: 3,
      /* dati per gestire il rendiconto, salviamo le prenotazioni delle strutture dell'utente (vengono passsate dal componente RequestList) */
      /*  per poi passarle al componente Userstructure (alla singola struttura, e solo quelle che sono state approvate!) */
      requestList: []
    }
  }
  

//funzione che al caricamento dello screen 'Profile' carica le info dell'utente dall'asyncstorage
  async componentDidMount(){
    var user_name = '';
    var user_city='';
    var user_surname='';
    var user_email = '';
    var user_birthdate='';
    var userToken= '';
    try{
      userToken = await AsyncStorage.getItem('userToken');
      user_name = await AsyncStorage.getItem('name');
      user_surname = await AsyncStorage.getItem('surname');
      user_city = await AsyncStorage.getItem('city');
      user_birthdate = await AsyncStorage.getItem('birthdate');
      user_email = await (await AsyncStorage.getItem('email')).toLowerCase();
    }catch(e){
      console.log(e)
    }
    const url = `http://${host.host}:3055/users/image/${userToken}`;
    axios.get(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        }
      })
      .then(res => {
        if(res.data[0] ) this.setState({profileImage : res.data[0].image})
    })
    this.setState({
      name: user_name,
      surname:user_surname,
      city:user_city,
      birthdate:user_birthdate,
      email:user_email,
      userToken:userToken,
    })
  }
  showHideBookings=()=>{
    if(this.state.status==false){
      this.setState({
        status:true,
        status2:false,
        status3: false,
        borderWidth1:3,
        borderWidth2:0,
        borderWidth3:0
      })
    }
  }
  showHideStructures=()=>{
    if(this.state.status2==false){
      this.setState({
        status2:true,
        status3: false,
        status:false,
        borderWidth1:0,
        borderWidth2:3,
        borderWidth3:0
      })
    }
  }
  showHideRequests=()=>{
    if(this.state.status3==false){
      this.setState({
        status3:true,
        status2:false,
        status:false,
        borderWidth1:0,
        borderWidth2:0,
        borderWidth3:3
      })
    }
  }
  updateState(filterStatus){
    this.setState(filterStatus)
  } 

  profileImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
    // verifica permessi di accesso alla gallery
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({base64:true});
    if (pickerResult.cancelled === true) {
      return; // operazione abortita
    }
    if (Platform.OS === 'web') {
      // i browser web non possono condividere una URI locale per motivi di sicurezza
      // facciamo un upload fittizio su anonymousfile.io e ricaviamo la URI remota del file
 
      
      this.setState({
        profileImage: pickerResult.uri
      })
    } else {
      //estraiamo in base64
      let source =  'data:image/jpeg;base64,'+pickerResult.base64
      // remoteUri è null per un device mobile
      this.setState({
        profileImage: source
      })
    }

    ///let formdata = new FormData();
    //formdata.append("product[name]", 'image')
    //formdata.append("product[image]", {uri: this.state.imageUri, name: 'image.jpg', type: 'image/jpeg'})
    const url = `http://${host.host}:3055/users/update/image/${this.state.userToken}`;
    axios.post(url, {
        method: 'POST',
        headers: {
          'content-type': 'multipart/form-data',
        },
        image: this.state.profileImage
      })
      .then(res => {
        console.log(res);
        })
      .catch(function (error) {
        console.log(error);
      });
  };
  navigateToAddStructure(){
    this.setState({status2:false})
    this.props.navigation.navigate('AddStructure',{userToken: this.state.userToken})
  }
  render(){
    const {signOut} = this.context

    return (
      <View style={styles.container}>
        <View style={[{width:width},styles.profileCard]}>
          <View style={{padding: 4, marginLeft:profileMargin}}>
            <TouchableOpacity style={{alignSelf:'center'}} onPress={this.profileImagePickerAsync}>
              <Image source={ this.state.profileImage != null ? {uri: this.state.profileImage} : require('../img/person.png') } 
                style={styles.ProfileImage} 
              />
            </TouchableOpacity>
            <Text style={styles.usernameText}>{this.state.name} {this.state.surname}</Text>
            <Text onPress={signOut} style={styles.logoutButton} >LOGOUT</Text>
          </View>
          <View style={{ paddingHorizontal: 20 ,alignSelf:'center', alignContent:'flex-end' , alignItems:'flex-end' , flex:1, flexWrap:'wrap'}}>
            <Text style={styles.profileTextInfo}>{this.state.city}</Text>
            <Text style={styles.profileTextInfo}>{this.state.email}</Text> 
          </View> 
        </View>
        <View  style={styles.menuSection}>
          <View style={styles.menu}>
            <TouchableOpacity style={[{borderWidth:this.state.borderWidth1},styles.menuButton]} onPress={this.showHideBookings}>
              <Text style={styles.menuText}>PRENOTAZIONI</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{borderWidth:this.state.borderWidth2},styles.menuButton]} onPress={this.showHideStructures}>
              <Text style={styles.menuText}>STRUTTURE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{borderWidth:this.state.borderWidth3},styles.menuButton]} onPress ={this.showHideRequests}>
              <Text style={styles.menuText}>RICHIESTE</Text>
              { this.state.waitingRequests > 0 || this.state.waitingRequests == '9+' ? <View style={styles.notifications}>
                <Text style={styles.numberNotif}>{this.state.waitingRequests}</Text>
              </View>:null}
            </TouchableOpacity>
          </View>

          <View style={styles.menuSectionWrapper}>
            <ScrollView style={styles.scrollViewWrapper}>
              {this.state.status? 
                  <View style={styles.infoBox}>
                    <BookingsList></BookingsList>
                  </View>:null
              }
              {this.state.status2 ? 
                  <View style={styles.infoBox}>
                    { this.state.structuresList.length == 0 ? <Text>Diventa host aggiungendo una struttura</Text>
                  :<View style={styles.structuresList}>
                    <Text style={styles.structureButton} onPress={()=> this.navigateToAddStructure()} >Aggiungi +</Text>
                    <UserStructures
                      updateState={this.updateState.bind(this)}
                      requestList={this.state.requestList} //passiamo tutte le richieste da smistare in ogni struttura per calcolare il rendiconto...
                    ></UserStructures>
                  </View>}
                  </View> : null
              }
              {this.state.status3? 
                  <View style={styles.infoBox}>
                  <RequestList
                    updateState={this.updateState.bind(this)} 
                  ></RequestList>
                </View>:null
              }
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
    
}

const styles = StyleSheet.create({
    container:{
      backgroundColor:colors.primary,
      height:'100%',
      flexDirection: containerFlexDirection,
    },
    profileCard:{
      height: profileCardHeight,
      flexDirection: flexDirectionUserInfo, 
      alignSelf: profileInfoAlign,
      backgroundColor: colors.primary,
      padding: profilePadding,
      borderRightWidth: profileCardBorderWidth,
      borderColor: colors.secondary,
      margin:0,
      width: profileCardWidth
    },
    ProfileImage:{
      height: profileImageDim,
      width: profileImageDim,
      borderRadius: 50,
    },
    profileTextInfo:{
      margin: 1,
      alignSelf: menuAlign,
      fontSize: profileCardTextSize
    },
    usernameText:{
      fontSize: profileCardTextSize,
      fontWeight:"bold",
      marginBottom: 4,
      alignSelf:'center'
    },
    logoutButton:{
      color: colors.red, 
      fontSize:10, 
      fontWeight: "700", 
      alignSelf:'center',
    },
    menuSection:{
      width:'100%',
      maxWidth: menuSectionWidth,
    },
    menu:{
      flexDirection: 'row',
      alignSelf: menuAlign,
      marginVertical: 4,
      height: 40
    },
    menuButton:{
      height:40,
      width:120,
      alignContent:'center',
      alignItems:'center',
      justifyContent:'center',
      flexDirection: 'row',
      borderColor: colors.secondary,
      borderRadius: 50,
    },
    notifications:{
      backgroundColor:colors.red,
      width:20,
      height:20,
      borderWidth:1,
      borderRadius:9,
      borderColor:colors.transparent2
    },
    numberNotif:{
      color:colors.white, 
      fontSize :12, 
      fontWeight: "600",
      alignSelf:'center'
    },
    menuText:{
      alignSelf:'center',
      color: colors.blue,
      fontSize: 12,
      fontWeight:'bold',
      margin:4,
      justifyContent:"center",
    },
    menuSectionWrapper:{
      alignContent:'center',
      alignItems: 'center',
      borderTopWidth: 2,
      borderColor: colors.secondary,
    },
    infoBox:{
      padding:5,
      marginBottom:20,
      width: infoboxWidth,
      alignSelf:'center'
    },
    scrollViewWrapper:{
      maxHeight: ScrollHeight,
      width:'100%',
      margin:4,
    },
    structureButton:{
      color: colors.white, 
      fontSize:14, 
      fontWeight:'700',
      padding:4,
      width: 90,
      textAlign:'center',
      alignSelf:'center',
      backgroundColor: colors.blue,
      borderColor: colors.black2,
      marginBottom:10,
      borderWidth: 3,
      borderRadius: 10
    },
    structuresList:{
      flex:1,
      alignContent:'center',
      width:'100%'
    },
   
});

export default Profile