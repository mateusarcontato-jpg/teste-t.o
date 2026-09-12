export type TicketStatus =
  | 'aberto'
  | 'em_atendimento'
  | 'aguardando_usuario'
  | 'resolvido'
  | 'cancelado';

export type TicketPriority = 'baixa' | 'media' | 'alta' | 'critica';

export type TicketCategory =
  | 'hardware'
  | 'software'
  | 'rede'
  | 'acessos'
  | 'impressoras'
  | 'seguranca'
  | 'outros';

export interface TicketHistoryEntry {
  id: string;
  timestamp: string;
  author: string;
  role: 'solicitante' | 'tecnico' | 'sistema';
  text: string;
  type: 'comentario' | 'mudanca_status' | 'atribuicao';
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  department: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assetTag?: string;
  assignedTechnician?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  slaHours: number;
  history: TicketHistoryEntry[];
}

export type ViewMode = 'lista' | 'kanban';

export interface FilterState {
  search: string;
  status: TicketStatus | 'todos';
  priority: TicketPriority | 'todos';
  category: TicketCategory | 'todos';
  technician: string | 'todos';
}
