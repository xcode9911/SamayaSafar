import { useState, useEffect, useRef } from "react"
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

const { width, height } = Dimensions.get("window")

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size
const verticalScale = (size: number) => (height / 812) * size
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor

// Replace with your Gemini API key
const API_KEY = "AIzaSyD2v96QjM_DUTiiWUHXGuF-kDV8lrzt-5o"

// Sample suggestions for weather and routes - shortened for better display
const SUGGESTIONS = [
  "Weather in Kathmandu?",
  "Traffic to Biratnagar?",
  "Bus times Dharan-Damak?",
  "Road closures?",
  "Route Itahari-Inaruwa?",
]

export default function ChatScreen() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai"; timestamp: Date }[]>([
    {
      text: "Hello! I'm your SamayaSafar assistant. How can I help you with weather updates or route information today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  const handleGoBack = () => {
    router.back()
  }

  // Function to format text with bold styling
  const formatText = (text: string) => {
    // Split text by ** markers and create formatted components
    const parts = text.split(/(\*\*.*?\*\*)/g)

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Remove ** markers and make text bold
        const boldText = part.slice(2, -2)
        return (
          <Text key={index} style={styles.boldText}>
            {boldText}
          </Text>
        )
      }
      return part
    })
  }

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim()) return

    // Add user message to chat
    const userMessage = messageText
    setMessages((prev) => [...prev, { text: userMessage, sender: "user", timestamp: new Date() }])
    setInput("")
    setIsLoading(true)

    try {
      // Enhance the prompt with context about SamayaSafar
      const enhancedPrompt = `As a SamayaSafar travel assistant, please provide helpful information about ${userMessage}. Focus on Nepal's weather, road conditions, traffic updates, and transportation routes if relevant.`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: enhancedPrompt }] }],
          }),
        },
      )

      const data = await response.json()

      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const aiResponse = data.candidates[0].content.parts[0].text
        setMessages((prev) => [...prev, { text: aiResponse, sender: "ai", timestamp: new Date() }])
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          sender: "ai",
          timestamp: new Date(),
        },
      ])
      Alert.alert("Connection Error", "Failed to get a response. Please check your internet connection.")
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={moderateScale(24)} color="#6366f1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageContainer}>
            <View
              style={[
                styles.messageWrapper,
                msg.sender === "user" ? styles.userMessageWrapper : styles.aiMessageWrapper,
              ]}
            >
              <View style={[styles.message, msg.sender === "user" ? styles.userMessage : styles.aiMessage]}>
                <Text style={[styles.messageText, msg.sender === "user" ? styles.userText : styles.aiText]}>
                  {msg.sender === "ai" ? formatText(msg.text) : msg.text}
                </Text>
              </View>
            </View>
            <View
              style={[styles.timestampContainer, msg.sender === "user" ? styles.userTimestamp : styles.aiTimestamp]}
            >
              <Text style={styles.timestamp}>{formatTime(msg.timestamp)}</Text>
            </View>
          </View>
        ))}
        {isLoading && (
          <View style={styles.messageContainer}>
            <View style={styles.aiMessageWrapper}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#6366f1" />
                <Text style={styles.loadingText}>Thinking...</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Suggestions */}
      {messages.length < 3 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsContainer}
        >
          {SUGGESTIONS.map((suggestion, index) => (
            <TouchableOpacity key={index} style={styles.suggestionChip} onPress={() => sendMessage(suggestion)}>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
              onPress={() => sendMessage()}
              disabled={!input.trim() || isLoading}
            >
              <Ionicons
                name="send"
                size={moderateScale(18)}
                color={input.trim() && !isLoading ? "#ffffff" : "#c7d2fe"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  chatContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  chatContent: {
    padding: scale(16),
    paddingBottom: scale(24),
  },
  messageContainer: {
    marginBottom: verticalScale(16),
    width: "100%",
  },
  messageWrapper: {
    maxWidth: "85%",
  },
  userMessageWrapper: {
    alignSelf: "flex-end",
  },
  aiMessageWrapper: {
    alignSelf: "flex-start",
  },
  message: {
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  userMessage: {
    backgroundColor: "#6366f1",
    borderBottomRightRadius: moderateScale(4),
  },
  aiMessage: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderBottomLeftRadius: moderateScale(4),
  },
  messageText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
  },
  userText: {
    color: "#ffffff",
  },
  aiText: {
    color: "#1f2937",
  },
  boldText: {
    fontWeight: "700",
    color: "#1f2937",
  },
  timestampContainer: {
    marginTop: verticalScale(4),
    paddingHorizontal: scale(4),
  },
  userTimestamp: {
    alignItems: "flex-end",
  },
  aiTimestamp: {
    alignItems: "flex-start",
  },
  timestamp: {
    fontSize: moderateScale(12),
    color: "#6b7280",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderBottomLeftRadius: moderateScale(4),
  },
  loadingText: {
    fontSize: moderateScale(16),
    color: "#6b7280",
    marginLeft: scale(8),
  },
  suggestionsContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(4), // Reduced from 8 to 4
    flexDirection: "row",
    gap: scale(6),
  },
  suggestionChip: {
    backgroundColor: "#ffffff",
    borderRadius: moderateScale(14), // Reduced from 16 to 14
    paddingHorizontal: scale(10), // Reduced from 12 to 10
    paddingVertical: verticalScale(4), // Reduced from 6 to 4
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  suggestionText: {
    fontSize: moderateScale(11), // Reduced from 12 to 11
    color: "#6366f1",
    fontWeight: "500",
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    position: "relative",
  },
  input: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    paddingRight: scale(44), // Adjusted to accommodate send button
    fontSize: moderateScale(16),
    maxHeight: verticalScale(120),
    color: "#1f2937",
    textAlignVertical: "top",
    marginRight: scale(8), // Added margin to separate from send button
  },
  sendButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: scale(2), // Slight adjustment for better alignment
  },
  sendButtonDisabled: {
    backgroundColor: "#e5e7eb",
  },
})
