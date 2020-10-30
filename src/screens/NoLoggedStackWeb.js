import React, {Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import colors from "../style/colors/index";
import { Icon } from 'react-native-elements';


import Home from './Home';
import LoggedOut from './LoggedOut';
import Login from './Login';
import Signup from './Signup';
import Structure from "../screens/Structure"
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default class NoLoggedScreenWeb extends Component{
    render()
    {    return (
            <Drawer.Navigator
                initialRouteName="Home"
                activeColor= {colors.green01}
                inactiveColor={colors.black}
                shifting={true}
                hideStatusBar={true}
                style={{ backgroundColor: colors.black }}>
                <Drawer.Screen
                    name="Logout"
                    component={NoLoggedStack}
                    options={{
                        tabBarColor :colors.green02,
                        tabBarLabel: 'Accesso',
                        tabBarIcon: ({ color }) => (
                        <Icon name="work" color={color} size={26} />
                    ),
                }}
                />
            </Drawer.Navigator>
            )
    }
}

const NoLoggedStack = ({navigation}) => (
    <Stack.Navigator
    screenOptions={{
        headerStyle: {
          backgroundColor: colors.tertiary,
          height: 60
        },
        headerRight : () =>(
          <View style={{alignContent:'center',alignItems:'center'}}>
                <TouchableOpacity onPress={()=>navigation.navigate('Access')} style={styles.accessButton}> 
                    <Icon
                      size={40}
                      style={styles.icon}
                      name='user'
                      type='font-awesome'
                      color={colors.white}
                  /><Text style={styles.accessText}>ACCEDI</Text>
                </TouchableOpacity>
          </View>
        ),
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen 
          name="Structure" 
          component={Structure} 
          options={({route}) => ({title: route.params.itemTitle+' - '+route.params.itemType})} 
          />
        <Stack.Screen name = "Access" component={LoggedOut} />
        <Stack.Screen name = "Login" component={Login} />        
        <Stack.Screen name = "Signup" component={Signup} /> 
    </Stack.Navigator>
);


const styles = StyleSheet.create({
    accessButton:{
      borderWidth:3,
      borderRadius:50,
      borderColor:colors.white,
      alignContent:'center',
      alignItems:'center',
      height:80,
      backgroundColor:colors.secondary,
      width:80,
      marginTop:20,
      marginRight:60,
    },
    accessText:{
      fontWeight:"600",
      textAlign:'center',
      fontSize:12,
      color:colors.white
    },
    icon:{
      marginTop:6,
      alignSelf:'center',
    }
  });