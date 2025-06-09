import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplash from './components/AnimatedSplash';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

const handleUserReg = (userType: 'Driver' | 'Customer') => {
  router.push({ pathname: '/register', params: { userType } });
};

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // Hide the default splash screen as soon as our component mounts
    SplashScreen.hideAsync();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.logoContainer}>
        <Text style={styles.title}>SafarSamay</Text>
      </View>

      <Text style={styles.subtitle}>What you are ?</Text>
      <Text style={styles.infoText}>Please select your requirement</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleUserReg('Driver')}>
        <ImageBackground 
          source={require('../assets/images/Driver.png')} 
          style={styles.buttonBackground}
          imageStyle={styles.buttonImage}
        >
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleUserReg('Customer')}>
        <ImageBackground 
          source={require('../assets/images/Customer.png')} 
          style={styles.buttonBackground}
          imageStyle={styles.buttonImage}
        >
        </ImageBackground>
      </TouchableOpacity>

      {/* Animated Splash Screen */}
      {showSplash && <AnimatedSplash onAnimationComplete={handleSplashComplete} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  title: {
    fontSize: moderateScale(38),
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'cursive',
    fontStyle: 'italic',
    color: '#6366f1',
    fontWeight: '300',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    lineHeight: moderateScale(45),
  },
  subtitle: {
    fontSize: moderateScale(28),
    fontWeight: '600',
    marginBottom: verticalScale(10),
    color: '#1f2937',
  },
  infoText: {
    fontSize: moderateScale(16),
    color: '#6b7280',
    marginBottom: verticalScale(40),
    width: scale(280),
    textAlign: 'center',
    lineHeight: moderateScale(22),
  },
  button: {
    width: scale(200),
    height: verticalScale(180),
    marginVertical: verticalScale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: moderateScale(15),
    overflow: 'hidden', // Ensures the image respects border radius
  },
  buttonBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  buttonImage: {
    borderRadius: moderateScale(15),
    resizeMode: 'cover',
  },
  buttonOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent overlay for text readability
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: moderateScale(24),
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});