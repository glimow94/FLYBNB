import React, { Component } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from "../style/colors/index";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import SearchBar from "../components/SearchBar";
import DateSelector from "../components/DateSelector";
import FilterSelector from "../components/FilterSelector";
import StructuresList from "../components/StructuresList";
import StructureLIstProva from "../components/provaStruttureLista"
import StructureListDB from "../components/StructureListDB"

import {
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  Button,
  SafeAreaView
} from 'react-native';
import CitySelector from '../components/CitySelector';
import PriceSelector from '../components/PriceSelector';



export default class Home extends Component{
  constructor(props){
    super(props);
    this.state={
      kitchen: false,
      fullBoard: false,
      airConditioner:false,
      wifi:false,
      parking:false,
      city:'Luogo',
      price: 'Prezzo',
      //status per gestire la comparsa/scomparsa dei componenti che appiono quando si premono i bottoni dei filtri  
      parentType:'Home', //questo parametro cambia il bottone per cambiare città a seconda che ci si trovi in Home oppure in SignUp o AddStructure(la pagina per aggiungere una struttura)
      status1 : false,
      status2: false,
      status3:false,
      //valore della barra di ricerca SearchBar.js
      selectedName: ''
    }
  }
  
  updateState(filterStatus){
    this.setState(filterStatus)
  } 
  

  render()
    {
      return (
        <View style={styles.container}>
          
          <View style={styles.searchHeader}>
            <Image
              style={styles.logo}
              source={require('../img/logo_green.png')}
            />
            <SearchBar
              updateState={this.updateState.bind(this)}
            ></SearchBar>
          </View>

          <Text style={styles.titleStyle}>
                Come possiamo aiutarti?
          </Text>

          <View style={styles.buttonGroup}>
                <CitySelector
                  updateState={this.updateState.bind(this)}
                  city={this.state.city}
                  status1={this.state.status1}
                  status2={this.state.status2}
                  status3={this.state.status3}
                  parentType={this.state.parentType}
                ></CitySelector>
                <PriceSelector
                  updateState={this.updateState.bind(this)}
                  price={this.state.price}
                  status1={this.state.status1}
                  status2={this.state.status2}
                  status3={this.state.status3}
                
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
                ></FilterSelector>
          </View>

          <View style={styles.structuresList}>
            {/* <StructureListDB
               kitchen={this.state.kitchen}
               fullBoard={this.state.fullBoard}
               airConditioner={this.state.airConditioner}
               wifi={this.state.wifi}
               parking={this.state.parking}
               city={this.state.city}    
               price={this.state.price}
            ></StructureListDB> */}
            {
              this.state.city != 'Luogo'?
              <StructuresList
                kitchen={this.state.kitchen}
                fullBoard={this.state.fullBoard}
                airConditioner={this.state.airConditioner}
                wifi={this.state.wifi}
                parking={this.state.parking}
                city={this.state.city}    
                price={this.state.price}
                selectedStructureName={this.state.selectedName}
              ></StructuresList>: <View styles={styles.footer}>
                                    <Text style={styles.footerText}>BENVENUTO SU FLYBNB</Text>
                                    <Text style={styles.footerText2}>Seleziona il luogo in cui intendi pernottare</Text>
                                </View> 
            }
          </View>

        </View>
    )
  }
}

const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor: colors.green01,
      height:'100%'
    },
    searchHeader:{
      marginTop: 10,
      flexDirection:'row',
      padding:0,
      backgroundColor: colors.green01
    },
    logo:{
      width:80,
      height:90,
      marginTop: 0,
      marginBottom: 0,
    },
    scrollStyle:{
      flex: 1, 
      backgroundColor: colors.green01, 
      paddingTop: 0
    },
    titleStyle:{
      fontSize: 24,
      fontWeight: "700",
      paddingHorizontal: 20,
      paddingTop:20,
      position: 'relative',
      bottom: 18
    },
    buttonGroup:{
      width:'100%',
      flexDirection: "row",
      justifyContent:'center',
      alignContent:'center',
      padding: 10
    },
    structuresList:{
      flex:1,
      top:10,
      width: '100%',
      alignItems:'center',
      alignContent:'center'

    },
    footer:{
      marginBottom:10,
      margin: 20
    },
    footerText:{
        fontSize: 24,
        color: colors.white,
        fontWeight: "500",
        paddingTop:20,
        marginLeft:10
    },
    footerText2:{
      fontSize: 20,
        color: colors.white,
        fontWeight: "300",
        position: 'relative',
        margin:10,
        alignSelf:'center'
    }
});