import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import colors from '../style/colors';
import CityButton from "../components/buttons/Button1"
import DropDownPicker from 'react-native-dropdown-picker';


export default class CitySelector extends Component{
    constructor(props) {
        super(props);
        this.state = {
          //set del valore di inizio e fine data
          region: 'Sicilia',
          selectedRegion: null,
          selectedCity: null,
          selectedComune: null,
          // status è il valore che rende visibile/invisibile il menu delle citta
          status: false,
          status2: false,
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
    showProvinces=()=>{
        
    }
    render(){
        
        return(
            <View>
                <CityButton text="Luogo" onPress={this.showHide}></CityButton>
                {
                    this.state.status ? <View>
                        <DropDownPicker style={styles.dropdown}
                            items={[
                                {label: 'Sicilia', value: 'Sicilia'},
                                {label: 'Sardegna', value: 'Sardegna'}
                            ]}
                            defaultValue={this.state.region}
                            containerStyle={{height: 40, width: 150}}
                            style={{backgroundColor: '#fafafa'}}
                            dropDownStyle={{backgroundColor: '#fafafa'}}
                            onChangeItem={item => this.setState({
                            region: item.value
                            })}
                        />
                    </View> : null
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    dropdown:{

    },
    container: {
      flex: 1,
      backgroundColor: colors.green01 
    },
  });