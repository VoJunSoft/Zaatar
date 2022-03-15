import React from 'react'
import { View, Text, StyleSheet} from 'react-native'
import DropShadow from "react-native-drop-shadow";

export default function NavTab(props) {
    return (
        <DropShadow style={CSS.dropShadow}>
        <View style={{ 
            backgroundColor:'#2C4770', 
            borderTopWidth:0, 
            borderColor:'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            flexDirection:'row', 
            alignItems:'center',
            justifyContent:'space-around'}}
            >
            <View style={CSS.tabView}><Text style={CSS.tabText}> Buttons </Text></View>
            <View style={CSS.tabView}><Text style={CSS.tabText}> Icons </Text></View>
            <View style={CSS.tabView}><Text style={CSS.tabText}> Fetch </Text></View>
        </View>
        </DropShadow>
    )
}

const CSS = StyleSheet.create({
    dropShadow: {
        width:'100%',
        shadowColor: '#171717',
        shadowOffset: {width: 0, height: -3},
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    tabView:{
        width:"30%",
        margin : 5,
        //backgroundColor:'rgba(255,255,255,0.051)',
        padding:5,
    },
    tabText:{
        color:'white',
        fontFamily:'Bullpen3D',
        textAlign:'center',
        fontSize:18
    }
})