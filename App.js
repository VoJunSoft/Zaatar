import 'react-native-gesture-handler'
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useEffect, useState} from 'react'
import {
  View,
  Text,
  I18nManager,
  StatusBar,
  Image,
  LogBox,
  TouchableOpacity,
  BackHandler
} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {createDrawerNavigator} from '@react-navigation/drawer'
import Zaatar from './src/screens/Zaatar'
import Profile from './src/screens/Profile'
import SellerProfile from './src/screens/SellerProfile'
import Settings from './src/screens/Settings'
import Registration from './src/screens/Registration'
import Entry from './src/screens/Entry'
import Stores from './src/screens/Stores'
import WorkShops from './src/screens/Workshops'
import AppStyles from './src/styles/AppStyle'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Avatar } from 'react-native-elements'
import Buttons from './src/elements/Button'
//import firestore from '@react-native-firebase/firestore'
//import * as RNLocalize from "react-native-localize"
//import NavigationBar from 'react-native-navbar-color'
//import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5'

I18nManager.forceRTL(false)
I18nManager.allowRTL(false)
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

const Drawer = createDrawerNavigator()
const App = () => {
  // user information state
  const [userInfo, setUserInfo] = useState({})
  const [isUser, setIsUser] = useState(false)

  //const [stores, setStores] = useState([])
  //const [isLoading, setIsLoading] = useState(true)
  useEffect( ()=>{
    //    const unsubscribe = navigation.addListener('focus', () => {
    //          auth().onAuthStateChanged((user) => {
    //            if(user)
                    getData()
    //          })
    //     })

    // const nav = [
    //       NavigationBar.setStatusBarColor("#2C4770",true), 
    //       NavigationBar.setStatusBarTheme('light',true), 
    //       NavigationBar.setColor("#2C4770")
    // ]
  }, [])

  const getData =  async () => {
    try {
           AsyncStorage.getItem('userInfoZaatar')
           .then((value) => {
                if(value !== null){
                    setUserInfo(JSON.parse(value))
                    //fillUpStoresList(JSON.parse(value).location.flag)
                    setIsUser(true)
                }else{
                    //fillUpStoresList(RNLocalize.getCountry())
                }
           })
    } catch(e) {
      // error reading value
      console.log(e)
    }
  }

  //get stores within location
  //stores object fields: id, name, location, phone, picture, email
  // const fillUpStoresList = (locationData) => {
  // const subscriber = firestore()
  //     .collection('users')
  //     .onSnapshot(querySnapshot => {
  //         setStores([])
  //         querySnapshot.forEach(documentSnapshot => {
  //             if(documentSnapshot.data().location.flag === locationData){
  //                 setStores((prevState) => {
  //                     return [{...documentSnapshot.data(), id: documentSnapshot.id},  ...prevState]
  //                 })
  //             }
  //         })
  //         setIsLoading(false)
  //     })

  //     return() => subscriber()
  // }

  const ProfileElement = (props) =>{
    return(
      <View style={{alignSelf:'center', borderBottomWidth:2, marginLeft:20, borderColor:'#2C4770',  alignItems:'center'}}>
        <Text style={AppStyles.textTitle}>{userInfo.name ? userInfo.name : null}</Text>
        <Avatar
            size={120}
            rounded
            source={userInfo.picture ? {uri: userInfo.picture} : props.img }
            icon={{ name: 'user', type: 'font-awesome', color: '#2C4770'}}
            containerStyle={{ backgroundColor: isUser ? '#fff' : '#2C4770', margin: 3}}
        />
        <Text style={AppStyles.textTitle}>{userInfo.id ? 'الصفحه الشخصيه' : 'تسجيل الدخول'}</Text>
      </View>
    )
  }

  const MenuItem = (props) => {
    return(
      <Buttons.ButtonDefault 
          titleLeft={props.title}
          iconName={props.icon}
          iconSize={25}
          containerStyle={{justifyContent:'flex-end'}}
          textStyle={{fontFamily: 'Cairo-Regular',color:'#2C4770', fontSize:13}}
          disabled
      />
    )
  }


  const HeaderRightIcon = () => {
    return(
      <TouchableOpacity onPress={()=> {}}>
        <Image style={{width:40, height:40, resizeMode:'contain', marginRight:7}} source={require('./src/assets/gallary/Zaatar3.png')} />
      </TouchableOpacity>
    )
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" hidden={false} backgroundColor='#2C4770'/>
      <Drawer.Navigator 
          initialRouteName='Zaatar'
          backBehavior='history'
          screenOptions={{
            swipeEnabled:false,
            headerShown: true,
            drawerType:"front",
            drawerPosition:"left",
            overlayColor:'#00000040', //'#E5EEFF10',
            headerTitleAlign:'center',
            headerRight:(()=> <HeaderRightIcon/>),
            headerStyle:{
              backgroundColor: '#2C4770'
            },
            headerTintColor:'#fff',
            headerTitleStyle:{
              fontSize:22,
              fontFamily:'Cairo-Bold',
              letterSpacing: 5,
              color:'white'
            },
            drawerActiveBackgroundColor:'rgba(0,0,0,0.2)',
            drawerStyle:{
              backgroundColor:'#E5EEFF', //#A3BFF6 , #DEE4EF, #BDD0F6
              width:230,
              borderTopRightRadius:12,
              borderBottomRightRadius:12,
              padding:5
            },
            drawerLabelStyle:{
              fontFamily:'Cairo-Regular',
              color: '#2C4770',
              fontSize:13           
            }
          }}>
        {!isUser ? 
        <>
          <Drawer.Screen
              name="Entry"
              component={Entry}
              options={{
                headerShown: false,
                drawerLabel: ()=><ProfileElement img={require('./src/assets/gallary/Zaatar.png')}/>
              }}/>
          <Drawer.Screen
              name="Registration"
              component={Registration}
              options={{
                headerShown: false,
                drawerItemStyle: {
                  display: "none",
                }}}/>
          <Drawer.Screen
              name="Zaatar"
              component={Zaatar}
              initialParams={userInfo}
              options={{
                title:'زعتر',
                drawerLabel: ()=><MenuItem icon='zaatar' title='الصفحة الرئيسية'/>
              }}/>
           <Drawer.Screen
            name="Stores"
            component={Stores}
            initialParams={userInfo}
            options={{
              title:'صفحات تجارية',
              drawerLabel: ()=><MenuItem icon='store' title='صفحات تجارية'/>
            }}/>
          
          <Drawer.Screen
            name="WorkShops"
            component={WorkShops}
            options={{
              title:'ورش عمل',
              drawerLabel: ()=><MenuItem icon='gear' title='ورش عمل'/>
            }}/>
          <Drawer.Screen
            name="Settings"
            component={Settings}
            options={{
              title:'اعدادات',
              drawerLabel: ()=><MenuItem icon='settings' title='اعدادات'/>
            }}/>
          <Drawer.Screen
            name="SellerProfile"
            component={SellerProfile}
            options={{
              title:'متجر',
              drawerItemStyle: {
                display: "none",
            }}}/>
        </>
        :
        <>
          <Drawer.Screen
            name="Profile"
            component={Profile}
            initialParams={userInfo}
            options={{
              title: 'الصفحه الشخصيه',
              drawerLabel: ()=><ProfileElement img={require('./src/assets/gallary/p1.png')}/>
            }}/>
          <Drawer.Screen
            name="Zaatar"
            component={Zaatar}
            initialParams={userInfo}
            options={{
              title:'زعتر',
              drawerLabel: ()=><MenuItem icon='zaatar' title='الصفحة الرئيسية'/>
            }}/>
            <Drawer.Screen
            name="Stores"
            component={Stores}
            initialParams={userInfo}
            options={{
              title:'صفحات تجارية',
              drawerLabel: ()=><MenuItem icon='store' title='صفحات تجارية'/>
            }}/>
            <Drawer.Screen
            name="WorkShops"
            component={WorkShops}
            initialParams={userInfo}
            options={{
              title:'ورش عمل',
              drawerLabel: ()=><MenuItem icon='gear' title='ورش عمل'/>
            }}/>
          <Drawer.Screen
            name="Settings"
            component={Settings}
            initialParams={userInfo}
            options={{
              title:'اعدادات',
              drawerLabel: ()=><MenuItem icon='settings' title='اعدادات'/>
            }}/>
          <Drawer.Screen
            name="SellerProfile"
            component={SellerProfile}
            options={{
              title:'متجر',
              drawerItemStyle: {
                display: "none",
            }}}/>
        </>
        }
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default App;
