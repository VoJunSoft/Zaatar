import React from 'react'
import { View, Text, StyleSheet, Pressable} from 'react-native'
import DropShadow from "react-native-drop-shadow";
import LinearGradient from 'react-native-linear-gradient'

export default function NavTab(props) {
    const ActiveColors = ['#4b6cb7', '#2C4770','#182848']
    const inActiveColors = ['#182848', '#2C4770','#4b6cb7']
    return (
        <View style={{
                flexDirection:'row', 
                alignItems:'center',
                justifyContent:'space-between'}}>
                <LinearGradient 
                colors={props.tabView === 'Stores' ? ActiveColors : inActiveColors} style={CSS.linearGradient}>
                        <Pressable style={CSS.tabView} onPress={()=>props.switchTabs('Stores')}>
                            <Text style={[CSS.tabText,{color: props.tabView === 'Stores' ? '#fac300' : '#fff'}]}> متاجر </Text>
                        </Pressable>
                </LinearGradient>

                <LinearGradient 
                colors={props.tabView === 'Products' ? ActiveColors : inActiveColors} style={CSS.linearGradient}>
                        <Pressable style={CSS.tabView} onPress={()=>props.switchTabs('Products')}>
                            <Text style={[CSS.tabText,{color: props.tabView === 'Products' ? '#fac300' : '#fff'}]}> منتجات </Text>
                        </Pressable>
                </LinearGradient>
        </View>
        // <DropShadow style={CSS.dropShadow}>
        // <View style={{ 
        //             backgroundColor:'#fff',
        //             overflow:'hidden',
        //             flexDirection:'row', 
        //             alignItems:'center',
        //             justifyContent:'space-between'}}>

        //     <Pressable style={[CSS.tabView, {backgroundColor: props.tabView === 'Stores' ? '#323232' : '#2C4770'}]} onPress={()=>props.switchTabs('Stores')}>
        //         <Text style={[CSS.tabText,{color: props.tabView === 'Stores' ? '#fac300' : '#fff'}]}> متاجر </Text>
        //     </Pressable>

        //     <Pressable style={[CSS.tabView, {backgroundColor: props.tabView === 'Products' ? '#323232' : '#2C4770'}]} onPress={()=>props.switchTabs('Products')}>
        //         <Text style={[CSS.tabText,{color: props.tabView === 'Products' ? '#fac300' : '#fff'}]}> منتجات </Text>
        //     </Pressable>

        // </View>
        // </DropShadow>
    )
}

const CSS = StyleSheet.create({
    dropShadow: {
        width:'100%',
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: -2},
        shadowOpacity: 1,
        shadowRadius: 1,
    },
    tabView:{
        padding:5,
    },
    tabText:{
        fontFamily:'Cairo-Regular',
        textAlign:'center',
        fontSize:15
    },
    linearGradient:{
        flex:1,
        padding: 3
    }
})