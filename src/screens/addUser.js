import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, FlatList, ScrollView } from 'react-native';

import Input from '../components/Input/Input';
import { search, HP, WP, profile, colors } from '../utils/contants';
import firebaseSDK from '../database/firebase';
import { Button } from '../components';

class AddUser extends Component {

    state = {
        userData: [],
        numberOfUsers: 0,
        addedUsers: []
    }

    componentDidMount() {
        firebaseSDK.database()
        .ref('users/')
        .on("value",user => {
            // console.warn(user.val())
            let users=[]
            user.forEach((child) => {
                users.push(child.val());
            });
            console.log(users)
            this.setState(previousState => ({
                userData: users
              }))
        })

    }

    selectUser = (user) => {
        const {numberOfUsers,addedUsers} =this.state
        if(!addedUsers.includes(user)){
            let newUsers = [...addedUsers]
            newUsers.push(user);
            this.setState({numberOfUsers: numberOfUsers+1,addedUsers: newUsers})

        }else{
            let newUsers = [...addedUsers]
            newUsers = newUsers.filter(item => item !== user)
            this.setState({numberOfUsers: numberOfUsers-1,addedUsers: newUsers})
        }
        console.log(addedUsers)
    }

    renderItem = (item) => {
        // console.warn({ item })
        return <View style={styles.userRow}>
            <View style={styles.imageTextView}>
                <View style={{flexDirection: "row"}}>
                    <View>
                        <Image source={profile} style={styles.userImage} />
                    </View>
                    <View>
                        {this.state.addedUsers.includes(item) ? 
                            <View style={{backgroundColor: "black", width: 10, height: 10, borderRadius: 10}} />
                            : <View/>
                        }
                        <Text> {item.displayName} </Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => this.selectUser(item)}
                style={styles.addUserBtn}>
                

                
                <Text> {this.state.addedUsers.includes(item) ? "Added": "Add"}</Text>
            </TouchableOpacity>
        </View>
    }

    render() {
        return (
            // <ScrollView>
                <View style={styles.userView}>
                    <View>
                        <Input
                            image={search}
                            inputPlaceHolder={'Search'}
                            onChange={this.searchInput}
                            imageStyle={{ width: WP(8), height: HP(3.5) }}
                            container={{ borderRadius: 30 }}
                        />
                    </View>
                    <View style={styles.addUserView}>
                        <FlatList
                            data={this.state.userData}
                            extraData={this.state.userData}
                            renderItem={({ item, index }) => this.renderItem(item)}
                            keyExtractor={(index, item) => index.toString()}
                        />
                    </View>

                    <View style={{flex:1,flexDirection: "row",marginTop: 100,marginLeft: 15}}>
                        <View style={{flex:1,marginTop: 20}}>
                            <Image source={profile} style={styles.userImage} />
                        </View>
                        <View style={{flex:5,marginTop: 20}}>
                        <Text>{this.state.numberOfUsers >0 ? "+"+this.state.numberOfUsers : ""}</Text>
                        </View>

                        <View style={{flex:4}}>
                            <Button 
                                name={'Call'}
                                width={WP('30')}
                                btnStyle={{ marginTop: 10 }}
                                onPress={() => this.props.navigation.navigate("Call",{
                                    AppID: "1234567",
                                    channelName: "test1"
                                })}
                                />
                        </View>

                    </View>
                </View>
            // </ScrollView>
        )
    }
}
export default AddUser

const styles = StyleSheet.create({
    userView: {
        alignItems: 'center'
    },
    addUserView: {
        borderWidth: 1,
        width: WP('90'),
        paddingVertical: 10
    },
    userRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    imageTextView: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginLeft: 5 
    },
    userImage: {
        width: WP(8),
        height: HP(3.5)
    },
    addUserBtn: {
        width: WP('20'),
        height: HP('5'),
        backgroundColor: colors.greyText,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginRight: 10
    }
})