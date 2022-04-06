import AsyncStorage from '@react-native-async-storage/async-storage'

export const uploadImage =  async (img) => {

    const uploadUri = img;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;
    setTransferred(0);
    const storageRef = storage().ref(`users/${filename}`);
    const task = storageRef.putFile(uploadUri);
    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
    setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
        100,
    );
    });

    try {
        await task;
        const url = await storageRef.getDownloadURL()
        return url
    } catch (e) {
        return null
    }
}

export const getUserInfoZaatar =  () => {
    try {
           AsyncStorage.getItem('userInfoZaatar')
           .then((value) => {
                if(value !== null)
                    return JSON.parse(value)
           })
    } catch(e) {
      // error reading value
    }
  }

