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
import { Avatar, Input, Divider } from 'react-native-elements';
import Buttons from '../elements/Button'
import firestore from '@react-native-firebase/firestore';
import ProductCard from '../components/ProductCard'
import ZaatarSearchBar from '../components/ZaatarSearchBar';
import SearchBar from '../components/SearchBar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Zaatar({route, navigation}) {

    //products fields: productId ... {seller:{userInfo}, product_name, photos[], descriptiom, category, price, date_listed}
    // userInfo state: {id, name, first_name, picture, email, location, phone}
    const [products, setProducts] = useState([])
    useEffect( () => {
        //get Data from asyncstorage on page load and store it to userInfo
        fillProducts()
    },[])

    const fillProducts = () => {
        const subscriber = firestore()
            .collection('products')
            .orderBy('date_listed', 'asc')
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    setProducts((prevState) => {
                        return [{...documentSnapshot.data(), productId: documentSnapshot.id},  ...prevState]
                    })
                })
            })

            return () => subscriber();
    }

    const $renderEmptyOrdersState = () => {
        return(
            <Text style={{
                        color:'#fff', 
                        fontFamily:'Cairo-Bold', 
                        fontSize: 15,
                        alignSelf:'center',
                        marginTop:100
                    }}>المنتجات غير متوفرة في هذه الفئة</Text>
        )
    }

    const [searchInput, setSearchInput] = useState("")
    const [category, setCategory] = useState('الكل')
    const filterDataByCategory = (category) =>{
        if(searchInput===''){
            if(category === 'الكل')
                return products
            else
                return products.filter(item=> item.category === category)
        }else{
            if(category === 'الكل')            
                return products.filter(item=> item.category.includes(searchInput) || item.product_name.includes(searchInput) || item.seller.name.includes(searchInput))
            else
                 return products.filter(item=> (item.category.includes(searchInput) || item.product_name.includes(searchInput) || item.seller.name.includes(searchInput)) && item.category === category)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList 
                data={filterDataByCategory(category)}
                ListHeaderComponent={ <ZaatarSearchBar category={category} setCategory={setCategory} setSearchInput={setSearchInput} searchInput={searchInput}/>}
                stickyHeaderIndices={[0]}
                ListFooterComponent={filterDataByCategory(category).length === 0 ? $renderEmptyOrdersState : null}
                showsHorizontalScrollIndicator={false}
                numColumns={2}
                keyExtractor={item => item.productId}
                style={styles.ProductsList}
                renderItem={ ({item}) => (
                    // ownerId={route.params.id}
                    <ProductCard item={item} />
                )}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#2C4770'
    },
    ProductsList:{
        backgroundColor: '#2C4770',
    }
})