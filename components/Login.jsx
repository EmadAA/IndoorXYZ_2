import { useNavigation } from '@react-navigation/native';
import { sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { auth } from '../Config/Firebase';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle login action
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        // User is not verified, show alert with resend option
        Alert.alert(
          'Email Not Verified',
          'Please verify your email before logging in. Would you like us to resend the verification email?',
          [
            {
              text: 'Resend Email',
              onPress: async () => {
                try {
                  await sendEmailVerification(user);
                  Alert.alert(
                    'Verification Email Sent',
                    'Please check your email and click the verification link.'
                  );
                } catch (error) {
                  Alert.alert('Error', 'Failed to send verification email. Please try again later.');
                }
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
        // Sign out the user since they're not verified
        await auth.signOut();
      } else {
        // User is verified, proceed with login
        Alert.alert('Success', 'Logged in successfully!');
        navigation.navigate('WelcomePage');
      }
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      // Handle specific Firebase error codes
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <View style={styles.container}>
      {/* Header Logo */}
      <View style={styles.header}>
        <Image
          source={require('../assets/Logo.png')}
          style={styles.logo}
        />
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login To Continue</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email (Ex. indoorxyz@gmail.com)"
            placeholderTextColor="#bbb"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#bbb"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIconContainer}
          >
            <Icon 
              name={passwordVisible ? 'eye-off' : 'eye'} 
              size={24} 
              color="#bbb" 
            />
          </TouchableOpacity>
        </View>

        {/* Remember Me and Forgot Password */}
        <View style={styles.row}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.link}>Forget Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        {/* Or Divider */}
        <Text style={styles.orText}>Or</Text>

        {/* Sign Up */}
        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={handleSignup}
          disabled={isLoading}
        >
          <Text style={styles.googleButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Contact Support */}
        <TouchableOpacity>
          <Text style={styles.contactText}>
            Did You Face Any Issue? <Text style={styles.contactLink}>Contact US</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginTop: 120,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIconContainer: {
    padding: 5,
    position: 'absolute',
    right: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  link: {
    color: '#FBB03B',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#7A67FF',
    paddingVertical: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 20,
    fontSize: 14,
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
  contactLink: {
    color: '#FBB03B',
    fontWeight: 'bold',
  },
});

export default Login;