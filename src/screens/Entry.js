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
import RNRestart from 'react-native-restart'

const Entry = ({navigation}) => {
// user information state: {id, name, picture, email, location: {}, phone}
    const [logInInfo, setLogInInfo] = useState({email:'', password:''})
    const [isLoading, setIsloading] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const handleLogIn = () => {
    setErrMsg('')
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

    //verify email input
    const $VerifyEmail = (data) => {
        return data.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    }
    
    //request password reset
    const forgotPassword = (Email) => {
        if ($VerifyEmail(Email)){
            auth().sendPasswordResetEmail(Email)
            .then(function (user) {
                setErrMsg('تم إرسال رسالة التحقق')
            }).catch(function (e) {
                setErrMsg('تحقق من عنوان بريدك الإلكتروني')
            })
        }else{
            setErrMsg('تحقق من عنوان بريدك الإلكتروني')
        }
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
            //restart app to update app.js values
            RNRestart.Restart()
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

            <Buttons.ButtonDefault
                    titleLeft="دخول بدون تسجيل"
                    iconName="exit"
                    iconSize={39}
                    containerStyle={{ justifyContent:'center', width:'60%', alignSelf:'center', padding: 3}}
                    textStyle={{fontFamily: 'Cairo-Bold' ,fontSize: 16, color: '#fac300'}}
                    iconContainer={{backgroundColor:'rgba(255,255,255,0.25)', borderRadius:50}}
                    onPress={()=>navigation.navigate('Zaatar')}/>
        </View>

        <View style={styles.EntryBox}>
            <View style={styles.InEntryBox}>
                <Input
                    placeholder="khaled@junglesoft.com"
                    autoCompleteType={true}
                    label="البريد الالكتروني"
                    value={logInInfo.email}
                    rightIcon={{ type: 'font-awesome', name: 'envelope' }}
                    inputContainerStyle={{ paddingLeft: 5}}
                    containerStyle={{width:'80%'}}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setLogInInfo({...logInInfo, email: value })}
                    />
                <Input
                    placeholder="*******"
                    autoCompleteType={true}
                    label="كلمة المرور"
                    value={logInInfo.password}
                    secureTextEntry={true}
                    rightIcon={{ type: 'font-awesome', name: 'key' }}
                    inputContainerStyle={{ paddingLeft: 5}}
                    containerStyle={{marginTop:-15, width:'80%', marginBottom:-15}}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setLogInInfo({...logInInfo, password: value })}
                />
                { isLoading ? <ActivityIndicator color='#2C4770' size={40}/> : null }
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    {errMsg!=='' ?
                        <Buttons.ButtonDefault titleLeft="[استرجاع كلمة المرور]" onPress={()=>forgotPassword(logInInfo.email)} containerStyle={{}}/>
                    :
                        null
                    }
                    <Text style={{color:'red'}}>{errMsg}</Text>
                </View>
                <Buttons.ButtonDefault
                    titleLeft="دخول"
                    horizontal={false}
                    containerStyle={{ 
                        justifyContent:'center', 
                        borderRadius: 5, 
                        width:'70%', 
                        backgroundColor: '#2C4770', 
                        alignSelf:'center', 
                        padding: 5, 
                        marginTop: errMsg==='' ? 0 : 5
                    }}
                    textStyle={{fontFamily: 'Cairo-Regular' ,fontSize: 16, color: '#fff'}}
                    onPress={()=>handleLogIn()}
                />
                <Text style={{margin:5}}>- او -</Text>
                 <Buttons.ButtonDefault
                    titleLeft="مستخدم جديد"
                    horizontal={false}
                    containerStyle={{ justifyContent:'center', borderRadius: 5, width:'70%', backgroundColor: '#2C4770', alignSelf:'center', padding: 5}}
                    textStyle={{fontFamily: 'Cairo-Regular' ,fontSize: 16, color: '#fff'}}
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
        height: Dimensions.get('window').height/1.85,
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