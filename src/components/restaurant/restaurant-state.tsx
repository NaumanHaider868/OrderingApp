import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

import { initialTables, initialTickets, salesSummary } from '@/data/mock-restaurant';

const RestaurantStateContext = createContext<{
  tables: typeof initialTables;
  setTables: Dispatch<SetStateAction<typeof initialTables>>;
  tickets: typeof initialTickets;
  setTickets: Dispatch<SetStateAction<typeof initialTickets>>;
  summary: typeof salesSummary;
  setSummary: Dispatch<SetStateAction<typeof salesSummary>>;
} | null>(null);

export function RestaurantStateProvider({ children }: { children: React.ReactNode }) {
  const [tables, setTables] = useState(initialTables);
  const [tickets, setTickets] = useState(initialTickets);
  const [summary, setSummary] = useState(salesSummary);

  return (
    <RestaurantStateContext.Provider value={{ tables, setTables, tickets, setTickets, summary, setSummary }}>
      {children}
    </RestaurantStateContext.Provider>
  );
}

export function useRestaurantState() {
  const context = useContext(RestaurantStateContext);
  if (!context) throw new Error('RestaurantStateProvider is missing from the app layout.');
  return context;
}