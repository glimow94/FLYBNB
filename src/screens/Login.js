import React, { Component } from "react";
import { View, Text, TextInput,ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";
import colors from "../style/colors/index";
import NextButton from "../components/buttons/Button1";

import { UserContext } from "../components/context";

const DATA={ //username e password di prova, come se fosse il database
    username: 'flybnb',
    password: 'chucknorris',
    id: '007' //id di user sarà il token da passare alla funzione signIn 
}
const Login = ({navigation})=>{

    const [data,setData] = React.useState({
        email:'',
        password:''
    })
    const { signIn } = React.useContext(UserContext)
    

    const loginCheck = (email,password)=>{
        //if textInputUsername && textInputPassw == Username && Passw then :
        signIn(email,password);
    }

    const changeEmail=(val)=>{
        setData({
            ...data,
            email:val
        })
        console.log(data.email)
    }
    const changePassw=(val)=>{
        setData({
            ...data,
            password:val
        })
        console.log(data.password)

    }
    return (
        <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
            <Text style={styles.loginHeader}>Accedi ad un profilo esistente</Text>
            <View style={styles.scrollViewWrapper}>
                <ScrollView styles={styles.scrollView}>
                    <View style={styles.InputWrapper}>
                        <Text style={styles.label}>INDIRIZZO E-MAIL</Text>
                        <TextInput
                            autoCorrect={false}
                            style = {styles.inputField}
                            onChangeText={(val) => changeEmail(val)}
                        ></TextInput>
                    </View>
                    <View style={styles.InputWrapper}>
                        <Text style={styles.label}>PASSWORD</Text>
                        <TextInput
                            autoCorrect={false}
                            secureTextEntry={true}
                            style = {styles.inputField}
                            onChangeText={(val)=>changePassw(val)}
                        ></TextInput>
                    </View>
                    
                </ScrollView>
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
                    ></NextButton>
                </View>
                
            </View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flex: 1,
        backgroundColor: colors.green01
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
        color: colors.white,
        fontWeight: "300",
        margin: 40
      },
      scrollView:{
         marginBottom: 70
      },
      NextButton:{
          alignItems:'flex-end',
      },
      InputWrapper: {
        display: "flex",
        padding: 15,
        marginBottom: 10
    },
      label:{
          color: colors.white,
          fontWeight: "700", 
          marginTop: 15,
          marginBottom: 10
      },
      inputField: {
        borderBottomWidth: 1,
        paddingTop: 10,
        paddingBottom: 5,
        height: 20,
        backgroundColor: colors.green01,
        borderBottomColor: colors.white
    }

});
export default Login