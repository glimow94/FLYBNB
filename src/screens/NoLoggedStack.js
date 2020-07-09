import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Home';
import LoggedOut from './LoggedOut';
import Login from './Login';

const Stack = createStackNavigator();

const NoLoggedStack = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen name = "Home" component={LoggedOut} />
        <Stack.Screen name = "Login" component={Login} />        
    </Stack.Navigator>
);
export default NoLoggedStack