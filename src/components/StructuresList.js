import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';
import colors from "../style/colors/index";
import BookingButton from "../components/buttons/bookingButton";
import { useNavigation } from '@react-navigation/native';
import Structure from "../screens/Structure"


const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Struttura 1',
    price: 34,
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Struttura 2',
    price: 45
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'struttura 3',
    price: 120
  },
  {
    id: '58694a0f-s3da1-471f-bd96-145571e29d72',
    title: 'Struttura 4',
    price: 68
  },
  {
    id: '58694a0f-3dda1-471f-bd96-145571e29d72',
    title: 'Struttura 5',
    price: 50
  },
  
];
function Item({ title,price,id }) {
    const navigation = useNavigation();

  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>{price}€</Text>
      <BookingButton text='Prenota' 
        onPress={()=>navigation.navigate('Structure',{
          /* parametri da passare alla schermata succesiva */
          itemTitle: title,
          itemPrice: price,
          itemID: id
        })}></BookingButton>
    </View>
  );
}

export default function StructuresList() {
   

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} price={item.price} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  item: {
    backgroundColor: colors.white,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderTopRightRadius: 20,
    borderTopLeftRadius:20
  },
  title: {
    fontSize: 18,
  },
  price:{
    paddingTop:8
  },
});