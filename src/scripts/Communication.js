import React from 'react'
import {
    Linking
} from 'react-native'

export const contactUsByWhatsapp = (data, phoneNumber)=>{
    let msg = 'زعتر - ' + data 
    Linking.openURL(`whatsapp://send?text=${msg}&phone=${phoneNumber}`)
}