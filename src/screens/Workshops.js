import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native'
import { Avatar } from 'react-native-elements'
import SearchBar from '../components/SearchBar'
import Buttons from '../elements/Button'
import { handleDate } from '../scripts/Time'
import {contactUsByWhatsapp} from '../scripts/Communication'
import firestore from '@react-native-firebase/firestore'
//import {GetProductsByDate} from '../firebase/Firestore'

export default function Workshops(props) {
    const [workshops, setWorkshops] = useState([])
    useEffect( () => {
        //get Data from workshop database
        fillUpWorkshops()
    },[])

    //stored object fields: id, title, date_posted, from, to, location, phone, image, email, seller:{id, email, location,name,phone,picture}
    // TODO add registration form
    const fillUpWorkshops = () => {
        const subscriber = firestore()
            .collection('workshops')
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

    //TODO based on seller id get seller info

    const [searchInput, setSearchInput] = useState("")
    const filterDataBaseOnSearch = () =>{
        if(searchInput==='')
                return workshops
            else
                return workshops.filter(item=> item.title.includes(searchInput) || item.location.includes(searchInput))
    }

    const $renderEmptyOrdersState = () => {
        return(
            <>
                <Text style={styles.loading}>جار التحميل</Text>
                <ActivityIndicator color='#2C4770' size={35}/>
            </>
        )
    }

    const WorkShopCard = (props) => {
        return(
            <>
            <View style={styles.card}>
                <View style={styles.bodyCard}>
                    <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                        {/* <Text style={styles.text}>{handleDate(props.item.date_posted.seconds)}</Text> */}
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
            </View>
            </>
        )
    }

       const WorkShopCardAlpha = (props) => {
        return(
            <View style={{width: '100%', flexDirection:'row', justifyContent:'space-around', marginTop:15}}>
                <View style={{  width:'80%',
                                height:Dimensions.get('window').height/1.3,
                                borderRadius:10,
                                }}>
                    <Image style={{ //backgroundColor:'rgba(0,0,0,0.3)', 
                                    width:'100%', 
                                    height:'100%',
                                    borderRadius:20,
                                    marginTop:0,
                                    resizeMode:'contain',
                                }} source={{uri: props.item.image}}/>
                </View>

                <View style={{width:'17%'}}>
                    <Avatar
                        size={65}
                        rounded
                        source={{uri: props.item.seller.picture}}
                        icon={{ name: 'user', type: 'font-awesome', color: '#2C4770' }}
                        containerStyle={{ backgroundColor: '#fff', alignSelf:'center'}}/>
                </View>
            </View>
        )
    }

    return (
        <FlatList 
            data={filterDataBaseOnSearch()}
            ListFooterComponent={workshops.length === 0 ? $renderEmptyOrdersState : null}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            style={styles.StoreList}
            renderItem={ ({item, index}) => (
                <WorkShopCard item={item} key={index}/>
            )}/>
       
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
        overflow:'hidden',
        alignSelf:'flex-end',
    },
    headerCard:{
        width:'23%',
        backgroundColor:'#2C4770',
        alignItems:'center',
        padding: 5,
        borderLeftWidth:0.2
    },
    bodyCard:{
        width:'71%',
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,0.3)', 
        // /padding: 5,
        borderTopLeftRadius:15,
        borderBottomLeftRadius:15,
    },
    text:{
        color:'#2C4770', 
        marginRight: 5,
        fontFamily:'Cairo-Regular'
    },
    textInfo:{
        color:'#2C4770', 
        margin: 5,
        fontFamily:'Cairo-Regular',
        textAlign:'center'
    },
    img:{
        width:'100%',
        height:Dimensions.get('window').height/1.3,
        alignSelf:'center',
        borderRadius:10,
        resizeMode:'contain',
        marginTop:5
    },
    imgBlock:{
        alignSelf:'center',
        width:'97%',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        overflow:'hidden'
    }
})

