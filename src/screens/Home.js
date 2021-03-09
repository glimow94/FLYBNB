import React, { Component,  } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from "../style/colors/index";
import AsyncStorage from '@react-native-community/async-storage';

import SearchBar from "../components/SearchBar";

import FilterSelector from "../components/FilterSelector";
import StructuresList from "../components/StructuresList";
import TypeSelector from "../components/TypeSelector";
import PriceSelector from '../components/PriceSelector';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  ImageBackground
} from 'react-native';
import { Button } from 'react-native-paper';

var screen_padding =  0;

Platform.OS === 'web' && Dimensions.get('window').width > 700 ? screen_padding = 100 : null;

class Home extends Component{
  constructor(props){
    super(props);
    this.state={
      kitchen: false,
      fullBoard: false,
      airConditioner:false,
      wifi:false,
      parking:false,
      price: 'Prezzo',
      token : null, //se token non è null il pulsante LOGIN diventa quello per accedere al PROFILO
      //filtri per tupi di alloggio (beb o casa vacanze) e posti letto disponibili
      type:'Qualsiasi',
      beds:0, //se beds = 0 allora cerca alloggi con qualsiasi numero di posti letto

      //status per gestire la comparsa/scomparsa dei componenti che appaiono quando si premono i bottoni dei filtri  
      parentType:'Home', //questo parametro cambia lo stile del bottone per cambiare città a seconda che ci si trovi in Home oppure in SignUp o AddStructure(la pagina per aggiungere una struttura)
      status1 : false,
      status2: false,
      status3:false,
      status4:false,
      //valore della barra di ricerca SearchBar.js
      searchBarText: '',
      structuresDATA : []
    }
  }
  
  updateState(filterStatus){
    this.setState(filterStatus)
  } 

  async getToken(){
    try{
      const myToken = await AsyncStorage.getItem('userToken');
      
      if(myToken!=null){
        this.setState({
          token : myToken
        })
      }
    }catch(e){
      console.log(e)
    }
  }

  componentDidMount(){
    this.getToken()
    console.log(this.state.token)
  }

