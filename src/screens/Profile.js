import React, {useState, useEffect} from 'react'
import { 
    View, 
    Text, 
    StyleSheet,
    Alert,
    FlatList,
    ActivityIndicator
} from 'react-native'
import { Avatar, Overlay } from 'react-native-elements';
import Buttons from '../elements/Button'
import firestore from '@react-native-firebase/firestore';
import ProductCard from '../components/ProductCard'
import ProfileForm from '../components/ProfileForm'
import AddProductForm from '../components/AddProductForm'
import RNRestart from 'react-native-restart'
import {currencySymbols} from "../scripts/DataValues.json"

const Profile = (props) => {
    // const {id, name, picture, email, location:{}, phone} = route.params
    // user information state: {id, name, picture, email, location:{}, phone}
    const [userInfo, setUserInfo] = useState(props.route.params)

    //products fields: productId ... {seller{}, product_name, photos[], descriptiom, category, price, date_listed}
    const [productsBySellerId, setProductsBySellerId] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    //if profile is seller the userInfo = props.productInfo.seller else userinfo = getData
    useEffect( () => {
            fillProductsDataById()
    },[])

    const fillProductsDataById = () => {
        try{
            const subscriber = firestore()
                .collection('products')
                .where('seller.id', "==", userInfo.id)
                .onSnapshot(querySnapshot => {
                    setProductsBySellerId([])
                    querySnapshot.forEach(documentSnapshot => {
                        setProductsBySellerId((prevState) => {
                            return [{...documentSnapshot.data(), productId: documentSnapshot.id},  ...prevState]
                        })
                    })
                    setIsLoading(false)
                })

                return () => subscriber();
        }catch(err){
            //TODO getZaatarUserInfo from async and reload fillProductsDataById()
            RNRestart.Restart()
        }
    }

    const AddNewProduct = ()=>{
        if(userInfo.phone ==='' || userInfo.location.city ==='')
            Alert.alert('أكمل معلوماتك الشخصية أولاً من فضلك')
        else
            setProductFormVisibility(true)
    }
    
    const [deleteButtonVisibility, setDeleteButtonVisibility] = useState(false)
    const ProfileHeaderComponent = () =>{
        return(
            <>
            <View style={{flexDirection:'row', padding: 5, paddingTop:10, paddingBottom:10, backgroundColor: '#2C4770'}}>
                <View style={{width:'40%', justifyContent:'center', alignItems:'center'}}>
                    <Avatar
                        size={140}
                        rounded
                        source={userInfo.picture ? {uri: userInfo.picture} : require('../assets/gallary/p1.png') }
                        icon={{ name: 'user', type: 'font-awesome', color : '#2C4770'}}
                        containerStyle={{backgroundColor:'#fff', margin:5}}
                    />
                </View>
                <View style={{width:'60%', justifyContent:'center', paddingLeft: 5}}>
                    <Buttons.ButtonDefault 
                        titleLeft={userInfo.name ? userInfo.name : 'مستخدم'}
                        iconName="profile"
                        iconSize={25}
                        containerStyle={{
                            justifyContent:'flex-end',
                            letterSpacing:3,
                        }}
                        textStyle={{
                            fontFamily: 'Cairo-Regular',
                            color:'#fff',
                            fontSize:18,
                            marginRight:5,
                            textAlign:'center',
                        }}
                        disabled/>

                     <Buttons.ButtonDefault 
                        titleLeft={userInfo.location.city ? userInfo.location.city : 'موقعك'}
                        iconName="location"
                        iconSize={25}
                        containerStyle={{
                            justifyContent:'flex-end',
                        }}
                        textStyle={{
                            fontFamily: 'Cairo-Regular',
                            color:'#fff',
                            fontSize:15,
                            letterSpacing:3,
                            marginRight:10,

                            textAlign:'center'
                        }}
                        disabled/>

                    <Buttons.ButtonDefault 
                        titleLeft={userInfo.phone ? userInfo.phone: 'رقم التليفون'}
                        iconName="speakers"
                        iconSize={25}
                        containerStyle={{
                            justifyContent:'flex-end',
                            marginTop:5
                        }}
                        textStyle={{
                            fontFamily: 'Cairo-Regular',
                            color:'#fff',
                            fontSize:15,
                            marginRight:10
                        }}
                        disabled/>
                </View>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-around', backgroundColor: '#2C4770', marginBottom: 10}}>
                <Buttons.ButtonDefault 
                    iconName="edit"
                    iconSize={25}
                    containerStyle={{
                        width:'14%',
                        justifyContent:'center',
                        backgroundColor:deleteButtonVisibility ? '#fac300' : 'rgba(255,255,255,0.3)'
                    }}
                    onPress={()=> setDeleteButtonVisibility(!deleteButtonVisibility)}/>

                <Buttons.ButtonDefault 
                    titleLeft='منتج جديد'
                    iconName="add"
                    iconSize={25}
                    containerStyle={{
                        width:'35%',
                        justifyContent:'center',
                        backgroundColor:'rgba(255,255,255,0.3)'
                    }}
                    textStyle={{
                        fontFamily: 'Cairo-Regular',
                        color:'#fff',
                        fontSize:15,
                        letterSpacing:2,
                        marginLeft:10
                }}
                onPress={()=> AddNewProduct()}
                />
                
                <Buttons.ButtonDefault 
                    titleLeft='تفاصيل المستخدم'
                    iconName="profile"
                    iconSize={25}
                    containerStyle={{
                        width:'49%',
                        justifyContent:'center',
                        backgroundColor:'rgba(255,255,255,0.3)'
                    }}
                    textStyle={{
                        fontFamily: 'Cairo-Regular',
                        color:'#fff',
                        fontSize:15,
                        letterSpacing:2,
                        marginLeft:10
                    }}
                    onPress={()=>setProfileFormVisibility(true)}
                    />
            </View> 
            </>
        )
    }

    const $renderEmptyOrdersState = () => {
        return(
            <>
            {isLoading ?
                <>
                    <Text style={styles.loading}>جار التحميل</Text>
                    <ActivityIndicator color='#2C4770' size={35}/>
                </>
            :
                <Text style={styles.loading}>لا توجد منتجات في قائمتك</Text>
            }
            </>
        )
    }

    //ProfileForm.js visibility
    const [profileFormVisibility, setProfileFormVisibility] = useState(false)
    //AddProductForm.js visibility
    const [productFormVisibility, setProductFormVisibility] = useState(false)
    
    return (
        <>
        <FlatList 
            data={productsBySellerId}
            ListHeaderComponent={<ProfileHeaderComponent />}
            ListFooterComponent={productsBySellerId.length === 0 ? $renderEmptyOrdersState : null}
            stickyHeaderIndices={[0]}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            keyExtractor={item => item.productId}
            style={styles.ProductsList}
            renderItem={ ({item, index}) => (
                <ProductCard view='Default' productInfo={item} deleteButtonVisibility={deleteButtonVisibility} currencySymbol={currencySymbols[userInfo.location.flag]}/>
            )}/>

        <Overlay isVisible={profileFormVisibility} 
                onBackdropPress={()=>setProfileFormVisibility(!profileFormVisibility)} 
                fullScreen={true}
                overlayStyle={{
                    padding:0, 
                    width:'96%',
                    height:'100%', 
                    borderRadius:0,
                    backgroundColor:'rgba(255,255,255,0.95)',
                }}>
            <ProfileForm userInfo={userInfo} setUserInfo={setUserInfo} setProfileFormVisibility={setProfileFormVisibility} disabled/>
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
            <AddProductForm userInfo={userInfo} setProductFormVisibility={setProductFormVisibility} />
        </Overlay>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        //backgroundColor: '#2C4770',
    },
    dropShadow:{
        shadowColor: '#323232',
        shadowOffset: {width: -0, height: 0},
        shadowOpacity: 0.7,
        shadowRadius: 1,
    },
    ProductsList:{
        backgroundColor: '#FFFFFF',
    },
    storeSymbol: {
        width:'7%', 
        borderBottomLeftRadius:11,
        borderBottomRightRadius:11
    },
    loading: {
        color:'#2C4770', 
        fontFamily:'Cairo-Bold', 
        fontSize: 15,
        alignSelf:'center',
        marginTop:100,
        marginBottom:5
    }
})

export default Profile;