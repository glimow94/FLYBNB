import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Platform, Modal, Dimensions } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import colors from '../style/colors';
import ConfirmButton from '../components/buttons/confirmButton';
import CalendarButton from '../components/buttons/Button1';
import dateConverter from '../components/dateConverter';

//fattore di scala per il calendario responsive
var scaleFactor = 450;
Platform.OS === 'android' ? scaleFactor = Dimensions.get('window').width : null

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
      disabledDates:[],//date da disabilitare
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
    /* trasformo la data in formato date in una stringa del tipo DD-MM-YYYY */
    var dateString = dateConverter(date),
        diffDays = '', //variabile che conterrà il numero di giorni fra il checkin e il checkout utile a calcolare il prezzo totale
        cityTax= 0,
        totalPrice= 0;

    if (type === 'END_DATE') {
      diffDays = parseInt((date - this.state.selectedStartDateOriginal) / (1000 * 60 * 60 * 24), 10);
      totalPrice = this.props.price*diffDays + (this.props.city.length/2)*diffDays;
      cityTax = (this.props.city.length/2)*diffDays;
      this.setState({
        selectedEndDate: dateString,
        status: false
      });
      this.props.updateState({
        checkOut: dateString,
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
          selectedStartDate: dateString,
          selectedEndDate: null,
          selectedStartDateOriginal: date,
          maxRange : maxRange,
        });
        this.props.updateState({
          checkIn: dateString
        })
      }
      else{
        var checkOut = new Date(date);
        checkOut.setDate(checkOut.getDate()+1);
        var checkOutString = dateConverter(checkOut);
        diffDays = 1;
        totalPrice = this.props.price*diffDays + (this.props.city.length/2)*diffDays;
        cityTax = (this.props.city.length/2)*diffDays;
        this.setState({
          selectedStartDate: dateString,
          selectedStartDateOriginal: date,
          selectedEndDate: checkOutString,
          maxRange:1,
        })
        this.props.updateState({
          checkIn: dateString,
          checkOut: checkOutString,
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
          <CalendarButton text="Date" onPress={this.showHideCalendar} backgroundColor={colors.white} borderColor={colors.secondary}></CalendarButton>
        </View>
        
        
        {   
          this.state.status ? 
          <Modal 
            style={styles.container}
            animationType = "slide"
            presentationStyle="pageSheet"
          >
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
                selectedDayColor={colors.blue}
                selectedDayTextColor="#000000"
                scaleFactor={scaleFactor}
                textStyle={{
                    color: '#000000',
                }}
                onDateChange={this.onDateChange}
            />
            <View style={{alignContent:'center',alignItems:'center',margin:20}}>
              <ConfirmButton text="OK" onPress={this.showHideCalendar}></ConfirmButton>
            </View>
          </Modal> : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    alignSelf:'center',
    alignContent:'center',
    padding:20,
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