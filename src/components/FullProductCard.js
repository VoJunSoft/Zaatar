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
    Pressable
} from 'react-native'
import Icon from '../elements/Icon'
import {Picker} from '@react-native-picker/picker'
import Buttons from '../elements/Button'
import { Avatar } from 'react-native-elements';
import {useNavigation} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const FullProductCard = (props) => {
    const navigation = useNavigation()

    useEffect( ()=>{
      getData() 

      return () => getData()
    }, [])
  
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

    //props.productInfo  & props.setFullProductVisibility from productCard.js
    ////productInfo fields {seller:{userInfo}, product_name, photos[], descriptiom, category, price, date_listed}
    const [productInfo, setProductInfo] = useState(props.productInfo)
    //large image display index
    const [imgIndex, setImageIndex] = useState(0)

    const GoToSellerProfile = () => {
     // if user is owner then go to his/her page
      if(productInfo.seller.id === ownerId)
         navigation.navigate('Profile')
       else
          navigation.navigate('SellerProfile' , productInfo.seller)

      props.setFullProductVisibility(false)
    }
    return (
    <>
    <TouchableOpacity 
        style={styles.ProfileHeader} 
        activeOpacity={0.7} 
        onPress={()=>GoToSellerProfile()}>
        <Text style={styles.title}>{productInfo.seller.name}</Text> 
        <Avatar
              size={50}
              rounded
              source={{uri: productInfo.seller.picture.data.url}}
              icon={{ name: 'user', type: 'font-awesome' }}
              containerStyle={{ backgroundColor: '#2C4770', marginLeft:10}}
              key={1}
          />
    </TouchableOpacity>   
    <ScrollView style={[styles.block]}>
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
                onPress={()=>{productInfo.seller.id === props.ownerId ? Alert.alert('لا يمكنك الشراء من متجرك الخاص') : null}}
          /> 
    </ScrollView>
  </>
)
}

const styles = StyleSheet.create({
    block:{
      width:'100%',
      //backgroundColor:'rgba(0,0,0,0.3)'
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
        backgroundColor:'rgba(0,0,0,0.2)',
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