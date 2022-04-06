import React, {useEffect, useState} from 'react'
import { View, Text } from 'react-native'
import Profile from './Profile'
import firestore from '@react-native-firebase/firestore';

export default function SellerProfile(props) {
    //TODO update params
    const [sellerInfo, setSellerInfo] = useState(props.route.params)
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
             // The screen is focused
             setSellerInfo(props.route.params)
             console.log('params-------->', sellerInfo.id)
         })
       // Return the function to unsubscribe from the event so it gets removed on    unmount
       return unsubscribe
     }, [props.navigation])
    
  
    return (
       <Profile seller={true} params={sellerInfo}/>
    )
}
