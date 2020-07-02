import React, { Component } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from "../style/colors/index";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import SearchBar from "../components/SearchBar";
import DateSelector from "../components/DateSelector";
import FilterSelector from "../components/FilterSelector";
import StructuresList from "../components/StructuresList"

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



export default class Home extends Component{
  constructor(props){
    super(props);
    this.state={
      kitchen: false,
      fullBoard: false,
      airConditioner:false,
      wifi:false,
      parking:false,
      city:'Luogo'
    }
  }

  updateState(filterStatus){
    this.setState(filterStatus)
  } 
  updateCity(cityStatus){
    this.setState(cityStatus)
  }

  render()
    {
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
                Come possiamo aiutarti? {this.state.city}
              </Text>
              <View  style={styles.structuresList}>
              <StructuresList
                  kitchen={this.state.kitchen}
                  fullBoard={this.state.fullBoard}
                  airConditioner={this.state.airConditioner}
                  wifi={this.state.wifi}
                  parking={this.state.parking}
                  city={this.state.city}                
              ></StructuresList>
              </View>

              <View style={styles.buttonGroup}>
                <DateSelector></DateSelector>
                <CitySelector
                  updateCity={this.updateCity.bind(this)}
                  city={this.state.city}                >
                </CitySelector>
                <FilterSelector 
                  updateState={this.updateState.bind(this)} 
                  kitchen={this.state.kitchen}
                  fullBoard={this.state.fullBoard}
                  airConditioner={this.state.airConditioner}
                  wifi={this.state.wifi}
                  parking={this.state.parking}
                >
                </FilterSelector>
              </View>

            </View>

          </ScrollView>
          
        </View>
    )
  }
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
      paddingTop:20,
      position: 'relative',
      bottom: 18
    },
    buttonGroup:{
      flexDirection: "row",
      resizeMode:'contain',
      marginTop: 5,
      position: 'absolute',
      top: 20,
      padding: 10
    },
    structuresList:{
     
      top: 120
    }
});