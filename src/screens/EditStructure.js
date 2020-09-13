import React, { Component } from "react";
import { View, Text, TextInput,ScrollView, StyleSheet, Picker,Button,Dimensions,TouchableOpacity, Image, Platform  } from "react-native";
import { CheckBox } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import { Icon } from 'react-native-elements';
import colors from "../style/colors/index";
import NextButton from "../components/buttons/Button1";
import BirthDayPicker from "../components/BirthdayPicker"
import CitySelector from "../components/CitySelector"
import { UserContext } from "../components/context";
import { useNavigation } from "@react-navigation/native";
import Login from './Login';
import axios from "axios";

const {width} = Dimensions.get('window');

//pagina di registrazione struttura
export default class EditStructure extends Component{
    
    constructor(props){
        super(props);
        this.state={
            id: '',
            title : '',
            user_id: '',
            type:'B&B',
            city:'',
            street:'',
            number:'',
            post_code:'',
            description:'',
            location_description:'',
            beds:'',
            price:'',
            fullBoard: false,
            wifi: false,
            parking:false,
            kitchen:false,
            airConditioner:false,
            //immagini
            structureImage_1:'',
            structureImage_2:'',
            structureImage_3:'',
            structureImage_4:'',
            
            //variabili per la validazione
            titleAlert: false,
            titleColor: colors.white,

            streetAlert: false,
            streetColor: colors.white,
            //numero civico
            numberAlert: false,
            numberColor: colors.white,
            //post_code=CAP
            capAlert: false,
            capColor: colors.white,
            //prezzo
            priceAlert: false,
            priceColor: colors.white,
            //posti letto
            bedsAlert:false,
            bedsColor: colors.white,
            //warning che si attiva al premere del pulsante MODIFICA se qualche dato non è giusto
            warning:false,
            //stati che in realtà in questa pagina nons ervono ma servono a cityselector perche' in Home funziona in un altro modo....problema  da risolvere
            status1: false,
            status2:false,
            status3:false,
            parentType: 'AddStructure'

        }
    }

    changeTitle = (val) => {
        
        if(!val || val.trim().length === 0){
            this.setState({
                title:'',
                titleColor: '#DC143C',
                titleAlert:true
            })
        }
        else{
            this.setState({
                title: val,
                titleColor: colors.white,
                titleAlert: false
            })
        }
    }
    changeType = (val) => {
        this.setState({
            type : val
        })
    }

