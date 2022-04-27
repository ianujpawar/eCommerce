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
class Signup extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      icon: 'visibility-off',
      secureTextEntry: true,
      isLoading: false,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    Alert.alert('Hold on!', 'Are you sure want to exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  }

  Signup = values => {
    this.setState({
      isLoading: true,
    });
    let value = values;
    const first = value.first;
    const last = value.last;
    const name = first + ' ' + last;
    const email = value.email;
    const password = value.password;
    console.log('namea', name);
    axios
      .post(`https://noqueue1.herokuapp.com/v1/user/sign-up`, {
        name,
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
              this.props.navigation.navigate('Signin', {
                token: res.headers.token,
              });
              
              Alert.alert(res.data.message);
            } else if (res.status == 208) {
              this.props.navigation.navigate('Signin', {
                token: res.headers.token,
              });
              Alert.alert(res.data.message);
            } else {
              this.setState({isLoading: false});
              this.props.navigation.navigate('Signin');
            }
          },
        );
      })

      .catch(e => {
        console.log(`login error ${e}`);
        Alert.alert(res.data.message);
        this.props.navigation.navigate('Signin');
        // setIsLoading(false);
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
    const signupValidation = yup.object().shape({
      first: yup
        .string()
        .required('First Name is required')

        .matches(
          '^[a-zA-Z]+$',
          // '^([A-Za-z]+)+[A-Za-z]+$|^([A-Za-z]+anuj)+$|^([A-Za-z]+)+$',
          'Only characters are allowed ',
        ),

      last: yup
        .string()
        .required('Last Name is required')
        .matches('^[a-zA-Z]+$', 'Only characters are allowed '),
      email: yup
        .string()
        .required('Email address is required')
        .matches(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
          'Please enter valid email address',
        ),
      password: yup
        .string()
        .min(8, ({min}) => `Password must be atleast ${min} characters`)
        .required('Password is required')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
          'Must contain atleast 8 characters (one uppercase, one lowercase, one number and one special case character)',
        ),
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
              this.Signup(values), console.log(JSON.stringify(values))
            )}
            validationSchema={signupValidation}>
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
                        <Text style={styles.text}>First Name</Text>
                        <TextInput
                          placeholder="Enter Your First Name"
                          placeholderTextColor={'grey'}
                          keyboardType="default"
                          style={styles.inputStyle}
                          onChangeText={handleChange('first')}
                          onBlur={handleBlur('first')}
                          value={values.first}
                          autoFocus={true}
                          autoCorrect={true}
                        />
                        {errors.first && touched.first && (
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: 'bold',
                              color: 'red',
                            }}>
                            {errors.first}
                          </Text>
                        )}
                      </View>
                      <View style={styles.inputView}>
                        <Text style={styles.text}>Last Name</Text>
                        <TextInput
                          placeholder="Enter Your Last Name"
                          placeholderTextColor={'grey'}
                          keyboardType="default"
                          style={styles.inputStyle}
                          onChangeText={handleChange('last')}
                          onBlur={handleBlur('last')}
                          value={values.last}
                        />
                        {errors.last && touched.last && (
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: 'bold',
                              color: 'red',
                            }}>
                            {errors.last}
                          </Text>
                        )}
                      </View>

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
                        onPress={handleSubmit}
                        style={{
                          width: '100%',
                          height: 45,
                          backgroundColor: isValid ? '#404585' : '#898ec9',
                          borderRadius: 5,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={styles.touchText}>Signup</Text>
                      </TouchableOpacity>
                      <View style={styles.lastView}>
                        <Text style={styles.loginText}>
                          Already have an account ?
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate('Signin');
                          }}>
                          <Text style={styles.loginText1}> Login</Text>
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
    marginTop: -15,
  },
  containView: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 0,
  },
  logo: {
    alignSelf: 'center',
    width: 170,
    height: 150,
    resizeMode: 'contain',
    marginTop: -10,
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

export default Signup;
