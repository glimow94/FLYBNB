import React, { Component } from "react";
import { View, Text, TextInput,ScrollView, StyleSheet, Picker,Button,Dimensions,TouchableOpacity, Image, Platform  } from "react-native";
import { CheckBox } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import { Icon } from 'react-native-elements';
import colors from "../style/colors/index";
import axios from "axios";
import host from '../configHost'


let {imageDim} = 0;
var {width} = Dimensions.get('window');
var height = Dimensions.get('window').height;
if(Platform.OS === 'web' && Dimensions.get('window').width > 700){
    imageDim = 100;
    width= width *0.5;
    height= height*0.6;
}else{
    imageDim = 50;
    height = height*0.8
}

//pagina di registrazione struttura
export default class EditStructure extends Component{
    
    constructor(props){
        super(props);
        this.state={
            id: '',
            title : '',
            user_id: '',
            type:'B&B',
            region:'',
            province:'',
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
    componentDidMount = () => {
        const {
            userToken,
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
            locationDescription,
            image1,
            image2,
            image3,
            image4,
        } = this.props.route.params;

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
            structureImage_1:image1,
            structureImage_2:image2,
            structureImage_3:image3,
            structureImage_4:image4
        })
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
        if(!val || val.trim().length === 0 || parseInt(val) <1 || parseInt(val)>30){
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
        
        this.setState({
            location_description: val
        })
    }
    profileImagePickerAsync = async (index) => {
        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
        // verifica permessi di accesso alla gallery
        if (permissionResult.granted === false) {
          alert("È necessario attivare i permessi della fotocamera!");
          return;
        }
    
        let pickerResult = await ImagePicker.launchImageLibraryAsync({base64:true});
        if (pickerResult.cancelled === true) {
          return; // operazione abortita
        }
        

        if (Platform.OS === 'web') {

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
            let source =  'data:image/jpeg;base64,'+pickerResult.base64
            // remoteUri è null per un device mobile
            if(index == 1){
                this.setState({
                    structureImage_1 : source
                })
            }
            if(index == 2){
                this.setState({
                    structureImage_2 : source
                })
            }
            if(index == 3){
                this.setState({
                    structureImage_3 : source
                })
            }
            if(index == 4){
                this.setState({
                    structureImage_4 : source
                })
            }
        }
    };
    updateState(filterStatus){
        this.setState(filterStatus)
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
            const url = `http://${host.host}:3055/structures/update/${this.state.id}`;
            axios.post(url, {
                method: 'POST',
                headers: {
                'content-type': 'application/json',   
                },
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
                airConditioner: this.state.airConditioner,
                image1: this.state.structureImage_1,
                image2: this.state.structureImage_2,
                image3: this.state.structureImage_3,
                image4: this.state.structureImage_4
            })
            .then(res => {
                console.log(res);
                })
            .catch(function (error) {
                console.log(error);
            });
        
            this.props.navigation.navigate('Profile')/* ,{
                userToken: this.state.user_id,
                itemID: this.state.id,
                itemName: this.state.title,
                itemTitle: this.state.title,
                itemPrice: this.state.price,
                itemPlace: this.state.city,
                itemStreet: this.state.street,
                itemNumber: this.state.number,
                itemPostCode: this.state.post_code,
                itemBeds: this.state.beds,
                itemType: this.state.type,
                itemKitchen: this.state.kitchen,
                itemFullBoard: this.state.fullBoard,
                itemAirConditioner: this.state.itemAirConditioner,
                itemWifi: this.state.wifi,
                itemParking: this.state.parking,
                itemDescription: this.state.description,
                locationDescription: this.state.location_description,
                image1: this.state.structureImage_1,
                image2 : this.state.structureImage_2,
                image3: this.state.structureImage_3,
                image4 : this.state.structureImage_4
            }); */
        }
    }

    render(){

        return (
            <View style={styles.wrapper}>
                <Text style={styles.titleHeader}>Modifica la tua Struttura</Text>
                <ScrollView style={styles.scrollViewWrapper}>
                    <View style={styles.sensibleInfoWrapper}>
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Informazioni sensibili non modificabili</Text>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{color: colors.blue}}>Luogo: </Text>
                            <Text>{this.state.city}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{color: colors.blue}}>Via: </Text>
                            <Text>{this.state.street} {this.state.number}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{color: colors.blue}}>CAP: </Text>
                            <Text>{this.state.post_code}</Text>
                        </View>
                    </View>
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
                    
                    <View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column'}}>
                                    <Text style={[{width:150, color: this.state.priceColor},styles.label]}>PREZZO PER NOTTE</Text>
                                        <TextInput
                                            underlineColorAndroid='transparent'  
                                            defaultValue={this.state.price.toString()}
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
                                            defaultValue={this.state.beds.toString()}
                                            keyboardType={'numeric'}
                                            autoCorrect={false}
                                            style = {[{borderColor: this.state.bedsColor, width: 100},styles.inputField]}
                                            onChangeText={val => this.changeBeds(val)}
                                        ></TextInput>
                                {   this.state.bedsAlert==true ? 
                                        <View><Text style={{color: '#DC143C'}}>Inserisci posti letto</Text><Text style={{color:'#DC143C'}}>(MAX 20)</Text></View> : null
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
                            checked={this.state.fullBoard == 0 ? false : true}
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
                            checked={this.state.kitchen==0 ? false : true}
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
                            checked={this.state.airConditioner == 0 ? false : true}
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
                            checked={this.state.wifi ==0 ? false : true}
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
                            checked={this.state.parking == 0 ? false : true}
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
                        defaultValue= {this.state.location_description}
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
                </ScrollView>
                <View style={{marginVertical: 5, minWidth:300}}>
                    {this.state.warning ? <View style={{backgroundColor:colors.white}}>
                        <Text style={styles.warningText}>ERRORE : CONTROLLA CHE TUTTI I DATI SIANO CORRETTI</Text>
                    </View>:null}
                    <Button title="MODIFICA" color={colors.red} onPress = {()=> {this.postData()}}></Button>
                </View>
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
        backgroundColor: colors.primary,
    },
    sensibleInfoWrapper: {
        alignSelf:'center', 
        borderColor: colors.transparent, 
        borderWidth: 2, 
        borderRadius: 10, 
        padding: 10, 
        marginVertical: 10
    },
    titleHeader:{
        fontSize: 28,
        color: colors.secondary,
        fontWeight: "300",
        margin: 20,
        alignSelf:'center'
    },
    scrollViewWrapper: {
        margin: 10,
        width: width*0.9,
        height: height
    },
    label:{
        color: colors.transparent,
        fontWeight: "700", 
        marginTop: 10,
    },
    inputField: {
        borderBottomWidth: 1,
        paddingTop: 15,
        paddingBottom: 5,
        height: 40,
        backgroundColor: colors.primary,
        borderBottomColor: colors.secondary,
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
        borderWidth:2,
        borderColor: colors.orange,
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
        borderColor: colors.secondary,
        borderRadius: 8
    },
    warningText:{
        backgroundColor: colors.white,
        color:colors.red,
        alignSelf:'center',
        fontSize:14,
        fontWeight:"500"
    },
    structureImage:{
        height: imageDim,
        width: imageDim,
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
