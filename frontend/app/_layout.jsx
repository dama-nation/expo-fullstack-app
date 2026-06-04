import { Slot } from 'expo-router';
import SafeScreen from "@/components/SafeScreen";
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';


export default function RootLayout() {
  return (
    <ClerkProvider 
      tokenCache={tokenCache} 
      publishableKey="pk_test_Y2FyZWZ1bC1tb2xsdXNrLTYxLmNsZXJrLmFjY291bnRzLmRldiQ"
    >
       
        <SafeScreen>
          <Slot />
        </SafeScreen>
      
    </ClerkProvider>
  );
}