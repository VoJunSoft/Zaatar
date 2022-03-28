import React from 'react'
import { View, Text } from 'react-native'
import Profile from './Profile'

export default function SellerProfile({ route, navigation }) {
    //TODO update params
    //TODO get seller id = route.params.id, get seller data from users database, pass them to Profile

    return (
       <Profile seller={true} params={route.params}/>
    )
}
