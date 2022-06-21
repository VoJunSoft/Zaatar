import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Alert } from 'react-native'
import { Overlay } from 'react-native-elements';
import FullProductCard from './FullProductCard'
import Buttons from '../elements/Button'
import firestore from '@react-native-firebase/firestore';
import EditProductForm from '../components/AddProductForm'
import DropShadow from "react-native-drop-shadow";
import ProductCardDefaultView from './ProductCardDefaultView'
import ProductCardPremiumView from './ProductCardPremiumView'
import ProductCardZaatarViewAltra from './ProductCardZaatarViewAltra'
import ProductCardAdminView from './ProductCardAdminView'
import FastImage from 'react-native-fast-image'
import CarouselCardView from './CarouselCardView';

export default function ProductCard(props) {
    //products fields {seller:{userInfo}, product_name, photos[], descriptiom, category, price, date_listed}
    const [productInfo, setProductInfo] = useState(props.productInfo)
    //ProfileForm.js visibility
    const [fullProductVisibility, setFullProductVisibility] = useState(false)
    //ProductForm.js visibility
    const [productFormVisibility, setProductFormVisibility] = useState(false)

    //retrieve seller info from database based on seller id save to productInfo which will be passed to fullproductcard
    //and save it to global variable which will be used to display
    //previously sellerInfo are attached to each product posted which cause a bug in case seller updates their info
    const UpdateShowSellerInfo = (SellerId) => {
        const subscriber = firestore()
                .collection('users')
                .doc(SellerId)
                .get()
                .then(documentSnapshot => {
                    //update seller info from users database
                    setProductInfo({...productInfo, seller: {...documentSnapshot.data(), id: documentSnapshot.id}})

                    //TODO 1. don't use global veriable, find other solutions 
                    //     2. store only sellerid into products and reference it to users collection for user info @ Zaatar.js : seller: db.doc('users/' + user_key),
                    //set global.sellerState veriable to the updated userInfo instead of the ones stored within the product object
                    global.sellerState = {...documentSnapshot.data(), id: documentSnapshot.id}

                    //open up FullProductCard.js
                    setFullProductVisibility(true)
                })
                .catch((e) => {
                    //error
                })
        return() => subscriber

        // global.sellerState = productInfo.seller
        // setFullProductVisibility(true)
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
                            
                            return () => sub
                            }
            }
            ]
        )
    }

    const getView = (view) =>{
        //getView(props.view)
        switch(view){
            case 'BodyView':
                return <ProductCardDefaultView productInfo={productInfo} />
            case 'BodyAltraView':
                return <ProductCardZaatarViewAltra productInfo={productInfo} />
            case 'PremiumView':
                return <ProductCardPremiumView productInfo={productInfo} />
            case 'AdminView':
                return <ProductCardAdminView productInfo={productInfo}/>
            case 'Carousel':
                return <CarouselCardView productInfo={productInfo} />
            default:
                return <DefaultView />
        }
    }

    const DefaultView = () => {
        return(
            <View style={{flex:1, backgroundColor:'#2C4770'}}>
                <DropShadow style={styles.dropShadow}>
                    <FastImage style={styles.displayImg} 
                        source={productInfo.photos[0] ? {uri : productInfo.photos[0]} : require('../assets/gallary/Zaatar.png')} 
                        resizeMode={FastImage.resizeMode.cover}/>
                </DropShadow >
                <View style={styles.subDefaultContainer}>    
                    <Text style={styles.titleDefault}> {productInfo.product_name}</Text> 
                    { !props.deleteButtonVisibility ?
                        <Text style={styles.price}> {props.productInfo.currency?props.productInfo.currency:'₪'}{productInfo.price}</Text> 
                        :
                        null
                    }
                </View> 
            </View>
        )
    }

    const EditDelete = () =>{
        return(
            <View style={{width:'100%',backgroundColor:props.view === 'AdminView'? '#2C477088' : '#2C477088', flexDirection:'row', justifyContent:'space-around'}}>
                <Buttons.ButtonDefault 
                    iconName="edit"
                    iconSize={25}
                    containerStyle={{width:'50%',justifyContent:'center',borderRightWidth:1}}
                    onPress={()=>setProductFormVisibility(true)}/>  
                <Buttons.ButtonDefault 
                    iconName="delete"
                    iconSize={25}
                    containerStyle={{width:'50%',justifyContent:'center'}}
                    onPress={()=> DeleteProduct(productInfo.productId)}/>  
            </View>
        )
    }
    const CardView = () => {
        return(
            <TouchableOpacity   style={props.view === 'BodyAltraView' ? 
                                        styles.ProductCardDefault : props.view === 'AdminView' ? 
                                        styles.ProductCardAdmin : props.view === 'Carousel' ? 
                                        styles.ProductCardCarousel : styles.ProductCardAltra} 
                                activeOpacity={0.7} 
                                onPress={()=>UpdateShowSellerInfo(productInfo.seller.id)}
                                disabled={props.deleteButtonVisibility}>

                {
                    getView(props.view)
                }

                { props.deleteButtonVisibility ?
                    <EditDelete/>
                : 
                    null
                }       
            </TouchableOpacity>
        )
    }
    
    return (
        <>
        <CardView />
        <Overlay isVisible={fullProductVisibility} 
                onBackdropPress={()=>setFullProductVisibility(false)} 
                fullScreen={true}
                overlayStyle={{
                    padding:0, 
                    width:'96%',
                    height:'100%', 
                    borderRadius:0,
                }}>
                <FullProductCard productInfo={productInfo} setFullProductVisibility={setFullProductVisibility} currencySymbol={props.currency}/>
        </Overlay>

        <Overlay isVisible={productFormVisibility} 
                onBackdropPress={()=>setProductFormVisibility(false)} 
                fullScreen={true}
                overlayStyle={{
                    padding:0, 
                    width:'96%',
                    height:'100%', 
                    borderRadius:0,
                    backgroundColor:'rgba(255,255,255,0.95)',
                }}>
            <EditProductForm productInfo={productInfo} setProductFormVisibility={setProductFormVisibility} EditProduct={true}/>
        </Overlay>
        </>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    dropShadow:{
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 3},
        shadowOpacity: 1,
        shadowRadius: 1,
        padding:2
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
    ProductCardDefault:{
        //flex:1,
        width:'49%',
        marginTop:8,
        margin:2,
        borderRadius:13,
        overflow:'hidden'
    },
    ProductCardAltra:{
        //flex:1,
        width:'46%',
        margin:8,
        marginTop:10,
        borderRadius:13,
        overflow:'hidden',
        alignSelf:'center',
    },
    ProductCardAdmin:{
        marginTop: 12,
        width:'98%',
        alignSelf:'center',
        borderRadius:5,
        overflow:'hidden',
        borderWidth:1
    },
    ProductCardCarousel:{
        
    },
    subDefaultContainer: {
        flex:1,
        width: "100%",
        flexDirection:'column',  
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomLeftRadius:13,
        borderBottomRightRadius:13,
        borderColor:'rgba(255,255,255,0.5)',
        marginTop:2
    },
    price:{
        fontFamily:'Cairo-Regular',
        fontSize: 13,
        color: '#fff',
        textAlign:'center',
        marginTop:5,
        marginBottom:5
    },
    titleDefault:{
        fontFamily:'Cairo-Regular',
        fontSize: 14,
        color: '#fff',
        textAlign:'center',
        marginBottom:2
    },
    dateDefault:{
        fontFamily:'Cairo-Regular',
        color: '#fff',
        textAlign:'center',
    },
    body:{
        width:'100%',
        fontSize: 14,
        color: '#2C4770',
        backgroundColor:'rgba(255,255,255,0.9)',
        textAlign:'center',
        letterSpacing:1,
        fontFamily:'Cairo-Bold'
    },
    displayImg:{
        width: "100%", 
        height: 130, 
        backgroundColor:'#E5EEFF',
        borderRadius:10,
        alignSelf:'center'
    },
    circle:{
        backgroundColor:'rgba(255,255,255,0.2)',
        borderRadius:50,
        padding: 3,
        fontSize: 12,
    }
})