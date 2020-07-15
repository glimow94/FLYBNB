import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../style/colors/index'
import DateSelector from '../components/DateSelector'
const BookingStructure=()=>{
    return (
      <View style={styles.container}>
        <Text style={styles.textHeader}>Prenotazione Struttura</Text>
        <Text style={styles.textInfo}>seleziona date di soggiorno e completa tutti i campi</Text>
        <DateSelector></DateSelector>
      </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.green01,
        height:'100%',
        alignContent:'center',
        alignItems: 'center'
    },
    textHeader: {
      fontSize: 28,
      color: colors.white,
      fontWeight: "300",
      marginTop:30
    },
    textInfo:{
      fontSize: 14,
      color: colors.white,
      fontWeight: "300",
      marginBottom: 30
    }
});

export default BookingStructure