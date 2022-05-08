import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, FlatList, Dimensions, ActivityIndicator, ImageBackground } from 'react-native'
import { Avatar } from 'react-native-elements'
import SearchBar from '../components/SearchBar'
import Buttons from '../elements/Button'
import { handleDate } from '../scripts/Time'
import {contactUsByWhatsapp} from '../scripts/Communication'
import firestore from '@react-native-firebase/firestore'
import DropShadow from "react-native-drop-shadow"
import * as RNLocalize from "react-native-localize"
//import {getWorkShops} from '../firebase/Firestore'

export default function Workshops(props) {
    const [workshops, setWorkshops] = useState([])
    const [isLoading, setIsLoading] = useState(true) 
    // user's location
    let CountryName

    useEffect( () => {
        CountryName = userLocation()
        //get Data from workshop database
        fillUpWorkshops()
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

    //stored object fields: id, title, date_posted, from, to, location:{country, code, city}, phone, image, email, seller:{id, email, location,name,phone,picture}
    const fillUpWorkshops = () => {
        const subscriber = firestore()
            .collection('workshops')
            .orderBy('date_posted', 'asc')
            .onSnapshot(querySnapshot => {
                setWorkshops([])
                querySnapshot.forEach(documentSnapshot => {
                    if(documentSnapshot.data().location.flag === CountryName || CountryName==='ALL'){
                        setWorkshops((prevState) => {
                            return [{...documentSnapshot.data(), id: documentSnapshot.id},  ...prevState]
                        })
                    }
                })
                setIsLoading(false)
            })

            return() => subscriber()
    }

    //TODO based on seller id get seller info

    const [searchInput, setSearchInput] = useState("")
    const filterDataBaseOnSearch = () =>{
        if(searchInput==='')
                return workshops
            else
                return workshops.filter(item=>  item.title.includes(searchInput) || 
                                                item.location.city.includes(searchInput) || 
                                                item.seller.name.includes(searchInput)
                                        )
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
                <Text style={styles.loading}>لا توجد بيانات متاحة</Text>
            }
            </>
        )
    }

    //TODO remove this once workshop editor is ready
    const [userMsg, setUserMsg] = useState('')
    const WorkShopCard = (props) => {
        return(
            <>
            <View style={styles.card}>
                <View style={styles.bodyCard}>
                    <View style={{flexDirection:'row', justifyContent:'center'}}>
                        <Text style={styles.text}>{props.item.title}</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <Buttons.ButtonDefault 
                            titleLeft={props.item.seller.phone}
                            iconName='whats'
                            iconSize={27}
                            containerStyle={{justifyContent:'center'}}
                            textStyle={styles.text}
                            onPress={()=>contactUsByWhatsapp(props.item.title, props.item.seller.phone)} />
                        <Text style={styles.text}>{props.item.seller.name}</Text>
                    </View>
                </View>
                <View style={styles.headerCard}>
                    <Avatar
                        size={60}
                        rounded
                        source={{uri: props.item.seller.picture}}
                        icon={{ name: 'user', type: 'font-awesome', color: '#2C4770' }}
                        containerStyle={{ backgroundColor: '#fff', margin: 2}}/>
                </View>
            </View>
            <View style={styles.imgBlock}>
                <Image style={styles.img} source={{uri: props.item.image}}/>
                <Text style={styles.tempStyle}>{userMsg}</Text>
            </View>

            </>
        )
    }

    const WorkShopCard2 = (props) => {
        return(
            <DropShadow style={styles.dropShadow}>
            <View style={styles.workshopBlock}>
                <ImageBackground style={styles.imgAlpha} source={{uri: props.item.image}}>
                <View style={styles.workshopHeader}>
                    <Text style={styles.title}>{handleDate(props.item.date_posted.seconds)}</Text>
                    <Text style={styles.title}>{props.item.seller.name}</Text>
                    <Avatar
                        size={50}
                        rounded
                        source={props.item.seller.picture ? {uri: props.item.seller.picture} : require('../assets/gallary/p1.png')}
                        icon={{ name: 'user', type: 'font-awesome', color: '#2C4770' }}
                        containerStyle={{backgroundColor:'#fff', margin: 3}}/>
                </View>
                </ImageBackground>
                {userMsg !== '' ?
                    <Text style={[styles.tempStyle,{backgroundColor:'rgba(255,255,255,0.5)'}]}>{userMsg}</Text>
                    : 
                    null
                }
            </View>
            </DropShadow>
        )
    }

    return (
        <>
            <FlatList 
                data={filterDataBaseOnSearch()}
                ListFooterComponent={filterDataBaseOnSearch().length === 0 ? $renderEmptyOrdersState : null}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                style={styles.StoreList}
                renderItem={ ({item, index}) => (
                    <WorkShopCard2 item={item} />
                )}/>
            <View style={{flexDirection:'row', alignItems:'baseline', justifyContent:'center'}}>
                <View style={{width:'75%'}}>
                    <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} searchBarVisibility={true} hideSearchIcon={true}/>
                </View>
                <Buttons.ButtonWithShadow 
                    iconName='add' 
                    iconSize={25} 
                    onPress={()=>setUserMsg('إضافة ورشة عمل ستكون متاحة قريبا')} 
                    containerStyle={styles.icon}/>
            </View>
        </>
       
    )
}

const styles= StyleSheet.create({
    StoreList:{
       //alignSelf:'center',
    },
    loading: {
        color:'#2C4770', 
        fontFamily:'Cairo-Bold', 
        fontSize: 15,
        alignSelf:'center',
        marginTop:100,
        marginBottom:5
    },
    card:{
        marginTop:15,
        flexDirection:'row',
        //borderRadius:8,
        //overflow:'hidden',
        alignSelf:'center',
    },
    headerCard:{
        width:'20%',
        backgroundColor:'#BBED5E', 
        alignItems:'center',
        padding: 5,
        borderLeftWidth:0.2
    },
    bodyCard:{
        width:'70%',
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,0.2)', 
    },
    text:{
        color:'#2C4770', 
        marginRight: 5,
        fontFamily:'Cairo-Regular',
    },
    textInfo:{
        color:'#2C4770', 
        margin: 5,
        fontFamily:'Cairo-Regular',
        textAlign:'center'
    },
    img:{
        width:'90%',
        height:Dimensions.get('window').height/1.5,
        alignSelf:'center',
        resizeMode:'contain',
    },
    imgBlock:{
        alignSelf:'center',
        width:'100%',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        overflow:'hidden'
    },
    icon:{
        backgroundColor:'#2C4970',
        borderRadius: 50,
        padding:2
    },
    tempStyle: {
        color:'red', 
        fontFamily:'Cairo-Bold', 
        fontSize: 12,
        alignSelf:'center',
        marginTop:10,
        marginBottom:5,
        padding:5
    },
    workshopBlock:{
        //flex:1,
        width:'100%',
        padding: 12,
        //backgroundColor:'yellow'
    },
    workshopHeader:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#2C4970',
        alignItems:'center',
        padding: 3
    },
    imgAlpha:{
        width:'100%',
        height:Dimensions.get('window').height - 140,
        borderRadius:10,
        overflow:'hidden'
    },
    title:{
        color:'#fff', 
        fontFamily:'Cairo-Regular',
        fontSize:15
    },
    dropShadow:{
        shadowColor: '#323232',
        shadowOffset: {width: -7, height: 7},
        shadowOpacity: 0.7,
        shadowRadius: 0.5,
    },
})

