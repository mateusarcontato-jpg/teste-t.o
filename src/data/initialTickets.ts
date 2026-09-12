import { Ticket } from '../types';

export const INITIAL_TECHNICIANS = [
  'Matheus T.I (Administrador)',
  'Carlos Silva (Suporte N1)',
  'Suporte Técnico Amilco',
];

export const DEPARTMENTS = [
  'Loja / Frente de Caixa',
  'Vendas & Balcão',
  'Estoque & Depósito',
  'Expedição & Logística',
  'Financeiro & Contas',
  'Recursos Humanos',
  'Compras',
  'Marketing',
  'Gerência & Diretoria',
  'Tecnologia da Informação (T.I)',
  'Outro Setor',
];

export const CATEGORY_LABELS: Record<string, { label: string; iconName: string }> = {
  hardware: { label: 'Hardware', iconName: 'Monitor' },
  software: { label: 'Software & Apps', iconName: 'AppWindow' },
  rede: { label: 'Rede & Internet', iconName: 'Wifi' },
  acessos: { label: 'Acessos & Senhas', iconName: 'KeyRound' },
  impressoras: { label: 'Impressoras', iconName: 'Printer' },
  seguranca: { label: 'Segurança', iconName: 'ShieldAlert' },
  outros: { label: 'Outros', iconName: 'HelpCircle' },
};

export const STATUS_LABELS: Record<
  string,
  { label: string; color: string; badgeBg: string; textBg: string }
> = {
  aberto: {
    label: 'Aberto',
    color: 'bg-amber-500',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    textBg: 'text-amber-700',
  },
  em_atendimento: {
    label: 'Em Atendimento',
    color: 'bg-blue-600',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    textBg: 'text-blue-700',
  },
  aguardando_usuario: {
    label: 'Aguardando Usuário',
    color: 'bg-purple-600',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    textBg: 'text-purple-700',
  },
  resolvido: {
    label: 'Resolvido',
    color: 'bg-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    textBg: 'text-emerald-700',
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-slate-500',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    textBg: 'text-slate-600',
  },
};

export const PRIORITY_LABELS: Record<
  string,
  { label: string; badgeBg: string; dotColor: string }
> = {
  baixa: {
    label: 'Baixa',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: 'bg-slate-400',
  },
  media: {
    label: 'Média',
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    dotColor: 'bg-sky-500',
  },
  alta: {
    label: 'Alta',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-500',
  },
  critica: {
    label: 'Crítica',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-300 font-semibold',
    dotColor: 'bg-rose-600 animate-pulse',
  },
};

// Sistema virgem e zerado dos chamados testes
export const INITIAL_TICKETS: Ticket[] = [];
