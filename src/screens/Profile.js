import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../style/colors';

export default function Profile(){
    return (
      <View style={styles.container}>
        <Text>Dati Personali</Text>
        <Text>Le mie strutture:</Text>
      </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.green01,
        height:'100%'
    },
});