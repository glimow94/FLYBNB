import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, RefreshControlBase, Picker} from 'react-native';
import colors from '../style/colors/index';
import DateSelector from '../components/DateSelector';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import axios from "axios";
import moment from "moment"
import { diff } from 'react-native-reanimated';


export default class BookingStructure extends Component{
  constructor(props){
    super(props);
    this.state={
      user_id: '',
      title: '',
      clientName:'',
      clientSurname:'',
      clientMail: '',
      ownerName:'',
      ownerSurname:'',
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
      alert: false,//alert = true se si preme conferma senza aver selezionato le date
      dates: [],
      disabledDates: [],
      disabledDatesStrings:[],
      bookedDates:[], //array di oggetti di coppie (checkin= data1, checkout=data2) in cui sono salvate le date di tutte le prenotazione dell'utente per questa struttura
      datesError: false,//indica errore se si è superato il limite dei 28 giorni
      errorMessage:'',
      remainingDays_firstYear:false,
      remainingDays_2Year:false,
      totalYearDays:[],
      totBookedDays:'',
      totBooking_FirstYear:0,
      totBooking_2Year:0,
      guests:1,
      maxDays:28 //massimo numero di giorni prenotabili in questa struttura
    }
  }
  
  updateState(filterStatus){
    this.setState(filterStatus);
  }
  //funzione che renderizza i picker item per la sscelta del numero di ospiti
  renderGuestsNumber(){
    var num = [];
    if(this.state.beds>0){
      for (var i = 1; i <= this.state.beds; i++) {
        num.push(<Picker.Item label={i.toString()} value={i} key={i} />);
      }
    }
    return num
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
        //se type = 1 creo l'array di oggetti con le date in formato oggetto Date, convertendo il formato da DD-MM-YYYY ad MM-DD-YYYY
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
      clientName: clientName,
      clientSurname:clientSurname,
      clientMail: clientMail,
      ownerName:ownerName,
      ownerSurname: ownerSurname,
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
        /* console.log("ECCO LE DATE:");
        console.log(res.data); */
        const bookingdates = res.data;
        this.setState({
          dates: bookingdates
        })

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
        const bookedDates = res.data
        this.setState({
          bookedDates: bookedDates
        })
    })

  }

  //funzione che controlla se fra il range di date selezionate ce ne sono alcune occupate
 /*  datesRangeCheck(){
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
  } */


  //funzione che calcola l'ammontare dei giorni di prenotazione di un utente per la stessa struttura (NON DEVE ESSERE > 28)
  //tenendo in considerazione l'anno che ci interessa e considerando anche che potrebbe prenotare a cavallo fra due anni (es. dicembre 2020-gennaio 2021)
  totBookedDays(){
   
    var diffDays = 0;
    var totDays_firstYear=0; //qui salviamo l'ammontare dei giorni delle prenotazioni effettuate nell'anno del checkin(es. 2020) se questo è diverso dal checkout selezionato(es.2021)
    var totDays_2Year = 0;//qui salviamo l'ammontare dei giorni delle prenotazioni effettuate nell'anno del checkout quando questo è diverso dall'anno del checkin
    var tot_bookings = [];//in questo array salviamo totDats_firsyear e totdays_2year per poi usarlo come argomento di return in modo da passare entrambi i valori
    var dateFormat = 'DD-MM-YYYY';
    //mi serve l'anno del checkin attuale che sto prenotando e del checkout
    var checkin_year = parseInt(this.state.checkIn.substring(6,10));//anno del checkin corrente(che sto prenotando adesso)
    var checkout_year = parseInt(this.state.checkOut.substring(6,10));//anno del checkout corrente

    
      if(this.state.bookedDates.length !=0){
        if(parseInt(checkin_year) == parseInt(checkout_year)){
          for(var i = 0; i < this.state.bookedDates.length; i++){
            //variabili dei checkin checkout della lista delle prenotazioni effettuate in precedenza
            //da cui estraggo anche l'anno
            var start = this.state.dates[i].checkIn,
                end = this.state.dates[i].checkOut,
                start_year=parseInt(start.substring(6,10)),
                end_year=parseInt(end.substring(6,10)),
                startDate = moment(start, dateFormat),
                endDate = moment(end,dateFormat);
                
                console.log(start_year)
                console.log(end_year)
                console.log(checkin_year)
                console.log(checkout_year)
            if(start_year == end_year && start_year == checkin_year){
              var diff = endDate.diff(startDate, 'days');
              diffDays = diffDays + diff
              console.log('PRIMO DIFF')
              console.log(diff)
            }
            if(start_year == checkin_year && start_year != end_year){
              //se le date sono a cavallo fra due anni, es. checkin: 21 dicembre 2020 / checkout: 6 gennaio 2021
              //e se la data di checkin che voglio prenotare è uguale alla data di checkin delle prenotazioni effettuate 
              //calcolo i giorni di pernottamento per l'anno che sto prenotando utilizzando la data di fine anno per il calcolo della differenza
              var end_ = '31/12/'+checkin_year.toString(),
                  //nextYear = parseInt(year_checkin)+1,
                  //start_ = '01/01/'+nextYear.toString(); 
              //calcolo diff = data_fine_anno - datacheckin
                  endDate_ = moment(end_,dateFormat),
                  diff_ = endDate_.diff(startDate,'days');
                  console.log(endDate)
                  console.log(startDate)
                  console.log(diff_)
                  diffDays = diffDays + diff_
            }
          } 
          tot_bookings.push(diffDays,0)
          console.log(tot_bookings)
        }else{
          for(var i = 0; i < this.state.bookedDates.length; i++){
            //variabili dei checkin checkout della lista delle prenotazioni effettuate in precedenza
            //da cui estraggo anche l'anno
            var start = this.state.dates[i].checkIn,
                end = this.state.dates[i].checkOut,
                start_year=parseInt(start.substring(6,10)),
                end_year=parseInt(end.substring(6,10)),
                startDate = moment(start, dateFormat),
                endDate = moment(end,dateFormat);
                
            
            if(start_year == checkin_year && end_year == checkout_year){
              //se l'anno del checkin_selezionato è uguale all'ann del checkin della prenotazione__precedente
              // e se l'anno del checkout_selezionato è uguale all'anno del checkout della prenotazione_precedente:
              var end_ = '31/12/'+checkin_year.toString(),
                  end_date = moment(end_,dateFormat),
                  diff_days = end_date.diff(startDate, 'days');//giorni totali fra il chekcin e fine anno
              totDays_firstYear = diff_days + totDays_firstYear;
              
              //anno del checkout
              var start_ = '01/01/'+checkout_year.toString(),
                  start_date = moment(start_,dateFormat),
                  diff_days2 = endDate.diff(start_date,'days'); // giorni totali fra inizio anno e checkout
              totDays_2Year = diff_days2 + totDays_2Year;
            }
            if(start_year == checkin_year && end_year == checkin_year){
              //se le date precedente prenotate che stiamo scorrendo enl ciclo sono composte da checkin e checkout compresi nell'anno 
              //del checkin che abbiamo scelto allora aggiungiamo il numero totale di giorni prenotati in quell'anno alla variabile totDaysFirstYear
              var diff_days3 = endDate.diff(startDate,'days');
              totDays_firstYear = totDays_firstYear + diff_days3;
            }
            if(start_year == checkout_year && end_year == checkout_year){
              var diff_days4 = endDate.diff(startDate,'days');
              totDays_2Year = totDays_2Year +diff_days4 //stavolta aggiungiamo all'anno successivo
            }
          } 
          tot_bookings.push(totDays_firstYear,totDays_2Year)
          console.log(tot_bookings)
        }
        
      }
      return tot_bookings
  }
