import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
}

export default function AnimatedSplash({ onAnimationComplete }: AnimatedSplashProps) {
  const textTranslateX = useRef(new Animated.Value(-width)).current;
  const smokeOpacity = useRef(new Animated.Value(0)).current;
  const smokeScale = useRef(new Animated.Value(0.5)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start the animation sequence
    const animationSequence = Animated.sequence([
      // First, fade in the text slightly
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      // Then animate text from left with super speed
      Animated.timing(textTranslateX, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    // Smoke effect animation (parallel with text)
    const smokeAnimation = Animated.parallel([
      Animated.timing(smokeOpacity, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(smokeScale, {
        toValue: 1.5,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
    ]);

    // Fade out smoke
    const smokeFadeOut = Animated.timing(smokeOpacity, {
      toValue: 0,
      duration: 400,
      delay: 200,
      useNativeDriver: true,
    });

    // Fade out entire splash screen
    const splashFadeOut = Animated.timing(containerOpacity, {
      toValue: 0,
      duration: 500,
      delay: 1000,
      useNativeDriver: true,
    });

    // Start all animations
    Animated.parallel([animationSequence, smokeAnimation]).start(() => {
      smokeFadeOut.start(() => {
        splashFadeOut.start(() => {
          onAnimationComplete();
        });
      });
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      {/* Smoke Effect */}
      <Animated.View
        style={[
          styles.smokeContainer,
          {
            opacity: smokeOpacity,
            transform: [{ scale: smokeScale }],
          },
        ]}
      >
        <View style={styles.smoke1} />
        <View style={styles.smoke2} />
        <View style={styles.smoke3} />
      </Animated.View>

      {/* Animated Text */}
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: textOpacity,
            transform: [{ translateX: textTranslateX }],
          },
        ]}
      >
        SamayaSafar
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  title: {
    fontSize: moderateScale(48),
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'cursive',
    fontStyle: 'italic',
    color: '#6366f1',
    fontWeight: '300',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    lineHeight: moderateScale(55),
    zIndex: 2,
  },
  smokeContainer: {
    position: 'absolute',
    width: scale(300),
    height: verticalScale(200),
    justifyContent: 'center',
    alignItems: 'center',
  },
  smoke1: {
    position: 'absolute',
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    left: scale(-20),
    top: verticalScale(-10),
  },
  smoke2: {
    position: 'absolute',
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    right: scale(-10),
    top: verticalScale(20),
  },
  smoke3: {
    position: 'absolute',
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    left: scale(10),
    bottom: verticalScale(-20),
  },
});