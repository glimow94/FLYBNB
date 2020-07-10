import React, { Component } from 'react';
import { useNavigation } from '@react-navigation/native';


import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  Button,
  Dimensions
} from 'react-native';

import colors from "../style/colors/index";
import LoginButton from "../components/buttons/LoginButton"
import Login from './Login';
import Signup from './Signup'

export default function LoggedOut(){ 
  
const navigation = useNavigation();

 return(
    <View style={styles.wrapper}> 
      <View style={styles.welcomeWrapper}>
        <Image
          style={styles.logo}
          source={require('../img/logo.png')}
        />
        <Text style={styles.welcomeText}>
         Benvenuto su flyBNB
        </Text>
        <View >
          <LoginButton 
            text="Accedi"
            onPress={()=>navigation.navigate(Login)}
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
      backgroundColor: colors.green01 
    },
    welcomeWrapper: {
      flex: 1,
      marginTop: 30,
      padding: 20,
    },
    logo: {
      flex:1,
      width:400,
      marginTop: 20,
      marginBottom: 20,
      resizeMode:'contain'
    },
    welcomeText: {
      fontSize: 30,
      color: colors.white,
      fontWeight: "300",
      marginBottom: 40
    }
  });