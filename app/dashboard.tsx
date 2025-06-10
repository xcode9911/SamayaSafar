import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

// Dummy driver data
const driversData = [
  {
    id: 1,
    name: "Ram Bahadur",
    vehicle: "Toyota Hiace",
    rating: 4.8,
    price: "Rs. 1200",
    departureTime: "08:00 AM",
    arrivalTime: "02:00 PM",
    availableSeats: 12,
    image: require("../assets/images/Driver.png"),
  },
  {
    id: 2,
    name: "Shyam Kumar",
    vehicle: "Mahindra Bolero",
    rating: 4.6,
    price: "Rs. 1000",
    departureTime: "09:30 AM",
    arrivalTime: "03:30 PM",
    availableSeats: 8,
    image: require("../assets/images/Driver.png"),
  },
  {
    id: 3,
    name: "Hari Prasad",
    vehicle: "Tata Sumo",
    rating: 4.9,
    price: "Rs. 1100",
    departureTime: "10:00 AM",
    arrivalTime: "04:00 PM",
    availableSeats: 6,
    image: require("../assets/images/Driver.png"),
  },
  {
    id: 4,
    name: "Krishna Thapa",
    vehicle: "Maruti Eeco",
    rating: 4.7,
    price: "Rs. 900",
    departureTime: "11:00 AM",
    arrivalTime: "05:00 PM",
    availableSeats: 4,
    image: require("../assets/images/Driver.png"),
  },
  {
    id: 5,
    name: "Gopal Sharma",
    vehicle: "Toyota Hiace",
    rating: 4.5,
    price: "Rs. 1300",
    departureTime: "12:00 PM",
    arrivalTime: "06:00 PM",
    availableSeats: 15,
    image: require("../assets/images/Driver.png"),
  },
]

