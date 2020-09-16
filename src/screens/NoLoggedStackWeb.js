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
    <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name = "Access" component={LoggedOut} />
        <Stack.Screen name = "Login" component={Login} />        
        <Stack.Screen name = "Signup" component={Signup} /> 
    </Stack.Navigator>
);
