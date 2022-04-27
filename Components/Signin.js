import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Formik} from 'formik';
import * as yup from 'yup';
class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      icon: 'visibility-off',
      secureTextEntry: true,
      isLoading: false,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      AsyncStorage.getItem('email').then(value => {
        this.setState({
          email: value,
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

  handleBackButtonClick() {
    this.props.navigation.navigate('Signup');
    return true;
  }

  login = values => {
    this.setState({
      isLoading: true,
    });
    let value = values;
    const email = value.email;
    const password = value.password;
    axios
      .post(`https://noqueue1.herokuapp.com/v1/user/login`, {
        email,
        password,
      })
      .then(res => {
        this.setState(
          {
            isLoading: true,
          },
          function () {
            console.log('responseSignIn', res);
            if (res.status == 200) {
              this.setState({userInfo: res.headers.token});
              this.props.navigation.navigate('Dashboard', {
                token: res.headers.token,
              });
              AsyncStorage.setItem('token', res.headers.token);
              AsyncStorage.setItem('signup', 'signup');
            } else {
              this.setState({isLoading: false});
              this.props.navigation.navigate('Signup');
            }
          },
        );
      })

      .catch(e => {
        console.log(`login error ${e}`);
        this.props.navigation.navigate('Signup');
      });
  };

  changeIcon = () => {
    let icon = this.state.secureTextEntry ? 'visibility' : 'visibility-off';
    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
      icon: icon,
    });
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

    const loginValidation = yup.object().shape({
      email: yup
        .string()
        .required('Email address is required')
        .matches(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
          // /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
          'Please enter valid email address',
        ),

      password: yup
        .string()
        .min(1, ({min}) => `Please enter password`)
        .required('Password is required'),
      // .matches(
      //   /^.{8,}$/,
      //   'Must contain minimum 8 characters',
      // ),
    });
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar animated={true} backgroundColor="#6971da" />
        <ImageBackground
          source={require('./Image/background.jpeg')}
          style={styles.bg}
          resizeMode="stretch">
          <Formik
            initialValues={{email: '', password: ''}}
            validateOnMount={true}
            onSubmit={values => (
              this.login(values), console.log(JSON.stringify(values))
            )}
            validationSchema={loginValidation}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
              isValid,
            }) => (
              <ScrollView>
                <View style={styles.MainView}>
                  <Image
                    source={require('./Image/signupLogo.png')}
                    style={styles.logo}
                  />
                  <View style={styles.viewContent}>
                    <View style={styles.containView}>
                      <View style={styles.inputView}>
                        <Text style={styles.text}>Email</Text>
                        <TextInput
                          placeholder="Enter Your Email"
                          placeholderTextColor={'grey'}
                          keyboardType="email-address"
                          style={styles.inputStyle}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          value={values.email.toLowerCase()}
                          autoFocus={true}
                          // autoCorrect={true}
                        />
                        {errors.email && touched.email && (
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: 'bold',
                              color: 'red',
                            }}>
                            {errors.email}
                          </Text>
                        )}
                      </View>

                      <View style={styles.inputView}>
                        <Text style={styles.text}>Password</Text>
                        <View style={styles.pass}>
                          <TextInput
                            placeholder="Enter Your Password"
                            placeholderTextColor={'grey'}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            autoCorrect={true}
                            secureTextEntry={this.state.secureTextEntry}
                          />
                          <TouchableOpacity onPress={this.changeIcon}>
                            <Icon
                              name={this.state.icon}
                              style={{fontSize: 20, color: 'grey'}}
                            />
                          </TouchableOpacity>
                        </View>
                        {errors.password && touched.password && (
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: 'bold',
                              color: 'red',
                            }}>
                            {errors.password}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.button}>
                      <TouchableOpacity
                        rouded
                        disabled={!isValid}
                        onPress={handleSubmit}
                        style={{
                          width: '100%',
                          height: 45,
                          backgroundColor: isValid ? '#404585' : '#898ec9',
                          borderRadius: 5,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={styles.touchText}>Login</Text>
                      </TouchableOpacity>
                      <View style={styles.lastView}>
                        <Text style={styles.loginText}>
                          Don't have an account ?
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate('Signup');
                          }}>
                          <Text style={styles.loginText1}> Signup</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}
          </Formik>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    width: '90%',
    alignSelf: 'center',
    elevation: 2,
    borderRadius: 10,
    paddingBottom: 20,
  },
  containView: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  logo: {
    alignSelf: 'center',
    width: 170,
    height: 150,
    resizeMode: 'contain',
    marginTop: 60,
  },
  inputView: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
  },
  pass: {
    flexDirection: 'row',
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  text: {
    width: '100%',
    fontSize: 16,
    color: 'grey',
    fontWeight: '500',
    paddingBottom: 10,
  },
  inputStyle: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingLeft: 15,
  },
  button: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 30,
    paddingBottom: 30,
  },
  touchButton: {
    width: '100%',
    height: 45,
    backgroundColor: '#404585',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  lastView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 15,
    color: '#323232',
    fontWeight: '400',
  },
  loginText1: {
    fontSize: 15,
    color: '#404585',
    fontWeight: '600',
  },
});
export default Signin;
