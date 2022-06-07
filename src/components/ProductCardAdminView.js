import React from 'react'
import { 
    Text, 
    View,
    SafeAreaView,
    StyleSheet,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import {Flags} from "../scripts/Flags.json"

const ProductCardAdminView = (props) => {
  return (
        <SafeAreaView style={styles.container} >
          <View style={styles.infoBlock}>
              <Text style={styles.title}>{props.productInfo.seller.name}</Text> 
              <Text style={styles.title}>{props.productInfo.product_name}</Text> 
              <Text style={styles.title}>{`${props.productInfo.seller.location.city} ${Flags[props.productInfo.seller.location.country]}`}</Text> 
          </View> 
          <FastImage  style={styles.img} 
                      source={{uri: props.productInfo.photos[0]}} 
                      defaultSource={require('../assets/gallary/Zaatar.png')}
                      resizeMode={FastImage.resizeMode.cover}/>
        </SafeAreaView>
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
      width:'50%',
      flexDirection:'column',
      paddingRight:5,
    },
    title: {
      width:'100%',
      fontFamily:'Cairo-Regular',
      fontSize: 13,
      color:'#fff',
      flexWrap:'nowrap',
      padding:5,
      textAlign:'right'
    },
    img:{
      width:185,
      height:120,
      borderTopRightRadius:5,
      margin:3,
  }
})

export default ProductCardAdminView;