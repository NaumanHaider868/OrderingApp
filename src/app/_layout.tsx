import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme, View } from "react-native";

import KitchenScreen from "@/app/explore";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import {
  RestaurantStateProvider,
  useRestaurantState,
} from "@/components/restaurant/restaurant-state";
import { StaffLogin } from "@/components/restaurant/staff-login";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <RestaurantStateProvider>
        <RoleShell />
      </RestaurantStateProvider>
    </ThemeProvider>
  );
}

function RoleShell() {
  const { role } = useRestaurantState();
  return (
    <View style={{ flex: 1 }}>
      <AnimatedSplashOverlay />
      {role === "kitchen" ? (
        <KitchenScreen />
      ) : role ? (
        <AppTabs />
      ) : (
        <StaffLogin />
      )}
    </View>
  );
}
