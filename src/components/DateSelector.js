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
      disabledDates:[],
      index:'',
      
    };
    this.onDateChange = this.onDateChange.bind(this);

  }
//callback per comunicare con gli altri pulsanti in modo da chiuderli una volta aperto questo
  
  showHideCalendar=()=>{
    var dates = this.props.disabledDates
    this.setState({
      disabledDates:dates
    })
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
    var index = months.indexOf(monthname);
    
    //aggiungo lo 0 prima del numero del mese se questo è < 10, ovvero 1 diventa 01, 2 diventa 02, ecc.ecc.
    if(index+1 < 10 && index != -1){
      index = index +1;
      var month = '0'+index.toString()
      return month
    }
    else {
      return index!=-1 ? index+1 : undefined;
    }
  }
  
  //funzione che calcola il range massimo di selezione delle date a partire dalla scelta della data iniziale(check-in) sul calendario
  rangeDates(start_date){
    //incrementa il giorno del check-in controllando se questo è presente nella lista delle date penotate per quella struttura, cosi trova il range massimo di prenotazione
    var disabledDates = this.state.disabledDates;//date occupate
    var range = 0; 
    for(var i = 0; i < 28; i++){
      var nextDay = new Date(start_date);
      nextDay.setHours(0,0,0,0)
      nextDay.setDate(nextDay.getDate()+i)
      
      //vogliamo controllare se nextday incrementato ogni volta sia presente nell'array di oggetti Date disabilitate
      //serializziamo gli oggetti Date in modo da poter usare la funzione indexOf degli array js
      var indexDate = disabledDates.map(Number).indexOf(+nextDay) //vedo se esiste l'elemento nell'array di date non selezionabili, e salvo l'eventuale indice

      if( indexDate != -1) {
        break; //quando trova la prima data che è fra le occupate allora smette di incrementare il range
      }
      else range = range + 1;
    }
    /* new_dates.splice(indexDate) */
    /* this.setState({
      disabledDates:new_dates,
    }) */
    
    return range
  }
  onDateChange(date, type) {
    var date_mod = date.toString().replace("12:00:00 GMT+0200","").slice(4);
    var month_num = this.monthNameToNum(date_mod.substr(0,3));
    
    var date_mod_format = date_mod.substr(4,2)+"/"+month_num+"/"+date_mod.substr(6,5); //data in formato DD/MonthName/AAAA

    var final_date = date_mod_format.replace(/ /g, '');
    var diffDays = ''; //variabile che conterrà il numero di giorni fra il checkin e il checkout utile a calcolare il prezzo totale
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
      //una volta trovato il range,per consentire di cliccare sul checkout 
      //allora setto le date disabilitate del calendario a [] cioè nessuna data disabilitata 
      //in modo da far cliccare sul checkout che non era cliccabile perchè check-in di un 'altra prenotazione, questo ci consente di evitare di avere notti non prenotabili
      this.setState({
        disabledDates : []
      })
      if(maxRange > 1){  
          this.setState({
          selectedStartDate: final_date,
          selectedEndDate: null,
          selectedStartDateOriginal: date,
          maxRange : maxRange,
        });
        this.props.updateState({
          checkIn: final_date
        })
      }
      else{
        var checkOut = new Date(date);
        checkOut.setDate(checkOut.getDate()+1);
        var checkOut_mod = checkOut.toString().replace("12:00:00 GMT+0200","").slice(4);
        var monthCheckout_num = this.monthNameToNum(checkOut_mod.substr(0,3));
        var checkOut_mod_format = checkOut_mod.substr(4,2)+"/"+monthCheckout_num+"/"+checkOut_mod.substr(6,5); //data in formato DD/MonthName/AAAA
        
        var final_checkOut = checkOut_mod_format.replace(/ /g, '');

        var diffDays = 1;
        totalPrice = this.props.price*diffDays + (this.props.city.length/2)*diffDays;
        cityTax = (this.props.city.length/2)*diffDays;
        this.setState({
          selectedStartDate: final_date,
          selectedEndDate: final_checkOut,
          maxRange:1,
        })
        this.props.updateState({
          checkIn:final_date,
          checkOut: final_checkOut,
          diffDays: diffDays,
          totPrice: totalPrice,
          cityTax: cityTax,
        })
      }
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
          <CalendarButton text="Date" onPress={this.showHideCalendar} backgroundColor={colors.green01}></CalendarButton>
        </View>
        
        
        {   
          this.state.status ? 
          <View style={styles.container}>
            <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                maxRangeDuration={this.state.maxRange}
                disabledDates={this.state.disabledDates}
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