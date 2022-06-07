import React, {useState, useEffect} from 'react'
import { ScrollView, Text, StyleSheet, Image, FlatList, SafeAreaView, ActivityIndicator } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import StoreCard from '../components/StoreCard'
import SearchBar from '../components/SearchBar'
import {filterStoresBaseOnSearch} from '../scripts/Search'
import Buttons from '../elements/Button'
import {Flags} from "../scripts/Flags.json"
import LinearGradient from 'react-native-linear-gradient'
//import * as RNLocalize from "react-native-localize"
import { Overlay } from 'react-native-elements';

export default function Stores(props) {
    // const [countryName, setCountryName] = useState(props.route.params.location.country ? props.route.params.location.country : 'Israel')
    const [stores, setStores] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchInput, setSearchInput] = useState("")
    const [selectedCountry, setSelectedCountry] = useState('Global')
    const [countries, setCountries] = useState(['Global'])

    useEffect(() => {
        //get Data from users database
        //TODO get stores based on location if user is not logged in 
        fillUpStoresList()
    },[])

    //stores object fields: id, name, location:{}, phone, picture, email
    const fillUpStoresList = () => {
        let indexOfcountry
        const subscriber = firestore()
            .collection('users')
            //.where('location.country', "==", countryName)
            .onSnapshot(querySnapshot => {
                setStores([])
                querySnapshot.forEach(documentSnapshot => {
                        setStores((prevState) => {
                            return [{...documentSnapshot.data(), id: documentSnapshot.id},  ...prevState]
                        })
                        indexOfcountry = countries.indexOf(documentSnapshot.data().location.country)
                        if(indexOfcountry === -1)
                            countries.push(documentSnapshot.data().location.country)
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

    const CountriesBlock = () =>{
        return(
            <ScrollView horizontal={true} style={{ }} showsHorizontalScrollIndicator={false} invertStickyHeaders={true}> 
                {countries.map((item, index)=>[ 
                    <Buttons.ButtonDefault
                        key={index}
                        titleRight={`${Flags[item]} ${filterStoresBaseOnSearch(stores, item, '').length}`} 
                        horizontal={true}
                        textStyle={{fontSize: 15, color:'#2C4770'}}
                        containerStyle={{
                            paddingLeft : 20, 
                            paddingRight: 20, 
                            padding:5,
                            borderRightWidth: .2,
                            borderLeftWidth:.2,
                            borderColor:"#2C477040",
                            Overflow:'visible',
                            backgroundColor: selectedCountry === item ? '#2C477040' : null
                        }}
                        activeOpacity={0.5}
                        onPress={()=>setSelectedCountry(item)}
                        /> 
                    ])
                }
            </ScrollView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient 
                    colors={['#2C477090', '#ffffff', '#ffffff', '#2C477090']} style={{marginTop: 0}}>
                <CountriesBlock />
            </LinearGradient>
            <FlatList 
                data={filterStoresBaseOnSearch(stores, selectedCountry, searchInput)}
                ListFooterComponent={filterStoresBaseOnSearch(stores,selectedCountry, searchInput).length === 0 ? $renderEmptyOrdersState : null}
                showsHorizontalScrollIndicator={false}
                numColumns={2}
                keyExtractor={item => item.id}
                style={styles.StoreList}
                renderItem={ ({item, index}) => (
                    <StoreCard StoreInfo={item}/>
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
