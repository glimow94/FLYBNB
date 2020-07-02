import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements'
import colors from '../style/colors';
import ConfirmButton from '../components/buttons/confirmButton';
import FilterButton from '../components/buttons/Button1'

//definisco la funzione 'changeDateFormat' per convertire una stringa di data 
// da "Day Mon DayNumber Year" in "DD-MM-YYYY"

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
                    checked={this.props.fullBoard}
                    onPress={()=>{
                        this.props.fullBoard==false ? this.updateState({fullBoard: true}) : this.updateState({fullBoard: false})
                     }}
                    size='300'
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
                    size='300'
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
                    size='300'
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
                    size='300'
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
                    size='300'
                    width='150'
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
  
    },
  container: {
    flexDirection:'column',
    position:'absolute',
    justifyContent:'left',
    width:300,
    height:300,
    top:1,
    right: 10,
    backgroundColor: colors.white,
    borderRadius:20,
    borderWidth:2,
    borderColor: colors.black
    

  },
 confirmButton:{
    flexDirection:'row',
    justifyContent:'center',
    padding:15
 }

});