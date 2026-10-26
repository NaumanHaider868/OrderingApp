export type TableStatus =
  | "Available"
  | "Dining"
  | "In kitchen"
  | "Ready to serve";
export type TicketStatus = "New" | "Preparing" | "Ready";
export type StaffRole = "admin" | "waiter" | "kitchen";

export const menuCategories = [
  "Breakfast",
  "Dinner",
  "Deals",
  "BBQ",
  "Kebabs",
  "Pakoray",
  "Samosa",
  "Naan",
  "Fries",
  "Ice Cream",
  "Fish",
  "Chicken",
  "Fruit Chaat",
  "Cream Chaat",
] as const;
export type MenuCategory = (typeof menuCategories)[number];

export type MenuOption = {
  id: string;
  label: string;
  price: number;
};

export type MenuItem = {
  id: string;
  name: string;
  detail: string;
  price: number;
  category: MenuCategory;
  options?: MenuOption[];
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
    id: "halwa-puri",
    name: "Halwa puri",
    detail: "Punjabi breakfast · halwa · chana · 2 puri",
    price: 650,
    category: "Breakfast",
  },
  {
    id: "chana",
    name: "Chana",
    detail: "Punjabi chickpeas · choose plate size and add egg or kofta",
    price: 100,
    category: "Breakfast",
    options: [
      { id: "half-plain", label: "Half plate · plain · PKR 100", price: 100 },
      { id: "full-plain", label: "Full plate · plain · PKR 180", price: 180 },
      { id: "half-egg", label: "Half plate · with egg · PKR 150", price: 150 },
      { id: "full-egg", label: "Full plate · with egg · PKR 250", price: 250 },
      {
        id: "half-kofta",
        label: "Half plate · with kofta · PKR 250",
        price: 250,
      },
      {
        id: "full-kofta",
        label: "Full plate · with kofta · PKR 450",
        price: 450,
      },
    ],
  },
  {
    id: "anda-paratha",
    name: "Anda paratha",
    detail: "Egg · flaky paratha · house chutney",
    price: 400,
    category: "Breakfast",
  },
  {
    id: "nihari",
    name: "Beef nihari",
    detail: "Slow-cooked beef · ginger · naan",
    price: 1100,
    category: "Breakfast",
  },
  {
    id: "chicken-karahi",
    name: "Chicken karahi",
    detail: "Punjabi tomato karahi · ginger · green chili",
    price: 1400,
    category: "Dinner",
    options: [
      { id: "half-kg", label: "½ kg · PKR 1,400", price: 1400 },
      { id: "1-kg", label: "1 kg · PKR 2,700", price: 2700 },
      { id: "2-kg", label: "2 kg · PKR 5,200", price: 5200 },
      { id: "3-kg", label: "3 kg · PKR 7,600", price: 7600 },
    ],
  },
  {
    id: "mutton-karahi",
    name: "Mutton karahi",
    detail: "Traditional karahi · ginger · fresh herbs",
    price: 2200,
    category: "Dinner",
    options: [
      { id: "half-kg", label: "½ kg · PKR 2,200", price: 2200 },
      { id: "1-kg", label: "1 kg · PKR 4,300", price: 4300 },
      { id: "2-kg", label: "2 kg · PKR 8,400", price: 8400 },
      { id: "3-kg", label: "3 kg · PKR 12,300", price: 12300 },
    ],
  },
  {
    id: "chicken-handi",
    name: "Chicken handi",
    detail: "Creamy handi · tomato · house spices",
    price: 1900,
    category: "Dinner",
  },
  {
    id: "daal-maash",
    name: "Daal maash",
    detail: "Punjabi-style lentils · fried garlic · naan",
    price: 850,
    category: "Dinner",
  },
  {
    id: "deal-single",
    name: "Single deal · chicken tikka, naan, fries",
    detail: "1 chicken tikka · 1 naan · fries",
    price: 1100,
    category: "Deals",
  },
  {
    id: "deal-family",
    name: "Family deal · chicken karahi, 4 naan",
    detail: "Chicken karahi · 4 naan",
    price: 3000,
    category: "Deals",
  },
  {
    id: "deal-bbq",
    name: "BBQ deal · 4 seekh kebab, 2 naan, raita",
    detail: "4 seekh kebab · 2 naan · raita",
    price: 1500,
    category: "Deals",
  },
  {
    id: "chicken-tikka",
    name: "Chicken tikka",
    detail: "Charcoal grilled · Punjabi masala · 1 piece",
    price: 650,
    category: "BBQ",
  },
  {
    id: "malai-boti",
    name: "Malai boti",
    detail: "Cream-marinated chicken · charcoal grilled",
    price: 1100,
    category: "BBQ",
  },
  {
    id: "seekh-kebab",
    name: "Seekh kebab",
    detail: "Spiced beef · charcoal grilled · 2 pieces",
    price: 100,
    category: "Kebabs",
    options: [
      { id: "one-piece", label: "1 piece · PKR 100", price: 100 },
      { id: "two-piece", label: "2 pieces · PKR 100", price: 100 },
    ],
  },
  {
    id: "chapli-kebab",
    name: "Chapli kebab",
    detail: "Peshawari-style beef · choose 1 or 2 pieces",
    price: 400,
    category: "Kebabs",
    options: [
      { id: "one-piece", label: "1 piece · PKR 400", price: 400 },
      { id: "two-piece", label: "2 pieces · PKR 750", price: 750 },
    ],
  },
  {
    id: "mixed-pakoray",
    name: "Mixed pakoray",
    detail: "Seasonal vegetables · gram flour · mint chutney",
    price: 450,
    category: "Pakoray",
  },
  {
    id: "onion-pakoray",
    name: "Onion pakoray",
    detail: "Crispy onion fritters · mint chutney",
    price: 400,
    category: "Pakoray",
  },
  {
    id: "chicken-samosa",
    name: "Chicken samosa",
    detail: "Spiced chicken filling · 2 pieces",
    price: 300,
    category: "Samosa",
  },
  {
    id: "aloo-samosa",
    name: "Aloo samosa",
    detail: "Potato and pea filling · 2 pieces",
    price: 240,
    category: "Samosa",
  },
  {
    id: "vegetable-samosa",
    name: "Vegetable samosa",
    detail: "Seasonal vegetables · 2 pieces",
    price: 240,
    category: "Samosa",
  },
  {
    id: "tandoori-naan",
    name: "Tandoori naan",
    detail: "Freshly baked in the tandoor",
    price: 100,
    category: "Naan",
  },
  {
    id: "garlic-naan",
    name: "Garlic naan",
    detail: "Tandoor-baked · garlic · butter",
    price: 180,
    category: "Naan",
  },
  {
    id: "aloo-paratha",
    name: "Aloo paratha",
    detail: "Potato-stuffed paratha · raita",
    price: 300,
    category: "Naan",
  },
  {
    id: "masala-fries",
    name: "Masala fries",
    detail: "Crispy fries · Pakistani spice mix",
    price: 450,
    category: "Fries",
  },
  {
    id: "loaded-fries",
    name: "Loaded fries",
    detail: "Fries · cheese · chicken · house sauce",
    price: 750,
    category: "Fries",
  },
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
