import React from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutList,
  KanbanSquare,
  Sparkles,
} from 'lucide-react';
import { FilterState, TicketCategory, TicketPriority, TicketStatus, ViewMode } from '../types';
import { CATEGORY_LABELS, INITIAL_TECHNICIANS, PRIORITY_LABELS, STATUS_LABELS } from '../data/initialTickets';

interface TicketFiltersProps {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  totalFiltered: number;
  totalAll: number;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  filters,
  onChangeFilters,
  viewMode,
  onChangeViewMode,
  totalFiltered,
  totalAll,
}) => {
  const isFiltered =
    filters.search.trim() !== '' ||
    filters.status !== 'todos' ||
    filters.priority !== 'todos' ||
    filters.category !== 'todos' ||
    filters.technician !== 'todos';

  const handleClear = () => {
    onChangeFilters({
      search: '',
      status: 'todos',
      priority: 'todos',
      category: 'todos',
      technician: 'todos',
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
      {/* Top row: Search, View Switcher & Status quick tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="input-search-tickets"
            type="text"
            placeholder="Buscar por ID (ex: TI-1042), título, solicitante, setor ou patrimônio..."
            value={filters.search}
            onChange={(e) => onChangeFilters({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
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

      {/* Bottom row: Filters Pills & Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
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
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 hover:bg-rose-50 rounded transition-colors"
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
          <span className="text-blue-600 font-medium text-[11px]">
            Filtros ativos aplicados
          </span>
        )}
      </div>
    </div>
  );
};
