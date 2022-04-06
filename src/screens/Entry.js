import React, {useEffect, useState} from 'react'
import { 
    View, 
    Text,
    StyleSheet,
    Image,
    Dimensions,
    Button,
    ScrollView,
    ActivityIndicator
 } from 'react-native'
import * as Animatable from 'react-native-animatable';
import { Avatar, Input } from 'react-native-elements';
import Buttons from '../elements/Button'
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore';

const Entry = ({navigation}) => {
    // user information state: {id, name, first_name, picture, email, location, phone}

    useEffect( () => { 
       const unsubscribe = navigation.addListener('focus', () => {
             // auth().onAuthStateChanged((user) => {
               // if(user)
                  isLoggedIn()
             // })
        })
        return () => unsubscribe()
      },[navigation])

    const isLoggedIn = () => {
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
     
    const [logInInfo, setLogInInfo] = useState({email:'', password:''})
    const [isLoading, setIsloading] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const handleLogIn = () => {
        if(logInInfo.email==='' || logInInfo.password==='')
           return setErrMsg('احدى المعلومات غير صحيحه')

        setIsloading(true)
        const unsub=  auth()
            .signInWithEmailAndPassword(logInInfo.email, logInInfo.password)
            .then((userCreditentials) => {
                //User account signed in
                //get uid and pass it to store data
                const user = userCreditentials.user
                console.log(user)
                //get user id, retrieve data from data base then store by id 
                getUserInfo(user.uid) 
            })
            .catch(error => {
              setIsloading(false)
              setErrMsg('احدى المعلومات غير صحيحه')
          })
            return () => unsub
      }

      const [userInfo, setUserInfo] = useState({})
      const getUserInfo = (irec) => {
          const subscriber = firestore()
          .collection('users')
          .doc(irec)
          .get()
          .then(documentSnapshot => {
              console.log(documentSnapshot.data())
              setUserInfo({...documentSnapshot.data(), id: irec})
              AsyncStorage.setItem('userInfoZaatar', JSON.stringify({...documentSnapshot.data(), id: irec})) 
          })
          .then(()=>{
                console.log(userInfo)
                //if user is authenticated then go to main page
                navigation.navigate('Zaatar')
                //hide indicator
                setIsloading(false)  
          })
          .catch((e) => {
              setIsloading(false)
              setErrMsg('احدى المعلومات غير صحيحه')
          })
          return () => subscriber
      }

    return (
    <ScrollView style={styles.container}>
        <View style={styles.EntryHeader}>
            <Animatable.View    
                    easing="ease-out-circ"
                    animation="zoomIn"
                    iterationCount={1}
                    duration={3000}
                    direction="normal">
                    <Image style={{width:300, height:300, resizeMode:'contain'}} source={require('../assets/gallary/Zaatar3.png')} />
            </Animatable.View>
        </View>
        <View style={styles.EntryBox}>
            <View style={styles.InEntryBox}>
                <Input
                    placeholder="khaled@junglesoft.com"
                    autoCompleteType={true}
                    //placeholderTextColor="red"
                    label="البريد الالكتروني"
                    value={logInInfo.email}
                    rightIcon={{ type: 'font-awesome', name: 'envelope' }}
                    inputContainerStyle={{ paddingLeft: 5}}
                    containerStyle={{borderWidth:0, width:'80%'}}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setLogInInfo({...logInInfo, email: value })}
                    />
                <Input
                    placeholder="*******"
                    autoCompleteType={true}
                    //placeholderTextColor="red"
                    label="كلمة المرور"
                    value={logInInfo.password}
                    secureTextEntry={true}
                    rightIcon={{ type: 'font-awesome', name: 'key' }}
                    inputContainerStyle={{ paddingLeft: 5}}
                    containerStyle={{borderWidth:0, width:'80%'}}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setLogInInfo({...logInInfo, password: value })}
                />
                { isLoading ? <ActivityIndicator color='#2C4770' size={40}/> : null }
                <Text style={{color:'red'}}>{errMsg}</Text>
                <Buttons.ButtonDefault
                    titleLeft="دخول"
                    //iconName="profile"
                    iconSize={40}
                    horizontal={false}
                    containerStyle={{ justifyContent:'center', borderRadius: 5, width:'70%', backgroundColor: '#2C4770', alignSelf:'center', padding: 7}}
                    textStyle={{fontFamily: 'Cairo-Bold' ,fontSize: 18, color: '#fff'}}
                    iconContainer={{backgroundColor:'rgba(255,255,255,0.25)', borderRadius:50}}
                    onPress={()=>handleLogIn()}
                />
                <Text style={{margin:5}}>- او -</Text>
                 <Buttons.ButtonDefault
                    titleLeft="مستخدم جديد"
                    //iconName="new"
                    //iconSize={39}
                    horizontal={false}
                    containerStyle={{ justifyContent:'center', borderRadius: 5, width:'70%', backgroundColor: '#2C4770', alignSelf:'center', padding: 7}}
                    textStyle={{fontFamily: 'Cairo-Bold' ,fontSize: 16, color: '#fff'}}
                    iconContainer={{backgroundColor:'rgba(255,255,255,0.25)', borderRadius:50}}
                    onPress={()=>navigation.navigate('Registration')}
                />
            </View>
        </View>
    </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'100%',
        backgroundColor: '#fff',
    },
    EntryHeader:{
        width:'100%',
        height: Dimensions.get('window').height/2,
        backgroundColor: '#2C4770',
        justifyContent:'center',
        alignItems:'center',
        borderBottomRightRadius:100,
        padding:10
    },
    EntryBox:{
        flex:1,
        backgroundColor: '#2C4770',
    },
    InEntryBox:{
        backgroundColor: '#fff',
        justifyContent:'center',
        alignItems:'center',
        borderTopLeftRadius:100,
        paddingTop:20
    },
    title:{
        fontSize:20,
        textAlign:'center',
        color:'#fff',
        fontFamily:'Cairo-Bold',
        marginBottom: 10
    },

})
export default Entry;