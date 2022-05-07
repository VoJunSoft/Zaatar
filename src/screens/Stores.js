import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, FlatList, SafeAreaView, ActivityIndicator } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import StoreCard from '../components/StoreCard'
import SearchBar from '../components/SearchBar'
import * as RNLocalize from "react-native-localize"

export default function Stores(props) {
    const [stores, setStores] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    // user's location
    let CountryName

    useEffect(() => {
        CountryName = userLocation()
        //get Data from users database
        fillUpStoresList()
    },[])

    // get userLocation
    const userLocation = () =>{
        try{    
            //get country name from navigation params
            console.log('PARAMS :', props.route.params)
            return props.route.params.location.flag
        }catch(e){
            //in case of error return
            //get location using react-native-localize
            console.log('LOCALIZE :',RNLocalize.getCountry())
            return RNLocalize.getCountry() ? RNLocalize.getCountry() : 'ALL'
        }   
    }

    //stores object fields: id, name, location, phone, picture, email
    const fillUpStoresList = () => {
        const subscriber = firestore()
            .collection('users')
            //.orderBy('date_listed', 'asc')
            .onSnapshot(querySnapshot => {
                setStores([])
                querySnapshot.forEach(documentSnapshot => {
                    if(documentSnapshot.data().location.flag === CountryName || CountryName==='ALL'){
                        setStores((prevState) => {
                            return [{...documentSnapshot.data(), id: documentSnapshot.id},  ...prevState]
                        })
                    }
                })
                setIsLoading(false)
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
       //backgroundColor:'#FEEBDA'
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