datesCheck=()=>{
    var error_string='',
        datesError=false,
        remainingDays_firstYear = false,
        remainingDays_2Year =false;
        
    if(this.state.checkOut.length!=0){
      var checkin_year = this.state.checkIn.substring(6,10),
          checkout_year = this.state.checkOut.substring(6,10),
          array = this.totBookedDays();
  
      if(checkin_year == checkout_year){
            var bookedDays = array[0],
                remainingDays= 28-bookedDays;
            if(((bookedDays+this.state.diffDays) > 28 && bookedDays < 28)){
              error_string='Non puoi prenotare piu di '+remainingDays+' Notti in questa struttura per il '+checkin_year;
              datesError=true
            }
            if(bookedDays>=28){
              error_string='Non puoi piu prenotare in questa struttura per il '+checkin_year+' (limite annuale di 28 pernottamenti raggiunto)';
              datesError=true
            }
      }
      else{
        var bookedDays_firstYear = array[0],
            bookedDays_2Year = array[1],
            dateFormat = 'DD-MM-YYYY',
            checkinDate = moment(this.state.checkIn,dateFormat),
            checkOutDate = moment(this.state.checkOut,dateFormat),
            endString = '31/12/'+checkin_year.toString(),
            startString = '01/01/'+checkout_year.toString(),
            end = moment(endString,dateFormat),
            start=moment(startString,dateFormat),
            //calcolo diffdays per 1-Year(diffDays sono i giorni di differenza fra il checkin e il checkout selezionati al momento)
            diff_firstYear = end.diff(checkinDate,'days'),
            diff_2Year = checkOutDate.diff(start,'days');
        remainingDays_firstYear = 28 - bookedDays_firstYear;
        remainingDays_2Year = 28 -bookedDays_2Year;
  
        if(((bookedDays_firstYear+diff_firstYear)>28) || (bookedDays_2Year+diff_2Year)>28){
          error_string="Hai superato il limite di 28 pernottamenti all'anno";
          datesError=true;
        } 
      }
    }
    var array = [];
    array.push(datesError,error_string,remainingDays_firstYear,remainingDays_2Year);
    console.log(datesError)
    return array
}
  
