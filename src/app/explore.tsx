import { useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { currency, KitchenTicket, TicketStatus } from '@/data/mock-restaurant';
import { useRestaurantState } from '@/components/restaurant/restaurant-state';

const palette = {
  ink: '#202B26', muted: '#78827A', paper: '#F7F6F1', white: '#FFFFFF', line: '#E6E4DA',
  green: '#244C3C', paleGreen: '#E7EFE8', amber: '#C87945', paleAmber: '#F4E9DC',
  paleBlue: '#E7EEF1', blue: '#4F707C',
};

const statusTone: Record<TicketStatus, { color: string; bg: string }> = {
  New: { color: '#9B5B31', bg: palette.paleAmber },
  Preparing: { color: palette.blue, bg: palette.paleBlue },
  Ready: { color: palette.green, bg: palette.paleGreen },
};

export default function KitchenScreen() {
  const [availableWidth, setAvailableWidth] = useState(0);
  const { setTables, tickets, setTickets } = useRestaurantState();
  const [filter, setFilter] = useState<'All tickets' | TicketStatus>('All tickets');
  const wide = availableWidth >= 760;
  const filters: ('All tickets' | TicketStatus)[] = ['All tickets', 'New', 'Preparing', 'Ready'];
  const visible = filter === 'All tickets' ? tickets : tickets.filter((ticket) => ticket.status === filter);
  const counts = {
    New: tickets.filter((ticket) => ticket.status === 'New').length,
    Preparing: tickets.filter((ticket) => ticket.status === 'Preparing').length,
    Ready: tickets.filter((ticket) => ticket.status === 'Ready').length,
  };

  function advanceTicket(ticket: KitchenTicket) {
    if (ticket.status === 'Ready') {
      setTickets((current) => current.filter((item) => item.id !== ticket.id));
      setTables((current) => current.map((table) => table.number === ticket.table
        ? { ...table, status: 'Dining' }
        : table));
      return;
    }
    const next: TicketStatus = ticket.status === 'New' ? 'Preparing' : 'Ready';
    setTickets((current) => current.map((item) => item.id === ticket.id ? { ...item, status: next } : item));
    if (next === 'Ready') {
      setTables((current) => current.map((table) => table.number === ticket.table
        ? { ...table, status: 'Ready to serve' }
        : table));
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        onLayout={(event: LayoutChangeEvent) => setAvailableWidth(event.nativeEvent.layout.width)}
        contentContainerStyle={[styles.content, wide && styles.wideContent]}>
        <View style={styles.topLine}>
          <View style={styles.brandLockup}><View style={styles.brandMark}><Text style={styles.brandMarkText}>C</Text></View><View><Text style={styles.brandName}>CLOVER & ASH</Text><Text style={styles.brandCaption}>KITCHEN DISPLAY</Text></View></View>
          <View style={styles.openIndicator}><View style={styles.liveDot} /><Text style={styles.openText}>SERVICE LIVE</Text></View>
        </View>

        <View style={styles.headingRow}>
          <View style={styles.headingCopy}>
            <Text style={styles.eyebrow}>SATURDAY · DINNER SERVICE</Text>
            <Text style={styles.title}>The pass</Text>
            <Text style={styles.subtitle}>Orders arrive here as soon as a waiter confirms them.</Text>
          </View>
          <View style={styles.ticketTotal}><Text style={styles.ticketTotalValue}>{tickets.length}</Text><Text style={styles.ticketTotalLabel}>OPEN TICKETS</Text></View>
        </View>

        <View style={styles.statsRow}>
          <StatusSummary label="New" count={counts.New} detail="Just sent" tone={statusTone.New} />
          <StatusSummary label="Preparing" count={counts.Preparing} detail="On the line" tone={statusTone.Preparing} />
          <StatusSummary label="Ready" count={counts.Ready} detail="At the pass" tone={statusTone.Ready} />
        </View>

        <View style={styles.filters}>
          {filters.map((item) => (
            <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}>
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
              {item !== 'All tickets' && <Text style={[styles.filterCount, filter === item && styles.filterCountActive]}>{counts[item]}</Text>}
            </Pressable>
          ))}
        </View>

        {visible.length ? (
          <View style={[styles.ticketGrid, wide && styles.ticketGridWide]}>
            {visible.map((ticket) => <KitchenTicketCard key={ticket.id} ticket={ticket} wide={wide} onAdvance={() => advanceTicket(ticket)} />)}
          </View>
        ) : (
          <View style={styles.emptyState}><Text style={styles.emptyTitle}>All clear at the pass.</Text><Text style={styles.emptyCopy}>New confirmed orders will appear here automatically.</Text></View>
        )}
        <Text style={styles.footer}>MOCK SERVICE DATA · COUNTER RECEIVES A COPY OF EACH CONFIRMED ORDER</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusSummary({ label, count, detail, tone }: { label: string; count: number; detail: string; tone: { color: string; bg: string } }) {
  return (
    <View style={styles.summary}>
      <View style={[styles.summaryIcon, { backgroundColor: tone.bg }]}><Text style={[styles.summaryCount, { color: tone.color }]}>{count}</Text></View>
      <View><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryDetail}>{detail}</Text></View>
    </View>
  );
}

function KitchenTicketCard({ ticket, wide, onAdvance }: { ticket: KitchenTicket; wide: boolean; onAdvance: () => void }) {
  const tone = statusTone[ticket.status];
  const buttonLabel = ticket.status === 'New' ? 'Start preparing' : ticket.status === 'Preparing' ? 'Mark ready' : 'Picked up';
  const amount = ticket.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <View style={[styles.ticketCard, wide && styles.ticketCardWide]}>
      <View style={styles.cardHeader}>
        <View><Text style={styles.tableLabel}>TABLE {String(ticket.table).padStart(2, '0')}</Text><Text style={styles.orderId}>{ticket.id} <Text style={styles.dotSeparator}>·</Text> {ticket.guestCount} guests</Text></View>
        <View style={[styles.statusPill, { backgroundColor: tone.bg }]}><Text style={[styles.statusPillText, { color: tone.color }]}>{ticket.status.toUpperCase()}</Text></View>
      </View>
      <View style={styles.itemList}>
        {ticket.items.map((item) => (
          <View key={item.itemId} style={styles.itemRow}><Text style={styles.itemQuantity}>{item.quantity}×</Text><Text style={styles.itemName}>{item.name}</Text><Text style={styles.itemPrice}>{currency(item.price * item.quantity)}</Text></View>
        ))}
      </View>
      {ticket.note ? <View style={styles.kitchenNote}><Text style={styles.noteLabel}>NOTE</Text><Text style={styles.noteText}>{ticket.note}</Text></View> : null}
      <View style={styles.cardFooter}><View><Text style={styles.ticketMeta}>Sent by {ticket.waiter}</Text><Text style={styles.ticketAge}>{ticket.age === 'just now' ? ticket.age : `${ticket.age} ago`}</Text></View><Text style={styles.ticketAmount}>{currency(amount)}</Text></View>
      <Pressable onPress={onAdvance} style={[styles.actionButton, ticket.status === 'Ready' && styles.readyButton]}><Text style={[styles.actionText, ticket.status === 'Ready' && styles.readyText]}>{buttonLabel}</Text><Text style={[styles.actionArrow, ticket.status === 'Ready' && styles.readyText]}>→</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 20, paddingBottom: 34 },
  wideContent: { width: '100%', maxWidth: 1180, alignSelf: 'center', paddingHorizontal: 42 },
  topLine: { minHeight: 70, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: palette.line },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 36, height: 36, borderRadius: 18, backgroundColor: palette.green, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#F5F1E5', fontFamily: 'Georgia', fontSize: 22 },
  brandName: { color: palette.ink, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  brandCaption: { color: palette.muted, fontSize: 8, fontWeight: '700', letterSpacing: 0.8, marginTop: 3 },
  openIndicator: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 18 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#61966D' },
  openText: { color: palette.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  headingRow: { paddingTop: 25, paddingBottom: 22, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  headingCopy: { flex: 1 },
  eyebrow: { color: palette.amber, fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: palette.ink, fontFamily: 'Georgia', fontSize: 38, marginTop: 5 },
  subtitle: { color: palette.muted, fontSize: 12, marginTop: 7 },
  ticketTotal: { alignItems: 'flex-end', paddingBottom: 3 },
  ticketTotalValue: { color: palette.ink, fontFamily: 'Georgia', fontSize: 28 },
  ticketTotalLabel: { color: palette.muted, fontSize: 8, fontWeight: '800', letterSpacing: 0.8, marginTop: 2 },
  statsRow: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: palette.line, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  summary: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9 },
  summaryIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  summaryCount: { fontSize: 15, fontWeight: '800' },
  summaryLabel: { color: palette.ink, fontSize: 11, fontWeight: '800' },
  summaryDetail: { color: palette.muted, fontSize: 9, marginTop: 3 },
  filters: { flexDirection: 'row', gap: 8, paddingVertical: 18 },
  filter: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: palette.line },
  filterActive: { backgroundColor: palette.green, borderColor: palette.green },
  filterText: { color: palette.muted, fontSize: 10, fontWeight: '700' },
  filterTextActive: { color: palette.white },
  filterCount: { color: palette.muted, fontSize: 9, fontWeight: '800' },
  filterCountActive: { color: '#D6E0D6' },
  ticketGrid: { gap: 12 },
  ticketGridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  ticketCard: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, borderRadius: 7, padding: 15 },
  ticketCardWide: { width: '48%', flexGrow: 1, minWidth: 300, maxWidth: 540 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tableLabel: { color: palette.ink, fontSize: 14, fontWeight: '900', letterSpacing: 0.3 },
  orderId: { color: palette.muted, fontSize: 10, marginTop: 4 },
  dotSeparator: { color: palette.amber },
  statusPill: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 14 },
  statusPillText: { fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  itemList: { marginTop: 13, borderTopWidth: 1, borderColor: palette.line, paddingTop: 4 },
  itemRow: { flexDirection: 'row', alignItems: 'center', minHeight: 29, gap: 8 },
  itemQuantity: { color: palette.amber, width: 22, fontSize: 11, fontWeight: '800' },
  itemName: { flex: 1, color: palette.ink, fontSize: 11 },
  itemPrice: { color: palette.muted, fontSize: 10 },
  kitchenNote: { marginTop: 9, paddingHorizontal: 9, paddingVertical: 8, borderLeftWidth: 2, borderColor: palette.amber, backgroundColor: '#FAF4EC', flexDirection: 'row', gap: 8 },
  noteLabel: { color: palette.amber, fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
  noteText: { color: '#705A45', fontSize: 10, flex: 1 },
  cardFooter: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderColor: palette.line, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketMeta: { color: palette.muted, fontSize: 9 },
  ticketAge: { color: palette.ink, fontSize: 9, marginTop: 3, fontWeight: '700' },
  ticketAmount: { color: palette.ink, fontSize: 15, fontWeight: '800' },
  actionButton: { minHeight: 42, marginTop: 12, borderRadius: 6, backgroundColor: palette.green, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionText: { color: palette.white, fontSize: 11, fontWeight: '800' },
  actionArrow: { color: '#D9E2D8', fontSize: 15 },
  readyButton: { backgroundColor: palette.paleGreen },
  readyText: { color: palette.green },
  emptyState: { minHeight: 190, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: palette.line, borderRadius: 7 },
  emptyTitle: { color: palette.ink, fontFamily: 'Georgia', fontSize: 21 },
  emptyCopy: { color: palette.muted, fontSize: 11, marginTop: 6, textAlign: 'center', paddingHorizontal: 20 },
  footer: { color: palette.muted, textAlign: 'center', fontSize: 8, fontWeight: '700', letterSpacing: 0.7, marginTop: 26 },
});