import React, {useState} from 'react'
import { 
    View, 
    Text, 
    StyleSheet,
    Dimensions,
    ScrollView,
    Alert,
    Keyboard,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
} from 'react-native'
import { Avatar, Input, Badge } from 'react-native-elements'
import Buttons from '../elements/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import ImagePicker from 'react-native-image-crop-picker'
import storage from '@react-native-firebase/storage'
import {useNavigation} from '@react-navigation/native'
import RNRestart from 'react-native-restart'
import CountryPicker from 'react-native-country-picker-modal'
import LinearGradient from 'react-native-linear-gradient'
//import * as RNLocalize from "react-native-localize"

export default function ProfileForm(props) {
    const navigation = useNavigation();
    // user information state
    //TODO ::: get location:{} of nonusers based on thier location instead of the initial values currently being passed 
    const [userInfo, setUserInfo] = useState(props.userInfo ? props.userInfo : {id:'', email:'', phone:'', name:'', location:{country:'Israel', code:'972', flag:'IL', currency: 'ILS', city:''}})
    const [image, setImage] = useState(props.userInfo ? props.userInfo.picture : null)
    const [isLoading, setIsloading] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    //Edit user profile information
    const storeData = (value) => {
        try {
            AsyncStorage.setItem('userInfoZaatar', JSON.stringify(value))
            .then(()=>{
                // Add a new document in collection "users" with ID if it does not exist
                //NOTE user id is also stored as snapshot in users. 
                firestore().collection('users').doc(userInfo.id).set(value)
                .then(()=>{
                    //immediate update to profile info
                    props.setUserInfo(value)
                    //Hide form
                    //props.setProfileFormVisibility(false)
                    setIsloading(false)
                    setSuccessMsg('تم حفظ المعلومات')
                    //remove keyboard
                    //Keyboard.dismiss()
                })
            })
        } catch (e) {
            //err storing data
        }
    }

    const [pass, setPass] = useState(props.userInfo ? '********' : '')
    const registerUser = (data) =>{
        const unsub=  auth()
                        .createUserWithEmailAndPassword(userInfo.email, pass)
                        .then((userCreditentials) => {
                            //get creditentials, uid and store to database if user does not exist
                            const user = userCreditentials.user
                            firestore().collection('users').doc(user.uid).set(data)
                            //save to async storage
                            AsyncStorage.setItem('userInfoZaatar', JSON.stringify({...data, id: user.uid}))
                            .then(()=>{
                                setSuccessMsg('تم التسجيل بنجاح')
                                //restart app to update app.js values
                                RNRestart.Restart()
                            })
                            .catch((e)=>{
                                //error firestore()
                                setErrMsg('آسف حدث خطأ أثناء حفظ البيانات الخاصة بك')
                            })
                        })
                        .catch((e)=>{
                            //err auth()
                            setErrMsg('يبدو أن بريدك الإلكتروني موجود بالفعل')
                        })           
        return()=> unsub
    }

    const SaveUserInfo = async () => {
        setErrMsg('')
        setSuccessMsg('')
        try{    
            if(userInfo.name.length >=4 && pass.length >=7
                && userInfo.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) 
                && userInfo.phone.match(/\d/g)
                && userInfo.location.city.length >=4 ){
                
                setIsloading(true)
                if(props.Registration === true){
                    //create authenticated user && save to database && save to async
                    registerUser(userInfo)
                }else{
                    const imageUri = await uploadImage(userInfo.id)
                    //store data into async & database
                    storeData({...userInfo, picture:imageUri})
                }

            }else{
                setErrMsg('يوجد نقص في التفاصيل')
            }  
        }catch(e){
                setErrMsg('..يوجد نقص في التفاصيل')
                setIsloading(false)
        } 
    }
    
    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: true,
        }).then((image) => {
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri)
        })
        .catch((e) =>{
            //setImage([])
            setErrMsg('حدث خطأ ما أثناء اختيار الصورة')
        })
      }

      const uploadImage =  async (idx) => {
        try {
            if(image === null) 
                return null 
        
            if(image === props.userInfo.picture)
                return  props.userInfo.picture

            const uploadUri = image;
            let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        
            // Add timestamp to File Name
            const extension = filename.split('.').pop(); 
            const name = filename.split('.').slice(0, -1).join('.');
            filename = name + Date.now() + '.' + extension;
            const storageRef = storage().ref(`users/${idx}/${filename}`);
            const task = storageRef.putFile(uploadUri);
           
            await task;
            const url = await storageRef.getDownloadURL()
            return url
        } catch (e) {
            console.log(e)
            setErrMsg('حدث خطأ ما أثناء تحميل الصورة')
            return null
        }
    }

    const $VerifyEmail = (data) => {
        return data.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    }

    const $VerifyPhone = (data) => {
        return data.match(/\d/g)
    }

    const $countryPicker = () => {
        return(
            <CountryPicker 
                withFilter
                countryCode={userInfo.location.flag}
                withAlphaFilter={true}
                withCallingCode
                containerButtonStyle={{paddingLeft: 10, padding:8, borderRightWidth:0.5, backgroundColor:'#2C4770'}}
                onSelect={country=>{
                    setUserInfo({...userInfo, location: {...userInfo.location, country: country.name, code: country.callingCode[0], flag: country.cca2, currency: country.currency[0]} })
                }}
                />
        )
    }
  
    return (
        <View style={styles.container}>
            {!props.Registration? 
                <TouchableOpacity onPress={()=>props.setProfileFormVisibility(false)} 
                            style={{backgroundColor: '#2C4770', width:'100%'}}
                            activeOpacity={0.95}>
                    <Text style={{
                        color:'#fff',
                        fontSize:25,
                        textAlign:'center'
                    }}> 
                    ⓧ
                    </Text>
                </TouchableOpacity>
                :
                null
            }

            <ScrollView style={styles.userInfo} showsVerticalScrollIndicator={false}>
                <LinearGradient 
                    colors={['#2C4770','#FFFFFF']}  
                    style={{flexDirection:'column', height:'22%', width:'100%', alignItems:'baseline', borderWidth:0}}>
                        <Text style={styles.title}>{props.Registration ? "تسجيل صفحه تجاريه" : "تعديل التفاصيل"}</Text>
                        <Avatar
                        size={150}
                        rounded
                        source={image ? {uri: image} : require("../assets/gallary/p1.png")}
                        icon={{ name: 'user', type: 'font-awesome', color:'#2C4770' }}
                        containerStyle={{ backgroundColor: '#FFFFFF' , alignSelf:'center', borderWidth:2, borderColor:'#2C4770'}}
                        onPress={()=>{props.Registration ? null : choosePhotoFromLibrary()}}
                        activeOpacity={0.95}/>
                        {!props.Registration ?
                            <Badge
                                status={image ? "success" : "error"}
                                value={"+"}
                                containerStyle={{ position: 'absolute', bottom:-20, alignSelf:'center'}}
                                textStyle={{fontSize:10, fontWeight:'bold'}} />
                            :
                            null
                        }

                </LinearGradient>
                <Input
                    placeholder="khaled e.g."
                    value={userInfo.name}
                    label="الاسم"
                    maxLength={19}
                    rightIcon={{ type: 'font-awesome', name: 'user' }}
                    inputContainerStyle={{paddingRight:0}}
                    containerStyle={styles.TextInput}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    autoCompleteType
                    onChangeText={value => setUserInfo({...userInfo, name: value })}/>
                <Text style={{paddingLeft:20, marginTop:-25, color: userInfo.name.length < 4  ? '#AF0F02': '#119935'}}>{userInfo.name.length}/17</Text>

                <Input
                    placeholder="khaled@junglesoft.com"
                    label="البريد الالكتروني"
                    value={userInfo.email}
                    maxLength={30}
                    rightIcon={{ type: 'font-awesome', name: 'envelope' }}
                    inputContainerStyle={{paddingRight:0}}
                    containerStyle={styles.TextInput}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setUserInfo({...userInfo, email: value })}
                    {...props}/>
                <Text style={{paddingLeft:20, marginTop:-25, color: $VerifyEmail(userInfo.email)  ? '#119935' : '#AF0F02'}}>{userInfo.email.length}/30</Text>

                <Input
                    placeholder="*******"
                    label="كلمة المرور"
                    value={pass}
                    secureTextEntry={true}
                    maxLength={20}
                    rightIcon={{ type: 'font-awesome', name: 'key' }}
                    inputContainerStyle={{paddingRight:0}}
                    containerStyle={styles.TextInput}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setPass(value)}
                    {...props}/> 
                <Text style={{paddingLeft:20, marginTop:-25, color: pass.length < 8  ? '#AF0F02': '#119935'}}>{pass.length}/20</Text>
                
                <View style={styles.flexInput}>
                    <View style={styles.countryCodeBox}>
                        <$countryPicker />
                        <Text style={styles.countryCode}>(+{userInfo.location.code})</Text>
                    </View>  
                    <Input
                        placeholder="0123456789"
                        label="الهاتف"
                        value={userInfo.phone}
                        rightIcon={{ type: 'font-awesome', name: 'mobile' }}
                        maxLength={10}
                        keyboardType='numeric'
                        inputContainerStyle={{ alignSelf:'flex-end'}}
                        containerStyle={{width:'61%'}}
                        labelStyle={{color:'#171717', textAlign:'right'}}
                        autoCompleteType
                        onChangeText={value => setUserInfo({...userInfo, phone: value })}/>
                </View>
             
                <View style={styles.flexInput}>
                     <Badge
                        status={$VerifyPhone(userInfo.phone) && userInfo.phone.length === 10 ? "success" : "error"}
                        value={$VerifyPhone(userInfo.phone) && userInfo.phone.length === 10 ? "✓" : "✘"}
                        containerStyle={{ position: 'absolute', bottom: 5, left: 20}}
                        textStyle={{fontSize:10}} />
                </View>

                <Input
                    placeholder="ام الفحم"
                    label="البلد"
                    value={userInfo.location.city}
                    rightIcon={{ type: 'font-awesome', name: 'map' }}
                    maxLength={15}
                    inputContainerStyle={{ alignSelf:'flex-end'}}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    containerStyle={styles.TextInput}
                    autoCompleteType
                    onChangeText={value => setUserInfo({...userInfo, location: {...userInfo.location, city: value} })}/>
                <Text style={{paddingLeft:20, marginTop:-25, marginBottom:10, color: userInfo.location.city.length < 4  ? '#AF0F02': '#119935'}}>{userInfo.location.city.length}/15</Text>

                { isLoading ? <ActivityIndicator color='#2C4770' size={40}/> : null }
                {successMsg === '' ? null :  <Text style={{color:'#119935', alignSelf:'center', fontFamily:'Cairo-Regular'}}>{successMsg}</Text>}
                {errMsg === '' ? null :  <Text style={{color:'#AF0F02', alignSelf:'center', fontFamily:'Cairo-Regular'}}>{errMsg}</Text>}

                <View style={{flexDirection:'row', justifyContent:'center'}}>
                <Buttons.ButtonDefault
                    titleLeft={props.Registration? 'تسجيل مستخدم' : "حفظ التفاصيل"}
                    containerStyle={{ justifyContent:'center', borderRadius: 5, width:'70%', backgroundColor: '#2C4770', alignSelf:'center', padding: 5, margin: 10}}
                    textStyle={{fontFamily: 'Cairo-Regular' ,fontSize: 17, color: '#fff'}}
                    onPress={SaveUserInfo}/>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#fff',
        alignItems:'center',
    },
    dropShadow:{
        shadowColor: '#323232',
        shadowOffset: {width: -9, height: 8},
        shadowOpacity: 0.7,
        shadowRadius: 1,
    },
    image:{
        alignSelf:'center',
        marginTop:15
    },
    userInfo:{
        flex:1,
        width: '100%',
    },
    flexInput:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        marginTop: -5
    },
    countryCode:{
        fontSize:15,
        color:'#171717',
        textAlign:'center',
        paddingLeft: 8,
    },
    countryCodeBox:{
        flexDirection:'row', 
        width: '35%', 
        alignItems:'center', 
        borderWidth:0.3,
        borderRadius:5,
        overflow:'hidden',
        marginLeft:7
    },
    TextInput:{
        marginTop:-6,
    },
    title:{
        fontFamily:'Cairo-Regular',
        alignSelf:'center',
        fontSize:16,
        color:'#FFFFFF',
        marginTop:3
    }
})
