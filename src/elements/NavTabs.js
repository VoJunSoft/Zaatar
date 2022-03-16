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

                <Pressable style={[CSS.tabView, {backgroundColor: props.tabView === 'Buttons' ? 'rgba(255,255,255,0.2)' : null, borderTopLeftRadius:10}]} onPress={()=>props.switchTabs('Buttons')}>
                    <Text style={CSS.tabText}> Buttons </Text>
                </Pressable>

                <Pressable style={[CSS.tabView, {backgroundColor: props.tabView === 'Icons' ? 'rgba(255,255,255,0.2)' : null}]} onPress={()=>props.switchTabs('Icons')}>
                    <Text style={CSS.tabText}> Icons </Text>
                </Pressable>

                <Pressable style={[CSS.tabView, {backgroundColor: props.tabView === 'Fetch' ? 'rgba(255,255,255,0.2)' : null, borderTopRightRadius:10}]} onPress={()=>props.switchTabs('Fetch')}>
                    <Text style={CSS.tabText}> Fetch </Text>
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
        width:"33%",
        padding:7,
    },
    tabText:{
        color:'white',
        fontFamily:'Marlboro',
        textAlign:'center',
        fontSize:22
    }
})