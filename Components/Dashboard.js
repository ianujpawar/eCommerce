// import React, {Component} from 'react';
// import {
//   View,
//   Text,
//   StatusBar,
//   StyleSheet,
//   ImageBackground,
//   FlatList,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   BackHandler,
//   ActivityIndicator,
//   Alert,
//   Button,
//   Modal,
// } from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/dist/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {RNCamera} from 'react-native-camera';

// let total = 0;
// const dataSource = [
//   {
//     barcodeId: 'ABC-abc-0002',
//     name: 'Jeans',
//     price: 2000,
//     qty: 1,
//   },
//   {
//     barcodeId: 'ABC-abc-0003',
//     name: 'T-Shirt',
//     price: 100,
//     qty: 1,
//   },
// ];

// class Dashboard extends Component {
//   constructor(props) {
//     super(props);
//     this.camera = null;
//     this.barcodeArray = [];
//     this.state = {
//       mobile: '',
//       scanView: false,
//       isLoading: false,
//       filtermodel: false,
//       barcode: [],
//       dataSource: [],
//       camera: {
//         type: RNCamera.Constants.Type.back,
//         flashMode: RNCamera.Constants.FlashMode.auto,
//       },
//     };

//     this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
//   }

//   componentDidMount() {
//     AsyncStorage.getItem('token').then(token => {
//       this.setState({token: token});
//       this.fetchData();
//     });
//     AsyncStorage.getItem('scan').then(value => {
//       // this.setState({
//       //   scan: JSON.parse(value),
//       // });
//       if (value) {
//         this.barcodeArray = JSON.parse(value);
//       }
//     });

//     const {navigation} = this.props;
//     this.focusListener = navigation.addListener('focus', () => {
//       AsyncStorage.getItem('scanData').then(value => {
//         this.setState({
//           scanData: value,
//           scanView: false,
//         });
//       });
//     });

//     BackHandler.addEventListener(
//       'hardwareBackPress',
//       this.handleBackButtonClick,
//     );
//   }

//   componentWillUnmount() {
//     BackHandler.removeEventListener(
//       'hardwareBackPress',
//       this.handleBackButtonClick,
//     );
//   }

//   handleBackButtonClick = () => {
//     if (this.state.scanView == true) {
//       this.setState({scanView: false});
//     } else {
//       Alert.alert('Hold on!', 'Are you sure want to exit?', [
//         {
//           text: 'Cancel',
//           onPress: () => null,
//           style: 'cancel',
//         },
//         {text: 'YES', onPress: () => BackHandler.exitApp()},
//       ]);
//     }
//     return true;
//   };

//   fetchData = () => {
//     this.setState({
//       isLoading: true,
//     });
//     const token = this.state.token;
//     console.log('toekn', token);
//     //POST request
//     fetch(`https://noqueue1.herokuapp.com/v1/dummy-inventory`, {
//       method: 'GET', //Request Type
//       // body: JSON.stringify({
//       //   username: this.state.username,
//       //   password: this.state.password,
//       // }),
//       headers: {
//         //Header Defination
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer ' + token,
//       },
//     })
//       .then(response => response.json())
//       .then(responseJson => {
//         console.log('dataResponse', responseJson);
//         this.setState(
//           {
//             isLoading: false,
//             dataSource: responseJson,
//           },
//           function () {},
//         );
//       })
//       .catch(error => {
//         // alert(JSON.stringify(error));
//         // console.error(error);
//       });
//   };

//   onBarCodeRead(scanResult) {
//     console.warn(scanResult.type);
//     console.warn(scanResult.data);
//     if (scanResult.data != null) {
//       console.warn('onBarCodeRead call');
//       this.scanData(scanResult.data);
//       this.setState({scanView: false});
//     }
//     return;
//   }

//   async takePicture() {
//     if (this.camera) {
//       const options = {quality: 0.5, base64: true};
//       const data = await this.camera.takePictureAsync(options);
//       console.log(data.uri);
//       alert(data.uri);
//     }
//   }

//   pendingView() {
//     return (
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: 'lightgreen',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <Text>Waiting</Text>
//       </View>
//     );
//   }

