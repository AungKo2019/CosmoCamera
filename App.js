import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Alert, FlatList, Button, Text, View, Image, TouchableOpacity, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FontAwesome5 } from 'react-native-vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [show, setShow] = useState(false)
  const [orientation, setOrientation] = useState(null);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    async function fetchInitialOrientation() {
      const initialOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(initialOrientation);
    }

    fetchInitialOrientation();

    const orientationChangeListener = ScreenOrientation.addOrientationChangeListener(
      (newOrientation) => {
        setOrientation(newOrientation.orientationInfo.orientation);
      }
    );

    return () => {
      orientationChangeListener.remove();
    };

  }, []);

  const openCamera = () => {
    setShow(true)
    //takePicture();
  }

  const StopCamera = () => {
    setShow(false)
  }

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setPhotos((prevPhotos) => [{ uri: photo.uri }, ...prevPhotos]);
    }
  };


  const RemovePhoto = (photo) => {
    Alert.alert('Delete Photo', 'Are you sure you want to Delete this photo', [
      {
        text: 'Yes',
        onPress: () => {
          var newArrayList = [];
          newArrayList = photos.filter(item => item.uri != photo);
          setPhotos(newArrayList)
        }
      },
      {
        text: 'No',
        //onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);


  }


  return (
    <View style={styles.container}>
      {
        show ? (
          <View>
            {
              orientation == "1" ?
                (
                  <View style={styles.cameraView}>
                    <Camera style={styles.cameraSize1} type={Camera.Constants.Type.back} ref={(ref) => setCameraRef(ref)} />
                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                      <View style={[styles.input, { width: wp(44.5), flexDirection: 'row', alignItems: 'center' }]}>
                        <TouchableOpacity onPress={takePicture} style={{ width: wp(40), flexDirection: 'row', justifyContent: "center", alignItems: 'center' }}>
                          <FontAwesome5 name='images' size={20} color='blue' />
                          <Text style={{ paddingLeft: 10, fontWeight: '300' }}>Take</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.input, { width: wp(44.5), flexDirection: 'row', alignItems: 'center', marginLeft: wp(5.5) }]}>
                        <TouchableOpacity onPress={StopCamera} style={{ width: wp(40), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          <FontAwesome5 name='camera' size={20} color='blue' />
                          <Text style={{ paddingLeft: 10, fontWeight: '300' }}>Stop</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={[styles.cameraView, { marginTop: hp(4.5) }]}>
                    <View style={{ flexDirection: 'row' }}>
                      <Camera style={styles.cameraSize2} type={Camera.Constants.Type.back} ref={(ref) => setCameraRef(ref)} />
                      <View style={{ marginLeft: wp(6), justifyContent: 'center' }}>
                        <View style={styles.btn}>
                          <TouchableOpacity onPress={takePicture} style={{ flexDirection: 'row', justifyContent: "center", alignItems: 'center' }}>
                            <FontAwesome5 name='images' size={20} color='blue' />
                            <Text style={{ paddingLeft: 5, fontWeight: 'bold' }}>Take</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={[styles.btn, { marginTop: hp(5) }]}>
                          <TouchableOpacity onPress={StopCamera} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome5 name='camera' size={20} color='blue' />
                            <Text style={{ paddingLeft: 5, fontWeight: 'bold' }}>Stop</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                  </View>
                )
            }
          </View>

        ) : (
          <View>
            {
              orientation == "1" ?
                (
                  <View style={styles.photoView}>
                    <View style={{ marginTop: hp(8), alignItems: "center", justifyContent: 'center' }}>
                      <Text style={{ fontSize: hp(3), fontWeight: "bold" }}>Cosmo</Text>
                    </View>
                    <View style={{ marginTop: hp(5), width: wp(95), marginHorizontal: 15, alignItems: "centers" }}>
                      <Text style={{ fontSize: hp(2), fontWeight: 'bold' }}>Photos</Text>
                      {/* {selectedImages.length > 0 ? ( */}
                      <View style={[styles.input, { height: hp(30) }]}>
                        <FlatList
                          data={photos}
                          keyExtractor={(item) => item.uri}
                          horizontal
                          renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => RemovePhoto(item.uri)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                              <Image source={{ uri: item.uri }} resizeMode='cover' style={{ width: wp(30), height: hp(25), backgroundColor: "white", marginLeft: wp(2) }} />
                            </TouchableOpacity>

                          )}
                        />
                      </View>

                      <View style={{ flexDirection: 'row', marginTop: hp(1) }}>

                        <View style={[styles.input, { width: wp(44.5), flexDirection: 'row', alignItems: 'center', marginLeft: wp(1) }]}>
                          <TouchableOpacity onPress={openCamera} style={{ width: wp(40), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome5 name='camera' size={20} color='blue' />
                            <Text style={{ paddingLeft: 10, fontWeight: '300' }}>Camera</Text>
                          </TouchableOpacity>
                        </View>
                      </View>



                    </View>
                  </View>
                ) :
                (
                  <View style={styles.photoView}>
                    <View style={{ marginTop: hp(5), alignItems: "center", justifyContent: 'center' }}>
                      <Text style={{ fontSize: hp(3), fontWeight: "bold" }}>Cosmo</Text>
                    </View>
                    <View style={{ marginTop: hp(0), width: wp(95), marginHorizontal: 15, alignItems: "centers" }}>
                      <Text style={{ fontSize: hp(2), fontWeight: 'bold' }}>Photos</Text>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={[styles.input, { height: hp(33), width: wp(160) }]}>
                          <FlatList
                            data={photos}
                            keyExtractor={(item) => item.uri}
                            horizontal
                            renderItem={({ item }) => (
                              <TouchableOpacity onPress={() => RemovePhoto(item.uri)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={{ uri: item.uri }} resizeMode='cover' style={{ width: wp(30), height: hp(25), backgroundColor: "white", marginLeft: wp(2) }} />
                              </TouchableOpacity>
                            )}
                          />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems:"center",marginLeft:wp(2) }}>
                          <View style={[styles.input, { width: wp(44.5), flexDirection: 'row', alignItems: 'center', marginLeft: wp(1),height:hp(15),width:wp(30),borderRadius:100 }]}>
                            <TouchableOpacity onPress={openCamera} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                              <FontAwesome5 name='camera' size={20} color='blue' />
                              <Text style={{ paddingLeft: 10, fontWeight: '300' }}>Camera</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>




                    </View>
                  </View>
                )
            }
          </View>

        )
      }


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#F5DD61',

  },
  input: {
    fontSize: hp(1.6),
    height: hp(6),
    width: wp(90),
    borderWidth: 1 / 2,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    marginTop: hp(0.5),
    elevation: 7,
    borderColor: '#4497ffff',
    shadowColor: 'black',
    backgroundColor: 'white'
  },
  cameraView: {
    marginTop: hp(7),
    marginHorizontal: 10,
  },
  cameraSize1: {
    width: wp(95),
    height: hp(70),
  },
  cameraSize2: {
    width: wp(155),
    height: hp(43),
  },

  btn: {
    width: wp(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    fontSize: hp(1.6),
    height: hp(15),
    borderWidth: 1,
    // paddingLeft: 10,
    // paddingRight: 10,
    borderRadius: 100,
    //marginTop: hp(0.5),
    // elevation: 7,
    borderColor: '#4497ffff',
    //shadowColor: 'black',
    backgroundColor: 'white'
  },

  photoView: {

  },

});
