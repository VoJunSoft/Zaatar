import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native'
import AppStyles from '../styles/AppStyle'
import NavTabs from '../elements/NavTabs'
import Stores from './Stores'
import ProductCard from '../components/ProductCard'
import firestore from '@react-native-firebase/firestore'
//import {GetRecordsFromDBasc} from '../firebase/Firestore'

const Admin = () => {
    const [screenName, setScreenName] = useState('Products')
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true) 

    //TODO : Call this method from external firestore file OR global state
    useEffect(()=>{fillUpStoresList()},[])
    const fillUpStoresList = () => {
        const subscriber = firestore().collection('products').orderBy('date_listed', 'asc').onSnapshot(querySnapshot => {
            setProducts([])
                querySnapshot.forEach(documentSnapshot => {
                    setProducts((prevState) => {
                            return [{...documentSnapshot.data(), id: documentSnapshot.id},  ...prevState]
                        })
                })
                setIsLoading(false)
            })
            return() => subscriber
    }

    const SwitchTab = () => {
        switch(screenName){
            case 'Stores':
                return <Stores AdminArea={true} />
            case 'Products':
                return <ProductsForAdmin />
        }
    }
    const ProductsForAdmin = () =>{
        return(
            <FlatList 
                data={products}
                ListFooterComponent={products.length === 0 ? <ActivityIndicator color='#2C4770' size={35} style={{marginTop:50}}/> : null}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                style={styles.ProductsList}
                renderItem={ ({item, index}) => (
                    <ProductCard productInfo={item} key={index} view='AdminView' deleteButtonVisibility={true} />
                )}/>
        )
    }

    return (
        <View style={styles.container}>
            <NavTabs tabView={screenName} switchTabs={setScreenName}/>
            <SwitchTab />
        </View>
    )}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'100%',
        backgroundColor:"#fff"
    },
    ProductsList:{
        width:'100%',
    },
})

export default Admin