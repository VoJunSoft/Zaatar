import React, {useState, useEffect} from 'react'
import { 
    View, 
    Text, 
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import ProductCard from '../components/ProductCard'
import ZaatarSearchBar from '../components/ZaatarSearchBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import {currencySymbols} from "../scripts/CurrencySymbols.json"
import { filterDataByCategory } from '../scripts/Search';
//import UserData from '../scripts/UserData'
//import * as RNLocalize from "react-native-localize"


export default function Zaatar(props) {
    //const user = new UserData()
    //const [userInfo, setInfoUser] = useState(props.route.params)
    // userInfo state: {id, name, picture, email, location:{country,code,flag,currency,city}, phone}
    //products fields: productId ... {seller:{userInfo}, product_name, photos:[], descriptiom, category, price, date_listed}
    const [products, setProducts] = useState([])
    //search input and category for filtering data/products
    const [searchInput, setSearchInput] = useState("")
    const [category, setCategory] = useState('الكل')

    //state for top list
    //currently retrieving ELFAHMAWI search input
    //TODO return premium products from premium stores
    //const [productsPremium, setProductsPremium] = useState([])
    //get location currency
    //const [userLocation, setUserLocation] = useState(props.route.params.location.country ? props.route.params.location.country : 'Israel')
    const [currencySymbol, setCurrencySymbol] = useState(currencySymbols[props.route.params.location.flag] ? currencySymbols[props.route.params.location.flag] : '₪')
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        //TODO get data based on location and add filter based on town/city
        GetProductsByDate()
        console.log('Zattar Params : ' , props.route.params)
    },[])

    const GetProductsByDate = () => {
        setIsLoading(true)
        const subscriber = firestore()
            .collection('products')
            .orderBy('date_listed', 'asc')
            .onSnapshot(querySnapshot => {
                setProducts([])
                querySnapshot.forEach(documentSnapshot => {
                    //TODO get stores within location (instead of products within location) and display their products
                    //retrieve users' IDs within the same location [stores] and retrieve every product that has a matching seller.id
                        setProducts((prevState) => {
                            return [{...documentSnapshot.data(), productId: documentSnapshot.id},  ...prevState]
                        })
                })
                setIsLoading(false)
            })
            return() => subscriber()
    }

    const $renderEmptyOrdersState = () => {
        return(
            isLoading ?
                <>
                    <Text style={styles.loading}>جار التحميل</Text>
                    <ActivityIndicator color='#2C4770' size={35}/>
                </>
            :
                <Text style={styles.loading}>لا توجد منتجات متوفرة في الوقت الحالي</Text>
        )
    }

    const PremiumProductsList = () =>{
        return(
             searchInput==='' ?
                <FlatList 
                    data={filterDataByCategory(products, 'الكل', 'الفحماوي')}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    keyExtractor={item => item.productId}
                    style={styles.ProductsPremiumList}
                    renderItem={ ({item, index}) => (
                        <ProductCard item={item} key={index} view='PremiumView' currencySymbol={currencySymbol}/>
                    )}/>
            :
            null
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <ZaatarSearchBar category={category} setCategory={setCategory} setSearchInput={setSearchInput} searchInput={searchInput}/>
            <FlatList 
                data={filterDataByCategory(products, category, searchInput)}
                ListHeaderComponent={()=><PremiumProductsList/>}
                ListFooterComponent={filterDataByCategory(products,category, searchInput).length === 0 ? $renderEmptyOrdersState : null}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                keyExtractor={item => item.productId}
                style={styles.ProductsList}
                renderItem={ ({item, index}) => (
                    <ProductCard item={item} key={index} view='BodyAltraView' currencySymbol={currencySymbol}/>
                )}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#FFFFFF',
    },
    ProductsList:{
       // marginTop:0
    },
    ProductsPremiumList:{
        //height:'30%'
    },
    loading: {
        color:'#2C4770', 
        fontFamily:'Cairo-Regular', 
        fontSize: 15,
        alignSelf:'center',
        marginTop:100,
        marginBottom:5
    }
})