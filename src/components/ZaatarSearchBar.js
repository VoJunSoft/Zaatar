import React, {useState} from 'react'
import { View, Text, ScrollView, StyleSheet, TextInput, Dimensions } from 'react-native'
import Buttons from "../elements/Button"
import DropShadow from "react-native-drop-shadow";

export default function ZaatarSearchBar(props) {

    const $Categories = ['الكل' ,"انتيكا", "مستلزمات", "الات", "فن", 'خدمات' , "دروس خصوصية", 'اكسسوارات' , "غذاء"]
    const [searchBarVisibility, setSearchBarVisibility ] = useState(false)
    return (
        <DropShadow style={styles.dropShadow}>
        <ScrollView horizontal={true} style={styles.container} showsHorizontalScrollIndicator={false}>
            <View style={[styles.SubContainer,{
                        width: searchBarVisibility ? Dimensions.get('window').width/1.5 : 60,
                        justifyContent: searchBarVisibility ? 'space-around' : 'center',
                        alignSelf:'center'
                        }]}>

                <Buttons.ButtonDefault iconName='search' iconSize={30} containerStyle={{}} onPress={()=>setSearchBarVisibility(!searchBarVisibility)} containerStyle={styles.icon}/>
                {searchBarVisibility ?
                    <>
                     <TextInput
                        value={props.searchInput}
                        style={styles.textInput}
                        placeholder="بحث..."
                        placeholderTextColor='#2C4970'
                        maxLength={25}
                        onChangeText={(value) => props.setSearchInput(value)}
                    />
                    <Buttons.ButtonDefault iconName='delete' iconSize={25} containerStyle={{}} onPress={()=>props.setSearchInput('')} containerStyle={styles.icon}/>
                    </>
                    :
                    null
                }
                </View>
            {
                $Categories.map((item, index)=>[
                    <Buttons.ButtonDefault 
                        key={index}
                        titleRight={item}
                        horizontal={true}
                        textStyle={styles.title}
                        containerStyle={[styles.CategoryContainer, {backgroundColor: item === props.category ? 'rgba(255,255,255,0.3)' : null}]}
                        onPress={()=>props.setCategory(item)}
                    />
               ])
            }
        </ScrollView>
        </DropShadow>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#2C4970',
        marginBottom:10
    },
    title:{
        fontFamily:'Cairo-Bold',
        fontSize: 12,
        textAlign:'center',
        color:'#fff'
    },
    CategoryContainer:{
        width:100,
        marginRight: 0,
        borderRightWidth:1,
        margin:0,
        borderRadius:0,
        alignItems:'center'
    }, 
    dropShadow: {
        shadowColor: '#fff',
        shadowOffset: {width: -2, height: -2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    SubContainer:{
        backgroundColor:'#2C4970',
        flexDirection:'row',
        alignItems:'center',
        padding: 5,
        borderRightWidth:1,
    },
    textInput:{
        backgroundColor:'#fff',
        width: 150,
        borderRadius: 15,
        height: 40
    }, 
    icon:{
        backgroundColor:'rgba(255,255,255,0.3)',
        borderRadius: 50
    }
})
