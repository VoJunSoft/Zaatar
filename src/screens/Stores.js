import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, FlatList, SafeAreaView, ActivityIndicator } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import StoreCard from '../components/StoreCard'
import SearchBar from '../components/SearchBar'
//import * as RNLocalize from "react-native-localize"

export default function Stores(props) {
    const [countryName, setCountryName] = useState(props.route.params.location.country ? props.route.params.location.country : 'Israel')
    const [stores, setStores] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        //get Data from users database
        //TODO get stores based on location if use is not logged in 
        fillUpStoresList()
        console.log('Stores : ', props.route.params)
    },[])

    //stores object fields: id, name, location, phone, picture, email
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

    const [searchInput, setSearchInput] = useState("")
    const filterDataBaseOnSearch = () =>{
        if(searchInput==='')
                return stores
            else
                return stores.filter(item=> item.name.includes(searchInput) || item.location.city.includes(searchInput))
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
                <Text style={styles.loading}>لم نتمكن من تحديد موقع أي متجر</Text>
            }
            </>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList 
                data={filterDataBaseOnSearch()}
                //ListHeaderComponent={<SearchBar setSearchInput={setSearchInput} searchInput={searchInput} searchBarVisibility={true}/>}
                ListFooterComponent={filterDataBaseOnSearch().length === 0 ? $renderEmptyOrdersState : null}
                showsHorizontalScrollIndicator={false}
                numColumns={2}
                keyExtractor={item => item.id}
                style={styles.StoreList}
                renderItem={ ({item, index}) => (
                    <StoreCard item={item}/>
                )}/>
            <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} searchBarVisibility={true}/>
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
