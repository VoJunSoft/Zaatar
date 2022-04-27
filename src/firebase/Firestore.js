import firestore from '@react-native-firebase/firestore';

// access workshops database and return values
 //stored object fields: id, title, date_posted, from, to, location, phone, image, email, seller:{id, email, location,name,phone,picture}
export const getWorkShops = () => {
    let list = []
     firestore()
        .collection('workshops')
        .orderBy('date_posted', 'asc')
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                list = [{...documentSnapshot.data(), id: documentSnapshot.id}, ...list]
                console.log(list)
            })
            console.log('sssssss',list)
            return list
        })
    //.then(()=> {return list})
        
}