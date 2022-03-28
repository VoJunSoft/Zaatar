import React from 'react'
import { View, Text, StyleSheet, Pressable} from 'react-native'
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
                        overflow:'hidden',
                        justifyContent:'space-between'}}>

                <Pressable style={[CSS.tabView, {backgroundColor: props.tabView === 'Events' ? 'rgba(255,255,255,0.2)' : null}]} onPress={()=>props.switchTabs('Events')}>
                    <Text style={CSS.tabText}> الأحداث </Text>
                </Pressable>

                <Pressable style={[CSS.tabView, {backgroundColor: props.tabView === 'Workshops' ? 'rgba(255,255,255,0.2)' : null, borderTopRightRadius:10}]} onPress={()=>props.switchTabs('Workshops')}>
                    <Text style={CSS.tabText}> ورشات عمل </Text>
                </Pressable>

            </View>
        </DropShadow>
    )
}

const CSS = StyleSheet.create({
    dropShadow: {
        width:'100%',
        shadowColor: '#fff',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    tabView:{
        width:"48%",
        padding:7,
    },
    tabText:{
        color:'white',
        fontFamily:'Cairo-Bold',
        textAlign:'center',
        fontSize:15
    }
})