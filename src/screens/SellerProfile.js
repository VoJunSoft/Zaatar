import React, {useEffect, useState} from 'react'
import { View, Text } from 'react-native'
import Profile from './Profile'
import firestore from '@react-native-firebase/firestore';

export default function SellerProfile(props) {
    //TODO update params
    //TODO get seller id = route.params.id, get seller data from users database, pass them to Profile
    // Or better option is to get the seller id @ fullproductcard to get seller data from users database and pass them in navigation
    // useEffect( () => {
    //     console.log('params-------->', sellerInfo.id)
    //     // const subscriber = firestore()
    //     //             .collection('users')
    //     //             .doc(route.params.id)
    //     //             .get()
    //     //             .then(documentSnapshot => {
    //     //                 setSellerInfo(documentSnapshot.data())
    //     //             })
    //     //             .catch((e) => {
    //     //                 //return empty state or naviagte to error screen
    //     //             })
    //     //             return () => subscriber()
    // },[sellerInfo.id])
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
