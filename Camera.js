import React, {useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  LogBox
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

LogBox.ignoreAllLogs();

const App = () => {

  const [cameraPhotos , setCameraPhotos] = useState();
  const [galleryPhotos , setGalleryPhotos] = useState();


  let options = {
    // saveToPhotos: true,
    mediaType: "photo",
  }

  const openCamera = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const result = await launchCamera(options)
      setCameraPhotos(result.assets[0].uri)
      console.log(cameraPhotos)
    }
  }
  
  const openGellery = async () => {
    const result = await launchImageLibrary(options)
    setGalleryPhotos(result.assets[0].uri)
  }

  return (
        <View style={styles.container}>
            
            <TouchableOpacity style={styles.HeaderBtn} onPress={() => openCamera()} >
              <Text style={styles.Txt} >OPEN Camera</Text>
            </TouchableOpacity>

            <Image style={styles.highlight} source={{uri: cameraPhotos}} />

            <TouchableOpacity style={styles.HeaderBtn} onPress={() => openGellery()} >
              <Text style={styles.Txt} >OPEN Gallery</Text>
            </TouchableOpacity>
            
            <Image style={styles.highlight} source={{uri: galleryPhotos}} />
        
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "violet"
  },
  Txt: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  HeaderBtn: {
    height: 50,
    width: 180,
    marginTop: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6
  },
  highlight: {
    height: 150,
    width: 150,
    marginTop: 10,
    // backgroundColor: "#000",
    borderRadius: 12
  },
});

export default App;
