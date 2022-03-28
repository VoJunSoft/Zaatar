import React, {useState} from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import Buttons from "../elements/Button"
//import { TextInput } from 'react-native-gesture-handler'

export default function SearchBar(props) {

    const [searchBarVisibility, setSearchBarVisibility ] = useState(true)
    return (
        <View style={[styles.container,{
                    width: searchBarVisibility ? '100%' :'20%',
                    justifyContent: searchBarVisibility ? 'space-around' : 'flex-end',
                    alignSelf:'flex-end'
                    }]}>
            {searchBarVisibility ?
                <>
                <Buttons.ButtonWithShadow iconName='delete' iconSize={25} containerStyle={{}} onPress={()=>props.setSearchInput('')} containerStyle={styles.icon}/>
                <TextInput
                    value={props.searchInput}
                    style={styles.textInput}
                    placeholder="بحث..."
                    placeholderTextColor='#2C4970'
                    maxLength={25}
                    onChangeText={(value) => props.setSearchInput(value)}
                />
                </>
                :
                null
            }
            <Buttons.ButtonDefault iconName='search' iconSize={25} containerStyle={{}} onPress={()=>setSearchBarVisibility(!searchBarVisibility)} containerStyle={styles.icon}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#2C4970',
        flexDirection:'row',
        alignItems:'center',
        padding: 5
    },
    title:{
        fontFamily:'Cairo-Bold',
        fontSize: 12,
        textAlign:'center',
        color:'#fff'
    },
    textInput:{
        backgroundColor:'#fff',
        width: '60%',
        borderRadius: 15,
        height: 40
    }, 
    dropShadow: {
        width:'100%',
        shadowColor: '#fff',
        shadowOffset: {width: -2, height: -2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    icon:{
        backgroundColor:'rgba(255,255,255,0.3)',
        padding: 2,
        borderRadius: 50
    }
})