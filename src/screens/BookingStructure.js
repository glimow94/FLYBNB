import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import colors from '../style/colors/index';
import DateSelector from '../components/DateSelector';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import axios from "axios";
import moment from "moment"


export default class BookingStructure extends Component{
  constructor(props){
    super(props);
    this.state={
      user_id: '',
      title: '',
      clientMail: '',
      ownerMail: '',
      owner_id: '',
      structure_id: '',
      checkIn: '',
      checkOut: '',
      city: '',
      street: '',
      price: '',
      totPrice: '',
      cityTax: '',
      request: '',
      beds: '',
      diffDays: 0,
      //alert se si preme conferma senza aver selezionato le date
      alert: false,
      dates: [],
      disabledDates: [],
      disabledDatesStrings:[],
      datesError: false
    }
  }
  
  updateState(filterStatus){
    this.setState(filterStatus);
  }
  //restituisce array di oggetti Date che comprendono le date fra il check in e il checkout per poi oscurarle nel selettore delle date di soggiorno
  getDateRange(start, end, dateFormat,type) {
        //se type = 1 restituisce le date in formato array di Oggetti Data
        //altrimenti restituisce le date in formato stringa DD-MM-YYYY
        var dates = [],
            dates_objs = [],
            startDate = moment(start, dateFormat),
            endDate = moment(end,dateFormat),
            diff = endDate.diff(startDate, 'days');
        if(!startDate.isValid() || !endDate.isValid() || diff <= 0) {
            return;
        }

        for(var i = 0; i < diff; i++) {
            dates.push(endDate.subtract(1,'d').format(dateFormat));
        }
        //creo l'array di oggetti Date, convertendo il formato da DD-MM-YYYY ad MM-DD-YYYY
        if(type == 1){
          for(var i = 0; i < diff ; i++){
            console.log(dates[i])
            var month = dates[i].substring(3,5);
            var day = dates[i].substring(0,2);
            var year = dates[i].substring(6,10)
            var date_string = month+"/"+day+"/"+year
            var date_newFormat = new Date(date_string)
            dates_objs.push(date_newFormat)
          }
          return dates_objs;
        }
        if(type==0) return dates
    };

