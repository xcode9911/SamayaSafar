import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Handle registration logic here
    router.push("/route");
  };

  const handleRegister = () => {
    // Handle navigation to login screen
    router.push("/register");
  };

  const handleGoBack = () => {
    // Navigate back to previous screen
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback navigation if no previous screen
      router.push('/');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

       {/* Back Button Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Text style={styles.backIcon}>‹</Text>
              </TouchableOpacity>
            </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* App Title */}
            <Text style={styles.title}>SamayaSafar</Text>
            
            {/* Main Heading */}
            <Text style={styles.heading}>Let's Start the journey</Text>
            
            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Enter you valid credentials{'\n'}carefully
            </Text>
            
            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Email Field */}
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter you email address"
                placeholderTextColor="#6b7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              {/* Password Field */}
              <Text style={styles.label}>Password:</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#6b7280"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton} 
                  onPress={togglePasswordVisibility}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={showPassword ? "eye" : "eye-off"} 
                    size={moderateScale(20)} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Login Button */}
            <TouchableOpacity style={styles.registerButton} onPress={handleLogin}>
              <Text style={styles.registerButtonText}>Login</Text>
            </TouchableOpacity>
            
            {/* Register Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Not registered ? </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.loginLink}>Register Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
      position: 'absolute',
      top: StatusBar.currentHeight || verticalScale(10),
      left: scale(20),
      zIndex: 100, // Ensure it's on top
    },
    backButton: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    backIcon: {
      fontSize: moderateScale(24),
      color: '#6366f1',
      fontWeight: 'bold',
      marginLeft: scale(-2), // Slight adjustment for visual centering
    },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(60), // Moved content higher up
    paddingBottom: verticalScale(20),
    justifyContent: 'flex-start', // Changed from center to flex-start
  },
  title: {
    fontSize: moderateScale(38), // Slightly larger for Sacramento style
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'cursive', // Sacramento-like fonts
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#1f2937',
    marginTop: verticalScale(0), // Reduced top margin
    marginBottom: verticalScale(30),
    fontWeight: '300', // Lighter weight for script style
    letterSpacing: 2, // More spacing for elegant script look
    // Enhanced styling for Sacramento-like appearance
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    // Additional styling for script font appearance
    lineHeight: moderateScale(45),
  },
  heading: {
    fontSize: moderateScale(24),
    fontWeight: '600',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: verticalScale(12),
  },
  subtitle: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: verticalScale(20), // Increased spacing
    lineHeight: moderateScale(22),
  },
  formContainer: {
    marginBottom: verticalScale(25), // Reduced bottom margin
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: verticalScale(8),
    marginTop: verticalScale(12), // Reduced spacing between fields
  },
  input: {
    backgroundColor: '#c7d2fe',
    borderRadius: moderateScale(25),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    fontSize: moderateScale(16),
    color: '#1f2937',
    width: '100%',
    minHeight: verticalScale(50),
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    backgroundColor: '#c7d2fe',
    borderRadius: moderateScale(25),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    paddingRight: scale(60), // Make room for eye icon
    fontSize: moderateScale(16),
    color: '#1f2937',
    width: '100%',
    minHeight: verticalScale(50),
  },
  eyeButton: {
    position: 'absolute',
    right: scale(20),
    top: '50%',
    transform: [{ translateY: -moderateScale(12) }],
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#6366f1',
    borderRadius: moderateScale(25),
    paddingVertical: verticalScale(16),
    marginBottom: verticalScale(20), // Reduced margin
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    minHeight: verticalScale(50),
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: moderateScale(18),
    fontWeight: '600',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: scale(20),
    marginTop: verticalScale(5), // Added small top margin
  },
  loginText: {
    fontSize: moderateScale(16),
    color: '#4b5563',
  },
  loginLink: {
    fontSize: moderateScale(16),
    color: '#6366f1',
    fontWeight: '500',
  },
});