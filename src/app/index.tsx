import { Colors, Radius, Spacing } from "@/src/constants/theme";
import { useLocation } from "@/src/hooks/useLocation";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useEffect } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import AppButton from "../components/ui/app-button";

export default function Index() {
  const {
    getCurrentLocation,
    isLoading,
    errorMessage,
    location
  } = useLocation();

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const displayErrorAlert = (message: string) => {
    Alert.alert(message);
  }

  if (isLoading) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size="large" color={Colors.text} />
        <Text style={styles.statusText}>Getting your location...</Text>
      </View>
    );
  }

  if (errorMessage) {
    displayErrorAlert(errorMessage);

    return (
      <View style={styles.container}>
        <View style={styles.locationCircler}>
          <EvilIcons name="location" size={64} color={Colors.muted} />
        </View>

        <Text style={styles.statusText}>{errorMessage}</Text>

        <AppButton style={styles.getLocationButton}>Retry</AppButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* App ui */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Spacing.four,
  },

  locationCircler: {
    width: 128,
    height: 128,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center'
  },

  statusText: {
    marginTop: Spacing.four,
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
  },

  getLocationButton: {
    marginTop: Spacing.five
  },
});
