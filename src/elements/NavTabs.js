import React from 'react'
import { View, Text, StyleSheet, Pressable} from 'react-native'
import DropShadow from "react-native-drop-shadow";

export default function NavTab(props) {
    return (
        <DropShadow style={CSS.dropShadow}>
            <View style={{ 
                        backgroundColor:'#fff',
                        overflow:'hidden',
                        flexDirection:'row', 
                        alignItems:'center',
                        justifyContent:'space-between'}}>

                <Pressable style={[CSS.tabView, {backgroundColor: props.tabView === 'Stores' ? '#323232' : '#2C4770'}]} onPress={()=>props.switchTabs('Stores')}>
                    <Text style={[CSS.tabText,{color: props.tabView === 'Stores' ? '#fac300' : '#fff'}]}> متاجر </Text>
                </Pressable>

                <Pressable style={[CSS.tabView, {backgroundColor: props.tabView === 'Products' ? '#323232' : '#2C4770'}]} onPress={()=>props.switchTabs('Products')}>
                    <Text style={[CSS.tabText,{color: props.tabView === 'Products' ? '#fac300' : '#fff'}]}> منتجات </Text>
                </Pressable>

            </View>
        </DropShadow>
    )
}

const CSS = StyleSheet.create({
    dropShadow: {
        width:'100%',
        shadowColor: '#171717',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 1,
    },
    tabView:{
        flex:1,
        padding:5,
    },
    tabText:{
        fontFamily:'Cairo-Regular',
        textAlign:'center',
        fontSize:15
    }
})