async postBooking () {
  this.props.navigation.navigate('ConfirmBooking',{
      itemTitle: this.state.title,
      totPrice: this.state.totPrice,
      ownerID: this.state.owner_id,
      itemID: this.state.structure_id,
      userID: this.state.user_id,
      clientMail: this.state.clientMail,//email dell'ospite
      ownerMail: this.state.ownerMail,//email del proprietario di casa
      ownerName:this.state.ownerName,
      ownerSurname:this.state.ownerSurname,
      clientName: this.state.clientName,
      clientSurname: this.state.clientName,
      city: this.state.city, //citta, ci servirà anche per calcolare le tasse di soggiorno
      street: this.state.street,
      beds: this.state.beds,
      checkIn : this.state.checkIn,
      checkOut: this.state.checkOut,
      cityTax: this.state.cityTax,
      guests: this.state.guests
  })
/* 
    if(this.state.checkOut.length !=0){
      var array = this.datesCheck();

      this.setState({
        datesError:array[0],//array[0] è true o false, true -> c'è un errore nelle date
        errorMessage:array[1],
        remainingDays_firstYear:array[2],
        remainingDays_2Year:array[3]
      })
      if(array[0]==false){ //non c'è un errore nelle date
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
    }
    else{
      this.setState({
      alert:true
    })
  } */
    
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
            
            <View style={{flexDirection:"row"}}>
              <Text style={styles.textInfo}>NUMERO DI OSPITI: </Text>
              <Picker 
                style={styles.Picker} 
                selectedValue={this.state.guests} 
                onValueChange={(val)=>this.setState({
                  guests:val
                })}>
                {this.renderGuestsNumber()}
              </Picker> 
            </View>
            <View style={styles.priceInfo}>
              <Text style={styles.numberOfDays}> {this.state.diffDays} Notti</Text>
              <Text style={styles.textInfo}>Prezzo/notte : {this.state.price}€</Text>
              <Text style={styles.textInfo}>Tasse soggiorno: {this.state.cityTax} €</Text>
              <Text style={styles.textInfo}>Prezzo Totale: <Text style={styles.finalPrice}>{this.state.totPrice} €</Text></Text>
            </View>
            
            
            <Text style={styles.smallText}>ID struttura: {this.state.structure_id}</Text>

            {
              this.state.alert ? <Text style={styles.alertText}>SELEZIONA LE DATE</Text> : null
            }
            {
              this.state.datesError ? 
              <View>
                  <Text style={styles.alertText}>Errore: {this.state.errorMessage}</Text>
                </View> : null
            }
            {this.state.remainingDays_firstYear ?<View>
              <Text style={styles.alertText}>Errore: hai selezionato un range di date che supera il limite annuale di 28 notti</Text>
              <Text style={styles.alertText}>Notti prenotabili per il {this.state.checkIn.substring(6,10)}: {this.state.remainingDays_firstYear}</Text>
              <Text style={styles.alertText}>Notti prenotabili per il {this.state.checkOut.substring(6,10)}: {this.state.remainingDays_2Year}</Text>
            </View>:null}
            
            
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
      fontSize: 12,
      marginBottom:2,
      fontWeight: "700"
    },
    smallText:{
      fontSize:8
    },
    Picker:{
      margin:3
    }
});

