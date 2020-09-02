import React, { Component, useCallback } from 'react';
import { StyleSheet, Text, View, Button , Picker ,Dimensions} from 'react-native';
import colors from '../style/colors';
import CityButton from "../components/buttons/Button1"
import DropDownPicker from 'react-native-dropdown-picker';
import data from "../components/regioni_province_comuni";
import comuni from '../components/comuni'
import db from '../components/database_region_city'
import ConfirmButton from './buttons/confirmButton';

const {width} = Dimensions.get('window');

export default class CitySelector extends Component{
    constructor(props) {
        super(props);
        this.state = {
          //set del valore di inizio e fine data
          region: 'Regione',
          province: 'seleziona provincia',
          province_code: '',
          city_code: '',
          // status(1/2/3) è il valore che rende visibile/invisibile il menu delle regioni,province o città
          status1: false,
          status3: false,
          status2: false,
          marginTop: 5,
          bottom: 20,
          width: null,
          pickerWidth: 250
        };
    }
    updateCity(data){
      this.props.updateState(data)
      this.setState({
        status3: false,
        status2:false,
      })
    }
    setRegion(item){
        this.setState({
            region: item.value
        })
        this.showProvinces
    }
    showHide=()=>{
        if(this.props.status1==true){
            this.props.updateState({status1:false})
        }
        else{
            this.props.updateState({status1:true,status2:false,status3:false})
        }
        if(this.props.parentType=='Home'){//se dalla home clicco sul filtro del luogo, cambio lo stile
          this.setState({
            marginTop: 20,
            bottom: 0,
            width: 108,
            pickerWidth: 120
          })
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
            <View>
              { this.props.parentType == 'AddStructure' ?
                <Text style={styles.alternativeCityButton} onPress={this.showHide}>{this.props.city.substring(0,20)}</Text>
                 : <CityButton text={this.props.city.substring(0,9)} onPress={this.showHide}></CityButton> }

              <View style={[{marginTop: this.state.marginTop, position: this.state.position, bottom: this.state.bottom, width: this.state.width},styles.container]}>
            { this.props.status1 ?
              <View>
                <View style={{flexDirection:'row'}}>
                  <Picker mode="dropdown" 
                      style={[{width:this.state.pickerWidth},styles.pickerstyle]}                  
                      onValueChange={itemValue => this.setState({
                                                    region: itemValue,
                                                    province: 'Provincia',
                                                    city:'Comune',
                                                    status2: true
                                                  })
                      }     

                  >
                    <Picker.Item label={this.state.region} value ={this.state.region}></Picker.Item>

                    {
                      db.map((item) =>{
                        return(
                          <Picker.Item  label={item.nome} value={item.nome} key={item.nome}/> 
                        );
                      })
                    }
                  </Picker>{this.props.parentType=='AddStructure'?<Text style={styles.cancelButton} onPress={this.showHide}>X</Text>: null}
                </View>
                {
                  this.state.status2 ? 
                  <Picker 
                    mode="dropdown" 
                    style={[{width:this.state.pickerWidth},styles.pickerstyle]}
                    onValueChange={
                      itemValue => this.setState({
                      province: itemValue,
                      city:'Comune',
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
                    style={[{width:this.state.pickerWidth},styles.pickerstyle]}
                    onValueChange={itemValue => this.updateCity({
                      city:itemValue,
                      status1:false
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
            </View>
         )
      }
   }
   
   const styles = StyleSheet.create({
     container: {
       flexDirection:'column',
     },
     cancelButton:{
       width:'50'
     },
     alternativeCityButton:{
      width: 200,
      borderBottomWidth: 1,
      height: 19,
      marginTop: 15,
      borderBottomColor: colors.white
     },
     cancelButton:{
      color:colors.red,
      fontSize: 18,
      fontWeight: "700"  
     }
   })