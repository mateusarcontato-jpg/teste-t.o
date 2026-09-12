import React, { useState } from 'react';
import { Ticket, TicketCategory, TicketPriority, User } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { CATEGORY_LABELS, STATUS_LABELS } from '../data/initialTickets';
import { formatDateBr } from '../utils/formatters';
import { AmilcoLogo } from './AmilcoLogo';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Monitor,
  KeyRound,
  Wifi,
  Printer,
  ChevronRight,
} from 'lucide-react';

interface UserPortalProps {
  currentUser: User;
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onCreateTicket: (
    newTicket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'history'>
  ) => void;
}

const USER_QUICK_OPTIONS: {
  icon: any;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  defaultDesc: string;
}[] = [
  {
    icon: KeyRound,
    title: 'Esqueci / Bloqueei minha senha',
    category: 'acessos',
    priority: 'alta',
    defaultDesc: 'Minha senha foi bloqueada ou expirou e não consigo entrar na minha conta.',
  },
  {
    icon: Wifi,
    title: 'Sem internet ou VPN caindo',
    category: 'rede',
    priority: 'alta',
    defaultDesc: 'Estou sem conexão à rede da empresa ou a VPN desconectou e não volta.',
  },
  {
    icon: Printer,
    title: 'Problema com impressora',
    category: 'impressoras',
    priority: 'media',
    defaultDesc: 'A impressora está com papel atolado ou a impressão não está saindo.',
  },
  {
    icon: Monitor,
    title: 'Computador travando / muito lento',
    category: 'hardware',
    priority: 'media',
    defaultDesc: 'O computador está congelando ou demorando muito para abrir os programas.',
  },
];

export const UserPortal: React.FC<UserPortalProps> = ({
  currentUser,
  tickets,
  onSelectTicket,
  onCreateTicket,
}) => {
  // Only show tickets created by this user (matched by name, username, phone or email)
  const myTickets = tickets.filter((t) => {
    const tReq = t.requesterName.toLowerCase();
    const cName = currentUser.name.toLowerCase();
    const tContact = t.requesterEmail.toLowerCase();
    const cPhone = currentUser.phone ? currentUser.phone.replace(/\D/g, '') : '';
    const cUser = currentUser.username ? currentUser.username.toLowerCase() : '';
    const cMail = currentUser.email ? currentUser.email.toLowerCase() : '';

    return (
      tReq === cName ||
      (cMail && tContact === cMail) ||
      (cUser && tContact === cUser) ||
      (cPhone && tContact.replace(/\D/g, '').includes(cPhone))
    );
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('software');
  const [assetTag, setAssetTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleQuickOptionClick = (opt: (typeof USER_QUICK_OPTIONS)[0]) => {
    setTitle(opt.title);
    setCategory(opt.category);
    setDescription(opt.defaultDesc);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    onCreateTicket({
      title: title.trim(),
      description: description.trim(),
      requesterName: currentUser.name,
      requesterEmail: currentUser.phone || currentUser.username || currentUser.email || 'Não informado',
      department: currentUser.department,
      category,
      priority: 'media',
      status: 'aberto',
      assetTag: assetTag.trim() ? assetTag.trim().toUpperCase() : undefined,
      slaHours: 24,
    });

    setTitle('');
    setDescription('');
    setAssetTag('');
    setIsSubmitting(false);
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-rose-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Portal do Colaborador &bull; Setor: {currentUser.department}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Olá, {currentUser.name.split(' ')[0]}!
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Bem-vindo à <strong>Central de Chamados Amilco T.I</strong>. Descreva o que está acontecendo abaixo e nossa equipe técnica cuidará da solução.
          </p>
        </div>

        <div className="shrink-0 bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border border-white/20 shadow-md flex items-center justify-center self-start sm:self-center">
          <AmilcoLogo size="md" />
        </div>
      </div>

      {/* Simplified "Relatar Problema" Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-slate-900">
                  Formulário de Entrada do Problema
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  Novo Chamado
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Preencha os campos abaixo para abrir seu chamado. Nossa equipe de T.I atenderá sua solicitação.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Problem Presets */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500 block">
            Problemas frequentes (clique para preenchimento rápido):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {USER_QUICK_OPTIONS.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickOptionClick(opt)}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/60 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-700 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 group-hover:text-blue-900 line-clamp-2">
                    {opt.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          {feedbackSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Seu chamado foi enviado com sucesso! Nossa equipe de T.I já foi notificada.
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Qual é o problema ou solicitação? <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-user-ticket-title"
              type="text"
              required
              placeholder="Ex: Não consigo acessar a pasta de relatórios do setor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Tipo do problema
              </label>
              <select
                id="select-user-ticket-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Etiqueta do computador / Patrimônio{' '}
                <span className="text-slate-400 font-normal">(se houver)</span>
              </label>
              <input
                id="input-user-ticket-asset"
                type="text"
                placeholder="Ex: NOTE-04 ou etiqueta colada no gabinete"
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
                className="w-full px-3 py-2 uppercase font-mono bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Explique com suas palavras o que está acontecendo <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="textarea-user-ticket-desc"
              required
              rows={3}
              placeholder="Descreva o que você estava fazendo, se apareceu alguma mensagem de erro ou se parou de repente..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              id="btn-user-submit-ticket"
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Chamado para o Suporte</span>
            </button>
          </div>
        </form>
      </div>

      {/* "Meus Chamados" Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Meus Chamados em Andamento</h3>
            <p className="text-xs text-slate-500">
              Acompanhe aqui o status e as respostas dos técnicos para os seus pedidos
            </p>
          </div>
          <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
            {myTickets.length} chamado(s)
          </span>
        </div>

        {myTickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-semibold text-sm text-slate-800">
              Você não possui nenhum chamado aberto no momento!
            </p>
            <p className="text-xs text-slate-500">
              Quando precisar de suporte, basta utilizar o formulário acima para relatar o problema.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myTickets.map((ticket) => {
              const statusInfo = STATUS_LABELS[ticket.status] || STATUS_LABELS.aberto;

              return (
                <div
                  key={ticket.id}
                  id={`my-ticket-card-${ticket.id}`}
                  onClick={() => onSelectTicket(ticket)}
                  className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {ticket.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.badgeBg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.color}`} />
                        {statusInfo.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        Aberto {formatDateBr(ticket.createdAt)}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {ticket.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-1">
                      {ticket.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>
                        Técnico:{' '}
                        <strong className="text-slate-700">
                          {ticket.assignedTechnician || 'Aguardando atribuição'}
                        </strong>
                      </span>
                      {ticket.history.length > 0 && (
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          <MessageSquare className="w-3 h-3" />
                          {ticket.history.length} mensagem(ns)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectTicket(ticket)}
                      className="px-3 py-1.5 bg-slate-100 group-hover:bg-blue-600 text-slate-700 group-hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                    >
                      <span>Ver Conversa</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
