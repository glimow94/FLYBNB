import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../style/colors';
import DateSelector from '../components/DateSelector'


export default function Structure({ route}){
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
          <Text>{itemTitle}</Text>
          <Text>{itemPrice}</Text>
          <Text>{ItemPlace}</Text>
          <View> 
            {itemKitchen ? <Text>Cucina</Text> : null}
            {itemFullBoard == true ? <Text>Pensione completa</Text> : null }
            {itemAirConditioner == true ? <Text>Aria condizionata</Text> : null}
            {itemWifi == true ? <Text>Wi-Fi</Text> : null }
            {itemParking==true ? <Text>Parcheggio auto</Text> : null }      
          </View>   
        </View>
        <DateSelector></DateSelector>

      </View>
    )
}

const styles = StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor: colors.green01
    },
});