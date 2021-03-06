import React, {useState} from 'react'
import { 
    View, 
    Text, 
    StyleSheet,
    ScrollView,
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
import {Picker} from '@react-native-picker/picker'
import {CitiesWithinCountry} from "../scripts/CategoriesCountries.json"
import * as Animatable from 'react-native-animatable'
//import * as RNLocalize from "react-native-localize"

export default function ProfileForm(props) {
    const navigation = useNavigation();
    
    // user information state
    //TODO ::: get location:{} of nonusers based on thier location instead of the initial values currently being passed
    const [userInfo, setUserInfo] = useState(props.userInfo ? 
                props.userInfo 
                : 
                {id:'', email:'', phone:'', name:'', rule:'', location:{country:'Palestine', code:'970', flag:'PS', currency: 'ILS', city:''}}
            )
    //find the index of the user's country within the CitiesWithinCountry array
    const [indexOfCountry, setCountryIndex] = useState(CitiesWithinCountry.findIndex(object => object.Country === userInfo.location.country))
    const [image, setImage] = useState(props.userInfo ? props.userInfo.picture : null)
    const [isLoading, setIsloading] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    //Edit user profile information
    const storeData = (value) => {
        try {
            //update async storage userInfo
            AsyncStorage.mergeItem('userInfoZaatar', JSON.stringify(value))
            .then(()=>{
                //NOTE user id is also stored as snapshot in users!
                firestore().collection('users').doc(userInfo.id).update(value)
                    .then(()=>{
                        //immediate update to profile info
                        props.setUserInfo(value)
                        //Hide form
                        //props.setProfileFormVisibility(false)
                    })
            })
            .then(()=>{
                //update userInfo in Products
                //updateUserInfoInProducts(value)
                setIsloading(false)
                setSuccessMsg('???? ?????? ??????????????????')
            })
        } catch (e) {
            //err storing data
        }
    }

    const updateUserInfoInProducts = (data) =>{
        try{
            const sub = firestore().collection('products')
            //delete products with seller.id
            sub.where('seller.id','==',data.id).get()
            .then((querySnapshot)=>{
                querySnapshot.forEach((doc)=>{
                    // For each doc, update
                    sub.doc(doc.id).update({...doc.data(), seller: data})
                })
            })
            .catch((e)=>{
                console.log('update products', e)
            })
        }catch(e){
            //setError msg
            setErrMsg('???????????? ???????????? ???????????????? ???? ?????? ????????')
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
                                setSuccessMsg('???? ?????????????? ??????????')
                                //restart app to update app.js values
                                RNRestart.Restart()
                            })
                            .catch((e)=>{
                                //error firestore()
                                setErrMsg('?????? ?????? ?????? ?????????? ?????? ???????????????? ???????????? ????')
                            })
                        })
                        .catch((e)=>{
                            //err auth()
                            setErrMsg('???????? ???? ?????????? ???????????????????? ?????????? ????????????')
                        })           
        return()=> unsub
    }

    const SaveUserInfo = async () => {
        setErrMsg('')
        setSuccessMsg('')
        try{    
            if(userInfo.name.length >=4 && pass.length >=7
                && userInfo.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) 
                && $VerifyPhone(userInfo.phone)
                && userInfo.location.city!=='' ){
                
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
                setErrMsg('???????? ?????? ???? ????????????????')
            }  
        }catch(e){
                setErrMsg('..???????? ?????? ???? ????????????????')
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
            setErrMsg('?????? ?????? ???? ?????????? ???????????? ????????????')
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
            setErrMsg('?????? ?????? ???? ?????????? ?????????? ????????????')
            return null
        }
    }

    const $VerifyEmail = (data) => {
        return data.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    }

    const $VerifyPhone = (data) => {
        return !data.match(/[^0-9]/g)
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
                    setUserInfo({...userInfo, location: {...userInfo.location, country: country.name, code: country.callingCode[0], flag: country.cca2, currency: country.currency[0], city:''}})
                    setCountryIndex(CitiesWithinCountry.findIndex(object => object.Country === country.name))
                }}
                />
        )
    }
  
    return (
        <View style={styles.container}>
            {!props.Registration? 
                <TouchableOpacity onPress={()=>props.setProfileFormVisibility(false)} 
                            style={{backgroundColor: '#2C4770', width:'100%'}}
                            activeOpacity={.99}>
                    <Text style={{
                        color:'#fff',
                        fontSize:25,
                        textAlign:'center'
                    }}> 
                    ???
                    </Text>
                </TouchableOpacity>
                :
                null
            }

            <ScrollView style={styles.userInfo} showsVerticalScrollIndicator={false}>
                <LinearGradient 
                    colors={['#2C4770','#FFFFFF']}  
                    style={{flexDirection:'column', height:'20%', width:'100%', borderWidth:0}}>
                        <Text style={styles.title}>{props.Registration ? "?????????? ???????? ????????????" : "?????????? ????????????????"}</Text>
                        <Avatar
                        size={145}
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
                                containerStyle={{ position: 'absolute', bottom:"-22%", alignSelf:'center'}}
                                textStyle={{fontSize:10, fontWeight:'bold'}} />
                            :
                            null
                        }

                </LinearGradient>
                <Animatable.View    
                    animation="bounceInDown"
                    easing="ease"
                    iterationCount={1}
                    duration={2000}
                    direction="normal">
                    <Input
                        placeholder="khaled e.g."
                        value={userInfo.name}
                        label="??????????"
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
                        label="???????????? ????????????????????"
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
                        label="???????? ????????????"
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
                            label="????????????"
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
                            status={$VerifyPhone(userInfo.phone) && userInfo.phone.length >= 8 ? "success" : "error"}
                            value={$VerifyPhone(userInfo.phone) && userInfo.phone.length >= 8 ? "???" : "???"}
                            containerStyle={{ position: 'absolute', bottom: 5, left: 20}}
                            textStyle={{fontSize:9}} />
                    </View>

                    {/* <Input
                        placeholder="???? ??????????"
                        label="??????????"
                        value={userInfo.location.city}
                        rightIcon={{ type: 'font-awesome', name: 'map' }}
                        maxLength={15}
                        inputContainerStyle={{ alignSelf:'flex-end'}}
                        labelStyle={{color:'#171717', textAlign:'right'}}
                        containerStyle={styles.TextInput}
                        autoCompleteType
                        onChangeText={value => setUserInfo({...userInfo, location: {...userInfo.location, city: value} })}/> */}
                        
                    <View style={styles.cities}>
                        <Text style={{fontWeight:'bold', fontSize:18, color:'#000', marginRight: 5, marginBottom:-7}}>??????????</Text>
                        <Picker
                            selectedValue={userInfo.location.city}
                            style={styles.TextInput}
                            onValueChange={(itemValue, itemIndex) => setUserInfo({...userInfo, location: {...userInfo.location, city: itemValue}})}>
                            <Picker.Item style={{fontSize:15, color:indexOfCountry === -1 ? '#FF0000' : '#000000'}} label={indexOfCountry === -1 ? "?????????? ???????????? ???? ???????? ????????????" : "???????? ?????????? - "} value="" />
                            {indexOfCountry !== -1 ?
                                CitiesWithinCountry[indexOfCountry].Cities.map((item, index)=>[ 
                                        <Picker.Item label={item} 
                                                        value={item} 
                                                        key={index} />
                                ])
                                :
                                null
                            }
                        </Picker> 
                        <Badge
                            status={userInfo.location.city !=='' &&  indexOfCountry !== -1 ? "success" : "error"}
                            value={userInfo.location.city !=='' &&  indexOfCountry !== -1 ? "???" : "???"}
                            containerStyle={{ position: 'absolute', bottom: -25, left: 9}}
                            textStyle={{fontSize:9}} 
                            />
                    </View>

                    <View style={{height:50, justifyContent:'center', margin:5}}>
                        { isLoading ? <ActivityIndicator color='#2C4770' size={40}/> : null }
                        {successMsg === '' ? null :  <Text style={{color:'#119935', alignSelf:'center', fontFamily:'Cairo-Regular'}}>{successMsg}</Text>}
                        {errMsg === '' ? null :  <Text style={{color:'#AF0F02', alignSelf:'center', fontFamily:'Cairo-Regular'}}>{errMsg}</Text>}
                    </View>

                    <View style={{flexDirection:'row', justifyContent:'center'}}>
                    <Buttons.ButtonDefault
                        titleLeft={props.Registration? '?????????? ????????????' : "?????? ????????????????"}
                        containerStyle={{ justifyContent:'center', borderRadius: 5, width:'70%', backgroundColor: '#2C4770', alignSelf:'center', padding: 5}}
                        textStyle={{fontFamily: 'Cairo-Regular' ,fontSize: 17, color: '#fff'}}
                        onPress={SaveUserInfo}/>
                    </View>
                </Animatable.View>
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
        marginTop:-5,
    },
    title:{
        fontFamily:'Cairo-Regular',
        alignSelf:'center',
        fontSize:16,
        color:'#FFFFFF',
        marginTop:3
    },
    cities:{
        borderBottomWidth:0.7,
        width:'95%',
        alignSelf:'center',
    }
})
