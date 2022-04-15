import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, FlatList, SafeAreaView, ActivityIndicator } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import StoreCard from './StoreCard'
import SearchBar from './SearchBar'

export default function Workshops(props) {
    const [workshops, setWorkshops] = useState([])
    useEffect( () => {
        //get Data from users database
        //fillUpWorkshop()
    },[])

    //stores object fields: id, name, location, phone, picture, email
    const fillUpWorkshop = () => {
        const subscriber = firestore()
            .collection('users')
            //.orderBy('date_listed', 'asc')
            .onSnapshot(querySnapshot => {
                setWorkshops([])
                querySnapshot.forEach(documentSnapshot => {
                    setWorkshops((prevState) => {
                        return [{...documentSnapshot.data(), id: documentSnapshot.id},  ...prevState]
                    })
                })
            })

            return() => subscriber()
    }

    const [searchInput, setSearchInput] = useState("")
    const filterDataBaseOnSearch = () =>{
        if(searchInput==='')
                return workshops
            else
                return workshops.filter(item=> item.name.includes(searchInput) || item.location.includes(searchInput))
    }

    const $renderEmptyOrdersState = () => {
        return(
            <>
            {workshops.length === 0 ?
                <>
                    <Text style={styles.loading}>جار التحميل</Text>
                    <ActivityIndicator color='#2C4770' size={35}/>
                </>
            :
                <Image style={styles.robot} source={require('../assets/gallary/workshops.png')} />
            }
            </>
        )
    }

    return (
        <FlatList 
            data={workshops}
            //ListHeaderComponent={<SearchBar setSearchInput={setSearchInput} searchInput={searchInput}/>}
            //stickyHeaderIndices={[0]}
            ListFooterComponent={workshops.length === 0 ? $renderEmptyOrdersState : null}
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
    robots:{
        height:300,
        width:'70%'
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

