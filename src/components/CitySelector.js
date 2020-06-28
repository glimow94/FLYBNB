import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import colors from '../style/colors';
import ConfirmButton from '../components/buttons/confirmButton';
import CityButton from "../components/buttons/Button1"
import { Dropdown } from 'react-native-material-dropdown';


export default class CitySelector extends Component{
    constructor(props) {
        super(props);
        this.state = {
          //set del valore di inizio e fine data
          selectedRegion: null,
          selectedCity: null,
          selectedComune: null,
          // status è il valore che rende visibile/invisibile il calendario
          status: false
        };

    
      }

    showHide=()=>{
        if(this.state.status==true){
            this.setState({status:false})
        }
        else{
            this.setState({status:true})
        }
    }
    render(){
        
        return(
            <View>
                <CityButton text="Città >" onPress={this.showHide}></CityButton>
                {
                    this.state.status ? <View>
                        <Text>Ok</Text>
                    </View> : null
                }
            </View>
        )
    }
}
