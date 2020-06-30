import React, { Component, useCallback } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import colors from '../style/colors';
import CityButton from "../components/buttons/Button1"
import DropDownPicker from 'react-native-dropdown-picker';
import data from "../components/regioni_province_comuni"


export default class CitySelector extends Component{
    constructor(props) {
        super(props);
        this.state = {
          //set del valore di inizio e fine data
          region: 'Sicilia',
          city: 'Palermo',
          // status è il valore che rende visibile/invisibile il menu delle citta
          status: false,
          status2: false,
        };

    
      }
    setRegion(item){
        this.setState({
            region: item.value
        })
        this.showProvinces
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
        if(this.state.status2==true){
            this.setState({status2:false})
        }
        else{
            this.setState({status2:true})
        }
    }
    render(){
        
        return(
            <View style={styles.container}>
                <CityButton text={this.state.city} onPress={this.showHide}></CityButton>
                <View style={styles.dropdownContainer}>
                {
                    this.state.status ? <View>
                        <DropDownPicker 
                            style={styles.dropdown}
                            items={data}
                            defaultValue={this.state.region}
                            containerStyle={{height: 40, width: 150}}
                            style={{backgroundColor: '#fafafa'}}
                            dropDownStyle={{backgroundColor: '#fafafa'}}
                            onChangeItem={item => this.setState({
                            region: item.value,
                            status2: true
                            })}
                        />
                    </View> : null
                }
                {
                    this.state.status2 ? <View>
                        <DropDownPicker style={styles.dropdown}
                            items={[
                                {label: 'Palermo', value: 'Palermo'},
                                {label: 'Catania', value: 'Catania'}
                            ]}
                            defaultValue={this.state.city}
                            containerStyle={{height: 40, width: 150}}
                            style={{backgroundColor: '#fafafa'}}
                            dropDownStyle={{backgroundColor: '#fafafa'}}
                            onChangeItem={ item => this.setState({
                            city: item.value,
                            status: false,
                            status2: false
                            })}
                        />
                    </View> : null
                }
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    dropdown:{

    },
    dropdownContainer:{
        flexDirection: 'row'
    },
    container: {
      flex: 1,
      backgroundColor: colors.green01 
    },
  });