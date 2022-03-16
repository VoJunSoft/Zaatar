import React from 'react'
import { 
    View, 
    Text,
    StyleSheet,
    Image,
    Dimensions
 } from 'react-native'
import * as Animatable from 'react-native-animatable';
import Buttons from '../elements/Button'

const Entry = ({navigation}) => {
    return (
    <View style={styles.container}>
    <Animatable.View    onAnimationEnd={()=>navigation.navigate('Zaatar')}
                        easing="ease-out-circ"
                        animation="zoomIn"
                        iterationCount={1}
                        duration={3000}
                        direction="normal">
        <Image style={{width:250, height:350, resizeMode:'contain'}} source={require('../assets/gallary/Zaatar1.png')} />
        <Text style={styles.title}> Zaatar </Text>
    </Animatable.View>
        <View style={styles.EntryBox}>
                <Buttons.ButtonDefault 
                    titleRight="ENTER"
                    //iconName="home"
                    iconSize={25}
                    horizontal={false}
                    containerStyle={{
                         backgroundColor:'#2C4770',
                         borderRadius: 3, 
                         width: 200,
                         padding: 7,
                         margin:5
                    }}
                    textStyle={{
                        fontFamily: 'Marlboro',
                        color:'#fff',
                        fontSize:25,
                        letterSpacing:2
                    }}
                    onPress={()=>navigation.navigate('Zaatar')}
                />
                {/* <Buttons.ButtonDefault 
                    titleRight="SIGN-UP"
                    //iconName="home"
                    iconSize={25}
                    horizontal={false}
                    containerStyle={{
                         backgroundColor:'#2C4770',
                         borderRadius: 3, 
                         width: 200,
                         padding: 7,
                         margin:5
                    }}
                    textStyle={{
                        fontFamily: 'Marlboro',
                        color:'#fff',
                        fontSize:25,
                        letterSpacing:2
                    }}
                    onPress={{}}
                /> */}
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#2C4770',
    },
    title:{
        marginTop:-50,
        fontSize:30,
        textAlign:'center',
        color:'#fff',
        fontFamily:'Blazed'
    },
    EntryBox:{
        marginTop:-7,
        backgroundColor: '#fff',
        width:Dimensions.get('window').width/1.6,
        //height:170,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        padding:10
    }
})
export default Entry;