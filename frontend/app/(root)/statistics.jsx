import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { useUser } from "@clerk/clerk-expo";
import { useNavigation, useFocusEffect } from "expo-router"; // 👈 Added useFocusEffect
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "../../hooks/useTransactions"; 
import { COLORS } from "../../constants/colors";

const screenWidth = Dimensions.get("window").width;

export default function StatisticsPage() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user } = useUser();
  const { summary, loadData, isLoading } = useTransactions(user?.id);
  const [refreshing, setRefreshing] = useState(false);

  // 1. This ensures data refreshes EVERY time you open this tab
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

  const expense = Math.abs(Number(summary?.expenses)) || 0;
  const income = Number(summary?.income) || 0;
  
  // AI Prediction Logic
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dailyAverage = expense / currentDay;
  const predictedExpense = dailyAverage * daysInMonth;

  return (
    <View style={[styles.outer, { backgroundColor: COLORS.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 5 }]}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu" size={32} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.text }]}>Financial Analysis</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Only show chart if there is data, otherwise show a "Clear" message */}
        <View style={[styles.chartBox, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
          {income === 0 && expense === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Ionicons name="stats-chart-outline" size={40} color={COLORS.textLight} />
              <Text style={{ color: COLORS.textLight, marginTop: 10 }}>No data to analyze</Text>
            </View>
          ) : (
            <PieChart
              data={[
                { name: "Income", population: income, color: COLORS.income, legendFontColor: COLORS.text },
                { name: "Expense", population: expense, color: COLORS.expense, legendFontColor: COLORS.text }
              ]}
              width={screenWidth - 60}
              height={200}
              chartConfig={{ color: () => COLORS.text }}
              accessor={"population"}
              backgroundColor={"transparent"}
              absolute={false}
            />
          )}
        </View>

        {/* AI Forecast Card (only shows if there are expenses) */}
        {expense > 0 && (
          <View style={[styles.aiCard, { backgroundColor: COLORS.card, borderColor: COLORS.primary }]}>
            <View style={styles.aiHeader}>
              <Ionicons name="sparkles" size={18} color={COLORS.primary} />
              <Text style={[styles.aiTitle, { color: COLORS.primary }]}>AI Forecast</Text>
            </View>
            <Text style={[styles.aiValue, { color: COLORS.text }]}>
              ₦{predictedExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
            <Text style={{ color: COLORS.textLight, fontSize: 12 }}>Estimated total for this month</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <View style={[styles.statItem, { backgroundColor: COLORS.card, borderColor: COLORS.income }]}>
            <Text style={[styles.statLabel, { color: COLORS.textLight }]}>Total In</Text>
            <Text style={[styles.statAmount, { color: COLORS.income }]}>₦{income.toLocaleString()}</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: COLORS.card, borderColor: COLORS.expense }]}>
            <Text style={[styles.statLabel, { color: COLORS.textLight }]}>Total Out</Text>
            <Text style={[styles.statAmount, { color: COLORS.expense }]}>₦{expense.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  content: { paddingHorizontal: 20, paddingBottom: 30 },
  chartBox: { borderRadius: 25, borderWidth: 1, marginTop: 10, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  aiCard: { marginTop: 20, padding: 20, borderRadius: 20, borderWidth: 1.5, borderStyle: 'dashed' },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  aiTitle: { fontWeight: 'bold', fontSize: 16 },
  aiValue: { fontSize: 24, fontWeight: 'bold' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  statItem: { width: '48%', padding: 15, borderRadius: 18, borderWidth: 1, borderLeftWidth: 5 },
  statLabel: { fontSize: 11, fontWeight: '600' },
  statAmount: { fontSize: 15, fontWeight: 'bold', marginTop: 4 }
});