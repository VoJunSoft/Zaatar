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
    ActivityIndicator
} from 'react-native'
import { Avatar, Input } from 'react-native-elements'
import Buttons from '../elements/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import RNRestart from 'react-native-restart'

export default function ProfileForm(props) {
    const navigation = useNavigation();
    // user information state
    //TODO const [userInfo, setUserInfo] = useState(props.userInfo) HINT bug was fixed
    const [userInfo, setUserInfo] = useState(props.userInfo ? props.userInfo : {id:'', email:'', phone:'', location:'', name:''})
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
                firestore().collection('users').doc(userInfo.id).set(value ,{merge: true})
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
                            //get uid and pass it to store data
                            const user = userCreditentials.user
                            //get user id, retrieve data from data base then store by id 
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
                                setErrMsg('آسف حدث خطأ أثناء حفظ البيانات الخاصة بك', e)
                            })
                        })
                        .catch((e)=>{
                            //err auth()
                            setErrMsg('يبدو أن بريدك الإلكتروني موجود بالفعل', e)
                        })           
        return()=> sub
    }

    const SaveUserInfo = async () => {
        setErrMsg('')
        setSuccessMsg('')
        try{    
            if(userInfo.name.length >=4 && pass.length >=7
                && userInfo.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) 
                && userInfo.phone.match(/\d/g)
                && userInfo.location.length >=4 ){
                
                setIsloading(true)
                const imageUri = await uploadImage()
                if(props.Registration === true){
                    //create authenticated user && save to database && save to async
                    registerUser({...userInfo, picture:imageUri})
                }else{
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
          width: 200,
          height: 200,
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

      const uploadImage =  async () => {
        try {
            if( image === null ) 
                return null 
        
            if(image === props.userInfo.picture)
                return  props.userInfo.picture

            const uploadUri = image;
            let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        
            // Add timestamp to File Name
            const extension = filename.split('.').pop(); 
            const name = filename.split('.').slice(0, -1).join('.');
            filename = name + Date.now() + '.' + extension;
            const storageRef = storage().ref(`users/${filename}`);
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
    return (
        <View style={styles.container}>
            {!props.Registration? 
             <TouchableOpacity onPress={()=>props.setProfileFormVisibility(false)} 
                          style={{backgroundColor: '#2C4770', borderTopLeftRadius:10, borderTopRightRadius:10, width:'100%'}}
                          activeOpacity={0.7}>
                <Text style={{
                    color:'#fff',
                    fontSize:30,
                    textAlign:'center'
                }}> 
                ⓧ
                </Text>
            </TouchableOpacity>
            : null}
            <ScrollView style={styles.userInfo} showsVerticalScrollIndicator={false}>
                { image ? 
                    <Avatar
                        size={150}
                        rounded
                        source={{uri: image}}
                        icon={{ name: 'photo', type: 'font-awesome' }}
                        containerStyle={{ backgroundColor: '#2C4770' , alignSelf:'center', margin:5}}
                        onPress={()=>choosePhotoFromLibrary()}/>
                :
                    <Buttons.ButtonDefault
                        titleRight='تحميل الصورة'
                        iconName="photo"
                        iconSize={100}
                        horizontal={true}
                        containerStyle={{ justifyContent:'center', borderRadius: 5, width:'90%', alignSelf:'center', padding: 7, margin: 10}}
                        textStyle={{fontFamily: 'Cairo-Regular' ,fontSize: 15, color: '#2C4770'}}
                        iconContainer={{backgroundColor: '#2C4770', borderRadius:100, padding:10}}
                        onPress={()=>choosePhotoFromLibrary()}/>
                }
                <Input
                    placeholder="khaled e.g."
                    //placeholderTextColor="red"
                    value={userInfo.name}
                    label="الاسم"
                    maxLength={15}
                    rightIcon={{ type: 'font-awesome', name: 'user' }}
                    inputContainerStyle={{ alignSelf:'flex-end'}}
                    containerStyle={{}}
                    labelStyle={{color:'#171717', textAlign:'right', fontFamily:'Cairo-Regular'}}
                    onChangeText={value => setUserInfo({...userInfo, name: value })}/>
                <Text style={{paddingLeft:20, marginTop:-25, color: userInfo.name.length < 4  ? 'red': 'green'}}>{userInfo.name.length}/15</Text>

                <Input
                    placeholder="khaled@junglesoft.com"
                    label="البريد الالكتروني"
                    value={userInfo.email}
                    maxLength={25}
                    rightIcon={{ type: 'font-awesome', name: 'envelope' }}
                    inputContainerStyle={{ paddingLeft: 5}}
                    containerStyle={{borderWidth:0}}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setUserInfo({...userInfo, email: value })}
                    {...props}/>
                <Text style={{paddingLeft:20, marginTop:-25, color: $VerifyEmail(userInfo.email)  ? 'green' : 'red'}}>{userInfo.email.length}/25</Text>

                <Input
                    placeholder="*******"
                    label="كلمة المرور"
                    value={pass}
                    secureTextEntry={true}
                    maxLength={20}
                    rightIcon={{ type: 'font-awesome', name: 'key' }}
                    inputContainerStyle={{ paddingLeft: 5}}
                    containerStyle={{borderWidth:0}}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setPass(value)}
                    {...props}/> 
                <Text style={{paddingLeft:20, marginTop:-25, color: pass.length < 8  ? 'red': 'green'}}>{pass.length}/20</Text>

                <Input
                    placeholder="0123456789"
                    label="الهاتف"
                    value={userInfo.phone}
                    rightIcon={{ type: 'font-awesome', name: 'mobile' }}
                    maxLength={10}
                    keyboardType='numeric'
                    inputContainerStyle={{ paddingLeft: 5}}
                    containerStyle={{borderWidth:0}}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setUserInfo({...userInfo, phone: value })}/>
                <Text style={{paddingLeft:20, marginTop:-25, color: userInfo.phone.length !== 10  ? 'red': 'green'}}>{userInfo.phone.length}/10</Text>

                <Input
                    placeholder="Umm-Elfahm"
                    label="البلد"
                    value={userInfo.location}
                    rightIcon={{ type: 'font-awesome', name: 'map' }}
                    maxLength={15}
                    inputContainerStyle={{ paddingLeft: 5}}
                    containerStyle={{borderWidth:0}}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setUserInfo({...userInfo, location: value })}/>
                <Text style={{paddingLeft:20, marginTop:-25, marginBottom:10, color: userInfo.location.length < 4  ? 'red': 'green'}}>{userInfo.location.length}/15</Text>

                { isLoading ? <ActivityIndicator color='#2C4770' size={40}/> : null }
                {successMsg === '' ? null :  <Text style={{color:'green', alignSelf:'center', fontFamily:'Cairo-Regular'}}>{successMsg}</Text>}
                {errMsg === '' ? null :  <Text style={{color:'red', alignSelf:'center', fontFamily:'Cairo-Regular'}}>{errMsg}</Text>}
                <View style={{flexDirection:'row', justifyContent:'center'}}>
                <Buttons.ButtonDefault
                    titleLeft={props.Registration? 'تسجيل مستخدم' : "حفظ التفاصيل"}
                    containerStyle={{ justifyContent:'center', borderRadius: 5, width:'70%', backgroundColor: '#2C4770', alignSelf:'center', padding: 7, margin: 10}}
                    textStyle={{fontFamily: 'Cairo-Bold' ,fontSize: 18, color: '#fff'}}
                    onPress={SaveUserInfo}/>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        //backgroundColor: '#2C4770',
        backgroundColor: '#fff',
        alignItems:'center',
        borderRadius: 10,
    },
    dropShadow:{
        shadowColor: '#323232',
        shadowOffset: {width: -9, height: 8},
        shadowOpacity: 0.7,
        shadowRadius: 1,
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
        marginBottom:20,
    },
    image:{
        alignSelf:'center',
        marginTop:15
    },
    userInfo:{
        flex:1,
        width: '90%',
        alignSelf: 'center',
    }
})
