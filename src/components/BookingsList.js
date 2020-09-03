//componente che restituisce le strutture di uno specifico utente
import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';
import colors from "../style/colors/index";
import BookingButton from "../components/buttons/bookingButton";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';


class StructuresList extends Component {
  
   constructor(props){
     
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      userToken: null,
    }
   }
   _isMounted = false;
   componentDidMount = () => {
    this._isMounted = true;
    //get current token
    const itemToken = AsyncStorage.getItem('userToken')
    itemToken.then(token => {
      this.setState({userToken: token})
      console.log("token booking state");
      console.log(this.state.userToken);
      if(this.state.userToken != null){
        const url = `http://localhost:3055/bookings/profile/${this.state.userToken}`;
        axios.get(url, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
            }
          })
          .then(res => {
            console.log(res.data);
            if(this._isMounted){
              const structures = res.data;
              this.setState({
                isLoading:false,
                data: structures
              })
            }
        })
      }
      });
  }

  render(){
    
    const { navigation } = this.props;

    return (
      
      <View style={styles.container}>
        <FlatList
          data= {this.state.data}
          keyExtractor = {(item, index) => index.toString()}
          renderItem = {({item}) =>
            <View style={styles.item}>

                <View style={styles.viewRow}>
                    <Text
                        style={styles.titleStructure}>
                        {item.title}
                    </Text>
                    <Text>{item.name} </Text>
                    <Text>{item.surname} </Text>
                    <Text>{item.email}</Text>
                </View>
                <View style={styles.viewRow}>
                    <Text>{item.type} </Text>
                    <Text>{item.place} </Text>
                </View>
                <View style={styles.viewRow}>
                    <Text>Check-In: {item.checkIn}; </Text>
                    <Text>Check-Out: {item.checkIn}; </Text>
                </View>
                <View style={styles.viewRow}>
                    <Text>days: {item.days}; </Text>
                    <Text>price by night: {item.price} € </Text>
                    <Text>total price: {item.totPrice} € </Text>
                </View>

            </View>}
          contentContainerStyle={{paddingTop:40}}
        />
      </View>
    );
  }
}

export default function(props) {
  const navigation = useNavigation();
  return <StructuresList {...props} navigation={navigation} />;
}

const styles = StyleSheet.create({
  container: {
    flexGrow:1,
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
  },
  item: {
   borderColor: colors.black,
   borderWidth:2,
   borderRadius: 8,
   padding: 5,
   marginTop: 4,
   width: 300,
  },
  titleStructure:{
    fontSize: 20,
    color: colors.black,
  },
  editButton:{
    color: colors.red, 
    fontSize:12, 
    fontWeight: "700",
    padding:4,
    width: 80,
    textAlign:'center',
    alignSelf:'flex-end',
    margin: 2,
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 10
  },
  viewRow: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: 'space-around',
  }
});