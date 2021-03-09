import React, { Component } from "react";
import { View, TextInput, StyleSheet, Image , TouchableOpacity, Dimensions, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../style/colors/index";
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import host from '../configHost';

var {width} = Dimensions.get('window');
var fontSize = 13;
var height = 55;
var logoAlign = 'center';
width = width*0.6

if(Platform.OS == 'web' && Dimensions.get('window').width > 700){
  width = width*0.4;
  fontSize = 20;
  height = 60;
  logoAlign = null;
}
export default class SearchBar extends Component{
  constructor(props){
    super(props);
    this.state={
      searchBarText: '',
      userToken : null
    }
  }
  changeName = () => {
    var searchText = this.state.searchBarText;
    console.log(searchText)
    const itemToken = AsyncStorage.getItem('userToken')
    itemToken.then(token => {
      this.setState({userToken: token})
      if(this.state.userToken != null){
        const url = `http://${host.host}:3055/structures/search/${searchText}/${this.state.userToken}`;
        axios.get(url, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
            }
          })
          .then(res => {
              const structures = res.data;
              console.log(res.data)
              this.props.updateState({
                structuresDATA: structures
              })
            
        })
      }else{
        const url = `http://${host.host}:3055/structures/${searchText}`;
        axios.get(url, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
            }
          })
          .then(res => {
              const structures = res.data;
              console.log(res.data)
              this.props.updateState({
                structuresDATA: structures
              })
            
        })
      }
      });
      this.props.updateState({
        searchBarText : this.state.searchBarText,
      })
    //console.log(this.state.searchBarText)
  }
 
  render()
    {
      return (
          <View style={styles.view1}>
      
            <View style={styles.searchBarStyle}>
              <View style={styles.logoWrapper}>
                <Image
                    style={styles.logo}
                    city={this.state.city}
                    source={require('../img/logo_mini3.png')}
                />
              </View>
              <TextInput 
                  underlineColorAndroid="transparent"
                  placeholder={'es. "Sicilia", "Palermo" , "Casa di Mario"'}
                  placeholderTextColor="grey"
                  style={styles.inputStyle}
                  onChangeText={ val =>this.setState({searchBarText : val})}
                  onSubmitEditing ={this.changeName}
                  onKeyPress = {
                    (event) => {
                      if(event.nativeEvent.key === "Enter"){
                        this.changeName
                      }
                    }
                  }
              />
              <TouchableOpacity style={styles.searchButton} onPress={this.changeName}>
                <Icon name="ios-search"  size={30} style={styles.iconstyle} />
              </TouchableOpacity>
            </View>
          </View>
          
    );}
}


const styles = StyleSheet.create({
    view1:{
      flexDirection: "row",
    }, 
    searchBarStyle: {
      flexDirection:'row',
      backgroundColor: colors.white,
      height: height,
      borderRadius: 50,
    },
    iconstyle: {
      marginRight: 10,
      color:colors.white
    },

    inputStyle:{
      fontWeight: "400",
      fontSize: fontSize, 
      borderWidth:1,
      borderColor: colors.secondary,
      borderRightWidth:0,
      borderLeftWidth:0,
      width: width,
      height:height,
      paddingLeft:5,
      backgroundColor: colors.primary,
    },

    searchButton:{
      backgroundColor: colors.blue,
      borderWidth: 1,
      borderLeftWidth:0,
      borderColor: colors.secondary,
      borderTopRightRadius:50,
      borderBottomRightRadius:50,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',    
      padding:5,
      paddingLeft:10
    },
    buttonText:{
      fontSize:10
    },
    logoWrapper:{
      borderWidth:1,
      borderColor: colors.secondary,
      borderRightWidth:0,
      width: 70,
      backgroundColor: colors.primary,
      height: height
    },
    logo:{
      width: 45,
      height: height-5,
      marginRight: 18,
      alignSelf: logoAlign
    },
  });