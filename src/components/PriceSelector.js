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
      // status è il valore che rende visibile/invisibile il selettore del prezzo
      status: false,
      buttonText: 'Prezzo',
    };
  }
//callback per comunicare con gli altri pulsanti in modo da chiuderli una volta aperto questo
    updatePrice(data){
        this.props.updatePrice(data)
    }
    showHide=()=>{
        if(this.state.status==true){
            this.setState({
                status:false
            })
        }
        else{
            this.setState({
                status:true,
            })
        }
    }
    
    showHideText=()=>{

    }
    showHideKey=(event)=>{
        if (event.key==='Enter'){
            this.setState({
                status:false
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
          this.state.status ? 
            <View >
                
                
                <TextInput  
                    defaultValue={this.props.price}
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
  container: {
    flexDirection:'row',
    position:'absolute',
    width:200,
    height:200,
    top:36,
    backgroundColor: colors.white,
    borderRadius:20,
    borderWidth:2,
    borderColor: colors.black

  },
  title:{
    fontSize: 12,
    fontWeight: "300",
    paddingHorizontal: 8,
    paddingTop:12,
    position: 'relative',
    bottom: 4
  },
  confirmButton:{
    padding:5
 },
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
    marginBottom: 10  
}  
});