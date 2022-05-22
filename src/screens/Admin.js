import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native'
import AppStyles from '../styles/AppStyle'
import NavTabs from '../elements/NavTabs'
import Stores from './Stores'
import ProductCard from '../components/ProductCard'
import {GetRecordsFromDBasc} from '../firebase/Firestore'

const Admin = () => {
    const [screenName, setScreenName] = useState('Stores')
    const SwitchTab = (props) => {
        switch(props.screenName){
            case 'Stores':
                return <Stores AdminArea={true} />
            case 'Products':
                return <ProductsForAdmin AdminArea={true}/>
        }
    }
    const [products, setProducts] = useState(GetRecordsFromDBasc('products'))
    const ProductsForAdmin = () =>{
        return(
            <FlatList 
                data={products}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.productId}
                style={styles.ProductsList}
                numColumns={2}
                renderItem={ ({item, index}) => (
                    <ProductCard item={item} key={index} view='AdminView' currencySymbol={'X'}/>
                )}/>
        )
    }

    return (
        <View style={styles.container}>
            <NavTabs tabView={screenName} switchTabs={setScreenName}/>
            <SwitchTab screenName={screenName}/>
        </View>
    )}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'100%',
        backgroundColor:"#fff"
    },
    ProductsList:{
       // marginTop:0
    },
})

export default Admin