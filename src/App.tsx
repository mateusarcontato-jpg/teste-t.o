import React, { useState, useEffect, useMemo } from 'react';
import {
  Ticket,
  TicketStatus,
  TicketPriority,
  FilterState,
  ViewMode,
  User,
  UserRole,
} from './types';
import { INITIAL_TICKETS } from './data/initialTickets';
import { INITIAL_USERS } from './data/users';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { TicketFilters } from './components/TicketFilters';
import { TicketList } from './components/TicketList';
import { TicketKanban } from './components/TicketKanban';
import { TicketDetailModal } from './components/TicketDetailModal';
import { NewTicketModal } from './components/NewTicketModal';
import { UserPortal } from './components/UserPortal';
import { LoginScreen } from './components/LoginScreen';
import { UserApprovalsModal } from './components/UserApprovalsModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { RotateCcw, ArrowLeftRight, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'chamados_amilco_tickets_prod_v2';
const USERS_STORAGE_KEY = 'chamados_amilco_users_prod_v2';
const CURRENT_USER_KEY = 'chamados_amilco_current_user_prod_v2';

export default function App() {
  // 1. Registered Users State
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        // Ensure known accounts retain standardized passwords if missing
        return parsed.map((u) => {
          const defaultMatch = INITIAL_USERS.find((init) => init.id === u.id || init.username === u.username);
          if (defaultMatch && !u.password) {
            return { ...u, password: defaultMatch.password };
          }
          return u;
        });
      }
    } catch {}
    return INITIAL_USERS;
  });

  // Current Logged-in User (starts null so user sees the Red & Black login screen)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));
    } catch (e) {
      console.error(e);
    }
  }, [registeredUsers]);

  // 2. Tickets State (Virgin / Zeroed out)
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TICKETS; // Empty array []
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.error(e);
    }
  }, [tickets]);

  // 3. Filters & View State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'todos',
    priority: 'todos',
    category: 'todos',
    technician: 'todos',
    dateOption: 'todos',
    customDate: '',
    onlyMyTickets: false,
  });

  const [viewMode, setViewMode] = useState<ViewMode>('lista');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helpers
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Currently selected ticket
  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null;
    return tickets.find((t) => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  // Pending users count for Matheus T.I
  const pendingUsersCount = useMemo(() => {
    return registeredUsers.filter((u) => u.status === 'pendente').length;
  }, [registeredUsers]);

  // Filtered Tickets Memo with Date and Attendance filtering
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // 1. Status filter
      if (filters.status !== 'todos' && ticket.status !== filters.status) return false;

      // 2. Priority filter
      if (filters.priority !== 'todos' && ticket.priority !== filters.priority) return false;

      // 3. Category filter
      if (filters.category !== 'todos' && ticket.category !== filters.category) return false;

      // 4. Technician filter
      if (filters.technician !== 'todos') {
        if (filters.technician === 'nao_atribuido') {
          if (ticket.assignedTechnician) return false;
        } else if (ticket.assignedTechnician !== filters.technician) {
          return false;
        }
      }

      // 5. Date Filter logic (Hoje, Ontem, Últimos 7 dias, Data Específica)
      if (filters.dateOption && filters.dateOption !== 'todos') {
        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);

        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);

        const tCreated = ticket.createdAt ? ticket.createdAt.slice(0, 10) : '';
        const tUpdated = ticket.updatedAt ? ticket.updatedAt.slice(0, 10) : '';
        const tResolved = ticket.resolvedAt ? ticket.resolvedAt.slice(0, 10) : '';
        const historyDates = ticket.history.map((h) => (h.timestamp ? h.timestamp.slice(0, 10) : ''));

        if (filters.dateOption === 'hoje') {
          const isToday =
            tCreated === todayStr ||
            tUpdated === todayStr ||
            tResolved === todayStr ||
            historyDates.includes(todayStr);
          if (!isToday) return false;
        } else if (filters.dateOption === 'ontem') {
          const isYesterday =
            tCreated === yesterdayStr ||
            tUpdated === yesterdayStr ||
            tResolved === yesterdayStr ||
            historyDates.includes(yesterdayStr);
          if (!isYesterday) return false;
        } else if (filters.dateOption === 'ultimos_7_dias') {
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 7);
          const tTime = new Date(ticket.createdAt).getTime();
          if (tTime < sevenDaysAgo.getTime()) return false;
        } else if (filters.dateOption === 'personalizado' && filters.customDate) {
          const target = filters.customDate;
          const matchesCustom =
            tCreated === target ||
            tUpdated === target ||
            tResolved === target ||
            historyDates.includes(target);
          if (!matchesCustom) return false;
        }
      }

      // 6. Only My Tickets (Matheus T.I / current user attendances)
      if (filters.onlyMyTickets && currentUser) {
        const uName = currentUser.name.toLowerCase();
        const isAssigned =
          ticket.assignedTechnician?.toLowerCase().includes(uName) ||
          ticket.assignedTechnician?.toLowerCase().includes('matheus');
        const touchedInHistory = ticket.history.some(
          (h) =>
            h.author.toLowerCase().includes(uName) ||
            h.author.toLowerCase().includes('matheus')
        );

        if (!isAssigned && !touchedInHistory) return false;
      }

      // 7. Search query filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesId = ticket.id.toLowerCase().includes(query);
        const matchesTitle = ticket.title.toLowerCase().includes(query);
        const matchesDesc = ticket.description.toLowerCase().includes(query);
        const matchesReq = ticket.requesterName.toLowerCase().includes(query);
        const matchesEmail = ticket.requesterEmail.toLowerCase().includes(query);
        const matchesDept = ticket.department.toLowerCase().includes(query);
        const matchesAsset = ticket.assetTag ? ticket.assetTag.toLowerCase().includes(query) : false;
        const matchesTech = ticket.assignedTechnician
          ? ticket.assignedTechnician.toLowerCase().includes(query)
          : false;

        if (
          !matchesId &&
          !matchesTitle &&
          !matchesDesc &&
          !matchesReq &&
          !matchesEmail &&
          !matchesDept &&
          !matchesAsset &&
          !matchesTech
        ) {
          return false;
        }
      }

      return true;
    });
  }, [tickets, filters, currentUser]);

  const openCount = useMemo(() => {
    return tickets.filter((t) => t.status !== 'resolvido' && t.status !== 'cancelado').length;
  }, [tickets]);

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    addToast(`Bem-vindo(a), ${user.name}!`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedTicketId(null);
    addToast('Você saiu da sua conta.', 'info');
  };

  const handleRegisterUser = (newUser: User) => {
    setRegisteredUsers((prev) => [...prev, newUser]);
  };

  // User Approval Handlers for Admin Matheus T.I
  const handleApproveUser = (userId: string, role?: UserRole) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'aprovado',
            role: role || u.role,
          };
        }
        return u;
      })
    );
    addToast('Usuário aprovado com sucesso! Acesso liberado.', 'success');
  };

  const handleRejectUser = (userId: string) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== userId));
    addToast('Cadastro recusado/removido.', 'info');
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    addToast(`Perfil atualizado para ${newRole}.`, 'info');
  };

  const handleUpdateUserPassword = (userId: string, newPass: string) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: newPass } : u))
    );
    addToast('Senha atualizada com sucesso no banco de credenciais!', 'success');
  };

  const handleQuickSwitchRole = () => {
    if (!currentUser) return;
    const nextRole: UserRole = currentUser.role === 'solicitante' ? 'admin' : 'solicitante';
    const updated: User = {
      ...currentUser,
      role: nextRole,
    };
    setCurrentUser(updated);
    addToast(
      `Visão alternada para ${
        nextRole === 'solicitante' ? 'Solicitante (Painel Simples)' : 'Administrador / Técnico T.I'
      }.`,
      'info'
    );
  };

  // Ticket Operations
  const handleCreateTicket = (
    newTicketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'history'>
  ) => {
    const existingNumbers = tickets
      .map((t) => {
        const match = t.id.match(/TI-(\d+)/);
        return match ? parseInt(match[1], 10) : 1000;
      })
      .filter((n) => !isNaN(n));
    const nextNum = (existingNumbers.length ? Math.max(...existingNumbers) : 1000) + 1;
    const newId = `TI-${nextNum}`;

    const now = new Date().toISOString();
    const createdTicket: Ticket = {
      ...newTicketData,
      id: newId,
      createdAt: now,
      updatedAt: now,
      history: [
        {
          id: `hist-${Date.now()}`,
          timestamp: now,
          author: currentUser?.name || newTicketData.requesterName,
          role: 'sistema',
          text: 'Chamado aberto no sistema',
          type: 'mudanca_status',
        },
      ],
    };

    setTickets((prev) => [createdTicket, ...prev]);
    addToast(`Chamado ${newId} registrado com sucesso!`, 'success');
  };

  const handleUpdateStatus = (ticketId: string, newStatus: TicketStatus, note?: string) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;

        const isResolving = newStatus === 'resolvido';
        const isReopening = ticket.status === 'resolvido' && newStatus !== 'resolvido';

        const historyText = isResolving
          ? `Chamado marcado como RESOLVIDO${note ? `: ${note}` : ''}`
          : `Status alterado para: ${newStatus.replace('_', ' ').toUpperCase()}${note ? `: ${note}` : ''}`;

        const newHistory = [
          ...ticket.history,
          {
            id: `hist-${Date.now()}`,
            timestamp: now,
            author: currentUser?.name || 'Técnico de T.I',
            role: 'tecnico' as const,
            text: historyText,
            type: 'mudanca_status' as const,
          },
        ];

        return {
          ...ticket,
          status: newStatus,
          updatedAt: now,
          resolvedAt: isResolving ? now : isReopening ? undefined : ticket.resolvedAt,
          history: newHistory,
        };
      })
    );

    addToast(`Status do chamado atualizado com sucesso!`, 'info');
  };

  const handleUpdatePriority = (ticketId: string, newPriority: TicketPriority) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        return {
          ...ticket,
          priority: newPriority,
          updatedAt: now,
          history: [
            ...ticket.history,
            {
              id: `hist-${Date.now()}`,
              timestamp: now,
              author: currentUser?.name || 'Técnico de T.I',
              role: 'tecnico' as const,
              text: `Prioridade alterada para: ${newPriority.toUpperCase()}`,
              type: 'mudanca_status' as const,
            },
          ],
        };
      })
    );
    addToast(`Prioridade do chamado alterada para ${newPriority.toUpperCase()}.`, 'info');
  };

  const handleUpdateTechnician = (ticketId: string, technicianName: string) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        return {
          ...ticket,
          assignedTechnician: technicianName || undefined,
          updatedAt: now,
          history: [
            ...ticket.history,
            {
              id: `hist-${Date.now()}`,
              timestamp: now,
              author: currentUser?.name || 'Técnico de T.I',
              role: 'tecnico' as const,
              text: technicianName
                ? `Atribuído ao técnico: ${technicianName}`
                : 'Técnico desatribuído do chamado',
              type: 'atribuicao' as const,
            },
          ],
        };
      })
    );
    addToast(
      technicianName ? `Atribuído a ${technicianName}.` : 'Técnico desvinculado.',
      'info'
    );
  };

  const handleAddComment = (ticketId: string, commentText: string, isInternal: boolean = false) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        return {
          ...ticket,
          updatedAt: now,
          history: [
            ...ticket.history,
            {
              id: `hist-${Date.now()}`,
              timestamp: now,
              author: currentUser?.name || 'Matheus T.I',
              role: isInternal ? ('tecnico' as const) : ('solicitante' as const),
              text: isInternal ? `[Nota Interna]: ${commentText}` : commentText,
              type: 'comentario' as const,
            },
          ],
        };
      })
    );
    addToast(isInternal ? 'Nota interna salva.' : 'Mensagem adicionada ao histórico.', 'success');
  };

  const handleQuickResolve = (ticketId: string) => {
    handleUpdateStatus(ticketId, 'resolvido', 'Resolvido via ação rápida.');
  };

  const handleQuickAssignSelf = (ticketId: string) => {
    const techName = currentUser?.name || 'Matheus T.I';
    handleUpdateTechnician(ticketId, techName);
    handleUpdateStatus(ticketId, 'em_atendimento', `Atendimento iniciado por ${techName}.`);
  };

  const handleResetVirginSystem = () => {
    if (
      window.confirm(
        'Deseja limpar todos os chamados e manter o sistema 100% virgem e zerado para amanhã?'
      )
    ) {
      setTickets([]);
      localStorage.removeItem(STORAGE_KEY);
      addToast('Sistema zerado com sucesso! Nenhum chamado registrado.', 'success');
    }
  };

  // If no user is logged in, show the Red & Black login interface
  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        registeredUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  const isTechnician = currentUser.role === 'tecnico' || currentUser.role === 'admin';
  const isAdmin = currentUser.role === 'admin' || currentUser.username?.toUpperCase() === 'MATHEUS T.I';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Navbar with Amilco Logo and Admin Actions */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenNewTicket={() => setIsNewTicketOpen(true)}
        openCount={openCount}
        pendingUsersCount={pendingUsersCount}
        onOpenApprovals={() => setIsApprovalsOpen(true)}
      />

      {/* Role Switcher banner for Admin / Testing convenience */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-medium">Modo Atual:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                isAdmin
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : isTechnician
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isAdmin
                ? 'Administrador Geral (Matheus T.I)'
                : isTechnician
                ? 'Técnico de TI (Painel Completo)'
                : 'Solicitante (Painel Simplificado)'}
            </span>

            {pendingUsersCount > 0 && isAdmin && (
              <button
                onClick={() => setIsApprovalsOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded-full font-bold text-[10px] animate-pulse flex items-center gap-1"
              >
                <span>{pendingUsersCount} cadastro(s) aguardando sua aprovação</span>
              </button>
            )}
          </div>

          <button
            id="btn-switch-role-preview"
            type="button"
            onClick={handleQuickSwitchRole}
            className="inline-flex items-center gap-1.5 text-red-700 hover:text-red-900 font-semibold text-xs py-0.5 px-2 hover:bg-red-50 rounded transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Alternar para {isTechnician ? 'Visão do Solicitante' : 'Visão do Administrador TI'}</span>
          </button>
        </div>
      </div>

      {/* Main Container: Renders either Simplified User Portal OR Full Technician/Admin Desk */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!isTechnician ? (
          /* PAINEL SIMPLIFICADO DO SOLICITANTE */
          <UserPortal
            currentUser={currentUser}
            tickets={tickets}
            onSelectTicket={(t) => setSelectedTicketId(t.id)}
            onCreateTicket={handleCreateTicket}
          />
        ) : (
          /* PAINEL COMPLETO DO TÉCNICO / ADMINISTRADOR DE TI (SERVICE DESK) */
          <div className="space-y-6">
            <StatsBar
              tickets={tickets}
              currentStatusFilter={filters.status}
              onSelectStatusFilter={(status) => setFilters({ ...filters, status })}
            />

            <TicketFilters
              filters={filters}
              onChangeFilters={setFilters}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
              totalFiltered={filteredTickets.length}
              totalAll={tickets.length}
              currentUserName={currentUser.name}
            />

            {viewMode === 'lista' ? (
              <TicketList
                tickets={filteredTickets}
                onSelectTicket={(t) => setSelectedTicketId(t.id)}
                onQuickResolve={handleQuickResolve}
                onQuickAssignSelf={handleQuickAssignSelf}
              />
            ) : (
              <TicketKanban
                tickets={filteredTickets}
                onSelectTicket={(t) => setSelectedTicketId(t.id)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 uppercase">Central de Chamados Amilco T.I</span>
            <span>&bull;</span>
            <span>Amilco Home Center &bull; Atendimento ao Usuário & Suporte Técnico</span>
          </div>

          {isAdmin && (
            <button
              id="btn-reset-virgin-system"
              onClick={handleResetVirginSystem}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-red-600 transition-colors"
              title="Zerar todos os chamados e manter o sistema pronto para produção"
            >
              <Trash2 className="w-3 h-3" />
              <span>Manter / Zerar Chamados Testes</span>
            </button>
          )}
        </div>
      </footer>

      {/* Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicketId(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePriority={handleUpdatePriority}
        onUpdateTechnician={handleUpdateTechnician}
        onAddComment={handleAddComment}
      />

      {/* New Ticket Modal (for Technician Desk) */}
      <NewTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onCreateTicket={handleCreateTicket}
      />

      {/* User Approvals Modal for Matheus T.I */}
      <UserApprovalsModal
        isOpen={isApprovalsOpen}
        onClose={() => setIsApprovalsOpen(false)}
        users={registeredUsers}
        onApproveUser={handleApproveUser}
        onRejectUser={handleRejectUser}
        onUpdateUserRole={handleUpdateUserRole}
        onUpdateUserPassword={handleUpdateUserPassword}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
