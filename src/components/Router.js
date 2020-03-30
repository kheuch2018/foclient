import React, { Component } from 'react';
import {View} from 'react-native'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CallScreen from '../screens/callScreen';
import CreateGroup from '../screens/CreateGroup';
import AddUser from '../screens/addUser';

class Router extends Component {
    render() {
        const Stack = createStackNavigator();
        return (
            <NavigationContainer>

            <Stack.Navigator>
                <Stack.Screen name="CreateGroup" component={CreateGroup}  />
                <Stack.Screen name="AddUsers" component={AddUser}  />
                <Stack.Screen name="Call" component={CallScreen}  />
                
                
          </Stack.Navigator>
        </NavigationContainer>
        );
    }
}

export default Router;