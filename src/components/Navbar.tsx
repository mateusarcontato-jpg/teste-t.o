import React from 'react';
import { Headphones, Plus, Activity, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  onOpenNewTicket: () => void;
  openCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewTicket, openCount }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
            <Headphones className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-lg tracking-tight">
                Chamados de T.I
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Service Desk Ativo
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Suporte Técnico, Infraestrutura e Gestão de Incidentes
            </p>
          </div>
        </div>

        {/* Operational Status & Action */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-600 border-r border-slate-200 pr-4">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>
                Fila em andamento: <strong>{openCount} pendentes</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                SLA Médio: <strong>98.4%</strong>
              </span>
            </div>
          </div>

          <button
            id="btn-open-new-ticket"
            onClick={onOpenNewTicket}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Chamado</span>
          </button>
        </div>
      </div>
    </header>
  );
};
