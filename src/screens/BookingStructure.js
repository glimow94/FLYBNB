import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import colors from '../style/colors/index';
import DateSelector from '../components/DateSelector';
import { useNavigation } from '@react-navigation/native';


export default class BookingStructure extends Component{
  constructor(props){
    super(props);
    this.state={
      checkIn:'',
      checkOut: '',
      diffDays: 0,
    }
  }
  
  updateState(filterStatus){
    this.setState(filterStatus)
  }

  componentDidMount = () => {
    const {
      itemID, //id della struttura
      itemPrice,//prezzo della struttura(a notte)
      itemTitle,//nome struttura
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
    console.log(itemName)
    this.setState({
      user_id: userID,
      owner: this.state.owner,
      strcuture_id: itemID,
      checkIn: this.state.checkIn,
      checkOut: this.state.checkOut,
      days: this.state.days,
      price: this.state.price,
      cityTax: this.state.cityTax,
      request: this.state.request
    })
}

  postBooking = () => {
    const url = `http://localhost:3055/bookings/add`;
    axios.post(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',   
        },
        user_id: this.state.user_id,
        owner: this.state.owner,
        strcuture_id: this.props,
        checkIn: this.state.checkIn,
        checkOut: this.state.checkOut,
        days: this.state.days,
        price: this.state.price,
        cityTax: this.state.cityTax,
        request: this.state.request
      })
      .then(res => {
        console.log(res);
        })
      .catch(function (error) {
        console.log(error);
      });
  }

  render(){
    const {
      itemID, //id della struttura
      itemPrice,//prezzo della struttura(a notte)
      itemTitle,//nome struttura
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
    
    return (
      <View style={styles.container}>
        <Text style={styles.textHeader}>Prenotazione Struttura</Text>
        <Text style={styles.subtitle}>seleziona date di soggiorno e completa tutti i campi</Text>
        <DateSelector
          updateState={this.updateState.bind(this)} 
        ></DateSelector>
        <View style={styles.datesBox}>
                <Text style={styles.dateText}>Check-In:</Text>
                <Text style={styles.dateStyle}>{this.state.checkIn}</Text>
                <Text style={styles.dateText}>Check-Out: </Text>
                <Text style={styles.dateStyle}>{this.state.checkOut}</Text>
        </View>
        <Text style={styles.texTitle}> {itemTitle}</Text>
        <Text style={styles.textInfo}>{city}, {street} </Text>
        <Text style={styles.textInfo}>Letti: {beds} </Text>
        <Text style={styles.textInfo}>Prezzo/notte : {itemPrice}€</Text>
        <Text style={styles.textInfo}>Tasse soggiorno: {(city.length/2)*this.state.diffDays} €</Text>
        <Text style={styles.textInfo}>Prezzo Totale: <Text style={{color: colors.white, fontSize: 30}}>{itemPrice*this.state.diffDays + (city.length/2)*this.state.diffDays} €</Text></Text>
        <Text> Permanenza: {this.state.diffDays} giorni</Text>
        <Text>ID struttura: {itemID}</Text>

        
        <View style={{marginTop: 20, width:300}}>
          <Button title="CONFERMA" color={colors.orange} onPress = {()=> {this.postBooking()}} ></Button>
        </View>
      
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
      marginTop:30
    },
    texTitle:{
      fontSize: 30,
      color: colors.white,
      fontWeight: "700",
      margin:5,
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
      fontWeight: "500"
    },
    
    dateStyle:{
      padding:0, 
      color: colors.white,
      fontWeight:"700",
      fontSize:16
    }
});

