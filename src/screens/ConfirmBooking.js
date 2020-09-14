import React, {Component} from 'react';
import {View, Text, StyleSheet, Button,TouchableOpacity, FlatList, Platform, Image} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import { Icon } from 'react-native-elements';
import colors from '../style/colors/index';
import host from '../configHost'
import { ScrollView } from 'react-native-gesture-handler';
import axios from "axios";
import BirthDayPicker from "../components/BirthdayPicker"
import { TextInput } from 'react-native-paper';


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
            birthDay : '1',
            birthMonth:'1',
            birthYear:'2000',
            document_img : '',
            key:i //serve per il correto funzionamento delle funzioni della flatlist
        }
        guests_data.push(obj);
    }
    console.log(guests_data)
    console.log(guests)
   

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
    console.log(this.state.guestsData)
    var error = false;
    for(var i = 0; i < this.state.guests.length ; i++){
      if(this.state.guestsData[i].name.trim().length === 0 ||
         this.state.guestsData[i].surname.trim().length === 0 ||
         this.state.guestsData[i].document_img.length === 0){
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
          days: parseInt(this.state.diffDays),
          totPrice: parseInt(this.state.totPrice),
          cityTax: parseInt(this.state.cityTax)
        })
        .then(res => {
          console.log(res);
          res.data;
          return res;
          })
        .catch(function (error) {
          console.log(error);
        });
  
        await this.postGuest()
        this.props.navigation.navigate('Home')
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
          days: parseInt(this.state.diffDays),
          totPrice: parseInt(this.state.totPrice),
          cityTax: parseInt(this.state.cityTax),
          name: this.state.guestsData[index].name,
          surname: this.state.guestsData[index].surname,
          date: this.state.guestsData[index].birthDay+"/"+this.state.guestsData[index].birthMonth+"/"+this.state.guestsData[index].birthYear,
          document: this.state.guestsData[index].document_img
        })
      );
    }

    axios.all(promises).then( this.postMail())
  }

  async postMail() {
    const url = `http://${host.host}:3055/bookings/send/email`;
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

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return; // operazione abortita
    }

    data[index].document_img = pickerResult.uri;
    if (Platform.OS === 'web') {
      // i browser web non possono condividere una URI locale per motivi di sicurezza
      // facciamo un upload fittizio su anonymousfile.io e ricaviamo la URI remota del file
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      console.log("remote Uri")
      console.log(pickerResult.uri)
      this.setState({
        guestsData:data
      })
    } else {
      // remoteUri è null per un device mobile
      console.log(remoteUri)
      this.setState({
        guestsData:data
      })
    }
  }

  render(){
    
    return (
        <View style={styles.container}>
          <ScrollView>

            <Text style={styles.textHeader}>Conferma Prenotazione</Text>
            <Text style={styles.subtitle}>Inserisci i dati relativi agli ospiti</Text>
            <Text>{this.state.clientBirthdate}</Text>
            <Text>{this.state.totPrice}</Text>
            <Text>{this.state.checkIn}-{this.state.checkOut}</Text>
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
            </View>
            {this.state.alert ? <Text style={styles.alertText}>ERRORE: Completa tutti i campi degli ospiti, compresi i documenti</Text>:null}
            <View style={{margin:5}}>
              <Button title={'PRENOTA'} onPress = {()=> this.postBooking()} color={colors.red}></Button>
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
        alignSelf:'center',
        marginRight:5
      },
    subtitle:{
      fontSize: 14,
      color: colors.white,
      fontWeight: "300",
      alignSelf:'center',
      marginBottom: 30,
      
    },
    formGuestTitle:{
        fontSize:14,
        fontWeight:"700",
        alignSelf:'center',
        color:colors.white
    },
    InputWrapper: {
        display: "flex",
        paddingRight:10,
        marginBottom: 5
    },

    label:{
        color: colors.white,
        fontSize:12,
        width: 150,
        marginTop: 5,
    },
    inputField: {
        borderBottomWidth: 1,
        paddingTop:5,
        paddingBottom: 4,
        height: 20,
        backgroundColor: colors.green01,
        borderBottomColor: colors.white
    },
    formContainer:{
        borderWidth:1,
        borderColor:colors.black,
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
    backgroundColor: colors.white,
    fontSize: 12,
    marginBottom:2,
    fontWeight: "700"
  },
});

