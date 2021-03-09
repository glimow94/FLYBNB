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
import AddStructure from './AddStructure';
import UserStructure from './UserStructure';
import EditStructure from './EditStructure';
import ConfirmBooking from './ConfirmBooking';

const Tab = createMaterialBottomTabNavigator();

const HomeStack = createStackNavigator();
const LoggedOutStack = createStackNavigator();
const ProfileStack = createStackNavigator();
export default class MainTabScreen extends Component{
    render(){    
      return (
        <Tab.Navigator
          initialRouteName="Home"
          activeColor= {colors.secondary}
          barStyle={{borderTopColor:colors.secondary, borderTopWidth:2}}
          inactiveColor={colors.transparent}
          shifting={true}
          style={{ backgroundColor: colors.transparent }}
        >
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
    <HomeStack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.secondary,
          height: 80
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '500',
          fontSize: 20,
          color: colors.primary
        },
      }}
    >
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen 
        name="Structure" 
        component={Structure} 
        options={({route}) => ({title: route.params.itemTitle+' - '+route.params.itemType})} 
      />
      <HomeStack.Screen 
        name="BookingStructure" 
        component={BookingStructure} 
        options={({route}) => ({title: 'Prenota - '+route.params.itemTitle})} 
      />
      <HomeStack.Screen 
        name="ConfirmBooking" 
        component={ConfirmBooking} 
        options={({route}) => ({title: 'Ospiti - '+route.params.itemTitle})} 
      />
    </HomeStack.Navigator>
);
const ProfileStackScreen = ({navigation}) =>(
  <ProfileStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.secondary,
        height: 80
      },
      headerTintColor: colors.primary,
      headerTitleStyle: {
        fontWeight: '500',
        fontSize: 20,
        color: colors.primary
      },
    }}
  >
    <ProfileStack.Screen 
      name = "Profile"  
      component={Profile}
      options={{title: 'Area Personale'}} 
    />
    <ProfileStack.Screen 
      name = "AddStructure"  
      component={AddStructure}
      options={{title: 'Nuova Struttura'}} 
    />
    <ProfileStack.Screen 
      name = "UserStructure"  
      component={UserStructure}
      options={({route}) => ({title: route.params.itemTitle+' - '+route.params.itemType})} 
    />
    <ProfileStack.Screen 
      name = "EditStructure"  
      component={EditStructure}
      options={{title: 'Modifica Struttura'}} 
    />
  </ProfileStack.Navigator>
);

