import React, { useState, useEffect } from 'react'
import { 
    Text, 
    View,
    StyleSheet,
    Image,
    Dimensions, 
    ScrollView,
    TouchableOpacity,
    Alert,
    Pressable,
    Linking
} from 'react-native'
import Icon from '../elements/Icon'
import Buttons from '../elements/Button'
import { Avatar } from 'react-native-elements';
import {useNavigation} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Animatable from 'react-native-animatable';
import {handleDate, handleTimeDifference} from '../scripts/Time'
import {shareToWhatsApp} from '../scripts/Communication'

const FullProductCard = (props) => {
    const navigation = useNavigation()
    //props.productInfo  & props.setFullProductVisibility from productCard.js
    ////productInfo fields {seller:{userInfo}, product_name, photos[], descriptiom, category, price, date_listed}

    // TODO get productInfo.seller from database based on productInfo.seller.id
    const [productInfo, setProductInfo] = useState(props.productInfo)
    //large image display index
    const [imgIndex, setImageIndex] = useState(0)

    const [errMsg, setErrMsg] = useState()

    useEffect( ()=>{
      getData() 
    }, [])
  
    //get owner (logged in user) to compare with other sellers ids
    const [ownerId, setOwnerId] = useState('')
    const getData =  () => {
      try {
             AsyncStorage.getItem('userInfoZaatar')
             .then((value) => {
                  if(value !== null){
                    setOwnerId(JSON.parse(value).id)
                  } 
             })
      } catch(e) {
        // error reading value
      }
    }

    //TODO retrieve data from firebase based on id and pass it instead of productInfo.seller (which is stored with product info)
    const GoToSellerProfile = () => {
     // if user is owner then go to his/her page
      if(productInfo.seller.id === ownerId){
           navigation.navigate('Profile')
      }else{
          // global.sellerState was updated @ ProductCard.js when FullProductCard was opened
          //global.sellerState = productInfo.seller
          navigation.navigate('SellerProfile')
      }

      props.setFullProductVisibility(false)
    }

    return (
    <>
    <TouchableOpacity 
        style={styles.ProfileHeader} 
        activeOpacity={0.7} 
        onPress={GoToSellerProfile}>
         <Buttons.ButtonDefault
                titleRight={productInfo.seller.location.city} 
                iconName="location"
                iconSize={29}
                horizontal={true}
                textStyle={{fontFamily: 'Cairo-Regular' ,fontSize: 10, color: '#2C4770'}}
                activeOpacity={0.9}
                disabled/> 
        <Text style={styles.headerText}>{productInfo.seller.name}</Text> 
        <Avatar
              size={60}
              rounded
              source={productInfo.seller.picture ? {uri: productInfo.seller.picture} : require('../assets/gallary/p1.png') }
              icon={{ name: 'user', type: 'font-awesome', color: '#2C4770'}}
              containerStyle={{ backgroundColor: '#fff', marginLeft:10, borderWidth:1}}
          />
    </TouchableOpacity>  
   
    <ScrollView style={[styles.block]}>
      <Animatable.View    
          animation="bounceInDown"
          easing="ease"
          iterationCount={1}
          duration={2000}
          direction="normal">
          <Image style={styles.imgLarge} source={{uri: productInfo.photos[imgIndex]}} /> 
          {props.productInfo.photos.length > 0 ?
            <ScrollView style={styles.imgBlock} horizontal={true}>
              {
                  props.productInfo.photos.map( (item, index) => (
                      <Pressable 
                          key={index}
                          onPress={() => setImageIndex(index)} 
                          style={{margin:0}}>
                              <Image style={[styles.imgSmall,{borderColor: imgIndex===index ? '#fac300' : null }]} source={{uri: item}} />  
                      </Pressable>
                  ))
              }
            </ScrollView>
            :
            null
          }
          <View style={styles.cardBlock}>
              <Text style={styles.title}>{handleDate(productInfo.date_listed.seconds)}</Text>
              <Text style={styles.title}>₪{productInfo.price}</Text>
              <Text style={styles.title}>{productInfo.product_name}</Text> 
          </View> 

          <View style={styles.infoBox}>
              <View style={{flexDirection:'row', justifyContent:'flex-end', alignItems:'center'}}>
                  <Text style={[styles.title,{marginRight:3, marginTop:5}]}>تفاصيل اضافيه </Text>
                  <Icon 
                      iconName="info"
                      size={27}
                  />
              </View>
              <Text style={[styles.body, {marginRight:25}]}>{productInfo.description}</Text>
          </View>  
          <Text style={{color: 'red', alignSelf:'center', fontSize:12, fontFamily:'Cairo-Regular'}}>{errMsg ? errMsg : null}</Text>
          <Buttons.ButtonDefault
                titleLeft="تواصل معنا عبر WhatApp "
                iconName="whats"
                iconSize={30}
                horizontal={false}
                containerStyle={{ justifyContent:'center', borderRadius: 5, width:'90%', backgroundColor: '#2C4770', margin: 5, padding: 5, alignSelf:'center'}}
                textStyle={{fontFamily: 'Cairo-Regular' ,fontSize: 15, color: '#fff', marginRight:5}}
                onPress={()=>{productInfo.seller.id === ownerId ? 
                    setErrMsg('لا يمكنك الشراء من متجرك الخاص') 
                    : 
                    shareToWhatsApp('+' + productInfo.seller.location.code + productInfo.seller.phone, productInfo.product_name, productInfo.description, productInfo.price)
                  }}
          /> 

    </Animatable.View>
    </ScrollView>
  </>
)
}

const styles = StyleSheet.create({
    block:{
      width:'100%',
      backgroundColor:'rgba(255,255,255,1)'
    },
    cardBlock: {
      backgroundColor:'rgba(0,0,0,0.2)',
      width:'100%',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'baseline',
      padding:5
    },
    ProfileHeader:{
        backgroundColor:'rgba(255,255,255,1)',
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:5
    },
    imgBlock:{
      backgroundColor:'#323232'
    },
    title: {
      fontFamily:'Cairo-Bold',
      fontSize: 15,
      textAlign: 'center',
      color:'#2C4770',
    },
    headerText:{
      fontFamily:'Cairo-Bold',
      fontSize: 20,
      textAlign: 'center',
      color:'#2C4770',
    },
    body: {
      fontFamily:'Cairo-Regular',
      fontSize: 15,
      textAlign: 'right',
      color:'#171717',
      padding:2
    },
    imgLarge: {
      height:320,
      width:'100%',
      resizeMode:'cover',
    },
    imgSmall: {
      height:120,
      width:Dimensions.get('window').width/3,
      resizeMode:'cover',
      borderWidth:4,
    },
    infoBox:{
      padding: 5,
      marginTop:5,
      //backgroundColor:'yellow'
    },
    });

export default FullProductCard;