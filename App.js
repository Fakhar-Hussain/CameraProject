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

import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';


LogBox.ignoreAllLogs();

const App = () => {

  const [cameraPhotos , setCameraPhotos] = useState();
  const [galleryPhotos , setGalleryPhotos] = useState();


  const openCameras = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      
      ImagePicker.openCamera({
        mediaType: 'photo',
        includeBase64: true,
      }).then(image => {
        const cameraImages = image;
        const base64Data = image.data;
        const fileName = getUniqueFileName('jpg');
        writeFileToStorage(base64Data, fileName, cameraImages);
        setCameraPhotos(image.path)
        console.log(image.path);
      }).catch( (e) => alert(e.message))
    }
  }
  
        
  const openGellery = async () => {
    ImagePicker.openPicker({
      cropping: true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
    }).then(image => {
      setGalleryPhotos(image.path)
      console.log(image.path);
    }).catch( (e) => alert(e.message))
  }
  
  const RemoveImages = async () => {
    ImagePicker.clean()
      .then(() => {
      console.log("All Images Clear ");
      setGalleryPhotos() == null
      setCameraPhotos() == null
    }).catch(e => {
      alert(e.message);
    });
    
  }  
  

  


  const getUniqueFileName = (fileExt) => {
    //It is better naming file with current timestamp to achieve unique name
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var fileName = 'IMG' + year + month + date + hour + minute + '.' + fileExt;
    console.log(fileName)
    return fileName;
  };
  
  const writeFileToStorage = async (base64Data, fileName, cameraImages) => {
    try {
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      if (result == PermissionsAndroid.RESULTS.GRANTED) {
        const dirs = RNFetchBlob.fs.dirs;
        var folderPath = dirs.SDCardDir + "/Pictures/";
        var fullPath = folderPath  + fileName;
        console.log(fullPath)
        
        RNFetchBlob.fs.isDir(folderPath)
        .then((isDir) => {
          if (isDir) {
            RNFetchBlob.fs.writeFile(fullPath, base64Data, 'base64')
            .then(() => {
              console.log('Your Image is Saved Successfully');
              // console.log(Path);
              RNFetchBlob.fs.scanFile([{ path: fullPath, mime: cameraImages.mime }])
              .then(() => console.log("Scan Complete"))
            });
          }
          else{
            RNFetchBlob.fs.mkdir(folderPath)
            .then(() => {
              console.log('Your Folder is Created on: ' + folderPath);
              RNFetchBlob.fs.writeFile(fullPath, base64Data, 'base64')
              .then(() => {
                console.log('Your Folder is Created and Saved');
                RNFetchBlob.fs.scanFile([{ path: cameraImages.path, mime: cameraImages.mime }])
                .then( () => console.log("Scan Completed") )
              });
            });
          }
        });

        
          } else {
            console.log('Permission Not Granted');
          }
        } catch (err) {
          console.log(err);
        }
      };







  return (
        <View style={styles.container}>
            
            <TouchableOpacity style={styles.HeaderBtn} onPress={() => openCameras()} >
              <Text style={styles.Txt} >OPEN Camera</Text>
            </TouchableOpacity>

            <Image style={styles.highlight} source={{uri: cameraPhotos}} />

            <TouchableOpacity style={styles.HeaderBtn} onPress={() => openGellery()} >
              <Text style={styles.Txt} >OPEN Gallery</Text>
            </TouchableOpacity>
            
            <Image style={styles.highlight} source={{uri: galleryPhotos}} />
        
            <TouchableOpacity style={styles.HeaderBtn} onPress={() => RemoveImages()} >
              <Text style={styles.Txt} >Remove Images</Text>
            </TouchableOpacity>

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