export default function Dashboard() {
  const [fromLocation, setFromLocation] = useState("Kathmandu") // Default from routes page
  const [toLocation, setToLocation] = useState("Biratnagar") // Default from routes page
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)

  const handleLocationSelect = (location: string, type: "from" | "to") => {
    if (type === "from") {
      setFromLocation(location)
      setShowFromDropdown(false)
    } else {
      setToLocation(location)
      setShowToDropdown(false)
    }
  }

  const handleProfilePress = () => {
    router.push("/profile")
  }

  const handleBookSeat = (driverId: number) => {
    console.log(`Booking seat with driver ${driverId}`)
    // Handle seat booking logic
  }

  const handleTrackDriver = (driverId: number) => {
    console.log(`Tracking driver ${driverId}`)
    // Handle driver tracking logic
  }

  const handleMapPress = () => {
    router.push("/map")
    // Handle map functionality
  }

  const handleChatPress = () => {
    // Navigate to chat screen
    router.push("/chat")
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

  const renderDriverCard = ({ item }: { item: (typeof driversData)[0] }) => (
    <View style={styles.driverCard}>
      <View style={styles.driverHeader}>
        <Image source={item.image} style={styles.driverImage} />
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{item.name}</Text>
          <Text style={styles.vehicleInfo}>{item.vehicle}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={moderateScale(16)} color="#fbbf24" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.perPerson}>per person</Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.timeInfo}>
          <Text style={styles.timeLabel}>Departure</Text>
          <Text style={styles.time}>{item.departureTime}</Text>
        </View>
        <Ionicons name="arrow-forward" size={moderateScale(20)} color="#6b7280" />
        <View style={styles.timeInfo}>
          <Text style={styles.timeLabel}>Arrival</Text>
          <Text style={styles.time}>{item.arrivalTime}</Text>
        </View>
      </View>

      <View style={styles.seatsContainer}>
        <Text style={styles.seatsText}>{item.availableSeats} seats available</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.trackButton} onPress={() => handleTrackDriver(item.id)}>
          <Ionicons name="location" size={moderateScale(18)} color="#6366f1" />
          <Text style={styles.trackButtonText}>Track</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton} onPress={() => handleBookSeat(item.id)}>
          <Text style={styles.bookButtonText}>Book Seat</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hi, Henry Mathews</Text>
        </View>
        <TouchableOpacity style={styles.profileContainer} onPress={handleProfilePress}>
          <Image source={require("../assets/images/Driver.png")} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      {/* Route Selection */}
      <View style={styles.routeSection}>
        <View style={styles.routeRow}>
          <View style={styles.routeDropdown}>
            <Text style={styles.routeLabel}>From:</Text>
            <TouchableOpacity style={styles.routeButton} onPress={() => setShowFromDropdown(true)}>
              <Text style={styles.routeText}>{fromLocation}</Text>
              <Ionicons name="chevron-down" size={moderateScale(16)} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.routeDropdown}>
            <Text style={styles.routeLabel}>To:</Text>
            <TouchableOpacity style={styles.routeButton} onPress={() => setShowToDropdown(true)}>
              <Text style={styles.routeText}>{toLocation}</Text>
              <Ionicons name="chevron-down" size={moderateScale(16)} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Available Drivers */}
      <View style={styles.driversSection}>
        <Text style={styles.sectionTitle}>Available Drivers</Text>
        <FlatList
          data={driversData}
          renderItem={renderDriverCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.driversList}
        />
      </View>

      {/* Floating Action Buttons */}
      <View style={styles.floatingButtons}>
        <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
          <Ionicons name="chatbubble" size={moderateScale(24)} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapButton} onPress={handleMapPress}>
          <Ionicons name="map" size={moderateScale(24)} color="#ffffff" />
        </TouchableOpacity>
      </View>

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop:
      Platform.OS === "ios"
        ? verticalScale(20)
        : StatusBar.currentHeight
          ? StatusBar.currentHeight + verticalScale(5)
          : verticalScale(15), // Reduced from 50 to 20 for iOS, and reduced Android padding
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(20),
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: moderateScale(24),
    fontWeight: "600",
    color: "#1f2937",
  },
  profileContainer: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  routeSection: {
    backgroundColor: "#ffffff",
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  routeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(15),
  },
  routeDropdown: {
    flex: 1,
  },
  routeLabel: {
    fontSize: moderateScale(14),
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: verticalScale(8),
  },
  routeButton: {
    backgroundColor: "#c7d2fe",
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeText: {
    fontSize: moderateScale(16),
    fontWeight: "500",
    color: "#1f2937",
  },
  driversSection: {
    flex: 1,
    paddingHorizontal: scale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: verticalScale(16),
  },
  driversList: {
    paddingBottom: verticalScale(100), // Space for floating buttons
  },
  driverCard: {
    backgroundColor: "#ffffff",
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  driverImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    marginRight: scale(12),
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: verticalScale(2),
  },
  vehicleInfo: {
    fontSize: moderateScale(14),
    color: "#6b7280",
    marginBottom: verticalScale(4),
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: moderateScale(14),
    fontWeight: "500",
    color: "#1f2937",
    marginLeft: scale(4),
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: "#6366f1",
  },
  perPerson: {
    fontSize: moderateScale(12),
    color: "#6b7280",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
    paddingHorizontal: scale(8),
  },
  timeInfo: {
    alignItems: "center",
  },
  timeLabel: {
    fontSize: moderateScale(12),
    color: "#6b7280",
    marginBottom: verticalScale(2),
  },
  time: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#1f2937",
  },
  seatsContainer: {
    marginBottom: verticalScale(12),
  },
  seatsText: {
    fontSize: moderateScale(14),
    color: "#059669",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(12),
  },
  trackButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(10),
    borderWidth: 1,
    borderColor: "#6366f1",
  },
  trackButtonText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#6366f1",
    marginLeft: scale(4),
  },
  bookButton: {
    flex: 2,
    backgroundColor: "#6366f1",
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#ffffff",
  },
  floatingButtons: {
    position: "absolute",
    bottom: verticalScale(30),
    right: scale(24),
    alignItems: "center",
  },
  chatButton: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  mapButton: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
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
})
