
import React from 'react';
import { StyleSheet, View, Picker, } from 'react-native';

export default class BirthdayPicker extends React.Component {
  static defaultProps= {
    selectedYear:   (new Date()).getFullYear(),     // Year to initialize the picker to (set to 0 to not have a year)
    selectedMonth:  (new Date()).getMonth(),        // Month to initialize the picker to
    selectedDay:    (new Date()).getDate(),         // Day to initailize the picker to
    yearsBack:      100,                            // How many years backwards (from starting year) you want to show

    onYearValueChange: function(year, idx) { },     // Function called when year changes
    onMonthValueChange: function(month, idx) { },   // Function called when month changes
    onDayValueChange: function(day, idx) { },       // Function called when day changes
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

  // Returns the number of days in the given month...
  getNumDaysInMonth(year, month) {
    // February is the only month that can change, so if there's no year, assume it has the maximum (29) days...
    return (year == 0 && month == 1) ? 29 : (new Date(year, month + 1, 0).getDate());
  }

  // Returns the <Picker.Item> values for the years...
  renderYearPickerItems() {
    // If year was 0, change it to current...
    var currentYear = (new Date()).getFullYear();
    var centerYear = this.startingYear;
    if (centerYear === 0) { centerYear = currentYear; }

    // Set starting and ending years...
    var startYear = centerYear - this.props.yearsBack;
    var endYear = currentYear;

    var years = [];
    for (var i = startYear; i <= endYear; i++) {
      years.push(<Picker.Item label={i.toString()} value={i} key={i} />);
    }
    years.push(<Picker.Item label="----" value={0} key={0} />);
    return years;
  }

  // Returns the <Picker.Item> values for the months...
  renderMonthPickerItems() {
    var months = this.getMonthNames();
    return months.map(function(month, index) {
      var val = ''
      if(index <=9){
        val = '0'+(index+1).toString()
      }
      else val = (index+1).toString()
      
      return <Picker.Item label={month} value={val} key={index} />;
    });
  }

  // Returns the <Picker.Item> values for the days (based on current month/year)...
  renderDayPickerItems() {
    // February is the only day that can change, so if there's no year, assume it has the maximum (29) days...
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

  // Occurs when year value changes...
  onYearChange = (value, index) => {
    // Check if days are valid...
    var maxDays = this.getNumDaysInMonth(value, this.state.month);
    var day = (this.state.day > maxDays) ? maxDays : this.state.day;

    this.setState({ year: value, day: day });
    this.props.onYearValueChange(value.toString(), index);
  }

  // Occurs when month value changes...
  onMonthChange = (value, index) => {
    // Check if days are valid...
    var maxDays = this.getNumDaysInMonth(this.state.year, value);
    var day = (this.state.day > maxDays) ? maxDays : this.state.day;

    this.setState({ month: value, day: day });
    this.props.onMonthValueChange(value.toString(), index);
  }

  // Occurs when day value changes...
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