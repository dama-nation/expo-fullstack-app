import { useUser } from "@clerk/clerk-expo";
import { useRouter, useNavigation } from "expo-router";
import { DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Alert, FlatList, Image, RefreshControl, Text, 
  TouchableOpacity, View, StyleSheet, Platform 
} from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import { useEffect, useState } from "react";
import PageLoader from "../../components/PageLoader";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionsFound";
import { COLORS } from "../../constants/colors"; // Back to your manual toggle

export default function Page() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(user?.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user?.id) loadData();
  }, [user?.id, loadData]);

  if (isLoading && !refreshing) return <PageLoader />;

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background, paddingTop: insets.top + 5 }]}>
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
            style={styles.menuButton}
          >
            <Ionicons name="menu" size={32} color={COLORS.primary} />
          </TouchableOpacity>

          <Image 
            source={require("../../assets/images/logo.png")} 
            style={styles.headerLogo} 
            resizeMode="contain" 
          />
          
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeText, { color: COLORS.textLight }]}>Welcome,</Text>
            <Text style={[styles.usernameText, { color: COLORS.text }]}>
              {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: COLORS.primary }]} 
            onPress={() => router.push("/create")}
          >
            <Ionicons name="add-circle" size={20} color={COLORS.white} />
            <Text style={[styles.addButtonText, { color: COLORS.white }]}>Add</Text>
          </TouchableOpacity>
          <SignOutButton />
        </View>
      </View>

      {/* BALANCE & TRANSACTIONS TITLE */}
      <View style={{ paddingHorizontal: 20 }}>
        <BalanceCard summary={summary} />
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>Recent Transactions</Text>
        </View>
      </View>

      {/* TRANSACTION LIST */}
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={deleteTransaction} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={COLORS.primary} 
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15, 
    paddingHorizontal: 20 
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  menuButton: { marginRight: 12 },
  headerLogo: { width: 35, height: 35, marginRight: 10 },
  welcomeContainer: { justifyContent: 'center' },
  welcomeText: { fontSize: 11 },
  usernameText: { fontSize: 15, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  addButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 6, 
    paddingHorizontal: 10, 
    borderRadius: 20, 
    marginRight: 8 
  },
  addButtonText: { fontWeight: 'bold', marginLeft: 4, fontSize: 12 },
  sectionHeader: { marginTop: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  transactionsList: { flex: 1 },
  transactionsListContent: { paddingHorizontal: 20, paddingBottom: 40 }
});