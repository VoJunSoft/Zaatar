import React, {useState, useEffect, useRef} from 'react'
import { 
    ScrollView, 
    Text, 
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import ProductCard from '../components/ProductCard'
import ZaatarSearchBar from '../components/ZaatarSearchBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import {SearchCategories} from "../scripts/CategoriesCountries.json"
import {Flags} from "../scripts/Flags.json"
import {filterDataByCategoryInLocation } from '../scripts/Search'
import LinearGradient from 'react-native-linear-gradient'
import Buttons from '../elements/Button'
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5'
import * as Animatable from 'react-native-animatable'
import LinearProgress from 'react-native-elements/dist/linearProgress/LinearProgress'
//import * as RNLocalize from "react-native-localize"
//import UserData from '../scripts/UserData'

export default function Zaatar(props) {
    //const [userInfo, setInfoUser] = useState(props.route.params)
    // userInfo state: {id, name, picture, email, phone, rule, location:{country,code,flag,currency,city}}
    //products fields: {productId, seller:{userInfo}, product_name, photos:[], descriptiom, category, price, date_listed}
    const [products, setProducts] = useState([])

    //search input and category for filtering data/products
    const [searchInput, setSearchInput] = useState("")
    const [category, setCategory] = useState('الكل')
    const [headerCategory, setHeaderCategory] = useState('')

    //get userInfo from navigation
    const [userInfo, setUserInfo] = useState(props.route.params)
    const [isLoading, setIsLoading] = useState(true)
    //state for unique locations (cities)
    const [locations, setLocation] = useState([{country:'Global', 
                                                flag: 'GLB', 
                                                cities:[]
                                            }])
    const [selectedCountry, setSelectedCountry] = useState(userInfo.location.country)
    const [selectedCity, setSelectedCity] = useState('الكل')
    const [selectedCountryIndex, setIndex] = useState(0)
    const [countriesListVisibility, setCountriesListVisibility] = useState(true)
    
    useEffect(() => {
        console.log('params ' , props.route.params)
        //TODO: get user data: country 

        //fill up products
        GetProductsByDate()
        //get category for header flatlist products randomly 
        setHeaderCategory(SearchCategories[Math.floor(Math.random() * (SearchCategories.length -2) + 1)])
    },[])

    const GetProductsByDate = () => {
        let indexCountry
        let indexCity
        setIsLoading(true)
        const subscriber = firestore()
            .collection('products')
            .orderBy('date_listed', 'asc')
            .onSnapshot(querySnapshot => {
                setProducts([])
                querySnapshot.forEach(documentSnapshot => {
                    setProducts((prevState) => {
                        return [{...documentSnapshot.data(), productId: documentSnapshot.id},  ...prevState]
                    })
                    
                    indexCountry = locations.findIndex(object => object.country === documentSnapshot.data().seller.location.country)
                    indexCity = indexCountry === -1 ? -1 : locations[indexCountry].cities.indexOf(documentSnapshot.data().seller.location.city)
                    if(indexCountry === -1)
                        locations.push({country: documentSnapshot.data().seller.location.country, flag : documentSnapshot.data().seller.location.flag, cities: ['الكل', documentSnapshot.data().seller.location.city]})
                    else if (indexCity === -1)
                        locations[indexCountry].cities.push(documentSnapshot.data().seller.location.city)

                })
                console.log('locations : ', locations)
                //if selected country (passed from APP.js) does not exist setSelectedCountryIndex to zero (Global) else get the index of the country
                setIndex(locations.findIndex(object => object.country === selectedCountry) === -1 ? 0 : locations.findIndex(object => object.country === selectedCountry))
                setSelectedCountry(locations.findIndex(object => object.country === selectedCountry) === -1 ? 'Global' : userInfo.location.country)
                setIsLoading(false)
            })
            return() => subscriber()
    }

    const $renderEmptyOrdersState = () => {
        return(
            isLoading ?
                <>
                    <Text style={styles.loading}>جار التحميل</Text>
                    <ActivityIndicator color='#2C4770' size={35}/>
                </>
            :
                <Text style={styles.loading}>لا توجد منتجات متوفرة في الوقت الحالي</Text>
        )
    }

    const CitiesBlock = () =>{
        return(
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} invertStickyHeaders={true}> 
                <FontAwesomeIcons 
                    name={countriesListVisibility !== true ? 'caret-right' : 'caret-down'}
                    size={35}
                    style={{paddingLeft:15, paddingRight:15, alignSelf:'center', color:'#2C4770'}}
                    onPress={()=>setCountriesListVisibility(!countriesListVisibility)}
                />
                { selectedCountry !== 'Global' ?
                    locations[selectedCountryIndex].cities.map((item, index)=>[ 
                        <Buttons.ButtonDefault
                            key={index}
                            titleRight={item} 
                            horizontal={true}
                            textStyle={{fontFamily: 'Cairo-Regular' ,fontSize: 14, color: '#2C4770'}}
                            containerStyle={{
                                paddingLeft : 20, 
                                paddingRight: 20, 
                                borderRightWidth:.2,
                                borderLeftWidth:.2,
                                borderColor:"#2C477040",
                                padding:5,
                                backgroundColor: selectedCity === item ? '#2C477060' : null
                            }}
                            activeOpacity={0.5}
                            onPress={()=>setSelectedCity(item)}
                            /> 
                    ])
                    :
                    <Text style={[styles.title,{padding:5, borderLeftWidth:0.5, borderColor:"#2C477040"}]}>أختار دولتك من اجل تصنيف المنتجات حسب البلد</Text>
                }
            </ScrollView>
        )
    }

    const CountriesBlock = () =>{
        return(
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} invertStickyHeaders={true}> 
                {locations.map((item, index)=>[ 
                    <Buttons.ButtonDefault
                        key={index}
                        titleRight={Flags[item.country]} 
                        horizontal={true}
                        textStyle={{fontSize: 15, color: '#2C4770', fontFamily: 'Marlboro'}}
                        containerStyle={{
                            paddingLeft : item.country === 'Israel' ? 14 : 20, 
                            paddingRight: item.country === 'Israel' ? 14 : 20,  
                            padding:5,
                            borderRightWidth: .2,
                            borderLeftWidth:.2,
                            borderColor:"#2C477040",
                            backgroundColor: selectedCountry === item.country ? '#2C477040' : null
                        }}
                        activeOpacity={0.5}
                        onPress={()=>GoGlobal(item.country)}
                        /> 
                    ])
                }
            </ScrollView>
        )
    }

    const GoGlobal = (country) => {
        setIsLoading(false)
        setSelectedCity('الكل')
        setSelectedCountry(country)
        setIndex(locations.findIndex(object => object.country === country))
    }

   
    const HeaderProductsList = () =>{
        return(
            <>
            {!isLoading ?
                <>
                        <LinearGradient 
                            colors={['#2C477080', '#ffffff', '#ffffff', '#2C477080']} style={{marginTop: 0}}>
                            <CitiesBlock />
                        </LinearGradient> 
                        
                        {countriesListVisibility ? 
                            <LinearGradient 
                                colors={['#2C477040','#ffffff','#ffffff','#ffffff', '#2C477040']} style={{marginTop: -.5}}>
                                <CountriesBlock />
                            </LinearGradient> 
                        :
                        null
                        }
                </>
            :
                 <LinearProgress color="#fac300" style={{marginTop:15, width:"96%", alignSelf:'center'}} trackColor='#2C4770' />
            }
            
             <LinearGradient 
             colors={['#ffffff' ,'#2C477030','#2C477050','#2C477030' , '#ffffff']}>
                <FlatList 
                    data={searchInput==='' && category === 'الكل' ? filterDataByCategoryInLocation(products,selectedCountry, headerCategory, '', 'الكل') : null}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    keyExtractor={item => item.productId}
                    style={styles.HeaderProductsList}
                    renderItem={ ({item, index}) => (
                        <ProductCard productInfo={item} key={index} view='Carousel'/>
                    )}/> 
            </LinearGradient>  
            </>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ZaatarSearchBar category={category} setCategory={setCategory} setSearchInput={setSearchInput} searchInput={searchInput}/>
            <FlatList 
                data={filterDataByCategoryInLocation(products,selectedCountry, category, searchInput, selectedCity)}
                ListHeaderComponent={()=><HeaderProductsList/>}
                ListFooterComponent={filterDataByCategoryInLocation(products,selectedCountry, category, searchInput, selectedCity).length === 0 ? $renderEmptyOrdersState : null}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                keyExtractor={item => item.productId}
                style={styles.ProductsList}
                renderItem={ ({item, index}) => (
                    <ProductCard productInfo={item} key={index} view='BodyAltraView'/>
                )}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#FFFFFF',
    },
    ProductsList:{

    },
    HeaderProductsList:{

    },
    loading: {
        color:'#2C4770', 
        fontFamily:'Cairo-Regular', 
        fontSize: 15,
        alignSelf:'center',
        marginTop:100,
        marginBottom:5
    },
    CityContainer:{
        backgroundColor:'#2C4770', 
        margin: 7,
        height:50,
        width:100,
        borderRadius:5,
        overflow:'hidden'
    },
    title:{
        color:'#2C4770', 
        fontFamily:'Cairo-Regular', 
        fontSize: 14,
        alignSelf:'center',
    }
})