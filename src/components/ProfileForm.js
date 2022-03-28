import React, {useState} from 'react'
import { 
    View, 
    Text, 
    StyleSheet,
    Dimensions,
    ScrollView,
    Alert,
    Keyboard,
    TouchableOpacity
} from 'react-native'
import { Avatar, Input } from 'react-native-elements';
import Buttons from '../elements/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore';

export default function ProfileForm(props) {

    // user information state
    //TODO const [userInfo, setUserInfo] = useState(props.userInfo) HINT bug was fixed
    const [userInfo, setUserInfo] = useState({...props.userInfo, phone:props.userInfo.phone ? props.userInfo.phone : '', location: props.userInfo.location ? props.userInfo.location : ''})
 
    const storeData = (value) => {
        try {
            AsyncStorage.setItem('userInfoZaatar', JSON.stringify(value))
            .then(()=>{
                // Add a new document in collection "users" with ID if it does not exist
                firestore().collection('users').doc(userInfo.id).set(value ,{merge: true})

                Alert.alert('تم حفظ المعلومات') 
                //remove keyboard
                Keyboard.dismiss()
            })
        } catch (e) {
            //err storing data
        }
    }

    const SaveUserInfo = () => {
        if(userInfo.name.length >=4 
            && userInfo.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) 
            && userInfo.phone.match(/\d/g)
            && userInfo.location.length >=4 ){

            //store data into async & database
            storeData(userInfo)

            //immediate update to profile info
            props.setUserInfo(userInfo)
            //Hide form
            props.setProfileFormVisibility(false)
        }else{
            Alert.alert('يوجد نقص في التفاصيل')
        }   
    }
    return (
        <View style={styles.container}>
             <TouchableOpacity onPress={()=>props.setProfileFormVisibility(false)} 
                          style={{backgroundColor: '#2C4770', borderTopLeftRadius:10, borderTopRightRadius:10}}
                          activeOpacity={0.7}>
                <Text style={{
                    color:'#fff',
                    fontSize:30,
                    textAlign:'center'
                }}> 
                ⓧ
                </Text>
            </TouchableOpacity>
            <ScrollView style={styles.userInfo}>
            <Avatar
                    size={150}
                    rounded
                    source={{uri: userInfo.picture.data.url}}
                    icon={{ name: 'user', type: 'font-awesome' }}
                    containerStyle={{ backgroundColor: '#323232' , alignSelf:'center', margin:15}}
                    key={1}
                />
                <Input
                    placeholder="khaled e.g."
                    placeholderTextColor="red"
                    value={userInfo.name}
                    label="الاسم"
                    rightIcon={{ type: 'font-awesome', name: 'user' }}
                    inputContainerStyle={{ alignSelf:'flex-end'}}
                    containerStyle={{borderWidth:0}}
                    labelStyle={{color:'#171717', textAlign:'right', fontFamily:'Cairo-Regular'}}
                    onChangeText={value => setUserInfo({...userInfo, name: value })}
                    //errorMessage={InputLengthField()}
                />
                <Input
                    placeholder="khaled@junglesoft.com"
                    placeholderTextColor="red"
                    label="البريد الالكتروني"
                    value={userInfo.email}
                    rightIcon={{ type: 'font-awesome', name: 'envelope' }}
                    inputContainerStyle={{ paddingLeft: 5}}
                    containerStyle={{borderWidth:0}}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setUserInfo({...userInfo, email: value })}
                />
                <Input
                    placeholder="0123456789"
                    placeholderTextColor="red"
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
                    placeholderTextColor="red"
                    label="البلد"
                    value={userInfo.location}
                    rightIcon={{ type: 'font-awesome', name: 'map' }}
                    maxLength={15}
                    inputContainerStyle={{ paddingLeft: 5}}
                    containerStyle={{borderWidth:0}}
                    labelStyle={{color:'#171717', textAlign:'right'}}
                    onChangeText={value => setUserInfo({...userInfo, location: value })}
                />
                <Buttons.ButtonDefault
                    titleLeft="حفظ التفاصيل"
                    iconName="add"
                    iconSize={40}
                    horizontal={false}
                    containerStyle={{ justifyContent:'center', borderRadius: 5, width:'90%', backgroundColor: '#2C4770', alignSelf:'center', padding: 5, marginBottom: 10}}
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
        //justifyContent:'center'
    }
})