//   scanData(code) {
//     if (this.state.dataSource != null) {
//       for (let i = 0; i < this.state.dataSource.length; i++) {
//         if (code == this.state.dataSource[i].barcodeId) {
//           this.barcodeArray.push(this.state.dataSource[i]);
//           AsyncStorage.setItem(
//             'barcodeData',
//             JSON.stringify(this.barcodeArray),
//           );
//           break;
//         } else {
//           console.log('no');
//         }
//       }
//     }
//   }

//   onAdd = (item, index) => {
//     let products = [...this.barcodeArray];
//     products[index].defaultQuantity += 1;
//     this.barcodeArray = products;
//     this.fetchData();
//   };
//   onMinus = (item, index) => {
//     let products = [...this.barcodeArray];
//     // if (products[index].defaultQuantity == 1) {
//     // } else {
//     products[index].defaultQuantity -= 1;
//     // }
//     this.barcodeArray = products;
//     this.fetchData();
//   };
//   empty = () => {
//     this.barcodeArray.length = 0;
//     this.fetchData();
//     console.log(this.barcodeArray);
//   };
//   payment = () => {
//     // this.setState({payment:true})
//     alert('Payment Successfull');
//   };
//   render() {
//     console.log('barcodeArray', this.barcodeArray);
//     console.log('dataSource', this.state.dataSource);
//     console.log('discountAmount', this.state.discountAmount);
//     if (this.state.isLoading) {
//       return (
//         <View
//           style={{
//             flex: 1,
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             flexDirection: 'row',
//             width: '40%',
//             alignSelf: 'center',
//           }}>
//           <ActivityIndicator size={25} color={'#404585'} />
//           <Text style={{fontSize: 18, color: '#404585'}}>Please wait</Text>
//         </View>
//       );
//     }
//     total = 0;

//     if (this.barcodeArray != null) {
//       for (let i = 0; i < this.barcodeArray.length; i++) {
//         total += parseInt(
//           this.barcodeArray[i].finalRetailPrice *
//             this.barcodeArray[i].defaultQuantity,
//         );
//       }
//     }

//     return (
//       <SafeAreaView style={styles.bg}>
//         {this.state.scanView == false ? (
//           <ImageBackground
//             source={require('./Image/background.jpeg')}
//             style={styles.bg}
//             resizeMode="stretch">
//             <View style={styles.topView}>
//               <View style={styles.topContent}>
//                 <TouchableOpacity>
//                   <Icon name="menu" style={{fontSize: 27, color: '#323232'}} />
//                 </TouchableOpacity>
//                 <Image
//                   source={require('./Image/signupLogo.png')}
//                   style={styles.logo}
//                 />
//               </View>
//             </View>
//             <View style={styles.mainView}>
//               <View style={styles.cartView}>
//                 <Icon
//                   name="shopping-cart"
//                   style={{fontSize: 25, color: '#404585'}}
//                 />
//                 <Text style={styles.cartTitle}>Your current cart</Text>
//               </View>
//               <ScrollView>
//                 <View style={{height: 340}}>
//                   {this.barcodeArray == null || this.barcodeArray == '' ? (
//                     <View style={styles.NullDataView}>
//                       <Text style={styles.NullDataText}>
//                         Open camera scanner to start scanning products
//                       </Text>
//                     </View>
//                   ) : (
//                     <FlatList
//                       data={this.barcodeArray}
//                       renderItem={({item, index}) => (
//                         <View style={styles.flatDataView}>
//                           <View
//                             style={{
//                               flexDirection: 'row',
//                             }}>
//                             <View
//                               style={{
//                                 margin: 20,
//                                 width: '90%',
//                                 marginTop: 0,
//                               }}>
//                               <View
//                                 style={{
//                                   flexDirection: 'row',
//                                   justifyContent: 'space-between',
//                                   alignItems: 'center',
//                                 }}>
//                                 <Text numberOfLines={1} style={styles.nameText}>
//                                   {item.itemName}
//                                 </Text>
//                               </View>
//                               <View style={styles.qtyView}>
//                                 <Text style={{color: '#323232'}}>
//                                   Quantity :
//                                 </Text>

