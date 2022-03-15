import React from 'react'
import { 
    View, 
    Text,
    StyleSheet
 } from 'react-native'
import AppStyles from '../styles/AppStyle'
import Button from '../elements/Button'

const Zaatar = () => {
    return (
    <View style={styles.container}>
        <Text style={AppStyles.header}> ZAAAAAATAR </Text>
     </View>
    )
}

const styles = StyleSheet.create({
    container:{
        alignSelf:'center'
    }
})
export default Zaatar;