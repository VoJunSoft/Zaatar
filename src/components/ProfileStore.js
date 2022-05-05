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
    Image,
    ActivityIndicator
} from 'react-native'
import AppStyles from '../styles/AppStyle'
import DropShadow from "react-native-drop-shadow"
import { Avatar, Input, Divider, Overlay } from 'react-native-elements';
import Buttons from '../elements/Button'
import firestore from '@react-native-firebase/firestore';
import ProductCard from '../components/ProductCard'
import ProfileForm from '../components/ProfileForm'
import AddProductForm from '../components/AddProductForm'
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient'

const ProfileStore = (props) => {
    // const {id, name, first_name, picture, email, location, phone} = route.params
    // user information state: {id, name, first_name, picture, email, location, phone}
    const [userInfo, setUserInfo] = useState(global.sellerState)

    //products fields: productId ... {seller{}, product_name, photos[], descriptiom, category, price, date_listed}
    const [productsBySellerId, setProductsBySellerId] = useState([])

    //useEffect to retrieve the requested store/seller and refill page with new data on navigation
    const [isLoading, setIsloading] = useState(true)
    const navigation = useNavigation()
    useEffect( () => { 
    const unsubscribe = navigation.addListener('focus', () => {
            setUserInfo(global.sellerState)
            fillProductsDataById(global.sellerState.id)
        })
        return () => unsubscribe()
    },[navigation])

    //get products that belong to a certain store/seller by Id
    const fillProductsDataById =  (idx) => {
        try{
            const subscriber =  firestore()
                                    .collection('products')
                                    .where('seller.id', "==", idx)
                                    .onSnapshot(querySnapshot => {
                                        setProductsBySellerId([])
                                        querySnapshot.forEach(documentSnapshot => {
                                            setProductsBySellerId((prevState) => {
                                                return [{...documentSnapshot.data(), productId: documentSnapshot.id},  ...prevState]
                                            })
                                        })
                                    })

            return () => subscriber();
        }catch(err){
            //TODO forward to error page
            //RNRestart.Restart()
        }
    }

    //store umbrella bar
    const StoreShopSymbol = () => {
        const sluts=[1,2,3,4,5,6,7,8,9,10,11,12,13,14]
        return (
            sluts.map((item, index)=>(
                <View style={[styles.storeSymbol, 
                            {
                                backgroundColor:index%2===0 ? '#8E2DE2' : '#fac300', //dark night #373B44
                                height:30,
                            }]} key={index}>
    
                </View> 
            ))
        )
    }

    //store umbrella bar
    const StoreShopSymbolBeta = () => {
        return (
            <LinearGradient 
                //start={{x: 0, y: 0}} 
                //end={{x: 1, y: 0}}
                colors={['#4b6cb7', '#2C4770','#182848']} 
                style={styles.linearGradient}>

            </LinearGradient>
        )
    }
    
    const ProfileHeaderComponent = () =>{
        return(
            <>
            <View style={{flexDirection:'row', padding: 5, paddingTop:15, paddingBottom:15, backgroundColor: '#2C4770'}}>
                <View style={{width:'40%', justifyContent:'center', alignItems:'center'}}>
                    <Avatar
                        size={150}
                        rounded
                        source={userInfo.picture ? {uri: userInfo.picture} : require('../assets/gallary/profile.png') }
                        icon={{ name: 'user', type: 'font-awesome' }}
                        containerStyle={{ backgroundColor: '#fff' , alignSelf:'center', marginLeft:4}}
                    />
                </View>
                <View style={{width:'60%', justifyContent:'center', paddingLeft: 5}}>
                    <Buttons.ButtonDefault 
                        titleLeft={userInfo.name ? userInfo.name : 'مستخدم'}
                        iconName="profile"
                        iconSize={25}
                        containerStyle={{justifyContent:'flex-end'}}
                        textStyle={styles.SellerInfo}
                        disabled/>

                     <Buttons.ButtonDefault 
                        titleLeft={userInfo.location.city ? userInfo.location.city : 'موقعك'}
                        iconName="location"
                        iconSize={25}
                        containerStyle={{justifyContent:'flex-end'}}
                        textStyle={styles.SellerInfo}
                        disabled/>

                    <Buttons.ButtonDefault 
                        titleLeft={userInfo.phone ? userInfo.phone: 'رقم التليفون'}
                        iconName="mic"
                        iconSize={25}
                        containerStyle={{justifyContent:'flex-end'}}
                        textStyle={styles.SellerInfo}
                        disabled/>
                </View>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-around', marginBottom:10}}>
                <StoreShopSymbolBeta />
            </View>
            </>
        )
    }

    const $renderEmptyOrdersState = () => {
        return(
            <Text style={{
                        color:'#2C4770', 
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
            renderItem={ ({item, index}) => (
                <ProductCard item={item} key={index} />
            )}/>
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
            <ProfileForm userInfo={userInfo} setUserInfo={setUserInfo} setProfileFormVisibility={setProfileFormVisibility} disabled/>
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
        //backgroundColor: '#2C4770',
    },
    dropShadow:{
        shadowColor: '#323232',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.7,
        shadowRadius: 1,
    },
    ProductsList:{
       // backgroundColor: '#2C4770',
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
    },
    storeSymbol: {
        width:Dimensions.get('window').width/14, 
        //borderBottomLeftRadius:10,
        //borderBottomRightRadius:10,
    },
    SellerInfo: {
        fontFamily: 'Cairo-Regular',
        color:'#fff',
        fontSize:18,
        letterSpacing:1,
        marginRight:10,
        textAlign:'center',
        marginBottom:5
    },
    linearGradient:{
        flex:1,
        height: 30
    }
})

export default ProfileStore;