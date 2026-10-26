import { useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRestaurantState } from "@/components/restaurant/restaurant-state";
import {
    currency,
    iceCreamFlavors,
    KitchenTicket,
    menuCategories,
    MenuCategory,
    MenuItem,
    menuItems,
    OrderLine,
} from "@/data/mock-restaurant";

const colors = {
  ink: "#173840",
  muted: "#58777D",
  paper: "#F1FAF8",
  white: "#FFFFFF",
  line: "#D4E9E7",
  green: "#21886B",
  paleGreen: "#E2F4EA",
  blue: "#48AFCF",
  paleBlue: "#E4F5FB",
  deepBlue: "#247797",
};

export default function MenuScreen() {
  const {
    tables,
    setTables,
    tickets,
    setTickets,
    summary,
    setSummary,
    role,
    staffName,
    setRole,
    setStaffName,
  } = useRestaurantState();
  const [category, setCategory] = useState<MenuCategory>("Breakfast");
  const [cart, setCart] = useState<OrderLine[]>([]);
  const [scoopFlavors, setScoopFlavors] = useState([""]);
  const [customizeItem, setCustomizeItem] = useState<MenuItem | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [tablePickerOpen, setTablePickerOpen] = useState(false);
  const [confirmTable, setConfirmTable] = useState<number | null>(null);
  const [wide, setWide] = useState(false);
  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [cart],
  );
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const canAddIceCream = scoopFlavors.every(Boolean);
  const visibleItems = menuItems.filter((item) => item.category === category);
  const selectedOption =
    customizeItem?.options?.find((option) => option.id === selectedOptionId) ??
    null;

  function updateQuantity(itemId: string, change: number) {
    const menuItem = menuItems.find((item) => item.id === itemId);
    setCart((current) => {
      const existing = current.find((item) => item.itemId === itemId);
      if (!existing && (!menuItem || change < 1)) return current;
      if (!existing && menuItem)
        return [
          ...current,
          { itemId, name: menuItem.name, quantity: 1, price: menuItem.price },
        ];
      return current
        .map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0);
    });
  }

  function addIceCream() {
    if (!canAddIceCream) return;
    const name = `Ice cream · ${scoopFlavors.length} scoop${scoopFlavors.length === 1 ? "" : "s"} (${scoopFlavors.join(", ")})`;
    const itemId = `ice-cream-${scoopFlavors.join("-").toLowerCase()}`;
    setCart((current) => {
      const existing = current.find((item) => item.itemId === itemId);
      if (existing) {
        return current.map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...current,
        { itemId, name, quantity: 1, price: scoopFlavors.length * 350 },
      ];
    });
    setScoopFlavors([""]);
  }

  function addConfiguredItem() {
    if (!customizeItem || !selectedOption) return;
    const itemId = `${customizeItem.id}-${selectedOption.id}`;
    const optionName = selectedOption.label.split(" · PKR")[0];
    setCart((current) => {
      const existing = current.find((item) => item.itemId === itemId);
      if (existing) {
        return current.map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...current,
        {
          itemId,
          name: `${customizeItem.name} · ${optionName}`,
          quantity: 1,
          price: selectedOption.price,
        },
      ];
    });
    setCustomizeItem(null);
    setSelectedOptionId(null);
  }

  function selectMenuItem(item: MenuItem) {
    if (item.options?.length) {
      setCustomizeItem(item);
      setSelectedOptionId(item.options[0].id);
      return;
    }
    updateQuantity(item.id, 1);
  }

  function sendOrder(tableNumber: number) {
    if (!cart.length) return;
    const orderNumber = `#${1050 + tickets.length}`;
    const newTicket: KitchenTicket = {
      id: orderNumber,
      table: tableNumber,
      guestCount: 2,
      waiter: staffName || "Staff",
      age: "just now",
      status: "New",
      items: cart,
    };
    setTickets((current) => [newTicket, ...current]);
    setSummary((current) => {
      const nextOrderCount = current.todayOrders + 1;
      const nextTodaySales = current.todaySales + total;
      return {
        ...current,
        todaySales: nextTodaySales,
        todayOrders: nextOrderCount,
        thisWeekOrders: current.thisWeekOrders + 1,
        thisMonthSales: current.thisMonthSales + total,
        average:
          (current.average * current.todayOrders + total) / nextOrderCount,
        guests: String(Number(current.guests) + 2),
      };
    });
    setTables((current) =>
      current.map((table) =>
        table.number === tableNumber
          ? {
              ...table,
              status: "In kitchen",
              order: orderNumber,
              total: (table.total ?? 0) + total,
            }
          : table,
      ),
    );
    setCart([]);
    setTablePickerOpen(false);
    setConfirmTable(null);
  }

  function signOut() {
    setRole(null);
    setStaffName("");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        onLayout={(event) => setWide(event.nativeEvent.layout.width >= 760)}
        contentContainerStyle={[styles.content, wide && styles.wideContent]}
      >
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>M</Text>
            </View>
            <View>
              <Text style={styles.brandName}>MEHAR JUICE</Text>
              <Text style={styles.brandCaption}>ORDER MENU</Text>
            </View>
          </View>
          <Pressable onPress={signOut} style={styles.account}>
            <View style={styles.accountDot} />
            <Text style={styles.accountText}>
              {staffName} · {role}
            </Text>
            <Text style={styles.signOut}>Sign out</Text>
          </Pressable>
        </View>

        <View style={styles.heading}>
          <View style={styles.headingText}>
            <Text style={styles.kicker}>MENU</Text>
            <Text style={styles.title}>Choose items</Text>
            <Text style={styles.subtitle}>
              Build one order across any of the menu sections.
            </Text>
          </View>
          <View style={styles.menuCount}>
            <Text style={styles.menuCountValue}>{menuItems.length}</Text>
            <Text style={styles.menuCountLabel}>MENU ITEMS</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {menuCategories.map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[
                styles.categoryTab,
                category === item && styles.categoryTabActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={[styles.main, wide && styles.mainWide]}>
          <View style={styles.menuColumn}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{category}</Text>
              <Text style={styles.sectionDetail}>
                {visibleItems.length} choices
              </Text>
            </View>
            {category === "Ice Cream" && (
              <View style={styles.scoopBuilder}>
                <View style={styles.builderHeader}>
                  <View>
                    <Text style={styles.builderTitle}>Build your scoops</Text>
                    <Text style={styles.builderDetail}>
                      Pick a flavor for every scoop.
                    </Text>
                  </View>
                  <View style={styles.stepper}>
                    <Pressable
                      accessibilityLabel="Remove a scoop"
                      onPress={() =>
                        setScoopFlavors((current) =>
                          current.length > 1 ? current.slice(0, -1) : current,
                        )
                      }
                      style={styles.stepButton}
                    >
                      <Text style={styles.stepText}>−</Text>
                    </Pressable>
                    <Text style={styles.stepCount}>{scoopFlavors.length}</Text>
                    <Pressable
                      accessibilityLabel="Add a scoop"
                      onPress={() =>
                        setScoopFlavors((current) => [...current, ""])
                      }
                      style={styles.stepButton}
                    >
                      <Text style={styles.stepText}>+</Text>
                    </Pressable>
                  </View>
                </View>
                {scoopFlavors.map((flavor, index) => (
                  <View key={`scoop-${index}`} style={styles.flavorRow}>
                    <Text style={styles.flavorNumber}>SCOOP {index + 1}</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.flavors}
                    >
                      {iceCreamFlavors.map((item) => (
                        <Pressable
                          key={item}
                          onPress={() =>
                            setScoopFlavors((current) =>
                              current.map((currentFlavor, scoopIndex) =>
                                scoopIndex === index ? item : currentFlavor,
                              ),
                            )
                          }
                          style={[
                            styles.flavorChip,
                            flavor === item && styles.flavorChipActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.flavorText,
                              flavor === item && styles.flavorTextActive,
                            ]}
                          >
                            {item}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                ))}
                <Pressable
                  disabled={!canAddIceCream}
                  onPress={addIceCream}
                  style={[
                    styles.addCustom,
                    !canAddIceCream && styles.addCustomDisabled,
                  ]}
                >
                  <Text style={styles.addCustomText}>
                    Add {scoopFlavors.length} scoop
                    {scoopFlavors.length === 1 ? "" : "s"} ·{" "}
                    {currency(scoopFlavors.length * 350)}
                  </Text>
                  <Text style={styles.addCustomIcon}>+</Text>
                </Pressable>
              </View>
            )}
            <View style={[styles.itemGrid, wide && styles.itemGridWide]}>
              {visibleItems.map((item, index) => {
                const quantity =
                  cart.find((line) => line.itemId === item.id)?.quantity ?? 0;
                return (
                  <View
                    key={item.id}
                    style={[styles.menuItem, wide && styles.menuItemWide]}
                  >
                    <View
                      style={[
                        styles.itemColor,
                        index % 2 ? styles.itemColorBlue : styles.itemColorGreen,
                      ]}
                    >
                      <Text style={styles.itemInitial}>
                        {item.name.slice(0, 1)}
                      </Text>
                    </View>
                    <View style={styles.itemBody}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemDetail} numberOfLines={2}>
                        {item.detail}
                      </Text>
                    </View>
                    <View style={styles.itemActions}>
                      <Text style={styles.itemPrice}>
                        {item.options
                          ? `From ${currency(item.price)}`
                          : currency(item.price)}
                      </Text>
                      {item.options ? (
                        <Pressable
                          accessibilityLabel={`Choose options for ${item.name}`}
                          onPress={() => selectMenuItem(item)}
                          style={styles.configureButton}
                        >
                          <Text style={styles.configureButtonText}>
                            Choose options
                          </Text>
                        </Pressable>
                      ) : quantity > 0 ? (
                        <View style={styles.quantityControl}>
                          <Pressable
                            onPress={() => updateQuantity(item.id, -1)}
                            accessibilityLabel={`Remove one ${item.name}`}
                            style={styles.quantityButton}
                          >
                            <Text style={styles.quantityButtonText}>−</Text>
                          </Pressable>
                          <Text style={styles.quantity}>{quantity}</Text>
                          <Pressable
                            onPress={() => updateQuantity(item.id, 1)}
                            accessibilityLabel={`Add one ${item.name}`}
                            style={styles.quantityButton}
                          >
                            <Text style={styles.quantityButtonText}>+</Text>
                          </Pressable>
                        </View>
                      ) : (
                        <Pressable
                          accessibilityLabel={`Add ${item.name}`}
                          onPress={() => selectMenuItem(item)}
                          style={styles.addButton}
                        >
                          <Text style={styles.addButtonText}>+</Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={[styles.cartColumn, wide && styles.cartColumnWide]}>
            <View style={styles.cartHeader}>
              <View>
                <Text style={styles.cartEyebrow}>CURRENT ORDER</Text>
                <Text style={styles.cartTitle}>Your selection</Text>
              </View>
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            </View>
            {cart.length ? (
              <View style={styles.cartItems}>
                {cart.map((item) => (
                  <View key={item.itemId} style={styles.cartItem}>
                    <View style={styles.cartItemCopy}>
                      <Text style={styles.cartItemName}>{item.name}</Text>
                    </View>
                    <View style={styles.cartItemActions}>
                      <Text style={styles.cartItemPrice}>
                        {currency(item.quantity * item.price)}
                      </Text>
                      <View style={styles.quantityControl}>
                        <Pressable
                          onPress={() => updateQuantity(item.itemId, -1)}
                          accessibilityLabel={`Remove one ${item.name}`}
                          style={styles.quantityButton}
                        >
                          <Text style={styles.quantityButtonText}>−</Text>
                        </Pressable>
                        <Text style={styles.quantity}>{item.quantity}</Text>
                        <Pressable
                          onPress={() => updateQuantity(item.itemId, 1)}
                          accessibilityLabel={`Add one ${item.name}`}
                          style={styles.quantityButton}
                        >
                          <Text style={styles.quantityButtonText}>+</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyCart}>
                <Text style={styles.emptyCartTitle}>Nothing selected yet</Text>
                <Text style={styles.emptyCartText}>
                  Tap + on menu items to start an order.
                </Text>
              </View>
            )}
            <View style={styles.cartTotal}>
              <Text style={styles.totalLabel}>Order total</Text>
              <Text style={styles.totalValue}>{currency(total)}</Text>
            </View>
            <Pressable
              disabled={!cart.length}
              onPress={() => setTablePickerOpen(true)}
              style={[
                styles.checkoutButton,
                !cart.length && styles.checkoutDisabled,
              ]}
            >
              <Text style={styles.checkoutText}>Choose table</Text>
              <Text style={styles.checkoutArrow}>→</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={customizeItem !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCustomizeItem(null)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.kicker}>CUSTOMIZE ORDER</Text>
              <Text style={styles.modalTitle}>{customizeItem?.name}</Text>
            </View>
            <Pressable
              accessibilityLabel="Close options"
              onPress={() => setCustomizeItem(null)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          <Text style={styles.modalSubtitle}>
            {customizeItem?.detail}
          </Text>
          <ScrollView contentContainerStyle={styles.optionList}>
            {customizeItem?.options?.map((option) => {
              const selected = selectedOptionId === option.id;
              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => setSelectedOptionId(option.id)}
                  style={[
                    styles.optionRow,
                    selected && styles.optionRowSelected,
                  ]}
                >
                  <View
                    style={[
                      styles.optionIndicator,
                      selected && styles.optionIndicatorSelected,
                    ]}
                  />
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={styles.optionFooter}>
            <Pressable
              disabled={!selectedOption}
              onPress={addConfiguredItem}
              style={[
                styles.checkoutButton,
                !selectedOption && styles.checkoutDisabled,
              ]}
            >
              <Text style={styles.checkoutText}>
                Add to order
                {selectedOption ? ` · ${currency(selectedOption.price)}` : ""}
              </Text>
              <Text style={styles.checkoutArrow}>+</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={tablePickerOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setTablePickerOpen(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.kicker}>SEND ORDER</Text>
              <Text style={styles.modalTitle}>Choose a table</Text>
            </View>
            <Pressable
              onPress={() => setTablePickerOpen(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          <Text style={styles.modalSubtitle}>
            {itemCount} selected item{itemCount === 1 ? "" : "s"} ·{" "}
            {currency(total)}
          </Text>
          <ScrollView contentContainerStyle={styles.tableList}>
            {tables.map((table) => (
              <Pressable
                key={table.number}
                onPress={() => {
                  setConfirmTable(table.number);
                  setTablePickerOpen(false);
                }}
                style={styles.tableOption}
              >
                <View style={styles.tableNumber}>
                  <Text style={styles.tableNumberText}>
                    {String(table.number).padStart(2, "0")}
                  </Text>
                </View>
                <View style={styles.tableCopy}>
                  <Text style={styles.tableName}>Table {table.number}</Text>
                  <Text style={styles.tableStatus}>
                    {table.seats} seats · {table.status}
                  </Text>
                </View>
                <Text style={styles.tableArrow}>→</Text>
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
      <Modal
        visible={confirmTable !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setConfirmTable(null);
          setTablePickerOpen(true);
        }}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.kicker}>WAITER CONFIRMATION</Text>
              <Text style={styles.modalTitle}>Confirm this order?</Text>
            </View>
            <Pressable
              onPress={() => {
                setConfirmTable(null);
                setTablePickerOpen(true);
              }}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          <Text style={styles.modalSubtitle}>
            Table {confirmTable} · {staffName || "Waiter"}
          </Text>
          <ScrollView contentContainerStyle={styles.confirmItems}>
            {cart.map((item) => (
              <View key={item.itemId} style={styles.confirmItem}>
                <View style={styles.confirmItemCopy}>
                  <Text style={styles.confirmItemName}>{item.name}</Text>
                  <Text style={styles.confirmItemPrice}>
                    {currency(item.quantity * item.price)}
                  </Text>
                </View>
                <View style={styles.quantityControl}>
                  <Pressable
                    onPress={() => updateQuantity(item.itemId, -1)}
                    accessibilityLabel={`Remove one ${item.name}`}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </Pressable>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <Pressable
                    onPress={() => updateQuantity(item.itemId, 1)}
                    accessibilityLabel={`Add one ${item.name}`}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.confirmFooter}>
            <View style={styles.confirmTotal}>
              <Text style={styles.totalLabel}>Order total</Text>
              <Text style={styles.totalValue}>{currency(total)}</Text>
            </View>
            <Pressable
              onPress={() => setConfirmTable(null)}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Edit menu</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setConfirmTable(null);
                setTablePickerOpen(true);
              }}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Back to tables</Text>
            </Pressable>
            <Pressable
              disabled={confirmTable === null || !cart.length}
              onPress={() => {
                if (confirmTable !== null) sendOrder(confirmTable);
              }}
              style={[
                styles.checkoutButton,
                (confirmTable === null || !cart.length) &&
                  styles.checkoutDisabled,
              ]}
            >
              <Text style={styles.checkoutText}>Confirm and send order</Text>
              <Text style={styles.checkoutArrow}>→</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: 19, paddingBottom: 32 },
  wideContent: {
    width: "100%",
    maxWidth: 1220,
    alignSelf: "center",
    paddingHorizontal: 36,
  },
  header: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: colors.line,
    gap: 8,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  brandMarkText: { color: colors.white, fontSize: 22, fontWeight: "800" },
  brandName: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  brandCaption: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 3,
  },
  account: { flexDirection: "row", alignItems: "center", gap: 6 },
  accountDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  accountText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  signOut: {
    color: colors.deepBlue,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 5,
  },
  heading: {
    paddingTop: 24,
    paddingBottom: 19,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
  },
  headingText: { flex: 1 },
  kicker: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
  },
  title: { color: colors.ink, fontSize: 30, fontWeight: "800", marginTop: 4 },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 6 },
  menuCount: { alignItems: "flex-end", paddingBottom: 3 },
  menuCountValue: { color: colors.ink, fontSize: 22, fontWeight: "800" },
  menuCountLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
    marginTop: 2,
  },
  categories: { gap: 8, paddingBottom: 17 },
  categoryTab: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  categoryTabActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  categoryText: { color: colors.muted, fontSize: 13, fontWeight: "700" },
  categoryTextActive: { color: colors.white },
  main: { gap: 22 },
  mainWide: { flexDirection: "row", alignItems: "flex-start" },
  menuColumn: { flex: 1.7, minWidth: 0 },
  cartColumn: {
    minWidth: 0,
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingTop: 15,
  },
  cartColumnWide: {
    width: 340,
    borderTopWidth: 0,
    borderLeftWidth: 1,
    paddingTop: 0,
    paddingLeft: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 11,
  },
  sectionTitle: { color: colors.ink, fontSize: 21, fontWeight: "800" },
  sectionDetail: { color: colors.muted, fontSize: 12, fontWeight: "600" },
  scoopBuilder: {
    padding: 14,
    backgroundColor: colors.paleBlue,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C7E8F2",
    marginBottom: 13,
  },
  builderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  builderTitle: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  builderDetail: { color: colors.muted, fontSize: 12, marginTop: 3 },
  stepper: {
    minHeight: 38,
    paddingHorizontal: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.white,
  },
  stepButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: { color: colors.green, fontSize: 23, fontWeight: "700" },
  stepCount: {
    color: colors.ink,
    minWidth: 20,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "800",
  },
  flavorRow: {
    paddingTop: 9,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderColor: "#C7E8F2",
    gap: 8,
  },
  flavorNumber: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.7,
  },
  flavors: { gap: 6 },
  flavorChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: colors.white,
    borderRadius: 7,
  },
  flavorChipActive: { backgroundColor: colors.green },
  flavorText: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  flavorTextActive: { color: colors.white },
  addCustom: {
    minHeight: 42,
    marginTop: 9,
    borderRadius: 8,
    backgroundColor: colors.green,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  addCustomDisabled: { opacity: 0.45 },
  addCustomText: { color: colors.white, fontSize: 13, fontWeight: "800" },
  addCustomIcon: { color: colors.white, fontSize: 21, lineHeight: 23 },
  itemGrid: { gap: 9 },
  itemGridWide: { flexDirection: "row", flexWrap: "wrap" },
  menuItem: {
    minHeight: 82,
    padding: 11,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 9,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuItemWide: { width: "48%", flexGrow: 1, minWidth: 260 },
  itemColor: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemColorGreen: { backgroundColor: colors.paleGreen },
  itemColorBlue: { backgroundColor: colors.paleBlue },
  itemInitial: { color: colors.green, fontSize: 19, fontWeight: "900" },
  itemBody: { flex: 1, minWidth: 0, gap: 4 },
  itemName: { color: colors.ink, fontSize: 14, fontWeight: "800" },
  itemDetail: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  itemPrice: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  itemActions: { alignItems: "flex-end", gap: 7 },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: colors.paleGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: colors.green,
    fontSize: 23,
    lineHeight: 26,
    fontWeight: "700",
  },
  configureButton: {
    minHeight: 36,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.paleGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  configureButtonText: { color: colors.green, fontSize: 12, fontWeight: "800" },
  quantityControl: { flexDirection: "row", alignItems: "center", gap: 7 },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.paleGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: { color: colors.green, fontSize: 19, fontWeight: "800" },
  quantity: {
    minWidth: 17,
    color: colors.ink,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "800",
  },
  cartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartEyebrow: {
    color: colors.deepBlue,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  cartTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 3,
  },
  cartBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.paleBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: { color: colors.deepBlue, fontSize: 13, fontWeight: "900" },
  emptyCart: {
    minHeight: 90,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  emptyCartTitle: { color: colors.ink, fontSize: 14, fontWeight: "700" },
  emptyCartText: { color: colors.muted, fontSize: 12, marginTop: 4 },
  cartItems: { marginTop: 7 },
  cartItem: {
    minHeight: 56,
    borderBottomWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  cartItemCopy: { flex: 1 },
  cartItemName: { color: colors.ink, fontSize: 13, fontWeight: "700" },
  cartItemActions: { alignItems: "flex-end", gap: 5 },
  cartItemPrice: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  cartTotal: {
    minHeight: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { color: colors.muted, fontSize: 14, fontWeight: "700" },
  totalValue: { color: colors.ink, fontSize: 21, fontWeight: "900" },
  checkoutButton: {
    minHeight: 50,
    borderRadius: 9,
    backgroundColor: colors.green,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  checkoutDisabled: { opacity: 0.45 },
  checkoutText: { color: colors.white, fontSize: 14, fontWeight: "800" },
  checkoutArrow: { color: colors.white, fontSize: 18 },
  modalSafe: { flex: 1, backgroundColor: colors.paper },
  modalHeader: {
    paddingHorizontal: 22,
    paddingTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    color: colors.ink,
    fontSize: 27,
    fontWeight: "800",
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.paleBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { color: colors.ink, fontSize: 27, lineHeight: 30 },
  modalSubtitle: {
    color: colors.muted,
    fontSize: 14,
    paddingHorizontal: 22,
    marginTop: 8,
    marginBottom: 10,
  },
  optionList: { paddingHorizontal: 22, paddingBottom: 24, gap: 9 },
  optionRow: {
    minHeight: 62,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 12,
  },
  optionRowSelected: {
    borderColor: colors.green,
    backgroundColor: colors.paleGreen,
  },
  optionIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.muted,
  },
  optionIndicatorSelected: { borderWidth: 5, borderColor: colors.green },
  optionLabel: { flex: 1, color: colors.ink, fontSize: 14, fontWeight: "700" },
  optionFooter: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: colors.line,
  },
  tableList: { paddingHorizontal: 22, paddingBottom: 24, gap: 9 },
  tableOption: {
    minHeight: 68,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 12,
  },
  tableNumber: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.paleGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  tableNumberText: { color: colors.green, fontSize: 16, fontWeight: "900" },
  tableCopy: { flex: 1 },
  tableName: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  tableStatus: { color: colors.muted, fontSize: 12, marginTop: 3 },
  tableArrow: { color: colors.deepBlue, fontSize: 19, fontWeight: "700" },
  confirmItems: { paddingHorizontal: 22, paddingBottom: 20 },
  confirmItem: {
    minHeight: 72,
    borderBottomWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  confirmItemCopy: { flex: 1, gap: 4 },
  confirmItemName: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700",
  },
  confirmItemPrice: { color: colors.muted, fontSize: 13, fontWeight: "700" },
  confirmFooter: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: colors.line,
    gap: 9,
  },
  confirmTotal: {
    minHeight: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  backButtonText: { color: colors.ink, fontSize: 14, fontWeight: "800" },
});
