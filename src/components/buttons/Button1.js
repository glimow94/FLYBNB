
import React, { Component } from "react";
import propTypes from "prop-types";
import { Text, View, TouchableHighlight, StyleSheet } from "react-native";
import colors from "../../style/colors/index";




export default class CalendarButton extends Component {
  render() {
    const { text } = this.props;
    const { onPress } = this.props;
    return (
      <TouchableHighlight style={styles.button} onPress={onPress}>
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
      marginLeft:8,
      width:100,
      backgroundColor: colors.green01
    },
    buttonText: {
      fontSize: 16,
      /* fontWeight:500, */
      width: "100%",
      textAlign: "center",
      color: colors.white,
    }
  });