export type TableStatus =
  | "Available"
  | "Dining"
  | "In kitchen"
  | "Ready to serve";
export type TicketStatus = "New" | "Preparing" | "Ready";
export type StaffRole = "admin" | "waiter" | "kitchen";

export const menuCategories = [
  "Ice Cream",
  "Fish",
  "Chicken",
  "Fruit Chaat",
  "Cream Chaat",
  "Other",
] as const;
export type MenuCategory = (typeof menuCategories)[number];

export type MenuItem = {
  id: string;
  name: string;
  detail: string;
  price: number;
  category: MenuCategory;
};

export type OrderLine = {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
};

export type KitchenTicket = {
  id: string;
  table: number;
  guestCount: number;
  waiter: string;
  age: string;
  status: TicketStatus;
  items: OrderLine[];
  note?: string;
};

export const menuItems: MenuItem[] = [
  {
    id: "fried-fish",
    name: "Fried fish",
    detail: "Crispy fish · lemon · house sauce",
    price: 1800,
    category: "Fish",
  },
  {
    id: "grilled-fish",
    name: "Grilled fish",
    detail: "Fresh herbs · seasonal sides",
    price: 2100,
    category: "Fish",
  },
  {
    id: "chicken",
    name: "Fried chicken",
    detail: "Crispy chicken · house seasoning",
    price: 1600,
    category: "Chicken",
  },
  {
    id: "roast-chicken",
    name: "Roast chicken",
    detail: "Slow roasted · herb sauce",
    price: 1900,
    category: "Chicken",
  },
  {
    id: "fruit-half",
    name: "Fruit chaat · ½ liter",
    detail: "Fresh seasonal fruit · half liter",
    price: 800,
    category: "Fruit Chaat",
  },
  {
    id: "fruit-liter",
    name: "Fruit chaat · 1 liter",
    detail: "Fresh seasonal fruit · one liter",
    price: 1400,
    category: "Fruit Chaat",
  },
  {
    id: "cream-half",
    name: "Cream chaat · ½ liter",
    detail: "Fruit · cream · half liter",
    price: 1000,
    category: "Cream Chaat",
  },
  {
    id: "cream-liter",
    name: "Cream chaat · 1 liter",
    detail: "Fruit · cream · one liter",
    price: 1800,
    category: "Cream Chaat",
  },
  {
    id: "fries",
    name: "Seasoned fries",
    detail: "Crispy · house spice",
    price: 600,
    category: "Other",
  },
  {
    id: "lemonade",
    name: "Fresh lemonade",
    detail: "Still · sparkling",
    price: 500,
    category: "Other",
  },
];

export const iceCreamFlavors = [
  "Mango",
  "Chocolate",
  "Vanilla",
  "Strawberry",
  "Pistachio",
];

export const initialTables: {
  number: number;
  seats: number;
  status: TableStatus;
  order?: string;
  total?: number;
}[] = [
  { number: 1, seats: 2, status: "Dining", order: "#1048", total: 6200 },
  { number: 2, seats: 4, status: "Available" },
  { number: 3, seats: 2, status: "In kitchen", order: "#1049", total: 9100 },
  { number: 4, seats: 4, status: "Dining", order: "#1047", total: 11800 },
  { number: 5, seats: 6, status: "Available" },
  {
    number: 6,
    seats: 2,
    status: "Ready to serve",
    order: "#1046",
    total: 4800,
  },
  { number: 7, seats: 4, status: "Available" },
  { number: 8, seats: 2, status: "Dining", order: "#1045", total: 7400 },
];

export const initialTickets: KitchenTicket[] = [
  {
    id: "#1049",
    table: 3,
    guestCount: 3,
    waiter: "Leo",
    age: "2 min",
    status: "New",
    items: [
      { itemId: "fried-fish", name: "Fried fish", quantity: 1, price: 1800 },
      {
        itemId: "grilled-fish",
        name: "Grilled fish",
        quantity: 2,
        price: 2100,
      },
      { itemId: "lemonade", name: "Fresh lemonade", quantity: 2, price: 500 },
    ],
    note: "Grilled fish, no herbs",
  },
  {
    id: "#1048",
    table: 1,
    guestCount: 2,
    waiter: "Maya",
    age: "8 min",
    status: "Preparing",
    items: [
      { itemId: "chicken", name: "Fried chicken", quantity: 1, price: 1600 },
      { itemId: "fries", name: "Seasoned fries", quantity: 1, price: 600 },
      {
        itemId: "fruit-half",
        name: "Fruit chaat · ½ liter",
        quantity: 1,
        price: 800,
      },
    ],
  },
  {
    id: "#1046",
    table: 6,
    guestCount: 2,
    waiter: "Noah",
    age: "12 min",
    status: "Ready",
    items: [
      {
        itemId: "cream-liter",
        name: "Cream chaat · 1 liter",
        quantity: 1,
        price: 1800,
      },
      { itemId: "fried-fish", name: "Fried fish", quantity: 1, price: 1800 },
    ],
  },
];

export const salesSummary = {
  todaySales: 284000,
  todayOrders: 38,
  thisWeekOrders: 246,
  thisMonthSales: 3410000,
  lastMonthSales: 3020000,
  average: 7470,
  guests: "86",
};

export const weeklySales = [
  { day: "Mon", sales: 138000 },
  { day: "Tue", sales: 154000 },
  { day: "Wed", sales: 149000 },
  { day: "Thu", sales: 176000 },
  { day: "Fri", sales: 225000 },
  { day: "Sat", sales: 318000 },
  { day: "Sun", sales: 284000 },
];

export const monthlySales = [
  { month: "May", sales: 2400000 },
  { month: "Jun", sales: 2600000 },
  { month: "Jul", sales: 2750000 },
  { month: "Aug", sales: 2580000 },
  { month: "Sep", sales: 3020000 },
  { month: "Oct", sales: 3410000 },
];

export const currency = (amount: number) =>
  `PKR ${Math.round(amount).toLocaleString("en-PK")}`;