    changeStreet = (val) => {
        
        if(!val || val.trim().length === 0){
            this.setState({
                street:'',
                streetColor: '#DC143C',
                streetAlert:true
            })
        }
        else{
            this.setState({
                street: val,
                streetColor: colors.white,
                streetAlert: false
            })
        }
    }
    changeNumber = (val) => {
        if(!val || val.trim().length === 0 || parseInt(val) < 1){
            this.setState({
                number:'',
                numberColor: '#DC143C',
                numberAlert:true
            })
        }
        else{
            this.setState({
                number: val,
                numberColor: colors.white,
                numberAlert: false
            })
        }
    }
    changeCAP = (val) => {
        
        if(!val || val.trim().length === 0){
            this.setState({
                post_code:'',
                capColor: '#DC143C',
                capAlert:true
            })
        }
        else{
            this.setState({
                post_code: val,
                capColor: colors.white,
                capAlert: false
            })
        }
    }
    changePrice = (val) => {
        if(!val || val.trim().length === 0 || parseInt(val) < 1){
            this.setState({
                price:'',
                priceColor: '#DC143C',
                priceAlert:true
            })
        }
        else{
            this.setState({
                price: val,
                priceColor: colors.white,
                priceAlert: false
            })
        }
    }
    changeBeds = (val) => {
        if(!val || val.trim().length === 0 || parseInt(val) <1){
            this.setState({
                beds:'',
                bedsColor: '#DC143C',
                bedsAlert:true
            })
        }
        else{
            this.setState({
                beds: val,
                bedsColor: colors.white,
                bedsAlert: false
            })
        }
    }
    changeDescription = (val) => {
        this.setState({
            description: val
        })
    }
    changeLocationDescription = (val) => {
        console.log("location DESCRIPTION");
        console.log(this.state.location_description);
        this.setState({
            location_description: val
        })
    }
    profileImagePickerAsync = async (index) => {
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
        if (Platform.OS === 'web') {
          // i browser web non possono condividere una URI locale per motivi di sicurezza
          // facciamo un upload fittizio su anonymousfile.io e ricaviamo la URI remota del file
          let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
          console.log("remote Uri")
          console.log(pickerResult.uri)
            if(index == 1){
                this.setState({
                    structureImage_1 : pickerResult.uri
                })
            }
            if(index == 2){
                this.setState({
                    structureImage_2 : pickerResult.uri
                })
            }
            if(index == 3){
                this.setState({
                    structureImage_3 : pickerResult.uri
                })
            }
            if(index == 4){
                this.setState({
                    structureImage_4 : pickerResult.uri
                })
            }
        }
        else {
          // remoteUri è null per un device mobile
          console.log(remoteUri)
            if(index == 1){
                this.setState({
                    structureImage_1 : pickerResult.uri
                })
            }
            if(index == 2){
                this.setState({
                    structureImage_2 : pickerResult.uri
                })
            }
            if(index == 3){
                this.setState({
                    structureImage_3 : pickerResult.uri
                })
            }
            if(index == 4){
                this.setState({
                    structureImage_4 : pickerResult.uri
                })
            }
        }
    
        ///let formdata = new FormData();
        //formdata.append("product[name]", 'image')
        //formdata.append("product[image]", {uri: this.state.imageUri, name: 'image.jpg', type: 'image/jpeg'})
        /* const url = `http://localhost:3055/users/update/image/${this.state.userToken}`;
        axios.post(url, {
            method: 'POST',
            headers: {
              'content-type': 'multipart/form-data',
            },
            image: this.state.profileImage
          })
          .then(res => {
            console.log(res);
            })
          .catch(function (error) {
            console.log(error);
          }); */
    };
    updateState(filterStatus){
        this.setState(filterStatus)
    }

    componentDidMount = () => {
        const {
            userToken,
            itemName,
            itemSurname,
            itemEmail, 
            itemTitle,
            itemPrice,
            itemID,
            itemPlace,
            itemStreet,
            itemNumber,
            itemPostCode,
            itemType,
            itemBeds,
            itemKitchen,
            itemFullBoard,
            itemAirConditioner,
            itemWifi,
            itemParking,
            itemDescription,
            locationDescription
        } = this.props.route.params;
        console.log('userTokenAddStructure')
        console.log(itemName)
        this.setState({
            id: itemID,
            user_id: userToken,
            title: itemTitle,
            type:itemType,
            city:itemPlace,
            street:itemStreet,
            number:itemNumber,
            post_code:itemPostCode,
            description:itemDescription,
            location_description:locationDescription,
            beds:itemBeds,
            price:itemPrice,
            fullBoard: itemFullBoard,
            wifi: itemWifi,
            parking:itemParking,
            kitchen:itemKitchen,
            airConditioner:itemAirConditioner,
        })
    }

    postData = () => {
        if(
            (!this.state.title || this.state.title.trim().length === 0) || 
            (!this.state.city || this.state.city.trim().length === 0) ||
            (!this.state.street || this.state.street.trim().length === 0) ||
            (!this.state.post_code || this.state.post_code.trim().length === 0)||
            (!this.state.number || this.state.number.length === 0 || this.state.number <1) ||
            (!this.state.beds || this.state.beds.length === 0 || this.state.beds <1)||
            (!this.state.price || this.state.price.length === 0 || this.state.price <1)){
                this.setState({
                    warning:true
                })
            }
        else{
            const url = `http://localhost:3055/structures/update/${this.state.id}`;
            axios.post(url, {
                method: 'POST',
                headers: {
                'content-type': 'application/json',   
                },
                user_id: this.state.user_id,
                title: this.state.title,
                type: this.state.type,
                place: this.state.city,
                street: this.state.street,
                number: this.state.number,
                post_code: this.state.post_code,
                description: this.state.description,
                location_description: this.state.location_description,
                beds: this.state.beds,
                price: this.state.price,
                fullboard: this.state.fullBoard,
                wifi: this.state.wifi,
                parking: this.state.parking,
                kitchen: this.state.kitchen,
                airConditioner: this.state.airConditioner 
            })
            .then(res => {
                console.log(res);
                })
            .catch(function (error) {
                console.log(error);
            });
            
            this.props.navigation.navigate('Profile')
        }
    }

