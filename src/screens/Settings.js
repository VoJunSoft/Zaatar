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
 import {contactUsByWhatsapp, share} from '../scripts/Communication'

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

    return (
    <ScrollView style={styles.container}>
        {/* <Image style={styles.img} source={require('../assets/gallary/Zaatar3.png')} /> */}
        <Text style={styles.title}> تم إنشاء هذا التطبيق من أجل ربط البائعين من أماكن مختلفة في جميع أنحاء البلاد. </Text>
        <Text style={styles.title}> تتيح لك هذه المنصة سرد المنتجات التي ترغب في بيعها أو التواصل مع البائعين الذين لديهم منتجات تهمك.</Text>
        <Text style={styles.title}>يمكن أن تكون المنتجات: يدوية الصنع أو مستعملة أو فنية أو أثرية أو مقتنيات أو حتى ورشة عمل أو نوع معين من الخدمات.</Text>
        <Buttons.ButtonDefault
                    titleLeft="تواصل معنا"
                    iconName="whats"
                    iconSize={35}
                    containerStyle={styles.button}
                    textStyle={styles.ButtonText}
                    onPress={()=>contactUsByWhatsapp('+972527919300')}/>
        <Buttons.ButtonDefault
                    titleLeft="مشاركه"
                    iconName="share"
                    iconSize={35}
                    containerStyle={styles.button}
                    textStyle={styles.ButtonText}
                    onPress={()=>share()}/>
        {route.params ?
            <Buttons.ButtonDefault
                    titleLeft="خروج"
                    iconName="exit"
                    iconSize={35}
                    containerStyle={styles.button}
                    textStyle={styles.ButtonText}
                    onPress={()=>handleLogOut()}/>
        : 
            null
        }
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
        fontFamily:'Cairo-Regular',
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
        justifyContent:'flex-end',
        borderRadius: 5, 
        width:'70%', 
        backgroundColor: 'rgba(255,255,255,0.2)', 
        alignSelf:'flex-end',
        marginTop:15,
        paddingRight:8
    },
    ButtonText: {
        fontFamily: 'Cairo-Regular' ,
        fontSize: 17, 
        color: '#171717',
        marginRight: 20
    }
})
export default Settings;