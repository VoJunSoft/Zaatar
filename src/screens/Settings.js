import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import AppStyles from '../styles/AppStyle'

const Settings = () => {
    return (
        <View style={styles.container}>
           <Text style={AppStyles.header}> Settings </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        alignSelf:'center',
    }
})

export default Settings