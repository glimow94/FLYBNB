import React, {Component} from 'react';
import {View, Text, StyleSheet, Button,TouchableOpacity, FlatList, Platform, Image, Dimensions} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import { Icon } from 'react-native-elements';
import colors from '../style/colors/index';
import host from '../configHost'
import { ScrollView } from 'react-native-gesture-handler';
import axios from "axios";
import BirthDayPicker from "../components/BirthdayPicker"
import { TextInput } from 'react-native-paper';

var wrapperWidth = '35%';
var ScreenHeight = Dimensions.get("window").height* 0.6;
if( Platform.OS === 'android' || Dimensions.get('window').width < 700){
    wrapperWidth = '100%';
    ScreenHeight = '100%';
}

export default class BookingStructure extends Component{
//nome cognome-data di nascita-documento
  constructor(props){
    super(props);
    this.state={
        //dati della struttura
        user_id: '',
        title: '',
        clientName:'',
        clientSurname:'',
        clientMail: '',
        clientBirthdate:'',
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
        guests:1,
        alert: false,

        //dati degli utenti
        guestsData:[]
    }
  }


  componentDidMount = () => {
    const {
      itemID, //id della struttura
      totPrice,//prezzo della struttura(a notte)
      itemTitle,//nome struttura
      ownerID,
      userID, //id dell'utente cliente
      clientMail,//email dell'utente cliente
      ownerMail, //email dell'utente proprietario dell'alloggio
      ownerName, //nome dell'utente proprietario dell'alloggio
      ownerSurname, //cognome proprietario
      clientName,//nome del cliente
      clientSurname,//cognome del cliente
      clientBirthdate,
      city,//citta in cui si trova l'alloggio(per calcolo tasse...)
      street, //indirizzo struttura
      beds,
      checkIn,
      checkOut,
      cityTax,
      guests
    } = this.props.route.params;
/*     console.log('userTokenAddStructure')
 */    //creo un array di oggetti che conterranno i dati degli utenti
    var guests_data = [],
        day = clientBirthdate.substring(0,2),
        month = clientBirthdate.substring(3,5),
        year = clientBirthdate.substring(6,10);
    
    var user ={
      name :clientName,
      surname : clientSurname,
      birthDay:day,
      birthMonth:month,
      birthYear:year,
      document_img:'',
      key:0
    }
    guests_data.push(user)
    
    for(var i = 1; i < guests;i++){
        var obj = {
            name : '',
            surname : '',
            birthDay : '01',
            birthMonth:'01',
            birthYear:'2000',
            document_img : '',
            key:i //serve per il correto funzionamento delle funzioni della flatlist
        }
        guests_data.push(obj);
    }
    

    this.setState({
      user_id: userID,
      title: itemTitle,
      totPrice:totPrice,
      clientName:clientName,
      clientSurname:clientSurname,
      clientMail: clientMail,
      clientBirthdate: clientBirthdate,
      ownerName:ownerName,
      ownerSurname:ownerSurname,
      ownerMail: ownerMail,
      owner_id: ownerID,
      structure_id: itemID,
      city: city,
      street: street,
      beds: beds,
      checkIn:checkIn,
      checkOut:checkOut,
      cityTax:cityTax,
      guests:guests,
      request: 0,
      guestsData:guests_data
    })
  }

  async postBooking () {
    
    var error = false;
    for(var i = 0; i < this.state.guestsData.length ; i++){
 
      if(this.state.guestsData[i].name.trim().length == 0 ||
         this.state.guestsData[i].surname.trim().length == 0 ||
         this.state.guestsData[i].document_img.length == 0){
          error = true;
          break
        }
    }
    
    if(error==false){
      const url = `http://${host.host}:3055/bookings/add`;
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
          totPrice: parseInt(this.state.totPrice),
          cityTax: parseInt(this.state.cityTax)
        })
        .then(res => {
          if(res){
            this.postGuest().then((res)=>{
              
              if(res && res.filter(function(value){
                return value.status == 201;
              }).length == res.length )
                this.postMail();
            })
          }
          this.props.navigation.navigate('Home');
          })
        .catch(function (error) {
          console.log(error);
        });

