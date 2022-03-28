import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

export default function Workshops(props) {

    return (
        <>
        <View style={styles.fetchWindowBox}>
            {
                props.robots.map((item, index) =>{
                    const url = 'https://robohash.org/test' + item.id + '?100x100'
                    return ( 
                            <Image style={styles.robot} source={{uri: url}} key={index}/>
                    )
                })
            }
        </View>
        </>
    )
}

const styles= StyleSheet.create({
    fetchWindowBox:{
        flexDirection:'row',
        justifyContent:'space-between',
        flexWrap:'wrap',
        margin:3
    },
    robot:{
        height:150,
        width:100,
        backgroundColor:'rgba(0,0,0,0.5)',
        margin: 5,
        borderRadius:7
    },
    title:{
        fontSize:25,
        textAlign:'center',
        color:'#2C4770',
        margin: 7,
        fontFamily:'Blazed'
    }
})
