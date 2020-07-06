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
              status3:false
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
        <PriceButton text={this.state.buttonText} onPress={this.showHide}></PriceButton>
        
        {   
          this.props.status2 ? 
            <View >
                
                
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
                
            </View> : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
 
 textInputStyle: {  
    textAlign: 'center', 
    position:'relative',
    left: 10, 
    height: 40,  
    width: 100,
    backgroundColor: colors.white,
    borderRadius: 10,  
    borderWidth: 2,  
    borderColor: colors.black,  
    marginTop: 20  
}  
});