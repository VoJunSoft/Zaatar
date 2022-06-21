import React, {useState} from 'react'
import {
    ScrollView, 
    Text,
    StyleSheet,
    Image,
    Alert,
    SafeAreaView,
    View
 } from 'react-native'
import Buttons from '../elements/Button'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {contactUsByWhatsapp, share} from '../scripts/Communication'
import firestore from '@react-native-firebase/firestore'
import { Input } from 'react-native-elements'
import RNRestart from 'react-native-restart'

const Settings = ({navigation, route}) => {
    const [userInfo, setUserInfo] = useState(route.params)
    const [errMsg, setErrMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    //console.log(userInfo)

    const logOut = () =>{
        AsyncStorage.removeItem('userInfoZaatar')
        auth().signOut()
        //restart app
        RNRestart.Restart()
    }

    const handleLogOut = () => {
        Alert.alert(
            "زعتر",
            "هل تريد الخروج من الصفحه",
            [
              {
                text: "كلا"
              },
              { 
                text: "نعم", 
                onPress: () =>{
                    logOut()
                }
              }
            ])
    }

    const DeleteAccount = () => {
        Alert.alert(
            "زعتر",
            "هل تريد حذف حسابك",
            [
              {
                text: "كلا"
              },
              { 
                text: "نعم", 
                onPress: () =>{
                  try{
                        //delete products with seller.id
                        firestore().collection('products').where('seller.id','==',userInfo.id).get()
                        .then((querySnapshot)=>{
                            querySnapshot.forEach((doc)=>{
                                // For each doc, add a delete operation to the batch
                                doc.data().delete()
                            })
                        })
                        .catch((e)=>{
                            console.log('delete records', e)
                        })

                        //delete user from users database
                        firestore().collection('users').doc(userInfo.id).delete().then(()=>{})

                        //TODO ::: veryify code and user has to be authenticated recently to be able to commit the following command
                        auth().currentUser.delete()

                        //close app
                        logOut()
                    }catch(e){
                        //setError msg
                        Alert.alert('الرجاء معاودة المحاولة في وقت لاحق')
                    }
                }
              }
            ])
    }

    // email and password input. 
    const [creditsInput, setCreditsInput] = useState({email: route.params ? userInfo.email : '', password:''})
    const [creditsVisibility, setCreditsVisibility] = useState(false)
    const UpdateCreditentials = () =>{
        setErrMsg('')
        setSuccessMsg('')
        try{
            if(creditsInput.password.length >=7 && $VerifyEmail(creditsInput.email)){
                    //update email
                    auth().currentUser.updateEmail(creditsInput.email).then(()=>{}).catch((e)=>{console.log('Email: ', e)})
                    //update password
                    auth().currentUser.updatePassword(creditsInput.password).then(()=>{}).catch((e)=>{console.log('Password', e)})
                    //update users database 
                    firestore().collection('users').doc(userInfo.id).update({'email': creditsInput.email})
                    //update userInfo && async storage
                    setUserInfo({...userInfo, email: creditsInput.email})
                    //the following line can be removed since the user will be logged out
                    AsyncStorage.setItem('userInfoZaatar', JSON.stringify(userInfo))
                    //TODO logOut()
                    setSuccessMsg('تم حفظ المعلومات')
            }else{
                setErrMsg('يوجد نقص في التفاصيل')
            }
       }catch(e){
                setErrMsg('الرجاء معاودة المحاولة في وقت لاحق')
        }
    }

    const $VerifyEmail = (data) => {
        return data.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    }

    return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.Zaatar}>زعتر</Text>
        <Text style={styles.title}> تم إنشاء هذا التطبيق من أجل ربط البائعين من أماكن مختلفة في جميع أنحاء البلاد. </Text>
        <Text style={styles.title}> تتيح لك هذه المنصة سرد المنتجات التي ترغب في بيعها أو التواصل مع البائعين الذين لديهم منتجات تهمك.</Text>
        {/* <Text style={styles.title}>يمكن أن تكون المنتجات: يدوية الصنع أو مستعملة أو فنية أو أثرية أو مقتنيات أو حتى ورشة عمل أو نوع معين من الخدمات.</Text> */}
        <Text style={styles.title}>نحن لسنا مسؤولين عن أي متجر أو منشور على هذه المنصة.</Text>
    

        <Buttons.ButtonDefault
                titleLeft="إشعارات"
                iconName="bell"
                iconSize={35}
                containerStyle={styles.button}
                textStyle={styles.ButtonText}
                //onPress={{}}
                />
      {route.params ?
            <>
            <Buttons.ButtonDefault
                titleLeft="تغيير الاعتمادات"
                iconName="settings"
                iconSize={35}
                containerStyle={styles.button}
                textStyle={styles.ButtonText}
                onPress={()=>setCreditsVisibility(!creditsVisibility)}/>
                {creditsVisibility?
                <View style={styles.creditsBlock}>
                    <Input
                        label="البريد الالكتروني"
                        value={creditsInput.email}
                        maxLength={30}
                        inputStyle={{fontSize:16, textAlign:'center'}}
                        rightIcon={{ type: 'font-awesome', name: 'envelope' }}
                        labelStyle={{color:'#171717', textAlign:'right'}}
                        autoCompleteType={true}
                        onChangeText={value => setCreditsInput({...creditsInput, email: value })}/>
                    <Text style={{paddingLeft:20, marginTop:-25, color: $VerifyEmail(creditsInput.email)  ? '#119935' : '#AF0F02'}}>{creditsInput.email.length}/30</Text>

                    <Input
                        placeholder="اختر كلمة مرور جديدة"
                        label="كلمة المرور"
                        value={creditsInput.password}
                        secureTextEntry={true}
                        maxLength={20}
                        inputStyle={{fontSize:16, textAlign:'center'}}
                        rightIcon={{ type: 'font-awesome', name: 'key' }}
                        labelStyle={{color:'#171717', textAlign:'right'}}
                        autoCompleteType={true}
                        onChangeText={value => setCreditsInput({...creditsInput, password: value })}/> 
                    <Text style={{paddingLeft:20, marginTop:-25, color: creditsInput.password.length < 8  ? '#AF0F02': '#119935'}}>{creditsInput.password.length}/20</Text>

                    {successMsg === '' ? null :  <Text style={{color:'#119935', alignSelf:'center', fontFamily:'Cairo-Regular'}}>{successMsg}</Text>}
                    {errMsg === '' ? null :  <Text style={{color:'#AF0F02', alignSelf:'center', fontFamily:'Cairo-Regular'}}>{errMsg}</Text>}
                    <Buttons.ButtonDefault
                        titleLeft={"حفظ التفاصيل"}
                        containerStyle={{ justifyContent:'center', borderRadius: 5, width:'70%', backgroundColor: '#2C4770', alignSelf:'center', padding: 7, margin: 10}}
                        textStyle={{fontFamily: 'Cairo-Regular' ,fontSize: 18, color: '#fff'}}
                        onPress={()=>UpdateCreditentials()}/>
                </View>
                :null}
            </>
            :
                null
            }

        <Buttons.ButtonDefault
                titleLeft="تواصل معنا"
                iconName="envelope"
                iconSize={35}
                containerStyle={styles.button}
                textStyle={styles.ButtonText}
                onPress={()=>contactUsByWhatsapp("سوق المبيعات", '+9720527919300')}/>
        <Buttons.ButtonDefault
                titleLeft="مشاركه"
                iconName="share"
                iconSize={35}
                containerStyle={styles.button}
                textStyle={styles.ButtonText}
                onPress={()=>share()}/>
        {route.params ?
            <>
                <Buttons.ButtonDefault
                        titleLeft="خروج"
                        iconName="exit"
                        iconSize={35}
                        containerStyle={styles.button}
                        textStyle={styles.ButtonText}
                        onPress={()=>handleLogOut()}/>
                <Buttons.ButtonDefault
                        titleLeft="حذف الحساب"
                        iconName="delete"
                        iconSize={35}
                        containerStyle={[styles.button,{marginBottom:25}]}
                        textStyle={styles.ButtonText}
                        onPress={()=>DeleteAccount()}
                        disabled/>
            </>
        : 
            null
        }
    </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor: '#fff',
        paddingTop: 10,
    },
    title:{
        fontFamily:'Cairo-Regular',
        fontSize:17,
        textAlign:'center',
        color:'#171717',
        margin: 5,
        lineHeight:33
    },
    Zaatar:{
        fontFamily:'Cairo-Bold',
        fontSize:25,
        textAlign:'center',
        color:'#2C4770',
    },
    img:{
        width:100, 
        height:100, 
        resizeMode:'contain',
        alignSelf:'center',
    },
    button:{
        justifyContent:'flex-end',
        borderRadius: 5, 
        width:'70%', 
        backgroundColor: '#2C4770',
        alignSelf:'flex-end',
        marginTop:10,
        paddingRight:10,
        marginRight:-5
    },
    ButtonText: {
        fontFamily: 'Cairo-Regular' ,
        fontSize: 17, 
        color: '#fff',
        marginRight: 20
    },
    creditsBlock:{
        width:'95%',
        alignSelf:'center',
        borderWidth:1,
        padding:5,
        margin:10,
        borderRadius:7
    }
})
export default Settings;