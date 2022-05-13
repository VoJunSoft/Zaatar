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
import DropShadow from "react-native-drop-shadow";

const PremiumProductCardView = (props) => {

return (
    <SafeAreaView style={styles.block}>
        <DropShadow style={{
                        shadowColor: '#2C477055',
                        shadowOffset: {width: -2, height: 2},
                        shadowOpacity: 0.9,
                        shadowRadius: 9,
                         }}>
        
        <View style={[styles.cardBlock,{backgroundColor: '#fff'}]}>
            <Text style={styles.title}>{props.productInfo.product_name}</Text> 
            <Text style={[styles.body]}>{props.currencySymbol?props.currencySymbol:'💰'}{props.productInfo.price}</Text>
            {/* <View style={{
                        width:'70%',
                        flexDirection:'row',
                        justifyContent:'space-between',
                        alignItems:'center'
                    }}>
                <Text style={[styles.body]}>₪{props.productInfo.price}</Text>
                <Text style={[styles.body, {textDecorationLine:'line-through', opacity: 0.5}]}>{Math.round(props.productInfo.price*1.2)}</Text> 
                <Icon 
                    iconName='discount20'
                    size={30}
                />  
            </View> */}
            <Image style={styles.img} source={{uri: props.productInfo.photos[0]}} />
        </View> 
        </DropShadow>   
    </SafeAreaView>
)
}

const styles = StyleSheet.create({

    block:{
      width:Dimensions.get('window').width/3,
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
      height:22,
      fontFamily:'Cairo-Bold',
      fontSize: 12,
      color:'#171717',
      textAlign:'center',
      letterSpacing:0,
      overflow:'visible'
    },
    body: {
        fontFamily:'GLA',
        fontSize: 13,
        color:'#2C4770',
        marginTop:2
    },
    img: {
      height:125,
      width:'100%',
      resizeMode:'cover',
      alignItems:'center',
      alignSelf:'center',
      borderRadius:200,
      marginTop:0
    }
    });

export default PremiumProductCardView;