import { useState } from "react";

import TicketsTableManager from "@/components/table/TicketsTableManager";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTickets } from "@/hooks/useTickets";

export default function TicketsTable({ filters, onPageChange }) {
  const [offsetPage, setOffsetPage] = useState(0);

  const { tickets, total = 0, offset = 0, limit = 10, loading, error } = useTickets({
    ...filters,
    offset: offsetPage,
  });

  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.min(Math.floor(offset / limit) + 1, totalPages);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 'ellipsis', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  };

  const pages = getPageNumbers();

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    setOffsetPage((page - 1) * limit);
    onPageChange?.(page);
  };

  return (
    <div className="py-4 bg-card rounded-lg my-4 border border-border shadow-md">
      <TicketsTableManager tickets={tickets} resume={false} />
      
      {loading && <p className="p-4 text-center">Cargando...</p>}
      {error && <p className="p-4 text-center text-destructive">Error al cargar los tickets</p>}

      {!loading && !error && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(currentPage - 1);
                }}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>

            {pages.map((page, index) => (
              <PaginationItem key={page === "ellipsis" ? `ellipsis-${index}` : page}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(currentPage + 1);
                }}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}