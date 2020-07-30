import React, {Component, useEffect} from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AddButton from '../components/buttons/Button1'
import { useNavigation } from '@react-navigation/native';

import colors from '../style/colors';

import { UserContext } from "../components/context";
import LogoutButton from "../components/buttons/Button1"
import { color } from 'react-native-reanimated';

import AddStructure from './AddStructure';


const {width} = Dimensions.get('window');
const height =  width*0.4//40% di width

export default function Profile(){

  const navigation = useNavigation();

  const [userData,setUserData] = React.useState({
    structuresId: ['1','04'],
    bookingsId: [],
    name:'',
    surname:'',
    city:'',
    birthdate:''
  })

  const { signOut } = React.useContext(UserContext)

  function signOut_(){
    signOut()
  }

  async function getUserData(){
    var user_name = '';
    var user_city='';
    var user_birthdate='';
    try{
      user_name = await AsyncStorage.getItem('name');
      user_city = await AsyncStorage.getItem('city');
      user_birthdate = await AsyncStorage.getItem('birthdate');
    }catch(e){
      console.log(e)
    }
    setUserData({
      ...userData,
      name: user_name,
      surname:'',
      city: user_city,
      birthdate: user_birthdate
    })
  }
//funzione che al caricamento dello screen 'Profile' carica le info dell'utente dall'asyncstorage
  useEffect(() => {
    getUserData();
  }, [])
    return (
      <View style={styles.container}>
        <Text style={styles.titleHeader}>Area Personale</Text>

        <View style={styles.profileCard}>
          <Image
                style={styles.logo}
                source={require('../img/person.png')}
          />

          <View style={styles.userInfoBox}>
            <Text>{userData.name} {userData.surname}</Text>
            <Text>{userData.city}</Text>
            <Text>Nato il {userData.birthdate}</Text>
          </View>
          <Text onPress={signOut_} style={{color: colors.red, fontSize:14, fontWeight: "700"}} >Logout</Text>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.infoBox}>
            { userData.bookingsId.length == 0 ? <Text>Nessuna prenotazione effettuata</Text> : <Text>Prenotazioni effettuate: </Text> }
          </View>
          <View style={styles.infoBox}>
            { userData.structuresId.length == 0 ? <Text>Diventa host aggiungendo una nuova struttura</Text> : <Text>Le mie strutture:{userData.structuresId}</Text> }
            <Text style={styles.structureButton} onPress={()=> navigation.navigate(AddStructure)} > Aggiungi +</Text>
          </View>

        </View>

      </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.green01,
        height:'100%',
        padding: 10
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
    },
    userInfoBox:{
      margin: 10,
      backgroundColor: colors.white,
      padding: 15,
      borderWidth: 2,
      borderColor: colors.black,
      borderRadius: 10,

    },
    titleHeader:{
      fontSize: 28,
      color: colors.white,
      fontWeight: "300",
      margin: 20,
      alignSelf:'center'
    },
    profileInfo:{
      margin: 30,
      alignContent:'center',
      alignItems: 'center'
    },
    infoBox:{
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.black,
      padding:20,
      backgroundColor: colors.white,
      marginBottom:20,
      width: width*0.9
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