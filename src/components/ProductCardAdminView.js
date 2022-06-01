import React, { Component } from 'react'
import { 
    Text, 
    View,
    SafeAreaView,
    StyleSheet,
    Image,
    Dimensions,
    ImageBackground 
} from 'react-native'
import FastImage from 'react-native-fast-image'

const ProductCardAdminView = (props) => {

return (
      <View style={styles.container} >
         <View style={styles.infoBlock}>
            <Text style={styles.title}>{props.productInfo.seller.name}</Text> 
            <Text style={styles.title}>{props.productInfo.product_name}</Text> 
        </View> 
         <FastImage  style={styles.img} 
                    source={{uri: props.productInfo.photos[0]}} 
                    defaultSource={require('../assets/gallary/Zaatar.png')}
                    resizeMode={FastImage.resizeMode.cover}/>
      </View>
)
}

const styles = StyleSheet.create({
    container:{
      width:'100%', 
      flexDirection:'row', 
      justifyContent:'space-between', 
      backgroundColor: '#2c4770',
      alignItems:'center'
    },
    infoBlock: {
      width:'70%',
      flexDirection:'column',
    },
    title: {
      width:'100%',
      fontFamily:'Cairo-Regular',
      fontSize: 13,
      color:'#fff',
      flexWrap:'nowrap',
      padding:5,
      textAlign:'center'
    },
    img:{
      width:'28%',
      height:70,
      margin:3
  }
    });

export default ProductCardAdminView;