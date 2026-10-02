import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const TicketFiltersContext = createContext(null);
const TicketPaginationContext = createContext(null);

export default function TicketListProvider({ initialFilters = {}, children }) {
  const [filters, setFilters] = useState(() => ({ ...initialFilters }));
  const [offset, setOffset] = useState(0);

  const onFilterChange = useCallback((key, value) => {
    setOffset(0);
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  }, []);

  const filtersValue = useMemo(
    () => ({ filters, onFilterChange }),
    [filters, onFilterChange],
  );
  const paginationValue = useMemo(
    () => ({ offset, setOffset }),
    [offset],
  );

  return (
    <TicketFiltersContext.Provider value={filtersValue}>
      <TicketPaginationContext.Provider value={paginationValue}>
        {children}
      </TicketPaginationContext.Provider>
    </TicketFiltersContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTicketFilters() {
  const context = useContext(TicketFiltersContext);
  if (!context) {
    throw new Error("useTicketFilters debe usarse dentro de TicketListProvider");
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTicketPagination() {
  const context = useContext(TicketPaginationContext);
  if (!context) {
    throw new Error("useTicketPagination debe usarse dentro de TicketListProvider");
  }
  return context;
}
