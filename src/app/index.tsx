import { useLocation } from "@/src/hooks/useLocation";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const {
    getCurrentLocation,
    isLoading,
    errorMessage,
    location
  } = useLocation();

  useEffect(() => {
    console.log('Requesting location...');
    getCurrentLocation();
  }, [getCurrentLocation]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: '#9eb8ea' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.statusText}>Getting your location...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.coordinateText}>Latitude: {location.latitude}</Text>
      <Text style={styles.coordinateText}>Longitude: {location.longitude}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },

  statusText: {
    fontSize: 16,
    textAlign: "center",
    color: "#1f2937",
  },
  
  coordinateText: {
    fontSize: 18,
    color: "#111827",
  },
});
