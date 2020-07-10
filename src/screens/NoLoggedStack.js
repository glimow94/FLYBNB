import React, {Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import colors from "../style/colors/index";
import { Icon } from 'react-native-elements';


import Home from './Home';
import LoggedOut from './LoggedOut';
import Login from './Login';
import Signup from './Signup';
import Structure from "../screens/Structure"
import Trip from "../screens/Trip"


const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default class NoLoggedScreen extends Component{
    render()
    {    return (
            <Tab.Navigator
                initialRouteName="Home"
                activeColor= {colors.green01}
                inactiveColor={colors.black}
                shifting={true}
                style={{ backgroundColor: colors.black }}>
                <Tab.Screen
                    name="Logout"
                    component={NoLoggedStack}
                    options={{
                        tabBarColor :colors.white,
                        tabBarLabel: 'Prenotazioni',
                        tabBarIcon: ({ color }) => (
                        <Icon name="work" color={color} size={26} />
                    ),
                }}
                />
                <Tab.Screen
                    name="Home"
                    component={HomeStackScreen}
                    options={{
                        tabBarColor: colors.white,
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => (
                        <Icon name="explore" color={color} size={26} />
                    ),
                }}
                />
            </Tab.Navigator>
            )
    }
}



const HomeStackScreen = ({navigation}) =>(
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Structure" component={Structure} />
      <HomeStack.Screen name = "Login" component={Login} />
    </HomeStack.Navigator>
);

const NoLoggedStack = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen name = "Accedi" component={LoggedOut} />
        <Stack.Screen name = "Login" component={Login} />        
        <Stack.Screen name = "Signup" component={Signup} /> 
        <Stack.Screen name="Home" component={Home} />

        

    </Stack.Navigator>
);
