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
import DropShadow from "react-native-drop-shadow";

const TopProductCardView = (props) => {

return (
        <ImageBackground style={styles.container} source={{uri: props.productInfo.photos[0]}}>
        <DropShadow style={styles.dropShadow}>
          <View style={styles.infoBlock}>
              <Text style={styles.title}>₪{props.productInfo.price}</Text>
              <Text style={styles.title}>{props.productInfo.product_name}</Text> 
          </View> 
        </DropShadow>
        </ImageBackground>   
)
}

const styles = StyleSheet.create({

    container:{
      width:Dimensions.get('window').width/2.2,
      height:220,
      margin: 0,
      flexDirection:'column',
      justifyContent:'flex-end',
      resizeMode:'cover',
      overflow:'hidden',
      backgroundColor: '#E5EEFF'
    },
    infoBlock: {
      width:'100%',
      height:50,
      backgroundColor: '#2C4770',
      flexDirection:'column',
      justifyContent:'space-around',
      alignItems:'center',
      alignSelf:'center',
      borderBottomRightRadius:5,
      borderBottomLeftRadius: 5,
      borderTopLeftRadius:50,
      padding:5,
    },
    title: {
      fontFamily:'Cairo-Regular',
      fontSize: 12,
      color:'white',
    },
    dropShadow:{
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowOffset: {width: 2, height: -2},
      shadowOpacity: 0.5,
      shadowRadius: 2,
  }
    });

export default TopProductCardView;