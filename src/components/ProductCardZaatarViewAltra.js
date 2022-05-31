
import React, { Component } from 'react'
import { 
    Text, 
    View,
    SafeAreaView,
    StyleSheet,
    Image,
    Dimensions 
} from 'react-native'
import Icon from '../elements/Icon'
import DropShadow from "react-native-drop-shadow"
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import Buttons from '../elements/Button'

export default function ProductCardZaatarViewAltra(props) {

return (
    <SafeAreaView style={styles.block}>
         <LinearGradient 
            colors={['#4b6cb7', '#2C4770','#182848']}
            style={styles.infoBlock}>
                <Text style={styles.title}>{props.productInfo.product_name}</Text> 
        </LinearGradient>

        <FastImage  style={styles.img} 
            source={{uri: props.productInfo.photos[0]}} 
            defaultSource={require('../assets/gallary/Zaatar.png')}
            resizeMode={FastImage.resizeMode.cover}/>
            
        <LinearGradient 
            colors={['#4b6cb7', '#2C4770','#182848']} 
            style={styles.infoBlock}>
                    <Text style={styles.body}>{props.currencySymbol}{props.productInfo.price}</Text> 
                    <Buttons.ButtonDefault 
                            titleLeft={props.productInfo.seller.location.city ? props.productInfo.seller.location.city : 'ام الفحم'}
                            iconName="location"
                            iconSize={25}
                            containerStyle={{justifyContent:'flex-end', width:'65%'}}
                            textStyle={{fontFamily: 'Cairo-Regular',color:'#fff',fontSize:12, marginRight: 3}}
                            disabled/>
        </LinearGradient>
    </SafeAreaView>
)
}

const styles = StyleSheet.create({
    block:{
      flex:1,
      width:'94%',
      alignSelf:'center',
      backgroundColor:'#4b6cb7',
      borderRadius:15,
      overflow:'hidden',
      borderColor:'#2C4770',
      marginTop:9
    },
    infoBlock: {
      flex:1,
      width:'100%',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      paddingTop:5,
      paddingBottom:5
    },
    title: {
      flex:1,
      width:'100%',
      fontFamily:'Cairo-Regular',
      fontSize: 13,
      color:'#fff',
      textAlign:'center',
      flexWrap:'nowrap',
      marginBottom:2
    },
    body: {
        flex:1,
        width:'100%',
        fontFamily:'GLA',
        fontSize: 13,
        color:'#fff',
        textAlign:'center',
        flexWrap:'nowrap',
        alignItems:'center',
        letterSpacing:.5
      },
    HeaderText: {
        fontFamily:'Cairo-Regular',
        fontSize: 15,
        color:'#171717',
        marginTop:2
    },
    img: {
      height:130,
      width:'100%',
      //borderRadius:200,
      //margin:5
    }
})
