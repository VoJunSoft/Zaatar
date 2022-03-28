import React, {useState} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Alert } from 'react-native'
import { Overlay } from 'react-native-elements';
import FullProductCard from './FullProductCard'
import Buttons from '../elements/Button'
import firestore from '@react-native-firebase/firestore';

export default function ProductCard(props) {
    //products fields {seller:{userInfo}, product_name, photos[], descriptiom, category, price, date_listed}
    const [productInfo, setProductInfo] = useState(props.item)
    //ProfileForm.js visibility
    const [fullProductVisibility, setFullProductVisibility] = useState(false)

    const DeleteProduct = (id) => {
        //delete item based on productId 
        //TODO delete related images from firebase storage
        Alert.alert(
            "تحذير",
            "هل تريد حذف هذا المنتج؟",
            [
            {
                text: "لا",
            },
            { 
                text: "نعم", 
                onPress: () => {
                            const sub = firestore()
                                        .collection('products')
                                        .doc(id)
                                        .delete()
                            
                            return () => sub();
                            }
            }
            ]
        )
    }

    const DefaultView = () => {
        return(
            <TouchableOpacity   style={styles.ProductCard} 
                                activeOpacity={0.7} 
                                onPress={()=>setFullProductVisibility(true)}
                                disabled={props.deleteButtonVisibility} >
                <Text style={styles.title}> {productInfo.product_name}</Text>
                <Image style={{width: "100%", height: 170, borderRadius:0, marginTop: 5, marginBottom: 0}} source={{uri : productInfo.photos[0]}} /> 
                <View style={{width: "100%",flexDirection:'row', 
                                            justifyContent:props.deleteButtonVisibility ? 'space-between' : 'center', 
                                            alignItems:'center'}}>    
                    <Text style={[styles.body, {marginLeft:props.deleteButtonVisibility ? 10 : 0}]}> ₪{productInfo.price}</Text> 
                    { props.deleteButtonVisibility ?
                        <Buttons.ButtonDefault 
                                iconName="delete"
                                iconSize={25}
                                containerStyle={{
                                    width:'30%',
                                    justifyContent:'center',
                                    backgroundColor: '#fac300'
                                }}
                                textStyle={{
                                    fontFamily: 'Cairo-Regular',
                                    color:'#fff',
                                }}
                                iconContainer={{
                                    backgroundColor:'#fac300'
                                }}
                                onPress={()=> DeleteProduct(productInfo.productId)}
                                />  : null
                    } 
                </View>        
            </TouchableOpacity>
        )
    }

    const SecondryView = () => {
        return(
            <TouchableOpacity   style={styles.ProductCard} 
                                activeOpacity={0.7} 
                                onPress={()=>setFullProductVisibility(true)}
                                disabled={props.deleteButtonVisibility} >
                { props.deleteButtonVisibility ?
                    <Buttons.ButtonDefault 
                            iconName="delete"
                            iconSize={25}
                            containerStyle={{
                                width:'100%',
                                justifyContent:'center',
                                marginTop:5,
                                backgroundColor: 'rgba(255,255,255,0.3)'
                            }}
                            textStyle={{
                                fontFamily: 'Cairo-Regular',
                                color:'#fff',
                                fontSize:15,
                                letterSpacing:2,
                                marginLeft:10
                            }}
                            onPress={()=> DeleteProduct(productInfo.productId)}
                            />  : null
                }                  
                <Image style={{width: "100%", height: 250, borderRadius:0, marginTop: 0, marginBottom: 0}} source={{uri : productInfo.photos[0]}} /> 
                <View style={{width: "100%",flexDirection:'row', justifyContent:'space-around'}}>
                    <Text style={styles.body}> ₪{productInfo.price}</Text> 
                    <Text style={styles.title}> {productInfo.product_name}</Text>     
                </View>   
            </TouchableOpacity>
        )
    }

    const BGView = () => {
        return(
            <TouchableOpacity   style={styles.ProductCard} 
                                activeOpacity={0.7} 
                                onPress={()=>setFullProductVisibility(true)}>
                <ImageBackground style={{width: "100%", height: 250}} source={{uri : productInfo.photos[0]}} > 
                    <View style={{width: "100%",flexDirection:'row', justifyContent:'space-around', backgroundColor:'#fff'}}>
                        <Text style={styles.body}> ₪{productInfo.price}</Text> 
                        <Text style={styles.title}> {productInfo.product_name}</Text>     
                    </View>  
                </ImageBackground> 
            </TouchableOpacity>
        )
    }

    return (
        <>
        <DefaultView />
        <Overlay isVisible={fullProductVisibility} 
                onBackdropPress={()=>setFullProductVisibility(false)} 
                fullScreen={true}
                overlayStyle={{
                    padding:0, 
                    width:'94%',
                    height:'98%', 
                    borderRadius:10,
                    backgroundColor:'rgba(255,255,255,0.95)',
                }}>
                  {/* ownerId={props.ownerId} */}
                <FullProductCard productInfo={productInfo} setFullProductVisibility={setFullProductVisibility} />
        </Overlay>
        </>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#2C4770',
    },
    dropShadow:{
        shadowColor: '#323232',
        shadowOffset: {width: -0, height: 0},
        shadowOpacity: 0.7,
        shadowRadius: 1,
    },
    ProductCard:{
        width:'45%',
        backgroundColor:'#fff',
        margin: 10,
        borderRadius:10,
        overflow:'hidden',
        alignItems:'center'
        //padding: 5
    },
    title:{
        fontFamily:'Cairo-Bold',
        fontSize: 15,
        color: '#2C4770',
    },
    body:{
        fontFamily:'Cairo-Bold',
        fontSize: 15,
        color: '#2C4770',
    },
})