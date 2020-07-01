import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Modal } from 'react-native';
import { CheckBox } from 'react-native-elements'
import CalendarPicker from 'react-native-calendar-picker';
import colors from '../style/colors';
import ConfirmButton from '../components/buttons/confirmButton';
import FilterButton from '../components/buttons/Button1'
//definisco la funzione 'changeDateFormat' per convertire una stringa di data 
// da "Day Mon DayNumber Year" in "DD-MM-YYYY"

export default class DateSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {  

      //set del valore di inizio e fine data
      selectedStartDate: null,
      selectedEndDate: null,
      // status è il valore che rende visibile/invisibile il calendario
      status: false,
      modalVisible: false,
      kitchenCheck: false,
      fullBoardCheck: false,
      airConditionerCheck:false,
      wifiCheck:false,
      parkingCheck:false
    };


  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  showHide=()=>{
      if(this.state.status==true){
          this.setState({status:false})
      }
      else{
          this.setState({status:true})
      }
  }


  changeCheck=()=>{
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
  }
  changeFullBoardCheck=()=>{
    if(this.state.fullBoardCheck==true){
        this.setState({
            fullBoardCheck:false
        })
    }
    else{
        this.setState({
            fullBoardCheck:true
        })
    }
  }

  changeAirConditionerCheck=()=>{
    if(this.state.airConditionerCheck==true){
        this.setState({
            airConditionerCheck:false
        })
    }
    else{
        this.setState({
            airConditionerCheck:true
        })
    }
  }
  changeKitchenCheck=()=>{
    if(this.state.kitchenCheck==true){
        this.setState({
            kitchenCheck:false
        })
    }
    else{
        this.setState({
            kitchenCheck:true
        })
    }
  }  
  changeWifiCheck=()=>{
    if(this.state.wifiCheck==true){
        this.setState({
            wifiCheck:false
        })
    }
    else{
        this.setState({
            wifiCheck:true
        })
    }
  }  
  changeParkingCheck=()=>{
    if(this.state.parkingCheck==true){
        this.setState({
            parkingCheck:false
        })
    }
    else{
        this.setState({
            parkingCheck:true
        })
    }
  }    
  

  render() {

    return (
      <View>
        <FilterButton text="Servizi" onPress={this.showHide}></FilterButton>
        
        {   
          this.state.status ? 
          <View style={styles.wrapper}>
            <View style={styles.container}>
                <CheckBox
                    style={styles.checkBox}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    title='Colazione inclusa'
                    checked={this.state.fullBoardCheck}
                    onPress={this.changeFullBoardCheck}
                    size='300'
                />
                <CheckBox
                    style={styles.checkBox}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    title='Cucina'
                    checked={this.state.kitchenCheck}
                    onPress={this.changeKitchenCheck}
                    size='300'
                />
                <CheckBox
                    style={styles.checkBox}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    title='Aria condizionata'
                    checked={this.state.airConditionerCheck}
                    onPress={this.changeAirConditionerCheck}
                    size='300'
                />
                <CheckBox
                    containerStyle={styles.checkBox}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    title='Wi-Fi'
                    checked={this.state.wifiCheck}
                    onPress={this.changeWifiCheck}
                    size='300'
                />
                <CheckBox
                    style={styles.checkBox}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    title='Parcheggio Auto'
                    checked={this.state.parkingCheck}
                    onPress={this.changeParkingCheck}
                    size='300'
                    width='150'
                />                
            </View>
        </View>
          : null
        }
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'column',
    position:'absolute',
    justifyContent:'left',
    width:300,
    height:300,
    top:50,
    right: 10,
    backgroundColor: colors.white,
    borderRadius:20

  },
  checkBox:{
      width:190
  },
});