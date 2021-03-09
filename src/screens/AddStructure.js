import React, { Component } from "react";
import { View, Text, TextInput,ScrollView, StyleSheet, Picker,Button,Dimensions, TextPropTypes, TouchableOpacity, Image, Platform  } from "react-native";
import { CheckBox } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import { Icon } from 'react-native-elements';
import colors from "../style/colors/index";
import CitySelector from "../components/CitySelector"
import axios from "axios";
import host from '../configHost';
import dateConverter from '../components/dateConverter';

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
export default class AddStructure extends Component{
    
    constructor(props){
        const {userToken} = props.route.params;
        super(props);
        this.state={
            title : '',
            user_id: '',
            type:'B&B',
            region:'',
            province:'',
            city:'',
            street:'',
            number:'',
            post_code:'',
            price:'',
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
            start_date: '',
        
            //variabili per la validazione
            titleAlert: false,
            titleColor: colors.white,
            //indirizzo
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
            //numero di letti
            bedsAlert: false,
            bedsColor: colors.white,
            //warning se qualche credenziale è sbagliata quando si clicca conferma
            warning:false,
            //stati che in realtà in questa pagina non servono ma servono a cityselector che è un componente usato anche in Home e deve avere questi 3 status necessariamente, altrimenti da errore
            status1: false,
            status2:false,
            status3:false,
            parentType: 'AddStructure'//serve a cityselector per agire in modo diverso in base al componente padre che lo richiama (addStructure o Home)

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
                number: '',
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
        
        if((!val || val.trim().length === 0)){
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
        if(!val || val.trim().length === 0 || parseInt(val) <1 || parseInt(val) > 20 ){
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
        else{
            //convertiamo in base64
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
        const {userToken} = this.props.route.params;
        console.log('userTokenAddStructure')
        console.log(userToken)
        this.setState({user_id: userToken})

    }

    async postData(){
        if((!this.state.title || this.state.title.trim().length === 0) || 
            (!this.state.city || this.state.city.trim().length === 0) ||
            (!this.state.street || this.state.street.trim().length === 0) ||
            (!this.state.post_code || this.state.post_code.trim().length === 0)||
            (!this.state.number || this.state.number.trim().length === 0 || this.state.number <1) ||
            (!this.state.beds || this.state.beds.trim().length === 0 || this.state.beds <1)||
            (!this.state.price || this.state.price.trim().length === 0 || this.state.price <1)){
                this.setState({
                    warning:true
                })
            }
        else{
            await this.addStructurePost();
            this.props.navigation.goBack()/* ,{
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
            } */
        }
        
    }

    async addStructurePost(){
        var start_date = new Date(), //data di creazione della struttura
            start_dateString = dateConverter(start_date);
        const url = `http://${host.host}:3055/structures/add`;
        axios.post(url, {
                method: 'POST',
                headers: {
                'content-type': 'application/json',   
                },
                user_id: parseInt(this.state.user_id),
                title: this.state.title,
                type: this.state.type,
                place: this.state.region +','+this.state.province+','+this.state.city,
                street: this.state.street,
                number: parseInt(this.state.number),
                post_code: this.state.post_code,
                description: this.state.description,
                location_description: this.state.location_description,
                beds: parseInt(this.state.beds),
                price: this.state.price,
                fullboard: this.state.fullBoard,
                wifi: this.state.wifi,
                parking: this.state.parking,
                kitchen: this.state.kitchen,
                airConditioner: this.state.airConditioner,
                image1: this.state.structureImage_1,
                image2: this.state.structureImage_2,
                image3: this.state.structureImage_3,
                image4: this.state.structureImage_4,
                start_date: start_dateString
            })
            .then(res => {
                alert('Struttura Creata con Successo')
                })
            .catch(function (error) {
                console.log(error);
            });
    }

    render(){

        return (
            <View style={styles.wrapper}>
                <Text style={styles.titleHeader}>Aggiungi Struttura</Text>
                <ScrollView style={styles.scrollViewWrapper}>

                    <Text style={[{width:150},styles.label]}>NOME STRUTTURA</Text>
                                <TextInput
                                    autoCorrect={false}
                                    style = {[{borderColor: this.state.titleColor},styles.inputField]}
                                    onChangeText={val => this.changeTitle(val)}
                                ></TextInput>
                    {   this.state.titleAlert==true ? 
                                    <Text style={{color: '#DC143C'}}>Inserisci un nome valido </Text> : null
                    }
                    
                    <Text style={[{width:150},styles.label]}>CITTA</Text>
                    <CitySelector
                        updateState={this.updateState.bind(this)}
                        city={this.state.city}
                        region={this.state.region}
                        province={this.state.province}
                        status1={this.state.status1}
                        status2={this.state.status2}
                        status3={this.state.status3}
                        parentType={this.state.parentType}
                        marginTop={0}
                    ></CitySelector>
                    <Text style={[{width:150},styles.label]}>INDIRIZZO</Text>
                        <TextInput
                            autoCorrect={false}
                            style = {[{borderColor: this.state.streetColor},styles.inputField]}
                            onChangeText={val => this.changeStreet(val)}
                        ></TextInput>
                    {   this.state.streetAlert==true ? 
                                    <Text style={{color: '#DC143C'}}>Inserisci una via valida </Text> : null
                    }
                    <View style={{padding:3}}>
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
                            <Picker.Item label="B&B" value ={'B&B'}></Picker.Item>
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
                            title='Pensione Completa'
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
                        multiline={true}
                        numberOfLines={6}
                        style={styles.description}
                        maxLength={400}
                        onChangeText={val => this.changeDescription(val)}
                    />
                    <Text style={styles.label}>DESCRIZIONE POSIZIONE </Text>
                    <TextInput
                        multiline={true}
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
                        <Button title="CONFERMA" color={colors.green02} onPress = {()=> {this.postData()}}></Button>
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
        marginTop: 5,
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
        fontSize: 20,
        marginTop: 10,
        color: colors.secondary,
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
        height: 100,
        width: 100,
        alignSelf:'center',
        borderRadius: 8,
        width:imageDim,
        height:imageDim
    },
    images:{
        flexDirection:'row',
        alignSelf:'center'
    },
    image:{
        flexDirection:'column',
        margin:5,
      
    }
});
