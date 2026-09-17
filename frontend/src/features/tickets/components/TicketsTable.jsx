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



  const { tickets, total = 0, offsetResponse = 0, limit = 10, loading, error } = useTickets({ ...filters, offset: offsetPage });

  // 1. Cálculos correctos de paginación
  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.floor(offsetResponse / limit) + 1;

  // 2. Lógica para limitar a máximo 5 elementos visibles con elipsis
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

  return (
    <div className="py-4 bg-card rounded-lg my-4 border border-border shadow-md">
      <TicketsTableManager tickets={tickets} resume={false} />
      
      {loading && <p className="p-4 text-center">Cargando...</p>}
      {error && <p className="p-4 text-center text-destructive">Error al cargar los tickets</p>}

      {!loading && !error && (
        <Pagination className="mt-4">
          <PaginationContent>
            {/* Botón Anterior */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    setOffsetPage((currentPage - 2) * limit);
                    onPageChange?.(currentPage - 1);
                  }
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {/* Renderizado de Números y Elipsis */}
            {pages.map((page, index) => (
              <PaginationItem key={index}>
                {page === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setOffsetPage((page - 1) * limit);
                      onPageChange?.(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {/* Botón Siguiente */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) {
                    setOffsetPage(currentPage * limit);
                    onPageChange?.(currentPage + 1);
                  }
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}