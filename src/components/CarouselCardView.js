import React from 'react'
import { View, Text, StyleSheet, Dimensions} from 'react-native'
import FastImage from 'react-native-fast-image'
import DropShadow from "react-native-drop-shadow"

export default function CarouselCardView(props) {
    return (
        <DropShadow style={{
            shadowColor: '#323232',
            shadowOffset: {width: 0, height: 3},
            shadowOpacity: 1,
            shadowRadius: 1,
            marginTop:15,
            margin:9,
            borderRadius:5
             }}>
                <FastImage  style={styles.img} 
                        source={{uri: props.productInfo.photos[0]}} 
                        defaultSource={require('../assets/gallary/Zaatar.png')}
                        resizeMode={FastImage.resizeMode.cover}/>
                <View style={styles.infoBlock}>
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
        fontFamily:'Cairo-Regular',
        fontSize:15,
        padding: 2,
        textAlign:'center'
    },
    infoBlock:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginTop:-40,
        height:40,
        backgroundColor:'#00000060',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        borderTopLeftRadius:30,
        overflow:'hidden',
    }
})