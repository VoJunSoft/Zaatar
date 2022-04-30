import React, {useEffect, useState} from 'react'
import { 
    View, 
    Text,
    StyleSheet,
    Image,
    Dimensions,
    Button,
    ScrollView,
    TouchableOpacity
 } from 'react-native'
import Buttons from '../elements/Button'
import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'

const StoreCard = (props) => {
   const nav = useNavigation()
    const [store, setStoreInfo] = useState(props.item)
    useEffect( ()=>{
        getData()
      }, [])
    
      //get owner (logged in user) to compare with other sellers ids
      const [ownerId, setOwnerId] = useState('')
      const getData =  () => {
            AsyncStorage.getItem('userInfoZaatar')
               .then((value) => {
                    if(value !== null)
                      setOwnerId(JSON.parse(value).id)
               })
      }
  
      //TODO retrieve data from firebase based on id and pass it instead of productInfo.seller (which is stored with product info)
      const GoToSellerProfile = () => {
       // if user is owner then go to his/her page
        if(store.id === ownerId){
             nav.navigate('Profile')
        }else{
            global.sellerState = store
            nav.navigate('SellerProfile')
        }
      }
    return (
    <TouchableOpacity style={styles.container} onPress={GoToSellerProfile} activeOpacity={0.8}>
        <View style={styles.EntryHeader}>
            <Text style={styles.title}>{store.name}</Text>
            <Avatar
              size={145}
              rounded
              source={{uri: store.picture}}
              icon={{ name: 'user', type: 'font-awesome', color: '#2C4770' }}
              containerStyle={{ backgroundColor: '#fff', margin: 5}}
          />
        </View>
        <View style={styles.EntryBox}>
            <View style={styles.info}>
                    <View style={{flexDirection:'column', width:'60%'}}>
                        <Text style={[styles.body]}>🌟🌟🌟🌟</Text>
                        <Text style={[styles.body]}>{store.phone}</Text>
                    </View>
                    <Buttons.ButtonDefault
                        titleRight={store.location.city} 
                        iconName="location"
                        iconSize={35}
                        horizontal={true}
                        textStyle={styles.body}
                        containerStyle={{width:'40%'}}
                        activeOpacity={0.9}
                        disabled/> 
            </View>
        </View>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        width:Dimensions.get('window').width/2.2,
        height:Dimensions.get('window').height/2.7,
        backgroundColor: '#fff',
        borderRadius:20,
        overflow:'hidden',
        margin: 10,
    },
    EntryHeader:{
        backgroundColor: '#2C4770',
        justifyContent:'center',
        alignItems:'center',
        borderBottomRightRadius:100,
        padding:10,
        height:'75%'
    },
    EntryBox:{
        height:'20%',
        backgroundColor: '#2C4770',
       // margin: -1
    },
    title:{
        fontSize:15,
        textAlign:'center',
        color:'#fff',
        fontFamily:'Cairo-Bold',
        marginBottom: 10
    },
    body:{
        fontFamily: 'Cairo-Regular' ,
        fontSize: 12, 
        color: '#2C4770',
        textAlign:'center'
    },
    info:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'flex-end',
        padding:5,
        backgroundColor: '#fff',
        borderTopLeftRadius:100,
        paddingTop:20,
    }

})
export default StoreCard;