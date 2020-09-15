
import React, { Component } from "react";
import propTypes from "prop-types";
import { Text, View, TouchableHighlight, StyleSheet, Platform } from "react-native";
import colors from "../../style/colors/index";



var margin = 8;
Platform.OS === 'android' ? margin=2 : null
export default class CalendarButton extends Component {
  render() {
    const { text, onPress , backgroundColor, opacity } = this.props;
    return (
      <TouchableHighlight style={[{backgroundColor:backgroundColor, opacity:opacity},styles.button]} onPress={onPress}>
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableHighlight>
    );
  }
}
CalendarButton.propTypes = {
  text: propTypes.string.isRequired,
  textColor: propTypes.string,
  backgroundColor: propTypes.string,
  onPress: propTypes.func
};

const styles = StyleSheet.create({
    button: {
      padding: 5,
      display: "flex",
      borderRadius: 20,
      borderWidth: 3,
      borderColor: colors.white,
      marginLeft:margin,
      width:100,
    },
    buttonText: {
      fontSize: 16,
      /* fontWeight:500, */
      width: "100%",
      textAlign: "center",
      color: colors.white,
      marginBottom:4
    }
  });