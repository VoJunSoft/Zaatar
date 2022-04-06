import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

export default function Events(props) {

    return (
        <View style={styles.fetchWindowBox}>
                <Image style={styles.robot} source={require('../assets/gallary/events.png')} />
        </View>
    )
}

const styles= StyleSheet.create({
    fetchWindowBox:{
        marginTop:100,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    },
    robot:{
        height:300,
        width:300,
    }
})
