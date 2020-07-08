import React from 'react';
import { StyleSheet, Text, View  } from 'react-native';
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
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Logout" component={MainTab}/>
        <Drawer.Screen name="Home" component={MainTab}/>
        <Drawer.Screen name='Profilo' component={Profile}/>
      </Drawer.Navigator>
    </NavigationContainer>
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
