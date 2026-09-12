import { Ticket } from '../types';

export const INITIAL_TECHNICIANS = [
  'Carlos Silva (Suporte N1)',
  'Mariana Santos (Redes & Infra)',
  'Lucas Ferreira (Sistemas N2)',
  'Beatriz Lima (Segurança & Acessos)',
];

export const DEPARTMENTS = [
  'Financeiro',
  'Recursos Humanos',
  'Comercial / Vendas',
  'Operações & Logística',
  'Marketing',
  'Jurídico',
  'Atendimento ao Cliente',
  'Diretoria',
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

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TI-1042',
    title: 'Falha na conexão VPN e acesso ao servidor de arquivos',
    description:
      'Desde as 08:30 da manhã vários colaboradores em home office não conseguem conectar no Cisco AnyConnect. O erro informado é "Certificate Validation Failure / Gateway unreachable". Necessário verificar o firewall de borda.',
    requesterName: 'Patrícia Gomes',
    requesterEmail: 'patricia.gomes@empresa.com.br',
    department: 'Financeiro',
    category: 'rede',
    priority: 'critica',
    status: 'em_atendimento',
    assetTag: 'GW-FIREWALL-01',
    assignedTechnician: 'Mariana Santos (Redes & Infra)',
    createdAt: '2026-09-11T08:45:00.000Z',
    updatedAt: '2026-09-11T09:30:00.000Z',
    slaHours: 4,
    history: [
      {
        id: 'h-1',
        timestamp: '2026-09-11T08:45:00.000Z',
        author: 'Patrícia Gomes',
        role: 'solicitante',
        text: 'Chamado aberto com prioridade crítica devido ao fechamento da folha e conciliação bancária.',
        type: 'comentario',
      },
      {
        id: 'h-2',
        timestamp: '2026-09-11T09:00:00.000Z',
        author: 'Sistema',
        role: 'sistema',
        text: 'Chamado atribuído automaticamente para a fila de Redes & Infra.',
        type: 'atribuicao',
      },
      {
        id: 'h-3',
        timestamp: '2026-09-11T09:15:00.000Z',
        author: 'Mariana Santos (Redes & Infra)',
        role: 'tecnico',
        text: 'Identificado que o certificado intermediário expirou às 08:00. Gerando nova CSR e atualizando o bundle no cluster.',
        type: 'comentario',
      },
      {
        id: 'h-4',
        timestamp: '2026-09-11T09:30:00.000Z',
        author: 'Mariana Santos (Redes & Infra)',
        role: 'tecnico',
        text: 'Status alterado para Em Atendimento.',
        type: 'mudanca_status',
      },
    ],
  },
  {
    id: 'TI-1041',
    title: 'Monitor secundário não dá vídeo após docking station Dell',
    description:
      'O segundo monitor conectado via DisplayPort na docking station pisca e entra em modo de suspensão ("No Signal"). Já troquei o cabo HDMI/DP e reiniciei o notebook Dell Latitude 5420.',
    requesterName: 'Rodrigo Medeiros',
    requesterEmail: 'rodrigo.m@empresa.com.br',
    department: 'Comercial / Vendas',
    category: 'hardware',
    priority: 'media',
    status: 'aberto',
    assetTag: 'NOTE-COM-88',
    assignedTechnician: undefined,
    createdAt: '2026-09-11T09:15:00.000Z',
    updatedAt: '2026-09-11T09:15:00.000Z',
    slaHours: 8,
    history: [
      {
        id: 'h-5',
        timestamp: '2026-09-11T09:15:00.000Z',
        author: 'Rodrigo Medeiros',
        role: 'solicitante',
        text: 'Chamado registrado. Aguardando atendimento técnico na mesa 14 do comercial.',
        type: 'comentario',
      },
    ],
  },
  {
    id: 'TI-1040',
    title: 'Criação de conta de e-mail e acessos para novo colaborador',
    description:
      'Favor criar conta no Google Workspace, Slack e acesso à pasta compartilhada do RH para o novo estagiário Bruno Costa que inicia na próxima segunda-feira.',
    requesterName: 'Camila Fernandes',
    requesterEmail: 'camila.rh@empresa.com.br',
    department: 'Recursos Humanos',
    category: 'acessos',
    priority: 'media',
    status: 'em_atendimento',
    assignedTechnician: 'Beatriz Lima (Segurança & Acessos)',
    createdAt: '2026-09-11T07:20:00.000Z',
    updatedAt: '2026-09-11T08:50:00.000Z',
    slaHours: 24,
    history: [
      {
        id: 'h-6',
        timestamp: '2026-09-11T07:20:00.000Z',
        author: 'Camila Fernandes',
        role: 'solicitante',
        text: 'Solicitação de onboarding com termo de responsabilidade em anexo.',
        type: 'comentario',
      },
      {
        id: 'h-7',
        timestamp: '2026-09-11T08:50:00.000Z',
        author: 'Beatriz Lima (Segurança & Acessos)',
        role: 'tecnico',
        text: 'Conta de e-mail bruno.costa@empresa.com.br criada. Pendente apenas liberar o drive do RH.',
        type: 'comentario',
      },
    ],
  },
  {
    id: 'TI-1039',
    title: 'Impressora multifuncional do 2º andar com atolamento constante',
    description:
      'A impressora HP LaserJet Enterprise M608 está apresentando erro 13.00.00 (Jam in Tray 2) a cada 3 impressões. A gaveta de papel parece com rolete gasto.',
    requesterName: 'Eduardo Silveira',
    requesterEmail: 'eduardo.s@empresa.com.br',
    department: 'Operações & Logística',
    category: 'impressoras',
    priority: 'alta',
    status: 'aguardando_usuario',
    assetTag: 'IMP-ANDAR2-HP',
    assignedTechnician: 'Carlos Silva (Suporte N1)',
    createdAt: '2026-09-10T16:10:00.000Z',
    updatedAt: '2026-09-11T08:15:00.000Z',
    slaHours: 8,
    history: [
      {
        id: 'h-8',
        timestamp: '2026-09-10T16:10:00.000Z',
        author: 'Eduardo Silveira',
        role: 'solicitante',
        text: 'Setor de logística parado sem conseguir imprimir etiquetas de expedição.',
        type: 'comentario',
      },
      {
        id: 'h-9',
        timestamp: '2026-09-11T08:15:00.000Z',
        author: 'Carlos Silva (Suporte N1)',
        role: 'tecnico',
        text: 'Estive no local e fiz a limpeza dos roletes. Solicitei ao Eduardo testar com 20 páginas consecutivas para validar se o erro persiste.',
        type: 'comentario',
      },
    ],
  },
  {
    id: 'TI-1038',
    title: 'Instalação e ativação da licença Adobe Creative Cloud',
    description:
      'Preciso da instalação do Adobe Illustrator e Photoshop na minha estação para fechamento dos materiais da campanha trimestral.',
    requesterName: 'Larissa Alencar',
    requesterEmail: 'larissa.mkt@empresa.com.br',
    department: 'Marketing',
    category: 'software',
    priority: 'baixa',
    status: 'resolvido',
    assetTag: 'MAC-MKT-03',
    assignedTechnician: 'Lucas Ferreira (Sistemas N2)',
    createdAt: '2026-09-10T11:00:00.000Z',
    updatedAt: '2026-09-10T14:30:00.000Z',
    resolvedAt: '2026-09-10T14:30:00.000Z',
    slaHours: 24,
    history: [
      {
        id: 'h-10',
        timestamp: '2026-09-10T11:00:00.000Z',
        author: 'Larissa Alencar',
        role: 'solicitante',
        text: 'Aprovado pelo gestor de marketing em formulário anexo.',
        type: 'comentario',
      },
      {
        id: 'h-11',
        timestamp: '2026-09-10T14:30:00.000Z',
        author: 'Lucas Ferreira (Sistemas N2)',
        role: 'tecnico',
        text: 'Licença atribuída no portal Adobe Admin Console. Aplicativos instalados e validados com a usuária.',
        type: 'comentario',
      },
    ],
  },
  {
    id: 'TI-1037',
    title: 'E-mail suspeito de phishing recebido por vários diretores',
    description:
      'Recebemos um e-mail com remetente falso imitando o banco Santander solicitando recadastramento de token corporativo com link encurtado.',
    requesterName: 'Marcos Vinicius',
    requesterEmail: 'marcos.v@empresa.com.br',
    department: 'Diretoria',
    category: 'seguranca',
    priority: 'critica',
    status: 'resolvido',
    assetTag: 'SEC-MAIL-GATEWAY',
    assignedTechnician: 'Beatriz Lima (Segurança & Acessos)',
    createdAt: '2026-09-09T14:10:00.000Z',
    updatedAt: '2026-09-09T16:00:00.000Z',
    resolvedAt: '2026-09-09T16:00:00.000Z',
    slaHours: 2,
    history: [
      {
        id: 'h-12',
        timestamp: '2026-09-09T14:10:00.000Z',
        author: 'Marcos Vinicius',
        role: 'solicitante',
        text: 'E-mail encaminhado como anexo .eml para análise do SOC.',
        type: 'comentario',
      },
      {
        id: 'h-13',
        timestamp: '2026-09-09T15:30:00.000Z',
        author: 'Beatriz Lima (Segurança & Acessos)',
        role: 'tecnico',
        text: 'Domínio malicioso bloqueado no gateway de e-mail e regras de SPF/DMARC reforçadas. Nenhum usuário clicou no link.',
        type: 'comentario',
      },
    ],
  },
];
