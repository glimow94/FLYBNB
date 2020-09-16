import React , {useEffect}from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Platform  } from 'react-native';
import { Icon } from 'react-native-elements';
//navigazione
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';
import host from './src/configHost';
//screens e components
import colors from "./src/style/colors/index"

import MainTab from "./src/screens/MainTab";
import MainTabWeb from "./src/screens/MainTabWeb";
import NoLoggedStack from "./src/screens/NoLoggedStack";
import NoLoggedStackWeb from './src/screens/NoLoggedStackWeb'

import { UserContext }from "./src/components/context";
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
  useEffect(() => {
    var userToken = null;
    // code to run on component mount
    async function getToken(){
      try{
        const oldToken = await AsyncStorage.getItem('userToken')
        if(oldToken!=null){
          //abbiamo il token
          userToken=oldToken
          dispatch({type : 'LOGIN', id: userToken, token : userToken })
        }
      }catch(e){
        console.log(e)
      }
    }
    getToken()

  }, [])
  //funzione reducer per gestione Login
  // ...prevState è il valore dello stato  alla callback setState prima che venga eseguita
  //NB: le 'action' in redux inviano informazioni allo STORE js (lo stato dello store si modifica solo in risposta ad un'azione)
  //gli oggetti dello STORE sono accessibili globalmente nell'app richiamando AsyncStorage.getItem('item')
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

    signIn: async(email,password) =>{
      let userToken;
      userToken=null;
      var status;
      const url = `http://${host.host}:3055/users/login`;

      axios.post(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          email: email,
          password: password
        })
        .then(res => {
          status = res.status
          console.log(res.status);
          console.log(res.data[0]);
          console.log(res.data[0].id);
          if(res.status == 200){
            console.log("login success");
            AsyncStorage.multiSet([['userToken', res.data[0].id.toString()],['name',res.data[0].name],['surname',res.data[0].surname],['email', res.data[0].email],['birthdate', res.data[0].date], ['city', res.data[0].city]])
            userToken=AsyncStorage.getItem('userToken');
            dispatch({type : 'LOGIN', id: email, token : userToken });
          }
          })
        .catch(function (error) {
          console.log(error);
        });
    },

    signOut: async() =>{
      try{ //tolgo il token nell'asyncstorage quando faccio il logout
          await AsyncStorage.removeItem('userToken')
        } catch(e){
          console.log(e)
        }
      dispatch({type:'LOGOUT'});
    },

    signUp: (name, surname, birthDay, birthMonth, birthYear,
            gender, fiscal_code, city, address, email, password) => {

              const url = `http://${host.host}:3055/users/registration`;
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

    getUserToken:()=>{
      console.log(loginState.userToken)
      return loginState.userToken

    }

  }), [])

  //se il token non è null allora è stato effettuato il login, quindi viene renderizzato MainTab
  //altrimenti viene renderizzato NoLoggedStack che comprende la pagina di login/signIn e la Home in cui si possono solo vedere le strutture
  return (
    <UserContext.Provider value = {userContext}>
      {Platform.OS === 'web'?
        <NavigationContainer>
        { loginState.userToken == null ? 
           <NoLoggedStackWeb></NoLoggedStackWeb> : <MainTabWeb></MainTabWeb>
        }
      </NavigationContainer>
      : <NavigationContainer>
        {loginState.userToken == null ?
          <NoLoggedStack></NoLoggedStack> : <MainTab></MainTab>
        }
      </NavigationContainer>  
    }
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
