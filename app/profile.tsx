import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import * as ImagePicker from "expo-image-picker"

const { width, height } = Dimensions.get("window")

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size
const verticalScale = (size: number) => (height / 812) * size
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor

export default function Profile() {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGoBack = () => {
    router.back()
  }

  const handleImagePicker = async () => {
    try {
      // Request permission to access the media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permission Required", "Please grant camera roll permissions to change your profile picture.", [
          { text: "OK" },
        ])
        return
      }

      setIsLoading(true)

      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      })

      setIsLoading(false)

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Set the selected image as the profile image
        setProfileImage(result.assets[0].uri)
      }
    } catch (error) {
      setIsLoading(false)
      Alert.alert("Error", "Failed to pick an image. Please try again.")
      console.error("Image picker error:", error)
    }
  }

  const handleEditProfile = () => {
    console.log("Edit Profile pressed")
    // Navigate to edit profile page
  }

  const handleDeleteProfile = () => {
    Alert.alert("Delete Profile", "Are you sure you want to delete your profile? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => console.log("Profile deleted") },
    ])
  }

  const handleFAQ = () => {
    console.log("FAQ pressed")
    // Navigate to FAQ page
  }

  const handlePrivacyPolicy = () => {
    console.log("Privacy Policy pressed")
    // Navigate to privacy policy page
  }

  const handleSOSCall = () => {
    Alert.alert("Emergency Call", "Do you want to make an emergency call?", [
      { text: "Cancel", style: "cancel" },
      { text: "Call Now", onPress: () => console.log("Emergency call initiated") },
    ])
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          console.log("User logged out")
          router.push("/") // Navigate to login/home
        },
      },
    ])
  }

  const ProfileOption = ({
    icon,
    title,
    onPress,
    color = "#1f2937",
    showArrow = true,
    backgroundColor = "#ffffff",
  }: {
    icon: string
    title: string
    onPress: () => void
    color?: string
    showArrow?: boolean
    backgroundColor?: string
  }) => (
    <TouchableOpacity style={[styles.profileOption, { backgroundColor }]} onPress={onPress}>
      <View style={styles.optionLeft}>
        <Ionicons name={icon as any} size={moderateScale(24)} color={color} />
        <Text style={[styles.optionText, { color }]}>{title}</Text>
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={moderateScale(20)} color="#6b7280" />}
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={moderateScale(24)} color="#6366f1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
              </View>
            ) : (
              <Image
                source={profileImage ? { uri: profileImage } : require("../assets/images/Driver.png")}
                style={styles.profileImage}
              />
            )}
            <TouchableOpacity style={styles.editImageButton} onPress={handleImagePicker}>
              <Ionicons name="camera" size={moderateScale(16)} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Username</Text>
          <Text style={styles.userEmail}>user@example.com</Text>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          <ProfileOption icon="person-outline" title="Edit Profile" onPress={handleEditProfile} />

          <ProfileOption icon="help-circle-outline" title="FAQ" onPress={handleFAQ} />

          <ProfileOption icon="shield-outline" title="Privacy Policy" onPress={handlePrivacyPolicy} />

          <ProfileOption
            icon="call-outline"
            title="SOS Emergency Call"
            onPress={handleSOSCall}
            color="#dc2626"
            backgroundColor="#fef2f2"
          />

          <ProfileOption
            icon="trash-outline"
            title="Delete Profile"
            onPress={handleDeleteProfile}
            color="#dc2626"
            backgroundColor="#fef2f2"
          />

          <ProfileOption
            icon="log-out-outline"
            title="Logout"
            onPress={handleLogout}
            color="#dc2626"
            backgroundColor="#fef2f2"
            showArrow={false}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop:
      Platform.OS === "ios"
        ? verticalScale(20)
        : StatusBar.currentHeight
          ? StatusBar.currentHeight + verticalScale(5)
          : verticalScale(15), // Reduced top padding
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(20),
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: "600",
    color: "#1f2937",
  },
  placeholder: {
    width: scale(40),
  },
  scrollContainer: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingVertical: verticalScale(30),
    marginBottom: verticalScale(20),
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: verticalScale(16),
    width: scale(100),
    height: scale(100),
  },
  loadingContainer: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    borderWidth: 4,
    borderColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  profileImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    borderWidth: 4,
    borderColor: "#6366f1",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  userName: {
    fontSize: moderateScale(24),
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: verticalScale(4),
  },
  userEmail: {
    fontSize: moderateScale(16),
    color: "#6b7280",
  },
  optionsContainer: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(30),
  },
  profileOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionText: {
    fontSize: moderateScale(16),
    fontWeight: "500",
    marginLeft: scale(16),
  },
})
