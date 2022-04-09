import React, {useEffect, useState} from 'react'
import Profile from './Profile'

export default function SellerProfile(props) {
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
             console.log('global seller is-------->', global.sellerState)
         })
       return() => unsubscribe
     }, [props.navigation])
    
  
    return <Profile seller={true} param={global.sellerState}/>
    
}
