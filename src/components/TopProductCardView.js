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
import Buttons from '../elements/Button'

const TopProductCardView = (props) => {

return (
        <ImageBackground style={styles.container} source={{uri: props.productInfo.photos[0]}}>
           <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}} >
              <Buttons.ButtonWithShadow 
                      // titleRight={props.productInfo.seller.location.city}
                      // iconName="location"
                      // iconSize={10}
                      // horizontal
                      containerStyle={{
                          width:10,
                          height:70,
                          backgroundColor:'#2C4770',
                          borderBottomRightRadius:50, 
                          padding:5
                      }}
                      textStyle={{
                          fontFamily: 'Cairo-Regular',
                          color:'#171717',
                          fontSize:8,
                      }}
                      activeOpacity={1}
                      disable/>
              <Buttons.ButtonWithShadow 
                    titleRight={`${props.currencySymbol?props.currencySymbol:'💰'}${props.productInfo.price}`}
                    containerStyle={{
                        //width:60,
                        height:40,
                        justifyContent:'center',
                        backgroundColor:'#fff',
                        borderBottomLeftRadius:25,
                        padding:7
                    }}
                    textStyle={{
                        fontFamily: 'Cairo-Bold',
                        color:'#171717',
                        fontSize:12,
                    }}
                    activeOpacity={1}
                    disable/>
          </View>

          <DropShadow style={styles.dropShadow}>
            <View style={styles.infoBlock}>
                <Text style={styles.title}>{props.productInfo.product_name}</Text> 
            </View> 
          </DropShadow>
        </ImageBackground>   
)
}

const styles = StyleSheet.create({

    container:{
      width:Dimensions.get('window').width/2.2,
      height:200,
      margin: 0,
      flexDirection:'column',
      justifyContent:'space-between',
      resizeMode:'cover',
      overflow:'hidden',
      backgroundColor: '#E5EEFF'
    },
    infoBlock: {
      width:'96%',
      height:50,
      //flexDirection:'row',
      //alignItems:'center',
      //justifyContent:'flex-end',
      alignSelf:'flex-end',
      backgroundColor: '#2C4770',
      borderTopLeftRadius:70,
      padding: 10
    },
    title: {
      fontFamily:'Cairo-Regular',
      fontSize: 13,
      color:'#fff',
      flexWrap:'nowrap'
    },
    dropShadow:{
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowOffset: {width: 2, height: -2},
      shadowOpacity: 0.5,
      shadowRadius: 2,
  }
    });

export default TopProductCardView;