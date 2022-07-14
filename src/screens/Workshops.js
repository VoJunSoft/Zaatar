import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, FlatList, Dimensions, ActivityIndicator, ImageBackground } from 'react-native'
//import SearchBar from '../components/SearchBar'
//import {filterWorkshopsBaseOnSearch} from '../scripts/Search'
//import DropShadow from "react-native-drop-shadow"
//import Video from "react-native-video"
import * as RNLocalize from "react-native-localize"

export default function Workshops(props) {
    const [isLoading, setIsLoading] = useState(true) 
    const [searchInput, setSearchInput] = useState("")

    const [playerRef, setPlayerRef] = useState(null)

    //WorkShops :  object fields: id, title, date_posted, from, to, location, phone, image, email, seller:{id, email, location,name,phone,picture}
    //TODO : Call this method from external firestore file
    useEffect(()=>{
        this.country = RNLocalize.getCountry() ? RNLocalize.getCountry() : 'IL'
        getTravelCamera()
        return () => {
            if (playerRef) playerRef.stop();
          };
    },[])

    const [travelCameraContents, setCamConents] = useState([])
    const options = {
        method: 'GET',
        headers: {
            "x-windy-key": "II6QdJxbMKmlHLsDtGYSSpcB1HFDNj2k"
        }
    }
    const getTravelCamera = () => {
        fetch('https://api.windy.com/api/webcams/v2/list/country='+ this.country +'?show=webcams:image,player,url', options)
        .then(response => response.json())
        .then(response => {
            console.log('Player : ', response.result.webcams)
            setCamConents(response.result.webcams)
        })
        .then(()=> {
            setIsLoading(false)
        })
        .catch(err => {
            setIsLoading(false)
        })

    }

    const $renderEmptyOrdersState = () => { 
        return(
             <ActivityIndicator color='#2C4770' size={35} style={styles.loading}/>
        )
    }

    const WorkShopCard = (props) => {
        return(
          <View style={{marginBottom: 15}}>
            {/* <Video
                style={{width:'100%', height: 220, backgroundColor:'gray'}}
                source={{ uri:  props.camera.player.day.emded}}
                //poster={props.camera.image.current.preview}
                resizeMode="contain"
                controls={true}
                paused={true}
                onBuffer={this.onBuffer}   // Callback when remote video is buffering
                onError={this.videoError}  // Callback when video cannot be loaded
                ref={(ref) => {
                    this.player = ref
                    }}
             /> */}
             <Image source={{uri : props.camera.image.current.preview}} style={{width:'100%', height: 220}}/>
            <Text style={styles.text}> {props.camera.title} </Text>
          </View>
        )
    }

    return (
        !isLoading ? 
            <FlatList 
                data={travelCameraContents}
                ListFooterComponent={travelCameraContents.length === 0 ? $renderEmptyOrdersState : null}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                style={styles.StoreList}
                renderItem={ ({item, index}) => (
                    <WorkShopCard camera={item} />
                )}/>
       : <ActivityIndicator color='#2C4770' size={35} style={styles.loading}/>
    )
}

const styles= StyleSheet.create({
    StoreList:{
       //alignSelf:'center',
       backgroundColor: '#FFFFFF',
    },
    loading: {
        color:'#2C4770', 
        fontFamily:'Cairo-Bold', 
        fontSize: 15,
        alignSelf:'center',
        marginTop:100,
        marginBottom:5
    },
    text:{
        color:'#2C4770', 
        marginRight: 5,
        letterSpacing: 1,
    },
    img:{
        width:'100%',
        height:220,
        alignSelf:'center',
        resizeMode:'contain',
    },
    dropShadow:{
        shadowColor: '#323232',
        shadowOffset: {width: -7, height: 7},
        shadowOpacity: 0.7,
        shadowRadius: 0.5,
    },
})

