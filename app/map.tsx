import { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
  TextInput,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { WebView } from "react-native-webview"

const { width, height } = Dimensions.get("window")

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size
const verticalScale = (size: number) => (height / 812) * size
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor

// Sample locations in Nepal
const NEPAL_LOCATIONS = [
  { id: 1, name: "Kathmandu", latitude: 27.7172, longitude: 85.324, description: "Capital City" },
  { id: 2, name: "Biratnagar", latitude: 26.4525, longitude: 87.2718, description: "Industrial City" },
  { id: 3, name: "Dharan", latitude: 26.8147, longitude: 87.2799, description: "Sub-Metropolitan City" },
  { id: 4, name: "Itahari", latitude: 26.6649, longitude: 87.2718, description: "Commercial Hub" },
  { id: 5, name: "Damak", latitude: 26.6586, longitude: 87.7042, description: "Border Town" },
  { id: 6, name: "Inaruwa", latitude: 26.5333, longitude: 87.0833, description: "Rural Municipality" },
]

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<(typeof NEPAL_LOCATIONS)[0] | null>(null)
  const [filteredLocations, setFilteredLocations] = useState(NEPAL_LOCATIONS)
  const webViewRef = useRef<WebView>(null)

  const handleGoBack = () => {
    router.back()
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setFilteredLocations(NEPAL_LOCATIONS)
    } else {
      const filtered = NEPAL_LOCATIONS.filter((location) => location.name.toLowerCase().includes(query.toLowerCase()))
      setFilteredLocations(filtered)
    }
  }

  const handleLocationSelect = (location: (typeof NEPAL_LOCATIONS)[0]) => {
    setSelectedLocation(location)
    setSearchQuery(location.name)
    setFilteredLocations([])

    // Send message to WebView to center on location
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          type: "centerMap",
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      )
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setFilteredLocations([])
    setSelectedLocation(null)
  }

  const handleGetDirections = () => {
    if (selectedLocation) {
      Alert.alert("Directions", `Getting directions to ${selectedLocation.name}`, [{ text: "OK" }])
    }
  }

  const handleSelectDestination = () => {
    if (selectedLocation) {
      Alert.alert("Destination Selected", `${selectedLocation.name} has been set as your destination`, [
        { text: "OK", onPress: () => router.back() },
      ])
    }
  }

  // Create markers for the map
  const markersJS = NEPAL_LOCATIONS.map(
    (location) => `
    L.marker([${location.latitude}, ${location.longitude}])
      .addTo(map)
      .bindPopup('<b>${location.name}</b><br>${location.description}')
      .on('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'markerClick',
          location: ${JSON.stringify(location)}
        }));
      });
  `,
  ).join("")

  const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nepal Map</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        var map = L.map('map').setView([27.7172, 85.324], 7);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        ${markersJS}

        // Listen for messages from React Native
        document.addEventListener('message', function(event) {
          var data = JSON.parse(event.data);
          if (data.type === 'centerMap') {
            map.setView([data.latitude, data.longitude], 10);
          }
        });

        // For Android
        window.addEventListener('message', function(event) {
          var data = JSON.parse(event.data);
          if (data.type === 'centerMap') {
            map.setView([data.latitude, data.longitude], 10);
          }
        });
      </script>
    </body>
    </html>
  `

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data.type === "markerClick") {
        setSelectedLocation(data.location)
        Alert.alert(data.location.name, data.location.description, [
          { text: "Cancel", style: "cancel" },
          { text: "Select Route", onPress: () => console.log(`Selected route to ${data.location.name}`) },
        ])
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={moderateScale(24)} color="#6366f1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Route Map</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={moderateScale(20)} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search locations..."
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={moderateScale(20)} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results */}
        {filteredLocations.length > 0 && searchQuery.length > 0 && (
          <View style={styles.searchResults}>
            {filteredLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.searchResultItem}
                onPress={() => handleLocationSelect(location)}
              >
                <Ionicons name="location" size={moderateScale(16)} color="#6366f1" />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationDescription}>{location.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Map */}
      <WebView
        ref={webViewRef}
        source={{ html: mapHTML }}
        style={styles.map}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        )}
      />

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            if (webViewRef.current) {
              webViewRef.current.postMessage(
                JSON.stringify({
                  type: "centerMap",
                  latitude: 27.7172,
                  longitude: 85.324,
                }),
              )
            }
          }}
        >
          <Ionicons name="home" size={moderateScale(20)} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {/* Selected Location Info */}
      {selectedLocation && (
        <View style={styles.locationCard}>
          <View style={styles.locationCardHeader}>
            <View style={styles.locationCardInfo}>
              <Text style={styles.selectedLocationName}>{selectedLocation.name}</Text>
              <Text style={styles.selectedLocationDescription}>{selectedLocation.description}</Text>
              <Text style={styles.locationCoordinates}>
                {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedLocation(null)} style={styles.closeCardButton}>
              <Ionicons name="close" size={moderateScale(20)} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.locationCardActions}>
            <TouchableOpacity style={styles.directionsButton} onPress={handleGetDirections}>
              <Ionicons name="navigate" size={moderateScale(18)} color="#ffffff" />
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectButton} onPress={handleSelectDestination}>
              <Text style={styles.selectButtonText}>Select as Destination</Text>
            </TouchableOpacity>
          </View>
        </View>
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
          : verticalScale(15),
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(20),
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
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
  searchContainer: {
    backgroundColor: "#ffffff",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    zIndex: 999,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
  },
  searchIcon: {
    marginRight: scale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: "#1f2937",
    paddingVertical: verticalScale(4),
  },
  clearButton: {
    marginLeft: scale(8),
  },
  searchResults: {
    backgroundColor: "#ffffff",
    borderRadius: moderateScale(12),
    marginTop: verticalScale(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: verticalScale(200),
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  locationInfo: {
    marginLeft: scale(12),
    flex: 1,
  },
  locationName: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#1f2937",
  },
  locationDescription: {
    fontSize: moderateScale(14),
    color: "#6b7280",
    marginTop: verticalScale(2),
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  loadingText: {
    fontSize: moderateScale(16),
    color: "#6b7280",
  },
  mapControls: {
    position: "absolute",
    top: verticalScale(200),
    right: scale(16),
    backgroundColor: "#ffffff",
    borderRadius: moderateScale(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButton: {
    width: scale(44),
    height: scale(44),
    justifyContent: "center",
    alignItems: "center",
  },
  locationCard: {
    position: "absolute",
    bottom: verticalScale(20),
    left: scale(16),
    right: scale(16),
    backgroundColor: "#ffffff",
    borderRadius: moderateScale(16),
    padding: scale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  locationCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(12),
  },
  locationCardInfo: {
    flex: 1,
  },
  selectedLocationName: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#1f2937",
  },
  selectedLocationDescription: {
    fontSize: moderateScale(14),
    color: "#6b7280",
    marginTop: verticalScale(2),
  },
  locationCoordinates: {
    fontSize: moderateScale(12),
    color: "#6b7280",
    marginTop: verticalScale(4),
  },
  closeCardButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  locationCardActions: {
    flexDirection: "row",
    gap: scale(12),
  },
  directionsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366f1",
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
  },
  directionsButtonText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: scale(6),
  },
  selectButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
    borderWidth: 1,
    borderColor: "#6366f1",
  },
  selectButtonText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#6366f1",
  },
})
