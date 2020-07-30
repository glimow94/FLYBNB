import React, { Component } from "react";
import { View, Text, TextInput,ScrollView, StyleSheet, Picker, TextPropTypes } from "react-native";
import colors from "../style/colors/index";
import NextButton from "../components/buttons/Button1";
import BirthDayPicker from "../components/BirthdayPicker"
import CitySelector from "../components/CitySelector"
import { UserContext } from "../components/context";
import { useNavigation } from "@react-navigation/native";
import Login from './Login';
//pagina di registrazione utente
const Signup = ({navigation})=>{

    const [newUserData,setData] = React.useState({
        name:'',
        surname:'',
        birthDay: '1',
        birthMonth: '1',
        birthYear:'2000',
        gender: '0',// 0 = uomo , 1 = donna
        city:'',
        address:'',
        email:'',
        password:'',
        validation: false,

        //stati utili alla validazione del form NOME E COGNOME
        nameAlert: null,
        nameColor: colors.white,
        surnameAlert:false,
        surnameColor: colors.white,

        //stati utili alla validazione del form per la PASSWORD
        passwColor: colors.white,
        repasswColor: colors.white,
        passwordAlert: false, //se la password non rispetta i criteri minimi di validazione tramite regex
        passwordAlert2: false, //se le password sono diverse diventa true e compare un avviso
        
        //stati utili alla validazione del form per l'EMAIL
        emailColor: colors.white,
        emailAlert: false
        

    })

    //regex per la validazione
    //PASSSWORD: deve contenere almeno 6 caratteri(max 20),almeno un carattere maiusoclo,uno minuscolo e un numero
    const passwordRegex = new RegExp("^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$")
    const emailRegex = new RegExp("[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}")
    const nameRegex = new RegExp("/^\s+$/")
    const { signUp } = React.useContext(UserContext)

    const validationCheck=()=>{
        if(
              (newUserData.name=='' || newUserData.name.trim().length === 0)
           || (newUserData.surname=='' || newUserData.surname.trim().length === 0)
           || (newUserData.city=='' || newUserData.city.trim().length === 0)
           || (newUserData.email=='' || newUserData.email.trim().length === 0)
           || (newUserData.password=='' || newUserData.password.trim().length === 0)
            
        ){
            setData({
                ...newUserData,
                validation: false
            })
        }
        else{
            setData({
                ...newUserData,
                validation: true 
            })
        }
    }    

    const loginCheck = ()=>{
        console.log(
            newUserData.name, 
                newUserData.surname, 
                newUserData.birthDay,
                newUserData.birthMonth, 
                newUserData.birthYear, 
                newUserData.gender,
                newUserData.city, 
                newUserData.email, 
                newUserData.password
        )
        validationCheck()
        if(
            newUserData.validation == true
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
                newUserData.password
                );
                navigation.navigate(Login);
            }
        else{
            alert('Completa correttamente tutti i campi')
        }
    }

    const changeName = (val) => {
        
        if(!val || val.trim().length === 0){
            setData({
                ...newUserData,
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


    const changeCity = (val) => {
        setData({
            ...newUserData,
            city: val
        })
    }

    const changeEmail=(val)=>{
        var mail= val.toUpperCase()
        if(emailRegex.test(mail)==false){
            setData({
                ...newUserData,
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
                repasswColor: '#DC143C',
                passwordAlert2: true
            })
        }
        else{
            setData({
                ...newUserData,
                repasswColor: colors.white,
                passwordAlert2: false
            })
            
        }
    }
    return (
        <View style={styles.wrapper}>
            <Text style={styles.signupHeader}>Registrati per usufruire di tutte le funzionalità di flyBNB</Text>
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
                            <Text style={{color: '#DC143C'}}>Inserisci un nome valido </Text> : null
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
                            <Text style={{color: '#DC143C'}}>Inserisci un cognome valido </Text> : null
                        }
                    </View>
                </View>
                
                <View style={styles.birthdatePickers}>
                <Text style={styles.label}>NATO IL (GG/MM/AA)</Text>
                        <BirthDayPicker
                            selectedYear={newUserData.birthYear}
                            selectedMonth={newUserData.birthMonth}
                            selectedDay={newUserData.birthDay}                            
                            onYearValueChange={(year,i)=>changeBirthYear(year)}
                            onMonthValueChange={(month,i) => changeBirthMonth(month)}
                            onDayValueChange={(day,i) =>changeBirthDay(day)}
                        ></BirthDayPicker>
                </View>
                <Text style={styles.label}>SESSO</Text>
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
                        <Text style={[{width:150},styles.label]}>RESIDENTE A</Text>
                        <TextInput
                            autoCorrect={false}
                            style = {styles.inputField}
                            onChangeText={(val) => changeCity(val)}
                        ></TextInput>
                    </View>
                </View>

                <View styles={styles.authenticationForm}>
                    <View style={styles.InputWrapper}>
                        <Text style={styles.label}>INDIRIZZO E-MAIL</Text>
                        <TextInput
                            autoCorrect={false}
                            style = {[{borderColor: newUserData.emailColor},styles.inputField]}
                            onChangeText={(val) => changeEmail(val)}
                        ></TextInput>
                        {   newUserData.emailAlert==true ? 
                            <Text style={{color: '#DC143C'}}>Inserisci un'e-mail valida </Text> : null
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
                                <Text style={{color: '#DC143C'}}>Inserisci una password di: {'\n'} almeno sei caratteri {'\n'} con almeno un numero </Text> : null
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
                                <Text style={{color: '#DC143C'}}>Le password devono corrispondere</Text> : null
                            }
                        </View>
                    </View>
                    
                    
                </View>
               
                
            </ScrollView>
            <View style = {styles.NextButton}>
                    <NextButton 
                        text = "Iscriviti"
                        onPress = {()=> {loginCheck()}}
                    ></NextButton>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        flex:1,
        display: "flex",
        alignContent:'center',
        alignItems:'center',
        backgroundColor: colors.green01
    },
    scrollViewWrapper: {
        margin: 10,
        flex: 1
    },
    signupHeader: {
        fontSize: 28,
        color: colors.white,
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
        color: colors.white,
        fontWeight: "700", 
        width: 150,
        marginTop: 5,
    },
    citylabel:{
        fontWeight: "700", 
        width: 150,
        marginTop: 5,
        marginLeft:35,
        bottom: 24
    },
    inputField: {
        borderBottomWidth: 1,
        paddingTop: 15,
        paddingBottom: 5,
        height: 40,
        backgroundColor: colors.green01,
        borderBottomColor: colors.white
    },
    genderPicker:{
        width:120,
        height: 40,
        margin:5,
        marginLeft:0,
        marginTop:0
    },
    birthdatePickers:{
        
    }

});
export default Signup