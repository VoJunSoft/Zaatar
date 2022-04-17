import AsyncStorage from '@react-native-async-storage/async-storage'

export const getUserInfo = () => {
    try {
        AsyncStorage.getItem('userInfoZaatar')
            .then((value) => {
                if (value !== null)
                    return JSON.parse(value)
            })
    } catch (e) {
        // error reading value
    }
}