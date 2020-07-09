import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../style/colors';

import { UserContext } from "../components/context";
import LogoutButton from "../components/buttons/Button1"

export default function Profile(){

  const { signOut } = React.useContext(UserContext)

  function signOut_(){
    signOut()
  }
    return (
      <View style={styles.container}>
        <Text>Dati Personali</Text>
        <Text>Le mie strutture:</Text>
        <LogoutButton text='Logout' onPress={signOut_}></LogoutButton>
      </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.green01,
        height:'100%'
    },
});