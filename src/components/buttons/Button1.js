
import React, { Component } from "react";
import propTypes from "prop-types";
import { Text, View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import colors from "../../style/colors/index";



var margin = 10;
Platform.OS === 'android' ? margin=2 : margin = 10
export default class CalendarButton extends Component {
  render() {
    const { text, onPress , backgroundColor, opacity, borderColor } = this.props;
    return (
      <TouchableOpacity style={[styles.button, {backgroundColor:backgroundColor, opacity:opacity, borderColor: borderColor}]} onPress={onPress}>
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    );
  }
}
CalendarButton.propTypes = {
  text: propTypes.string.isRequired,
  textColor: propTypes.string,
  backgroundColor: propTypes.string,
  borderColor: propTypes.string,
  onPress: propTypes.func
};

const styles = StyleSheet.create({
    button: {
      paddingVertical: 5,
      paddingHorizontal: 8,
      display: "flex",
      borderRadius: 20,
      borderWidth:3,
      marginLeft:margin,
      width:'auto',
      minWidth:100,
    },
    buttonText: {
      fontSize: 16,
      /* fontWeight:500, */
      width: "100%",
      fontWeight: 'bold',
      textAlign: "center",
      color: colors.secondary,
      marginBottom:4
    }
  });