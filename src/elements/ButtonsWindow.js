import React from 'react'
import { View, Text } from 'react-native'
import AppStyles from '../styles/AppStyle'
import Buttons from './Button'

export default function ButtonsWindow() {
    return (
        <>
            <Buttons.ButtonDefault 
                    iconName="speakers"
                    iconSize={50}
                    horizontal={false}
                    containerStyle={[
                        AppStyles.ButtonBoxBeta, { borderRadius: 70}
                        ]}
                    textStyle={
                        AppStyles.ButtonTextBeta
                    }
                />

                <Buttons.ButtonDefault 
                    titleRight="Button"
                    iconName="fire"
                    iconSize={70}
                    horizontal={true}
                    containerStyle={[
                        AppStyles.ButtonBoxAlpha, { borderRadius: 10}
                        ]}
                    textStyle={[
                        AppStyles.ButtonTextAlpha, {fontFamily: 'Blazed'}
                    ]}
                    iconContainer={{backgroundColor:'rgba(255,255,255,0.4)', borderRadius:50}}
                />

                <Buttons.ButtonDefault 
                    titleRight="Button"
                    horizontal={false}
                    containerStyle={[
                        AppStyles.ButtonBoxBeta, { borderRadius: 10, width: 200}
                        ]}
                    textStyle={[
                        AppStyles.ButtonTextBeta, {fontFamily: 'Blazed'}
                    ]}
                />

                <Buttons.ButtonDefault 
                    titleLeft="Button"
                    iconName="home"
                    iconSize={45}
                    horizontal={false}
                    containerStyle={[
                        AppStyles.ButtonBoxBeta, { borderRadius: 5}
                        ]}
                    textStyle={[
                        AppStyles.ButtonTextBeta, {fontFamily: 'CollegiateBlackFLF'}
                    ]}
                    iconContainer={{backgroundColor:'rgba(255,255,255,0.5)', borderRadius:50}}
                />

                <Buttons.ButtonWithShadow 
                    titleRight="Button"
                    iconName="card"
                    iconSize={50}
                    horizontal={false}
                    containerStyle={[
                        AppStyles.ButtonBoxDelta, { borderRadius: 5}
                        ]}
                    textStyle={[
                        AppStyles.ButtonTextDelta, {fontFamily: 'CollegiateBlackFLF'}
                    ]}
                    iconContainer={{backgroundColor:'rgba(0,0,0,0.25)', borderRadius:50, padding: 5}}
                />

                <Buttons.ButtonWithShadow 
                    titleRight="Button"
                    iconName="bell"
                    iconSize={45}
                    horizontal={false}
                    containerStyle={[
                        AppStyles.ButtonBoxBeta, { borderRadius: 5}
                        ]}
                    textStyle={[
                        AppStyles.ButtonTextBeta, {fontFamily: 'Bullpen3D'}
                    ]}
                />

                <Buttons.PressableButton 
                    titleLeft="Pressable"
                    iconName="share"
                    iconSize={45}
                    horizontal={false}
                    containerStyle={[
                        AppStyles.ButtonBoxBeta, { borderRadius: 5}
                        ]}
                    textStyle={[
                        AppStyles.ButtonTextBeta, {fontFamily: 'Bullpen3D'}
                    ]}
                />
        </>
    )
}
