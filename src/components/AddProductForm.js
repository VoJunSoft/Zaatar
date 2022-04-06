import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  Alert,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { Overlay} from 'react-native-elements' 
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import Icon from '../elements/Icon';
import Button from '../elements/Button'
import {Picker} from '@react-native-picker/picker'

export default function AddProductForm(props) {

  //props.userInfo
  //HINT for edit purposes call AddProductForm from productCard and pass to it productInfo/Item
  const [productInfo, setProductInfo] = useState({
      seller: props.userInfo,
      product_name:'', 
      photos: [], 
      description: '', 
      category: '', 
      price: '', 
      date_listed: {seconds: Math.floor(Date.now() / 1000)}
  })

  //Handle image upload: the path from phone to show the chosen picture on screen (before upload)
  const [images, setImages] = useState(productInfo.photos)
  const [transferred, setTransferred] = useState(0)
  const [loadingImg, setLoadingImg] = useState(false)
  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: undefined,
      height: 350,
      multiple: true
    }).then((image) => {
      image.forEach(item => {
        const imageUri = Platform.OS === 'ios' ? item.sourceURL : item.path;
        uploadImage(imageUri)
      })  
    })
    .catch((e) =>{
        //setImage([])
    })
  }

  const uploadImage =  async (img) => {
        setLoadingImg(true)
        const uploadUri = img;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        // Add timestamp to File Name
        const extension = filename.split('.').pop(); 
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;
        const storageRef = storage().ref(`products/${filename}`);
        const task = storageRef.putFile(uploadUri);
        try {
            await task;
            const url = await storageRef.getDownloadURL()
            setImages(images => [...images,url])
            setLoadingImg(false)
        } catch (e) {
            //return null
        }
  }

  const handleSubmit = () => {
      //TODO handle the rest of verification process
    if(productInfo.product_name.length >= 4 
        && productInfo.category!=='' 
        && images.length>0 
        && productInfo.price.length > 0 
        && productInfo.description.length >= 5){
      toggleOverlay()
      const subscriber = firestore()
          .collection('products')
          .add({...productInfo, photos: images})
          .then(() => {
              //reset form info
              setProductInfo({
                seller: props.userInfo,
                product_name:'', 
                photos: [], 
                description: '', 
                category: '', 
                price: '', 
                date_listed: {seconds: Math.floor(Date.now() / 1000)}
              })
              setImages([])
              setVisible(false)
              //show add success msg to reporter
              //Alert.alert('تم قبول المقال بنجاح')
          })
          .catch((e)=>{
              Alert.alert("الرجاء معاودة المحاولة في وقت لاحق")
          })
          return () => subscriber();
    }else{
        Alert.alert("املأ جميع البيانات")
    }
  }

  const handleEdit = () => {
    if(productInfo.product_name.length >= 4){
        toggleOverlay()
        const subscriber = firestore()
          .collection('products')
          .doc(productInfo.productId)
          .update({...productInfo, photos: images})
          .then(() => {
            setVisible(false)
            //show add success msg to reporter
            //Alert.alert('تم تعديل المقال بنجاح')
          })
          .catch((e)=>{
            Alert.alert("الرجاء معاودة المحاولة في وقت لاحق")
         })
        return () => subscriber();
    }else{
        Alert.alert("املأ جميع البيانات")
    }
  }

   //toggle visibility for indicator
   const [visible, setVisible] = useState(false)
   const toggleOverlay = () => {
     setVisible(!visible)
   }
 
   //delete photo from image array
   const deletePhoto = (index) => {
       //TODO delete image from data
       setImages(images => (
            images.filter((value, i) => i !== index)
        ))
   }

  return(
        <>
        { props.cancelButton ?
            <Text style={CSS.title}>تعديل المنتج</Text> 
            : 
            <Text style={CSS.title}>إضافة منتج</Text> 
        }
        <ScrollView style={CSS.container} showsVerticalScrollIndicator={false}>
        <View style={[CSS.dateBlock, {marginTop:30}]}>
            <TextInput
                value={productInfo.product_name}
                style={[CSS.postInput,{width: '100%'}]}
                onChangeText={text=> setProductInfo({...productInfo,product_name: text})}
                maxLength={25}
                selectionColor="orange"
                placeholderTextColor="white"
                placeholder="اسم المنتجات"
                underlineColorAndroid='transparent'
              // autoFocus
            />
         </View>
         <Text style={{paddingLeft:5, color: productInfo.product_name.length < 5  ? 'red': 'green'}}>{productInfo.product_name.length}/25</Text>
         
         <View style={CSS.dateBlock}>
            <TextInput
                value={productInfo.price}
                style={CSS.postInputDate}
                onChangeText={text=> setProductInfo({...productInfo,price: text})}
                numberOfLines={1}
                maxLength={5}
                selectionColor="orange"
                placeholderTextColor="white"
                placeholder="السعر"
                keyboardType='numeric'
                underlineColorAndroid='transparent'
            />
            <Picker
                selectedValue={productInfo.category}
                style={CSS.postInputDate}
                onValueChange={(itemValue, itemIndex) => setProductInfo({...productInfo, category:itemValue})}>
                <Picker.Item style={{fontSize:15}} label="اختر الفئة" value="" />
                <Picker.Item label="انتيكا" value="انتيكا" />
                <Picker.Item label="ملابس" value="ملابس" />
                <Picker.Item label="مستلزمات" value="مستلزمات" />
                <Picker.Item label="اكسسوارات" value="اكسسوارات" />
                <Picker.Item label="الات" value="الات" />
                <Picker.Item label="فن" value="فن" />
                <Picker.Item label="غذاء" value="غذاء" />
                <Picker.Item label="دروس خصوصية" value="دروس خصوصية" />
            </Picker>
        </View>
        <Text style={{paddingLeft:7, color: productInfo.price.length < 1  ? 'red': 'green'}}>{productInfo.price.length}/5</Text>
        
        <TextInput
            value={productInfo.description}
            style={[CSS.postInput,{marginTop:12, textAlignVertical:'top'}]}
            onChangeText={text=> setProductInfo({...productInfo,description: text})}
            maxLength={125}
            selectionColor="orange"
            placeholderTextColor="white"
            placeholder="معلومات اضافية"
            underlineColorAndroid='transparent'
            numberOfLines={5}
            multiline
           // autoFocus
         />
         <Text style={{paddingLeft:7, color: productInfo.description.length < 5  ? 'red': 'green'}}>{productInfo.description.length}/125</Text>
        
         <TouchableOpacity onPress={() => choosePhotoFromLibrary()} style={CSS.imgBlock}>
                    <Icon 
                        iconName='photo'
                        size={70}
                        style={{marginTop:-5}}
                    />
                    {loadingImg ? <ActivityIndicator size={50}/> : null}
        </TouchableOpacity>
{/*       
        <View style={[CSS.dateBlock, {marginTop:10}]}>
            {props.cancelButton ?
                // TODO make this block a reusable component
                props.productInfo.photos.map( (item, index) => (
                    <View style={{flexDirection:'column',borderWidth:0, borderBottomColor:'#E39B02', alignItems:'center', backgroundColor:'rgba(0,0,0,0.2)'}}
                            key={index}>
                                <Image style={CSS.img} source={{uri: item}} />
                                <Button 
                                    iconName='delete' 
                                    iconSize={35}
                                    containerStyle={{
                                    margin:3,
                                    borderRadius:50,
                                    backgroundColor:'rgba(0,0,0,.35)',
                                    }}
                                    onPress={()=>deletePhoto(index)}
                                />
                    </View>
                ))
              : 
                images.map( (item, index) => (
                    <View style={{flexDirection:'column',borderWidth:0, borderBottomColor:'#E39B02',alignItems:'center', backgroundColor:'rgba(0,0,0,0.2)'}}
                            key={index}>
                        <Image style={CSS.img} source={{uri: item}} />
                        <Button 
                            iconName='delete' 
                            iconSize={35}
                            containerStyle={{
                            borderRadius:50,
                            backgroundColor:'rgba(0,0,0,.35)',
                            }}
                            onPress={()=>deletePhoto(index)}
                        />
                    </View>
                ))

                }
        </View>  */}
         
        <View style={CSS.buttonContainer}>
            <Button.ButtonDefault
                titleLeft="أغلق"
                containerStyle={{
                    borderRadius: 5,
                    backgroundColor: '#2C4770',
                    width:'45%',
                    marginTop:20,
                    justifyContent:'center',
                    padding:6
                }}
                textStyle={{ 
                    fontSize: 18, 
                    color:'#fff',
                    fontFamily:'Cairo-Bold'
                }}
                onPress={()=>props.setProductFormVisibility(false)}
            /> 
        { props.cancelButton  ?
            <Button.ButtonDefault
                titleLeft="تعديل"
                containerStyle={{
                    borderRadius: 5,
                    backgroundColor: '#2C4770',
                    width:'45%',
                    marginTop:20,
                    justifyContent:'center',
                    padding:6
                }}
                textStyle={{ 
                    fontSize: 18, 
                    color:'#fff',
                    fontFamily:'Cairo-Bold'
                }}
                onPress={() => handleEdit()}
            />
        :
            <Button.ButtonDefault
                titleLeft="حفظ"
                containerStyle={{
                    borderRadius: 5,
                    backgroundColor: '#2C4770',
                    width:'50%',
                    marginTop:20,
                    justifyContent:'center',
                    padding:6
                }}
                textStyle={{ 
                    fontSize: 18, 
                    color:'#fff',
                    fontFamily:'Cairo-Bold'
                }}
                onPress={() => handleSubmit()}
                />
        }
        </View>

        <Overlay isVisible={visible} 
                onBackdropPress={toggleOverlay} 
                fullScreen={true}
                overlayStyle={{
                    padding:0, 
                    width:'96%',
                    height:'96%', 
                    borderRadius:15,
                    backgroundColor:'rgba(255,255,255,0.7)',
                    }}>
                <ActivityIndicator size={100} color="#2C4770" marginTop={'50%'} />
                <Text style={CSS.loading}>يرجى الانتظار أثناء التحميل</Text>
        </Overlay>
    </ScrollView>
    </>
    )
 }

