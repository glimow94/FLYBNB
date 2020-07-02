import React, { Component, useCallback } from 'react';
import { StyleSheet, Text, View, Button , Picker } from 'react-native';
import colors from '../style/colors';
import CityButton from "../components/buttons/Button1"
import DropDownPicker from 'react-native-dropdown-picker';
import data from "../components/regioni_province_comuni";
import comuni from '../components/comuni'
import db from '../components/database_region_city'
import ConfirmButton from './buttons/confirmButton';


export default class CitySelector extends Component{
    constructor(props) {
        super(props);
        this.state = {
          //set del valore di inizio e fine data
          region: 'Luogo',
          province: 'seleziona provincia',
          province_code: 'Pa',
          city_code: '',
          // status è il valore che rende visibile/invisibile il menu delle citta
          status: false,
          status2: false,
        };
    }
    updateCity(data){
      this.props.updateCity(data)
      this.setState({
        status3: false,
        status2:false,
        status:false
      })
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
              <CityButton text={this.props.city.substring(0,9)} onPress={this.showHide}></CityButton>
            { this.state.status ?
              <View>
                <Picker mode="dropdown" 
                    style={styles.pickerstyle}                  
                    onValueChange={itemValue => this.setState({
                    region: itemValue,
                    province: 'seleziona provincia',
                    city:'seleziona comune',
                    status2: true
                    })}

                >
                  <Picker.Item label={this.state.region} value ={this.state.region}></Picker.Item>

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
                      city:'seleziona comune',
                      status3: true
                    })}
                  >
                  <Picker.Item label={this.state.province} value ={this.state.province}></Picker.Item>
                  
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
                    onValueChange={itemValue => this.updateCity({
                      city:itemValue
                    })}
                  >
                  <Picker.Item label={this.state.city} value ={this.state.city_code}></Picker.Item>

                  {
                    db.map((item) =>{
                      if(item.nome == this.state.region){
                        return (
                          item.province.map((item_prov)=>{
                            if(item_prov.nome==this.state.province){
                              return(
                                item_prov.comuni.map((item_comuni)=>{
                                  this.state.city_code = item_comuni.code
                                  return(
                                  <Picker.Item label = {item_comuni.nome} value={item_comuni.nome} key={item_comuni.code} />
                                )
                              })
                            );}
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
       flexDirection:'column',
       backgroundColor: colors.green01,
       width: 108
     },
     pickerstyle:{
      height:30, 
      width: 140, 
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius:10,
      borderWidth:2,
      borderColor: colors.black
     }
   })