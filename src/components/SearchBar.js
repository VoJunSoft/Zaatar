import React, {useState} from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import Buttons from "../elements/Button"

export default function SearchBar(props) {

    //TODO make search button float
    const [searchBarVisibility, setSearchBarVisibility ] = useState(props.serachBarVisibility)
    return (
        <View style={[styles.container,{
                    backgroundColor: searchBarVisibility ? '#2C4970' : null,
                    width: searchBarVisibility ? '100%' :'15%',
                    justifyContent: searchBarVisibility ? 'space-around' : 'center',
                    alignSelf:'flex-end'
                    }]}>
            {searchBarVisibility ?
                <>
                <Buttons.ButtonWithShadow iconName='delete' iconSize={25} onPress={()=>props.setSearchInput('')} containerStyle={styles.icon}/>
                <TextInput
                    value={props.searchInput}
                    style={styles.textInput}
                    placeholder="بحث..."
                    placeholderTextColor='#2C4970'
                    textAlign='center'
                    textAlignVertical='bottom'
                    maxLength={25}
                    onChangeText={(value) => props.setSearchInput(value)}
                />
                </>
                :
                null
            }
            <Buttons.ButtonDefault iconName='search' iconSize={25} 
                onPress={()=>setSearchBarVisibility(!searchBarVisibility)} 
                containerStyle={{
                    backgroundColor:searchBarVisibility ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    borderRadius: 50
                    }}
                />
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        padding: 7
    },
    title:{
        fontFamily:'Cairo-Bold',
        fontSize: 12,
        textAlign:'center',
        color:'#fff'
    },
    textInput:{
        backgroundColor:'#fff',
        width: '70%',
        borderRadius: 15,
        height: 37,
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
        borderRadius: 50
    }
})