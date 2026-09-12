export type UserRole = 'solicitante' | 'tecnico' | 'admin';
export type UserStatus = 'aprovado' | 'pendente' | 'bloqueado';

export interface User {
  id: string;
  name: string;
  username: string;
  phone?: string;
  email?: string;
  department: string;
  role: UserRole;
  status: UserStatus;
  password?: string;
  createdAt?: string;
}

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
  requesterEmail?: string;
  requesterPhone?: string;
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

export type DateFilterOption =
  | 'todos'
  | 'hoje'
  | 'ontem'
  | 'ultimos_7_dias'
  | 'mes_atual'
  | 'personalizado';

export interface FilterState {
  search: string;
  status: TicketStatus | 'todos';
  priority: TicketPriority | 'todos';
  category: TicketCategory | 'todos';
  technician: string | 'todos';
  dateOption: DateFilterOption;
  customDate?: string;
  onlyMyTickets?: boolean;
}

