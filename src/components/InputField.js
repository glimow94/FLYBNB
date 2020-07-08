import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import propTypes from "prop-types";
import { TextInput } from "react-native-paper";
import colors from "../style/colors/index"

export default class InputField extends Component {
  render() {
    const { 
        text,
        labelColor,
        inputType,
        labelTextSize
    } = this.props;

    const color = labelColor || colors.white;
    const fontSize = labelTextSize || 14;

    return (
      <View style={styles.wrapper}>
        <Text style={[{color, fontSize},styles.label]}>{text}</Text>
        <TextInput
            autoCorrect={false}
            style = {styles.inputField}
            secureTextEntry={inputType === "password"}
        ></TextInput>
      </View>
    );
  }
}
InputField.propTypes={
    labelText: propTypes.string.isRequired
}
const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        padding: 15,
        marginBottom: 10
    },
    label: { 
        fontWeight: "700", 
        marginTop: 5
    },
    inputField: {
        borderBottomWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        height: 20,
        backgroundColor: colors.green01,
        borderBottomColor: colors.white
    }
});