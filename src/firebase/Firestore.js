import firestore from '@react-native-firebase/firestore';

// access database and return values based on timestamp
//WorkShops :  object fields: id, title, date_posted, from, to, location, phone, image, email, seller:{id, email, location,name,phone,picture}
export const GetRecordsFromDBasc = (DB) => {
        let list
        firestore()
        .collection(DB)
        .orderBy('date_listed', 'asc')
        .onSnapshot(querySnapshot => {
            list=[]
            querySnapshot.forEach(documentSnapshot => {
                list.push({...documentSnapshot.data(), id: documentSnapshot.id})
            })
        })
        return list 
}