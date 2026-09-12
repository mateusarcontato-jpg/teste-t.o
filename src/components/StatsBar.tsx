import React from 'react';
import { Ticket, TicketStatus } from '../types';
import {
  Inbox,
  Clock,
  UserCheck,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface StatsBarProps {
  tickets: Ticket[];
  currentStatusFilter: TicketStatus | 'todos';
  onSelectStatusFilter: (status: TicketStatus | 'todos') => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  tickets,
  currentStatusFilter,
  onSelectStatusFilter,
}) => {
  const total = tickets.length;
  const abertos = tickets.filter((t) => t.status === 'aberto').length;
  const emAtendimento = tickets.filter((t) => t.status === 'em_atendimento').length;
  const aguardando = tickets.filter((t) => t.status === 'aguardando_usuario').length;
  const criticos = tickets.filter(
    (t) => t.priority === 'critica' && t.status !== 'resolvido' && t.status !== 'cancelado'
  ).length;
  const resolvidos = tickets.filter((t) => t.status === 'resolvido').length;

  const stats = [
    {
      id: 'stat-todos',
      label: 'Total de Chamados',
      count: total,
      icon: Inbox,
      filterValue: 'todos' as const,
      color: 'text-slate-700',
      activeBorder: currentStatusFilter === 'todos',
    },
    {
      id: 'stat-aberto',
      label: 'Abertos (Fila)',
      count: abertos,
      icon: Clock,
      filterValue: 'aberto' as const,
      color: 'text-amber-600',
      activeBorder: currentStatusFilter === 'aberto',
    },
    {
      id: 'stat-em-atendimento',
      label: 'Em Atendimento',
      count: emAtendimento,
      icon: UserCheck,
      filterValue: 'em_atendimento' as const,
      color: 'text-blue-600',
      activeBorder: currentStatusFilter === 'em_atendimento',
    },
    {
      id: 'stat-criticos',
      label: 'Críticos Pendentes',
      count: criticos,
      icon: AlertTriangle,
      filterValue: null,
      color: 'text-rose-600',
      badgeClass: criticos > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700',
      activeBorder: false,
    },
    {
      id: 'stat-resolvido',
      label: 'Resolvidos',
      count: resolvidos,
      icon: CheckCircle,
      filterValue: 'resolvido' as const,
      color: 'text-emerald-600',
      activeBorder: currentStatusFilter === 'resolvido',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((item) => {
        const Icon = item.icon;
        const isClickable = item.filterValue !== null;

        return (
          <button
            key={item.id}
            id={item.id}
            type="button"
            disabled={!isClickable}
            onClick={() => {
              if (item.filterValue !== null) {
                onSelectStatusFilter(item.filterValue);
              }
            }}
            className={`text-left p-3.5 rounded-xl border bg-white transition-all flex flex-col justify-between ${
              item.activeBorder
                ? 'border-blue-500 ring-2 ring-blue-100 shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-medium text-slate-500 leading-tight">
                {item.label}
              </span>
              <Icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {item.count}
              </span>
              {item.id === 'stat-criticos' && criticos > 0 && (
                <span className="text-[11px] font-semibold text-rose-600 animate-pulse">
                  Atenção
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
