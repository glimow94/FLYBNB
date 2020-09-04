import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker, TextInput } from 'react-native';
import { CheckBox } from 'react-native-elements'
import colors from '../style/colors';
import ConfirmButton from '../components/buttons/confirmButton';
import FilterButton from '../components/buttons/Button1'

//Questo componente è costituito da una serie di CheckBox che permettono d selezionare i filtri di ricerca relativi
//ai servizi.
//Le variabili booleane che si attivano (diventando TRUE in caso di attivazione del filtro) sono salvate
//nella classe madre Home, in modo tale da poter essere passate al componente "StructureList" che filtrerà i risultati

export default class DateSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {  
     
    };

  }
  updateState(data){
      this.props.updateState(data)
  }
  

  showHide=()=>{
      if(this.props.status4==true){
          this.updateState({status4:false})
      }
      else{
          this.updateState({
              status4:true,
              status3:false,
              status1:false,
              status2:false
            })
      }
  }


/*   changeCheck=()=>{
      if(this.state.checked==true){
          this.setState({
              checked:false
          })
      }
      else{
          this.setState({
              checked:true
          })
      }
  } */
 

  render() {

    return (
      <View>
        <FilterButton text="Struttura" onPress={this.showHide}></FilterButton>
        
        {   
          this.props.status4 ? 
          <View style={styles.wrapper}>
            <View style={styles.container}>
                <Text style={[{width:150},styles.label]}>TIPO</Text>
                        <View style={styles.typePicker}>
                            <Picker
                                mode="dropdown" 
                                style={styles.pickerstyle}
                                selectedValue={this.props.type}           
                                onValueChange={val => this.updateState({ type: val})}>
                                <Picker.Item label='Qualsiasi' value ={'Qualsiasi'}></Picker.Item>
                                <Picker.Item label='B&B' value ={'B&B'}></Picker.Item>
                                <Picker.Item label='Casa Vacanze' value ={'Casa Vacanze'}></Picker.Item>
                                
                            </Picker>
                                    
                        </View>
                        <Text style={[{width:150, color: this.state.capColor},styles.label]}>POSTI LETTO</Text>
                        <View style={styles.priceField}>
                            <TextInput
                                underlineColorAndroid='transparent'  
                                defaultValue={this.props.beds}
                                keyboardType={'numeric'}
                                autoCorrect={false}
                                style = {[{width: 100}]}
                                onChangeText={val => this.updateState({beds:val})}
                            ></TextInput>
                        </View>
                    
                        <View style={styles.confirmButton}>
                            <ConfirmButton text='OK' onPress={this.showHide} ></ConfirmButton>           
                        </View>
            </View>
        </View>
          : null
        }
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        marginBottom: 400,
    },
  container: {
    position:'absolute',
    width:200,
    height:200,
    top:1,
    backgroundColor: colors.white,
    borderRadius:20,
    borderWidth:2,
    borderColor: colors.black,
    shadowColor: colors.black,
    padding: 10

  },
 confirmButton:{
    flexDirection:'row',
    justifyContent:'center',
    padding:15
 },
 label:{
     fontSize: 14,
    fontWeight:"700"
 },
 typePicker:{
     margin: 10
 },
 priceField:{
     margin:10
 }

});