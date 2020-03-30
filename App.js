import React, { Component } from 'react';
// import SwitchStack from './src/routes';
import { SafeAreaView } from 'react-navigation';
import AddUser from './src/screens/addUser';
import {View,Text} from 'react-native'
import CallScreen from './src/screens/callScreen';
import Router from './src/components/Router';

class App extends Component {
  state = {  }
  render() {
    return (
      <SafeAreaView style={{flex:1}}>
        <Router/>
        {/* <SwitchStack/> */}
        {/* <AddUser /> */}
      </SafeAreaView>
    );
  }
}

export default App;