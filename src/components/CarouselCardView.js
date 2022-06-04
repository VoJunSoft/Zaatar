import React from 'react'
import { View, Text, StyleSheet, Dimensions} from 'react-native'
import FastImage from 'react-native-fast-image'
import DropShadow from "react-native-drop-shadow"
import Buttons from '../elements/Button'

export default function CarouselCardView(props) {
    return (
        <DropShadow style={{
            shadowColor: '#323232',
            shadowOffset: {width: -2, height: 3},
            shadowOpacity: 1,
            shadowRadius: 1,
            marginTop:15,
            margin:9,
             }}>
                <FastImage  style={styles.img} 
                        source={{uri: props.productInfo.photos[0]}} 
                        defaultSource={require('../assets/gallary/Zaatar.png')}
                        resizeMode={FastImage.resizeMode.cover}/>
                <View style={styles.infoBlock}>
                    <Buttons.ButtonDefault 
                            titleLeft={props.productInfo.seller.location.city ? props.productInfo.seller.location.city : 'ام الفحم'}
                            iconName="locationAlpha"
                            iconSize={27}
                            containerStyle={{justifyContent:'flex-end', width:'30%', height:'100%', borderRightWidth:0.5, borderColor:"#32323290"}}
                            textStyle={{fontFamily: 'Cairo-Regular',color:'#fff',fontSize:12}}
                            disabled/>
                    <Text style={styles.title}>{props.productInfo.product_name}</Text>
                </View>
        </DropShadow>
    )
}

const styles = StyleSheet.create({
    img: {
        height: 220,
        width : Dimensions.get('window').width - 70 ,
        borderRadius:10,
    },
    title:{
        color:'#fff',
        fontFamily:'Almarai-Bold',
        fontSize:13,
        padding: 2,
        textAlign:'right',
        width:'65%'
    },
    infoBlock:{
        width : Dimensions.get('window').width - 70 ,
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center',
        marginTop:-40,
        height:40,
        backgroundColor:'#00000060',
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30,
        borderTopLeftRadius:100,
        overflow:'hidden',
    }
})