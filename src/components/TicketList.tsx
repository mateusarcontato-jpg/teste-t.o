import React from 'react';
import { Ticket, TicketStatus } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '../data/initialTickets';
import { formatDateBr, getSlaRemaining } from '../utils/formatters';
import {
  User,
  Building,
  Clock,
  CheckCircle,
  ArrowRight,
  HardDrive,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onQuickResolve: (ticketId: string) => void;
  onQuickAssignSelf: (ticketId: string) => void;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  onSelectTicket,
  onQuickResolve,
  onQuickAssignSelf,
}) => {
  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          Nenhum chamado encontrado
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Não há chamados com os filtros atuais selecionados. Tente ajustar o termo de busca ou limpar os filtros para ver todos os registros.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {tickets.map((ticket) => {
        const priorityInfo = PRIORITY_LABELS[ticket.priority] || PRIORITY_LABELS.media;
        const statusInfo = STATUS_LABELS[ticket.status] || STATUS_LABELS.aberto;
        const categoryInfo = CATEGORY_LABELS[ticket.category] || CATEGORY_LABELS.outros;
        const slaInfo = getSlaRemaining(ticket.createdAt, ticket.slaHours, ticket.resolvedAt);

        return (
          <div
            key={ticket.id}
            id={`ticket-card-${ticket.id}`}
            className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-4 sm:p-5 flex flex-col gap-3 cursor-pointer"
            onClick={() => onSelectTicket(ticket)}
          >
            {/* Header row: ID, Priority, Category, Status, SLA */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {ticket.id}
                </span>

                {/* Priority Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${priorityInfo.badgeBg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.dotColor}`} />
                  {priorityInfo.label}
                </span>

                {/* Category Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 border border-slate-200">
                  <CategoryIcon category={ticket.category} className="w-3.5 h-3.5 text-slate-500" />
                  {categoryInfo.label}
                </span>

                {ticket.assetTag && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-blue-50 text-blue-700 border border-blue-200">
                    <HardDrive className="w-3 h-3" />
                    {ticket.assetTag}
                  </span>
                )}
              </div>

              {/* Status & SLA */}
              <div className="flex items-center gap-2">
                {/* SLA pill */}
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    slaInfo.isBreached
                      ? 'bg-rose-100 text-rose-800 font-semibold'
                      : slaInfo.isWarning
                      ? 'bg-amber-100 text-amber-800'
                      : 'text-slate-500 bg-slate-50'
                  }`}
                >
                  {slaInfo.text}
                </span>

                {/* Status pill */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.badgeBg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.color}`} />
                  {statusInfo.label}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                {ticket.title}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                {ticket.description}
              </p>
            </div>

            {/* Footer row: Requester, Department, Assigned Tech, Date and Quick Actions */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-4">
                {/* Requester */}
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">{ticket.requesterName}</span>
                </div>

                {/* Department */}
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ticket.department}</span>
                </div>

                {/* Technician */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Atribuído:</span>
                  <span
                    className={`font-medium ${
                      ticket.assignedTechnician ? 'text-slate-800' : 'text-amber-600 italic'
                    }`}
                  >
                    {ticket.assignedTechnician || 'Não Atribuído'}
                  </span>
                </div>

                {/* Interaction count */}
                {ticket.history.length > 0 && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{ticket.history.length}</span>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Aberto {formatDateBr(ticket.createdAt)}</span>
                </div>
              </div>

              {/* Quick actions on card */}
              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()} // Prevent card modal trigger
              >
                {!ticket.assignedTechnician && ticket.status !== 'resolvido' && (
                  <button
                    type="button"
                    onClick={() => onQuickAssignSelf(ticket.id)}
                    className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
                  >
                    Assumir Chamado
                  </button>
                )}

                {ticket.status !== 'resolvido' && ticket.status !== 'cancelado' && (
                  <button
                    type="button"
                    onClick={() => onQuickResolve(ticket.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Resolver
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onSelectTicket(ticket)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                >
                  <span>Detalhes</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
