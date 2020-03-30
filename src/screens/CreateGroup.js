import React, { Component } from 'react';
import {View,Text, Button} from "react-native"
import requestCameraAndAudioPermission from "../components/permission"
import { TextInput } from 'react-native-gesture-handler';


class CreateGroup extends Component {

    state = {
        AppID: "1234567",
        channelName: "test1"
    }

    componentDidMount() {
       requestCameraAndAudioPermission()
       .then(() => console.log("Requested !"))

    }
    
    handleSubmit = () => {
        let AppID = this.state.AppID;
        let channelName = this.state.channelName
        if(AppID !== '' && channelName !==''){
            this.props.navigation.navigate("AddUsers",{AppID,channelName})
        }
    }

    render() {
        return (
            <View style={{flex:1,alignItems: "center"}}>
        
                <Text style={{fontWeight: "bold",marginTop: 100,fontSize: 30}}>Welcome Admin</Text>
                <View style={{width: 200, height: 200, borderRadius: 100,backgroundColor: "white", marginTop: 50}}>

                </View>
                <View style={{marginTop: 50}}>

                <Button onPress={this.handleSubmit} title="Create a group"  style={{width: "50%"}}/>
                </View>
            
            </View>
        );
    }
}

export default CreateGroup;