import React, {useState, useEffect} from 'react'
import { 
    ScrollView, 
    Text, 
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Dimensions
} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import ProductCard from '../components/ProductCard'
import ZaatarSearchBar from '../components/ZaatarSearchBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import {currencySymbols, SearchCategories} from "../scripts/DataValues.json"
import { filterDataByCategory, filterDataByCategoryInLocation } from '../scripts/Search'
import LinearGradient from 'react-native-linear-gradient'
import Buttons from '../elements/Button'
import {Picker} from '@react-native-picker/picker'
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5'
//import * as RNLocalize from "react-native-localize"
//import UserData from '../scripts/UserData'

export default function Zaatar(props) {
    //const [userInfo, setInfoUser] = useState(props.route.params)
    // userInfo state: {id, name, picture, email, phone, rule, location:{country,code,flag,currency,city}}
    //products fields: {productId, seller:{userInfo}, product_name, photos:[], descriptiom, category, price, date_listed}
    const [products, setProducts] = useState([])
    const [productsByCountry, setProductsByCountry] = useState([])

    //search input and category for filtering data/products
    const [searchInput, setSearchInput] = useState("")
    const [category, setCategory] = useState('الكل')
    const [headerCategory, setHeaderCategory] = useState('')

    //get userInfo from navigation
    const [userInfo, setUserInfo] = useState(props.route.params)
    const [isLoading, setIsLoading] = useState(true)
    //state for unique locations (cities)
    const [locations, setLocation] = useState([{country:'Global', flag: 'GLB', cities:[]}])
    const [selectedCountry, setSelectedCountry] = useState(userInfo.location.country)
    const [selectedCity, setSelectedCity] = useState('الكل')
    const [selectedCountryIndex, setIndex] = useState(0)

    useEffect(() => {
        console.log('params ' , props.route.params)
        //fill up products
        GetProductsByDate()
        //get category for header flatlist products randomly 
        setHeaderCategory(SearchCategories[Math.floor(Math.random() * (SearchCategories.length -1))])
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
                //retrieve country name based on selectedCountryIndex
                //setSelectedCountry(locations[selectedCountryIndex].country)
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

    const GoGlobal = () => {
        setIsLoading(false)
        setSelectedCity('الكل')
        setSelectedCountry(selectedCountry === 'Global' ? userInfo.location.country : 'Global')
        //setIndex(locations.findIndex(object => object.country === selectedCountry))
    }

    const LocationBlock = () =>{
        return(
            <ScrollView horizontal={true} style={{ height:35}} showsHorizontalScrollIndicator={false} invertStickyHeaders={true}> 
                <FontAwesomeIcons 
                    name={selectedCountry === 'Global' ? 'arrow-circle-left' : 'map'}
                    size={22}
                    style={{paddingLeft:10, paddingRight:12, alignSelf:'center', color:'#2C4770'}}
                    onPress={()=>GoGlobal()}
                />
                {/* <Picker
                    selectedValue={locations[selectedCountryIndex].country}
                    style={{width:110, height:30, alignSelf:'center', alignItems:'center', alignContent:'center'}}
                    onValueChange={(itemValue, itemIndex) => dropDownValueChange(itemValue)}>
                    {
                        locations.map((item, index)=>[ 
                                <Picker.Item label={index === 0 ? `${currencySymbols['GLB']}` : `${currencySymbols[item.flag]}`} 
                                             value={item.country} 
                                             key={index} />
                        ])
                    }
                </Picker> */}
                { !isLoading ?
                    selectedCountry !== 'Global' ?
                        locations[selectedCountryIndex].cities.map((item, index)=>[ 
                            <Buttons.ButtonDefault
                                key={index}
                                titleRight={item} 
                                horizontal={true}
                                textStyle={{
                                    fontFamily: 'Cairo-Regular' ,
                                    fontSize: 13, 
                                    color: '#2C4770'
                                }}
                                containerStyle={{
                                    paddingLeft : 20, 
                                    paddingRight: 20, 
                                    borderRightWidth:index === 0 ? 0 : .2,
                                    borderLeftWidth:.2,
                                    backgroundColor: selectedCity === item ? '#2C477060' : null
                                }}
                                activeOpacity={0.5}
                                onPress={()=>setSelectedCity(item)}
                                /> 
                        ])
                        :
                        <Text style={styles.title}>ارجع لدولتك من اجل تصنيف المنتجات حسب البلد</Text>
                    :
                    <ActivityIndicator color='#2C4770' size={25} style={{marginLeft: Dimensions.get('window').width/3.1}}/>
                }
            </ScrollView>
        )
    }

    const HeaderProductsList = () =>{
        return(
            <>
            <LinearGradient 
                colors={['#2C477090', '#ffffff', '#2C477090']} style={{marginTop: .5}}>
                 <LocationBlock />
            </LinearGradient> 
             <LinearGradient 
             colors={['#ffffff' ,'#2C477030','#2C477050','#2C477030' , '#ffffff']}>
                <FlatList 
                    data={searchInput==='' && category === 'الكل' ? filterDataByCategory(products, 'الكل', headerCategory) : null}
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
        fontSize: 13,
        alignSelf:'center',
        marginLeft: 15
    }
})