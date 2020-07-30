import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import LoggedOut from "./LoggedOut";
import colors from "../style/colors/index"
import { Icon } from 'react-native-elements';

import Profile from "./Profile";
import Home from "./Home";
import Structure from "../screens/Structure"
import Login from './Login';
import BookingStructure from './BookingStructure';
import Trip from './Trip';
import AddStructure from './AddStructure';

const Tab = createMaterialBottomTabNavigator();

const HomeStack = createStackNavigator();
const LoggedOutStack = createStackNavigator();
const ProfileStack = createStackNavigator();
export default class MainTabScreen extends Component{
    render()
    {    return (
        <Tab.Navigator
        initialRouteName="Home"
        activeColor= {colors.green01}
        inactiveColor={colors.black}
        shifting={true}
        style={{ backgroundColor: colors.black }}
      >
        <Tab.Screen
          name="Trip"
          component={Trip}
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
        <Tab.Screen
          name="Profile"
          component={ProfileStackScreen}
          options={{
            
            tabBarLabel: 'Profilo',
            tabBarColor: colors.white,
            tabBarIcon: ({ color }) => (
              <Icon name="account-circle" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    )
    }
}

const HomeStackScreen = ({navigation}) =>(
    <HomeStack.Navigator >
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Structure" component={Structure} />
      <HomeStack.Screen name="BookingStructure" component={BookingStructure} />
    </HomeStack.Navigator>
);
const ProfileStackScreen = ({navigation}) =>(
  <ProfileStack.Navigator>
    <ProfileStack.Screen name = "Profile"  component={Profile}/>
    <ProfileStack.Screen name = "AddStructure"  component={AddStructure}/>
  </ProfileStack.Navigator>
);
const LoggedOutStackScreen = ({navigation}) =>(
  <LoggedOutStack.Navigator >
    <LoggedOutStack.Screen name="Accedi" component={LoggedOut} />
    <LoggedOutStack.Screen name="Login" component={Login} />
  </LoggedOutStack.Navigator>
);

