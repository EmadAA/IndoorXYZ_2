import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AddPlayground from './components/AddPlayground';
import Booking from './components/Booking';
import BookingList from './components/BookingList';
import Confirm from './components/Confirm';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import Signup from './components/Signup';
import WelcomePage from './components/Welcomepage';
const Stack = createStackNavigator();

export default function AppNavigation() {
  return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} // Hide header for Login Page
        />
      <Stack.Screen
        name="WelcomePage"
        component={WelcomePage}
        options={{ headerShown: false }} // Hide header for Welcome Page
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown : false }} // Example: Custom title for Signup
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }} // Hide header for Home Page
      />
      <Stack.Screen
        name="AddPlayground"
        component={AddPlayground}
        options={{ headerShown: false }} // Hide header for Home Page
      />
      <Stack.Screen
        name="Booking"
        component={Booking}
        options={{ headerShown: false }} // Hide header for Home Page
      />
       <Stack.Screen
        name="Confirm"
        component={Confirm}
        options={{ headerShown: false }} // Hide header for Home Page
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }} // Hide header for Home Page
      />
      <Stack.Screen
        name="BookingList"
        component={BookingList}
        options={{ headerShown: false }} // Hide header for Home Page
      />
      
    </Stack.Navigator>
  );
}