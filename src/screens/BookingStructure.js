import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import colors from '../style/colors/index';
import DateSelector from '../components/DateSelector';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import axios from "axios";


export default class BookingStructure extends Component{
  constructor(props){
    super(props);
    this.state={
      user_id: '',
      title: '',
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
      alert: false
    }
  }
  
  updateState(filterStatus){
    this.setState(filterStatus);
  }

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
    console.log()
    this.setState({
      user_id: userID,
      title: itemTitle,
      owner_id: ownerID,
      structure_id: itemID,
      price: itemPrice,
      city: city,
      street: street,
      beds: beds,
      request: 0
    })
}

  postBooking = () => {
    if(this.state.checkOut.length !=0){
      const url = `http://localhost:3055/bookings/add`;
      axios.post(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',   
          },
          user_id: this.state.user_id,
          owner_id: this.state.owner_id,
          structure_id: this.state.structure_id,
          checkIn: this.state.checkIn,
          checkOut: this.state.checkOut,
          days: this.state.diffDays,
          totPrice: this.state.totPrice,
          cityTax: this.state.cityTax,
          request: this.state.request
        })
        .then(res => {
          console.log(res);
          })
        .catch(function (error) {
          console.log(error);
        });

        this.props.navigation.navigate('Home')
      }
      else{
        this.setState({
          alert:true
        })
      }
  }

  render(){
    
    return (
        <View style={styles.container}>
          <ScrollView>
          <Text style={styles.textHeader}>Prenotazione Struttura</Text>
          <Text style={styles.subtitle}>seleziona date di soggiorno e completa tutti i campi</Text>
          <DateSelector
            updateState={this.updateState.bind(this)}
            price = {this.state.price}
            city = {this.state.city}
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
      marginTop:30
    },
    texTitle:{
      fontSize: 30,
      color: colors.white,
      fontWeight: "700",
      margin:5,
      marginTop:0
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

