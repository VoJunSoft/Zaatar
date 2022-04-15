import React, {useState, useEffect} from 'react'
import { 
    View, 
    Text, 
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native'
import firestore from '@react-native-firebase/firestore';
import ProductCard from '../components/ProductCard'
import ZaatarSearchBar from '../components/ZaatarSearchBar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Zaatar() {

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
                setProducts([])
                querySnapshot.forEach(documentSnapshot => {
                    setProducts((prevState) => {
                        return [{...documentSnapshot.data(), productId: documentSnapshot.id},  ...prevState]
                    })
                })
            })

            return() => subscriber()
    }

    const $renderEmptyOrdersState = () => {
        return(
            <>
            {products.length === 0 ?
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
    const filterDataByCategory = (category) =>{
        //TODO add search by location: item.seller.location.includes(searchInput)
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
                showsVerticalScrollIndicator={false}
                numColumns={2}
                keyExtractor={item => item.productId}
                style={styles.ProductsList}
                renderItem={ ({item, index}) => (
                    <ProductCard item={item} key={index}/>
                )}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        //backgroundColor: '#2C4770'
    },
    ProductsList:{

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