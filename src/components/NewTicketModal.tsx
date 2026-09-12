import React, { useState } from 'react';
import { Ticket, TicketCategory, TicketPriority } from '../types';
import { CATEGORY_LABELS, DEPARTMENTS, PRIORITY_LABELS } from '../data/initialTickets';
import { CategoryIcon } from './CategoryIcon';
import { X, PlusCircle, Sparkles, Check, AlertCircle } from 'lucide-react';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTicket: (
    newTicket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'history'>
  ) => void;
}

const COMMON_PRESETS: {
  label: string;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
}[] = [
  {
    label: 'Redefinição de Senha',
    title: 'Acesso bloqueado por tentativas incorretas no Active Directory',
    category: 'acessos',
    priority: 'alta',
    description:
      'Usuário informou que o acesso à estação de trabalho e e-mail corporativo foi bloqueado após expiração da senha periódica. Solicita desbloqueio e envio de senha temporária.',
  },
  {
    label: 'Queda de Internet / Wi-Fi',
    title: 'Sem conexão de rede no setor - computadores desconectados',
    category: 'rede',
    priority: 'alta',
    description:
      'Os computadores da ilha de atendimento perderam conexão com a rede local e internet. O cabo de rede está conectado ao switch local mas os LEDs estão apagados.',
  },
  {
    label: 'Problema em Impressora',
    title: 'Impressora apresentando mensagem de substituição de toner',
    category: 'impressoras',
    priority: 'media',
    description:
      'Apareceu mensagem de toner preto em 2% e as impressões estão saindo com faixas brancas verticais. Solicitamos troca de suprimento.',
  },
  {
    label: 'Computador Travando / Lento',
    title: 'Estação de trabalho com alto consumo de memória e congelamento',
    category: 'hardware',
    priority: 'media',
    description:
      'O computador está demorando mais de 15 minutos para iniciar e o disco fica travado em 100% no Gerenciador de Tarefas, inviabilizando o uso do sistema ERP.',
  },
];

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  onCreateTicket,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [category, setCategory] = useState<TicketCategory>('hardware');
  const [priority, setPriority] = useState<TicketPriority>('media');
  const [assetTag, setAssetTag] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleApplyPreset = (preset: (typeof COMMON_PRESETS)[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setPriority(preset.priority);
    setDescription(preset.description);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Por favor, informe o título ou assunto do chamado.');
      return;
    }
    if (!requesterName.trim()) {
      setErrorMsg('Por favor, informe o nome do solicitante.');
      return;
    }
    if (!requesterEmail.trim()) {
      setErrorMsg('Por favor, informe o e-mail do solicitante.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Por favor, detalhe o problema ou solicitação.');
      return;
    }

    // SLA default calculation:
    // Critica: 4h, Alta: 8h, Media: 24h, Baixa: 48h
    const slaMap: Record<TicketPriority, number> = {
      critica: 4,
      alta: 8,
      media: 24,
      baixa: 48,
    };

    onCreateTicket({
      title: title.trim(),
      requesterName: requesterName.trim(),
      requesterEmail: requesterEmail.trim(),
      department,
      category,
      priority,
      status: 'aberto',
      assetTag: assetTag.trim() ? assetTag.trim().toUpperCase() : undefined,
      description: description.trim(),
      slaHours: slaMap[priority],
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setAssetTag('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      id="new-ticket-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="new-ticket-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 leading-tight">
                Novo Chamado de Suporte
              </h2>
              <p className="text-xs text-slate-500">
                Preencha os dados do incidente para direcionamento à equipe de T.I
              </p>
            </div>
          </div>
          <button
            id="btn-close-new-ticket"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Modelos Rápidos de Ocorrência (Preenchimento Rápido):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COMMON_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 text-left transition-colors truncate"
                  title={preset.title}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Título / Assunto do Problema <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-new-ticket-title"
              type="text"
              required
              placeholder="Ex: Erro ao tentar emitir nota fiscal no sistema Protheus"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Solicitante Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Nome do Solicitante <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-new-ticket-requester-name"
                type="text"
                required
                placeholder="Ex: Mariana Castro"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                E-mail Corporativo <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-new-ticket-requester-email"
                type="email"
                required
                placeholder="usuario@empresa.com.br"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Departamento <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-new-ticket-dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Categoria, Prioridade & Patrimônio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Categoria <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-new-ticket-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Prioridade Estimada <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-new-ticket-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {Object.entries(PRIORITY_LABELS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Patrimônio / Etiqueta Ativo <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                id="input-new-ticket-asset"
                type="text"
                placeholder="Ex: NOTE-FIN-04"
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
                className="w-full px-3 py-1.5 uppercase font-mono bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 block">
                Descrição Detalhada do Problema <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Inclua mensagens de erro e passos para reproduzir
              </span>
            </div>
            <textarea
              id="textarea-new-ticket-description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva com o máximo de detalhes o que aconteceu, qual o impacto no seu trabalho e se ocorreu alguma mensagem na tela..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Footer Actions inside form */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btn-submit-new-ticket"
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Registrar Chamado</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
