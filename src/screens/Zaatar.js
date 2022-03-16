import React from 'react'
import { 
    View, 
    Text,
    StyleSheet,
    Image
 } from 'react-native'

const Zaatar = () => {
    return (
    <View style={styles.container}>
        <Image style={{width:300, height:400, resizeMode:'contain'}} source={require('../assets/gallary/Zaatar1.png')} />
        <Text style={styles.title}> Zaatar </Text>
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
        marginTop:-50,
        fontSize:30,
        textAlign:'center',
        color:'#fff',
        fontFamily:'Blazed'
    }
})
export default Zaatar;