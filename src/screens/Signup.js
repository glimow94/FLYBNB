import React, { Component } from "react";
import { View, Text, TextInput,ScrollView, StyleSheet, Picker, Dimensions, Platform } from "react-native";
import colors from "../style/colors/index";
import NextButton from "../components/buttons/Button1";
import BirthDayPicker from "../components/BirthdayPicker"
import { UserContext } from "../components/context";
import db from '../components/database_region_city';

/* valori responsive per il picker della città (Residente a..) */
var {width} = Dimensions.get('window');
var height =  width;


var pickerHeight= 40;
var pickerWidth = 200;
var pickerPosition = 'relative';
var pickerBottom = 0;
var addressInputWidth = 400;
if( Platform.OS === 'android' || Dimensions.get('window').width < 700){
    pickerHeight=40;
    pickerWidth=150;
    pickerPosition='relative';
    pickerBottom=10;
    width = width;
    height = height*0.9;
    addressInputWidth = width*0.8
}else{
    width = width*0.6;
    height = height*0.3;
}
//pagina di registrazione utente
const Signup = ({navigation})=>{

    const [newUserData,setData] = React.useState({
        name:'',
        surname:'',
        birthDay: '01',
        birthMonth: '01',
        birthYear:'2000',
        gender: '0',// 0 = uomo , 1 = donna
        city:'',
        address:'',
        email:'',
        password:'',
        repassw: '',
        validation: false,

        //stati utili alla validazione del form NOME E COGNOME
        nameAlert: null,
        nameColor: colors.white,
        surnameAlert:false,
        surnameColor: colors.white,
        //stati per la validazione dell'indirizzo
        addressColor: colors.white,
        addressAlert: false,
        //stati utili alla validazione del form per la PASSWORD
        passwColor: colors.white,
        repasswColor: colors.white,
        passwordAlert: false, //se la password non rispetta i criteri minimi di validazione tramite regex
        passwordAlert2: false, //se le password sono diverse diventa true e compare un avviso
        
        //stati utili alla validazione del form per l'EMAIL
        emailColor: colors.white,
        emailAlert: false,
        //stati del cityPicker
        region: 'Regione',
        province: 'Provincia',
        comune: 'Comune',
        province_code: '',
        city_code: '',
        // status(1/2/3) è il valore che rende visibile/invisibile il menu delle regioni,province o città
        status1: false,
        status3: false,
        status2: false,
    })

    //regex per la validazione
    //PASSSWORD: deve contenere almeno 6 caratteri(max 20),almeno un carattere maiusoclo,uno minuscolo e un numero
    const passwordRegex = new RegExp("^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$");
    const emailRegex = new RegExp("[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}");
    const {signUp} = React.useContext(UserContext);
    const {getSignUpError} = React.useContext(UserContext);
    const validationCheck=()=>{
        var error = false;
        if(
              (newUserData.name=='' || newUserData.name.trim().length === 0)
           || (newUserData.surname=='' || newUserData.surname.trim().length === 0)
           || (newUserData.city=='' || newUserData.city.trim().length === 0)
           || (newUserData.email=='' || newUserData.email.trim().length === 0)
           || (newUserData.password=='' || newUserData.password.trim().length === 0)
           || (newUserData.password != newUserData.repassw)
            
        ){
            error = true;
        }
        return error;
    }    

    const loginCheck = async ()=>{
        var error = validationCheck();
        if(
            error == false
        ){  
            signUp (
                newUserData.name, 
                newUserData.surname, 
                newUserData.birthDay,
                newUserData.birthMonth, 
                newUserData.birthYear, 
                newUserData.gender,
                newUserData.fiscal_code, 
                newUserData.city, 
                newUserData.address,
                newUserData.email, 
                newUserData.password,
                navigation
            );
        }
        else{
            alert('Completa correttamente tutti i campi')
        }
    }

    const changeName = (val) => {
        
        if(!val || val.trim().length === 0){
            setData({
                ...newUserData,
                name:'',
                nameColor: '#DC143C',
                nameAlert:true
            })
        }
        else{
            setData({
                ...newUserData,
                name: val,
                nameColor: colors.white,
                nameAlert: false
            })
        }
    }
    const changeSurname = (val) => {
        if(!val || val.trim().length === 0){
            setData({
                ...newUserData,
                surname:'',
                surnameColor: '#DC143C',
                surnameAlert:true
            })
        }
        else{
            setData({
                ...newUserData,
                surname:val,
                surnameColor: colors.white,
                surnameAlert: false
            })
        }
    }
    const changeAddress = (val) => {
        if(!val || val.trim().length === 0){
            setData({
                ...newUserData,
                address:'',
                addressColor: '#DC143C',
                addressAlert:true
            })
        }
        else{
            setData({
                ...newUserData,
                address:val,
                addressColor: colors.white,
                addressAlert: false
            })
        }
    }
    

    const changeBirthDay = (val) => {
        setData({
            ...newUserData,
            birthDay: val
        })
    }

    const changeBirthMonth = (val) => {
        setData({
            ...newUserData,
            birthMonth: val
        })
    }

    const changeBirthYear = (val) => {
        setData({
            ...newUserData,
            birthYear: val
        })
    }

    const changeGender = (val) => {
        setData({
            ...newUserData,
            gender: val
        })
    }

    const changeEmail=(val)=>{
        var mail= val.toUpperCase()
        if(emailRegex.test(mail)==false){
            setData({
                ...newUserData,
                email:'',
                emailColor: '#DC143C',
                emailAlert:true
            })
        }
        else{
            setData({
                ...newUserData,
                emailColor: colors.white,
                emailAlert: false,
                email: mail
            })
        }
    }
    const changePassw=(val)=>{
        if(passwordRegex.test(val)==false){
            setData({
                ...newUserData,
                password:'',
                passwColor: '#DC143C',
                passwordAlert:true
            })
        }
        else{
            setData({
                ...newUserData,
                passwColor: colors.white,
                passwordAlert: false,
                password:val
            })
        }
    }
    const changeRepassw=(val)=>{
        if(val != newUserData.password){
            setData({
                ...newUserData,
                repassw : val,
                repasswColor: colors.red,
                passwordAlert2: true
            })
        }
        else{
            setData({
                ...newUserData,
                repassw: val,
                repasswColor: colors.white,
                passwordAlert2: false
            })
            
        }
    }
    const showHideCitySelector = () =>{
        if(newUserData.status1==true){
            setData({
                ...newUserData,
                status1:false
            })
        }
        else{
            setData({
                ...newUserData,
                status1:true       
            })
        }
    }
    return (
        <View style={styles.wrapper}>
            <Text style={styles.signupHeader}>Registrati per accedere a tutte le funzionalità di flyBNB</Text>
            <ScrollView style={styles.scrollViewWrapper}>

                <View style={styles.addressForm}>
                    <View style={styles.InputWrapper}>
                        <Text style={[{width:150},styles.label]}>NOME</Text>
                        <TextInput
                            autoCorrect={false}
                            style = {[{borderColor: newUserData.nameColor},styles.inputField]}
                            onChangeText={(val) => changeName(val)}
                        ></TextInput>
                        {   newUserData.nameAlert==true ? 
                            <Text style={{color: colors.red}}>Inserisci un nome</Text> : null
                        }
                    </View>
                    <View style={styles.InputWrapper}>
                        <Text style={[{width:150},styles.label]}>COGNOME</Text>
                        <TextInput
                            autoCorrect={false}
                            style = {[{borderColor: newUserData.surnameColor},styles.inputField]}
                            onChangeText={(val) => changeSurname(val)}
                        ></TextInput>
                        {   newUserData.surnameAlert==true ? 
                            <Text style={{color:colors.red}}>Inserisci un cognome</Text> : null
                        }
                    </View>
                </View>
                
                <View style={styles.birthdatePickers}>
                <Text style={styles.label}>NATO IL (GG/MM/AA)</Text>
                        <BirthDayPicker
                            selectedYear={newUserData.birthYear}
                            selectedMonth={newUserData.birthMonth}
                            selectedDay={newUserData.birthDay}   
                            maxYears = {(new Date()).getFullYear()}                         
                            onYearValueChange={(year,i)=>changeBirthYear(year)}
                            onMonthValueChange={(month,i) => changeBirthMonth(month)}
                            onDayValueChange={(day,i) =>changeBirthDay(day)}
                        ></BirthDayPicker>
                </View>
                <Text style={styles.label}>GENERE</Text>
                <View style={{flexDirection:'row'}}>
                    <View style={styles.genderPicker}>

                            <Picker 
                                mode="dropdown" 
                                style={styles.pickerstyle}            
                                onValueChange={(val) => changeGender(val)}>
                                <Picker.Item label='Uomo' value ={0}></Picker.Item>
                                <Picker.Item label='Donna' value ={1}></Picker.Item>
                            </Picker>
                    </View>
                    <View style={styles.citylabel}>
                        <Text style={styles.label}>RESIDENTE A</Text>
                        <View>
                            <Text style={styles.alternativeCityButton} onPress={showHideCitySelector}>{newUserData.city.substring(0,20)}</Text>
                            <View style={styles.citySelector}>
                            { newUserData.status1 ?
                             <View>
                                <View style={{flexDirection:'row'}}>
                                    <Picker mode="dropdown" 
                                            style={styles.cityPickerStyle}
                                            onValueChange={itemValue => setData({
                                                                            ...newUserData,
                                                                            region: itemValue,
                                                                            province: 'Provincia',
                                                                            city:'',
                                                                            status2: true
                                                                        })
                                                        }
                                    >
                                        <Picker.Item label={newUserData.region} value ={newUserData.region}></Picker.Item>

                                        {
                                        db.map((item) =>{
                                            return(
                                            <Picker.Item  label={item.nome} value={item.nome} key={item.nome}/> 
                                            );
                                        })
                                        }
                                    </Picker>
                                    {Platform.OS === 'web' ?<Text style={styles.cancelButton} onPress={showHideCitySelector}>X</Text>:null}
                                 </View>
                            {
                            newUserData.status2 ? 
                                <Picker 
                                    mode="dropdown" 
                                    style={styles.cityPickerStyle}
                                    onValueChange={
                                    itemValue => setData({
                                                    ...newUserData,
                                                    province: itemValue,
                                                    comune:'Comune',
                                                    status3: true
                                    })}
                                >
                                <Picker.Item label={newUserData.province} value ={newUserData.province}></Picker.Item>
                                
                                {
                                    db.map((item) =>{
                                    if(item.nome == newUserData.region){
                                        return (
                                        item.province.map((item_prov)=>{
                                            return(
                                            <Picker.Item label = {item_prov.nome} value={item_prov.nome} key={item_prov.code} />
                                            );
                                        } 
                                        ))
                                    }}
                                    /* return(
                                        <Picker.Item  label={item.nome} value={item.nome} key={item.nome}/> 
                                    ); */
                                    )
                                }
                                </Picker> : null
                            }
                            {
                            newUserData.status3 ? 
                                <Picker 
                                    mode="dropdown" 
                                    style={styles.cityPickerStyle}
                                    onValueChange={itemValue => setData({
                                                                    ...newUserData,
                                                                    city:itemValue,
                                                                    comune:itemValue,
                                                                    status1:false
                                    })}
                                >
                                <Picker.Item label={newUserData.comune} value ={newUserData.comune}></Picker.Item>

                                {
                                    db.map((item) =>{
                                    if(item.nome == newUserData.region){
                                        return (
                                        item.province.map((item_prov)=>{
                                            if(item_prov.nome==newUserData.province){
                                            return(
                                                item_prov.comuni.map((item_comuni)=>{
                                                newUserData.city_code = item_comuni.code
                                                return(
                                                <Picker.Item label = {item_comuni.nome} value={item_comuni.nome} key={item_comuni.code} />
                                                )
                                            })
                                            );}
                                        })
                                        )
                                    }
                                    }
                                    /* return(
                                        <Picker.Item  label={item.nome} value={item.nome} key={item.nome}/> 
                                    ); */
                                    )
                                }
                                </Picker> : null
                            }{Platform.OS === 'android' ?<Text style={styles.cancelButton2} onPress={showHideCitySelector}>chiudi</Text>:null}

                            </View> : null
                            }
                            </View>
                        </View>
                    </View>
                    
                </View>
                <View style={styles.InputWrapper}>
                        <Text style={styles.label}>INDIRIZZO</Text>
                        <TextInput
                            autoCorrect={false}
                            style = {[{borderColor: newUserData.addressColor},{width: addressInputWidth},styles.inputField]}
                            onChangeText={(val) => changeAddress(val)}
                        ></TextInput>
                        {   newUserData.addressAlert==true ? 
                            <Text style={{color: colors.red}}>Inserisci un'indirizzo </Text> : null
                        }
                    </View>
                <View styles={styles.authenticationForm}>
                    <View style={styles.InputWrapper}>
                        <Text style={styles.label}>INDIRIZZO E-MAIL</Text>
                        <TextInput
                            autoCorrect={false}
                            style = {[{borderColor: newUserData.emailColor},{width: addressInputWidth},styles.inputField]}
                            onChangeText={(val) => changeEmail(val)}
                        ></TextInput>
                        {   newUserData.emailAlert==true ? 
                            <Text style={{color:colors.red}}>Inserisci un'e-mail valida </Text> : null
                        }
                    </View>
                    <View style={styles.passwordForm}>
                        <View style={styles.InputWrapper}>
                            <Text style={[{width:140},styles.label]}>PASSWORD</Text>
                            <TextInput
                                autoCorrect={false}
                                secureTextEntry={true}
                                style = {[
                                    {borderColor:newUserData.passwColor},
                                    styles.inputField]
                                }
                                onChangeText={(val)=>changePassw(val)}
                            ></TextInput>
                            {   newUserData.passwordAlert==true ? 
                                <Text style={{color: colors.red}}>Inserisci una password di: {'\n'} almeno sei caratteri {'\n'} con almeno un numero </Text> : null
                            }
                        </View>
                        <View style={styles.InputWrapper}>
                            <Text style={[{width:140},styles.label]}>RIPETI PASSW</Text>
                            <TextInput
                                autoCorrect={false}
                                secureTextEntry={true}
                                style = {[
                                    {borderColor:newUserData.repasswColor},
                                    styles.inputField]
                                }
                                onChangeText={(val)=>changeRepassw(val)}
                            ></TextInput>
                            {   newUserData.passwordAlert2==true ? 
                                <Text style={{color: colors.red}}>Password diverse</Text> : null
                            }
                        </View>
                    </View>
                    
                    
                </View>
               
                <View style = {styles.NextButton}>
                    <NextButton 
                        text = "Iscriviti"
                        onPress = {()=> {loginCheck()}}
                        backgroundColor={colors.primary}
                        borderColor={colors.secondary}
                    ></NextButton>
                </View>
            </ScrollView>
            
        </View>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        flex:1,
        alignContent:'center',
        alignItems:'center',
        backgroundColor: colors.primary
    },
    scrollViewWrapper: {
        flex: 1,
        alignSelf:'center'
    },
    signupHeader: {
        fontSize: 22,
        color: colors.transparent,
        fontWeight: "300",
        margin: 40
    },
    addressForm:{
        flex:1,
        flexDirection:'row'
    },
    passwordForm:{

        flexDirection:'row'
    },
    authenticationForm:{
        marginBottom: 5,
        height: '80%'
    },
    NextButton:{
        alignItems:'flex-end',
        padding:40
    },
    InputWrapper: {
        display: "flex",
        paddingRight:10,
        marginBottom: 5
    },

    label:{
        color: colors.secondary,
        fontWeight: "700", 
        width: 150,
        marginTop: 5,
    },
    citylabel:{
        fontWeight: "700", 
        width: 150,
        marginTop: 0,
        marginLeft:35,
        bottom: 24
    },
    inputField: {
        borderBottomWidth: 1,
        paddingTop: 15,
        paddingBottom: 5,
        height: 40,
        backgroundColor: colors.primary,
        borderBottomColor: colors.secondary
    },
    genderPicker:{
        width:120,
        height: 40,
        margin:5,
        marginLeft:0,
        marginTop:0
    },
    birthdatePickers:{
        
    },
    container: {
        flexDirection:'column',
      },
    citySelector:{
       paddingBottom:10,
    },
    alternativeCityButton:{
        width: 170,
        borderBottomWidth: 1,
        height: 19,
        marginTop: 15,
        borderBottomColor: colors.secondary
    },
    cancelButton:{
        color:colors.red,
        fontSize: 18,
        fontWeight: "700",
    },
    cancelButton2:{
        color:colors.red,
        fontSize: 18,
        fontWeight: "700",
        bottom:10,
        alignSelf:'center'
    },
    cityPickerStyle:{
        height: pickerHeight,
        width: pickerWidth,
        position: pickerPosition,
        bottom: pickerBottom,
    }
});
export default Signup