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
import {Badge, Overlay} from 'react-native-elements' 
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import Icon from '../elements/Icon';
import Button from '../elements/Button'
import {Picker} from '@react-native-picker/picker'

export default function AddProductForm(props) {

  //props.userInfo
  //HINT for edit purposes call AddProductForm from productCard and pass to it productInfo/Item
  const [productInfo, setProductInfo] = useState(props.EditProduct ? 
    props.productInfo
    :  
    {
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
  const [loadingImg, setLoadingImg] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const choosePhotoFromLibrary = () => {
    setErrMsg('')
    ImagePicker.openPicker({
      width: undefined,
      height: 400,
      multiple: true,
      //cropping: true,
    }).then((image) => {
        if((image.length + images.length)<=5){
          image.map(item => {
            const imageUri = Platform.OS === 'ios' ? item.sourceURL : item.path;
            uploadImage(imageUri)
          }) 
        }else{
          setErrMsg('من فضلك لا تختار أكثر من 5 صور')
        } 
    })
    .catch((e) =>{
        setErrMsg('حدث خطأ ما أثناء تحميل الصورة')
    })
  }

  const uploadImage =  async (img) => {
        setLoadingImg(true)
        const uploadUri = img;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)
        let directory = productInfo.seller.id

        // Add timestamp to File Name
        const extension = filename.split('.').pop() 
        const name = filename.split('.').slice(0, -1).join('.')
        filename = name + Date.now() + '.' + extension
        const storageRef = storage().ref(`products/${directory}/${filename}`)
        const task = storageRef.putFile(uploadUri)
        try {
            await task
            const url = await storageRef.getDownloadURL()
            setImages(images => [...images,url])
            setLoadingImg(false)
        } catch (e) {
          setErrMsg('!حدث خطأ ما أثناء تحميل الصورة')
        }
  }

  const handleSubmit = () => {
    //TODO handle if statements in such away it return the exact missing information
    setErrMsg('')
    setSuccessMsg('')
    if(productInfo.product_name.length >= 4 
        && productInfo.category!=='' 
        && images.length>0 
        && productInfo.price.length > 0 
        && productInfo.description.length >= 5
        && images.length >=1 ){
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
                  date_listed: {seconds: Math.floor(Date.now() / 1000)} //firestore.FieldValue.serverTimestamp(),
                })
                setImages([])
                setVisible(false)
                //show add success msg to reporter
                setSuccessMsg('تم قبول المنتج بنجاح')
            })
            .catch((e)=>{
              setErrMsg("الرجاء معاودة المحاولة في وقت لاحق")
            })
            return () => subscriber();
    }else{
      setErrMsg("املأ جميع البيانات")
    }
  }

  const handleEdit = () => {
    setErrMsg('')
    setSuccessMsg('')
    if(productInfo.product_name.length >= 4 
      && productInfo.category!=='' 
      && images.length>0 
      && productInfo.price.length > 0 
      && productInfo.description.length >= 5
      && images.length >=1 ){
          toggleOverlay()
          const subscriber = firestore()
            .collection('products')
            .doc(productInfo.productId)
            .update({...productInfo, photos: images})
            .then(() => {
              //show add success msg to reporter
              setSuccessMsg('تم تعديل المنتج بنجاح')
              //hide indicator (loading/editing msg)
              setVisible(false)
            })
            .catch((e)=>{
              setErrMsg("الرجاء معاودة المحاولة في وقت لاحق")
          })
          return () => subscriber();
    }else{
      setErrMsg("املأ جميع البيانات")
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
        { props.EditProduct ?
            <Text style={CSS.title}>تعديل المنتج</Text> 
            : 
            <Text style={CSS.title}>إضافة منتج</Text> 
        }
        <ScrollView style={CSS.container} showsVerticalScrollIndicator={false}>
        <View style={[CSS.dateBlock, {marginTop:0}]}>
            <TextInput
                value={productInfo.product_name}
                style={[CSS.postInput,{width: '100%'}]}
                onChangeText={text=> setProductInfo({...productInfo,product_name: text})}
                maxLength={25}
                selectionColor="white"
                placeholderTextColor='#2C4770'
                placeholder="اسم المنتجات"
                underlineColorAndroid='transparent'
            />
         </View>
         <Text style={{paddingLeft:5, color: productInfo.product_name.length < 5  ? '#AF0F02': '#119935'}}>{productInfo.product_name.length}/25</Text>
         
         <View style={CSS.dateBlock}>
            <TextInput
                value={productInfo.price}
                style={CSS.postInputDate}
                onChangeText={text=> setProductInfo({...productInfo,price: text})}
                numberOfLines={1}
                maxLength={7}
                selectionColor="white"
                placeholderTextColor='#2C4770'
                placeholder="السعر"
                keyboardType='numeric'
                underlineColorAndroid='transparent'
            />
            <Picker
                selectedValue={productInfo.category}
                style={CSS.postInputDate}
                onValueChange={(itemValue, itemIndex) => setProductInfo({...productInfo, category:itemValue})}>
                <Picker.Item style={{fontSize:15}} label="اختر الفئة" value="" />
                <Picker.Item label="سيارات" value="سيارات" />
                <Picker.Item label="الكترونيات" value="الكترونيات" />
                <Picker.Item label="ادوات" value="ادوات" />
                <Picker.Item label="الات" value="الات" />
                <Picker.Item label="اثاث" value="اثاث" />
                <Picker.Item label="انتيكا" value="انتيكا" />
                <Picker.Item label="ورش عمل" value="ورش عمل" />
                <Picker.Item label="ملابس" value="ملابس" />
                <Picker.Item label="مستلزمات" value="مستلزمات" />
                <Picker.Item label="اكسسوارات" value="اكسسوارات" />
                <Picker.Item label="خدمات" value="خدمات" />
                <Picker.Item label="فن" value="فن" />
                <Picker.Item label="غذاء" value="غذاء" />
                <Picker.Item label="دروس خصوصية" value="دروس خصوصية" />
            </Picker>
        </View>
        <Text style={{paddingLeft:7, color: productInfo.price.length < 1  ? '#AF0F02': '#119935'}}>{productInfo.price.length}/7</Text>
        
        <TextInput
            value={productInfo.description}
            style={[CSS.postInput,{marginTop:10, textAlignVertical:'top'}]}
            onChangeText={text=> setProductInfo({...productInfo,description: text})}
            maxLength={125}
            selectionColor="white"
            placeholderTextColor='#2C4770'
            placeholder="معلومات اضافية"
            underlineColorAndroid='transparent'
            numberOfLines={4}
            multiline
         />
         <Text style={{paddingLeft:7, color: productInfo.description.length < 5  ? '#AF0F02': '#119935'}}>{productInfo.description.length}/125</Text>
        
        <View style={CSS.imagesContainer}>
            <TouchableOpacity onPress={() => choosePhotoFromLibrary()} style={CSS.iconBlock}>
                    <Text style={{color:'#2C4770', fontFamily:'Cairo-Regular', fontSize:12}}>تحميل الصور</Text>
                    <Icon iconName='photo' size={50} />
                    {loadingImg ? <ActivityIndicator size={20} color='#2C4770'/> : null}
            </TouchableOpacity>
        
           
            { images.length !== 0 ?
                 <ScrollView  style={{height:170}} horizontal={true}>
                    {
                    images.map( (item, index) => (
                        <View style={CSS.imgBlock} key={index}>
                            <Image style={CSS.img} source={{uri: item}} />
                            <Button.ButtonDefault
                                iconName='delete' 
                                iconSize={30}
                                onPress={()=>deletePhoto(index)}
                                containerStyle={{
                                      backgroundColor:'rgba(255,255,255,0.5)',
                                      borderRadius: 50,
                                      padding:2,
                                      margin:5
                                  }}/>
                        </View>
                    ))
                    } 
                </ScrollView>
                : 
                null
            }

          <Badge
            status={images.length > 0 ? "success" : "error"}
            value={images.length > 0 ? "✓" : "✘"}
            containerStyle={{ position: 'absolute', bottom: 3, left: 5}}
            textStyle={{fontSize:10}} 
            />
       
        </View> 

        <View style={{margin:10}}>
          {successMsg === '' ? null :  <Text style={{color:'#119935', alignSelf:'center', fontFamily:'Cairo-Regular'}}>{successMsg}</Text>}
          {errMsg === '' ? null :  <Text style={{color:'#AF0F02', alignSelf:'center', fontFamily:'Cairo-Regular'}}>{errMsg}</Text>}
        </View>

        <View style={CSS.buttonContainer}>
            <Button.ButtonDefault
                titleLeft="أغلق"
                containerStyle={{
                    borderRadius: 5,
                    backgroundColor: '#2C4770',
                    width:'45%',
                    justifyContent:'center',
                    padding: 4
                }}
                textStyle={{ 
                    fontSize: 18, 
                    color:'#fff',
                    fontFamily:'Cairo-Regular'
                }}
                onPress={()=>props.setProductFormVisibility(false)}
            /> 
        { props.EditProduct  ?
            <Button.ButtonDefault
                titleLeft="تعديل"
                containerStyle={{
                    borderRadius: 5,
                    backgroundColor: '#2C4770',
                    width:'45%',
                    justifyContent:'center',
                    padding: 4
                }}
                textStyle={{ 
                    fontSize: 18, 
                    color:'#fff',
                    fontFamily:'Cairo-Regular'
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
                    justifyContent:'center',
                    padding: 4
                }}
                textStyle={{ 
                    fontSize: 18, 
                    color:'#fff',
                    fontFamily:'Cairo-Regular'
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
                    height:'100%', 
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
    fontSize: 25,
    textAlign: 'center',
    color:'#fff',
    backgroundColor:'#2C4770',
    fontFamily:'Cairo-Regular',
    padding: 5,
    //borderTopLeftRadius: 10,
    //borderTopRightRadius: 10,
    letterSpacing:5
  },
  postInput: {
    fontSize: 15,
    borderBottomColor:'#2C4770',
    borderBottomWidth:3,
    marginTop:5,
    fontFamily: "Cairo-Regular",
    textAlign:'right',
    color: '#2C4770',
    borderRadius:5,
    paddingRight:10,
    backgroundColor:'#ACC6F8'
  },
  postInputDate: {
    width:'48%',
    //textAlignVertical:'top',
    fontSize: 15,
    borderBottomColor:'#2C4770',
    borderBottomWidth:3,
    margin:0,
    borderRadius:5,
    fontFamily: "Cairo-Regular",
    textAlign:'center',
    backgroundColor:'#ACC6F8',
    color: '#2C4770',
  },
  dateBlock: {
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:10,
    marginBottom:5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    alignSelf:'center',
    marginBottom:10
  },
  iconBlock:{
    width:130,
    height:130,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#fff',
    alignSelf:'center',
    borderRadius:100,
    marginTop:-70,
    borderWidth:2,
    borderColor:'#2C4770',
    overflow:'hidden',
    padding:10
  },
  img: {
    width: Dimensions.get('window').width/3.5,
    height: 130,
    resizeMode:'cover',
  },
  imgBlock:{
    alignItems:'center', 
    borderWidth:0.2, 
    borderColor:'rgba(255,255,255,0.5)', 
    margin:5,
    borderRadius: 5,
    overflow:'hidden'
  },
  loading: {
    textAlign:'center',
    fontSize: 20,
    color:'#2C4770',
    fontFamily:'Cairo-Bold',
  },
  imagesContainer:{
    fontSize: 15,
    borderBottomColor:'#2C4770',
    borderBottomWidth:3,
    marginTop:60,
    backgroundColor:'#ACC6F8',
    paddingBottom: 5,
    height: 260,
    borderRadius: 5,
  }
});

