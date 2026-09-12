import React from 'react';
import { Ticket, TicketStatus } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { PRIORITY_LABELS, STATUS_LABELS } from '../data/initialTickets';
import { formatDateBr } from '../utils/formatters';
import { ArrowRight, ChevronRight, User } from 'lucide-react';

interface TicketKanbanProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onUpdateStatus: (ticketId: string, nextStatus: TicketStatus) => void;
}

const KANBAN_COLUMNS: {
  status: TicketStatus;
  title: string;
  dotColor: string;
  nextStatus?: TicketStatus;
  nextLabel?: string;
}[] = [
  {
    status: 'aberto',
    title: 'Aberto (Fila)',
    dotColor: 'bg-amber-500',
    nextStatus: 'em_atendimento',
    nextLabel: 'Iniciar Atendimento',
  },
  {
    status: 'em_atendimento',
    title: 'Em Atendimento',
    dotColor: 'bg-blue-600',
    nextStatus: 'resolvido',
    nextLabel: 'Resolver',
  },
  {
    status: 'aguardando_usuario',
    title: 'Aguardando Usuário',
    dotColor: 'bg-purple-600',
    nextStatus: 'em_atendimento',
    nextLabel: 'Retomar',
  },
  {
    status: 'resolvido',
    title: 'Resolvidos',
    dotColor: 'bg-emerald-600',
  },
];

export const TicketKanban: React.FC<TicketKanbanProps> = ({
  tickets,
  onSelectTicket,
  onUpdateStatus,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {KANBAN_COLUMNS.map((col) => {
        const columnTickets = tickets.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className="bg-slate-100/80 rounded-xl border border-slate-200/80 p-3.5 flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <h3 className="font-semibold text-sm text-slate-800">{col.title}</h3>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                {columnTickets.length}
              </span>
            </div>

            {/* Ticket Cards */}
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[70vh] pr-0.5">
              {columnTickets.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-lg">
                  Nenhum chamado nesta etapa
                </div>
              ) : (
                columnTickets.map((ticket) => {
                  const priorityInfo =
                    PRIORITY_LABELS[ticket.priority] || PRIORITY_LABELS.media;

                  return (
                    <div
                      key={ticket.id}
                      onClick={() => onSelectTicket(ticket)}
                      className="bg-white rounded-lg p-3.5 border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col gap-2"
                    >
                      {/* Top info */}
                      <div className="flex items-center justify-between gap-1 text-xs">
                        <span className="font-mono font-bold text-slate-800 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                          {ticket.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border ${priorityInfo.badgeBg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.dotColor}`} />
                          {priorityInfo.label}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {ticket.title}
                      </h4>

                      {/* Requester & Category */}
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-1 truncate max-w-[130px]">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{ticket.requesterName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <CategoryIcon
                            category={ticket.category}
                            className="w-3 h-3 text-slate-400"
                          />
                          <span className="text-[11px]">{ticket.department}</span>
                        </div>
                      </div>

                      {/* Footer & advance button */}
                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                        <span>{formatDateBr(ticket.createdAt)}</span>

                        {col.nextStatus && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateStatus(ticket.id, col.nextStatus!);
                            }}
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors font-medium"
                            title={col.nextLabel}
                          >
                            <span>{col.nextLabel}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
