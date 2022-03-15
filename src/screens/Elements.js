import React, {useState} from 'react'
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native'
import AppStyles from '../styles/AppStyle'
import NavTabs from '../elements/NavTabs'
import ButtonsWindow from '../elements/ButtonsWindow'

const Elements = () => {
    const [screenName, setScreenName] = useState('Buttons')

    const RenderElementsWindow = (screenName) => {
        switch(screenName){
            case 'Buttons':
                return <ButtonsWindow />
        }
    }
    return (
        <View style={styles.container}>
            <ScrollView style={styles.ElementsBox}>
                {RenderElementsWindow(screenName)}
            </ScrollView>
            <NavTabs tabView={screenName} switchTabs={setScreenName}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'100%',
        alignSelf:'center',
        backgroundColor: '#2C4770',
        //AppStyles.AppBG,
    },
    ElementsBox: {
        width: Dimensions.get('window').width - 35,
        alignSelf:'center',
        backgroundColor:'white',
        borderRadius: 20,
        margin:20,
    },
})

export default Elements