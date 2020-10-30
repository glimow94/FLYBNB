import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import colors from '../style/colors';
import ConfirmButton from '../components/buttons/confirmButton';
import PriceButton from '../components/buttons/Button1'
//definisco la funzione 'changeDateFormat' per convertire una stringa di data 
// da "Day Mon DayNumber Year" in "DD-MM-YYYY"

export default class PriceSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonText: 'Prezzo',
    };
  }
//callback per comunicare con gli altri pulsanti in modo da chiuderli una volta aperto questo
    updatePrice(data){
        this.props.updateState(data)
    }
    showHide=()=>{
        if(this.props.status2==true){
            this.props.updateState({
              status2:false
            })
        }
        else{
            this.props.updateState({
              status2:true,
              status1:false,
              status3:false,
              status4:false
            })
        }
    }
    
    showHideText=()=>{

    }
    showHideKey=(event)=>{
        if (event.key==='Enter'){
            this.props.updateState({
                status2:false,
            })
        }
    }

    priceChange(maxprice) {
        //function to handle the date change 
        if ( parseInt(maxprice)>0 && !(isNaN(parseInt(maxprice)))) {
            this.setState({
                buttonText: '< '+maxprice+'€'
            });
            this.updatePrice({price:maxprice})
        } else {

            this.setState({
                buttonText: 'Prezzo'
            });
            this.updatePrice({price:'Prezzo'})
        }
    }

  
  

  render() {
    
    return (
      <View>
       { this.props.city != 'Luogo' || this.props.searchBarText.length != 0 ? <PriceButton text={this.state.buttonText} onPress={this.showHide} backgroundColor={colors.white}></PriceButton>:<PriceButton text={this.state.buttonText} backgroundColor={colors.white} opacity={0.4}></PriceButton>}
        
        {   
          this.props.status2 ? 
          <View style={styles.wrapper}>
            <View style={styles.container}>
                <Text style={[{width:150},styles.label]}>PREZZO MAX.</Text>
                <TextInput  
                    placeholder='Prezzo/notte' 
                    underlineColorAndroid='transparent'  
                    style={styles.textInputStyle}  
                    keyboardType={'numeric'}
                    onChangeText={
                        text => this.priceChange(text)
                    }
                    onKeyPress={this.showHideKey}
                />  
            </View>
            <View style={styles.confirmButton}>
                <ConfirmButton text='OK' onPress={this.showHide} ></ConfirmButton>           
            </View>
        </View>: null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper:{
    flex:1,   
    position:'absolute'
  },
  container: {
    width:140,
    height: 140,
    alignContent:'center',
    alignItems:'center',
    position:'relative',
    top:50,
    backgroundColor: colors.transparent,
    borderRadius:20,
    borderWidth:4,
    borderColor: colors.black,
    shadowColor: colors.black,
    paddingTop: 20,
    paddingBottom:10,
    paddingHorizontal: 10

  },
  label:{
    fontSize: 14,
    fontWeight:"700",
    color:colors.white,
    marginBottom:10,
    marginLeft: 55
  },
  textInputStyle: {  
      textAlign: 'center', 
      height: 40,  
      width: 100,
      backgroundColor: colors.white,
      borderRadius: 8,  
      borderWidth: 2,  
      borderColor: colors.black,  
  } ,
  confirmButton:{
    flexDirection:'row',
    justifyContent:'center',
    padding:10,
  },
});