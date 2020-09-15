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
var height =  width;

Platform.OS === 'web' ? width= width *0.3 : width = width*0.8
Platform.OS === 'web' ? height = height*0.3 : height = height*0.9

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
      waitingRequests:0
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
      status:false,
      status2:false,
      status3:false,
      
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
      console.log("remote Uri")
      console.log(pickerResult.uri)
      this.setState({
        profileImage: pickerResult.uri
      })
    } else {
      // remoteUri è null per un device mobile
      this.setState({
        profileImage: pickerResult.uri
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
      <ScrollView style={styles.scrollViewWrapper}>
        <Text style={styles.titleHeader}>Area Personale</Text>
        {Platform.OS === 'web'? 
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('Home')} style={styles.accessButton}>
                    <Icon
                    size={40}
                    style={styles.icon}
                    name='home'
                    type='font-awesome-5'
                    color={colors.white}
        /><Text style={styles.accessText}>HOME</Text></TouchableOpacity>:null}
        <View style={[{width:width},styles.profileCard]}>
           <View style={[{width:width},styles.userInfoBox]}>
            <Image source={ this.state.profileImage != null ? {uri: this.state.profileImage} : require('../img/person.png') } 
                   style={styles.ProfileImage} 
            />
            <TouchableOpacity style={styles.button} onPress={this.profileImagePickerAsync}>
            <Icon
              size={20}
              style={styles.icon}
              name='camera'
              type='font-awesome'
              color={colors.black}
            />
          </TouchableOpacity>
            <Text style={styles.profileTextInfo}>{this.state.name} {this.state.surname}</Text>
            <Text style={styles.profileTextInfo}>{this.state.city}</Text>
            <Text style={styles.profileTextInfo}>{this.state.email}</Text>
            <Text onPress={signOut} style={{color: colors.red, fontSize:14, fontWeight: "700", alignSelf:'center'}} >Logout</Text>
            </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuButton1} onPress={this.showHideBookings}>
            <Text style={styles.menuText}>PRENOTAZIONI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton3} onPress={this.showHideStructures}>
            <Text style={styles.menuText}>STRUTTURE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton2} onPress ={this.showHideRequests}>
            <Text style={styles.menuText}>RICHIESTE</Text>
           { this.state.waitingRequests > 0 || this.state.waitingRequests == '9+' ? <View style={styles.notifications}>
              <Text style={styles.numberNotif}>{this.state.waitingRequests}</Text>
            </View>:null}
          </TouchableOpacity>

        </View>
        <View style={styles.profileInfo}>
          
          {this.state.status? 
              <View style={styles.infoBox}>
                <BookingsList></BookingsList>
              </View>:null
          }
          {this.state.status2 ? 
              <View style={styles.infoBox}>
                { this.state.structuresList.length == 0 ? <Text>Diventa host aggiungendo una struttura</Text>
              :<View style={styles.structuresList}>
                <UserStructures
                  updateState={this.updateState.bind(this)}
                ></UserStructures>
               </View>}
              <Text style={styles.structureButton} onPress={()=> this.navigateToAddStructure()} >Aggiungi +</Text>
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
        padding: 5
    },
    ProfileImage:{
      height: 100,
      width: 100,
      alignSelf:'center',
      borderRadius: 80,
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
      marginTop:0,
      backgroundColor: colors.white,
      padding: 15,
      borderWidth: 2,
      width:300,
      borderColor: colors.black,
      borderRadius: 70,
    },
    titleHeader:{
      fontSize: 28,
      color: colors.white,
      fontWeight: "300",
      marginTop: 20,
      marginBottom:10,
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
      width:120,
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
      width:120,
      backgroundColor: colors.blue,
      flexDirection:'row',
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
      width:120,
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
    notifications:{
      backgroundColor:colors.red,
      width:20,
      height:20,
      borderWidth:1,
      borderRadius:9,
      borderColor:colors.white
    },
    numberNotif:{
      color:colors.white, 
      fontSize :12, 
      fontWeight: "600",
      alignSelf:'center'
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
      width: 350
    },
    structureButton:{
      color: colors.white, 
      fontSize:14, 
      padding:4,
      width: 90,
      textAlign:'center',
      alignSelf:'center',
      backgroundColor: colors.blue,
      borderColor: colors.black,
      marginBottom:10,
      borderWidth: 2,
      borderRadius: 8
    },
    structuresList:{
      flex:1,
      alignContent:'center',
      width:'100%'
    },
    accessButton:{
      borderWidth:3,
      borderTopWidth:3,
      borderRadius:50,
      borderColor:colors.white,
      alignContent:'center',
      alignItems:'center',
      height:80,
      backgroundColor:colors.green01,
      width:80,
      position:'relative',
      bottom:60,
      marginRight:25,
      alignSelf:'flex-start'
    },
    accessText:{
      fontWeight:"600",
      textAlign:'center',
      fontSize:12,
      color:colors.white
    },
    icon:{
      marginTop:6,
      alignSelf:'center'
    }
});

export default Profile