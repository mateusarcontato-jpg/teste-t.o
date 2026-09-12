import React from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutList,
  KanbanSquare,
  Sparkles,
  Calendar,
  UserCheck,
} from 'lucide-react';
import { FilterState, TicketCategory, TicketPriority, TicketStatus, ViewMode, DateFilterOption } from '../types';
import { CATEGORY_LABELS, INITIAL_TECHNICIANS, PRIORITY_LABELS, STATUS_LABELS } from '../data/initialTickets';

interface TicketFiltersProps {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  totalFiltered: number;
  totalAll: number;
  currentUserName?: string;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  filters,
  onChangeFilters,
  viewMode,
  onChangeViewMode,
  totalFiltered,
  totalAll,
  currentUserName,
}) => {
  const isFiltered =
    filters.search.trim() !== '' ||
    filters.status !== 'todos' ||
    filters.priority !== 'todos' ||
    filters.category !== 'todos' ||
    filters.technician !== 'todos' ||
    filters.dateOption !== 'todos' ||
    filters.onlyMyTickets;

  const handleClear = () => {
    onChangeFilters({
      search: '',
      status: 'todos',
      priority: 'todos',
      category: 'todos',
      technician: 'todos',
      dateOption: 'todos',
      customDate: '',
      onlyMyTickets: false,
    });
  };

  const statusList: { key: TicketStatus | 'todos'; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'aberto', label: 'Abertos' },
    { key: 'em_atendimento', label: 'Em Atendimento' },
    { key: 'aguardando_usuario', label: 'Aguardando' },
    { key: 'resolvido', label: 'Resolvidos' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
      {/* Top row: Search, View Switcher & Quick Date Shortcut */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="input-search-tickets"
            type="text"
            placeholder="Buscar por ID, título, solicitante, setor, patrimônio ou técnico..."
            value={filters.search}
            onChange={(e) => onChangeFilters({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onChangeFilters({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 self-start md:self-auto">
          <button
            id="btn-view-lista"
            type="button"
            onClick={() => onChangeViewMode('lista')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'lista'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Lista</span>
          </button>
          <button
            id="btn-view-kanban"
            type="button"
            onClick={() => onChangeViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'kanban'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KanbanSquare className="w-3.5 h-3.5" />
            <span>Quadro Kanban</span>
          </button>
        </div>
      </div>

      {/* Date Filter & "Meus Atendimentos de Hoje" Row */}
      <div className="bg-red-50/50 border border-red-100 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-950 shrink-0">
            <Calendar className="w-4 h-4 text-red-600" />
            <span>Filtro por Data:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {[
              { id: 'todos', label: 'Todas as Datas' },
              { id: 'hoje', label: 'Hoje' },
              { id: 'ontem', label: 'Ontem' },
              { id: 'ultimos_7_dias', label: 'Últimos 7 dias' },
              { id: 'personalizado', label: 'Escolher Data...' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  onChangeFilters({
                    ...filters,
                    dateOption: opt.id as DateFilterOption,
                  })
                }
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  filters.dateOption === opt.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-red-100/60 border border-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {filters.dateOption === 'personalizado' && (
            <input
              type="date"
              value={filters.customDate || ''}
              onChange={(e) =>
                onChangeFilters({
                  ...filters,
                  customDate: e.target.value,
                })
              }
              className="px-2 py-1 bg-white border border-red-300 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          )}
        </div>

        {/* Quick action for Matheus T.I: "Meus Atendimentos de Hoje" */}
        <button
          type="button"
          onClick={() => {
            const isCurrentlyActive = filters.dateOption === 'hoje' && filters.onlyMyTickets;
            if (isCurrentlyActive) {
              onChangeFilters({
                ...filters,
                dateOption: 'todos',
                onlyMyTickets: false,
              });
            } else {
              onChangeFilters({
                ...filters,
                dateOption: 'hoje',
                onlyMyTickets: true,
              });
            }
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs ${
            filters.dateOption === 'hoje' && filters.onlyMyTickets
              ? 'bg-red-600 text-white ring-2 ring-red-300'
              : 'bg-white hover:bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Meus Atendimentos de Hoje</span>
        </button>
      </div>

      {/* Bottom row: Status Pills & Category / Tech Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {statusList.map((item) => {
            const isSelected = filters.status === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onChangeFilters({ ...filters, status: item.key })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Categoria */}
          <select
            id="select-category-filter"
            value={filters.category}
            aria-label="Filtrar por Categoria"
            onChange={(e) =>
              onChangeFilters({ ...filters, category: e.target.value as TicketCategory | 'todos' })
            }
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="todos">Todas Categorias</option>
            {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>

          {/* Prioridade */}
          <select
            id="select-priority-filter"
            value={filters.priority}
            aria-label="Filtrar por Prioridade"
            onChange={(e) =>
              onChangeFilters({ ...filters, priority: e.target.value as TicketPriority | 'todos' })
            }
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="todos">Todas Prioridades</option>
            {Object.entries(PRIORITY_LABELS).map(([key, val]) => (
              <option key={key} value={key}>
                Prioridade: {val.label}
              </option>
            ))}
          </select>

          {/* Técnico */}
          <select
            id="select-tech-filter"
            value={filters.technician}
            aria-label="Filtrar por Técnico Responsável"
            onChange={(e) => onChangeFilters({ ...filters, technician: e.target.value })}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="todos">Todos Técnicos</option>
            <option value="nao_atribuido">Não Atribuídos</option>
            {INITIAL_TECHNICIANS.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>

          {/* Clear Button */}
          {isFiltered && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
            >
              <X className="w-3 h-3" />
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Info indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>
          Mostrando <strong>{totalFiltered}</strong> de <strong>{totalAll}</strong> chamados
        </span>
        {isFiltered && (
          <span className="text-red-600 font-semibold text-[11px] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Filtros ativos aplicados
            {filters.dateOption !== 'todos' && ` (Data: ${filters.dateOption})`}
            {filters.onlyMyTickets && ' (Apenas Meus Atendimentos)'}
          </span>
        )}
      </div>
    </div>
  );
};
