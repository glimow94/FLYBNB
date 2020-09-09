import React, {Component, useEffect} from 'react';
import {View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import UserStructures from '../components/UserStructureList'
import AddButton from '../components/buttons/Button1'
import { useNavigation } from '@react-navigation/native';

import colors from '../style/colors';

import { UserContext } from "../components/context";
import LogoutButton from "../components/buttons/Button1"
import { color } from 'react-native-reanimated';

import AddStructure from './AddStructure';
import { render } from 'react-dom';
import BookingsList from '../components/BookingsList';
import RequestList from '../components/RequestList';


const {width} = Dimensions.get('window');
const height =  width*0.4//40% di width

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
      status3: false,
      profileImage: null
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
    this.setState({
      name: user_name,
      surname:user_surname,
      city:user_city,
      birthdate:user_birthdate,
      email:user_email,
      userToken:userToken,
      status:false,
      status2:false,
      status3:false
    })
  }
  showHideBookings=()=>{
    if(this.state.status==false){
      this.setState({
        status:true,
        status2:false,
        status3: false
      })
    }
  }
  showHideStructures=()=>{
    if(this.state.status2==false){
      this.setState({
        status2:true,
        status3: false,
        status:false
      })
    }
  }
  showHideRequests=()=>{
    if(this.state.status3==false){
      this.setState({
        status3:true,
        status2:false,
        status:false
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

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return; // operazione abortita
    }
    if (Platform.OS === 'web') {
      // i browser web non possono condividere una URI locale per motivi di sicurezza
      // facciamo un upload fittizio su anonymousfile.io e ricaviamo la URI remota del file
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      console.log("remote Uri")
      console.log(remoteUri)
      this.setState({
        profileImage: pickerResult.uri
      })
    } else {
      // remoteUri è null per un device mobile
      this.setState({
        profileImage: pickerResult.uri
      })
    } 
  };

  render(){
    const {signOut} = this.context

    return (
      <View style={styles.container}>
      <ScrollView style={styles.scrollViewWrapper}>
        <Text style={styles.titleHeader}>Area Personale</Text>
        <View style={styles.profile}>
          { 
            this.state.profileImage !== null ? 
            <Image source={{ uri: this.state.profileImage }} style={styles.ProfileImage}/> : 
            <Image style={styles.notProfileImage}/>
          }
          <TouchableOpacity style={styles.button} onPress={this.profileImagePickerAsync}>
          <Icon
              size={20}
              style={styles.icon}
              name='camera'
              type='font-awesome'
              color='#f50'
              color={colors.black}
              />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
           <View style={styles.userInfoBox}>
            <Image
                  style={styles.logo}
                  source={require('../img/person.png')}
            />
            <Text style={styles.profileTextInfo}>{this.state.name} {this.state.surname}</Text>
            <Text style={styles.profileTextInfo}>{this.state.city}</Text>
            <Text style={styles.profileTextInfo}>{this.state.email}</Text>
            <Text onPress={signOut} style={{color: colors.red, fontSize:14, fontWeight: "700", alignSelf:'center'}} >Logout</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <View style={styles.menuButton1}>
            <Text style={styles.menuText} onPress={this.showHideBookings}>PRENOTAZIONI</Text>
          </View>
          <View style={styles.menuButton3}>
            <Text style={styles.menuText} onPress={this.showHideStructures}>STRUTTURE</Text>
          </View>
          <View style={styles.menuButton2}>
            <Text style={styles.menuText} onPress={this.showHideRequests}>RICHIESTE</Text>
          </View>

        </View>
        <View style={styles.profileInfo}>
          
          {this.state.status? 
              <View style={styles.infoBox}>
                <BookingsList></BookingsList>
              </View>:null
          }
          {this.state.status2 ? 
              <View style={styles.infoBox}>
                { this.state.structuresList.length == 0 ? <Text>Diventa host aggiungendo una nuova struttura</Text>
              :<View style={styles.structuresList}>
                <UserStructures></UserStructures>
               </View>}
              <Text style={styles.structureButton} onPress={()=> this.props.navigation.navigate('AddStructure',{userToken: this.state.userToken})} >Aggiungi +</Text>
              </View> : null
          }
          {this.state.status3? 
              <View style={styles.infoBox}>
              <RequestList
                updateState={this.updateState.bind(this)} 
              ></RequestList>
            </View>:null
          }
        </View>

      </ScrollView>

      </View>
    )
  }
    
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.green01,
        height:'100%',
        padding: 10
    },
    profile:{
      padding: 20,
      height: 170,
      width: 170,
      bottom: 100,
      alignSelf:'center',
      borderColor: colors.white,
      borderWidth: 5,
      borderRadius: 100
    },
    ProfileImage:{
      height: 160,
      width: 160,
      bottom: 20,
      alignSelf:'center',
      borderRadius: 80,
    },
    notProfileImage:{
      height: 160,
      width: 160,
      bottom: 20,
      alignSelf:'center',
      borderRadius: 80,
      backgroundColor: colors.gray
    },
    profileCard:{
      width:200,
      alignContent:'center',
      alignItems:'center',
      alignSelf:'center'
    },
    logo:{
      width:64,
      height:64,
      marginTop: 0,
      marginBottom: 0,
      alignSelf:'center'
    },
    userInfoBox:{
      margin: 10,
      backgroundColor: colors.white,
      padding: 15,
      borderWidth: 2,
      borderColor: colors.black,
      borderRadius: 4,

    },
    titleHeader:{
      fontSize: 28,
      color: colors.white,
      fontWeight: "300",
      margin: 20,
      alignSelf:'center'
    },
    menu:{
      flexDirection: 'row',
      alignContent:'center',
      alignItems:'center',
      alignSelf:'center',
      marginTop: 10
    },
    menuButton1:{
      height:30,
      width:110,
      backgroundColor: colors.blue,
      alignContent:'center',
      alignItems:'center',
      justifyContent:'center',
      borderColor: colors.white,
      borderWidth:2,
      borderRadius: 10,
      borderTopRightRadius:0,
      borderBottomRightRadius:0,
      borderRightWidth:1,
      margin:0
    },
    menuButton2:{
      height:30,
      width:110,
      backgroundColor: colors.blue,
      alignContent:'center',
      alignItems:'center',
      justifyContent:'center',
      borderColor: colors.white,
      borderWidth:2,
      borderRadius: 10,
      borderTopLeftRadius:0,
      borderBottomLeftRadius:0,
      borderLeftWidth:0,
      margin:0,
    },
    menuButton3:{
      height:30,
      width:110,
      backgroundColor: colors.blue,
      alignContent:'center',
      alignItems:'center',
      justifyContent:'center',
      borderColor: colors.white,
      borderWidth:2,
      borderLeftWidth:0,
      borderRightWidth:1,
      margin:0,
    },
    menuText:{
      alignSelf:'center',
      color: colors.white,
      fontSize: 12,
      margin:4,
      justifyContent:"center",
      fontWeight:"600"
    },
    profileInfo:{
      margin: 10,
      alignContent:'center',
      alignItems: 'center'
    },
    profileTextInfo:{
      alignSelf:'center',
      margin: 2,
      fontWeight:"500"
    },
    infoBox:{
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.black,
      padding:5,
      backgroundColor: colors.white,
      marginBottom:20,
      width: 340
    },
    structureButton:{
      color: colors.white, 
      fontSize:14, 
      padding:4,
      width: 90,
      textAlign:'center',
      alignSelf:'center',
      margin: 5,
      backgroundColor: colors.blue,
      borderColor: colors.black,
      borderWidth: 2,
      borderRadius: 8
    },
    structuresList:{
      flex:1,
      alignContent:'center',
      width:'100%'
    }
});

export default Profile