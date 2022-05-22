import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, FlatList, SafeAreaView, ActivityIndicator } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import StoreCard from '../components/StoreCard'
import SearchBar from '../components/SearchBar'
import {filterStoresBaseOnSearch} from '../scripts/Search'
//import * as RNLocalize from "react-native-localize"

export default function Stores(props) {
    // const [countryName, setCountryName] = useState(props.route.params.location.country ? props.route.params.location.country : 'Israel')
    const [stores, setStores] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchInput, setSearchInput] = useState("")

    useEffect(() => {
        //get Data from users database
        //TODO get stores based on location if user is not logged in 
        fillUpStoresList()
    },[])

    //stores object fields: id, name, location:{}, phone, picture, email
    const fillUpStoresList = () => {
        const subscriber = firestore()
            .collection('users')
            //.where('location.country', "==", countryName)
            .onSnapshot(querySnapshot => {
                setStores([])
                querySnapshot.forEach(documentSnapshot => {
                        setStores((prevState) => {
                            return [{...documentSnapshot.data(), id: documentSnapshot.id},  ...prevState]
                        })
                })
                setIsLoading(false)
            })
            return() => subscriber
    }

    const $renderEmptyOrdersState = () => { 
        return(
            isLoading ?
                <>
                    <Text style={styles.loading}>جار التحميل</Text>
                    <ActivityIndicator color='#2C4770' size={35}/>
                </>
            :
                <Text style={styles.loading}>لم نتمكن من تحديد موقع أي متجر</Text>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList 
                data={filterStoresBaseOnSearch(stores, searchInput)}
                ListFooterComponent={filterStoresBaseOnSearch(stores, searchInput).length === 0 ? $renderEmptyOrdersState : null}
                showsHorizontalScrollIndicator={false}
                numColumns={2}
                keyExtractor={item => item.id}
                style={styles.StoreList}
                renderItem={ ({item, index}) => (
                    <StoreCard item={item}/>
                )}/>
            {!props.AdminArea ? 
                <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} searchBarVisibility={true}/>
                :
                null
            }
        </SafeAreaView>
    )
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#FFFFFF',
    },
    StoreList:{
       // margin:5
       alignSelf:'center',
       backgroundColor: '#FFFFFF',
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
