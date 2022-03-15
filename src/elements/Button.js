import React, {useEffect, useState} from 'react'
import { 
    Text, 
    View, 
    TouchableOpacity,
    StyleSheet,
    Pressable
} from 'react-native'
import Icon from './Icon'
import DropShadow from "react-native-drop-shadow";

const ButtonDefault = (props) => {
    return (
        <TouchableOpacity 
                style={[props.containerStyle, props.horizontal ? CSS.container : CSS.containerVertical]} 
                onPress={props.onPress}
                activeOpacity={0.7} {...props}>
            {props.titleLeft ?
                <Text style={[props.textStyle]}>{props.titleLeft}</Text>
                :
                null
            }
            {props.iconName ?
                <Icon 
                    iconName={props.iconName} 
                    size={props.iconSize}
                    container={props.iconContainer}/>
            :
                null
            }
            {props.titleRight ?
                <Text style={[props.textStyle]}>{props.titleRight}</Text>
                :
                null
            }
        </TouchableOpacity>
    )
}

const ButtonWithShadow = (props) => {
    return(
        <DropShadow style={CSS.dropShadow}>
                <ButtonDefault {...props}/>   
        </DropShadow>
    )
}

const PressableButton = (props) => {
    return (
        <Pressable 
                style={[
                        props.containerStyle, 
                        props.horizontal ? CSS.container : CSS.containerVertical
                    ]} 
                android_ripple={{color:'#2C4770'}}
                onPress={props.onPress}>
            {props.titleLeft ?
                <Text style={[props.textStyle]}>{props.titleLeft}</Text>
                :
                null
            }
            {props.iconName ?
                <Icon 
                    iconName={props.iconName} 
                    size={props.iconSize}/>
            :
                null
            }
            {props.titleRight ?
                <Text style={[props.textStyle]}>{props.titleRight}</Text>
                :
                null
            }
        </Pressable>
    )
}

const CSS = StyleSheet.create({
    container:{
        flexDirection: 'column',
        justifyContent:'center',
        alignItems:'center'
    },
    containerVertical:{
        flexDirection: 'row',
        justifyContent:'space-evenly',
        alignItems:'center'
    },
    dropShadow: {
        shadowColor: '#323232',
        shadowOffset: {width: -7, height: 7},
        shadowOpacity: 0.5,
        shadowRadius: 2,
      }
})
export default {ButtonDefault , ButtonWithShadow, PressableButton};