    render(){

        return (
            <View style={styles.wrapper}>
                <Text style={styles.titleHeader}>Modifica la tua Struttura</Text>
                <ScrollView style={styles.scrollViewWrapper}>

                    <Text style={[{width:150},styles.label]}>NOME STRUTTURA</Text>
                                <TextInput
                                    defaultValue={this.state.title}
                                    autoCorrect={false}
                                    style = {[{borderColor: this.state.titleColor},styles.inputField]}
                                    onChangeText={val => this.changeTitle(val)}
                                ></TextInput>
                    {   this.state.titleAlert==true ? 
                                    <Text style={{color: '#DC143C'}}>Inserisci il nome della struttura</Text> : null
                    }
                    
                    <Text style={[{width:150},styles.label]}>CITTA</Text>
                    <CitySelector
                        updateState={this.updateState.bind(this)}
                        city={this.state.city}
                        status1={this.state.status1}
                        status2={this.state.status2}
                        status3={this.state.status3}
                        parentType={this.state.parentType}
                        marginTop={0}
                    ></CitySelector>
                    <Text style={[{width:150},styles.label]}>INDIRIZZO</Text>
                        <TextInput
                            defaultValue={this.state.street}
                            autoCorrect={false}
                            style = {[{borderColor: this.state.streetColor},styles.inputField]}
                            onChangeText={val => this.changeStreet(val)}
                        ></TextInput>
                    {   this.state.streetAlert==true ? 
                                    <Text style={{color: '#DC143C'}}>Inserisci una via </Text> : null
                    }
                    <View>
                        <View style={{flexDirection:"row"}}>
                            <View style={{flexDirection:'column'}}>
                                <Text style={[{width:150, color: this.state.numberColor},styles.label]}>N° Civico</Text>
                                    <TextInput
                                        defaultValue={this.state.number}
                                        underlineColorAndroid='transparent'  
                                        keyboardType={'numeric'}
                                        autoCorrect={false}
                                        style = {[{borderColor: this.state.numberColor, width: 90},styles.inputField]}
                                        onChangeText={val => this.changeNumber(val)}
                                    ></TextInput>
                                {   this.state.numberAlert==true ? 
                                        <Text style={{color: '#DC143C'}}>Inserisci civico</Text> : null
                                }
                                    
                            </View>
                            <View style={{flexDirection:'column'}}>
                                <Text style={[{width:150, color: this.state.capColor},styles.label]}>CAP</Text>
                                    <TextInput
                                        defaultValue={this.state.post_code}
                                        underlineColorAndroid='transparent'  
                                        keyboardType={'numeric'}
                                        autoCorrect={false}
                                        style = {[{borderColor: this.state.capColor, width: 100},styles.inputField]}
                                        onChangeText={val => this.changeCAP(val)}
                                    ></TextInput>
                                {   this.state.capAlert==true ? 
                                        <Text style={{color: '#DC143C'}}>Inserisci CAP</Text> : null
                                }
                            </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column'}}>
                                    <Text style={[{width:150, color: this.state.priceColor},styles.label]}>PREZZO PER NOTTE</Text>
                                        <TextInput
                                            underlineColorAndroid='transparent'  
                                            defaultValue={this.state.price}
                                            keyboardType={'numeric'}
                                            autoCorrect={false}
                                            style = {[{borderColor: this.state.priceColor, width: 100},styles.inputField]}
                                            onChangeText={val => this.changePrice(val)}
                                        ></TextInput>
                                {   this.state.priceAlert==true ? 
                                        <Text style={{color: '#DC143C'}}>Inserisci un prezzo </Text> : null
                                }
                            </View>
                            <View style={{flexDirection:'column'}}>
                                    <Text style={[{width:150, color: this.state.bedsColor},styles.label]}>POSTI LETTO</Text>
                                        <TextInput
                                            underlineColorAndroid='transparent'  
                                            defaultValue={this.state.beds}
                                            keyboardType={'numeric'}
                                            autoCorrect={false}
                                            style = {[{borderColor: this.state.bedsColor, width: 100},styles.inputField]}
                                            onChangeText={val => this.changeBeds(val)}
                                        ></TextInput>
                                {   this.state.bedsAlert==true ? 
                                        <Text style={{color: '#DC143C'}}>Inserisci posti letto</Text> : null
                                }
                            </View>
                        </View>
                    </View>

                    
                    <Text style={[{width:150},styles.label]}>TIPOLOGIA</Text>
                    <View style={styles.typePicker}>
                        <Picker
                            mode="dropdown" 
                            style={styles.pickerstyle}
                            selectedValue={this.state.type}           
                            onValueChange={val => this.changeType(val)}>
                            <Picker.Item label='B&B' value ={'B&B'}></Picker.Item>
                            <Picker.Item label='Casa Vacanze' value ={'Casa Vacanze'}></Picker.Item>
                        </Picker>
                                
                    </View>
                    <Text style={styles.serviceLabel}>-SERVIZI-</Text>
                    <View style={styles.servicesBox}>
                        <CheckBox
                            containerStyle={styles.checkBox}
                            textStyle={styles.textcheckBox}
                            checkedColor={colors.orange}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            title='Colazione inclusa'
                            checked={this.state.fullBoard}
                            onPress={()=>{
                                this.state.fullBoard==false ? this.setState({fullBoard: true}) : this.setState({fullBoard: false})
                            }}
                            
                        />
                        <CheckBox
                            containerStyle={styles.checkBox}
                            textStyle={styles.textcheckBox}
                            checkedColor={colors.orange}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            title='Cucina'
                            checked={this.state.kitchen}
                            onPress={()=>{
                                this.state.kitchen==false ? this.setState({kitchen: true}) : this.setState({kitchen: false})
                            }}
                            
                        />
                        <CheckBox
                            containerStyle={styles.checkBox}
                            textStyle={styles.textcheckBox}
                            checkedColor={colors.orange}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            backgroundColor={colors.green01}
                            title='Aria condizionata'
                            checked={this.state.airConditioner}
                            onPress={()=>{
                                this.state.airConditioner==false ? this.setState({airConditioner: true}) : this.setState({airConditioner: false})
                            }}
                            
                        />
                        <CheckBox
                            containerStyle={styles.checkBox}
                            textStyle={styles.textcheckBox}
                            checkedColor={colors.orange}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            title='Wi-Fi'
                            checked={this.state.wifi}
                            onPress={()=>{
                                this.state.wifi==false ? this.setState({wifi: true}) : this.setState({wifi: false})
                            }}
                        
                        />
                        <CheckBox
                            containerStyle={styles.checkBox}
                            textStyle={styles.textcheckBox}
                            checkedColor={colors.orange}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            title='Parcheggio Auto'
                            checked={this.state.parking}
                            onPress={()=>{
                                this.state.parking==false ? this.setState({parking: true}) : this.setState({parking: false})
                            }}
                        />
                    </View>
                    <Text style={styles.label}>DESCRIZIONE STRUTTURA</Text>
                    <TextInput
                        defaultValue={this.state.description}
                        placeholder={this.state.description}
                        multiline={true}
                        numberOfLines={6}
                        style={styles.description}
                        maxLength={400}
                        onChangeText={val => this.changeDescription(val)}
                    />
                    <Text style={styles.label}>DESCRIZIONE POSIZIONE </Text>
                    <TextInput
                        multiline={true}
                        placeholder= {this.state.location_description}
                        //defaultValue= {this.state.location_description}
                        numberOfLines={6}
                        style={styles.description}
                        maxLength={400}
                        onChangeText={val => this.changeLocationDescription(val)}
                    />
                    <Text style={styles.label}>FOTO DELLA STRUTTURA:</Text>
                    <View style={styles.images}>
                        <View style={styles.image}>
                            <Image source={ this.state.structureImage_1 !== '' ? {uri: this.state.structureImage_1} : require('../img/structure_image.png') } style={styles.structureImage} />
                            <TouchableOpacity style={styles.button} onPress={()=>this.profileImagePickerAsync(1)}>
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
                        <View style={styles.image}>
                            <Image source={ this.state.structureImage_2 !== '' ? {uri: this.state.structureImage_2} : require('../img/structure_image.png') } style={styles.structureImage} />
                            <TouchableOpacity style={styles.button} onPress={()=>this.profileImagePickerAsync(2)}>
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
                        <View style={styles.image}>
                            <Image source={ this.state.structureImage_3 !== '' ? {uri: this.state.structureImage_3} : require('../img/structure_image.png') } style={styles.structureImage} />
                            <TouchableOpacity style={styles.button} onPress={()=>this.profileImagePickerAsync(3)}>
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
                        <View style={styles.image}>
                            <Image source={ this.state.structureImage_4 !== '' ? {uri: this.state.structureImage_4} : require('../img/structure_image.png') } style={styles.structureImage} />
                            <TouchableOpacity style={styles.button} onPress={()=>this.profileImagePickerAsync(4)}>
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
                    <View style={{marginTop: 5}}>
                        {this.state.warning ? <View style={{backgroundColor:colors.white}}>
                            <Text style={styles.warningText}>ERRORE : CONTROLLA CHE TUTTI I DATI SIANO CORRETTI</Text>
                        </View>:null}
                        <Button title="MODIFICA" color={colors.orange} onPress = {()=> {this.postData()}}></Button>
                    </View>
                    
                </ScrollView>
            </View>
        );
    }


}
const styles = StyleSheet.create({
    wrapper: {
        flex:1,
        display: "flex",
        alignContent:'center',
        alignItems:'center',
        backgroundColor: colors.green01,
    },
    titleHeader:{
        fontSize: 28,
        color: colors.white,
        fontWeight: "300",
        margin: 20,
        alignSelf:'center'
    },
    scrollViewWrapper: {
        margin: 10,
        flex: 1,
        width: width*0.8
    },
    label:{
        color: colors.white,
        fontWeight: "700", 
        marginTop: 5,
    },
    inputField: {
        borderBottomWidth: 1,
        paddingTop: 15,
        paddingBottom: 5,
        height: 30,
        backgroundColor: colors.green01,
        borderBottomColor: colors.white,
    },
    pickerstyle:{
        marginTop: 5,
        width:200
    },
    serviceLabel:{
        alignSelf:'center', 
        textAlign:'center', 
        marginTop: 10,
        color: colors.white,
        fontWeight: "700", 

    },
    servicesBox:{
        backgroundColor: colors.white,
        borderRadius: 20,
        margin:5
    },
    checkBox:{
        backgroundColor: colors.white,
        borderWidth:0
    },
    textcheckBox:{
        color: colors.black
    },
    description:{
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.black,
        borderRadius: 8,
    },
    warningText:{
        backgroundColor: colors.white,
        color:colors.red,
        alignSelf:'center',
        fontSize:14,
        fontWeight:"500"
    },
    structureImage:{
        height: 100,
        width: 100,
        alignSelf:'center',
        borderRadius: 8,
    },
    images:{
        flexDirection:'row',
        alignSelf:'center'
    },
    image:{
        flexDirection:'column',
        margin:5
    }
});
