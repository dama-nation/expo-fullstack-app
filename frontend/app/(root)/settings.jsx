import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser, useClerk } from "@clerk/clerk-expo";
import { useNavigation } from "expo-router";
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[styles.outer, { backgroundColor: COLORS.background }]}>
      
      {/* TIGHT HEADER - MATCHES HOME & STATS */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 5 }]}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu" size={32} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.text }]}>Settings</Text>
      </View>

      <View style={styles.container}>
        
        {/* PROFILE CARD */}
        <View style={[styles.profileCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
          <View style={[styles.avatarCircle, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.avatarText}>
              {user?.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.userName, { color: COLORS.text }]}>
            {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
          </Text>
          <Text style={[styles.userEmail, { color: COLORS.textLight }]}>
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        {/* APP INFO / PLACEHOLDER SECTION */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.infoText, { color: COLORS.text }]}>Version 1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.infoText, { color: COLORS.text }]}>Secure Account</Text>
          </View>
        </View>

        {/* SIGN OUT BUTTON */}
        <TouchableOpacity 
          style={[styles.logoutBtn, { borderColor: COLORS.expense }]} 
          onPress={() => signOut()}
        >
          <Ionicons name="log-out-outline" size={22} color={COLORS.expense} />
          <Text style={[styles.logoutText, { color: COLORS.expense }]}>Sign Out</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  headerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 8 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  container: { flex: 1, paddingHorizontal: 20, paddingBottom: 40 },
  profileCard: { 
    padding: 30, 
    borderRadius: 25, 
    alignItems: 'center', 
    borderWidth: 1, 
    marginTop: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  avatarCircle: { 
    width: 75, 
    height: 75, 
    borderRadius: 37.5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  userName: { fontSize: 20, fontWeight: 'bold' },
  userEmail: { fontSize: 13, marginTop: 4 },
  infoSection: { marginTop: 30 },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15, 
    padding: 10 
  },
  infoText: { marginLeft: 15, fontSize: 16, fontWeight: '500' },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1.5,
    marginTop: 'auto' 
  },
  logoutText: { fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});