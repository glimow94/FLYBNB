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


import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';


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
    <HomeStack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.tertiary,
          height: 65
        },
        headerRight : () =>(
          <View style={{alignContent:'center',alignItems:'center'}}>
                <TouchableOpacity onPress={()=>navigation.navigate('Profile')} style={styles.accessButton}>
                    <Icon
                    size={40}
                    style={styles.icon}
                    name='user'
                    type='font-awesome'
                    color={colors.white}
                />
                  <Text style={styles.accessText}>PROFILO</Text>
                </TouchableOpacity>
          </View>
        ),
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '500',
          fontSize: 30,
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
      backgroundColor: colors.tertiary,
      height: 65
    },
    headerRight : () =>(
      <View style={{alignContent:'center',alignItems:'center'}}>
            <TouchableOpacity onPress={()=>navigation.navigate('Home')} style={styles.accessButton}>
                    <Icon
                      size={40}
                      style={styles.icon}
                      name='home'
                      type='font-awesome-5'
                      color={colors.white}
                    />
                    <Text style={styles.accessText}>HOME</Text>
        </TouchableOpacity>
      </View>
    ),
    headerTintColor: colors.primary,
    headerTitleStyle: {
      fontWeight: '500',
      color: colors.white,
      fontSize: 30
    },
  }}
  >
    <ProfileStack.Screen 
      name = "Profile"  
      component={Profile}
    />
    <ProfileStack.Screen 
      name = "AddStructure"  
      component={AddStructure}
    />
    <ProfileStack.Screen 
      name = "UserStructure"  
      component={UserStructure}
    />
    <ProfileStack.Screen 
      name = "EditStructure"  
      component={EditStructure}
    />
  </ProfileStack.Navigator>
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
    marginRight:30,
  },
  accessText:{
    fontWeight:"600",
    textAlign:'center',
    fontSize:12,
    color:colors.white
  },
  icon:{
    marginTop:6,
    alignSelf:'center'
  }
});