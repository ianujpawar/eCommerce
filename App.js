import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from './Components/Splash';
import Signup from './Components/Signup';
import Dashboard from './Components/Dashboard';
import Signin from './Components/Signin';

const Stack = createNativeStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Signin" component={Signin} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
