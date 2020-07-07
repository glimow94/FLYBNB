
import React, { Component } from "react";
import propTypes from "prop-types";
import { Text, View, TouchableHighlight, StyleSheet } from "react-native";
import colors from "../../style/colors/index";




export default class ConfirmButton extends Component {
  render() {
    const { text } = this.props;
    const { onPress } = this.props;
    const {backgroundColor} = this.props;
    return (
      <TouchableHighlight style={styles.button} onPress={onPress}>
        <Text style={[styles.buttonText, {backgroundColor: this.props.backgroundColor}]}>{text}</Text>
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
      padding: 5,
      display: "flex",
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.orange,
      marginTop:15,
      marginBottom: 5,
      width:100,
    },
    buttonText: {
      fontSize: 14,
    /*   fontWeight:700, */
      width: "100%",
      textAlign: "center",
      color: colors.orange,
    }
  });