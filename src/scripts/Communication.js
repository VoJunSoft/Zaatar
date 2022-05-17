import React from 'react'
import {
    Linking
} from 'react-native'
import Share from "react-native-share"

//contact zaater's admin by whatsapp
export const contactUsByWhatsapp = (title, phoneNumber) => {
    let msg = 'زعتر - ' + title
    Linking.openURL(`whatsapp://send?text=${msg}&phone=${phoneNumber}`)
}

//contact seller by whatsapp
export const shareToWhatsApp = (phoneNumber, name, desc, price) => {
    let data = 'زعتر - ' + name + ' (' + desc + ') ' + 'السعر :' + price + '₪'
    Linking.openURL(`whatsapp://send?text=${data}&phone=${phoneNumber}`);
}

//share the Zaater App
export const share = async() => {
    const customOptions = {
        title: "زعتر",
        message: "سوق المبيعات",
        url: 'https://play.google.com/store/apps/details?id=com.junglesoft.zaater'
    }
    try {
        await Share.open(customOptions)
    } catch (err) {
        console.log(err);
    }
}