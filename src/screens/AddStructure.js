import React, { Component } from "react";
import { View, Text, TextInput,ScrollView, StyleSheet, Picker,Button,Dimensions, TextPropTypes  } from "react-native";
import { CheckBox } from 'react-native-elements';
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
export default class AddStructure extends Component{
    
    constructor(props){
        const {userToken} = props.route.params;
        super(props);
        this.state={
            title : '',
            user_id: '',
            type:'B&B',
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
        //stati che in realtà in questa pagina non servono ma servono a cityselector che è un componente usato anche in Home e deve avere questi 3 status necessariamente, altrimenti da errore
        status1: true,
        status2:false,
        status3:false,
        parentType: 'AddStructure'//serve a cityselector per agire in modo diverso in base al componente padre che lo richiama (addStructure o Home)

        }
    }

    changeTitle = (val) => {
        
        if(!val || val.trim().length === 0){
            this.setState({
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
        if(!val || val.trim().length === 0){
            this.setState({
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
        if(!val || val.trim().length === 0){
            this.setState({
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
        if(!val || val.trim().length === 0){
            this.setState({
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
    updateState(filterStatus){
        this.setState(filterStatus)
    }

    componentDidMount = () => {
        const {userToken} = this.props.route.params;
        console.log('userTokenAddStructure')
        console.log(userToken)
        this.setState({user_id: userToken})

    }
    postData = () => {
        const url = `http://localhost:3055/structures/add`;
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

    render(){

        return (
            <View style={styles.wrapper}>
                <Text style={styles.titleHeader}>Aggiungi una nuova Struttura</Text>
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
                    <View style={{flexDirection:"row", paddingBottom: 8}}>
                        <View style={{flexDirection:'column'}}>
                            <Text style={[{width:150, color: this.state.numberColor},styles.label]}>N° Civico</Text>
                                <TextInput
                                    underlineColorAndroid='transparent'  
                                    keyboardType={'numeric'}
                                    autoCorrect={false}
                                    style = {[{borderColor: this.state.numberColor, width: 90},styles.inputField]}
                                    onChangeText={val => this.changeNumber(val)}
                                ></TextInput>
                                
                        </View>
                        <View style={{flexDirection:'column'}}>
                            <Text style={[{width:150, color: this.state.capColor},styles.label]}>CAP</Text>
                                <TextInput
                                    underlineColorAndroid='transparent'  
                                    keyboardType={'numeric'}
                                    autoCorrect={false}
                                    style = {[{borderColor: this.state.capColor, width: 100},styles.inputField]}
                                    onChangeText={val => this.changeCAP(val)}
                                ></TextInput>
                                
                        </View>
                    </View>
                    <View style={{flexDirection:"row",paddingBottom: 5}}>
                        <View style={{flexDirection:'column'}}>
                                <Text style={[{width:150, color: this.state.capColor},styles.label]}>PREZZO A NOTTE</Text>
                                    <TextInput
                                        underlineColorAndroid='transparent'  
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
                                <Text style={[{width:150, color: this.state.capColor},styles.label]}>POSTI LETTO</Text>
                                    <TextInput
                                        underlineColorAndroid='transparent'  
                                        keyboardType={'numeric'}
                                        autoCorrect={false}
                                        style = {[{borderColor: this.state.bedsColor, width: 100},styles.inputField]}
                                        onChangeText={val => this.changeBeds(val)}
                                    ></TextInput>
                            {   this.state.bedsAlert==true ? 
                                    <Text style={{color: '#DC143C'}}>Inserisci il numero di letti </Text> : null
                            }
                        </View>
                    </View>
                    <Text style={[{width:150},styles.label]}>TIPOLOGIA</Text>
                    <View style={styles.typePicker}>
                        <Picker 
                            mode="dropdown" 
                            style={styles.pickerstyle}            
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
                    <View style={{marginTop: 5}}>
                        <Button title="CONFERMA" color={colors.orange} onPress = {()=> {this.postData()}}></Button>
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
        borderRadius: 8
    }
});
