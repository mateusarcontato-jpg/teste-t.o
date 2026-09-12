import React, { useState } from 'react';
import { User, UserRole } from '../types';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  UserCheck,
  UserX,
  Building,
  Phone,
  Search,
  X,
  AlertTriangle,
  BadgeCheck,
  KeyRound,
  Eye,
  EyeOff,
  Edit2,
  Check,
} from 'lucide-react';

interface UserApprovalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onApproveUser: (userId: string, role?: UserRole) => void;
  onRejectUser: (userId: string) => void;
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onUpdateUserPassword?: (userId: string, newPassword: string) => void;
}

export const UserApprovalsModal: React.FC<UserApprovalsModalProps> = ({
  isOpen,
  onClose,
  users,
  onApproveUser,
  onRejectUser,
  onUpdateUserRole,
  onUpdateUserPassword,
}) => {
  const [activeTab, setActiveTab] = useState<'pendentes' | 'aprovados'>(
    users.some((u) => u.status === 'pendente') ? 'pendentes' : 'aprovados'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [editingPasswordUserId, setEditingPasswordUserId] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  if (!isOpen) return null;

  const toggleShowPassword = (userId: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleStartEditPassword = (user: User) => {
    setEditingPasswordUserId(user.id);
    setNewPasswordInput(user.password || 'amilco123');
  };

  const handleSavePassword = (userId: string) => {
    if (!newPasswordInput.trim()) return;
    if (onUpdateUserPassword) {
      onUpdateUserPassword(userId, newPasswordInput.trim());
    }
    setEditingPasswordUserId(null);
  };


  if (!isOpen) return null;

  const pendingUsers = users.filter((u) => u.status === 'pendente');
  const approvedUsers = users.filter((u) => u.status === 'aprovado');

  const filteredPending = pendingUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm)) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApproved = approvedUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm)) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-zinc-950 via-slate-900 to-red-950 text-white px-6 py-5 flex items-center justify-between border-b border-red-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
              <KeyRound className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  Banco de Senhas & Controle de Usuários
                </h2>
                {pendingUsers.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                    {pendingUsers.length} pendente{pendingUsers.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-300">
                Amilco T.I &bull; Consulta de senhas, redefinição de acessos e aprovação de membros
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher & Search */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('aprovados')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'aprovados'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>Banco de Senhas ({approvedUsers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('pendentes')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'pendentes'
                  ? 'bg-white text-red-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pendentes de Aprovação ({pendingUsers.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar colaborador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'pendentes' ? (
            filteredPending.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">Tudo em dia!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Não há novos cadastros pendentes de aprovação no momento. Novos cadastros realizados aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Aprovação necessária:</span> Os colaboradores abaixo fizeram o cadastro e só conseguirão acessar os chamados após o seu clique de aprovação.
                  </div>
                </div>

                {filteredPending.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{user.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-900 border-purple-300'
                              : user.role === 'tecnico'
                              ? 'bg-rose-100 text-rose-900 border-rose-300'
                              : 'bg-blue-100 text-blue-900 border-blue-300'
                          }`}
                        >
                          Solicitou Acesso: {user.role === 'admin' ? 'Administrador' : user.role === 'tecnico' ? 'Técnico de Suporte T.I' : 'Usuário Comum'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <strong>Login/Telefone:</strong> {user.username || user.phone}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          {user.department}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          <KeyRound className="w-3 h-3 text-amber-500" />
                          <span>Senha: {visiblePasswords[user.id] ? user.password : '••••••'}</span>
                          <button
                            type="button"
                            onClick={() => toggleShowPassword(user.id)}
                            className="text-slate-400 hover:text-slate-600 ml-1"
                            title="Ver senha"
                          >
                            {visiblePasswords[user.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </span>
                        {user.createdAt && (
                          <>
                            <span>&bull;</span>
                            <span>Cadastrado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onApproveUser(user.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aprovar Acesso</span>
                      </button>
                      <button
                        onClick={() => onRejectUser(user.id)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
                      >
                        Recusar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Approved Users List */
            <div className="space-y-3">
              {filteredApproved.map((user) => (
                <div
                  key={user.id}
                  className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{user.name}</span>
                      {user.username === 'MATHEUS T.I' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white">
                          ADM PRINCIPAL
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          user.role === 'admin'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : user.role === 'tecnico'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {user.role === 'admin'
                          ? 'Administrador'
                          : user.role === 'tecnico'
                          ? 'Técnico T.I'
                          : 'Solicitante'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                      <span>
                        <strong>Login:</strong> {user.username || user.phone}
                      </span>
                      <span>&bull;</span>
                      <span>{user.department}</span>
                      <span>&bull;</span>
                      {editingPasswordUserId === user.id ? (
                        <div className="flex items-center gap-1.5 bg-amber-50 p-1 rounded border border-amber-200">
                          <input
                            type="text"
                            value={newPasswordInput}
                            onChange={(e) => setNewPasswordInput(e.target.value)}
                            placeholder="Nova senha..."
                            className="px-2 py-0.5 text-xs bg-white border border-slate-300 rounded font-mono text-slate-900 w-28 focus:outline-none focus:ring-1 focus:ring-red-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleSavePassword(user.id)}
                            className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                            title="Salvar senha"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPasswordUserId(null)}
                            className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded"
                            title="Cancelar"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          <KeyRound className="w-3 h-3 text-amber-500" />
                          <span>Senha: {visiblePasswords[user.id] ? user.password : '••••••'}</span>
                          <button
                            type="button"
                            onClick={() => toggleShowPassword(user.id)}
                            className="text-slate-400 hover:text-slate-600 ml-0.5"
                            title={visiblePasswords[user.id] ? 'Ocultar senha' : 'Ver senha'}
                          >
                            {visiblePasswords[user.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartEditPassword(user)}
                            className="text-red-600 hover:text-red-700 font-sans text-[11px] font-semibold underline ml-1"
                            title="Alterar / Redefinir Senha deste colaborador"
                          >
                            Redefinir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {user.username !== 'MATHEUS T.I' && (
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <select
                        value={user.role}
                        onChange={(e) => onUpdateUserRole(user.id, e.target.value as UserRole)}
                        className="text-xs px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <option value="solicitante">Solicitante</option>
                        <option value="tecnico">Técnico T.I</option>
                        <option value="admin">Administrador</option>
                      </select>
                      <button
                        onClick={() => onRejectUser(user.id)}
                        title="Desativar usuário"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Central de Chamados Amilco T.I &bull; Painel Administrativo</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
