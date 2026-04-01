import AppButton from "@/src/components/ui/app-button";
import { Colors, Radius, Spacing } from "@/src/constants/theme";
import { useLocation } from "@/src/hooks/useLocation";
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

  if (permissionStatus.isLoading) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size="large" color={Colors.text} />
        <Text style={styles.statusText}>Getting your location...</Text>
      </View>
    );
  }

  if (permissionStatus.errorMessage) {
    const canRetry = permissionStatus.canAskForPermissionAgain === true;
    return (
      <View style={styles.container}>
        {
          canRetry ? (
            <>
              <View style={styles.permissionIconContainer}>
                <EvilIcons name="location" size={64} color={Colors.success} />
              </View>

              <Text style={styles.statusText}>Location permission is required. Tap Retry button for try again.</Text>

              <AppButton style={styles.permissionButton} onPress={getCurrentLocation}>Retry</AppButton>
            </>
          ) : (
            <>
              <View style={styles.permissionIconContainer}>
                <Ionicons name="warning" size={64} color={Colors.warning} />
              </View>

              <Text style={styles.statusText}>
                Location permission is required. Please enable it in your device settings to continue.
              </Text>

              <AppButton style={styles.permissionButton} onPress={handleOpenAppSettings}>Open Settings</AppButton>
            </>
          )
        }
      </View>
    )
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

  permissionIconContainer: {
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

  permissionButton: {
    marginTop: Spacing.five
  },
});
