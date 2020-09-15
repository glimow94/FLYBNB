import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoggedOut from "./LoggedOut";
import colors from "../style/colors/index"
import { Icon } from 'react-native-elements';

import Profile from "./Profile";
import Home from "./Home";
import Structure from "../screens/Structure"
import BookingStructure from './BookingStructure';
import AddStructure from './AddStructure';
import UserStructure from './UserStructure';
import EditStructure from './EditStructure';
import ConfirmBooking from './ConfirmBooking';


const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Drawer = createDrawerNavigator();
export default class MainTabScreen extends Component{
    render()
    {    return (
        <Drawer.Navigator
            initialRouteName="Home"
            activeColor= {colors.green01}
            inactiveColor={colors.black}
            shifting={true}
            style={{ backgroundColor: colors.black }}
        >
        
        <Drawer.Screen
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
        <Drawer.Screen
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
      </Drawer.Navigator>
    )
    }
}

const HomeStackScreen = ({navigation}) =>(
    <HomeStack.Navigator >
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Structure" component={Structure} />
      <HomeStack.Screen name="BookingStructure" component={BookingStructure} />
      <HomeStack.Screen name="ConfirmBooking" component={ConfirmBooking} />
    </HomeStack.Navigator>
);
const ProfileStackScreen = ({navigation}) =>(
  <ProfileStack.Navigator>
    <ProfileStack.Screen name = "Profile"  component={Profile}/>
    <ProfileStack.Screen name = "AddStructure"  component={AddStructure}/>
    <ProfileStack.Screen name = "UserStructure"  component={UserStructure}/>
    <ProfileStack.Screen name = "EditStructure"  component={EditStructure}/>

  </ProfileStack.Navigator>
);

