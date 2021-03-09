import React, { Component } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native';

import colors from "../style/colors/index";
import LoginButton from "../components/buttons/LoginButton"
import Signup from './Signup'

export default function LoggedOut(){ 
  
const navigation = useNavigation();

 return(
    <View style={styles.wrapper}> 
      <View style={styles.welcomeWrapper}>
        <Image
          style={styles.logo}
          source={require('../img/logo_white.png')}
        />
        {/* <Text style={styles.welcomeText}>
         Case Vacanze e Bnb
        </Text> */}
        <View >
          <LoginButton 
            text="Accedi"
            onPress={()=>navigation.navigate('Login',{status:0})}
          />
        </View>
        <LoginButton 
          text="Iscriviti"
          onPress={()=>navigation.navigate(Signup)}
        />
      </View>
    </View>
);
}

const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      alignItems:'center',
      alignContent:'center',
      backgroundColor: colors.primary
    },
    welcomeWrapper: {
      flex: 1,
      marginTop: 30,
      padding: 20,
    },
    logo: {
      flex:1,
      width:260,
      marginTop: 20,
      marginBottom: 20,
      resizeMode:'contain'
    },
    welcomeText: {
      fontSize: 30,
      color: colors.transparent,
      fontWeight: "300",
      marginBottom: 40
    }
  });