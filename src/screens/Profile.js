import React, {useState, useEffect} from 'react'
import { 
    View, 
    Text, 
    StyleSheet,
    Dimensions,
    ScrollView,
    Alert,
    Keyboard
} from 'react-native'
import AppStyles from '../styles/AppStyle'
import DropShadow from "react-native-drop-shadow"
import { Avatar, Input } from 'react-native-elements';
import Buttons from '../elements/Button'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Profile() {

    // user information state
    const [userInfo, setUserInfo] = useState({})
    useEffect( () => {
        //get Data from asyncstorage on page load and store it to userInfo
        getData() 
    },[])

    const getData = () => {
        try {
               AsyncStorage.getItem('userInfoZaatar')
               .then((value) => {
                    if(value !== null)
                        setUserInfo(JSON.parse(value))
               })
        } catch(e) {
          // error reading value
        }
    }

    const storeData = (value) => {
        try {
            AsyncStorage.setItem('userInfoZaatar', JSON.stringify(value))
            .then(()=>{
                Alert.alert('Saved') 
                Keyboard.dismiss()
            })
        } catch (e) {
            //err storing data
        }
    }

    const SaveUserInfo = () => {
        if(userInfo.Name.length >=4 && userInfo.Email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) && userInfo.Mobile.match(/\d/g).length === 10){
            storeData(userInfo)
            console.log(userInfo)
        }else{
            Alert.alert('Some fields are invalid')
        }   
    }

    // const InputLengthField = () => {
   
    // }

    return (
        <View style={styles.container}>
            <DropShadow style={styles.dropShadow}>
                <View style={styles.profileBox}>
                    <DropShadow style={[styles.image, styles.dropShadowImg]}>
                        <Avatar
                            size={220}
                            rounded
                            source={{uri: 'https://robohash.org/honey?set=set2'}}
                            icon={{ name: 'user', type: 'font-awesome' }}
                            containerStyle={{ backgroundColor: '#323232' }}
                            key={1}
                        />
                    </DropShadow>
                    <SafeAreaView style={styles.userInfo}>
                        <Input
                            placeholder="khaled e.g."
                            value={userInfo.Name}
                            label="Name"
                            leftIcon={{ type: 'font-awesome', name: 'user' }}
                            inputContainerStyle={{ paddingLeft: 5}}
                            containerStyle={{borderWidth:0}}
                            labelStyle={{color:'#171717'}}
                            onChangeText={value => setUserInfo({...userInfo, Name: value })}
                            //errorMessage={InputLengthField()}
                        />
                        <Input
                            placeholder="khaled@junglesoft.com"
                            label="Email"
                            value={userInfo.Email}
                            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                            inputContainerStyle={{ paddingLeft: 5}}
                            containerStyle={{borderWidth:0}}
                            labelStyle={{color:'#171717'}}
                            onChangeText={value => setUserInfo({...userInfo, Email: value })}
                        />
                        <Input
                            placeholder="0527999321"
                            label="Mobile"
                            value={userInfo.Mobile}
                            leftIcon={{ type: 'font-awesome', name: 'mobile' }}
                            maxLength={10}
                            keyboardType='numeric'
                            inputContainerStyle={{ paddingLeft: 5}}
                            containerStyle={{borderWidth:0}}
                            labelStyle={{color:'#171717'}}
                            onChangeText={value => setUserInfo({...userInfo, Mobile: value })}
                        />
                        <Buttons.PressableButton
                            titleLeft="Save"
                            iconName="add"
                            iconSize={40}
                            horizontal={false}
                            containerStyle={{ borderRadius: 5, width:'90%', backgroundColor: '#2C4770', alignSelf:'center', padding: 5, marginBottom: 10}}
                            textStyle={{fontFamily: 'Bullpen3D' ,fontSize: 25, color: '#fff', width:'30%'}}
                            iconContainer={{backgroundColor:'rgba(255,255,255,0.25)', borderRadius:50, padding: 5, width:'20%'}}
                            onPress={SaveUserInfo}
                        />
                    </SafeAreaView>
                </View>
            </DropShadow>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#2C4770',
        justifyContent:'flex-end'
    },
    dropShadow:{
        shadowColor: '#323232',
        shadowOffset: {width: -9, height: 8},
        shadowOpacity: 0.9,
        shadowRadius: 2,
    },
    dropShadowImg:{
        shadowColor: '#2C4770',
        shadowOffset: {width: -2, height: 3},
        shadowOpacity: 0.7,
        shadowRadius: 3,
    },
    profileBox: {
        width: Dimensions.get('window').width - 35,
        height: Dimensions.get('window').height - 180,
        alignSelf:'center',
        backgroundColor:'white',
        borderRadius: 10,
        marginBottom:20,
    },
    image:{
        alignSelf:'center',
        marginTop:-90
    },
    userInfo:{
        flex:1,
        width: '90%',
        alignSelf: 'center',
        justifyContent:'center'
    }
})
