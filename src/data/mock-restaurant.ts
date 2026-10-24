export type TableStatus = 'Available' | 'Dining' | 'In kitchen' | 'Ready to serve';
export type TicketStatus = 'New' | 'Preparing' | 'Ready';

export type MenuItem = {
  id: string;
  name: string;
  detail: string;
  price: number;
  category: 'Small plates' | 'Mains' | 'Drinks';
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
  { id: 'olives', name: 'Marinated olives', detail: 'Citrus · herbs', price: 8, category: 'Small plates' },
  { id: 'burrata', name: 'Whipped burrata', detail: 'Heirloom tomato · basil', price: 16, category: 'Small plates' },
  { id: 'carrots', name: 'Charred carrots', detail: 'Labneh · pistachio', price: 14, category: 'Small plates' },
  { id: 'chicken', name: 'Roast half chicken', detail: 'Lemon jus · potatoes', price: 29, category: 'Mains' },
  { id: 'salmon', name: 'Crispy-skin salmon', detail: 'Spring greens · dill', price: 31, category: 'Mains' },
  { id: 'pasta', name: 'Wild mushroom orzo', detail: 'Parmesan · thyme', price: 25, category: 'Mains' },
  { id: 'lemonade', name: 'House lemonade', detail: 'Still · sparkling', price: 6, category: 'Drinks' },
  { id: 'wine', name: 'House red · glass', detail: 'Tempranillo · Rioja', price: 14, category: 'Drinks' },
];

export const initialTables: { number: number; seats: number; status: TableStatus; order?: string; total?: number }[] = [
  { number: 1, seats: 2, status: 'Dining', order: '#1048', total: 62 },
  { number: 2, seats: 4, status: 'Available' },
  { number: 3, seats: 2, status: 'In kitchen', order: '#1049', total: 91 },
  { number: 4, seats: 4, status: 'Dining', order: '#1047', total: 118 },
  { number: 5, seats: 6, status: 'Available' },
  { number: 6, seats: 2, status: 'Ready to serve', order: '#1046', total: 48 },
  { number: 7, seats: 4, status: 'Available' },
  { number: 8, seats: 2, status: 'Dining', order: '#1045', total: 74 },
];

export const initialTickets: KitchenTicket[] = [
  {
    id: '#1049', table: 3, guestCount: 3, waiter: 'Leo', age: '2 min', status: 'New',
    items: [
      { itemId: 'burrata', name: 'Whipped burrata', quantity: 1, price: 16 },
      { itemId: 'salmon', name: 'Crispy-skin salmon', quantity: 2, price: 31 },
      { itemId: 'lemonade', name: 'House lemonade', quantity: 2, price: 6 },
    ], note: 'One salmon, no dill',
  },
  {
    id: '#1048', table: 1, guestCount: 2, waiter: 'Maya', age: '8 min', status: 'Preparing',
    items: [
      { itemId: 'olives', name: 'Marinated olives', quantity: 1, price: 8 },
      { itemId: 'chicken', name: 'Roast half chicken', quantity: 1, price: 29 },
      { itemId: 'pasta', name: 'Wild mushroom orzo', quantity: 1, price: 25 },
    ],
  },
  {
    id: '#1046', table: 6, guestCount: 2, waiter: 'Noah', age: '12 min', status: 'Ready',
    items: [
      { itemId: 'carrots', name: 'Charred carrots', quantity: 1, price: 14 },
      { itemId: 'salmon', name: 'Crispy-skin salmon', quantity: 1, price: 31 },
    ],
  },
];

export const salesSummary = {
  sales: '$2,840',
  salesChange: '+12.8%',
  orders: '38',
  average: '$74.70',
  guests: '86',
};

export const currency = (amount: number) => `$${amount.toFixed(2)}`;