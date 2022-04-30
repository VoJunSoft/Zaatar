import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, FlatList, SafeAreaView, ActivityIndicator } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import StoreCard from '../components/StoreCard'
import SearchBar from '../components/SearchBar'

export default function Stores(props) {
    const [stores, setStores] = useState([])
    useEffect(() => {
        //get Data from users database
        fillUpStoresList()
    },[])

    //stores object fields: id, name, location, phone, picture, email
    const fillUpStoresList = () => {
        const subscriber = firestore()
            .collection('users')
            //.orderBy('date_listed', 'asc')
            .onSnapshot(querySnapshot => {
                setStores([])
                querySnapshot.forEach(documentSnapshot => {
                    setStores((prevState) => {
                        return [{...documentSnapshot.data(), id: documentSnapshot.id},  ...prevState]
                    })
                })
            })

            return() => subscriber()
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
                <Text style={styles.loading}>لم نتمكن من تحديد موقع أي متجر</Text>
        )
    }  

    return (
        <>
        <FlatList 
            data={filterDataBaseOnSearch()}
            ListFooterComponent={filterDataBaseOnSearch().length === 0 ? $renderEmptyOrdersState : null}
            showsHorizontalScrollIndicator={false}
            numColumns={2}
            keyExtractor={item => item.id}
            style={styles.StoreList}
            renderItem={ ({item, index}) => (
                <StoreCard item={item}/>
            )}/>
        <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} searchBarVisibility={true}/>
        </>
    )
}

const styles= StyleSheet.create({
    StoreList:{
       // margin:5
       alignSelf:'center',
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
