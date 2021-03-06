import React, {useState} from 'react';
import { 
    View, 
    Text,
    StyleSheet,
    Image
} from 'react-native';

const CusIcon = (props) => {
    const [icons, setIcons] = useState({
        home:  require('../assets/icons/home.png'),
        bell:  require('../assets/icons/bell.png'),
        add:  require('../assets/icons/add.png'),
        camera:  require('../assets/icons/camera.png'),
        card:  require('../assets/icons/card.png'),
        cart:  require('../assets/icons/cart.png'),
        settings:  require('../assets/icons/settings.png'),
        menu:  require('../assets/icons/menu.png'),
        profile:  require('../assets/icons/profile.png'),
        search:  require('../assets/icons/search.png'),
        edit:  require('../assets/icons/edit.png'),
        contacts:  require('../assets/icons/contacts.png'),
        location:  require('../assets/icons/location.png'),
        locationAlpha:  require('../assets/icons/locationAlpha.png'),
        exit:  require('../assets/icons/exit.png'),
        envelope:  require('../assets/icons/envelope.png'),
        upload:  require('../assets/icons/upload.png'),
        typing:  require('../assets/icons/typing.png'),
        video:  require('../assets/icons/video.png'),
        load:  require('../assets/icons/load.png'),
        share:  require('../assets/icons/share.png'),
        photo:  require('../assets/icons/photo.png'),
        mic:  require('../assets/icons//mic.png'),
        speakers:  require('../assets/icons/speakers.png'),
        new:  require('../assets/icons/new.png'),
        fire:  require('../assets/icons/fire.png'),
        discount: require('../assets/icons/discount.png'),
        discount20: require('../assets/icons/discount20.png'),
        listdark: require('../assets/icons/listdark.png'),
        listbag: require('../assets/icons/listbag.png'),
        delete: require('../assets/icons/delete.png'),
        editBlack: require('../assets/icons/editBlack.png'),
        whiteStar: require('../assets/icons/whiteStar.png'),
        goldStar: require('../assets/icons/goldStar.png'),
        gear: require('../assets/icons/gear.png'),
        whats: require('../assets/icons/whats.png'),
        info: require('../assets/icons/info.png'),
        zaatar: require('../assets/icons/zaatar.png'),
        store: require('../assets/icons/store.png'),
        admin:require('../assets/icons/admin.png'),
    })
   
    return(
    <View style={props.container}>
        <Image style={[{
                    width:props.size,
                    height:props.size,
                }, CSS.icon]} 
                source={icons[props.iconName]} 
                />
    </View>
    )
}

const CSS = StyleSheet.create({
    icon: {
        margin: 5
    }
})

export default CusIcon;


