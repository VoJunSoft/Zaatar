import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native'
import AppStyles from '../styles/AppStyle'
import NavTabs from '../elements/NavTabs'
import ButtonsWindow from '../components/ButtonsWindow'
import Events from '../components/Events'
import Workshops from '../components/Workshops'

const Elements = () => {
    // robots state
    const [robots, setRobots] = useState([])
    useEffect(  () => {
            getRobots()
    },[])

    const getRobots = () => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(resp => resp.json())
            .then (data => setRobots(data))
    }

    const [screenName, setScreenName] = useState('Events')
    const RenderElementsWindow = (screenName) => {
        switch(screenName){
            case 'Buttons':
                return <ButtonsWindow />
            case 'Events':
                return <Events />
            case 'Workshops':
                return <Workshops robots={robots}/>
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
        width: Dimensions.get('window').width - 30,
        alignSelf:'center',
        borderRadius: 5,
        margin:3,
    },
})

export default Elements