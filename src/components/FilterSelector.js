import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
      if(this.props.status3==true){
          this.updateState({status3:false})
      }
      else{
          this.updateState({
              status3:true,
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
        <FilterButton text="Servizi" onPress={this.showHide}></FilterButton>
        
        {   
          this.props.status3 ? 
          <View style={styles.wrapper}>
            <View style={styles.container}>
                <CheckBox
                    style={styles.checkBox}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    title='Colazione inclusa'
                    checked={this.props.fullBoard}
                    onPress={()=>{
                        this.props.fullBoard==false ? this.updateState({fullBoard: true}) : this.updateState({fullBoard: false})
                     }}
                    
                />
                <CheckBox
                    style={styles.checkBox}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    title='Cucina'
                    checked={this.props.kitchen}
                    onPress={()=>{
                        this.props.kitchen==false ? this.updateState({kitchen: true}) : this.updateState({kitchen: false})
                    }}
                    
                />
                <CheckBox
                    style={styles.checkBox}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    title='Aria condizionata'
                    checked={this.props.airConditioner}
                    onPress={()=>{
                        this.props.airConditioner==false ? this.updateState({airConditioner: true}) : this.updateState({airConditioner: false})
                     }}
                    
                />
                <CheckBox
                    containerStyle={styles.checkBox}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    title='Wi-Fi'
                    checked={this.props.wifi}
                    onPress={()=>{
                        this.props.wifi==false ? this.updateState({wifi: true}) : this.updateState({wifi: false})
                     }}
                   
                />
                <CheckBox
                    style={styles.checkBox}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    title='Parcheggio Auto'
                    checked={this.props.parking}
                    onPress={()=>{
                        this.props.parking==false ? this.updateState({parking: true}) : this.updateState({parking: false})
                     }}
                />
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
        marginBottom: 325,
        marginTop: 20
    },
  container: {
    flexDirection:'column',
    position:'absolute',
    width:300,
    height:340,
    top:1,
    right: 10,
    backgroundColor: colors.white,
    borderRadius:20,
    borderWidth:2,
    borderColor: colors.black,
    shadowColor: colors.black,
    
    

  },
 confirmButton:{
    flexDirection:'row',
    justifyContent:'center',
    padding:15
 }

});