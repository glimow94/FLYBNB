import React, { Component } from "react";
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";
import colors from "../style/colors/index";
import InputField from "../components/InputField";
import NextButton from "../components/buttons/Button1";

export default class Login extends Component {
  render() {
    return (
        <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
            <Text style={styles.loginHeader}>Accedi ad un profilo esistente</Text>
            <View style={styles.scrollViewWrapper}>
                <ScrollView styles={styles.scrollView}>
                    <InputField 
                        text="INDIRIZZO EMAIL"
                        labelTextColor={colors.white}
                        textColor={colors.green01}
                        inputType="email"
                    ></InputField>
                    <InputField 
                        text="PASSWORD"
                        labelTextColor={colors.white}
                        textColor={colors.green01}
                        inputType="password"
                    ></InputField>
                    
                </ScrollView>
                <View style = {styles.NextButton}>
                    <NextButton text = "Accedi "></NextButton>
                </View>
                
            </View>
        </KeyboardAvoidingView>
    );
  }
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
      }
});