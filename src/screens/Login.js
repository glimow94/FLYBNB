import React, { Component } from "react";
import { View, Text, TextInput,ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";
import colors from "../style/colors/index";
import NextButton from "../components/buttons/Button1";
import { useNavigation } from '@react-navigation/native';

import { UserContext } from "../components/context";
import Signup from './Signup';
import AsyncStorage from "@react-native-community/async-storage";
const Login = ()=>{
    const navigation = useNavigation();

    const [data,setData] = React.useState({
        email:'',
        password:'',
        warning: false,
        passWarning : false,
        emailWarning: false,
        emailBorderColor: colors.secondary,
        passwBorderColor: colors.secondary
    })
    const { signIn } = React.useContext(UserContext)
    
    const loginCheck = async (email,password)=>{
        var emailWarning_ = false,
            passWarning_ = false,
            emailBorderColor_ = colors.secondary,
            passwBorderColor_ = colors.secondary;
        if((!data.email || data.email.trim().length == 0) ){
            
            emailWarning_ = true;
            emailBorderColor_ = colors.red;
        
        }
        if((!data.password || data.password.trim().length == 0) ){
            
            passWarning_ = true,
            passwBorderColor_ = colors.red
        
        }
        setData({
            emailWarning : emailWarning_,
            passWarning : passWarning_,
            emailBorderColor: emailBorderColor_,
            passwBorderColor: passwBorderColor_
        })
        if((data.email && data.email.trim().length != 0) && ((data.password && data.password.trim().length != 0)) ){
            signIn(email,password)  
        }

    }

    const changeEmail=(val)=>{
        setData({
            ...data,
            email:val
        })
    }
    const changePassw=(val)=>{
        setData({
            ...data,
            password:val
        })
    }
    const getToken= async ()=>{
        var token = false
        try{
          const myToken = await AsyncStorage.getItem('userToken');
          if(myToken!=null){
            token = myToken
          }
        }catch(e){
          console.log(e)
        }
        return token
      }
    return (
        <View style={styles.wrapper}>
            <Text style={styles.loginHeader}>Accedi ad un profilo esistente</Text>
            <View style={styles.scrollViewWrapper}>
                <ScrollView styles={styles.scrollView}>
                    <View style={styles.InputWrapper}>
                        <Text style={styles.label}>INDIRIZZO E-MAIL</Text>
                        <TextInput
                            autoCorrect={false}
                            style = {[{borderBottomColor:data.emailBorderColor},styles.inputField]}
                            onChangeText={(val) => changeEmail(val)}
                        ></TextInput>
                        {   data.emailWarning==true ? 
                            <Text style={{color:colors.red}}>Inserisci email</Text> : null
                        }
                    </View>
                    <View style={styles.InputWrapper}>
                        <Text style={styles.label}>PASSWORD</Text>
                        <TextInput
                            autoCorrect={false}
                            secureTextEntry={true}
                            style = {[{borderBottomColor:data.passwBorderColor},styles.inputField]}
                            onChangeText={(val)=>changePassw(val)}
                            onKeyPress = {
                                (event) => {
                                  if(event.nativeEvent.key === "Enter"){
                                    loginCheck(data.email,data.password)
                                  }
                                }
                            }
                        ></TextInput>
                        {   data.passWarning==true ? 
                            <Text style={{color:colors.red}}>Inserisci password</Text> : null
                        }
                    </View>
                    {
                        data.warning ? <Text style={styles.warning}>CREDENZIALI ERRATE</Text>:null
                    }
                    <Text> Non hai un account? <Text onPress={()=> navigation.navigate(Signup)} style={styles.accountText} >Iscriviti</Text></Text>
                    <View style = {styles.NextButton}>
                    <NextButton 
                        text = "Accedi"
                        onPress = {
                            /* controllo che username e passw inseriti siano giusti,
                               se lo sono: eseguo signIn  passandogli come argomento il token
                               di autenticazione (sarà l'ID univoco dell'utente)
                            */
                          ()=> loginCheck(data.email,data.password)
                        }
                        backgroundColor={colors.primary}
                        borderColor={colors.secondary}
                    ></NextButton>                    
                </View>
                </ScrollView>

                
                
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        alignItems:'center',
        flex: 1,
        backgroundColor: colors.primary
    },
    scrollViewWrapper: {
        margin: 40,
        flex: 1
    },
    avoidView: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
        flex:1
    },
    loginHeader: {
        fontSize: 28,
        color: colors.secondary,
        fontWeight: "300",
        alignSelf:'center',
        margin: 40
    },
    scrollView:{
        marginBottom: 70,
        height: '80%'
    },
    NextButton:{
        alignItems:'flex-end',
        marginTop:70
    },
    InputWrapper: {
        display: "flex",
        padding: 15,
        marginBottom: 10
    },
    label:{
        color: colors.transparent,
        fontWeight: "700", 
        marginTop: 15,
        marginBottom: 5
    },
    inputField: {
        borderBottomWidth: 1,
        paddingTop: 10,
        height: 40,
        width:200,
        backgroundColor: colors.primary,
    },
    warning:{
        alignSelf:'center',
        color: colors.red,
        fontWeight:"700",
        marginBottom:5
    },
    accountText:{
        color: colors.red, 
        fontSize:14, 
        fontWeight: "700",
        alignSelf:'center'
    }

});
export default Login