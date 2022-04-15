import React from 'react'
import { View, Text, StyleSheet, Pressable} from 'react-native'
import DropShadow from "react-native-drop-shadow";

export default function NavTab(props) {
    return (
        <DropShadow style={CSS.dropShadow}>
            <View style={{ 
                        backgroundColor:'#fff', 
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        overflow:'hidden',
                        flexDirection:'row', 
                        alignItems:'center',
                        justifyContent:'space-between'}}>

                <Pressable style={[CSS.tabView, {backgroundColor: props.tabView === 'Stores' ? 'rgba(0,0,0,0.1)' : null}]} onPress={()=>props.switchTabs('Stores')}>
                    <Text style={CSS.tabText}> متاجر </Text>
                </Pressable>

                <Pressable style={[CSS.tabView, {backgroundColor: props.tabView === 'Workshops' ? 'rgba(0,0,0,0.1)' : null, borderTopRightRadius:10}]} onPress={()=>props.switchTabs('Workshops')}>
                    <Text style={CSS.tabText}> ورشات عمل </Text>
                </Pressable>

            </View>
        </DropShadow>
    )
}

const CSS = StyleSheet.create({
    dropShadow: {
        width:'100%',
        shadowColor: '#2C4770',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    tabView:{
        width:"48%",
        padding:7,
    },
    tabText:{
        color:'#2C4770',
        fontFamily:'Cairo-Bold',
        textAlign:'center',
        fontSize:15
    }
})