import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../style/colors/index'
export default function BookingStructure(){
    return (
      <View style={styles.container}>
        <Text>PRENOTA QUESTA STRUTTURA</Text>
      </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.green01,
        height:'100%'
    },
});