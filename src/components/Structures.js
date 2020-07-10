import React, { Component } from "react";
import { SafeAreaView, View, FlatList, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import axios from "axios";

export default class Structures extends Component {
    constructor(){
        super();
        this.state = {
            data: []
        }
    }

    registrationPost = () => {
        const url = `http://192.168.43.188:3055/users/registration`;
        axios.post(url, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            name: this.state.name,
            email: this.state.email
          })
          .then(res => {
            console.log(res);
            })
          .catch(function (error) {
            console.log(error);
          });
            this.state.input1 = '';
            this.state.input2 = '';
    }

    render(){
        const dataMySQL = this.state.data.map((item, index)=>{
            var arrayData = {
                name: item.name,
                email: item.email
            }
            return <Text style={{fontSize:20,fontWeight:'bold'}} key={index}>{arrayData}</Text>;
            })
        return(
        <View>
            <View style={{flexDirection:'column', alignItems:'center'}}>

                <Text style={{marginTop:20, fontSize:25, fontWeight:'bold' }}>
                RN ♥ Express ♥ MySQL
                </Text>

                <TextInput
                placeholder='name...'
                style={{height: 55, width: 350, fontSize: 15}}
                onChangeText={(name) => this.setState({name})}
                value={this.name}
                />

                <TextInput
                placeholder='email...'
                style={{height: 55, width: 350, fontSize: 15}}
                onChangeText={(email) => this.setState({email})}
                value={this.email}
                />
            </View>

            <View style={{flexDirection:'row', justifyContent:'center'}}>
                <TouchableOpacity
                style={{
                    backgroundColor:'blue', borderRadius:10,
                    flex:1, width:100, height:50, margin:20,
                    flexDirection:'row', justifyContent:'center',
                    alignItems:'center'
                    }}
                onPress={this.registrationPost.bind(this)}
                >
                <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>
                POST
                </Text>
                </TouchableOpacity>
            </View>

            <View style={{flexDirection:'column',alignItems:'center'}}>
                {dataMySQL}
            </View>
        </View>
        );
    }
}