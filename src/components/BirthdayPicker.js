
import React from 'react';
import { StyleSheet, View, Picker, } from 'react-native';

export default class BirthdayPicker extends React.Component {
  static defaultProps= {
    //inizializzazione giorno/mese/anno
    selectedYear:   (new Date()).getFullYear(),     
    selectedMonth:  (new Date()).getMonth(),      
    selectedDay:    (new Date()).getDate(),         
    yearsBack:      100,                            //numero di anni da visualizzare rispettto alla datai iniziale 

    onYearValueChange: function(year, idx) { },     
    onMonthValueChange: function(month, idx) { },   
    onDayValueChange: function(day, idx) { },       
  }

  constructor(props) {
    super(props);

    this.startingYear = this.props.selectedYear;
    this.state = {
      year:     this.props.selectedYear,
      month:    this.props.selectedMonth, 
      day:      this.props.selectedDay,
    }
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({
      year: nextProps.selectedYear, month: nextProps.selectedMonth, day: nextProps.selectedDay
    });
  }

  

  // Loops through the months and gets the long name string...
  getMonthNames() {
    
    var monthNames = [
        /* "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre" */
    ];
    for(var i = 1; i < 13;i++){ //uso i numeri al posto dei nomi dei mesi
        monthNames.push(`${i}`)
    }
    return monthNames
  }

  // Ritorna il numero di giorni in base al mese
  getNumDaysInMonth(year, month) {
    return (year == 0 && month == 1) ? 29 : (new Date(year, month + 1, 0).getDate());
  }

  
  renderYearPickerItems() {
    
    var currentYear = (new Date()).getFullYear();
    var centerYear = this.startingYear;
    if (centerYear === 0) { centerYear = currentYear; }

 
    var startYear = centerYear - this.props.yearsBack;
    var endYear = currentYear;

    var years = [];
    for (var i = startYear; i <= endYear; i++) {
      years.push(<Picker.Item label={i.toString()} value={i.toString()} key={i} />);
    }
    years.push(<Picker.Item label="----" value={0} key={0} />);
    return years;
  }

  // <Picker.Item> per i mesi...
  renderMonthPickerItems() {
    var months = this.getMonthNames();
    return months.map(function(month, index) {
      var val = ''
      if(index <=9){
        val = '0'+(index+1).toString()//aggiungo lo 0 prima dei mesi ad una sola cifra per standrdizzare il formato delle date
      }
      else val = (index+1).toString()
      
      return <Picker.Item label={month} value={val} key={index} />;
    });
  }

  // Ritorna i <Picker.Item> dei giorni basato sui valori month e days...
  renderDayPickerItems() {
    var numDays = this.getNumDaysInMonth(this.state.year, this.state.month);
    
    var days = [];
    for (var i = 1; i <= numDays; i++) {
      if(i <= 9){
        var val = '0'+i.toString()
        days.push(<Picker.Item label={i.toString()} value={val} key={i} />);
      }
      else days.push(<Picker.Item label={i.toString()} value={i.toString()} key={i} />);
        
    }
    return days;
  }

  onYearChange = (value, index) => {
    var maxDays = this.getNumDaysInMonth(value, this.state.month);
    var day = (this.state.day > maxDays) ? maxDays : this.state.day;

    this.setState({ year: value, day: day });
    this.props.onYearValueChange(value, index);
  }

  onMonthChange = (value, index) => {
    var maxDays = this.getNumDaysInMonth(this.state.year, value);
    var day = (this.state.day > maxDays) ? maxDays : this.state.day;

    this.setState({ month: value, day: day });
    this.props.onMonthValueChange(value.toString(), index);
  }

  onDayChange = (value, index) => {
    this.setState({ day: value });
    this.props.onDayValueChange(value.toString(), index);
  }

  render() {
    return (
       
      <View style={styles.container}>
        <Picker 
            style={styles.Picker} 
            selectedValue={this.state.day} 
            onValueChange={this.onDayChange}>
            {this.renderDayPickerItems()}
        </Picker> 
        <Picker 
            style={styles.Picker} 
            selectedValue={this.state.month} 
            onValueChange={this.onMonthChange}>
            {this.renderMonthPickerItems()}
        </Picker>

        <Picker 
            style={styles.Picker} 
            selectedValue={this.state.year} 
            onValueChange={this.onYearChange}>
            {this.renderYearPickerItems()}
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:    { flexDirection: "row", },
  Picker:{
    width:110,
    height: 40,
    marginTop:5,
    marginBottom:5,
  }
});