  render(){
    const { navigation } = this.props;
      return (
        /* Rendering della Home : il codice seguente renderizza prima la lista delle strutture e successivamente dichiara l'header con la barra di ricerca
          e i pulsanti dei filtri, questo perchè su react native non è possibile usare zIndex per far visualizzare un elemento sopra un altro (in questo caso ci serve 
          che le view che appaiono quando si premono i pulsanti dei filtri stiano 'sopra' la lista delle strutture, l'unico modo è dichiarare prima
          cioè che deve stare 'sotto' un altro elemento) quindi utilizziamo position:absolute per l'header (classe style: headerWrapper)
          posizionandolo in alto anche se dichiarato dopo, e applicando un marginTop alla structure list (classe style: structureList)... */
        <ImageBackground source={require('../img/home2.jpg')} imageStyle={{opacity:0.7}} style={styles.structuresList}style={styles.container}>
            <View style={styles.structuresList}>
              {
                this.state.searchBarText.trim().length != 0 ?
                  <StructuresList
                    kitchen={this.state.kitchen}
                    fullBoard={this.state.fullBoard}
                    airConditioner={this.state.airConditioner}
                    wifi={this.state.wifi}
                    parking={this.state.parking}
                    price={this.state.price}
                    type={this.state.type}
                    beds={this.state.beds}
                    structuresDATA = {this.state.structuresDATA}
                    searchBarText={this.state.searchBarText}
                  ></StructuresList> 
                : 
                  <View style={styles.homeScreen}>
                    <Text style={styles.homeScreenText1}>Benvenuto su FlyBNB</Text>
                    <Text style={styles.homeScreenText2}>Trova l'alloggio perfetto per la tua vacanza,</Text>
                    <Text style={styles.homeScreenText2}>Scegli fra i nostri BnB e le nostre Case Vacanze sparse in tutta Italia.</Text>
                  </View>
              }
            </View>
            <View style={[this.state.searchBarText.trim().length != 0 ? {paddingBottom:50} : null, styles.headerWrapper]}>
              {
                Platform.OS == 'web' && Dimensions.get('window').width > 700 ? 
                <Text style={styles.titleStyle}>Dove vuoi andare?</Text>
                  : 
                <Text style={styles.titleStyle}>Dove vuoi andare?</Text>
              }
              <View style={styles.searchHeader}>
                  <SearchBar
                      updateState={this.updateState.bind(this)}
                  ></SearchBar>
              {
                this.state.searchBarText.length == 0 ? <Text style={styles.infoText}>Cerca un Luogo o una Struttura</Text>
                :
                <View style={{flexDirection:'row', alignItems:'center',alignSelf:'center',alignContent:'center'}}>
                  <Text style={styles.infoText}>Ricerca per "{this.state.searchBarText}"</Text>
                  <TouchableOpacity 
                    style={styles.deleteCurrentSearchButton}
                    onPress={()=>this.setState({ price:'Prezzo',kitchen: false,fullBoard: false,airConditioner:false,wifi:false,parking:false,type:'Qualsiasi',beds:0,searchBarText:'',})}
                  >
                    <Text style={styles.deleteSearchText}>Annulla Ricerca</Text>
                </TouchableOpacity>
                </View>
              }
            </View>
            </View>
            <View style={styles.buttonGroup}>
              <TypeSelector
                updateState={this.updateState.bind(this)} 
                type={this.state.type}
                beds={this.state.beds}
                status1={this.state.status1}
                status2={this.state.status2}
                status3={this.state.status3}
                status4={this.state.status4}
                city={this.state.city}
                searchBarText={this.state.searchBarText}
              ></TypeSelector>
              <PriceSelector
                updateState={this.updateState.bind(this)}
                price={this.state.price}
                status1={this.state.status1}
                status2={this.state.status2}
                status3={this.state.status3}
                status4={this.state.status4}
                searchBarText={this.state.searchBarText}
              ></PriceSelector>
              <FilterSelector 
                updateState={this.updateState.bind(this)} 
                kitchen={this.state.kitchen}
                fullBoard={this.state.fullBoard}
                airConditioner={this.state.airConditioner}
                wifi={this.state.wifi}
                parking={this.state.parking}
                status1={this.state.status1}
                status2={this.state.status2}
                status3={this.state.status3}
                status4={this.state.status4}
                city={this.state.city}
                searchBarText={this.state.searchBarText}
              ></FilterSelector>
            </View>
          </ImageBackground>
    )
  }
}
// Wrap and export
export default function(props) {
  const navigation = useNavigation();

  return <Home navigation={navigation} />;
}
const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor: colors.primary,
      height:'100%',
    },
    searchHeader:{
      alignContent:'center',
      alignItems:'center',
    },
    titleStyle:{
      fontSize:  28,
      fontWeight: "700",
      marginVertical: 10,
      position: 'relative',
      color: colors.black2
    },
    buttonGroup:{
      width:'100%',
      flexDirection: "row",
      justifyContent:'center',
      alignContent:'center',
      position:'absolute',
      alignSelf:'center',
      marginTop: 145,
      margin:4
    },
    headerWrapper:{
      position:'absolute',
      alignSelf:'center',
      alignContent:'center',
      alignItems:'center',
      width:'100%',
      backgroundColor: colors.primaryTransparent,
      borderBottomWidth:3,
      borderBottomColor: colors.secondary
    },
    structuresList:{
      flex:1,
      width:'100%',
      marginTop:200,
      alignItems:'center',
      alignContent:'center',
    }, 
    infoText:{
      fontSize: 15,
      color: colors.black,
      fontWeight: "400",
      position: 'relative',
      margin:5,
      alignSelf:'center',  
    },
    deleteSearchText:{
      fontSize: 12,
      color: colors.white,
      fontWeight: "300",
      position: 'relative',
      margin:2,
      alignSelf:'center',   
    },
    deleteCurrentSearchButton:{
      backgroundColor:colors.red,
      borderRadius:8,
      marginLeft: 5,
      width:100,
      height:20,
    },
    homeScreen:{
      padding: 20,
      margin:10,
      backgroundColor: colors.transparent3,
      borderRadius: 20,
      width: '90%',
      paddingVertical: 50
    },
    homeScreenText1:{
      fontWeight: 'bold',
      color: colors.black,
      fontSize: 30,
      marginBottom: 50
    },
    homeScreenText2:{
      fontWeight: 'bold',
      color: colors.transparent,
      fontSize: 22,
      marginVertical: 10
    },
    
});