import React, {useEffect, useState} from 'react'
import { 
    View, 
    Text,
    StyleSheet,
    Image,
    Dimensions,
    Button
 } from 'react-native'
import * as Animatable from 'react-native-animatable';
import Buttons from '../elements/Button'
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken, LoginButton, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore';

const Entry = ({navigation}) => {
    // user information state: {id, name, first_name, picture, email, location, phone}

    useEffect( () => {
        //get Data from asyncstorage on page load and store it to userInfo
       getData()
       return() => {
           getData()
       } 
    },[])

    async function onFacebookButtonPress() {
        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }
        // Once signed in, get the users AccesToken
        const data = await AccessToken.getCurrentAccessToken();
        if (!data) {
            throw 'Something went wrong obtaining access token';
        }
        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
        //get user info from accessToken 
        getUserInfo(data.accessToken)
        // Sign-in the user with the credential
        return auth().signInWithCredential(facebookCredential)
    }

    const getUserInfo = (data) =>{
          const infoRequest = new GraphRequest(
            '/me',
            {
              accessToken: data,
              parameters: {
                fields: {
                  string: 'id,email,name,picture,first_name'
                }
              }
            },(error, result) => {
                if (error) {
                    //TODO error fetching data
                    console.log(error)
                } else {
                    //Save results to async 
                    storeData({...result, phone:'', location:''})
                    console.log(result)
                }
            })
          // Start the graph request.
          new GraphRequestManager().addRequest(infoRequest).start()
    }

    const storeData = (res) => {
        try {
            AsyncStorage.getItem('userInfoZaatar')
               .then((value) => {
                    if(value === null){
                        AsyncStorage.setItem('userInfoZaatar', JSON.stringify(res))
                        navigation.navigate('Zaatar')
                    }
               })
            // Add a new document in collection "users" with ID if it does not exist
            firestore().collection('users').doc(res.id).set(res ,{merge: true})
        } catch (e) {
            //err storing data
        }
    }

    const getData = () => {
        try {
               AsyncStorage.getItem('userInfoZaatar')
               .then((value) => {
                    if(value !== null){
                        console.log(value)
                        navigation.navigate('Zaatar')
                    }
               })
        } catch(e) {
          // error reading value
        }
    }
            
    return (
    <View style={styles.container}>
        <Animatable.View    
                easing="ease-out-circ"
                animation="zoomIn"
                iterationCount={1}
                duration={3000}
                direction="normal">
                <Image style={{width:300, height:300, resizeMode:'contain'}} source={require('../assets/gallary/Zaatar3.png')} />
        </Animatable.View>
        <View style={styles.EntryBox}>
            <Text style={styles.title}> زعترنا بدخولك يا ريس </Text>
            <Button
                title="Facebook Sign-In"
                onPress={() => onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))}
                />

             <LoginButton
                onLoginFinished={()=>onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))}
                onLogoutFinished={() => AsyncStorage.removeItem('userInfoZaatar')}/>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#2C4770',
    },
    title:{
        fontSize:20,
        textAlign:'center',
        color:'#fff',
        fontFamily:'Cairo-Bold',
        marginBottom: 10
    },
    EntryBox:{
        marginTop:10,
        //backgroundColor: '#fff',
        width:Dimensions.get('window').width/1.4,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        padding:10
    }
})
export default Entry;