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

const PremiumProductCardView = (props) => {

return (
    <SafeAreaView style={styles.block}>
        <DropShadow style={{
                        shadowColor: '#2C4770',
                        shadowOffset: {width: -1, height: 2},
                        shadowOpacity: 0.7,
                        shadowRadius: 5,
                         }}>
        <View style={[styles.cardBlock,{backgroundColor: '#fff'}]}>
            <Text style={styles.title}>{props.productInfo.product_name}</Text> 
            <Text style={[styles.body]}>{props.currencySymbol}{props.productInfo.price}</Text>
            <FastImage  style={styles.img} 
                        source={{uri: props.productInfo.photos[0]}} 
                        defaultSource={require('../assets/gallary/Zaatar.png')}
                        resizeMode={FastImage.resizeMode.cover}
                        />
        </View> 
        </DropShadow>   
    </SafeAreaView>
)
}

const styles = StyleSheet.create({

    block:{
      width:Dimensions.get('window').width/2.8,
      margin:3,
      marginBottom:10,
      alignSelf:'center',
    },
    cardBlock: {
      width:'100%',
      flexDirection:'column',
      alignItems:'center',
      marginTop:5,
      borderBottomRightRadius:90,
      borderBottomLeftRadius: 90,
      borderTopRightRadius:4,
      borderTopLeftRadius: 4,
      padding:5
    },
    title: {
      fontFamily:'Cairo-Bold',
      fontSize: 12,
      color:'#171717',
      textAlign:'center',
      overflow:'visible',
      marginTop:5
    },
    body: {
        fontFamily:'GLA',
        fontSize: 13,
        color:'#2C4770',
        marginTop:2,
        letterSpacing:.5
    },
    img: {
      height:125,
      width:'100%',
      alignItems:'center',
      alignSelf:'center',
      borderRadius:200,
      marginTop:5
    }
    });

export default PremiumProductCardView;