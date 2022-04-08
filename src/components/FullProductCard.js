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

const FullProductCard = (props) => {
    const navigation = useNavigation()
    //props.productInfo  & props.setFullProductVisibility from productCard.js
    ////productInfo fields {seller:{userInfo}, product_name, photos[], descriptiom, category, price, date_listed}

    // TODO get productInfo.seller from database based on productInfo.seller.id
    const [productInfo, setProductInfo] = useState(props.productInfo)
    //large image display index
    const [imgIndex, setImageIndex] = useState(0)

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
    const GoToSellerProfile = (data) => {
     // if user is owner then go to his/her page
      if(productInfo.seller.id === ownerId){
           navigation.navigate('Profile')
      }else{
          navigation.setParams('SellerProfile' , data)
          // console.log('----->', productInfo.seller.id)
          navigation.navigate('SellerProfile' , data)
      }

      props.setFullProductVisibility(false)
    }

    const shareToWhatsApp = (phoneNumber) => {
      let data = 'زعتر - ' + productInfo.product_name + ' (' + productInfo.description + ') ' + 'السعر :' + productInfo.price + '₪'
      Linking.openURL(`whatsapp://send?text=${data}&phone=${phoneNumber}`);
    }

    return (
    <>
    <TouchableOpacity 
        style={styles.ProfileHeader} 
        activeOpacity={0.7} 
        onPress={()=>GoToSellerProfile(productInfo.seller)}>
        <Text style={styles.title}>{productInfo.seller.name}</Text> 
        <Avatar
              size={50}
              rounded
              source={productInfo.seller.picture ? {uri: productInfo.seller.picture} : require('../assets/gallary/profile.png') }
              icon={{ name: 'user', type: 'font-awesome' }}
              containerStyle={{ backgroundColor: '#2C4770', marginLeft:10}}
              key={1}
          />
    </TouchableOpacity>  
   
    <ScrollView style={[styles.block]}>
      <Animatable.View    
          animation="bounceInDown"
          easing="ease"
          iterationCount={1}
          duration={1000}
          direction="normal">
          <Image style={styles.imgLarge} source={{uri: productInfo.photos[imgIndex]}} /> 
          <ScrollView style={styles.imgBlock} horizontal={true}>
            {
                productInfo.photos.map( (item, index) => (
                    <Pressable 
                        key={index}
                        onPress={() => setImageIndex(index)} 
                        style={{margin:0}}>
                            <Image style={[styles.imgSmall,{borderColor: imgIndex===index ? '#fac300' : null }]} source={{uri: item}} />  
                    </Pressable>
                ))
            }
          </ScrollView>
          <View style={styles.cardBlock}>
              <Text style={styles.title}>₪{productInfo.price}</Text>
              <Text style={styles.title}>{productInfo.product_name}</Text> 
          </View> 

          <View style={styles.infoBox}>
              <View style={{flexDirection:'row', justifyContent:'flex-end', alignItems:'center', marginRight:-10}}>
                  <Text style={[styles.title,{marginRight:2}]}>تفاصيل اضافيه </Text>
                  <Icon 
                      iconName="fire"
                      size={25}
                  />
              </View>
              <Text style={[styles.body, {marginRight:20}]}>{productInfo.description}</Text>
          </View>  

          <Buttons.ButtonDefault
                titleRight="تواصل معنا عبر WhatApp "
                iconName="add"
                iconSize={30}
                horizontal={false}
                containerStyle={{ justifyContent:'center', borderRadius: 5, width:'90%', backgroundColor: '#2C4770', alignSelf:'center', margin: 15, padding: 5}}
                textStyle={{fontFamily: 'Cairo-Regular' ,fontSize: 18, color: '#fff'}}
                iconContainer={{backgroundColor:'rgba(255,255,255,0.25)', borderRadius:50}}
                onPress={()=>{productInfo.seller.id === props.ownerId ? Alert.alert('لا يمكنك الشراء من متجرك الخاص') : shareToWhatsApp(productInfo.seller.phone)}}
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
      alignItems:'center',
      alignSelf:'center',
      padding:5
    },
    ProfileHeader:{
        backgroundColor:'rgba(255,255,255,1)',
        width:'100%',
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
        paddingRight:10,
        padding:5
    },
    imgBlock:{
      backgroundColor:'#323232'
    },
    title: {
      fontFamily:'Cairo-Bold',
      fontSize: 17,
      textAlign: 'center',
      color:'#171717',
    },
    body: {
      fontFamily:'Cairo-Regular',
      fontSize: 17,
      textAlign: 'right',
      marginRight:10,
      color:'#171717',
    },
    imgLarge: {
      height:400,
      width:'100%',
      resizeMode:'cover',
    },
    imgSmall: {
      height:120,
      width:Dimensions.get('window').width/3,
      resizeMode:'cover',
      borderWidth:3,
    },
    infoBox:{
      width:'97%',
      padding: 5,
      marginTop:5,
      borderBottomWidth:0,
    },
    });

export default FullProductCard;