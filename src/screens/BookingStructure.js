import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../style/colors/index'
import DateSelector from '../components/DateSelector'
const BookingStructure=({route})=>{
  const { 
    itemTitle,
    itemPrice,
    itemID,
   } = route.params;
    return (
      <View style={styles.container}>
        <Text style={styles.textHeader}>Prenotazione Struttura:</Text>
        <Text style={styles.texTitle}> {itemTitle}</Text>
        <Text style={styles.textInfo}>seleziona date di soggiorno e completa tutti i campi</Text>
        <DateSelector></DateSelector>
        <Text>Prezzo/notte : {itemPrice}</Text>
        <Text>ID struttura: {itemID}</Text>
        <Text>Prezzo Totale:</Text>
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
    texTitle:{
      fontSize: 18,
      color: colors.white,
      fontWeight: "300",
      marginTop:5,
      marginBottom: 5
    },
    textInfo:{
      fontSize: 14,
      color: colors.white,
      fontWeight: "300",
      marginBottom: 30
    }
});

export default BookingStructure