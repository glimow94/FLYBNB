
import React, { Component } from "react";
import propTypes from "prop-types";
import { Text, View, TouchableHighlight, StyleSheet } from "react-native";
import colors from "../../style/colors/index";




export default class ConfirmButton extends Component {
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
ConfirmButton.propTypes = {
  text: propTypes.string.isRequired,
  textColor: propTypes.string,
  backgroundColor: propTypes.string,
  onPress: propTypes.func
};

const styles = StyleSheet.create({
    button: {
      padding: 6,
      display: "flex",
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.green01,
      width:40,
      height: 30
    },
    buttonText: {
      fontSize: 12,
      fontWeight: "700",
      width: "100%",
      textAlign: "center",
      color: colors.green01,
    }
  });