  componentDidMount = () => {
    const {
      itemID, //id della struttura
      itemPrice,//prezzo della struttura(a notte)
      itemTitle,//nome struttura
      ownerID,
      userID, //id dell'utente cliente
      clientMail,//email dell'utente cliente
      ownerMail, //email dell'utente proprietario dell'alloggio
      ownerName, //nome dell'utente proprietario dell'alloggio
      ownerSurname, //cognome proprietario
      clientName,//nome del cliente
      clientSurname,//cognome del cliente
      city,//citta in cui si trova l'alloggio(per calcolo tasse...)
      street, //indirizzo struttura
      beds
    } = this.props.route.params;
    console.log('userTokenAddStructure')

    this.setState({
      user_id: userID,
      title: itemTitle,
      clientMail: clientMail,
      ownerMail: ownerMail,
      owner_id: ownerID,
      structure_id: itemID,
      price: itemPrice,
      city: city,
      street: street,
      beds: beds,
      request: 0
    })

    var url = `http://localhost:3055/bookings/profile/date/${itemID}`;
    axios.get(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        }
      })
      .then(res => {
        console.log("ECCO LE DATE:");
        console.log(res.data);
        const bookingdates = res.data;
        this.setState({
          dates: bookingdates
        })
        console.log(this.state.dates);
        console.log(this.state.clientMail);
        console.log(this.state.ownerMail);

        var disabledDates_ = [];
        if(this.state.dates.length !=0){
          for(var i = 0; i < this.state.dates.length; i++){
            var startDate = this.state.dates[i].checkIn;
            var endDate = this.state.dates[i].checkOut;
            disabledDates_.push(this.getDateRange(startDate,endDate,'DD-MM-YYYY',1)) 
          }
          this.setState({
            disabledDates: disabledDates_.flat()
          })
        }

    })

    url = `http://localhost:3055/bookings/profile/date/${itemID}/${userID}`;
    axios.get(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        }
      })
      .then(res => {
        console.log("ECCO LE DATE PRENOTATE DA UN UTENTE IN UNA STRUTTURA:");
        console.log(res.data);
    })

  }

  //funzione che controlla se fra il range di date selezionate ce ne sono alcune occupate
  datesRangeCheck(){
    //estraggo da dates, che mi da tutti i checkin e i checkout di quella struttura,un array con tutte le date occupate
    // disableDates_ contiene l'array di date occupate per quella struttura
    //selectedDatesRange conterrà le date che ha scelto l'utente
    //confrontando i due array possiamo validare la scelta delle date da parte dell'utente in modo che non permettiamo che selezioni date occupate
    var disabledDates_ = [];
    var datesError = false; //se datesError = false allora può essere effettuata la prenotazione, altriemnti no perchè si è selezionato un range di date che ne contiene altre in cui la struttura è occupata
    if(this.state.dates.length !=0){
      for(var i = 0; i < this.state.dates.length; i++){
        var startDate = this.state.dates[i].checkIn;
        var endDate = this.state.dates[i].checkOut;
        disabledDates_.push(this.getDateRange(startDate,endDate,'DD-MM-YYYY',0)) 
      }
      this.setState({
        disabledDatesStrings:disabledDates_
      })
    }
    if(this.state.checkOut.length != 0){
      var selectedDatesRange = this.getDateRange(this.state.checkIn, this.state.checkOut, 'DD-MM-YYYY',0);//date che ha scelto l'utente
      for(var i = 0; i<selectedDatesRange.length ; i++){
        if(disabledDates_.flat().indexOf(selectedDatesRange[i]) != -1 ){
          datesError = true
        }
      }
    }
    console.log(datesError)
    return datesError;
  }
  
 async postBooking () {
    var datesCheck = this.datesRangeCheck()
    if(this.state.checkOut.length !=0){
      if(datesCheck == false){  
        const url = `http://localhost:3055/bookings/add`;
        await axios.post(url, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            user_id: parseInt(this.state.user_id),
            owner_id: parseInt(this.state.owner_id),
            structure_id: parseInt(this.state.structure_id),
            checkIn: this.state.checkIn,
            checkOut: this.state.checkOut,
            days: parseInt(this.state.diffDays),
            totPrice: parseInt(this.state.totPrice),
            cityTax: parseInt(this.state.cityTax)
          })
          .then(res => {
            console.log(res);
            res.data;
            })
          .catch(function (error) {
            console.log(error);
          });

          this.postMail();
          this.props.navigation.navigate('Home')
        }
        else{
          this.setState({
            datesError:true
          })
        }
      }
      else{
        this.setState({
          alert:true
        })
      }
  }

  async postMail() {
    const url = `http://localhost:3055/bookings/send/email`;
    axios.post(url, {
       method: 'POST',
       headers: {
         'content-type': 'application/json',
       },
       user_id: parseInt(this.state.user_id),
       owner_id: parseInt(this.state.owner_id),
       structure_id: parseInt(this.state.structure_id),
       checkIn: this.state.checkIn,
       checkOut: this.state.checkOut,
       days: parseInt(this.state.diffDays),
       totPrice: parseInt(this.state.totPrice),
       cityTax: parseInt(this.state.cityTax)
     })
     .then(res => {
       console.log(res);
       })
     .catch(function (error) {
       console.log(error);
     });
  }
  render(){
    
    return (
        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.textHeader}>Prenotazione Struttura</Text>
            <Text style={styles.subtitle}>seleziona date di soggiorno e conferma la prenotazione</Text>
            <DateSelector
              updateState={this.updateState.bind(this)}
              price = {this.state.price}
              city = {this.state.city}
              disabledDates={this.state.disabledDates}
              disabledDatesStrings={this.state.disabledDatesStrings}
            ></DateSelector>
            <View style={styles.datesBox}>
                    <Text style={styles.dateText}>Check-In:</Text>
                    <Text style={styles.dateStyle}>{this.state.checkIn}</Text>
                    <Text style={styles.dateText}>Check-Out: </Text>
                    <Text style={styles.dateStyle}>{this.state.checkOut}</Text>
            </View>
            <Text style={styles.texTitle}> {this.state.itemTitle}</Text>
            <Text style={styles.textInfo}>{this.state.city}, {this.state.street} </Text>
            <Text style={styles.textInfo}>Letti: {this.state.beds} </Text>
            <View style={styles.priceInfo}>
              <Text style={styles.numberOfDays}> {this.state.diffDays} Notti</Text>
              <Text style={styles.textInfo}>Prezzo/notte : {this.state.price}€</Text>
              <Text style={styles.textInfo}>Tasse soggiorno: {this.state.cityTax} €</Text>
              <Text style={styles.textInfo}>Prezzo Totale: <Text style={styles.finalPrice}>{this.state.totPrice} €</Text></Text>
            </View>
            
            
            <Text>ID struttura: {this.state.structure_id}</Text>

            {
              this.state.alert ? <Text style={styles.alertText}>SELEZIONA LE DATE</Text> : null
            }
            {
              this.state.datesError ? <Text style={styles.alertText}>HAI SCELTO DELLE DATE NON DISPONIBILI</Text> : null
            }
            <View>
              <Button title="CONFERMA" color={colors.orange} onPress = {()=> {this.postBooking()}} ></Button>
            </View>
        </ScrollView>
        </View>
    )
  }
    
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.green01,
        height:'100%',
        alignContent:'center',
        alignItems: 'center'
    },
    textHeader: {
      fontSize: 28,
      color: colors.white,
      fontWeight: "300",
      marginTop:30,
      alignSelf:'center'
    },
    texTitle:{
      fontSize: 30,
      color: colors.white,
      fontWeight: "700",
      margin:5,
      marginTop:0,
      alignSelf:'center'
    },
    subtitle:{
      fontSize: 14,
      color: colors.white,
      fontWeight: "300",
      marginBottom: 30
    },
    datesBox:{
      position: 'relative',
      flexDirection:'row',
      alignContent:'center',
      alignItems:'center',
      margin:10,
      marginBottom:0,
      padding:5,
      
    },
    textInfo:{
      fontSize: 20,
      color: colors.black,
      fontWeight: "700",
      margin: 5
    },
    dateText:{
      padding:6,
      paddingBottom:0,
      fontWeight: "500"
    },
    
    dateStyle:{
      padding:0, 
      color: colors.white,
      fontWeight:"700",
      fontSize:16
    },
    priceInfo:{
      backgroundColor: colors.white,
      opacity: 0.9,
      borderRadius: 10,
      padding: 5
    },
    finalPrice:{
      color: colors.red, 
      fontSize: 30
    },
    numberOfDays:{
      fontSize: 18,
      alignSelf:'center',
      color: colors.orange
    },
    alertText:{
      color: colors.red,
      backgroundColor: colors.white,
      fontSize: 18,
      marginBottom:2,
      fontWeight: "700"
    }
});

