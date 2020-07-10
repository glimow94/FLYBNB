import React, { Component } from "react";
import { View, Text, TextInput,ScrollView, StyleSheet, Picker } from "react-native";
import colors from "../style/colors/index";
import NextButton from "../components/buttons/Button1";
import BirthDayPicker from "../components/BirthdayPicker"
import CitySelector from "../components/CitySelector"
import { UserContext } from "../components/context";
import { useNavigation } from "@react-navigation/native";
import Login from './Login';

const Signup = ({navigation})=>{

    const [newUserData,setData] = React.useState({
        name:'',
        surname:'',
        birthDay: '',
        birthMonth: '',
        birthYear:'',
        gender:'',// 0 = uomo , 1 = donna
        fiscal_code:'',
        city:'',
        address:'',
        email:'',
        password:''
    })

    const { signUp } = React.useContext(UserContext)

    

    const loginCheck = ()=>{
        //if textInputUsername && textInputPassw == Username && Passw then :
        signUp (newUserData.name, newUserData.surname, newUserData.birthDay,
            newUserData.birthMonth, newUserData.birthYear, newUserData.gender,
            newUserData.fiscal_code, newUserData.city, newUserData.address,
            newUserData.email, newUserData.password);
            navigation.navigate(Login);
    }

    const changeName = (val) => {
        setData({
            ...newUserData,
            name: val
        })
    }

    const changeSurname = (val) => {
        setData({
            ...newUserData,
            surname: val
        })
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
        setData({
            ...newUserData,
            email:val
        })
    }
    const changePassw=(val)=>{
        setData({
            ...newUserData,
            password:val
        })
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
                            style = {styles.inputField}
                            onChangeText={(val) => changeName(val)}
                        ></TextInput>
                    </View>
                    <View style={styles.InputWrapper}>
                        <Text style={[{width:150},styles.label]}>COGNOME</Text>
                        <TextInput
                            autoCorrect={false}
                            style = {styles.inputField}
                            onChangeText={(val) => changeSurname(val)}
                        ></TextInput>
                    </View>
                </View>
                
                <View style={styles.birthdatePickers}>
                <Text style={styles.label}>NATO IL (GG/MM/AA)</Text>
                        <BirthDayPicker
                            selectedYear={2020}
                            selectedMonth={1}
                            selectedDay={27}                            
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
                            style = {styles.inputField}
                            onChangeText={(val) => changeEmail(val)}
                        ></TextInput>
                    </View>
                    <View style={styles.passwordForm}>
                        <View style={styles.InputWrapper}>
                            <Text style={[{width:140},styles.label]}>PASSWORD</Text>
                            <TextInput
                                autoCorrect={false}
                                secureTextEntry={true}
                                style = {styles.inputField}
                                onChangeText={(val)=>changePassw(val)}
                            ></TextInput>
                        </View>
                        <View style={styles.InputWrapper}>
                            <Text style={[{width:140},styles.label]}>RIPETI PASSW</Text>
                            <TextInput
                                autoCorrect={false}
                                secureTextEntry={true}
                                style = {styles.inputField}
                                onChangeText={(val)=>changePassw(val)}
                            ></TextInput>
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
        flex: 1,
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
        color: colors.white,
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