//                                 <View style={styles.qtybuttonView}>
//                                   <TouchableOpacity
//                                     onPress={() => {
//                                       if (item.defaultQuantity == 1) {
//                                         this.empty();
//                                       } else {
//                                         this.onMinus(item, index);
//                                       }
//                                     }}
//                                     style={styles.minusView}>
//                                     <Icon
//                                       name="remove"
//                                       style={styles.minusIcon}
//                                     />
//                                   </TouchableOpacity>
//                                   <Text
//                                     style={{
//                                       fontSize: 17,
//                                       color: '#323232',
//                                     }}>
//                                     {item.defaultQuantity}
//                                   </Text>
//                                   <TouchableOpacity
//                                     onPress={() => {
//                                       this.onAdd(item, index);
//                                     }}
//                                     style={styles.minusView}>
//                                     <Icon name="add" style={styles.minusIcon} />
//                                   </TouchableOpacity>
//                                 </View>
//                               </View>
//                               <Text style={{color: '#323232'}}>
//                                 Store Name : {item.storeName}
//                               </Text>

//                               <View
//                                 style={{
//                                   flexDirection: 'row',
//                                   justifyContent: 'space-between',
//                                   alignItems: 'center',
//                                   marginTop: 5,
//                                 }}>
//                                 <View
//                                   style={{
//                                     flexDirection: 'row',

//                                     alignItems: 'center',
//                                   }}>
//                                   <Text style={{color: '#323232'}}>
//                                     Price :
//                                   </Text>
//                                   <View
//                                     style={{
//                                       flexDirection: 'row',
//                                       alignItems: 'center',
//                                     }}>
//                                     <Text
//                                       style={{
//                                         fontSize: 14,
//                                         fontWeight: '500',
//                                         color: '#323232',
//                                         textDecorationLine: 'line-through',
//                                       }}>
//                                       {' '}
//                                       ₹{' '}
//                                       {item.retailPrice * item.defaultQuantity}
//                                     </Text>
//                                     <Text
//                                       style={{
//                                         fontSize: 16,
//                                         fontWeight: '700',
//                                         color: '#404585',
//                                         marginLeft: 10,
//                                       }}>
//                                       ₹{' '}
//                                       {item.finalRetailPrice *
//                                         item.defaultQuantity}
//                                     </Text>
//                                   </View>
//                                 </View>
//                                 <Text style={{color: '#323232'}}>
//                                   Discount Amount :{item.discountAmount}
//                                 </Text>
//                               </View>
//                             </View>
//                           </View>
//                         </View>
//                         // </View>
//                       )}
//                       keyExtractor={({barcodeId}, index) => barcodeId}
//                     />
//                   )}
//                 </View>
//                 {/* )} */}
//               </ScrollView>
//               <View
//                 style={{
//                   position: 'absolute',
//                   top: 395,
//                   height: 70,
//                 }}>
//                 {this.barcodeArray == '' ? null : (
//                   <View>
//                     <View style={styles.total}>
//                       <Text style={styles.totalText}>Total : ₹ {total}</Text>
//                     </View>
//                     <View style={styles.button}>
//                       <TouchableOpacity
//                         onPress={() => {
//                           this.empty();
//                         }}
//                         style={styles.touchButton}>
//                         <Text style={styles.touchText}>Clear Cart</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         onPress={() => {
//                           this.setState({
//                             filtermodel: true,
//                           });
//                         }}
//                         style={styles.touchButton1}>
//                         <Text style={styles.touchText1}>Finish</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 )}
//               </View>
//               <View style={styles.cemera}>
//                 <TouchableOpacity
//                   onPress={() => {
//                     this.setState({scanView: true});
//                   }}>
//                   <Icon
//                     name="photo-camera"
//                     style={{fontSize: 45, color: '#323232'}}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </ImageBackground>
//         ) : (
//           <View style={styles.container}>
//             <RNCamera
//               ref={ref => {
//                 this.camera = ref;
//               }}
//               defaultTouchToFocus
//               flashMode={this.state.camera.flashMode}
//               mirrorImage={false}
//               onBarCodeRead={this.onBarCodeRead.bind(this)}
//               onFocusChanged={() => {}}
//               onZoomChanged={() => {}}
//               permissionDialogTitle={'Permission to use camera'}
//               permissionDialogMessage={
//                 'We need your permission to use your camera phone'
//               }
//               style={styles.preview}
//               type={this.state.camera.type}
//             />
//             <View style={[styles.overlay, styles.topOverlay]}>
//               <Text style={styles.scanScreenMessage}>
//                 Please scan the barcode.
//               </Text>
//             </View>
//             <View style={[styles.overlay, styles.bottomOverlay]}>
//               <Button
//                 onPress={() => {
//                   console.log('scan clicked');
//                   // this.takePicture()
//                 }}
//                 style={styles.enterBarcodeManualButton}
//                 title="Enter Barcode"
//               />
//             </View>
//           </View>
//         )}

