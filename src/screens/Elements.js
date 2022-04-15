import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native'
import AppStyles from '../styles/AppStyle'
import NavTabs from '../elements/NavTabs'
import Stores from '../components/Stores'
import Workshops from '../components/Workshops'

const Elements = () => {

    const [screenName, setScreenName] = useState('Stores')
    const RenderElementsWindow = (props) => {
        switch(props.screenName){
            case 'Stores':
                return <Stores />
            case 'Workshops':
                return <Workshops />
        }
    }
    return (
        <View style={styles.container}>
            <RenderElementsWindow screenName={screenName} />
            <NavTabs tabView={screenName} switchTabs={setScreenName}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'100%',
        alignSelf:'center',
    },
    ElementsBox: {
        width: Dimensions.get('window').width - 30,
        alignSelf:'center',
        borderRadius: 5,
        margin:3,
    },
})

export default Elements