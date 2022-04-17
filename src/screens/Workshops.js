import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { Avatar } from 'react-native-elements'
import SearchBar from '../components/SearchBar'
import Buttons from '../elements/Button'
import { handleDate } from '../scripts/Time'

export default function Workshops(props) {
    const [workshops, setWorkshops] = useState([])
    useEffect( () => {
        //get Data from users database
        fillUpWorkshop()
    },[])

    //stores object fields: id, name, location, phone, picture, email
    const fillUpWorkshop = () => {
        const subscriber = firestore()
            .collection('products')
            //.orderBy('date_listed', 'asc')
            .onSnapshot(querySnapshot => {
                setWorkshops([])
                querySnapshot.forEach(documentSnapshot => {
                    if(documentSnapshot.data().category === 'ورش عمل')
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
                    <Text style={styles.text}>{props.item.product_name}</Text>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={styles.text}>{handleDate(props.item.date_listed.seconds)}</Text>
                        <Text style={styles.text}>{props.item.seller.name}</Text>
                    </View>
                    {/* <Buttons.ButtonDefault 
                        titleLeft={props.item.seller.location}
                        iconName='location'
                        iconSize={27}
                        containerStyle={{justifyContent:'flex-end'}}
                        textStyle={styles.text}
                        disabled /> */}
                </View>
                <View style={styles.headerCard}>
                    <Avatar
                        size={60}
                        rounded
                        source={{uri: props.item.seller.picture}}
                        icon={{ name: 'user', type: 'font-awesome', color: '#2C4770' }}
                        containerStyle={{ backgroundColor: '#fff', margin: 5}}/>
                </View>
            </View>
            <View style={styles.imgBlock}>
                <Image style={styles.img} source={{uri: props.item.photos[2]}}/>
                <Text style={styles.textInfo}>{props.item.description}</Text>
                <Buttons.ButtonDefault 
                        titleLeft={props.item.seller.phone}
                        iconName='whats'
                        iconSize={27}
                        containerStyle={{justifyContent:'center'}}
                        textStyle={styles.text}
                        disabled />
            </View>
            </>
        )
    }

    return (
        <FlatList 
            data={filterDataBaseOnSearch()}
            ListFooterComponent={workshops.length === 0 ? $renderEmptyOrdersState : null}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            style={styles.StoreList}
            renderItem={ ({item, index}) => (
                <WorkShopCard item={item} key={index}/>
            )}/>
       
    )
}

const styles= StyleSheet.create({
    StoreList:{
       alignSelf:'center',
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
        borderTopLeftRadius:10,
        overflow:'hidden',
        alignSelf:'center',
    },
    headerCard:{
        width:'25%',
        backgroundColor:'rgba(0,0,0,0.2)',
        alignItems:'center',
        padding: 5,
        borderTopRightRadius:10,
        borderLeftWidth:0.1
    },
    bodyCard:{
        width:'72%',
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,0.2)', 
        padding: 5,
    },
    text:{
        color:'#2C4770', 
        marginRight: 10,
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
        height:Dimensions.get('window').height/1.7,
        alignSelf:'center',
        //borderBottomLeftRadius:10,
        //borderBottomRightRadius:10,
        resizeMode:'cover'
    },
    imgBlock:{
        alignSelf:'center',
        width:'97%',
        backgroundColor:'rgba(0,0,0,0.2)', 
        //paddingLeft:7,
        //paddingRight:7,
        paddingBottom:10,
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
    }
})

