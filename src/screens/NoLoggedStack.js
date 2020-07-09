import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Home';
import LoggedOut from './LoggedOut';
import Login from './Login';
import Signup from './Signup'

const Stack = createStackNavigator();

const NoLoggedStack = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen name = "Accedi" component={LoggedOut} />
        <Stack.Screen name = "Login" component={Login} />        
        <Stack.Screen name = "Signup" component={Signup} /> 
    </Stack.Navigator>
);
export default NoLoggedStack