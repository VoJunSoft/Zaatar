import React, {useState} from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import Buttons from "../elements/Button"

export default function SearchBar(props) {

    //TODO make search button float
    const [searchBarVisibility, setSearchBarVisibility ] = useState(props.serachBarVisibility)
    return (
        <View style={[styles.container,{
                    width: searchBarVisibility ? '100%' :'15%',
                    justifyContent: 'space-around',
                    alignSelf:'flex-end'
                    }]}>
            {searchBarVisibility ?
                <>
                <Buttons.ButtonWithShadow iconName='delete' iconSize={25} onPress={()=>props.setSearchInput('')} containerStyle={styles.icon}/>
                <TextInput
                    value={props.searchInput}
                    style={styles.textInput}
                    placeholder="بحث..."
                    placeholderTextColor='#fff'
                    textAlign='center'
                    textAlignVertical='bottom'
                    maxLength={25}
                    onChangeText={(value) => props.setSearchInput(value)}
                />
                </>
                :
                null
            }
            <Buttons.ButtonWithShadow iconName='search' iconSize={25} onPress={()=>setSearchBarVisibility(!searchBarVisibility)} containerStyle={styles.icon}/>
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
        backgroundColor:'#2C4970',
        width: '70%',
        borderRadius: 15,
        height: 40,
    }, 
    icon:{
        backgroundColor:'#2C4970',
        borderRadius: 50,
        padding:2
    }
})