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

export default function ProfileForm(props) {
    const navigation = useNavigation();
    // user information state
    //TODO const [userInfo, setUserInfo] = useState(props.userInfo) HINT bug was fixed
    const [userInfo, setUserInfo] = useState(props.userInfo ? props.userInfo : {})
    const [image, setImage] = useState(props.userInfo ? props.userInfo.picture : null)
    const [isLoading, setIsloading] = useState(false)
    const [errMsg, setErrMsg] = useState('')

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
                    props.setProfileFormVisibility(false)
                    setIsloading(false)
                    Alert.alert('تم حفظ المعلومات') 
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
                            console.log(user)
                            //get user id, retrieve data from data base then store by id 
                            firestore().collection('users').doc(user.uid).set(data)
                            .then(()=>{
                                AsyncStorage.setItem('userInfoZaatar', JSON.stringify({...data, id: user.uid}))
                                navigation.navigate('Zaatar')
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
          width: undefined,
          height: 150,
          cropping: true,
        }).then((image) => {
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            //upload and return image url
            //uploadImage(imageUri)
            setImage(imageUri)
        })
        .catch((e) =>{
            //setImage([])
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
            return null
        }
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
                <Avatar
                    size={150}
                    rounded
                    source={image ? {uri: image} : require('../assets/gallary/profile.png') }
                    icon={{ name: 'user', type: 'font-awesome' }}
                    containerStyle={{ backgroundColor: '#2C4770' , alignSelf:'center', margin:5}}
                    onPress={()=>choosePhotoFromLibrary()}
                />
                <Input
                    placeholder="khaled e.g."
                    //placeholderTextColor="red"
                    value={userInfo.name}
                    label="الاسم"
                    rightIcon={{ type: 'font-awesome', name: 'user' }}
                    inputContainerStyle={{ alignSelf:'flex-end'}}
                    containerStyle={{borderWidth:0}}
                    labelStyle={{color:'#171717', textAlign:'right', fontFamily:'Cairo-Regular'}}
                    onChangeText={value => setUserInfo({...userInfo, name: value })}
                />
                <Input
                    placeholder="khaled@junglesoft.com"
                    label="البريد الالكتروني"
                    value={userInfo.email}
                    rightIcon={{ type: 'font-awesome', name: 'envelope' }}
                    inputContainerStyle={{ paddingLeft: 5}}
                    containerStyle={{borderWidth:0}}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setUserInfo({...userInfo, email: value })}
                    {...props}
                />
                <Input
                    placeholder="*******"
                    label="كلمة المرور"
                    value={pass}
                    secureTextEntry={true}
                    rightIcon={{ type: 'font-awesome', name: 'key' }}
                    inputContainerStyle={{ paddingLeft: 5}}
                    containerStyle={{borderWidth:0}}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setPass(value)}
                    {...props}
                /> 
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
                    onChangeText={value => setUserInfo({...userInfo, phone: value })}
                />
                    <Input
                    placeholder="Umm-Elfahm"
                    label="البلد"
                    value={userInfo.location}
                    rightIcon={{ type: 'font-awesome', name: 'map' }}
                    maxLength={15}
                    inputContainerStyle={{ paddingLeft: 5}}
                    containerStyle={{borderWidth:0}}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setUserInfo({...userInfo, location: value })}
                />
                { isLoading ? <ActivityIndicator color='#2C4770' size={40}/> : null }
                {errMsg === '' ? null :  <Text style={{color:'red', alignSelf:'center', fontFamily:'Cairo-Regular'}}>{errMsg}</Text>}
                <Buttons.ButtonDefault
                    titleLeft={props.Registration? 'تسجيل مستخدم' : "حفظ التفاصيل"}
                    //iconName="add"
                    iconSize={40}
                    horizontal={false}
                    containerStyle={{ justifyContent:'center', borderRadius: 5, width:'90%', backgroundColor: '#2C4770', alignSelf:'center', padding: 7, margin: 10}}
                    textStyle={{fontFamily: 'Cairo-Bold' ,fontSize: 18, color: '#fff'}}
                    iconContainer={{backgroundColor:'rgba(255,255,255,0.25)', borderRadius:50}}
                    onPress={SaveUserInfo}
                />
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
