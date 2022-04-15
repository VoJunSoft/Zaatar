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
  Alert
} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {createDrawerNavigator} from '@react-navigation/drawer'
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5'
import Zaatar from './src/screens/Zaatar'
import Profile from './src/screens/Profile'
import SellerProfile from './src/screens/SellerProfile'
import Settings from './src/screens/Settings'
import Registration from './src/screens/Registration'
import Entry from './src/screens/Entry'
import Elements from './src/screens/Elements'
import AppStyles from './src/styles/AppStyle'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Avatar } from 'react-native-elements'
//import NavigationBar from 'react-native-navbar-color'

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
  useEffect( ()=>{
    getData() 
    // const nav = [
    //       NavigationBar.setStatusBarColor("#2C4770",true), 
    //       NavigationBar.setStatusBarTheme('light',true), 
    //       NavigationBar.setColor("#2C4770")
    // ]
  }, [])

  const getData =  () => {
    try {
           AsyncStorage.getItem('userInfoZaatar')
           .then((value) => {
                if(value !== null){
                    setUserInfo(JSON.parse(value))
                    setIsUser(true)
                }
           })
    } catch(e) {
      // error reading value
    }
  }

  const ProfileElement = (props) =>{
    return(
      <View style={{alignSelf:'center', borderBottomWidth:2, marginLeft:20, borderColor:'#2C4770',  alignItems:'center'}}>
        <Text style={AppStyles.textTitle}>{userInfo.name ? userInfo.name : null}</Text>
        <Avatar
            size={120}
            rounded
            source={userInfo.picture ? {uri: userInfo.picture} : props.img }
            icon={{ name: 'user', type: 'font-awesome' }}
            containerStyle={{ backgroundColor: '#2C4770', margin: 5}}
        />
        <Text style={AppStyles.textTitle}>{userInfo.id ? 'الصفحه الشخصيه' : 'تسجيل الدخول'}</Text>
      </View>
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
          screenOptions={{
            headerShown: true,
            drawerType:"front",
            drawerPosition:"left",
            overlayColor:'#00000055',
            headerTitleAlign:'center',
            headerRight:(()=> <HeaderRightIcon/>),
            headerStyle:{
              backgroundColor: '#2C4770'
            },
            headerTintColor:'white',
            headerTitleStyle:{
              fontSize:22,
              fontFamily:'Cairo-Bold',
              letterSpacing: 5,
              color:'white'
            },
            drawerActiveBackgroundColor:'rgba(0,0,0,0.1)',
            drawerStyle:{
              backgroundColor:'white',
              width:230,
              borderTopRightRadius:16,
              borderBottomRightRadius:16,
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
                title: 'الصفحه الشخصيه',
                headerShown: false,
                drawerLabel: ()=><ProfileElement img={require('./src/assets/gallary/Zaatar.png')}/>
              }}
          />
          <Drawer.Screen
              name="Registration"
              component={Registration}
              options={{
                headerShown: false,
                drawerItemStyle: {
                  display: "none",
                }}}
          />
          <Drawer.Screen
              name="Zaatar"
              component={Zaatar}
              options={{
                title:'زعتر',
                drawerIcon:({focused})=>(
                  <FontAwesomeIcons 
                      name='home'
                      color={focused ? '#2C4770' : '#2C4770'}
                      size={20}
                  />
                )}}
          />
          <Drawer.Screen
            name="SellerProfile"
            component={SellerProfile}
            options={{
              title:'متجر',
              drawerItemStyle: {
                display: "none",
              }}}
          />
           <Drawer.Screen
            name="Elements"
            component={Elements}
            options={{
              title:'محلات تجارية',
              drawerIcon:({focused})=>(
                <FontAwesomeIcons 
                    name='anchor'
                    color={focused ? '#2C4770' : '#2C4770'}
                    size={20}
                />
              )}}
          />
          <Drawer.Screen
            name="Settings"
            component={Settings}
            options={{
              title:'اعدادات',
              drawerIcon:({focused})=>(
                <FontAwesomeIcons 
                    name='tools'
                    color={focused ? '#2C4770' : '#2C4770'}
                    size={20}
                />
              )}}
          />
        </>
        :
        <>
          <Drawer.Screen
            name="Profile"
            component={Profile}
            initialParams={userInfo}
            options={{
              title: 'الصفحه الشخصيه',
              drawerLabel: ()=><ProfileElement img={require('./src/assets/gallary/profile.png')}/>
            }}
          />
          <Drawer.Screen
            name="Zaatar"
            component={Zaatar}
            options={{
              title:'زعتر',
              //title:'الصفحة الرئيسية',
              drawerIcon:({focused})=>(
                <FontAwesomeIcons 
                    name='home'
                    color={focused ? '#2C4770' : '#2C4770'}
                    size={20}
                />
              )}}
          />
          <Drawer.Screen
            name="Elements"
            component={Elements}
            options={{
              title:'محلات تجارية',
              drawerIcon:({focused})=>(
                <FontAwesomeIcons 
                    name='anchor'
                    color={focused ? '#2C4770' : '#2C4770'}
                    size={20}
                />
              )}}
          />
          <Drawer.Screen
            name="Settings"
            component={Settings}
            initialParams={{user: isUser}}
            options={{
              title:'اعدادات',
              drawerIcon:({focused})=>(
                <FontAwesomeIcons 
                    name='tools'
                    color={focused ? '#2C4770' : '#2C4770'}
                    size={20}
                />
              )}}
          />
          <Drawer.Screen
            name="SellerProfile"
            component={SellerProfile}
            options={{
              title:'متجر',
              drawerItemStyle: {
                display: "none",
              }}}
          />
        </>
        }
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default App;
