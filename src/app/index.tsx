import AppButton from "@/src/components/ui/app-button";
import WeatherInformationComponent from "@/src/components/weather-information-component";
import { Colors, Spacing } from "@/src/constants/theme";
import { useLocation } from "@/src/hooks/useLocation";
import { StatusStyles } from "@/src/styles/status-styles";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from "react";
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const {
    permissionStatus,
    getCurrentLocation,
    location
  } = useLocation();

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    if (!permissionStatus.errorMessage) return;

    Alert.alert(permissionStatus.errorMessage);
  }, [permissionStatus.errorMessage]);

  const handleOpenAppSettings = async () => {
    try {
      // TODO: Verify on Android and iOS dev builds that this opens the app-specific settings screen.
      await Linking.openSettings();
    } catch {
      Alert.alert("Unable to open settings right now.");
    }
  };

  if (permissionStatus.status === 'loading') {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size="large" color={Colors.text} />
        <Text style={StatusStyles.statusText}>Getting your location...</Text>
      </View>
    );
  }

  if (permissionStatus.status === 'error') {
    const canRetry = permissionStatus.canAskForPermissionAgain === true;
    return (
      <View style={styles.container}>
        {
          canRetry ? (
            <>
              <View style={StatusStyles.errorIconContainer}>
                <EvilIcons name="location" size={64} color={Colors.success} />
              </View>

              <Text style={StatusStyles.statusText}>Location permission is required. Tap Retry button for try again.</Text>

              <AppButton style={StatusStyles.statusButton} onPress={getCurrentLocation}>Retry</AppButton>
            </>
          ) : (
            <>
              <View style={StatusStyles.errorIconContainer}>
                <Ionicons name="warning" size={64} color={Colors.warning} />
              </View>

              <Text style={StatusStyles.statusText}>Location permission is required. Please enable it in your device settings to continue.</Text>

              <AppButton style={StatusStyles.statusButton} onPress={handleOpenAppSettings}>Open Settings</AppButton>
            </>
          )
        }
      </View>
    )
  }

  const latitude = location.latitude;
  const longitude = location.longitude;
  if (permissionStatus.status === 'success' && latitude !== null && longitude !== null) {
    return <WeatherInformationComponent location={{ latitude, longitude }} />
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.text} />

      <Text style={StatusStyles.statusText}>Preparing your location...</Text>
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
});
