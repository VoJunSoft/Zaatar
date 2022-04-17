import firestore from '@react-native-firebase/firestore';

export const GetProductsByDate = () => {
    let list = []
    const subscriber = firestore()
        .collection('products')
        .orderBy('date_listed', 'asc')
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                list = [{...documentSnapshot.data(), productId: documentSnapshot.id},...list]
            })
        })
        return list
}