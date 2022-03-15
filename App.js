/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react'
import {
  View,
  Text,
  I18nManager
} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {createDrawerNavigator} from '@react-navigation/drawer'
import NavigationBar from 'react-native-navbar-color'
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5'
import Zaatar from './src/screens/Zaatar'
import Profile from './src/screens/Profile'
import Settings from './src/screens/Settings'
import Elements from './src/screens/Elements'
I18nManager.forceRTL(false)
I18nManager.allowRTL(false)
import AppStyles from './src/styles/AppStyle'
import Buttons from './src/elements/Button'
import { DrawerLayout } from 'react-native-gesture-handler';

const Drawer = createDrawerNavigator()
const App = () => {
 
  useEffect(()=>{
    const nav = [
          NavigationBar.setStatusBarColor("#2C4770",true), 
          NavigationBar.setStatusBarTheme('light',true), 
          NavigationBar.setColor("#2C4770")
    ]
    return () => {nav}
  }, [])

  const ProfileElement = () =>{
    return(
      <Buttons.ButtonDefault 
          titleRight="User"
          iconName="fire"
          iconSize={70}
          horizontal={true}
          containerStyle={{borderBottomWidth:0}}
          textStyle={[
              AppStyles.ButtonTextAlpha, {fontFamily: 'docktrin'}
          ]}
          iconContainer={{backgroundColor:'rgba(0,0,0,0.4)', borderRadius:50, padding: 10}}
          disabled
      />
    )
  }
  return (
    <NavigationContainer>
      <Drawer.Navigator 
          initialRouteName="Zaatar"
          screenOptions={{
            headerShown: true,
            drawerType:"front",
            drawerPosition:"left",
            overlayColor:'#00000055',
            headerTitleAlign:'center',
            headerStyle:{
              backgroundColor: '#2C4770'
            },
            headerTintColor:'white',
            headerTitleStyle:{
              fontSize:27,
              fontFamily:'mrsmonster',
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
              fontFamily:'Marlboro',
              color: '#2C4770',
              fontSize:20            
            }
          }}>
        <Drawer.Screen
          name="Profile"
          component={Profile}
          options={{
            title: 'profile',
            drawerLabel: ()=><ProfileElement />
          }}
        />
        <Drawer.Screen
          name="Zaatar"
          component={Zaatar}
          options={{
            title:'Zaatar',
            drawerIcon:({focused})=>(
              <FontAwesomeIcons 
                  name='play'
                  color={focused ? '#2C4770' : '#2C4770'}
                  size={20}
              />
            )
          }}
        />
        <Drawer.Screen
          name="Elements"
          component={Elements}
          options={{
            title:'Elements',
            drawerIcon:({focused})=>(
              <FontAwesomeIcons 
                  name='anchor'
                  color={focused ? '#2C4770' : '#2C4770'}
                  size={20}
              />
            )
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={Settings}
          options={{
            title:'Settings',
            drawerIcon:({focused})=>(
              <FontAwesomeIcons 
                  name='tools'
                  color={focused ? '#2C4770' : '#2C4770'}
                  size={20}
              />
            )
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default App;
