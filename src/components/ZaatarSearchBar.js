import React, {useState} from 'react'
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, TouchableOpacity } from 'react-native'
import Buttons from "../elements/Button"
import DropShadow from "react-native-drop-shadow";
import {SearchCategories} from '../scripts/DataValues.json'
import LinearGradient from 'react-native-linear-gradient'

export default function ZaatarSearchBar(props) {
    const [searchBarVisibility, setSearchBarVisibility ] = useState(false)
    const ActiveColors = ['#182848', '#2C4770','#4b6cb7'] 
    const inActiveColors = ['#4b6cb7', '#2C4770', '#182848'] //4b6cb7
    return (
        <DropShadow style={styles.dropShadow}>
        <ScrollView horizontal={true} style={styles.container} showsHorizontalScrollIndicator={false}> 
            <LinearGradient style={[styles.SubContainer,{
                                    width: searchBarVisibility ? 220 : 60,
                                    justifyContent: searchBarVisibility ? 'space-between' : 'center',
                                    alignSelf:'center'
                                    }]}
                            colors={inActiveColors}>
                <Buttons.ButtonDefault 
                        iconName='search' 
                        iconSize={30} 
                        onPress={()=>setSearchBarVisibility(!searchBarVisibility)} 
                        iconContainer={styles.icon}/>
                {searchBarVisibility ?
                     <TextInput
                        value={props.searchInput}
                        style={styles.textInput}
                        placeholder="بحث..."
                        placeholderTextColor='#2C4970'
                        maxLength={25}
                        onChangeText={(value) => props.setSearchInput(value)}
                    />
                    :
                    null
                }
                </LinearGradient>

                {
                SearchCategories.map((item, index)=>[
                    <LinearGradient 
                    colors={item === props.category ? ActiveColors : inActiveColors} style={styles.linearGradient}  key={index}>
                            <TouchableOpacity onPress={()=>props.setCategory(item)}>
                                <Text style={[styles.title,{color:item === props.category ? '#fac300' : '#fff'}]}> {item} </Text>
                            </TouchableOpacity>
                    </LinearGradient>
                    ])
                 }
        </ScrollView>
        </DropShadow>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#2C4970',
        height:50
    },
    title:{
        fontFamily:'Cairo-Regular',
        fontSize: 14,
        textAlign:'center',
    },
    dropShadow: {
        shadowColor: '#323232',
        shadowOffset: {width: -2, height: 1},
        shadowOpacity: 1,
        shadowRadius: 1,
    },
    SubContainer:{
        backgroundColor:'#2C4970',
        flexDirection:'row',
        padding: 7,
        borderRightWidth:2,
        borderColor:'rgba(0,0,0,0.2)',
    },
    textInput:{
        backgroundColor:'#fff',
        width: 150,
        borderRadius: 15,
        marginRight:5
    }, 
    icon:{
        backgroundColor:'rgba(255,255,255,0.3)',
        borderRadius: 50
    },
    linearGradient:{
        alignItems:'center',
        justifyContent:'center',
        paddingLeft:25,
        paddingRight: 25,
        borderRightWidth:2,
        borderColor:'rgba(0,0,0,0.2)',
    }
})
