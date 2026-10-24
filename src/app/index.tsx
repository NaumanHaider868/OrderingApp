import { useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OrderComposer } from '@/components/restaurant/order-composer';
import { currency, KitchenTicket, OrderLine, TableStatus } from '@/data/mock-restaurant';
import { useRestaurantState } from '@/components/restaurant/restaurant-state';

const palette = {
  ink: '#202B26', muted: '#78827A', paper: '#F7F6F1', white: '#FFFFFF', line: '#E6E4DA',
  green: '#244C3C', paleGreen: '#E7EFE8', amber: '#C87945', paleAmber: '#F4E9DC',
  paleBlue: '#E7EEF1', blue: '#4F707C',
};

const statusColors: Record<TableStatus, { bg: string; text: string; dot: string }> = {
  Available: { bg: palette.paleGreen, text: palette.green, dot: '#538466' },
  Dining: { bg: '#F1EEE4', text: '#80653C', dot: '#C38A44' },
  'In kitchen': { bg: palette.paleBlue, text: palette.blue, dot: '#6B8791' },
  'Ready to serve': { bg: palette.paleAmber, text: '#9B5B31', dot: palette.amber },
};

export default function FloorScreen() {
  const [availableWidth, setAvailableWidth] = useState(0);
  const { tables, setTables, tickets, setTickets, summary, setSummary } = useRestaurantState();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [filter, setFilter] = useState<'All tables' | TableStatus>('All tables');
  const wide = availableWidth >= 760;
  const tableFilters: ('All tables' | TableStatus)[] = ['All tables', 'Available', 'Dining', 'In kitchen', 'Ready to serve'];
  const visibleTables = filter === 'All tables' ? tables : tables.filter((table) => table.status === filter);
  const liveCount = tickets.filter((ticket) => ticket.status !== 'Ready').length;

  function sendOrder(items: OrderLine[], note: string) {
    if (selectedTable === null) return;
    const orderNumber = `#${1050 + tickets.length}`;
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const newTicket: KitchenTicket = {
      id: orderNumber, table: selectedTable, guestCount: 2, waiter: 'Maya', age: 'just now', status: 'New', items, note: note || undefined,
    };
    setTickets((current) => [newTicket, ...current]);
    setSummary((current) => {
      const orderCount = Number(current.orders);
      const nextOrderCount = orderCount + 1;
      const priorSales = Number(current.sales.replace(/[$,]/g, ''));
      const priorAverage = Number(current.average.replace(/[$,]/g, ''));
      return {
        ...current,
        sales: currency(priorSales + total),
        orders: String(nextOrderCount),
        average: currency((priorAverage * orderCount + total) / nextOrderCount),
        guests: String(Number(current.guests) + newTicket.guestCount),
      };
    });
    setTables((current) => current.map((table) => table.number === selectedTable
      ? { ...table, status: 'In kitchen', order: orderNumber, total: (table.total ?? 0) + total }
      : table));
    setSelectedTable(null);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        onLayout={(event: LayoutChangeEvent) => setAvailableWidth(event.nativeEvent.layout.width)}
        contentContainerStyle={[styles.content, wide && styles.wideContent]}>
        <View style={styles.topBar}>
          <View style={styles.brandLockup}>
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>C</Text></View>
            <View><Text style={styles.brandName}>CLOVER & ASH</Text><Text style={styles.brandCaption}>RESTAURANT · SERVICE DESK</Text></View>
          </View>
          <View style={styles.shiftTag}><View style={styles.liveDot} /><Text style={styles.shiftText}>DINNER SERVICE</Text></View>
        </View>

        <View style={styles.greetingRow}>
          <View style={styles.greetingCopy}>
            <Text style={styles.dateText}>SATURDAY, OCTOBER 25</Text>
            <Text style={styles.greeting}>Good evening, Maya.</Text>
            <Text style={styles.subGreeting}>The room is moving well. Here’s your floor.</Text>
          </View>
          <Pressable onPress={() => setSelectedTable(2)} style={styles.newOrderButton}>
            <Text style={styles.newOrderPlus}>+</Text><Text style={styles.newOrderText}>New order</Text>
          </Pressable>
        </View>

        <View style={[styles.metrics, wide && styles.metricsWide]}>
          <Metric label="NET SALES" value={summary.sales} note={`${summary.salesChange} vs last Saturday`} accent={palette.green} />
          <Metric label="ORDERS" value={summary.orders} note="Across 8 active tables" accent={palette.amber} />
          <Metric label="AVG. CHECK" value={summary.average} note={`${summary.guests} guests served`} accent={palette.blue} />
        </View>

        <View style={[styles.mainColumns, wide && styles.mainColumnsWide]}>
          <View style={styles.floorColumn}>
            <View style={styles.sectionHeading}>
              <View><Text style={styles.sectionEyebrow}>LIVE FLOOR</Text><Text style={styles.sectionTitle}>Tables <Text style={styles.sectionCount}>· {tables.length}</Text></Text></View>
              <View style={styles.occupancy}><Text style={styles.occupancyStrong}>5</Text><Text style={styles.occupancyText}> / 8 occupied</Text></View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {tableFilters.map((item) => (
                <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filterChip, filter === item && styles.filterChipActive]}>
                  <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.tableGrid}>
              {visibleTables.map((table) => {
                const colors = statusColors[table.status];
                return (
                  <Pressable key={table.number} onPress={() => setSelectedTable(table.number)} style={({ pressed }) => [styles.tableCard, wide && styles.tableCardWide, pressed && styles.cardPressed]}>
                    <View style={styles.tableTop}><Text style={styles.tableNumber}>T{String(table.number).padStart(2, '0')}</Text><Text style={styles.seatCount}>{table.seats} seats</Text></View>
                    <View style={[styles.statusPill, { backgroundColor: colors.bg }]}><View style={[styles.statusDot, { backgroundColor: colors.dot }]} /><Text style={[styles.statusText, { color: colors.text }]}>{table.status}</Text></View>
                    <View style={styles.tableBottom}><Text style={styles.orderId}>{table.order ?? 'Tap to start'}</Text><Text style={styles.tableAmount}>{table.total ? currency(table.total) : '＋'}</Text></View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={[styles.sideColumn, wide && styles.sideColumnWide]}>
            <View style={styles.sectionHeading}>
              <View><Text style={styles.sectionEyebrow}>PASS WINDOW</Text><Text style={styles.sectionTitle}>Kitchen flow</Text></View>
              <View style={styles.queueCount}><Text style={styles.queueCountText}>{liveCount} LIVE</Text></View>
            </View>
            <View style={styles.queueList}>
              {tickets.slice(0, 3).map((ticket) => <KitchenPreview key={ticket.id} ticket={ticket} />)}
            </View>
            <View style={styles.handoffNote}>
              <Text style={styles.handoffMark}>↗</Text>
              <View style={styles.handoffCopy}><Text style={styles.handoffTitle}>One order, two stations</Text><Text style={styles.handoffText}>Confirmed orders reach the kitchen and counter together.</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.footerNote}><Text style={styles.footerNoteText}>SHIFT SNAPSHOT · UPDATED JUST NOW</Text><Text style={styles.footerHours}>Kitchen open until 10:30 pm</Text></View>
      </ScrollView>
      <OrderComposer visible={selectedTable !== null} table={selectedTable} onClose={() => setSelectedTable(null)} onConfirm={sendOrder} />
    </SafeAreaView>
  );
}

function Metric({ label, value, note, accent }: { label: string; value: string; note: string; accent: string }) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricAccent, { backgroundColor: accent }]} />
      <View style={styles.metricContent}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricNote}>{note}</Text></View>
    </View>
  );
}

