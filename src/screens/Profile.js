import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

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
        
    },
});