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


const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default class NoLoggedScreen extends Component{
    render()
    {    return (
            <Tab.Navigator
                initialRouteName="Home"
                activeColor= {colors.secondary}
                inactiveColor={colors.transparent}
                barStyle={{borderTopColor:colors.secondary, borderTopWidth:2}}
                shifting={true}
                style={{ backgroundColor: colors.secondary }}>
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
                    name="Logout"
                    component={NoLoggedStack}
                    options={{
                        tabBarColor :colors.white,
                        tabBarLabel: 'Accesso',
                        tabBarIcon: ({ color }) => (
                        <Icon name="work" color={color} size={26} />
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
      <HomeStack.Screen name = "Login" component={Login} />
    </HomeStack.Navigator>
);

const NoLoggedStack = ({navigation}) => (
    <Stack.Navigator
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
        <Stack.Screen 
            name = "Accedi" 
            component={LoggedOut} 
        />
        <Stack.Screen name = "Login" component={Login} />        
        <Stack.Screen name = "Signup" component={Signup} /> 
        <Stack.Screen name="Home" component={Home}/>
    </Stack.Navigator>
);