const CSS = StyleSheet.create({
  container:{
    flex:1,
    padding:7,
  },
  title: {
    width:'100%',
    fontSize: 30,
    textAlign: 'center',
    color:'#fff',
    backgroundColor:'#2C4770',
    fontFamily:'Cairo-Bold',
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  postInput: {
    fontSize: 15,
    borderBottomColor:'#2C4770',
    borderBottomWidth:3,
    marginTop:10,
    fontFamily: "Cairo-Regular",
    textAlign:'right',
    color: 'white',
    borderRadius:0,
    paddingRight:10,
    backgroundColor:'rgba(0,0,0,0.5)',
  },
  postInputDate: {
    width:'48%',
    textAlignVertical:'top',
    fontSize: 15,
    borderBottomColor:'#2C4770',
    borderBottomWidth:3,
    margin:0,
    fontFamily: "Cairo-Regular",
    textAlign:'center',
    backgroundColor:'rgba(0,0,0,0.5)',
    color: 'white',
  },
  dateBlock: {
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:10,
    marginBottom:5
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  imgBlock:{
    flex:1,
    justifyContent:'center',
    resizeMode:'contain',
    alignItems:'center',
    margin:7
  },
  img: {
    width: Dimensions.get('window').width/3.7,
    height: 120,
    resizeMode:'cover',
  },
  loading: {
    textAlign:'center',
    fontSize: 20,
    color:'#2C4770'
  }
});

