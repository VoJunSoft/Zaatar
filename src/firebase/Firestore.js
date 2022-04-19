import firestore from '@react-native-firebase/firestore';

export const GetRecordsByDate = () => {
    let list = []
     firestore()
        .collection('workshops')
        .orderBy('date_posted', 'asc')
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                list = [{...documentSnapshot.data(), id: documentSnapshot.id}]
            })
        })
        return list
}