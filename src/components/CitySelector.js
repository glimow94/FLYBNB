import React, { Component, useCallback } from 'react';
import { StyleSheet, Text, View, Button , Picker } from 'react-native';
import colors from '../style/colors';
import CityButton from "../components/buttons/Button1"
import DropDownPicker from 'react-native-dropdown-picker';
import data from "../components/regioni_province_comuni";
import comuni from '../components/comuni'
import db from '../components/database_region_city'


export default class CitySelector extends Component{
    constructor(props) {
        super(props);
        this.state = {
          //set del valore di inizio e fine data
          region: 'Sicilia',
          province: 'Palermo',
          province_code: 'Pa',
          city: 'Palermo',
          city_code: '',
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
        
        return (
            <View style={styles.container}>
              <CityButton text={this.state.city.substring(0,10)} onPress={this.showHide}></CityButton>
            { this.state.status ?
              <View >
                <Picker mode="dropdown" 
                    style={styles.pickerstyle}                  
                    onValueChange={itemValue => this.setState({
                    region: itemValue,
                    status2: true
                    })}
                >
                  {
                    db.map((item) =>{
                      return(
                        <Picker.Item  label={item.nome} value={item.nome} key={item.nome}/> 
                      );
                    })
                  }
                </Picker>

                {
                  this.state.status2 ? 
                  <Picker 
                    mode="dropdown" 
                    style={styles.pickerstyle}
                    onValueChange={
                      itemValue => this.setState({
                      province: itemValue,
                      status3: true
                    })}
                  >
                  {
                    db.map((item) =>{
                      if(item.nome == this.state.region){
                        return (
                          item.province.map((item_prov)=>{
                            return(
                              <Picker.Item label = {item_prov.nome} value={item_prov.nome} key={item_prov.code} />
                            );
                          } 
                          ))
                      }}
                      /* return(
                        <Picker.Item  label={item.nome} value={item.nome} key={item.nome}/> 
                      ); */
                    )
                  }
                  </Picker> : null
                }
                {
                  this.state.status3 ? 
                  <Picker 
                    mode="dropdown" 
                    style={styles.pickerstyle}
                    onValueChange={itemValue => this.setState({
                    city: itemValue,
                    status3: false,
                    status2:false,
                    status:false
                    })}
                  >
                  {
                    db.map((item) =>{
                      if(item.nome == this.state.region){
                        return (
                          item.province.map((item_prov)=>{
                            return(
                              item_prov.comuni.map((item_comuni)=>{
                                this.state.city_code = item_comuni.code
                                return(
                                  <Picker.Item label = {item_comuni.nome} value={item_comuni.nome} key={item_comuni.code} />
                                )
                              })
                            );
                          })
                        )
                      }
                    }
                      /* return(
                        <Picker.Item  label={item.nome} value={item.nome} key={item.nome}/> 
                      ); */
                    )
                  }
                  </Picker> : null
                }
           </View> : null
            }
            </View>
         )
      }
   }
   
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       flexDirection:'column',
       backgroundColor: colors.green01
     },
     pickerstyle:{
      height:30, 
      width: 150, 
      backgroundColor: 'white',
      borderRadius:10
     }
   })