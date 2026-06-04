import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation, useFocusEffect } from "expo-router"; 
import { DrawerActions } from '@react-navigation/native'; 
import { useTransactions } from "../../hooks/useTransactions";
import { COLORS } from "../../constants/colors";

export default function GoalsPage() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation(); 
  const { user } = useUser();
  const { summary, loadData } = useTransactions(user?.id);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) loadData();
    }, [user?.id])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  // LOGIC FIX: Check both summary.expenses AND summary.summary.expenses
  const monthlyBudget = 150000; 
  const rawExpenses = summary?.expenses || summary?.summary?.expenses || 0;
  const spent = Math.abs(Number(rawExpenses));
  
  const percentage = Math.min((spent / monthlyBudget) * 100, 100);

  return (
    <View style={[styles.outer, { backgroundColor: COLORS.background }]}>
      
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={32} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.text }]}>Budgets & Goals</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        <View style={[styles.goalCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.goalName, { color: COLORS.text }]}>Monthly Spending Limit</Text>
            <Ionicons name="flag" size={20} color={COLORS.primary} />
          </View>
          
          <Text style={[styles.amountText, { color: COLORS.text }]}>
            ₦{spent.toLocaleString()} <Text style={{fontSize: 14, color: COLORS.textLight}}>of ₦{monthlyBudget.toLocaleString()}</Text>
          </Text>

          {/* PROGRESS BAR */}
          <View style={[styles.progressBg, { backgroundColor: COLORS.background }]}>
            <View style={[
              styles.progressFill, 
              { 
                width: `${percentage}%`, 
                backgroundColor: percentage > 90 ? COLORS.expense : COLORS.primary 
              }
            ]} />
          </View>
          
          <View style={styles.statusRow}>
            <Text style={[styles.statusText, { color: COLORS.textLight }]}>
              {percentage.toFixed(0)}% used
            </Text>
            <Text style={[styles.statusText, { color: percentage > 90 ? COLORS.expense : COLORS.income }]}>
              {percentage >= 100 ? "Limit Exceeded" : `₦${(monthlyBudget - spent).toLocaleString()} left`}
            </Text>
          </View>
        </View>

        {/* Informational Card */}
        <View style={[styles.infoCard, { backgroundColor: COLORS.primary + '10' }]}>
          <Ionicons name="information-circle" size={20} color={COLORS.primary} />
          <Text style={[styles.infoText, { color: COLORS.text }]}>
            Your budget resets automatically on the 1st of every month.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15 },
  menuButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  goalCard: { padding: 20, borderRadius: 24, borderWidth: 1, marginTop: 10, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  goalName: { fontSize: 15, fontWeight: '600' },
  amountText: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  progressBg: { height: 14, borderRadius: 7, width: '100%', overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', borderRadius: 7 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  statusText: { fontSize: 13, fontWeight: 'bold' },
  infoCard: { flexDirection: 'row', padding: 15, borderRadius: 16, alignItems: 'center', gap: 10 },
  infoText: { fontSize: 12, flex: 1, lineHeight: 18 }
});