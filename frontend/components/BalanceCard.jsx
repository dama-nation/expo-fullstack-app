import { View, Text } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

export const BalanceCard = ({ summary }) => {
  // Helper to format numbers with commas and 2 decimal places
  const formatValue = (value) => {
    return Number(Math.abs(value || 0)).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceTitle}>Total Balance</Text>
      
      <Text 
        style={styles.balanceAmount}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        ₦{formatValue(summary.balance)}
      </Text>

      <View style={styles.balanceStats}>
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Income</Text>
          <Text 
            style={[styles.balanceStatAmount, { color: COLORS.income }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            +₦{formatValue(summary.income)}
          </Text>
        </View>

        <View style={[styles.balanceStatItem, styles.statDivider]} />

        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Expenses</Text>
          <Text 
            style={[styles.balanceStatAmount, { color: COLORS.expense }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            -₦{formatValue(summary.expenses)}
          </Text>
        </View>
      </View>
    </View>
  );
};