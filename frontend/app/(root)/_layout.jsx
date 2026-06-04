import { useUser, useClerk } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";

function CustomDrawerContent(props) {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        {/* SIDEBAR HEADER - Bold Blue background to make the white text pop */}
        <View style={[styles.drawerHeader, { backgroundColor: COLORS.primary }]}>
          <View style={styles.avatarContainer}>
             <Text style={[styles.avatarText, { color: COLORS.primary }]}>
               {user?.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase()}
             </Text>
          </View>
          <Text style={styles.drawerName}>
            {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
          </Text>
          <Text style={styles.drawerEmail}>
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        {/* DRAWER ITEMS - Now on a lighter background */}
        <View style={styles.itemsContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* FOOTER SIGN OUT */}
      <TouchableOpacity 
        style={[styles.logoutItem, { borderTopColor: '#eee' }]} 
        onPress={() => signOut()}
      >
        <Ionicons name="log-out-outline" size={22} color={COLORS.expense} />
        <Text style={[styles.logoutText, { color: COLORS.expense }]}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function Layout() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href={"/sign-in"} />;

  return (
    <SafeAreaProvider>
      <Drawer 
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{ 
          drawerActiveTintColor: COLORS.primary, // Strong Blue for active link
          drawerInactiveTintColor: '#555',       // Dark grey for inactive
          drawerActiveBackgroundColor: COLORS.primary + '15', // Very light blue tint for active row
          drawerStyle: {
            backgroundColor: '#F8FAFC', // 👈 Very light slate/white background
            width: 280,
          },
          drawerLabelStyle: {
            fontWeight: '600',
            fontSize: 15,
          },
          headerShown: false,
        }}
      >
        <Drawer.Screen name="index" options={{ drawerLabel: "Home", drawerIcon: ({ color }) => <Ionicons name="home" size={22} color={color} /> }} />
        <Drawer.Screen name="statistics" options={{ drawerLabel: "Statistics", drawerIcon: ({ color }) => <Ionicons name="pie-chart" size={22} color={color} /> }} />
        <Drawer.Screen name="goals" options={{ drawerLabel: "Budgets & Goals", drawerIcon: ({ color }) => <Ionicons name="trophy" size={22} color={color} /> }} />
        <Drawer.Screen name="settings" options={{ drawerLabel: "Settings", drawerIcon: ({ color }) => <Ionicons name="settings" size={22} color={color} /> }} />
        <Drawer.Screen name="create" options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 25,
  },
  avatarContainer: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    // Add a slight shadow to the avatar
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  drawerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'capitalize'
  },
  drawerEmail: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  itemsContainer: {
    paddingTop: 10,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    marginBottom: 15
  },
  logoutText: {
    fontWeight: 'bold',
    marginLeft: 15,
    fontSize: 15
  }
});