import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Alert } from 'react-native'
import { Overlay } from 'react-native-elements';
import FullProductCard from './FullProductCard'
import Buttons from '../elements/Button'
import firestore from '@react-native-firebase/firestore';
import AddProductForm from '../components/AddProductForm'

export default function ProductCard(props) {
    //products fields {seller:{userInfo}, product_name, photos[], descriptiom, category, price, date_listed}
    const [productInfo, setProductInfo] = useState(props.item)
    //ProfileForm.js visibility
    const [fullProductVisibility, setFullProductVisibility] = useState(false)
    //ProductForm.js visibility
    const [productFormVisibility, setProductFormVisibility] = useState(false)

    useEffect(()=>{
        //get seller info based on productInfo.seller.id and store it to {...productInfo, seller: {...documentSnapshot.data(), id: documentSnapshot.id}}
        UpdateSellerInfo(productInfo.seller.id)
    })

    const UpdateSellerInfo = (SellerId) => {
        const subscriber = firestore()
                .collection('users')
                .doc(SellerId)
                .get()
                .then(documentSnapshot => {
                    setProductInfo({...productInfo, seller: {...documentSnapshot.data(), id: documentSnapshot.id}})
                })
                .catch((e) => {
                    //error
                })
        return() => subscriber
    }

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

    const DefaultView = (props) => {
        return(
            <TouchableOpacity   style={styles.ProductCard} 
                                activeOpacity={0.7} 
                                onPress={()=>setFullProductVisibility(true)}
                                disabled={props.deleteButtonVisibility}>
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

    const SecondryView = (props) => {
        return(
            <TouchableOpacity   style={styles.ProductCard} 
                                activeOpacity={0.7} 
                                onPress={()=>setFullProductVisibility(true)}
                                disabled={props.deleteButtonVisibility} >
                <ImageBackground style={{width: "100%", height: 260}} source={{uri : productInfo.photos[0]}} > 
                { props.deleteButtonVisibility ?
                    <View style={{
                            width:'100%',
                            backgroundColor: 'rgba(255,255,255,0.99)',
                            flexDirection:'row',
                            justifyContent:'space-around',
                            }}>
                        <Buttons.ButtonDefault 
                            iconName="edit"
                            iconSize={25}
                            containerStyle={{
                                width:'50%',
                                justifyContent:'center',
                                borderRightWidth:1
                                
                            }}
                            onPress={()=>setProductFormVisibility(true)}/>  
                        <Buttons.ButtonDefault 
                            iconName="delete"
                            iconSize={25}
                            containerStyle={{
                                width:'50%',
                                justifyContent:'center',
                            }}
                            onPress={()=> DeleteProduct(productInfo.productId)}/>  
                    </View>
                    : null
                }                  
                {/* <Image style={{width: "100%", height: 200, borderRadius:0, marginTop: 0, marginBottom: 0}} source={{uri : productInfo.photos[0]}} />  */}
                <View style={{flex:1,width: "100%",flexDirection:'column', alignItems:'center', justifyContent:'flex-end'}}>
                    <Text style={styles.body}> {productInfo.product_name}</Text>  
                    <Text style={styles.body}> ₪{productInfo.price}</Text>    
                </View>  
                </ImageBackground>  
            </TouchableOpacity>
        )
    }

    const BGView = (props) => {
        return(
            <TouchableOpacity   style={styles.ProductCard} 
                                activeOpacity={0.7} 
                                onPress={()=>setFullProductVisibility(true)}
                                disabled={props.deleteButtonVisibility}>
                <ImageBackground style={{width: "100%", height: 250}} source={{uri : productInfo.photos[0]}} > 
                    <View style={{flex:1,flexDirection:'column', justifyContent:'space-between'}}>
                        <Text style={[styles.body, {padding: 3}]}> {productInfo.product_name}</Text>  
                        { props.deleteButtonVisibility ?
                        <View style={{
                                width:'100%',
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                flexDirection:'row',
                                justifyContent:'space-around',
                                }}>
                            <Buttons.ButtonDefault 
                                iconName="edit"
                                iconSize={30}
                                containerStyle={{
                                    width:'50%',
                                    justifyContent:'center',
                                    borderRightWidth:1
                                }}
                                onPress={()=>setProductFormVisibility(true)}/>  
                            <Buttons.ButtonDefault 
                                iconName="delete"
                                iconSize={25}
                                containerStyle={{
                                    width:'50%',
                                    justifyContent:'center',
                                }}
                                onPress={()=> DeleteProduct(productInfo.productId)}/>  
                        </View>
                        : 
                        <Text style={styles.body}> ₪{productInfo.price}</Text>  
                }    
                    </View>  
                </ImageBackground> 
            </TouchableOpacity>
        )
    }

    return (
        <>
        {BGView(props)}
        <Overlay isVisible={fullProductVisibility} 
                onBackdropPress={()=>setFullProductVisibility(false)} 
                fullScreen={true}
                overlayStyle={{
                    padding:0, 
                    width:'94%',
                    height:'100%', 
                    borderRadius:0,
                }}>
                <FullProductCard productInfo={productInfo} setFullProductVisibility={setFullProductVisibility} />
        </Overlay>

        <Overlay isVisible={productFormVisibility} 
                onBackdropPress={()=>setProductFormVisibility(false)} 
                fullScreen={true}
                overlayStyle={{
                    padding:0, 
                    width:'96%',
                    height:'98%', 
                    borderRadius:15,
                    backgroundColor:'rgba(255,255,255,0.95)',
                }}>
            <AddProductForm userInfo={productInfo.seller} productInfo={productInfo} setProductFormVisibility={setProductFormVisibility} EditProduct={true}/>
        </Overlay>
        </>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1
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
        borderTopLeftRadius:20,
        borderBottomRightRadius:20,
        overflow:'hidden',
        alignItems:'center'
    },
    title:{
        fontFamily:'Cairo-Bold',
        fontSize: 15,
        color: '#2C4770',
    },
    body:{
        width:'100%',
        fontSize: 16,
        color: '#2C4770',
        backgroundColor:'rgba(255,255,255,0.9)',
        textAlign:'center',
        letterSpacing:1,
        fontFamily:'Cairo-Bold'
    },
})