import React, { Component } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from "../style/colors/index";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import SearchBar from "../components/SearchBar";
import DateSelector from "../components/DateSelector";
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  Button,
  SafeAreaView
} from 'react-native';
import CitySelector from '../components/CitySelector';



export default function Home(){
    return (
      <View style={styles.container}>
        <View style={styles.searchHeader}>
          <Image
            style={styles.logo}
            source={require('../img/logo_green.png')}
          />
          <SearchBar></SearchBar>
        </View>
        <ScrollView scrollEventThrottle={16}>
          <View style={styles.scrollStyle}>
            <Text style={styles.titleStyle}>
              Come possiamo aiutarti?
            </Text>
        
            <DateSelector></DateSelector>
            <CitySelector></CitySelector>
          </View>
        </ScrollView>
        
      </View>
    )
}

const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor: colors.green01,
    },
    searchHeader:{
      flexDirection:'row',
      padding:0,
      backgroundColor: colors.green01
    },
    logo:{
      width:80,
      height:90,
      marginTop: 0,
      marginBottom: 0,
      resizeMode:'contain'
    },
    scrollStyle:{
      flex: 1, 
      backgroundColor: colors.green01, 
      paddingTop: 0
    },
    titleStyle:{
      fontSize: 24,
      fontWeight: "700",
      paddingHorizontal: 20,
      paddingTop:20
    }
});