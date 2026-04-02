import AppButton from "@/src/components/ui/app-button";
import AppLoading from "@/src/components/ui/app-loading";
import AppLottie from "@/src/components/ui/app-lottie";
import AppText from "@/src/components/ui/app-text";
import WeatherInformation from "@/src/components/weather-information";
import { Animations } from "@/src/constants/animations";
import { Colors, Spacing } from "@/src/constants/theme";
import { useLocation } from "@/src/hooks/useLocation";
import { StatusStyles } from "@/src/styles/status-styles";
import { useEffect } from "react";
import { Alert, Linking, StyleSheet, View } from "react-native";

export default function Index() {
  const {
    permissionStatus,
    getCurrentLocation,
    location
  } = useLocation();

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

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
      <View style={styles.container}>
        <AppLoading title="Getting your location..." />
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
              <AppLottie source={Animations.error} />

              <AppText style={StatusStyles.statusText}>Location permission is required. Tap Retry button for try again.</AppText>

              <AppButton style={StatusStyles.statusButton} onPress={getCurrentLocation}>Retry</AppButton>
            </>
          ) : (
            <>
              <AppLottie source={Animations.error} />

              <AppText style={StatusStyles.statusText}>Location permission is required. Please enable it in your device settings to continue.</AppText>

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
    return <WeatherInformation location={{ latitude, longitude }} />
  }

  return (
    <View style={styles.container}>
      <AppLoading title="Preparing your location..." />
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
