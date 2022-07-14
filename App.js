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
import Admin from './src/screens/Admin'
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
import auth from '@react-native-firebase/auth'
//import {GetRecordsFromDBasc} from './src/firebase/Firestore'
//import UserData from './src/scripts/UserData'
//import firestore from '@react-native-firebase/firestore'
//import * as RNLocalize from "react-native-localize"
//import NavigationBar from 'react-native-navbar-color'
//import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5'
I18nManager.forceRTL(false)
I18nManager.allowRTL(false)
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

const App = ({useNavigation}) => {
  const Drawer = createDrawerNavigator()
  // user information state
  const [userInfo, setUserInfo] = useState({
                                            id:'', 
                                            name: null, 
                                            picture: null, 
                                            email: null, 
                                            phone: null, 
                                            rule : null, 
                                            location:{country:'Global',code:null,flag:null,currency:null,city: null}
                                          })
  const [isUser, setIsUser] = useState(false)

  //const user = new UserData(userInfo)
  //console.log('OOOOP--->', user.getUserInfo())
  useEffect( ()=>{
      auth().onAuthStateChanged((user) => {
            if(user)
                getData()
      })
    // const nav = [
    //       NavigationBar.setStatusBarColor("#2C4770",true),
    //       NavigationBar.setStatusBarTheme('dark',true), 
    //       NavigationBar.setColor("#FFFFFF")
    // ]
    // return () => {[
    //   nav
    // ]}
  }, [])

  const getData = async () => {
    try {
          const value = await AsyncStorage.getItem('userInfoZaatar')
          if(value !== null){
              await setUserInfo(JSON.parse(value))
              await setIsUser(true)
              console.log('APpJS async UserInfo: ' , JSON.parse(value))
          }
          return () => value    
    } catch(e) {
      // error reading value
      console.log(e)
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
      <TouchableOpacity onPress={()=>{}} disabled>
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
            overlayColor:'#00000040',
            headerTitleAlign:'center',
            headerRight:(()=> <HeaderRightIcon/>),
            headerStyle:{
              backgroundColor: '#2C4770'
            },
            headerTintColor:'#fff',
            headerTitleStyle:{
              fontSize:20,
              fontFamily:'Cairo-Bold',
              letterSpacing: 5,
              color:'white',
            },
            drawerActiveBackgroundColor:'rgba(0,0,0,0.2)',
            drawerStyle:{
              backgroundColor:'#E5EEFF',
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
                title:'بث حي',
                drawerLabel: ()=><MenuItem icon='video' title='بث حي'/>
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
              options={{
                title:'بث حي',
                drawerLabel: ()=><MenuItem icon='video' title='بث حي'/>
          }}/>
          <Drawer.Screen
            name="Settings"
            component={Settings}
            initialParams={userInfo}
            options={{
              title:'اعدادات',
              drawerLabel: ()=><MenuItem icon='settings' title='اعدادات'/>
          }}/>
          {
            //TODO: set rules/admins
            userInfo.rule === 'admin' ?
              <Drawer.Screen
                name="Admin"
                component={Admin}
                options={{
                  title:'منطقة الإدارة',
                  drawerLabel: ()=><MenuItem icon='admin' title='منطقة الإدارة'/>
              }}/>
              : 
              null
          }
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