//         <Modal visible={this.state.filtermodel} transparent={true}>
//           <View style={{backgroundColor: '#000000aa', flex: 1}}>
//             <View
//               style={{
//                 backgroundColor: 'white',
//                 width: '90%',
//                 height: 150,
//                 alignSelf: 'center',
//                 marginTop: 280,
//               }}>
//               <View
//                 style={{
//                   width: '90%',
//                   marginTop: '5%',
//                   marginBottom: 10,
//                   marginLeft: 20,
//                 }}>
//                 <Text
//                   style={{
//                     color: 'black',
//                     fontWeight: 'bold',
//                     fontSize: 16,
//                   }}>
//                   Payment Mode
//                 </Text>

//                 <Text
//                   style={{
//                     fontSize: 14,
//                     color: '#323232',
//                     width: '90%',
//                     marginTop: 20,
//                   }}>
//                   Please Select Payment Option
//                 </Text>
//               </View>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   width: '100%',
//                   height: 45,
//                   marginTop: 20,
//                   backgroundColor: '#fff',
//                 }}>
//                 <TouchableOpacity
//                   onPress={() => {
//                     this.setState({filtermodel: false});
//                   }}
//                   style={{
//                     width: '50%',
//                     height: 45,
//                     backgroundColor: '#fff',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     borderWidth: 1,
//                     borderColor: '#cccccc',
//                   }}>
//                   <Text
//                     style={{
//                       color: '#323232',
//                       fontSize: 14,
//                       fontWeight: '400',
//                     }}>
//                     Cencal
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => {
//                     this.setState({filtermodel: false}),
//                       this.payment(),
//                       this.empty();
//                   }}
//                   style={{
//                     width: '50%',
//                     height: 45,
//                     backgroundColor: '#fff',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     borderWidth: 1,
//                     borderColor: '#cccccc',
//                     flexDirection: 'row',
//                   }}>
//                   {/* <Icon
//                     name="delete"
//                     style={{fontSize: 18, color: '#cccccc', marginRight: 5}}
//                   /> */}
//                   <Text
//                     style={{
//                       color: '#323232',
//                       fontSize: 14,
//                       fontWeight: '400',
//                     }}>
//                     Success
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </SafeAreaView>
//     );
//   }
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   bg: {
//     width: '100%',
//     height: '100%',
//   },
//   topView: {
//     width: '100%',
//     height: 50,
//     position: 'absolute',
//     top: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 2,
//     backgroundColor: '#fff',
//   },
//   topContent: {
//     width: '90%',
//     alignSelf: 'center',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   logo: {
//     alignSelf: 'center',
//     resizeMode: 'contain',
//     width: 50,
//     height: 50,
//   },
//   mainView: {
//     width: '100%',
//     marginTop: 50,
//   },
//   cartView: {
//     flexDirection: 'row',
//     width: '90%',
//     alignSelf: 'center',
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   cart: {
//     width: '90%',
//     height: 200,
//     backgroundColor: '#fff',
//     elevation: 1,
//     alignSelf: 'center',
//     marginTop: 20,
//     borderRadius: 5,
//   },
//   carts: {
//     flexDirection: 'row',
//   },
//   item: {
//     width: '34%',
//     borderRightWidth: 0.8,
//     height: 35,
//   },
//   topField: {
//     backgroundColor: '#e1e0de',
//     width: '100%',
//     height: 35,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   fieldValue: {
//     backgroundColor: '#efefef',
//     width: '100%',
//     height: 35,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderBottomWidth: 0.5,
//   },
//   fieldText: {
//     color: '#323232',
//     fontSize: 15,
//   },
//   total: {
//     width: '80%',
//     height: 45,
//     alignSelf: 'center',
//     backgroundColor: '#efefef',
//     borderRadius: 5,
//     marginTop: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   totalText: {
//     fontSize: 16,
//     color: '#323232',
//     fontWeight: '600',
//     paddingLeft: 15,
//   },
//   button: {
//     width: '90%',
//     alignSelf: 'center',
//     marginTop: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   touchButton: {
//     width: '45%',
//     height: 40,
//     backgroundColor: '#efefef',
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   touchButton1: {
//     width: '45%',
//     height: 40,
//     backgroundColor: '#404585',
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   touchText: {
//     color: '#323232',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   touchText1: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   cemera: {
//     width: '90%',
//     alignSelf: 'center',
//     marginTop: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'center',
//     position: 'absolute',
//     bottom: -200,
//   },
//   preview: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   overlay: {
//     position: 'absolute',
//     padding: 16,
//     right: 0,
//     left: 0,
//     alignItems: 'center',
//   },
//   topOverlay: {
//     top: 0,
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   bottomOverlay: {
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   enterBarcodeManualButton: {
//     padding: 15,
//     backgroundColor: 'white',
//     borderRadius: 40,
//   },
//   scanScreenMessage: {
//     fontSize: 14,
//     color: 'white',
//     textAlign: 'center',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cartTitle: {
//     fontSize: 16,
//     color: '#323232',
//     fontWeight: '400',
//     marginLeft: 10,
//   },
//   NullDataView: {
//     width: '90%',
//     height: 150,
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'center',
//   },
//   NullDataText: {
//     color: '#323232',
//     textAlign: 'center',
//     fontSize: 17,
//     fontWeight: '600',
//   },
//   flatDataView: {
//     width: '100%',
//     backgroundColor: '#ffffff',
//     marginTop: 10,
//     paddingBottom: -5,
//     paddingTop: 10,
//   },
//   nameText: {
//     width: '100%',
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#140905',
//     justifyContent: 'space-between',
//   },
//   qtyView: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   qtybuttonView: {
//     flexDirection: 'row',
//     width: '30%',
//     justifyContent: 'space-between',
//     alignSelf: 'center',
//   },
//   minusView: {
//     width: 20,
//     height: 20,
//     borderWidth: 1,
//     justifyContent: 'center',
//     borderColor: '#404585',
//     backgroundColor: '#404585',
//   },
//   minusIcon: {
//     fontSize: 15,
//     textAlign: 'center',
//     color: '#fff',
//   },
// });

// export default Dashboard;

import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ImageBackground,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
  ActivityIndicator,
  Alert,
  Button,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RNCamera} from 'react-native-camera';

let total = 0;

const dataSource = [
  {
    barcodeId: 'ABC-abc-0002',
    name: 'Jeans',
    price: 2000,
    qty: 1,
  },
  {
    barcodeId: 'ABC-abc-0003',
    name: 'T-Shirt',
    price: 100,
    qty: 1,
  },
];

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.camera = null;
    this.barcodeArray = [];
    this.state = {
      mobile: '',
      scanView: false,
      isLoading: false,
      filtermodel: false,
      barcode: [],
      dataSource: [],
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
      },
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem('token').then(token => {
      this.setState({token: token});
      this.fetchData();
    });
    AsyncStorage.getItem('scan').then(value => {
      // this.setState({
      //   scan: JSON.parse(value),
      // });
      if (value) {
        this.barcodeArray = JSON.parse(value);
      }
    });

    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      AsyncStorage.getItem('scanData').then(value => {
        this.setState({
          scanData: value,
          scanView: false,
        });
      });
    });

    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick = () => {
    if (this.state.scanView == true) {
      this.setState({scanView: false});
    } else {
      Alert.alert('Hold on!', 'Are you sure want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
    }
    return true;
  };

  fetchData = () => {
    this.setState({
      isLoading: true,
    });
    const token = this.state.token;
    // console.log('toekn', token);
    //POST request
    fetch(`https://noqueue1.herokuapp.com/v1/dummy-inventory`, {
      method: 'GET', //Request Type
      // body: JSON.stringify({
      //   username: this.state.username,
      //   password: this.state.password,
      // }),
      headers: {
        //Header Defination
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('dataResponse', responseJson);
        this.setState(
          {
            isLoading: false,
            dataSource: responseJson,
          },
          function () {
            // this.scanData('ABC-abc-0001')
          },
        );
      })
      .catch(error => {
        // alert(JSON.stringify(error));
        // console.error(error);
      });
  };

  onBarCodeRead(scanResult) {
    // console.warn(scanResult.type);
    // console.warn(scanResult.data);
    // if (scanResult.data != null) {
    // console.warn('onBarCodeRead call');
    this.scanData(scanResult.data);
    this.setState({scanView: false});
    // }
    return;
  }

  async takePicture() {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      alert(data.uri);
    }
  }

  pendingView() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'lightgreen',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Waiting</Text>
      </View>
    );
  }

  multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for (var i = 0, l = arr.length; i < l; i++) {
      var stringified = JSON.stringify(arr[i]);
      if (itemsFound[stringified]) {
        continue;
      }
      uniques.push(arr[i]);
      itemsFound[stringified] = true;
    }
    return uniques;
  }

  scanData(code) {
    if (this.state.dataSource != null) {
      for (let i = 0; i < this.state.dataSource.length; i++) {
        
        if (code == this.state.dataSource[i].barcodeId) {
          if (this.barcodeArray.length > 0) {
            var key = this.barcodeArray.indexOf(this.state.dataSource[i]);
            // alert('key', key);
            if (key == -1) {
              this.barcodeArray.push(this.state.dataSource[i]);
            } else {
              this.barcodeArray[key].defaultQuantity =
                this.barcodeArray[key].defaultQuantity + 1;
            }
            // for (let index = 0; index < this.barcodeArray.length; index++) {
            //   if (this.barcodeArray[index]['barcodeId'] == code) {
            //     console.log(index);
            //     this.barcodeArray[index]['defaultQuantity'] = this.barcodeArray[index]['defaultQuantity'] + 1;
            //   } else {
            //     var data = this.state.dataSource[i];
            //     data.defaultQuantity = 1;
            //     console.log(this.state.dataSource, data);
            //     this.barcodeArray.push(data);
            //   }
            // }
          } else {
            this.barcodeArray.push(this.state.dataSource[i]);
          }
          this.barcodeArray = this.multiDimensionalUnique(this.barcodeArray);
          AsyncStorage.setItem(
            'barcodeData',
            JSON.stringify(this.barcodeArray),
          );
          break;
        } else {
          console.log('no');
        }
      }
    }
  }

  onAdd = (item, index) => {
    let products = [...this.barcodeArray];
    products[index].defaultQuantity += 1;
    this.barcodeArray = products;
    this.setState({qty: this.state.qty + 1});
    // alert('qtyonadd', this.barcodeArray);
    AsyncStorage.setItem('barcodeData', JSON.stringify(this.barcodeArray));
    // this.fetchData();
  };
  onMinus = (item, index) => {
    let products = [...this.barcodeArray];
    if (products[index].defaultQuantity == 1) {
      null;
    } else {
      products[index].defaultQuantity -= 1;
      this.setState({qty: this.state.qty - 1});
    }
    this.barcodeArray = products;
    AsyncStorage.setItem('barcodeData', JSON.stringify(this.barcodeArray));

    // this.fetchData();
  };
  empty = () => {
    this.barcodeArray.length = 0;
    AsyncStorage.removeItem('scan');
    AsyncStorage.removeItem('barcodeData');
    this.fetchData();
  };
  payment = () => {
    // this.setState({payment:true})
    alert('PAYMENT IS SUCCESSFUL');
  };
  oneEmpty = code => {
    for (let i = 0; i < this.barcodeArray.length; i++) {
      if (this.barcodeArray[i].barcodeId === code) {
        this.barcodeArray.splice(i, 1);
      }
      AsyncStorage.setItem('barcodeData', JSON.stringify(this.barcodeArray));
      this.fetchData();
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '40%',
            alignSelf: 'center',
          }}>
          <ActivityIndicator size={25} color={'#404585'} />
          <Text style={{fontSize: 18, color: '#404585'}}>Please wait</Text>
        </View>
      );
    }
    total = 0;

    if (this.barcodeArray != null) {
      for (let i = 0; i < this.barcodeArray.length; i++) {
        total += parseInt(
          this.barcodeArray[i].finalRetailPrice *
            this.barcodeArray[i].defaultQuantity,
        );
      }
    }

    return (
      <SafeAreaView style={styles.bg}>
        {this.state.scanView == false ? (
          <ImageBackground
            source={require('./Image/background.jpeg')}
            style={styles.bg}
            resizeMode="stretch">
            <View style={styles.topView}>
              <View style={styles.topContent}>
                <TouchableOpacity
                // onPress={()=>{AsyncStorage.removeItem('token'),this.props.navigation.navigate('Signin')}}
                >
                  <Icon name="menu" style={{fontSize: 27, color: '#323232'}} />
                </TouchableOpacity>
                <Image
                  source={require('./Image/signupLogo.png')}
                  style={styles.logo}
                />
              </View>
            </View>
            <View style={styles.mainView}>
              <View style={styles.cartView}>
                <Icon
                  name="shopping-cart"
                  style={{fontSize: 25, color: '#404585'}}
                />
                <Text style={styles.cartTitle}>Your current cart</Text>
              </View>
              {/* <ScrollView> */}
              <View style={{height: 340}}>
                {this.barcodeArray == null || this.barcodeArray == '' ? (
                  <View style={styles.NullDataView}>
                    <Text style={styles.NullDataText}>
                      Open camera scanner to start scanning products
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={this.barcodeArray}
                    renderItem={({item, index}) => (
                      <View style={styles.flatDataView}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <View
                            style={{
                              margin: 20,
                              width: '90%',
                              marginTop: 0,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <Text numberOfLines={1} style={styles.nameText}>
                                {item.itemName}
                              </Text>
                            </View>
                            <View style={styles.qtyView}>
                              <Text style={{color: '#323232'}}></Text>

                              <View style={styles.qtybuttonView}>
                                <TouchableOpacity
                                  onPress={() => {
                                    if (item.defaultQuantity == 1) {
                                      this.oneEmpty(item.barcodeId);
                                    } else {
                                      this.onMinus(item, index);
                                    }
                                  }}
                                  style={styles.minusView}>
                                  <Icon
                                    name="remove"
                                    style={styles.minusIcon}
                                  />
                                </TouchableOpacity>
                                <Text
                                  style={{
                                    fontSize: 17,
                                    color: '#323232',
                                  }}>
                                  {item.defaultQuantity}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    this.onAdd(item, index);
                                  }}
                                  style={styles.minusView}>
                                  <Icon name="add" style={styles.minusIcon} />
                                </TouchableOpacity>
                              </View>
                            </View>
                            <Text style={{color: '#323232'}}>
                              Store Name : {item.storeName}
                            </Text>

                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 5,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',

                                  alignItems: 'center',
                                }}>
                                <Text style={{color: '#323232'}}>Price :</Text>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      fontWeight: '500',
                                      color: '#323232',
                                      textDecorationLine: 'line-through',
                                    }}>
                                    {' '}
                                    ₹ {item.retailPrice * item.defaultQuantity}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      fontWeight: '700',
                                      color: '#404585',
                                      marginLeft: 10,
                                    }}>
                                    ₹{' '}
                                    {item.finalRetailPrice *
                                      item.defaultQuantity}
                                  </Text>
                                </View>
                              </View>
                              <Text style={{color: '#323232'}}>
                                Discount Amount :{item.discountAmount}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      // </View>
                    )}
                    keyExtractor={({barcodeId}, index) => index}
                  />
                )}
              </View>
              {/* )} */}
              {/* </ScrollView> */}
              <View
                style={{
                  position: 'absolute',
                  top: 395,
                  height: 70,
                }}>
                {this.barcodeArray == '' || this.barcodeArray == null ? null : (
                  <View>
                    <View style={styles.total}>
                      <Text style={styles.totalText}>Total : ₹ {total}</Text>
                    </View>
                    <View style={styles.button}>
                      <TouchableOpacity
                        onPress={() => {
                          this.empty();
                        }}
                        style={styles.touchButton}>
                        <Text style={styles.touchText}>Clear Cart</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            filtermodel: true,
                          });
                        }}
                        style={styles.touchButton1}>
                        <Text style={styles.touchText1}>Finish</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
              <View style={styles.cemera}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({scanView: true});
                  }}>
                  <Icon
                    name="photo-camera"
                    style={{fontSize: 45, color: '#323232'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        ) : (
          <View style={styles.container}>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              defaultTouchToFocus
              flashMode={this.state.camera.flashMode}
              mirrorImage={false}
              onBarCodeRead={this.onBarCodeRead.bind(this)}
              onFocusChanged={() => {}}
              onZoomChanged={() => {}}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={
                'We need your permission to use your camera phone'
              }
              style={styles.preview}
              type={this.state.camera.type}
            />
            <View style={[styles.overlay, styles.topOverlay]}>
              <Text style={styles.scanScreenMessage}>
                Please scan the barcode.
              </Text>
            </View>
            <View style={[styles.overlay, styles.bottomOverlay]}>
              {/* <Button
                onPress={() => {
                  console.log('scan clicked');
                  // this.takePicture()
                }}
                style={styles.enterBarcodeManualButton}
                title="Enter Barcode"
              /> */}
            </View>
          </View>
        )}

        <Modal visible={this.state.filtermodel} transparent={true}>
          <View style={{backgroundColor: '#000000aa', flex: 1}}>
            <View
              style={{
                backgroundColor: 'white',
                width: '90%',
                height: 150,
                alignSelf: 'center',
                marginTop: 280,
              }}>
              <View
                style={{
                  width: '90%',
                  marginTop: '5%',
                  marginBottom: 10,
                  marginLeft: 20,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  MAKE PAYMENT
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: '#323232',
                    width: '90%',
                    marginTop: 20,
                  }}>
                  Please Select Payment Option
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: 45,
                  marginTop: 20,
                  backgroundColor: '#fff',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({filtermodel: false});
                  }}
                  style={{
                    width: '50%',
                    height: 45,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#cccccc',
                  }}>
                  <Text
                    style={{
                      color: '#323232',
                      fontSize: 14,
                      fontWeight: '400',
                    }}>
                    CANCEL
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({filtermodel: false}),
                      this.payment(),
                      this.empty();
                  }}
                  style={{
                    width: '50%',
                    height: 45,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#cccccc',
                    flexDirection: 'row',
                  }}>
                  {/* <Icon
                    name="delete"
                    style={{fontSize: 18, color: '#cccccc', marginRight: 5}}
                  /> */}
                  <Text
                    style={{
                      color: '#323232',
                      fontSize: 14,
                      fontWeight: '400',
                    }}>
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    width: '100%',
    height: '100%',
  },
  topView: {
    width: '100%',
    height: 50,
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    backgroundColor: '#fff',
  },
  topContent: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logo: {
    alignSelf: 'center',
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
  mainView: {
    width: '100%',
    marginTop: 50,
  },
  cartView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  cart: {
    width: '90%',
    height: 200,
    backgroundColor: '#fff',
    elevation: 1,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 5,
  },
  carts: {
    flexDirection: 'row',
  },
  item: {
    width: '34%',
    borderRightWidth: 0.8,
    height: 35,
  },
  topField: {
    backgroundColor: '#e1e0de',
    width: '100%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldValue: {
    backgroundColor: '#efefef',
    width: '100%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
  },
  fieldText: {
    color: '#323232',
    fontSize: 15,
  },
  total: {
    width: '80%',
    height: 45,
    alignSelf: 'center',
    backgroundColor: '#efefef',
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalText: {
    fontSize: 16,
    color: '#323232',
    fontWeight: '600',
    paddingLeft: 15,
  },
  button: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  touchButton: {
    width: '45%',
    height: 40,
    backgroundColor: '#efefef',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchButton1: {
    width: '45%',
    height: 40,
    backgroundColor: '#404585',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchText: {
    color: '#323232',
    fontSize: 16,
    fontWeight: '600',
  },
  touchText1: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cemera: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: -200,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartTitle: {
    fontSize: 16,
    color: '#323232',
    fontWeight: '400',
    marginLeft: 10,
  },
  NullDataView: {
    width: '90%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  NullDataText: {
    color: '#323232',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
  },
  flatDataView: {
    width: '100%',
    backgroundColor: '#ffffff',
    marginTop: 10,
    paddingBottom: -5,
    paddingTop: 10,
  },
  nameText: {
    width: '100%',
    fontSize: 18,
    fontWeight: '500',
    color: '#140905',
    justifyContent: 'space-between',
  },
  qtyView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  qtybuttonView: {
    flexDirection: 'row',
    width: '30%',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  minusView: {
    width: 20,
    height: 20,
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: '#404585',
    backgroundColor: '#404585',
  },
  minusIcon: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
  },
});

export default Dashboard;
