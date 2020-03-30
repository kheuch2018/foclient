import React, { Component } from 'react';
import requestCameraAndAudioPermission from '../components/permission'

import { View, NativeModules, ScrollView, Text, TouchableOpacity, Platform, Dimensions, StyleSheet, Button } from 'react-native';
import { RtcEngine, AgoraView } from 'react-native-agora';
// import styles from './Style';
import Icon from 'react-native-vector-icons/MaterialIcons';


const { Agora } = NativeModules; 

const {
    FPS30,
    AudioProfileDefault,
    AudioScenarioDefault,
    Adaptative,
  } = Agora;  

  const config = {                            //Setting config of the app
    appid: 'a30c665f8b1847d7b78677573e84b0a7',               //Enter the App ID generated from the Agora Website
    channelProfile: 0,                        //Set channel profile as 0 for RTC
    videoEncoderConfig: {                     //Set Video feed encoder settings
      width: 720,
      height: 1080,
      bitrate: 1,
      frameRate: FPS30,
      orientationMode: Adaptative,
    },
    audioProfile: AudioProfileDefault,
    audioScenario: AudioScenarioDefault,
  };

class CallScreen extends Component {
 
   


    constructor(props) {
        super(props);
        this.state = {
          peerIds: [],                                       //Array for storing connected peers
          uid: Math.floor(Math.random() * 100),              //Generate a UID for local user
          appid: this.props.route.params.AppID,                               
          channelName: this.props.route.params.channelName,                   //Channel Name for the current session
          joinSucceed: false,
          audMute: false ,
          vidMute: false                               //State variable for storing success
        };
        if (Platform.OS === 'android') {                    //Request required permissions from Android
          requestCameraAndAudioPermission().then(_ => {
            console.log('requested!');
          });
        }
        RtcEngine.init(config);          

      }
 
    componentDidMount() {
        RtcEngine.on('userJoined', (data) => {
            const { peerIds } = this.state;                   //Get currrent peer IDs
            if (peerIds.indexOf(data.uid) === -1) {           //If new user has joined
              this.setState({
                peerIds: [...peerIds, data.uid],              //add peer ID to state array
              });
            }
          });
          RtcEngine.on('userOffline', (data) => {             //If user leaves
            this.setState({
              peerIds: this.state.peerIds.filter(uid => uid !== data.uid), //remove peer ID from state array
            });
          });
          RtcEngine.on('joinChannelSuccess', (data) => {                   //If Local user joins RTC channel
            this.setState({
                joinSucceed: true,                                           //Set state variable to true
            });
            RtcEngine.startPreview();                                      //Start RTC preview
          });
          RtcEngine.joinChannel(this.state.channelName, this.state.uid);  //Join Channel
          RtcEngine.enableAudio();                                        //Enable the audio
    }

    toggleAudio() {
        let mute = this.state.audMute
        RtcEngine.muteLocalAudioStream(!mute);
        this.setState({audMute: !mute})
    }

    toggleVideo() {
        let mute = this.state.vidMute
        RtcEngine.muteLocalVideoStream(!mute);
        this.setState({vidMute: !mute})
    }

   
    
      endCall = () => {
        RtcEngine.destroy();
        this.props.navigation.navigate("CreateGroup")

      }

      peerClick(data) {
        let peerIdToSwap = this.state.peerIds.indexOf(data)
        this.setState(prevState => {
            let currentPeers = [...prevState.peerIds];
            let temp = currentPeers[peerIdToSwap];
            currentPeers[peerIdToSwap] = currentPeers[0]
            currentPeers[0] = temp;
            return { peerIds: currentPeers}

        })
      }





      videoView() {
        return (
          <View style={{flex:1}}>
            {
                this.state.peerIds.length > 1 
                ? <View style={{flex:1}}>
                    <View style={{height: dimensions.height * 3/4 -50}}>
                        <AgoraView style={{flex:1}} remoteUid={this.state.peerIds[0]} mode={1} />
                    </View>
                    <View style={{height: dimensions.height/4}}>
                        <ScrollView horizontal={true} decelerationRate={0} snapToInterval={dimensions.width/2} snapToAlignment={"center"} style={{width: dimensions.width,height: dimensions.height/4}}>
                            {
                                this.state.peerIds.slice(1).map((data) =>(
                                    <TouchableOpacity style={{width: dimensions.width/2, height: dimensions.height/4}}
                                    onPress={()=> this.peerClick(data) } key={data}
                                    >
                                        <AgoraView style={{width: dimensions.width/2,height: dimensions.height/4}} remoteUid={data} mode={1} key={data}/>


                                       
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                    </View>
                    </View>
                    : this.state.peerIds.length > 0
                    ? <View style={{height: dimensions.height - 50}}>
                        <AgoraView style={{flex:1}} remoteUid={this.state.peerIds[0]} mode={1} />
                        </View>
                    :<Text>No users connected</Text>
            }
            {
                !this.state.vidMute 
                ? <AgoraView style={styles.localVideoStyle} zOrderMediaOverlay={true} showLocalVideo={true} mode={1} />
                : <View/>
            }
            <View style={styles.buttonBar} >
                <Button style={styles.iconStyle} backgroundColor="green" title={this.state.audMute ? 'mic-off': 'mic'}
                onPress={() => this.toggleAudio()} />   
                <Button style={styles.iconStyle} backgroundColor="green" title={"call-end"}

                onPress={() => this.endCall()} />   
                <Button style={styles.iconStyle} backgroundColor="green" title={this.state.audMute ? 'videocam-off': 'videocam'}
                onPress={() => this.toggleVideo()} />   
                
            </View> 
            
          </View>
        );
      }






    render(){
        
        return this.videoView();
    }
}

let dimensions={
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}


const styles = StyleSheet.create({
    buttonBar: {
        height: 50,
        backgroundColor: "#0093E9",
        display: "flex",
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center'
    },
    localVideoStyle: {
        width: 140,
        height: 160,
        top: 5, 
        right: 5,
        zIndex: 100
    },
    iconStyle: {
        fontSize: 34,
        paddingTop: 15,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 15,
        borderRadius: 0
    }
})


export default CallScreen