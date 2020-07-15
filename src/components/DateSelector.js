import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import colors from '../style/colors';
import ConfirmButton from '../components/buttons/confirmButton';
import CalendarButton from '../components/buttons/Button1'
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
      status2:true,
    };
    this.onDateChange = this.onDateChange.bind(this);

  }
//callback per comunicare con gli altri pulsanti in modo da chiuderli una volta aperto questo
  
  showHideCalendar=()=>{
      if(this.state.status==true){
          this.setState({
            status:false,
            status2:true
          })
      }
      else{
          this.setState({
            status:true,
            status2:false
          })
      }
  }

  showHideText=()=>{

  }

  onDateChange(date, type) {
    //function to handle the date change 
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: date,
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
      });
    }
  }

  
  

  render() {
    const { selectedStartDate, selectedEndDate } = this.state;
    const minDate = new Date(); // Min date
    const maxDate = new Date(2050, 6, 3); // Max date
    const startDate = selectedStartDate ? selectedStartDate.toString().replace("12:00:00 GMT+0200","").slice(4) : ''; //Start date
    const endDate = selectedEndDate ? selectedEndDate.toString().replace("12:00:00 GMT+0200","").slice(4) : ''; //End date

    return (
      <View>
        <CalendarButton text="Date" onPress={this.showHideCalendar}></CalendarButton>
        
        {   
          this.state.status ? 
          <View style={styles.container}>
            <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                minDate={minDate}
                maxDate={maxDate}
                weekdays={['Lun.','Mar.','Mer.','Gio.','Ven.','Sab.','Dom.',]}
                months={[
                    'Gennaio',
                    'Febbraio',
                    'Marzo',
                    'Aprile',
                    'Maggio',
                    'Giugno',
                    'Luglio',
                    'Agosto',
                    'Settembre',
                    'Ottobre',
                    'Novembre',
                    'Dicembre']}
                previousTitle="<"
                nextTitle=">"
                todayBackgroundColor="#e6ffe6"
                selectedDayColor="#FF6347"
                selectedDayTextColor="#000000"
                scaleFactor={450}
                textStyle={{
                    color: '#000000',
                }}
                onDateChange={this.onDateChange}
            />
            <ConfirmButton text="OK" onPress={this.showHideCalendar}></ConfirmButton>
          </View> : null
        }
        
        {
        
           this.state.status2 ?   <View style={styles.checkInOutText}>
                <Text style={{padding:6}}>Check-In:</Text>
                <Text style={{padding:0, color: colors.white, fontSize:16}}>{startDate}</Text>
                <Text style={{padding:6}}>Check-Out: </Text>
                <Text style={{padding:0, color: colors.white, fontSize:16}}>{endDate}</Text>
              </View>:null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height:'100%',
    alignItems: 'center',
    alignSelf:'center',
    alignContent:'center',
    bottom: 300

  },
  checkInOutText:{
    position: 'relative',
    flexDirection:'row',
    alignContent:'center',
    alignItems:'center',
    padding:5,
    
  }
});