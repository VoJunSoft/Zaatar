import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, FlatList, SafeAreaView, ActivityIndicator } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import StoreCard from './StoreCard'
import SearchBar from './SearchBar'

export default function Stores(props) {
    const [stores, setStores] = useState([])
    useEffect( () => {
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
                return stores.filter(item=> item.name.includes(searchInput) || item.location.includes(searchInput))
    }

    const $renderEmptyOrdersState = () => {
        return(
            <>
            {stores.length === 0 ?
                <>
                    <Text style={styles.loading}>جار التحميل</Text>
                    <ActivityIndicator color='#2C4770' size={35}/>
                </>
            :
                    <Text style={styles.loading}>لم نتمكن من تحديد موقع أي متجر في هذه الأثناء. الرجاء معاودة المحاولة في وقت لاحق.</Text>
            }
            </>
        )
    }

    return (
        <FlatList 
            data={filterDataBaseOnSearch()}
            ListHeaderComponent={<SearchBar setSearchInput={setSearchInput} searchInput={searchInput} serachBarVisibility={false}/>}
            //stickyHeaderIndices={[0]}
            ListFooterComponent={stores.length === 0 ? $renderEmptyOrdersState : null}
            showsHorizontalScrollIndicator={false}
            numColumns={2}
            keyExtractor={item => item.id}
            style={styles.StoreList}
            renderItem={ ({item, index}) => (
                <StoreCard item={item} key={index}/>
            )}/>
       
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
