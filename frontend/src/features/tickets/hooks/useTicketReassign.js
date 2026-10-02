import { useEffect,useState } from "react";
import { toast } from "sonner";

import { getAgents, reassignTicket } from "@/features/tickets/services/ticketApi";

export function useTicketReassign(ticket, onRefresh) {
  const [isEditingAssignee, setIsEditingAssignee] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [submittingAssign, setSubmittingAssign] = useState(false);
  const [optimisticName, setOptimisticName] = useState(null);
  const assignedName = optimisticName !== null ? optimisticName : ticket?.assignedToName;

  useEffect(() => {
    if (!isEditingAssignee) return;
    const fetchAgents = async () => {
      try {
        setLoadingAgents(true);
        const data = await getAgents({
          search: agentSearch,
          area: ticket.category || "",
        });
        setAgents(data);
      } catch (error) {
        toast.error("Error al buscar empleados: " + error.message);
      } finally {
        setLoadingAgents(false);
      }
    };
    const debounceTimer = setTimeout(fetchAgents, 300);
    return () => clearTimeout(debounceTimer);
  }, [isEditingAssignee, agentSearch, ticket.category]);

  const handleReassign = async (agent) => {
    if (!agent?.id || submittingAssign) return;
    try {
      setSubmittingAssign(true);
      setOptimisticName(agent.name);
      await reassignTicket(ticket.id, agent.id);
      toast.success("Ticket reasignado con éxito");
      setIsEditingAssignee(false);
      if (onRefresh) await onRefresh();
      setOptimisticName(null);
    } catch (error) {
      setOptimisticName(null);
      toast.error("No se pudo reasignar: " + error.message);
    } finally {
      setSubmittingAssign(false);
    }
  };

  return {
    isEditingAssignee,
    setIsEditingAssignee,
    agentSearch,
    setAgentSearch,
    agents,
    loadingAgents,
    submittingAssign,
    assignedName,
    handleReassign,
  };
}