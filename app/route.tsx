import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Image,
  Modal,
  FlatList,
  StatusBar,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

const { width, height } = Dimensions.get("window")

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size
const verticalScale = (size: number) => (height / 812) * size
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor

// Sample data for dropdowns
const locations = ["Kathmandu", "Biratnagar", "Itahari", "Dharan", "Damak", "Inaruwa"]

// Sample portrait images for slideshow - Fixed duplicate IDs and image sources
const portraitImages = [
  { id: 1, source: require("../assets/images/kathmandu.png"), name: "Kathmandu" },
  { id: 2, source: require("../assets/images/biratnagar.png"), name: "Biratnagar" },
  { id: 3, source: require("../assets/images/Dharan.png"), name: "Dharan" },
  { id: 4, source: require("../assets/images/damak.png"), name: "Damak" },
  { id: 5, source: require("../assets/images/itahari.png"), name: "Itahari" },
  { id: 6, source: require("../assets/images/Inaruwa.png"), name: "Inaruwa" },
]

export default function Routes() {
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const autoScrollInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-scroll functionality
  useEffect(() => {
    startAutoScroll()
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current)
      }
    }
  }, [])

  const startAutoScroll = () => {
    autoScrollInterval.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % portraitImages.length

        // Scroll to the next image
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: nextIndex * (scale(250) + scale(20)), // image width + margin
            animated: true,
          })
        }

        return nextIndex
      })
    }, 3000) // Change image every 3 seconds
  }

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current)
      autoScrollInterval.current = null
    }
  }

  const resumeAutoScroll = () => {
    if (!autoScrollInterval.current) {
      startAutoScroll()
    }
  }

  const handleGoBack = () => {
    // Navigate back to previous screen
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback navigation if no previous screen
      router.push('/');
    }
  };

  const handleLocationSelect = (location: string, type: "from" | "to") => {
    if (type === "from") {
      setFromLocation(location)
      setShowFromDropdown(false)
    } else {
      setToLocation(location)
      setShowToDropdown(false)
    }
  }

  const handleChooseFromMap = () => {
    // Handle map selection logic here
    console.log("Choose from map pressed")
  }

  const handleStartJourney = () => {
    // Navigate to dashboard page
    router.push("/dashboard")
  }

  const handleManualScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (scale(250) + scale(20)))
    setCurrentImageIndex(index)
  }

  const renderDropdown = (
    isVisible: boolean,
    onClose: () => void,
    onSelect: (location: string) => void,
    title: string,
  ) => (
    <Modal visible={isVisible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownTitle}>{title}</Text>
          <FlatList
            data={locations}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.dropdownItem} onPress={() => onSelect(item)}>
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  )

  const renderImageSlideshow = () => (
    <View style={styles.slideshowContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleManualScroll}
        onScrollBeginDrag={stopAutoScroll}
        onScrollEndDrag={resumeAutoScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {portraitImages.map((image, index) => (
          <View key={image.id} style={styles.imageContainer}>
            {/* Fixed: Use source directly, not wrapped in uri */}
            <Image source={image.source} style={styles.portraitImage} resizeMode="cover" />
            {/* Added back the image overlay */}
            <View style={styles.imageOverlay}>
              <Text style={styles.imageText}>{image.name}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.paginationContainer}>
        {portraitImages.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.paginationDot, index === currentImageIndex && styles.activePaginationDot]}
            onPress={() => {
              setCurrentImageIndex(index)
              scrollViewRef.current?.scrollTo({
                x: index * (scale(250) + scale(20)),
                animated: true,
              })
            }}
          />
        ))}
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Back Button Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* SamayaSafar Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>SamayaSafar</Text>
        </View>

        {/* Dropdown Section */}
        <View style={styles.dropdownSection}>
          {/* From Dropdown */}
          <View style={styles.dropdownWrapper}>
            <Text style={styles.label}>From:</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowFromDropdown(true)}>
              <Text style={[styles.dropdownText, !fromLocation && styles.placeholderText]}>
                {fromLocation || "Select departure city"}
              </Text>
              <Ionicons name="chevron-down" size={moderateScale(20)} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* To Dropdown */}
          <View style={styles.dropdownWrapper}>
            <Text style={styles.label}>To:</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowToDropdown(true)}>
              <Text style={[styles.dropdownText, !toLocation && styles.placeholderText]}>
                {toLocation || "Select destination city"}
              </Text>
              <Ionicons name="chevron-down" size={moderateScale(20)} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Map and Start Section */}
        <View style={styles.mapSection}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.startButton} onPress={handleStartJourney}>
              <Ionicons name="play" size={moderateScale(24)} color="#ffffff" />
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mapButton} onPress={handleChooseFromMap}>
              <Ionicons name="map" size={moderateScale(24)} color="#6366f1" />
              <Text style={styles.mapButtonText}>Map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Image Slideshow */}
        <View style={styles.slideshowSection}>
          <Text style={styles.sectionTitle}>Featured Routes</Text>
          {renderImageSlideshow()}
        </View>
      </ScrollView>

      {/* Dropdown Modals */}
      {renderDropdown(
        showFromDropdown,
        () => setShowFromDropdown(false),
        (location) => handleLocationSelect(location, "from"),
        "Select Departure City",
      )}

      {renderDropdown(
        showToDropdown,
        () => setShowToDropdown(false),
        (location) => handleLocationSelect(location, "to"),
        "Select Destination City",
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  scrollContainer: {
    flex: 1,
  },
  titleContainer: {
    alignItems: "center",
    paddingTop: verticalScale(40), // Start closer to top
    paddingBottom: verticalScale(30),
  },
  title: {
    fontSize: moderateScale(38),
    fontFamily: Platform.OS === "ios" ? "Snell Roundhand" : "cursive",
    fontStyle: "italic",
    color: "#6366f1",
    fontWeight: "300",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    lineHeight: moderateScale(45),
  },
  dropdownSection: {
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(15), // Reduced from 30 to 15
  },
  dropdownWrapper: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: verticalScale(8),
  },
  dropdown: {
    backgroundColor: "#c7d2fe",
    borderRadius: moderateScale(25),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: verticalScale(50),
  },
  dropdownText: {
    fontSize: moderateScale(16),
    color: "#1f2937",
    flex: 1,
  },
  placeholderText: {
    color: "#6b7280",
  },
  mapSection: {
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(30),
  },
  mapButton: {
    backgroundColor: "#ffffff",
    borderRadius: moderateScale(15),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#6366f1",
    flex: 1,
  },
  mapButtonText: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#6366f1",
    marginLeft: scale(8),
  },
  slideshowSection: {
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(30),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: verticalScale(20),
  },
  slideshowContainer: {
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: scale(10),
  },
  imageContainer: {
    width: scale(250),
    marginHorizontal: scale(10),
    position: "relative",
  },
  portraitImage: {
    width: scale(250),
    height: verticalScale(350),
    borderRadius: moderateScale(15),
    backgroundColor: "#e5e7eb",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderBottomLeftRadius: moderateScale(15),
    borderBottomRightRadius: moderateScale(15),
    paddingVertical: verticalScale(10),
    alignItems: "center",
  },
  imageText: {
    color: "#ffffff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  paginationContainer: {
    flexDirection: "row",
    marginTop: verticalScale(15),
  },
  paginationDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: "#d1d5db",
    marginHorizontal: scale(4),
  },
  activePaginationDot: {
    backgroundColor: "#6366f1",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    backgroundColor: "#ffffff",
    borderRadius: moderateScale(15),
    padding: scale(20),
    width: scale(300),
    maxHeight: verticalScale(400),
  },
  dropdownTitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: verticalScale(15),
    textAlign: "center",
  },
  dropdownItem: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  dropdownItemText: {
    fontSize: moderateScale(16),
    color: "#1f2937",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(15),
  },
  startButton: {
    backgroundColor: "#6366f1",
    borderRadius: moderateScale(15),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
  },
  startButtonText: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: scale(8),
  },
})
