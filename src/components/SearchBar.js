import React, { Component } from "react";
import { View, TextInput, SafeAreaView, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../style/colors/index";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function SearchBar(){
 
    return (
      <SafeAreaView style={{flex:1, marginTop:20}}>
        <View style={styles.view1}>
          <View style={styles.searchBarStyle}>
            <Icon name="ios-search" size={20} style={styles.iconstyle} />
            <TextInput 
                underlineColorAndroid="transparent"
                placeholder="Cerca struttura"
                placeholderTextColor="grey"
                style={styles.inputStyle}
            />
          </View>
        </View>
      </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    searchBarStyle: {
        flexDirection:'row',
        width: 150,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.white,
        
    },
    iconstyle: {
        marginRight: 10
    },

    inputStyle:{
        flex: 1, 
        fontWeight: "600", 
        borderRadius: 4,
        width: 200,
        backgroundColor: colors.white,
        
     
    },

    view1:{
        flexDirection: "row",
        padding: 12,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: colors.white,
        marginBottom: 5,
        backgroundColor:colors.white,
        marginHorizontal: 20,
        width: 265,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: "black",
        shadowOpacity: 0.2,
    },

  });