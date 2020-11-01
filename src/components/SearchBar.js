import React, { Component } from "react";
import { View, TextInput, StyleSheet, Image , TouchableOpacity, Dimensions, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../style/colors/index";
var {width} = Dimensions.get('window');
var fontSize = 13;
var height = 50;
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
      searchBarText: ''
    }
  }
  changeName = () => {
    this.props.updateState({
      searchBarText : this.state.searchBarText
    })
    //console.log(this.state.searchBarText)
  }
 
  render()
    {
      return (
          <View style={styles.view1}>
      
            <View style={styles.searchBarStyle}>
            <Image
                  style={styles.logo}
                  city={this.state.city}
                  source={require('../img/logo_mini3.png')}
              />
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
        borderRightWidth:1,
        borderRightColor: colors.secondary
        
    },
    iconstyle: {
        marginRight: 10,
        color:colors.white
    },

    inputStyle:{
        fontWeight: "400",
        fontSize: fontSize, 
        borderRadius: 5,
        borderColor:colors.secondary,
        borderWidth: 1,
        borderRightWidth:0,
        borderTopRightRadius:0,
        borderBottomRightRadius:0,
        width: width,
        height:height,
        paddingLeft:5,
        backgroundColor: colors.white2,
     
    },

    searchButton:{
      backgroundColor: colors.blue,
      borderWidth: 1,
      borderTopLeftRadius:0,
      borderBottomLeftRadius:0,
      borderColor: colors.secondary,
      borderRadius:50,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',    
      padding:5,
      paddingLeft:10
    },
    buttonText:{
      fontSize:10
    },
    logo:{
      width: 50,
      marginRight: 10,
      alignSelf: logoAlign
    },

  

  });