import { createStore } from "jotai";
import { createContext, useMemo } from "react";

export const EventRegistrationStoreContext = createContext<ReturnType<typeof createStore> | null>(null);

export const EventRegistrationStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useMemo(() => createStore(), []);

  return (
    <EventRegistrationStoreContext.Provider value={store}>
      {children}
    </EventRegistrationStoreContext.Provider>
  );
};