        alert('Prenotazione Effettuata con successo!')
    }
    else this.setState({alert:true})
    
  }

  async postGuest() {
    let promises = [];
    const url = `http://${host.host}:3055/bookings/add/guest`;
    for(let index=0 ; index < this.state.guests ; index++){
      promises.push(
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
          totPrice: parseInt(this.state.totPrice),
          cityTax: parseInt(this.state.cityTax),
          name: this.state.guestsData[index].name,
          surname: this.state.guestsData[index].surname,
          date: this.state.guestsData[index].birthDay+"/"+this.state.guestsData[index].birthMonth+"/"+this.state.guestsData[index].birthYear,
          document: this.state.guestsData[index].document_img
        })
      );
    }
    return Promise.all(promises);
  }

  async postMail() {
    const url = `http://${host.host}:3055/bookings/send/email`;
    return axios.post(url, {
       method: 'POST',
       headers: {
         'content-type': 'application/json',
       },
       user_id: parseInt(this.state.user_id),
       owner_id: parseInt(this.state.owner_id),
       structure_id: parseInt(this.state.structure_id),
       checkIn: this.state.checkIn,
       checkOut: this.state.checkOut,
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

  //per salvare i dati di tutti gli utenti utizzo un array di array
  changeName(val,index){
    var data = this.state.guestsData;
    data[index].name = val;
    if(!val || val.trim().length === 0){
        this.setState({
            alert:true
        })
    }
    else{
        this.setState({
            guestsData:data
        })
    }
  }
  changeSurName(val,index){
    var data = this.state.guestsData;
    data[index].surname = val;
    if(!val || val.trim().length === 0){
        this.setState({
            alert:true
        })
    }
    else{
        this.setState({
            guestsData:data
        })
    }
  }
  changeBirthDay = (val,index)=>{
    var data = this.state.guestsData;
    data[index].birthDay = val;
    this.setState({
        guestsData:data
    })
  }
  changeBirthMonth=(val,index)=>{
    var data = this.state.guestsData;
    data[index].birthMonth = val;
    this.setState({
        guestsData:data
    })
  }
  changeBirthYear=(val,index)=>{
    var data = this.state.guestsData;
    data[index].birthYear = val;
    this.setState({
        guestsData:data
    })
  }

  profileImagePickerAsync = async (index) => {
    var data = this.state.guestsData;
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
    // verifica permessi di accesso alla gallery
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({base64:true});
    if (pickerResult.cancelled === true) {
      return; // operazione abortita
    }

    if (Platform.OS === 'web') {
      data[index].document_img = pickerResult.uri;
      this.setState({
        guestsData:data
      })
    } else {
      var source =  'data:image/jpeg;base64,'+pickerResult.base64
      data[index].document_img = source;
      this.setState({
        guestsData:data
      })
    }
  }

  render(){
    
    return (
        <View style={styles.container}>
          <Text style={styles.textHeader}>Conferma Prenotazione</Text>
          <Text style={styles.subtitle}>Inserisci i dati relativi agli ospiti</Text>
          <ScrollView style={styles.scrollWrapper}>
            <View>
              <Text style={styles.structureName}>{this.state.title}</Text>
              <View style={{flexDirection:'row', alignSelf:'center'}}>
                <Text style={styles.textInfo}>Prezzo tot. : </Text>
                <Text style={{color: colors.green02}}>{this.state.totPrice} €</Text>
              </View>
              <View style={{flexDirection:'row', alignSelf:'center'}}>
                <Text style={styles.textInfo}>Check-In: {this.state.checkIn}</Text>
                <Text style={[styles.textInfo,{marginLeft: 10}]}>Check-Out: {this.state.checkOut}</Text>
              </View> 
            </View>
            <View>
              <FlatList
                data= {this.state.guestsData}
                keyExtractor = {(item, index) => index.toString()}
                renderItem = {({item}) =>
                      <View style={styles.formContainer}>
                        <Text style={styles.formGuestTitle}>Ospite {item.key+1}</Text>
                        <View style={styles.InputWrapper}>
                          <Text style={styles.label}>NOME</Text>
                          <TextInput
                              autoCorrect={false}
                              defaultValue={this.state.guestsData[item.key].name}
                              style = {styles.inputField}
                              onChangeText={(val) => this.changeName(val,item.key)}
                          ></TextInput>
                          {   this.state.nameAlert==true ? 
                              <Text style={{color: '#DC143C'}}>Inserisci un nome valido </Text> : null
                          }
                        </View>
                        <View style={styles.InputWrapper}>
                          <Text style={styles.label}>COGNOME</Text>
                          <TextInput
                              autoCorrect={false}
                              defaultValue={this.state.guestsData[item.key].surname}
                              style = {styles.inputField}
                              onChangeText={(val) => this.changeSurName(val,item.key)}
                          ></TextInput>
                          {   this.state.surnameAlert==true ? 
                              <Text style={{color: '#DC143C'}}>Inserisci un cognome valido </Text> : null
                          }
                        </View>
                        <View style={styles.birthdatePickers}>
                          <Text style={styles.label}>NATO IL (GG/MM/AA)</Text>
                            <BirthDayPicker
                              selectedYear={this.state.guestsData[item.key].birthYear}
                              selectedMonth={this.state.guestsData[item.key].birthMonth}
                              selectedDay={this.state.guestsData[item.key].birthDay} 
                              maxYears = {(new Date()).getFullYear()}                                                    
                              onYearValueChange={(year,i)=> this.changeBirthYear(year,item.key)}
                              onMonthValueChange={(month,i) => this.changeBirthMonth(month,item.key)}
                              onDayValueChange={(day,i) => this.changeBirthDay(day,item.key)}
                            ></BirthDayPicker>
                        </View>
                        <Text style={styles.label}>FOTO DOCUMENTO: </Text>
                        <View style={{flexDirection:'column'}}>
                          <Image source={ this.state.guestsData[item.key].document_img !== '' ? {uri: this.state.guestsData[item.key].document_img} : require('../img/structure_image.png') } style={styles.documentImage} />
                          <TouchableOpacity style={styles.button} onPress={() => this.profileImagePickerAsync(item.key)}>
                              <Icon
                                size={20}
                                style={styles.icon}
                                name='camera'
                                type='font-awesome'
                                color='#f50'
                                color={colors.black}
                              />
                          </TouchableOpacity>
                        </View>
                      </View>
                    }
                contentContainerStyle={{paddingTop:40}}
              />
              {/* <Text style={styles.label}>PAGAMENTO</Text>
              <View style={styles.InputWrapper}>
                <Text style={styles.label}>NUMERO DI CARTA</Text>
                <TextInput
                    autoCorrect={false}
                    defaultValue={this.state.surname}
                    onChangeText={(val) => this.changeCardNumber(val,item.key)}
                ></TextInput>
                {   this.state.surnameAlert==true ? 
                    <Text style={{color: '#DC143C'}}>Inserisci un cognome valido </Text> : null
                }
              </View>
              <View style={styles.InputWrapper}>
                <Text style={styles.label}>PROPRIETARIO</Text>
                <TextInput
                    autoCorrect={false}
                    style={{height: 50}}
                    defaultValue={this.state.cardName+''+this.state.cardSurname}
                    onChangeText={(val) => this.changeCardName(val,item.key)}
                ></TextInput>
                {   this.state.surnameAlert==true ? 
                    <Text style={{color: '#DC143C'}}>Inserisci un cognome valido </Text> : null
                }
              </View> */}
            </View>
          </ScrollView>
          {this.state.alert ? <Text style={styles.alertText}>ERRORE: Completa tutti i campi degli ospiti, compresi i documenti</Text>:null}
          <View style={{marginTop:5,padding:10, width: wrapperWidth}}>
            <Button title={'CONFERMA PRENOTAZIONE'} onPress = {()=> this.postBooking()} color={colors.green02}></Button>
          </View>
        </View>
    )
  }
    
}

const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:colors.white,
      height:'100%',
      alignContent:'center',
      alignItems: 'center'
    },
    textHeader: {
      fontSize: 28,
      color: colors.transparent,
      fontWeight: "300",
      marginTop:30,
      alignSelf:'center',
      marginRight:5
    },
    subtitle:{
      fontSize: 14,
      color: colors.transparent,
      fontWeight: "300",
      alignSelf:'center',
      marginBottom: 30,
      
    },
    scrollWrapper:{
      height: ScreenHeight,
      width: wrapperWidth,
      backgroundColor:colors.primary
    },
    structureName:{
      fontSize: 18,
      color: colors.black,
      fontWeight: "400",
      alignSelf:'center',
      marginBottom:4
    },
    textInfo:{
      fontSize: 14,
      color: colors.black,
      fontWeight: "400",
      alignSelf:'center',
      marginBottom:4
    },
    formGuestTitle:{
        fontSize:14,
        fontWeight:"700",
        alignSelf:'center',
        color:colors.black
    },
    InputWrapper: {
        display: "flex",
        paddingRight: 5,
        marginBottom: 5
    },
    

    label:{
        color: colors.black,
        fontSize:12,
        width: 150,
        marginTop: 5,
    },
    inputField: {
        borderBottomWidth: 2,
        paddingTop:5,
        paddingBottom: 4,
        height: 20,
        backgroundColor: colors.primary,
        borderBottomColor: colors.secondary
    },
    formContainer:{
        backgroundColor: colors.primary,
        borderWidth:2,
        borderColor:colors.tertiary,
        borderRadius: 5,
        margin:10,
        padding:10
    },
    documentImage:{
      height: 60,
      width: 60,
      alignSelf:'center',
      borderRadius: 8,
    },
    alertText:{
      color: colors.red,
      fontSize: 12,
      marginBottom:2,
      fontWeight: "700"
    },
});

