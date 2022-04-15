import React from 'react'
import {
    ScrollView, 
    Text,
    StyleSheet,
    Image,
    Alert,
    BackHandler,
    Linking
 } from 'react-native'
 import Buttons from '../elements/Button'
 import auth from '@react-native-firebase/auth'
 import AsyncStorage from '@react-native-async-storage/async-storage'
 import Share from "react-native-share"

const Settings = ({navigation, route}) => {
console.log(route.params)
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
                    AsyncStorage.removeItem('userInfoZaatar')
                    //auth().signOut()
                    //close app
                    BackHandler.exitApp()
                    //navigation.navigate('Entry')
                }
              }
            ])
    }

    const share = async () => {
        const customOptions = {
            title: "زعتر",
            message: "سوق المبيعات",
            url: 'https://play.google.com/store/apps/details?id=com.junglesoft.alhadath'
          }
        try {
          await Share.open(customOptions)
        } catch (err) {
          console.log(err);
        }
    }

    const contactUs = (phoneNumber)=>{
        let data = 'زعتر - '
        Linking.openURL(`whatsapp://send?text=${data}&phone=${phoneNumber}`)
    }

    return (
    <ScrollView style={styles.container}>
        {/* <Image style={styles.img} source={require('../assets/gallary/Zaatar3.png')} /> */}
        <Text style={styles.title}> تم إنشاء هذا التطبيق من أجل ربط البائعين من أماكن مختلفة في جميع أنحاء البلاد. </Text>
        <Text style={styles.title}> تتيح لك هذه المنصة سرد المنتجات التي ترغب في بيعها أو التواصل مع البائعين الذين لديهم منتجات تهمك.</Text>
        <Text style={styles.title}>يمكن أن تكون المنتجات: يدوية الصنع أو مستعملة أو فنية أو أثرية أو مقتنيات أو حتى ورشة عمل أو نوع معين من الخدمات.</Text>
        <Buttons.ButtonDefault
                    titleLeft="تواصل معنا"
                    iconName="whats"
                    iconSize={40}
                    horizontal={false}
                    containerStyle={styles.button}
                    textStyle={{fontFamily: 'Cairo-Bold' ,fontSize: 18, color: '#2C4770'}}
                    iconContainer={{borderRadius:50}}
                    onPress={()=>contactUs('0527919300')}/>
        <Buttons.ButtonDefault
                    titleLeft="مشاركه"
                    iconName="share"
                    iconSize={40}
                    horizontal={false}
                    containerStyle={styles.button}
                    textStyle={{fontFamily: 'Cairo-Bold' ,fontSize: 18, color: '#2C4770'}}
                    iconContainer={{borderRadius:50}}
                    onPress={()=>share()}/>
        {route.params ?
        <Buttons.ButtonDefault
                    titleLeft="خروج"
                    iconName="exit"
                    iconSize={40}
                    horizontal={false}
                    containerStyle={styles.button}
                    textStyle={{fontFamily: 'Cairo-Bold' ,fontSize: 18, color: '#2C4770'}}
                    iconContainer={{borderRadius:50}}
                    onPress={()=>handleLogOut()}/>: null}
    </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#2C4770',
        paddingTop: 20
    },
    title:{
        fontFamily:'Cairo-Bold',
        fontSize:18,
        textAlign:'center',
        color:'#fff',
        margin: 10
    },
    img:{
        width:100, 
        height:100, 
        resizeMode:'contain',
        alignSelf:'center',
    },
    button:{
        justifyContent:'space-around', 
        borderRadius: 5, 
        width:'70%', 
        backgroundColor: '#fff', 
        alignSelf:'flex-end',
        marginTop:15
    }
})
export default Settings;