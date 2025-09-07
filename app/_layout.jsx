import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import SafeScreen from "@/components/safescreen";
import CartProvider from "@/context/CartContext";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <CartProvider>
        <SafeScreen>
          <Slot />
        </SafeScreen>
      </CartProvider>
    </ClerkProvider>
  );
}


