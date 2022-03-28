import React from 'react'
import {
    ScrollView, 
    Text,
    StyleSheet,
    Image
 } from 'react-native'
 import Icon from '../elements/Icon'

const Settings = () => {
    return (
    <ScrollView style={styles.container}>
        <Image style={styles.img} source={require('../assets/gallary/Zaatar3.png')} />
        <Text style={styles.title}> تم إنشاء هذا التطبيق من أجل ربط البائعين من أماكن مختلفة في جميع أنحاء البلاد. </Text>
        <Text style={styles.title}> تتيح لك هذه المنصة سرد المنتجات التي ترغب في بيعها أو التواصل مع البائعين الذين لديهم منتجات تهمك.</Text>
        <Text style={styles.title}>يمكن أن تكون المنتجات: يدوية الصنع أو مستعملة أو فنية أو أثرية أو مقتنيات أو حتى ورشة عمل أو نوع معين من الخدمات.</Text>
    </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#2C4770',
    },
    title:{
        fontFamily:'Cairo-Bold',
        fontSize:18,
        textAlign:'center',
        color:'#fff',
        marginBottom: 20
    },
    img:{
        width:200, 
        height:200, 
        resizeMode:'contain',
        alignSelf:'center',
        margin: 10
    }
})
export default Settings;