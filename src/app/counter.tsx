import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { currency, KitchenTicket, TicketStatus } from '@/data/mock-restaurant';
import { useRestaurantState } from '@/components/restaurant/restaurant-state';

const palette = {
  ink: '#202B26', muted: '#78827A', paper: '#F7F6F1', white: '#FFFFFF', line: '#E6E4DA',
  green: '#244C3C', paleGreen: '#E7EFE8', amber: '#C87945', paleAmber: '#F4E9DC',
  paleBlue: '#E7EEF1', blue: '#4F707C',
};

const ticketTones: Record<TicketStatus, { text: string; background: string }> = {
  New: { text: '#9B5B31', background: palette.paleAmber },
  Preparing: { text: palette.blue, background: palette.paleBlue },
  Ready: { text: palette.green, background: palette.paleGreen },
};

export default function CounterScreen() {
  const { tickets } = useRestaurantState();
  const [filter, setFilter] = useState<'All invoices' | TicketStatus>('All invoices');
  const filters: ('All invoices' | TicketStatus)[] = ['All invoices', 'New', 'Preparing', 'Ready'];
  const visibleTickets = useMemo(
    () => filter === 'All invoices' ? tickets : tickets.filter((ticket) => ticket.status === filter),
    [filter, tickets],
  );
  const openTotal = tickets.reduce((sum, ticket) => sum + ticket.items.reduce((itemsSum, item) => itemsSum + item.price * item.quantity, 0), 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topLine}>
          <View style={styles.brandLockup}><View style={styles.brandMark}><Text style={styles.brandMarkText}>C</Text></View><View><Text style={styles.brandName}>CLOVER & ASH</Text><Text style={styles.brandCaption}>COUNTER · ORDER COPIES</Text></View></View>
          <View style={styles.openIndicator}><View style={styles.liveDot} /><Text style={styles.openText}>CONNECTED</Text></View>
        </View>

        <View style={styles.heading}>
          <Text style={styles.eyebrow}>SATURDAY · DINNER SERVICE</Text>
          <Text style={styles.title}>Counter copies</Text>
          <Text style={styles.subtitle}>Every confirmed order is shared with the counter and kitchen.</Text>
        </View>

        <View style={styles.summaryRow}>
          <Summary value={String(tickets.length).padStart(2, '0')} label="OPEN INVOICES" />
          <Summary value={currency(openTotal)} label="OPEN ORDER VALUE" />
          <Summary value={String(tickets.filter((ticket) => ticket.status === 'Ready').length).padStart(2, '0')} label="READY AT PASS" />
        </View>

        <View style={styles.filterRow}>
          {filters.map((item) => (
            <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}>
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {visibleTickets.length ? (
          <View style={styles.invoiceList}>
            {visibleTickets.map((ticket) => <Invoice key={ticket.id} ticket={ticket} />)}
          </View>
        ) : (
          <View style={styles.emptyState}><Text style={styles.emptyTitle}>No invoices in this view.</Text><Text style={styles.emptyText}>Confirmed orders will appear here automatically.</Text></View>
        )}
        <Text style={styles.footnote}>INVOICE COPIES FOLLOW KITCHEN STATUS · PAYMENT IS HANDLED AT THE TABLE</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Summary({ value, label }: { value: string; label: string }) {
  return <View style={styles.summary}><Text style={styles.summaryValue}>{value}</Text><Text style={styles.summaryLabel}>{label}</Text></View>;
}

function Invoice({ ticket }: { ticket: KitchenTicket }) {
  const tone = ticketTones[ticket.status];
  const amount = ticket.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <View style={styles.invoice}>
      <View style={styles.invoiceTop}>
        <View><Text style={styles.invoiceLabel}>ORDER INVOICE</Text><Text style={styles.invoiceId}>{ticket.id}</Text></View>
        <View style={[styles.status, { backgroundColor: tone.background }]}><Text style={[styles.statusText, { color: tone.text }]}>{ticket.status.toUpperCase()}</Text></View>
      </View>
      <View style={styles.detailRow}><Text style={styles.detailLabel}>Table {ticket.table} · {ticket.guestCount} guests</Text><Text style={styles.detailLabel}>Waiter {ticket.waiter}</Text></View>
      <View style={styles.items}>
        {ticket.items.map((item) => <View key={item.itemId} style={styles.itemRow}><Text style={styles.itemName}>{item.quantity} × {item.name}</Text><Text style={styles.itemPrice}>{currency(item.price * item.quantity)}</Text></View>)}
      </View>
      {ticket.note ? <Text style={styles.orderNote}>Kitchen note: {ticket.note}</Text> : null}
      <View style={styles.totalRow}><Text style={styles.totalLabel}>Order total</Text><Text style={styles.total}>{currency(amount)}</Text></View>
      <View style={styles.invoiceFooter}><Text style={styles.footerNote}>Sent {ticket.age === 'just now' ? ticket.age : `${ticket.age} ago`}</Text><Text style={styles.footerAction}>{ticket.status === 'Ready' ? 'Ready for waiter pickup' : 'Kitchen preparing'}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: { width: '100%', maxWidth: 920, alignSelf: 'center', paddingHorizontal: 22, paddingBottom: 34 },
  topLine: { minHeight: 70, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: palette.line },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 36, height: 36, borderRadius: 18, backgroundColor: palette.green, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#F5F1E5', fontFamily: 'Georgia', fontSize: 22 },
  brandName: { color: palette.ink, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  brandCaption: { color: palette.muted, fontSize: 8, fontWeight: '700', letterSpacing: 0.8, marginTop: 3 },
  openIndicator: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 18 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#61966D' },
  openText: { color: palette.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  heading: { paddingTop: 25, paddingBottom: 21 },
  eyebrow: { color: palette.amber, fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: palette.ink, fontFamily: 'Georgia', fontSize: 34, marginTop: 5 },
  subtitle: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 7 },
  summaryRow: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: palette.line, paddingVertical: 15, gap: 8 },
  summary: { flex: 1 },
  summaryValue: { color: palette.ink, fontFamily: 'Georgia', fontSize: 22 },
  summaryLabel: { color: palette.muted, fontSize: 8, fontWeight: '800', letterSpacing: 0.6, marginTop: 5 },
  filterRow: { flexDirection: 'row', gap: 8, paddingVertical: 17, flexWrap: 'wrap' },
  filter: { borderWidth: 1, borderColor: palette.line, borderRadius: 18, paddingHorizontal: 11, paddingVertical: 8 },
  filterActive: { borderColor: palette.green, backgroundColor: palette.green },
  filterText: { color: palette.muted, fontSize: 10, fontWeight: '700' },
  filterTextActive: { color: palette.white },
  invoiceList: { gap: 10 },
  invoice: { padding: 15, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, borderRadius: 7 },
  invoiceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  invoiceLabel: { color: palette.amber, fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  invoiceId: { color: palette.ink, fontSize: 17, fontWeight: '800', marginTop: 3 },
  status: { borderRadius: 14, paddingHorizontal: 9, paddingVertical: 6 },
  statusText: { fontSize: 8, fontWeight: '900', letterSpacing: 0.6 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  detailLabel: { color: palette.muted, fontSize: 10 },
  items: { borderTopWidth: 1, borderColor: palette.line, marginTop: 11, paddingTop: 5 },
  itemRow: { minHeight: 27, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  itemName: { flex: 1, color: palette.ink, fontSize: 11 },
  itemPrice: { color: palette.muted, fontSize: 10 },
  orderNote: { color: '#705A45', fontSize: 10, backgroundColor: '#FAF4EC', padding: 8, marginTop: 7 },
  totalRow: { borderTopWidth: 1, borderColor: palette.line, marginTop: 8, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: palette.muted, fontSize: 10 },
  total: { color: palette.ink, fontSize: 16, fontWeight: '800' },
  invoiceFooter: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 },
  footerNote: { color: palette.muted, fontSize: 9 },
  footerAction: { color: palette.green, fontSize: 9, fontWeight: '800' },
  emptyState: { minHeight: 160, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: palette.line, borderRadius: 7 },
  emptyTitle: { color: palette.ink, fontFamily: 'Georgia', fontSize: 19 },
  emptyText: { color: palette.muted, fontSize: 10, marginTop: 6, textAlign: 'center', paddingHorizontal: 18 },
  footnote: { color: palette.muted, fontSize: 8, fontWeight: '700', letterSpacing: 0.7, textAlign: 'center', marginTop: 24 },
});