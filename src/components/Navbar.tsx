import React from 'react';
import {
  Plus,
  Activity,
  CheckCircle2,
  LogOut,
  User as UserIcon,
  Shield,
  ShieldCheck,
  Users,
  KeyRound,
} from 'lucide-react';
import { User } from '../types';
import { AmilcoLogo } from './AmilcoLogo';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
  onOpenNewTicket?: () => void;
  openCount?: number;
  pendingUsersCount?: number;
  onOpenApprovals?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onOpenNewTicket,
  openCount = 0,
  pendingUsersCount = 0,
  onOpenApprovals,
}) => {
  const isTechnician = currentUser.role === 'tecnico' || currentUser.role === 'admin';
  const isAdmin = currentUser.role === 'admin' || currentUser.username?.toUpperCase() === 'MATHEUS T.I';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3.5">
          {/* Official Amilco Store Logo */}
          <div className="flex items-center">
            <AmilcoLogo size="md" className="shrink-0" />
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight uppercase">
                Central de Chamados Amilco T.I
              </h1>
              <span
                className={`hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                  isAdmin
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : isTechnician
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {isAdmin ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-red-600" />
                    Administrador Matheus T.I
                  </>
                ) : isTechnician ? (
                  <>
                    <Shield className="w-3 h-3 text-rose-600" />
                    Service Desk TI
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Portal do Colaborador
                  </>
                )}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {isAdmin
                ? 'Administração Geral &bull; Controle de Chamados e Usuários Amilco Home Center'
                : isTechnician
                ? 'Painel Técnico &bull; Suporte de TI Amilco Home Center'
                : 'Central de Suporte &bull; Amilco Home Center'}
            </p>
          </div>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Approvals and Passwords button for T.I Members */}
          {isTechnician && onOpenApprovals && (
            <button
              id="btn-nav-passwords-bank"
              onClick={onOpenApprovals}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                pendingUsersCount > 0
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-zinc-900 hover:bg-black text-amber-300 hover:text-amber-200 border border-zinc-700'
              }`}
              title="Acessar Banco de Senhas, Usuários e Aprovações"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Banco de Senhas & Usuários</span>
              <span className="sm:hidden">Senhas</span>
              {pendingUsersCount > 0 && (
                <span className="bg-red-600 text-white px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ml-0.5">
                  {pendingUsersCount} pendente{pendingUsersCount > 1 ? 's' : ''}
                </span>
              )}
            </button>
          )}

          {isTechnician && openCount !== undefined && onOpenNewTicket && (
            <>
              <div className="hidden lg:flex items-center gap-3 text-xs text-slate-600 border-r border-slate-200 pr-3">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-red-600" />
                  <span>
                    Fila: <strong>{openCount} pendentes</strong>
                  </span>
                </div>
              </div>

              <button
                id="btn-open-new-ticket-nav"
                onClick={onOpenNewTicket}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Chamado</span>
              </button>
            </>
          )}

          {/* User Profile Capsule */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <span className="font-bold text-slate-900 block truncate max-w-[130px]">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-slate-500 block truncate max-w-[130px]">
                {currentUser.department}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            id="btn-logout"
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sair / Trocar de Conta"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
