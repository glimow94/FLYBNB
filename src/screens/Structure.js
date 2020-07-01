import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../style/colors';


export default function Structure({ route}){
    const { itemTitle } = route.params;
    return (
      <View style={styles.container}>
        <Text>{JSON.stringify(itemTitle)}</Text>
      </View>
    )
}

const styles = StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor: colors.green01
    },
});