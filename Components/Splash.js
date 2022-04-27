import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  BackHandler,
  Alert,
  ScrollView,
  FlatList,
  AppRegistry,
  SafeAreaView,
  TouchableHighlight,
  Text,
  Picker,
  PickerItem,
  StatusBar,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      signup: null,
      isLoading: false,
    };
  }
  componentDidMount() {
    AsyncStorage.getItem('token').then(token => {
      this.setState({token: token});
    });

    AsyncStorage.getItem('barcodeData').then(value => {
      this.setState({
        barcodeData: JSON.parse(value),
      });
    });
    AsyncStorage.getItem('signup').then(value => {
      this.setState({
        signup: value,
      });
      this.check();
    });
  }
  check() {
    if (this.state.signup == null && this.state.token == null ) {
      setTimeout(() => {
        this.props.navigation.navigate('Signup');
      }, 3000);
    } else if (this.state.signup != null && this.state.token == null ) {
      setTimeout(() => {
        this.props.navigation.navigate('Signin');
      }, 3000);
    } else if (this.state.signup == null && this.state.token != null ) {
      setTimeout(() => {
        this.props.navigation.navigate('Dashboard');
      }, 3000);
    } else {
      setTimeout(() => {
        AsyncStorage.setItem('scan', JSON.stringify(this.state.barcodeData));
        this.props.navigation.navigate('Dashboard');
      }, 3000);
    }
  }

  render() {
    console.log('token', this.state.token);
    console.log('signup', this.state.signup);

    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={30} color={'#404585'} />
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar animated={true} backgroundColor="#6971da" />
        <ImageBackground
          source={require('./Image/background.jpeg')}
          style={styles.bg}
          resizeMode="stretch">
          <ScrollView>
            <View style={styles.MainView}>
              <View style={styles.viewContent}>
                <Text style={styles.contentText}>
                  Experience the next generation shopping & checkout
                </Text>
              </View>
              <View style={styles.topContent}>
                <Icon
                  name="shopping-cart"
                  style={{fontSize: 35, color: '#404585'}}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{fontSize: 20, color: '#323232', marginTop: -15}}>
                    ______________
                  </Text>
                  <Icon
                    name="chevron-right"
                    style={{fontSize: 25, color: '#323232'}}
                  />
                </View>

                <Icon
                  name="account-balance-wallet"
                  style={{fontSize: 35, color: '#404585'}}
                />
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
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
  MainView: {
    width: '100%',
  },
  viewContent: {
    backgroundColor: '#fff',
    width: 210,
    alignSelf: 'center',
    elevation: 5,
    borderRadius: 100,
    height: 210,
    marginTop: '35%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 17,
    color: '#323232',
    textAlign: 'center',
  },
  topContent: {
    width: '70%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 50,
  },
});
