import React, {useState, useEffect} from 'react'
import { 
    View, 
    Text, 
    StyleSheet,
    Dimensions,
    ScrollView,
    Alert,
    Keyboard,
    FlatList,
    Image
} from 'react-native'
import AppStyles from '../styles/AppStyle'
import DropShadow from "react-native-drop-shadow"
import { Avatar, Input, Divider, Overlay } from 'react-native-elements';
import Buttons from '../elements/Button'
import firestore from '@react-native-firebase/firestore';
import ProductCard from '../components/ProductCard'
import ProfileForm from '../components/ProfileForm'
import AddProductForm from '../components/AddProductForm';

const Profile = (props) => {
    // const {id, name, first_name, picture, email, location, phone} = route.params
    // user information state: {id, name, first_name, picture, email, location, phone}
    const [userInfo, setUserInfo] = useState(props.seller ? props.params : props.route.params)
    
    //products fields: productId ... {seller{}, product_name, photos[], descriptiom, category, price, date_listed}
    const [productsBySellerId, setProductsBySellerId] = useState([])

    //if profile is seller the userInfo = props.productInfo.seller else userinfo = getData
    // if profile is seller (not owner) then hide some data

    useEffect( () => {
        fillProductsDataById()
    },[])

    const fillProductsDataById = () => {
        const subscriber = firestore()
            .collection('products')
            .where('seller.id', "==", userInfo.id)
            .onSnapshot(querySnapshot => {
                setProductsBySellerId([]);
                querySnapshot.forEach(documentSnapshot => {
                    setProductsBySellerId((prevState) => {
                        return [{...documentSnapshot.data(), productId: documentSnapshot.id},  ...prevState]
                    })
                })
            })

            return () => subscriber();
    }

    const AddNewProduct = ()=>{
        if(userInfo.phone ==='' || userInfo.location ==='')
            Alert.alert('أكمل معلوماتك الشخصية أولاً من فضلك')
        else
            setProductFormVisibility(true)
    }

    const [deleteButtonVisibility, setDeleteButtonVisibility] = useState(false)
    const ProfileHeaderComponent = () =>{
        return(
            <>
            <View style={{flexDirection:'row', padding: 5, paddingTop:15, paddingBottom:15, backgroundColor: '#2C4770'}}>
                <View style={{width:'35%', justifyContent:'center', alignItems:'center'}}>
                    <Avatar
                        size={120}
                        rounded
                        source={{uri: userInfo.picture}}
                        icon={{ name: 'user', type: 'font-awesome' }}
                        containerStyle={{ backgroundColor: '#323232' }}
                        key={1}
                    />
                </View>
                <View style={{width:'65%', justifyContent:'center', paddingLeft: 5}}>
                    <Buttons.ButtonDefault 
                        titleLeft={userInfo.name ? userInfo.name : 'مستخدم'}
                        iconName="profile"
                        iconSize={25}
                        containerStyle={{
                            justifyContent:'flex-end',
                            letterSpacing:3,
                        }}
                        textStyle={{
                            fontFamily: 'Cairo-Bold',
                            color:'#fff',
                            fontSize:18,
                            marginRight:5,
                            textAlign:'center',
                        }}
                        disabled/>

                     <Buttons.ButtonDefault 
                        titleLeft={userInfo.location ? userInfo.location : 'موقعك'}
                        iconName="location"
                        iconSize={25}
                        containerStyle={{
                            justifyContent:'flex-end',
                        }}
                        textStyle={{
                            fontFamily: 'Cairo-Regular',
                            color:'#fff',
                            fontSize:18,
                            letterSpacing:3,
                            marginRight:10,

                            textAlign:'center'
                        }}
                        disabled/>

                    <Buttons.ButtonDefault 
                        titleLeft={userInfo.phone ? userInfo.phone: 'رقم التليفون'}
                        iconName="mic"
                        iconSize={25}
                        containerStyle={{
                            justifyContent:'flex-end',
                            marginTop:5
                        }}
                        textStyle={{
                            fontFamily: 'Cairo-Regular',
                            color:'#fff',
                            fontSize:18,
                            letterSpacing:2,
                            marginRight:10
                        }}
                        disabled/>
                </View>
            </View>
            {!props.seller ?
                <View style={{flexDirection:'row', justifyContent:'space-around', backgroundColor: '#2C4770'}}>
                    <Buttons.ButtonDefault 
                        iconName="delete"
                        iconSize={25}
                        containerStyle={{
                            width:'14%',
                            justifyContent:'center',
                            marginTop:5,
                            backgroundColor:deleteButtonVisibility ? '#fac300' : 'rgba(255,255,255,0.3)'
                        }}
                        textStyle={{
                            fontFamily: 'Cairo-Regular',
                            color:'#fff',
                            fontSize:15,
                            letterSpacing:2,
                            marginLeft:10
                        }}
                        onPress={()=> setDeleteButtonVisibility(!deleteButtonVisibility)}
                        />

                    <Buttons.ButtonDefault 
                        titleLeft='منتج جديد'
                        iconName="add"
                        iconSize={25}
                        containerStyle={{
                            width:'35%',
                            justifyContent:'center',
                            marginTop:5,
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
                        iconName="edit"
                        iconSize={25}
                        containerStyle={{
                            width:'49%',
                            justifyContent:'center',
                            marginTop:5,
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
                </View> : null
            }
            <Divider style={{marginTop:1, opacity:0.4, marginBottom:10}}/>
            </>
        )
    }

    const $renderEmptyOrdersState = () => {
        return(
            <Text style={{
                        color:'#fff', 
                        fontFamily:'Cairo-Bold', 
                        fontSize: 15,
                        alignSelf:'center',
                        marginTop:30
                    }}>لا توجد منتجات في قائمتك</Text>
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
            showsHorizontalScrollIndicator={false}
            numColumns={2}
            keyExtractor={item => item.productId}
            style={styles.ProductsList}
            renderItem={ ({item}) => (
                <ProductCard item={item} deleteButtonVisibility={deleteButtonVisibility} />
            )}
        />

        <Overlay isVisible={profileFormVisibility} 
                onBackdropPress={()=>setProfileFormVisibility(!profileFormVisibility)} 
                fullScreen={true}
                overlayStyle={{
                    padding:0, 
                    width:'96%',
                    height:'96%', 
                    borderRadius:15,
                    backgroundColor:'rgba(255,255,255,0.95)',
                }}>
            <ProfileForm userInfo={userInfo} setUserInfo={setUserInfo} setProfileFormVisibility={setProfileFormVisibility} />
        </Overlay>

        <Overlay isVisible={productFormVisibility} 
                onBackdropPress={()=>setProductFormVisibility(false)} 
                fullScreen={true}
                overlayStyle={{
                    padding:0, 
                    width:'96%',
                    height:'96%', 
                    borderRadius:15,
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
        backgroundColor: '#2C4770',
    },
    dropShadow:{
        shadowColor: '#323232',
        shadowOffset: {width: -0, height: 0},
        shadowOpacity: 0.7,
        shadowRadius: 1,
    },
    ProductsList:{
        backgroundColor: '#2C4770',
    },
    ProductCard:{
        width:'45%',
        alignItems:'center',
        backgroundColor:'#fff',
        marginTop: 15,
        margin: 10,
        borderRadius:10,
        overflow:'hidden',
        padding: 5
    }
})

export default Profile;