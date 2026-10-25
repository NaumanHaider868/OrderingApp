import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRestaurantState } from "@/components/restaurant/restaurant-state";
import { currency, monthlySales, weeklySales } from "@/data/mock-restaurant";

const palette = {
  ink: "#173840",
  muted: "#58777D",
  paper: "#F1FAF8",
  white: "#FFFFFF",
  line: "#D4E9E7",
  green: "#21886B",
  paleGreen: "#E2F4EA",
  blue: "#48AFCF",
  paleBlue: "#E4F5FB",
};

type SalesRange = "Week" | "Month";

const inventory = [
  { item: "Ice cream base", amount: 32, unit: "kg", cost: 1600 },
  { item: "Fresh cream", amount: 18, unit: "L", cost: 1150 },
  { item: "Fish", amount: 14, unit: "kg", cost: 2200 },
  { item: "Chicken", amount: 24, unit: "kg", cost: 1100 },
  { item: "Seasonal fruit", amount: 26, unit: "kg", cost: 450 },
  { item: "Serving packs", amount: 200, unit: "packs", cost: 30 },
];

export default function CounterScreen() {
  const { role, summary } = useRestaurantState();
  const [range, setRange] = useState<SalesRange>("Week");
  const inventoryValue = inventory.reduce(
    (total, item) => total + item.amount * item.cost,
    0,
  );
  const monthlyChange = summary.lastMonthSales
    ? ((summary.thisMonthSales - summary.lastMonthSales) /
        summary.lastMonthSales) *
      100
    : 0;
  const todayIndex = (new Date().getDay() + 6) % 7;
  const thisWeekSales = weeklySales.reduce(
    (total, item, index) =>
      total + (index === todayIndex ? summary.todaySales : item.sales),
    0,
  );
  const chartData = useMemo(() => {
    if (range === "Week") {
      return weeklySales.map((item, index) => ({
        label: item.day,
        value: index === todayIndex ? summary.todaySales : item.sales,
        active: index === todayIndex,
      }));
    }
    return monthlySales.map((item, index) => ({
      label: item.month,
      value:
        index === monthlySales.length - 1 ? summary.thisMonthSales : item.sales,
      active: index === monthlySales.length - 1,
    }));
  }, [range, summary.thisMonthSales, summary.todaySales, todayIndex]);
  const chartMaximum = Math.max(...chartData.map((item) => item.value), 1);

  if (role !== "admin") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.restricted}>
          <Text style={styles.title}>Admin access required</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topLine}>
          <View style={styles.brandLockup}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>M</Text>
            </View>
            <View>
              <Text style={styles.brandName}>MEHAR JUICE</Text>
              <Text style={styles.brandCaption}>
                ADMIN · BUSINESS PERFORMANCE
              </Text>
            </View>
          </View>
          <View style={styles.periodLabel}>
            <View style={styles.liveDot} />
            <Text style={styles.periodText}>DEMO DATA</Text>
          </View>
        </View>

        <View style={styles.heading}>
          <Text style={styles.eyebrow}>SALES & OPERATIONS</Text>
          <Text style={styles.title}>Business performance</Text>
          <Text style={styles.subtitle}>
            Revenue, order volume, and stock investment in PKR.
          </Text>
        </View>

        <View style={styles.metricsGrid}>
          <Metric
            label="SALES TODAY"
            value={currency(summary.todaySales)}
            note="Confirmed orders"
            tone="green"
          />
          <Metric
            label="ORDERS TODAY"
            value={String(summary.todayOrders)}
            note="Orders confirmed"
            tone="blue"
          />
          <Metric
            label="SALES THIS WEEK"
            value={currency(thisWeekSales)}
            note="Monday to today"
            tone="green"
          />
          <Metric
            label="ORDERS THIS WEEK"
            value={String(summary.thisWeekOrders)}
            note="Week to date"
            tone="blue"
          />
          <Metric
            label="AVERAGE ORDER"
            value={currency(summary.average)}
            note="Today to date"
            tone="blue"
          />
          <Metric
            label="SALES THIS MONTH"
            value={currency(summary.thisMonthSales)}
            note={`${monthlyChange >= 0 ? "+" : ""}${monthlyChange.toFixed(1)}% vs last month`}
            tone="green"
          />
          <Metric
            label="SALES LAST MONTH"
            value={currency(summary.lastMonthSales)}
            note="Previous calendar month"
            tone="blue"
          />
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>REVENUE TREND</Text>
            <Text style={styles.sectionTitle}>
              {range === "Week" ? "This week" : "Monthly sales"}
            </Text>
          </View>
          <View style={styles.segment}>
            {(["Week", "Month"] as const).map((item) => (
              <Pressable
                key={item}
                onPress={() => setRange(item)}
                style={[
                  styles.segmentOption,
                  range === item && styles.segmentActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    range === item && styles.segmentTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.chartPanel}>
          <View style={styles.chartSummary}>
            <Text style={styles.chartSummaryLabel}>
              {range === "Week" ? "TODAY" : "MONTH TO DATE"}
            </Text>
            <Text style={styles.chartSummaryValue}>
              {currency(
                range === "Week" ? summary.todaySales : summary.thisMonthSales,
              )}
            </Text>
          </View>
          <View style={styles.chart}>
            {chartData.map((item) => (
              <View key={item.label} style={styles.barColumn}>
                <Text
                  style={[
                    styles.barValue,
                    item.active && styles.barValueActive,
                  ]}
                >
                  {item.value >= 1000000
                    ? `${(item.value / 1000000).toFixed(1)}m`
                    : `${Math.round(item.value / 1000)}k`}
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${Math.max(5, (item.value / chartMaximum) * 100)}%`,
                      },
                      item.active && styles.barActive,
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.barLabel,
                    item.active && styles.barLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.chartFooter}>
            <View style={styles.chartLegendDot} />
            <Text style={styles.chartFooterText}>
              Revenue · Pakistani rupees
            </Text>
            <Text style={styles.chartFooterNote}>Sample historical trend</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>STOCK & CAPITAL</Text>
            <Text style={styles.sectionTitle}>Inventory investment</Text>
          </View>
          <View style={styles.inventoryTotal}>
            <Text style={styles.inventoryTotalLabel}>ON-HAND VALUE</Text>
            <Text style={styles.inventoryTotalValue}>
              {currency(inventoryValue)}
            </Text>
          </View>
        </View>
        <View style={styles.inventoryList}>
          {inventory.map((item, index) => {
            const value = item.amount * item.cost;
            const lowStock = item.amount <= 14;
            return (
              <View
                key={item.item}
                style={[
                  styles.inventoryRow,
                  index === inventory.length - 1 && styles.lastInventoryRow,
                ]}
              >
                <View
                  style={[
                    styles.inventoryMark,
                    index % 2
                      ? styles.inventoryMarkBlue
                      : styles.inventoryMarkGreen,
                  ]}
                >
                  <Text style={styles.inventoryInitial}>
                    {item.item.slice(0, 1)}
                  </Text>
                </View>
                <View style={styles.inventoryCopy}>
                  <Text style={styles.inventoryName}>{item.item}</Text>
                  <Text style={styles.inventoryCount}>
                    {item.amount} {item.unit} on hand · {currency(item.cost)} /{" "}
                    {item.unit}
                  </Text>
                </View>
                <View style={styles.inventoryValueColumn}>
                  <Text style={styles.inventoryValue}>{currency(value)}</Text>
                  <Text
                    style={[
                      styles.stockStatus,
                      lowStock ? styles.lowStock : styles.inStock,
                    ]}
                  >
                    {lowStock ? "RESTOCK SOON" : "IN STOCK"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <Text style={styles.disclaimer}>
          STARTING SALES AND INVENTORY VALUES ARE SAMPLE DATA · CONFIRMED ORDERS
          UPDATE TODAY AND MONTH TOTALS
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone: "green" | "blue";
}) {
  return (
    <View style={styles.metric}>
      <View
        style={[
          styles.metricAccent,
          tone === "green" ? styles.greenAccent : styles.blueAccent,
        ]}
      />
      <View style={styles.metricCopy}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricNote}>{note}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: {
    width: "100%",
    maxWidth: 1000,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  topLine: {
    minHeight: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: palette.line,
    gap: 8,
  },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: palette.green,
    alignItems: "center",
    justifyContent: "center",
  },
  brandMarkText: { color: palette.white, fontSize: 22, fontWeight: "800" },
  brandName: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  brandCaption: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 3,
  },
  periodLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: palette.paleGreen,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.green,
  },
  periodText: { color: palette.green, fontSize: 10, fontWeight: "900" },
  heading: { paddingTop: 24, paddingBottom: 18 },
  eyebrow: {
    color: palette.blue,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  title: { color: palette.ink, fontSize: 30, fontWeight: "800", marginTop: 5 },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  metric: {
    width: "48%",
    flexGrow: 1,
    minWidth: 145,
    minHeight: 98,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
    flexDirection: "row",
    overflow: "hidden",
  },
  metricAccent: { width: 4 },
  greenAccent: { backgroundColor: palette.green },
  blueAccent: { backgroundColor: palette.blue },
  metricCopy: { flex: 1, paddingHorizontal: 12, paddingVertical: 11 },
  metricLabel: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  metricValue: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 5,
  },
  metricNote: { color: palette.muted, fontSize: 11, marginTop: 4 },
  sectionHeader: {
    minHeight: 58,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 10,
    marginBottom: 10,
  },
  sectionEyebrow: {
    color: palette.blue,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.9,
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 3,
  },
  segment: {
    flexDirection: "row",
    gap: 3,
    backgroundColor: palette.paleBlue,
    borderRadius: 8,
    padding: 3,
  },
  segmentOption: {
    minWidth: 58,
    minHeight: 34,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  segmentActive: { backgroundColor: palette.green },
  segmentText: { color: palette.muted, fontSize: 12, fontWeight: "700" },
  segmentTextActive: { color: palette.white },
  chartPanel: {
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
    padding: 15,
    marginBottom: 18,
  },
  chartSummary: { paddingBottom: 8 },
  chartSummaryLabel: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  chartSummaryValue: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 3,
  },
  chart: {
    height: 186,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 5,
    borderBottomWidth: 1,
    borderColor: palette.line,
    paddingTop: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
  },
  barValue: { color: palette.muted, fontSize: 9, fontWeight: "700" },
  barValueActive: { color: palette.green, fontWeight: "900" },
  barTrack: {
    width: "68%",
    maxWidth: 38,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  bar: {
    width: "100%",
    minHeight: 5,
    backgroundColor: "#B8E2D2",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  barActive: { backgroundColor: palette.green },
  barLabel: {
    height: 18,
    color: palette.muted,
    fontSize: 10,
    fontWeight: "700",
  },
  barLabelActive: { color: palette.green, fontWeight: "900" },
  chartFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 11,
    flexWrap: "wrap",
  },
  chartLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.green,
  },
  chartFooterText: { color: palette.muted, fontSize: 11 },
  chartFooterNote: { color: palette.muted, fontSize: 10, marginLeft: "auto" },
  inventoryTotal: { alignItems: "flex-end" },
  inventoryTotalLabel: { color: palette.muted, fontSize: 9, fontWeight: "900" },
  inventoryTotalValue: {
    color: palette.green,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 3,
  },
  inventoryList: {
    backgroundColor: palette.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: palette.line,
    paddingHorizontal: 12,
  },
  inventoryRow: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderColor: palette.line,
  },
  lastInventoryRow: { borderBottomWidth: 0 },
  inventoryMark: {
    width: 38,
    height: 38,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  inventoryMarkGreen: { backgroundColor: palette.paleGreen },
  inventoryMarkBlue: { backgroundColor: palette.paleBlue },
  inventoryInitial: { color: palette.green, fontSize: 16, fontWeight: "900" },
  inventoryCopy: { flex: 1 },
  inventoryName: { color: palette.ink, fontSize: 13, fontWeight: "800" },
  inventoryCount: { color: palette.muted, fontSize: 10, marginTop: 4 },
  inventoryValueColumn: { alignItems: "flex-end", gap: 4 },
  inventoryValue: { color: palette.ink, fontSize: 12, fontWeight: "800" },
  stockStatus: { fontSize: 8, fontWeight: "900", letterSpacing: 0.4 },
  lowStock: { color: "#B06437" },
  inStock: { color: palette.green },
  disclaimer: {
    color: palette.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginTop: 17,
    lineHeight: 14,
  },
  restricted: { flex: 1, alignItems: "center", justifyContent: "center" },
});