function KitchenPreview({ ticket }: { ticket: KitchenTicket }) {
  const statusStyle = ticket.status === 'New' ? styles.ticketNew : ticket.status === 'Ready' ? styles.ticketReady : styles.ticketPreparing;
  const label = ticket.status === 'New' ? 'JUST IN' : ticket.status === 'Ready' ? 'READY' : 'COOKING';
  return (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}><Text style={styles.ticketTable}>Table {ticket.table}</Text><Text style={styles.ticketAge}>{ticket.age}</Text></View>
      <Text style={styles.ticketItems}>{ticket.items.map((item) => `${item.quantity} × ${item.name}`).join(' · ')}</Text>
      <View style={styles.ticketFooter}><Text style={styles.ticketId}>{ticket.id} · {ticket.waiter}</Text><Text style={[styles.ticketStatus, statusStyle]}>{label}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 20, paddingBottom: 30 },
  wideContent: { width: '100%', maxWidth: 1180, alignSelf: 'center', paddingHorizontal: 42 },
  topBar: { minHeight: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: palette.line },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 36, height: 36, borderRadius: 18, backgroundColor: palette.green, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#F5F1E5', fontFamily: 'Georgia', fontSize: 22 },
  brandName: { color: palette.ink, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  brandCaption: { color: palette.muted, fontSize: 8, fontWeight: '700', letterSpacing: 0.8, marginTop: 3 },
  shiftTag: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 18 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#61966D' },
  shiftText: { color: palette.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  greetingRow: { paddingTop: 24, paddingBottom: 20, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  greetingCopy: { flex: 1 },
  dateText: { color: palette.amber, fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  greeting: { color: palette.ink, fontFamily: 'Georgia', fontSize: 29, marginTop: 6 },
  subGreeting: { color: palette.muted, fontSize: 12, marginTop: 6 },
  newOrderButton: { minHeight: 42, borderRadius: 7, backgroundColor: palette.green, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 14 },
  newOrderPlus: { color: '#E9E4D5', fontSize: 20, lineHeight: 22 },
  newOrderText: { color: palette.white, fontSize: 12, fontWeight: '700' },
  metrics: { gap: 9, marginBottom: 26 },
  metricsWide: { flexDirection: 'row' },
  metricCard: { flex: 1, minHeight: 90, flexDirection: 'row', backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, borderRadius: 7, overflow: 'hidden' },
  metricAccent: { width: 3 },
  metricContent: { paddingHorizontal: 14, paddingVertical: 11 },
  metricLabel: { color: palette.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.9 },
  metricValue: { color: palette.ink, fontSize: 23, fontWeight: '700', marginTop: 3 },
  metricNote: { color: palette.muted, fontSize: 10, marginTop: 3 },
  mainColumns: { gap: 28 },
  mainColumnsWide: { flexDirection: 'row', alignItems: 'flex-start' },
  floorColumn: { flex: 1.55, minWidth: 0 },
  sideColumn: { flex: 1, minWidth: 0, paddingTop: 4 },
  sideColumnWide: { paddingTop: 0 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  sectionEyebrow: { color: palette.amber, fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  sectionTitle: { color: palette.ink, fontFamily: 'Georgia', fontSize: 23, marginTop: 3 },
  sectionCount: { color: palette.muted, fontFamily: 'System', fontSize: 13 },
  occupancy: { flexDirection: 'row', alignItems: 'baseline', paddingBottom: 3 },
  occupancyStrong: { color: palette.ink, fontSize: 13, fontWeight: '800' },
  occupancyText: { color: palette.muted, fontSize: 10 },
  filters: { flexDirection: 'row', gap: 6, paddingBottom: 12 },
  filterChip: { paddingHorizontal: 11, paddingVertical: 7, borderWidth: 1, borderColor: palette.line, borderRadius: 18 },
  filterChipActive: { backgroundColor: palette.green, borderColor: palette.green },
  filterText: { color: palette.muted, fontSize: 10, fontWeight: '700' },
  filterTextActive: { color: palette.white },
  tableGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  tableCard: { width: '48%', flexGrow: 1, minWidth: 135, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, borderRadius: 7, padding: 12, minHeight: 112, justifyContent: 'space-between' },
  tableCardWide: { width: '31%', minWidth: 150, flexGrow: 1 },
  cardPressed: { opacity: 0.75, transform: [{ scale: 0.985 }] },
  tableTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tableNumber: { color: palette.ink, fontSize: 16, fontWeight: '800' },
  seatCount: { color: palette.muted, fontSize: 10 },
  statusPill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 16, marginTop: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 9, fontWeight: '700' },
  tableBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 },
  orderId: { color: palette.muted, fontSize: 10 },
  tableAmount: { color: palette.ink, fontSize: 11, fontWeight: '800' },
  queueCount: { backgroundColor: palette.paleAmber, borderRadius: 15, paddingHorizontal: 9, paddingVertical: 5 },
  queueCountText: { color: '#9B5B31', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  queueList: { gap: 8 },
  ticketCard: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, borderRadius: 7, padding: 12 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketTable: { color: palette.ink, fontSize: 13, fontWeight: '800' },
  ticketAge: { color: palette.muted, fontSize: 10 },
  ticketItems: { color: '#526057', fontSize: 11, lineHeight: 17, marginTop: 8 },
  ticketFooter: { borderTopWidth: 1, borderColor: palette.line, marginTop: 10, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketId: { color: palette.muted, fontSize: 9 },
  ticketStatus: { fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  ticketNew: { color: palette.amber },
  ticketPreparing: { color: palette.blue },
  ticketReady: { color: palette.green },
  handoffNote: { marginTop: 12, padding: 12, borderRadius: 7, backgroundColor: '#EAEDE4', flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  handoffMark: { color: palette.green, fontSize: 18 },
  handoffCopy: { flex: 1 },
  handoffTitle: { color: palette.ink, fontSize: 11, fontWeight: '800' },
  handoffText: { color: palette.muted, fontSize: 10, lineHeight: 15, marginTop: 3 },
  footerNote: { marginTop: 26, paddingTop: 12, borderTopWidth: 1, borderColor: palette.line, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 },
  footerNoteText: { color: palette.muted, fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  footerHours: { color: palette.muted, fontSize: 9 },
});