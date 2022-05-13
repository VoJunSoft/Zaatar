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
import * as RNLocalize from "react-native-localize"
import {currencySymbols} from "../scripts/CurrencySymbols.json"

export default function Zaatar(props) {
    //products fields: productId ... {seller:{userInfo}, product_name, photos[], descriptiom, category, price, date_listed}
    // userInfo state: {id, name, first_name, picture, email, location, phone}
    const [products, setProducts] = useState([])
    const [productsPremium, setProductsPremium] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    //const [userInfo, setInfoUser] = useState(props.route.params)
    let CountryName
    //get location currency
    const [currencyAlphabet, setCurrencyAlphabet] = useState('')
    useEffect(() => {
        //get user location
        CountryName = userLocation()
        //get Data from asyncstorage on page load and store it to userInfo
        GetProductsByDate()
    },[])

    
    // get userLocation & currency
    const userLocation = () =>{
        try{    
            //get country name from navigation params: userInfo
            //set currency symbol based on country flag (2-alphabets) NOTE currency symbol is based on on 3-alphabets
            setCurrencyAlphabet(currencySymbols[props.route.params.location.flag])
            console.log('PARAMS :', props.route.params, currencyAlphabet)
            return props.route.params.location.flag
        }catch(e){
            //in case of error return
            //get location using react-native-localize
            //set currency symbol based on country flag 
            setCurrencyAlphabet(currencySymbols[RNLocalize.getCountry()])
            console.log('LOCALIZE :',RNLocalize.getCountry(), currencyAlphabet)
            return RNLocalize.getCountry() ? RNLocalize.getCountry() : 'ALL'
        }   
    }

    const GetProductsByDate = () => {
        //This way we retrieve all products of all of the stores within the area.
        const subscriber = firestore()
            .collection('products')
            .orderBy('date_listed', 'asc')
            .onSnapshot(querySnapshot => {
                setProducts([])
                setProductsPremium([])
                querySnapshot.forEach(documentSnapshot => {
                    //TODO get stores within location (instead of products within location) and display their products
                    //retrieve users' IDs within the same location [stores] and retrieve every product that has a matching seller.id 
                    if(documentSnapshot.data().seller.location.flag === CountryName || CountryName==='ALL'){
                        setProducts((prevState) => {
                            return [{...documentSnapshot.data(), productId: documentSnapshot.id},  ...prevState]
                        })
                    }
                    //TODO get premiium stores within location (instead of products within location) and display their products
                    if(documentSnapshot.data().seller.email === 'elfahmawi@yahoo.com'){
                        setProductsPremium((prevState) => {
                            return [{...documentSnapshot.data(), productId: documentSnapshot.id},  ...prevState]
                        })
                    }
                })
                setIsLoading(false)
            })

            return() => subscriber()
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
                    <Text style={styles.loading}>لا توجد منتجات متوفرة في الوقت الحالي</Text>
            }
            </>
        )
    }

    const [searchInput, setSearchInput] = useState("")
    const [category, setCategory] = useState('الكل')
    const filterDataByCategory = (data, category) =>{
        //TODO add search by location: item.seller.location.includes(searchInput)
        if(searchInput===''){
            if(category === 'الكل')
                return data
            else
                return data.filter(item=> item.category === category)
        }else{
            if(category === 'الكل')            
                return data.filter(item=> item.category.includes(searchInput) || item.product_name.includes(searchInput) || item.seller.name.includes(searchInput)) 
            else
                 return data.filter(item=> (item.category.includes(searchInput) || item.product_name.includes(searchInput) || item.seller.name.includes(searchInput)) && item.category === category)
        }
    }
    const PremiumProductsList = () =>{
        return(
            category === 'الكل' && searchInput==='' ?
                <FlatList 
                    data={productsPremium}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    keyExtractor={item => item.productId}
                    style={styles.ProductsPremiumList}
                    renderItem={ ({item, index}) => (
                        <ProductCard item={item} key={index} view='PremiumView' currencySymbol={currencyAlphabet}/>
                    )}/>
            :
            null
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <ZaatarSearchBar category={category} setCategory={setCategory} setSearchInput={setSearchInput} searchInput={searchInput}/>
            <FlatList 
                data={filterDataByCategory(products, category)}
                ListHeaderComponent={()=><PremiumProductsList/>}
                ListFooterComponent={filterDataByCategory(products,category).length === 0 ? $renderEmptyOrdersState : null}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                keyExtractor={item => item.productId}
                style={styles.ProductsList}
                renderItem={ ({item, index}) => (
                    <ProductCard item={item} key={index} view='BodyView' currencySymbol={currencyAlphabet}/>
                )}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        //backgroundColor: '#FEEBDA'
    },
    ProductsList:{
       // marginTop:0
    },
    ProductsPremiumList:{
        //height:'30%'
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