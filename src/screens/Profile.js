import React from 'react'
import { 
    View, 
    Text, 
    StyleSheet,
    Dimensions,
    ScrollView
} from 'react-native'
import AppStyles from '../styles/AppStyle'
import DropShadow from "react-native-drop-shadow"
import { Avatar } from 'react-native-elements';

export default function Profile() {
    return (
        <View style={styles.container}>
            <DropShadow style={styles.dropShadow}>
                <View style={styles.profileBox}>
                    <DropShadow style={[styles.image, styles.dropShadowImg]}>
                        <Avatar
                            size={220}
                            rounded
                            //source={{uri: 'https://randomuser.me/api/portraits/men/36.jpg'}}
                            icon={{ name: 'user', type: 'font-awesome' }}
                            containerStyle={{ backgroundColor: '#323232' }}
                            key={1}
                        />
                    </DropShadow>
                    <ScrollView style={styles.userInfo}>

                    </ScrollView>
                </View>
            </DropShadow>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#2C4770',
        justifyContent:'flex-end'
    },
    dropShadow:{
        shadowColor: '#323232',
        shadowOffset: {width: -9, height: 8},
        shadowOpacity: 0.9,
        shadowRadius: 2,
    },
    dropShadowImg:{
        shadowColor: '#2C4770',
        shadowOffset: {width: -2, height: 3},
        shadowOpacity: 0.7,
        shadowRadius: 3,
    },
    profileBox: {
        width: Dimensions.get('window').width - 35,
        height: Dimensions.get('window').height - 180,
        alignSelf:'center',
        backgroundColor:'white',
        borderRadius: 10,
        marginBottom:20,
    },
    image:{
        alignSelf:'center',
        marginTop:-90
    }
})
