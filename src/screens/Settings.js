import React from 'react'
import {
    View, 
    Text,
    StyleSheet,
    Image
 } from 'react-native'
 import Icon from '../elements/Icon'

const Settings = () => {
    return (
    <View style={styles.container}>
        <Icon iconName='settings' size={100} />
        <Text style={styles.title}> Settings </Text>
    </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#2C4770',
    },
    title:{
        marginTop:-20,
        fontSize:18,
        textAlign:'center',
        color:'#fff',
    }
})
export default Settings;