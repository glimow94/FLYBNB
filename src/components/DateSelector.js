import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import colors from '../style/colors';
import ConfirmButton from '../components/buttons/confirmButton';
import CalendarButton from '../components/buttons/Button1'
//definisco la funzione 'changeDateFormat' per convertire una stringa di data 
// da "Day Mon DayNumber Year" in "DD-MM-YYYY"
var months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May',
  'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec'
]; //mesi dell'anno che mi servono per convertire il mese della data nel suo corrispondente numero MM

export default class DateSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //set del valore di inizio e fine data
      selectedStartDate: null,
      selectedEndDate: null,
      selectedStartDateOriginal : null,
      // status è il valore che rende visibile/invisibile il calendario
      status: false,
      status2:true,
      maxRange: 28,
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

  monthNameToNum(monthname) {
    var month = months.indexOf(monthname);
    return month!=-1 ? month + 1 : undefined;
}
  //funzione che calcola il range massimo di selezione delle date a partire dalla scelta della data iniziale(check-in) sul calendario
  rangeDates(start_date){
    //incrementa il giorno del check-in controllando se questo è presente nella lista delle date penotate per quella struttura, cosi trova il range massimo di prenotazione
    var disabledDates = this.props.disabledDates;//date occupate
    var range = 0; 
    for(var i = 0; i < 28; i++){
      var nextDay = new Date(start_date);
      nextDay.setHours(0,0,0,0)
      nextDay.setDate(nextDay.getDate()+i)
      console.log(nextDay);
      console.log(disabledDates)
      //vogliamo controllare se nextday incrementato ogni volta sia presente nell'array di oggetti Date disabilitate
      //serializziamo gli oggetti Date in modo da poter usare la funzione indexOf degli array js
      if(disabledDates.map(Number).indexOf(+nextDay) != -1) break;
      else range = range + 1;
    }
    console.log(range)
    return range
  }
  onDateChange(date, type) {
    var date_mod = date.toString().replace("12:00:00 GMT+0200","").slice(4);
    var month_num = this.monthNameToNum(date_mod.substr(0,3));
    var date_mod_format = date_mod.substr(4,2)+"/"+month_num+"/"+date_mod.substr(6,5); //data in formato DD/MonthName/AAAA
    //function to handle the date change 
    var final_date = date_mod_format.replace(/ /g, '');
    var diffDays = ''; //variabile che conterrà i giorni fra il checkin e il checkout utile a calcolare il prezzo totale
    var cityTax= 0;
    var totalPrice= 0;

    if (type === 'END_DATE') {
      diffDays = parseInt((date - this.state.selectedStartDateOriginal) / (1000 * 60 * 60 * 24), 10);
      totalPrice = this.props.price*diffDays + (this.props.city.length/2)*diffDays;
      cityTax = (this.props.city.length/2)*diffDays;
      this.setState({
        selectedEndDate: final_date,
        status: false
      });
      this.props.updateState({
        checkOut: final_date,
        diffDays: diffDays,
        totPrice: totalPrice,
        cityTax: cityTax
      })

    } else {
      var maxRange = this.rangeDates(date)//calcolo il range massimo di date che l'utente può selezionare (da quella selezionata all'ultima disponibile in sequenza...)
      this.setState({
        selectedStartDate: final_date,
        selectedEndDate: null,
        selectedStartDateOriginal: date,
        maxRange : maxRange
      });
      this.props.updateState({
        checkIn: final_date
      })
    }
  }

  
  

  render() {
    const { selectedStartDate, selectedEndDate } = this.state;
    const minDate = new Date(); // Min date
    const maxDate = new Date(2050, 6, 3); // Max date
    const startDate = selectedStartDate ? selectedStartDate: ''; //Start date
    const endDate = selectedEndDate ? selectedEndDate : ''; //End date

    return (
      <View>
        <View style={{alignContent:'center', alignItems:'center'}}>
          <CalendarButton text="Date" onPress={this.showHideCalendar}></CalendarButton>
        </View>
        
        
        {   
          this.state.status ? 
          <View style={styles.container}>
            <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                maxRangeDuration={this.state.maxRange}
                disabledDates={this.props.disabledDates}
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
    bottom: 100

  },
  checkInOutText:{
    position: 'relative',
    flexDirection:'row',
    alignContent:'center',
    alignItems:'center',
    padding:5,
    
  }
});