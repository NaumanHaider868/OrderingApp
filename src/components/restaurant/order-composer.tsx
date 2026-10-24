import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { currency, menuItems, OrderLine } from '@/data/mock-restaurant';

const palette = {
  ink: '#202B26', muted: '#78827A', paper: '#F7F6F1', line: '#E6E4DA',
  green: '#244C3C', paleGreen: '#E7EFE8', amber: '#C87945', white: '#FFFFFF',
};

type OrderComposerProps = {
  visible: boolean;
  table: number | null;
  onClose: () => void;
  onConfirm: (items: OrderLine[], note: string) => void;
};

export function OrderComposer({ visible, table, onClose, onConfirm }: OrderComposerProps) {
  const [category, setCategory] = useState('Small plates');
  const [items, setItems] = useState<OrderLine[]>([]);
  const [note, setNote] = useState('');
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const categories = ['Small plates', 'Mains', 'Drinks'] as const;

  function updateQuantity(itemId: string, change: number) {
    const menuItem = menuItems.find((item) => item.id === itemId);
    if (!menuItem) return;
    setItems((current) => {
      const existing = current.find((item) => item.itemId === itemId);
      if (!existing && change > 0) {
        return [...current, { itemId, name: menuItem.name, quantity: 1, price: menuItem.price }];
      }
      return current
        .map((item) => item.itemId === itemId ? { ...item, quantity: item.quantity + change } : item)
        .filter((item) => item.quantity > 0);
    });
  }

  function submitOrder() {
    if (!items.length) return;
    onConfirm(items, note.trim());
    setItems([]);
    setNote('');
    setCategory('Small plates');
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>NEW TABLE ORDER</Text>
            <Text style={styles.title}>Table {table ?? ''}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Close order" onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>

        <View style={styles.categories}>
          {categories.map((item) => (
            <Pressable key={item} onPress={() => setCategory(item)} style={[styles.category, category === item && styles.categoryActive]}>
              <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <ScrollView style={styles.menuScroll} contentContainerStyle={styles.menuList} keyboardShouldPersistTaps="handled">
          {menuItems.filter((item) => item.category === category).map((item) => {
            const selected = items.find((line) => line.itemId === item.id)?.quantity ?? 0;
            return (
              <View key={item.id} style={styles.menuItem}>
                <View style={styles.menuCopy}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <Text style={styles.menuDetail}>{item.detail}</Text>
                </View>
                <Text style={styles.menuPrice}>{currency(item.price)}</Text>
                {selected ? (
                  <View style={styles.quantityControl}>
                    <Pressable accessibilityLabel={`Remove one ${item.name}`} onPress={() => updateQuantity(item.id, -1)} style={styles.quantityButton}><Text style={styles.quantityButtonText}>−</Text></Pressable>
                    <Text style={styles.quantity}>{selected}</Text>
                    <Pressable accessibilityLabel={`Add one ${item.name}`} onPress={() => updateQuantity(item.id, 1)} style={styles.quantityButton}><Text style={styles.quantityButtonText}>+</Text></Pressable>
                  </View>
                ) : (
                  <Pressable accessibilityLabel={`Add ${item.name}`} onPress={() => updateQuantity(item.id, 1)} style={styles.addButton}><Text style={styles.addText}>+</Text></Pressable>
                )}
              </View>
            );
          })}

          <Text style={styles.noteLabel}>NOTE FOR THE KITCHEN</Text>
          <TextInput
            accessibilityLabel="Note for the kitchen"
            value={note}
            onChangeText={setNote}
            placeholder="Allergies, swaps, or timing"
            placeholderTextColor={palette.muted}
            style={styles.noteInput}
            maxLength={120}
          />
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{items.reduce((sum, item) => sum + item.quantity, 0)} items</Text>
            <Text style={styles.total}>{currency(total)}</Text>
          </View>
          <Pressable disabled={!items.length} onPress={submitOrder} style={[styles.submitButton, !items.length && styles.submitDisabled]}>
            <Text style={styles.submitText}>Send to kitchen + counter</Text>
            <Text style={styles.submitArrow}>→</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: palette.amber, fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: palette.ink, fontSize: 30, fontFamily: 'Georgia', marginTop: 4 },
  closeButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ECEAE1' },
  closeText: { color: palette.ink, fontSize: 28, lineHeight: 30 },
  categories: { flexDirection: 'row', gap: 8, paddingHorizontal: 24, paddingBottom: 12 },
  category: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: '#ECEAE1' },
  categoryActive: { backgroundColor: palette.green },
  categoryText: { color: palette.muted, fontSize: 12, fontWeight: '700' },
  categoryTextActive: { color: palette.white },
  menuScroll: { flex: 1 },
  menuList: { paddingHorizontal: 24, paddingBottom: 20 },
  menuItem: { minHeight: 76, borderBottomWidth: 1, borderColor: palette.line, flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuCopy: { flex: 1 },
  menuName: { color: palette.ink, fontSize: 14, fontWeight: '700' },
  menuDetail: { color: palette.muted, fontSize: 11, marginTop: 4 },
  menuPrice: { color: palette.ink, fontSize: 12, fontWeight: '700' },
  addButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: palette.paleGreen, justifyContent: 'center', alignItems: 'center' },
  addText: { color: palette.green, fontSize: 22, lineHeight: 24 },
  quantityControl: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  quantityButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: palette.paleGreen, justifyContent: 'center', alignItems: 'center' },
  quantityButtonText: { color: palette.green, fontSize: 18, fontWeight: '700' },
  quantity: { minWidth: 14, textAlign: 'center', color: palette.ink, fontWeight: '700' },
  noteLabel: { color: palette.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginTop: 24, marginBottom: 8 },
  noteInput: { borderWidth: 1, borderColor: palette.line, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11, color: palette.ink, fontSize: 13 },
  footer: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 14, borderTopWidth: 1, borderColor: palette.line, backgroundColor: palette.paper },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  totalLabel: { color: palette.muted, fontSize: 12 },
  total: { color: palette.ink, fontSize: 20, fontWeight: '800' },
  submitButton: { minHeight: 52, borderRadius: 8, backgroundColor: palette.green, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  submitDisabled: { opacity: 0.45 },
  submitText: { color: palette.white, fontSize: 13, fontWeight: '700' },
  submitArrow: { color: palette.white, fontSize: 18 },
});