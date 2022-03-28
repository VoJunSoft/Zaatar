import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import Icon from '../elements/Icon'

export default function Events() {
    //TODO: move assets/icons into JSON A. call it from Icon.js B. use it for MiIcons List
    const MiIcons = ['home', 'edit', 'settings', 'add', 'delete', 'photo', 'upload', 'card', 'cart', 
                     'bell', 'camera', 'menu', 'typing', 'video', 'load', 'search', 'profile', 'contacts',
                    'location', 'mic', 'exit', 'envelope', 'share', 'speakers']
    return (
        <>
        <View style={styles.IconsWindowBox}>
            {
                MiIcons.map((item, index) =>{
                    return ( 
                            <Icon container={styles.icon} iconName={item} size={70} key={index}/>
                    )
                })
            }
        </View>
        </>
    )
}

const styles= StyleSheet.create({
    IconsWindowBox:{
        flexDirection:'row',
        justifyContent:'space-between',
        flexWrap:'wrap',
        margin:3
    },
    icon:{
        height:80,
        width:80,
        backgroundColor:'rgba(0,0,0,0.5)',
        margin: 5,
        borderRadius:7,
    },
    title:{
        fontSize:25,
        textAlign:'center',
        color:'#2C4770',
        margin: 7,
        fontFamily:'Blazed'
    }
})
