import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../style/colors';
import DateSelector from '../components/DateSelector'
import BookingButton from '../components/buttons/bookingButton'

export default function Structure({ route }){
    const { 
      itemTitle,
      itemPrice,
      itemID,
      ItemPlace,
      itemKitchen,
      itemFullBoard,
      itemAirConditioner,
      itemWifi,
      itemParking } = route.params;
    return (
      <View style={styles.container}>

        <View style={styles.structureInfo}>

          <Text style={styles.title}>{itemTitle}</Text>
          <View style={styles.dateSelect}>
          </View>
          <View style={styles.mainInfo}>
            <View style={{flexDirection:'row'}}>
              <Text style={styles.normalText} >Prezzo per Notte: </Text><Text style = {styles.important}>{itemPrice}€</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={styles.normalText}>Indirizzo: </Text><Text style = {styles.important}>{ItemPlace}</Text>
            </View>
          </View>
          <Text style={styles.normalText}>Servizi inclusi nella struttura: </Text>
          <View style={styles.structureServicesBox}> 
            
            {itemKitchen ? <Text style={styles.servicesText}>Cucina</Text> : null}
            {itemFullBoard == true ? <Text style={styles.servicesText}>Pensione completa</Text> : null }
            {itemAirConditioner == true ? <Text style={styles.servicesText}>Aria condizionata</Text> : null}
            {itemWifi == true ? <Text style={styles.servicesText}>Wi-Fi</Text> : null }
            {itemParking==true ? <Text style={styles.servicesText}>Parcheggio auto</Text> : null }      
          </View>   
        </View>
        <DateSelector></DateSelector>

        <BookingButton text="PRENOTA"></BookingButton>

      </View>
    )
}

const styles = StyleSheet.create({
    container:{
        height:'100%',
        padding: 30,
        backgroundColor: colors.green01
    },
    mainInfo:{
        marginBottom:50,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.black,
        padding:20
    },
    structureServicesBox:{
      marginBottom:50,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.black,
      padding:20
    },
    servicesText:{
      textAlign:'left',
      fontSize: 16,
      fontWeight: '500',
      color: colors.white

    },
    title:{
      fontSize: 22,
      fontWeight: '700',
      textAlign:'center',
      marginBottom:50
    },
    normalText:{
      fontSize:16,
      marginBottom: 5,
      textAlign:'center'
    },
    important:{
      color:colors.white,
      fontWeight: '400',
      fontSize: 16
    },
    dateSelect:{
     
    },
    BookingButton:{
      
    }
});