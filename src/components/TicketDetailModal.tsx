import React, { useState } from 'react';
import {
  Ticket,
  TicketPriority,
  TicketStatus,
  TicketHistoryEntry,
} from '../types';
import {
  CATEGORY_LABELS,
  INITIAL_TECHNICIANS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '../data/initialTickets';
import { CategoryIcon } from './CategoryIcon';
import { formatDateBr, getSlaRemaining } from '../utils/formatters';
import {
  X,
  User,
  Mail,
  Building,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  UserCheck,
  RotateCcw,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void;
  onUpdatePriority: (ticketId: string, priority: TicketPriority) => void;
  onUpdateTechnician: (ticketId: string, technician: string | undefined) => void;
  onAddComment: (
    ticketId: string,
    text: string,
    role: 'tecnico' | 'solicitante',
    author: string
  ) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  onClose,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateTechnician,
  onAddComment,
}) => {
  if (!ticket) return null;

  const [commentText, setCommentText] = useState('');
  const [commentRole, setCommentRole] = useState<'tecnico' | 'solicitante'>('tecnico');
  const [authorName, setAuthorName] = useState('Suporte Técnico TI');

  const slaInfo = getSlaRemaining(ticket.createdAt, ticket.slaHours, ticket.resolvedAt);
  const priorityInfo = PRIORITY_LABELS[ticket.priority] || PRIORITY_LABELS.media;
  const statusInfo = STATUS_LABELS[ticket.status] || STATUS_LABELS.aberto;
  const categoryInfo = CATEGORY_LABELS[ticket.category] || CATEGORY_LABELS.outros;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const actualAuthor =
      commentRole === 'tecnico'
        ? ticket.assignedTechnician || 'Técnico de Suporte'
        : ticket.requesterName;

    onAddComment(ticket.id, commentText.trim(), commentRole, actualAuthor);
    setCommentText('');
  };

  const handleToggleResolve = () => {
    if (ticket.status === 'resolvido') {
      onUpdateStatus(ticket.id, 'em_atendimento');
    } else {
      onUpdateStatus(ticket.id, 'resolvido');
    }
  };

  return (
    <div
      id="ticket-detail-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="ticket-detail-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/70">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                {ticket.id}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200/80 text-slate-800">
                <CategoryIcon category={ticket.category} className="w-3.5 h-3.5" />
                {categoryInfo.label}
              </span>

              {/* Status Selector */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 font-medium">Status:</span>
                <select
                  id="select-detail-status"
                  value={ticket.status}
                  aria-label="Alterar status do chamado"
                  onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
                  className="bg-white border border-slate-300 rounded px-2 py-1 font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500"
                >
                  {Object.entries(STATUS_LABELS).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Selector */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 font-medium">Prioridade:</span>
                <select
                  id="select-detail-priority"
                  value={ticket.priority}
                  aria-label="Alterar prioridade do chamado"
                  onChange={(e) => onUpdatePriority(ticket.id, e.target.value as TicketPriority)}
                  className="bg-white border border-slate-300 rounded px-2 py-1 font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500"
                >
                  {Object.entries(PRIORITY_LABELS).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {ticket.title}
            </h2>
          </div>

          <button
            id="btn-close-ticket-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Fechar detalhes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Two columns layout on tablet/desktop */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column (2 spans): Description & History / Comments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Descrição do Problema / Solicitação
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                {ticket.description}
              </div>
            </div>

            {/* Interaction History / Timeline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Histórico e Interações ({ticket.history.length})
                </h3>
              </div>

              {/* Timeline list */}
              <div className="space-y-3">
                {ticket.history.map((entry) => {
                  const isTech = entry.role === 'tecnico';
                  const isSystem = entry.role === 'sistema';

                  return (
                    <div
                      key={entry.id}
                      className={`p-3.5 rounded-xl border text-sm transition-all ${
                        isTech
                          ? 'bg-blue-50/50 border-blue-200 text-blue-950'
                          : isSystem
                          ? 'bg-slate-100/70 border-slate-200 text-slate-700 italic'
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded ${
                              isTech
                                ? 'bg-blue-600 text-white'
                                : isSystem
                                ? 'bg-slate-300 text-slate-800'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {isTech ? 'Técnico' : isSystem ? 'Sistema' : 'Solicitante'}
                          </span>
                          <span className="font-semibold text-xs text-slate-800">
                            {entry.author}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {formatDateBr(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                        {entry.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* New Comment / Technical Note Form */}
              <form
                onSubmit={handleSendComment}
                className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700">
                    Adicionar Resposta / Nota Técnica:
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setCommentRole('tecnico')}
                      className={`px-2 py-1 rounded transition-colors ${
                        commentRole === 'tecnico'
                          ? 'bg-blue-600 text-white font-medium'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      Como Técnico
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommentRole('solicitante')}
                      className={`px-2 py-1 rounded transition-colors ${
                        commentRole === 'solicitante'
                          ? 'bg-slate-800 text-white font-medium'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      Como Solicitante
                    </button>
                  </div>
                </div>

                <textarea
                  id="textarea-ticket-reply"
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    commentRole === 'tecnico'
                      ? 'Descreva a análise técnica, orientações de teste ou solução aplicada...'
                      : 'Envie um complemento ou resposta sobre a situação...'
                  }
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />

                <div className="flex items-center justify-end">
                  <button
                    id="btn-send-ticket-reply"
                    type="submit"
                    disabled={!commentText.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar Resposta</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Column (1 span): Metadata, Requester, Technician assignment */}
          <div className="space-y-5">
            {/* Quick Resolution Call to Action */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Ação Rápida
              </span>

              <button
                id="btn-toggle-resolve-status"
                type="button"
                onClick={handleToggleResolve}
                className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-xs ${
                  ticket.status === 'resolvido'
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {ticket.status === 'resolvido' ? (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Reabrir Chamado</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Marcar como Resolvido</span>
                  </>
                )}
              </button>
            </div>

            {/* Requester Information */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-500">
                Informações do Solicitante
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-900">{ticket.requesterName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a
                    href={`mailto:${ticket.requesterEmail}`}
                    className="text-blue-600 hover:underline truncate"
                  >
                    {ticket.requesterEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-700">{ticket.department}</span>
                </div>
                {ticket.assetTag && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <HardDrive className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-slate-600">Patrimônio:</span>
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                      {ticket.assetTag}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Technician assignment */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Técnico Responsável</span>
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              </h4>

              <select
                id="select-detail-technician"
                value={ticket.assignedTechnician || ''}
                aria-label="Atribuir Técnico Responsável"
                onChange={(e) =>
                  onUpdateTechnician(ticket.id, e.target.value ? e.target.value : undefined)
                }
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Não Atribuído --</option>
                {INITIAL_TECHNICIANS.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>

              {!ticket.assignedTechnician && (
                <button
                  type="button"
                  onClick={() => onUpdateTechnician(ticket.id, INITIAL_TECHNICIANS[0])}
                  className="w-full py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-medium border border-blue-200 transition-colors text-center"
                >
                  Atribuir a mim ({INITIAL_TECHNICIANS[0].split(' ')[0]})
                </button>
              )}
            </div>

            {/* SLA & Time Metrics */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-500">
                Prazos e Auditoria
              </h4>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Criado em:</span>
                  <span className="font-medium text-slate-800">
                    {formatDateBr(ticket.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Meta de SLA:</span>
                  <span className="font-medium text-slate-800">{ticket.slaHours} horas</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Status do SLA:</span>
                  <span
                    className={`font-semibold ${
                      slaInfo.isBreached
                        ? 'text-rose-600'
                        : slaInfo.isWarning
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {slaInfo.text}
                  </span>
                </div>
                {ticket.resolvedAt && (
                  <div className="flex justify-between py-1">
                    <span>Resolvido em:</span>
                    <span className="font-medium text-emerald-700">
                      {formatDateBr(ticket.resolvedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Atualizado: <strong>{formatDateBr(ticket.updatedAt)}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
