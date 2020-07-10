import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator  } from 'react-native';
import { Icon } from 'react-native-elements';
//navigazione
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';


//screens e components
import LoggedOut from "./src/screens/LoggedOut";
import colors from "./src/style/colors/index"
import Home from './src/screens/Home';
import Structure from "./src/screens/Structure";
import Profile from "./src/screens/Profile"
import Explore from "./src/screens/Explore"
import MainTab from "./src/screens/MainTab"
import NoLoggedStack from "./src/screens/NoLoggedStack"

import { UserContext }from "./src/components/context"
import axios from "axios";


const HomeStack = createStackNavigator();
const Drawer = createDrawerNavigator();


/* const HomeStackScreen = ({navigation}) =>(
      <HomeStack.Navigator>
        <HomeStack.Screen name="Logout" component={LoggedOut} />
        <HomeStack.Screen name="Home" component={Home} options={
          {
            name:'rowing',
            headerLeft:()=>(
              <Icon
              
                name='list'
                type='font-awesome'
                color='#f50'
                onPress={() => navigation.openDrawer()}
                color={colors.black} />
            )
          }
        } />
        <HomeStack.Screen name="Structure" component={Structure} />
      </HomeStack.Navigator>
);

 */



export default function App() {
  /* isLoading serve per l'effetto di caricamento
     userToken è il token identificativo dell'utente*/

  //const [userToken, setUserToken] = React.useState(null);

  //UTILIZZIAMO REDUX PER GESTIRE IL LOGIN
  const initialLoginState = {
    email: null,
    userToken: null,
  }

  //funzione reducer per gestione Login
  // ...prevState è il valore dello stato  alla callback setState prima che venga eseguita
  //NB: le 'action' in redux inviano informazioni allo STORE js (lo stato dello store si modifica solo in risposta ad un'azione)
  
  const loginReducer = (prevState, action) => {
    switch(action.type){
      case 'LOGIN' :
        return{
          ...prevState,
          email: action.id, //action.email??
          userToken: action.token,
        };
      case 'LOGOUT' :
        return{
          ...prevState,
          email: null,
          userToken: null
        };
      case 'REGISTER' :
        return{
          ...prevState,
          email: action.id, //action.email??
          usertoken: action.token,
        };  
    }
  }
  //NB : in redux la funzione dispatch innesca un cambiamento dello stato
  const [loginState,dispatch] = React.useReducer(loginReducer,initialLoginState)

  const userContext = React.useMemo(()=>({

    signIn: (email,password) =>{
      let userToken;
      userToken=null;

      if(email == '' && password == ''){
        userToken = email;
      }
      dispatch({type : 'LOGIN', id: email, token : userToken })
    },

    signOut: () =>{
      dispatch({type:'LOGOUT'});
    },

    signUp: (name, surname, birthDay, birthMonth, birthYear,
            gender, fiscal_code, city, address, email, password) => {

              const url = `http://192.168.43.188:3055/users/registration`;
              axios.post(url, {
                  method: 'POST',
                  headers: {
                    'content-type': 'application/json',
                  },
                  name: name,
                  surname: surname,
                  email: email,
                  date: birthDay+"/"+birthMonth+"/"+birthYear,
                  gender: gender,
                  city: city,
                  address: address,
                  password: password
                })
                .then(res => {
                  console.log(res);
                  })
                .catch(function (error) {
                  console.log(error);
                });
    },

    loginCheck:()=>{
      if(loginState.userToken!=null){
        return true;
      }
      else{
        return false
      }
    }

  }), [])

  //se il token non è null allora è stato effettuato il login, quindi viene renderizzato MainTab
  //altrimenti viene renderizzato NoLoggedStack che comprende la pagina di login/signIn e la  in cui si possono solo vedere le strutture
  return (
    <UserContext.Provider value = {userContext}>
      <NavigationContainer>
        { loginState.userToken != null ? 
          <MainTab></MainTab> : <NoLoggedStack></NoLoggedStack>
        }
      </NavigationContainer>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green01,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuicon:{
    margin: 15
  }
});
