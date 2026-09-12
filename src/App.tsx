/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Ticket,
  FilterState,
  TicketStatus,
  TicketPriority,
  ViewMode,
} from './types';
import { INITIAL_TICKETS, INITIAL_TECHNICIANS } from './data/initialTickets';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { TicketFilters } from './components/TicketFilters';
import { TicketList } from './components/TicketList';
import { TicketKanban } from './components/TicketKanban';
import { TicketDetailModal } from './components/TicketDetailModal';
import { NewTicketModal } from './components/NewTicketModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'chamados_ti_tickets_v1';

export default function App() {
  // 1. Tickets State
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_TICKETS;
  });

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.error('Falha ao salvar chamados no localStorage', e);
    }
  }, [tickets]);

  // 2. Filters & View State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'todos',
    priority: 'todos',
    category: 'todos',
    technician: 'todos',
  });

  const [viewMode, setViewMode] = useState<ViewMode>('lista');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Helpers for Toast notifications
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Currently selected ticket (reactive to updates in `tickets`)
  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null;
    return tickets.find((t) => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  // 3. Filtered Tickets Memo
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status filter
      if (filters.status !== 'todos' && ticket.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority !== 'todos' && ticket.priority !== filters.priority) {
        return false;
      }

      // Category filter
      if (filters.category !== 'todos' && ticket.category !== filters.category) {
        return false;
      }

      // Technician filter
      if (filters.technician !== 'todos') {
        if (filters.technician === 'nao_atribuido') {
          if (ticket.assignedTechnician) return false;
        } else if (ticket.assignedTechnician !== filters.technician) {
          return false;
        }
      }

      // Text search
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
  }, [tickets, filters]);

  // Active open tickets count
  const openCount = useMemo(() => {
    return tickets.filter((t) => t.status !== 'resolvido' && t.status !== 'cancelado').length;
  }, [tickets]);

  // 4. Action Handlers
  const handleCreateTicket = (
    newTicketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'history'>
  ) => {
    // Generate new ID (e.g. TI-1043)
    const existingNumbers = tickets
      .map((t) => {
        const match = t.id.match(/TI-(\d+)/);
        return match ? parseInt(match[1], 10) : 1000;
      })
      .filter((n) => !isNaN(n));
    const nextNum = (existingNumbers.length ? Math.max(...existingNumbers) : 1042) + 1;
    const newId = `TI-${nextNum}`;

    const now = new Date().toISOString();
    const createdTicket: Ticket = {
      ...newTicketData,
      id: newId,
      createdAt: now,
      updatedAt: now,
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: now,
          author: newTicketData.requesterName,
          role: 'solicitante',
          text: `Chamado registrado na central com prioridade ${newTicketData.priority.toUpperCase()}. Aguardando triagem pela equipe de TI.`,
          type: 'comentario',
        },
      ],
    };

    setTickets((prev) => [createdTicket, ...prev]);
    addToast(`Chamado ${newId} criado com sucesso!`, 'success');
  };

  const handleUpdateStatus = (ticketId: string, nextStatus: TicketStatus) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        const isNowResolved = nextStatus === 'resolvido';
        const historyEntry = {
          id: `h-${Date.now()}`,
          timestamp: now,
          author: 'Sistema Helpdesk',
          role: 'sistema' as const,
          text: `Status alterado de "${t.status.replace('_', ' ')}" para "${nextStatus.replace(
            '_',
            ' '
          )}".`,
          type: 'mudanca_status' as const,
        };

        return {
          ...t,
          status: nextStatus,
          updatedAt: now,
          resolvedAt: isNowResolved ? now : undefined,
          history: [historyEntry, ...t.history],
        };
      })
    );

    addToast(`Status do chamado ${ticketId} atualizado para ${nextStatus.replace('_', ' ')}.`, 'info');
  };

  const handleUpdatePriority = (ticketId: string, priority: TicketPriority) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          priority,
          updatedAt: now,
          history: [
            {
              id: `h-${Date.now()}`,
              timestamp: now,
              author: 'Equipe de TI',
              role: 'sistema',
              text: `Prioridade ajustada para ${priority.toUpperCase()}.`,
              type: 'mudanca_status',
            },
            ...t.history,
          ],
        };
      })
    );
    addToast(`Prioridade do chamado ${ticketId} ajustada para ${priority}.`, 'info');
  };

  const handleUpdateTechnician = (ticketId: string, technician: string | undefined) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          assignedTechnician: technician,
          // If was 'aberto' and assigned, auto change to 'em_atendimento'
          status: t.status === 'aberto' && technician ? 'em_atendimento' : t.status,
          updatedAt: now,
          history: [
            {
              id: `h-${Date.now()}`,
              timestamp: now,
              author: 'Coordenação de Suporte',
              role: 'sistema',
              text: technician
                ? `Chamado atribuído para o técnico ${technician}.`
                : 'Atribuição técnica removida.',
              type: 'atribuicao',
            },
            ...t.history,
          ],
        };
      })
    );
    addToast(
      technician
        ? `Chamado atribuído a ${technician}.`
        : `Atribuição removida do chamado ${ticketId}.`,
      'info'
    );
  };

  const handleAddComment = (
    ticketId: string,
    text: string,
    role: 'tecnico' | 'solicitante',
    author: string
  ) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          updatedAt: now,
          history: [
            {
              id: `h-${Date.now()}`,
              timestamp: now,
              author,
              role,
              text,
              type: 'comentario',
            },
            ...t.history,
          ],
        };
      })
    );
    addToast('Mensagem adicionada ao histórico!', 'success');
  };

  const handleQuickResolve = (ticketId: string) => {
    handleUpdateStatus(ticketId, 'resolvido');
  };

  const handleQuickAssignSelf = (ticketId: string) => {
    handleUpdateTechnician(ticketId, INITIAL_TECHNICIANS[0]);
  };

  const handleResetSampleData = () => {
    if (window.confirm('Deseja restaurar os chamados de exemplo do sistema?')) {
      setTickets(INITIAL_TICKETS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      addToast('Dados restaurados para o padrão de demonstração.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar onOpenNewTicket={() => setIsNewTicketOpen(true)} openCount={openCount} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 1. Quick Stats Overview */}
        <StatsBar
          tickets={tickets}
          currentStatusFilter={filters.status}
          onSelectStatusFilter={(status) => setFilters({ ...filters, status })}
        />

        {/* 2. Filter & Control Toolbar */}
        <TicketFilters
          filters={filters}
          onChangeFilters={setFilters}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          totalFiltered={filteredTickets.length}
          totalAll={tickets.length}
        />

        {/* 3. Tickets Workspace (List or Kanban) */}
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            Central de Chamados T.I &bull; Suporte Técnico & Gestão de Incidentes
          </span>
          <button
            id="btn-reset-demo-data"
            onClick={handleResetSampleData}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restaurar dados de exemplo</span>
          </button>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicketId(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePriority={handleUpdatePriority}
        onUpdateTechnician={handleUpdateTechnician}
        onAddComment={handleAddComment}
      />

      <NewTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onCreateTicket={handleCreateTicket}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
