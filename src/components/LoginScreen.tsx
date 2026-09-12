import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { DEPARTMENTS } from '../data/initialTickets';
import { AmilcoLogo } from './AmilcoLogo';
import {
  Lock,
  User as UserIcon,
  Building,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Phone,
  CheckCircle2,
  Eye,
  EyeOff,
  Wrench,
  LogIn,
  HelpCircle,
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  registeredUsers: User[];
  onRegisterUser: (newUser: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  registeredUsers,
  onRegisterUser,
}) => {
  // Active Window: 'login' | 'cadastro'
  const [activeWindow, setActiveWindow] = useState<'login' | 'cadastro'>('login');

  // Tipo de Cadastro escolhido: 'usuario' | 'tecnico'
  const [cadastroTab, setCadastroTab] = useState<'usuario' | 'tecnico'>('usuario');

  // --- LOGIN FIELDS ---
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  // --- CADASTRO USUÁRIO COMUM (SOLICITANTE) ---
  const [userFullName, setUserFullName] = useState('');
  const [userContact, setUserContact] = useState('');
  const [userDept, setUserDept] = useState(DEPARTMENTS[0]);
  const [userPassword, setUserPassword] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);

  // --- CADASTRO TÉCNICO / ADMINISTRADOR ---
  const [techFullName, setTechFullName] = useState('');
  const [techUsername, setTechUsername] = useState('');
  const [techPhone, setTechPhone] = useState('');
  const [techRole, setTechRole] = useState<UserRole>('tecnico');
  const [techPassword, setTechPassword] = useState('');
  const [showTechPassword, setShowTechPassword] = useState(false);

  // General notices
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // -------------------------------------------------------------
  // LOGIN SUBMIT
  // -------------------------------------------------------------
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');
    setPasswordError(false);

    const cleanId = loginIdentifier.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      setError('Por favor, informe seu Nome de Usuário ou Telefone.');
      return;
    }

    if (!cleanPass) {
      setPasswordError(true);
      setError('⚠️ Campo Obrigatório: Por favor, digite sua senha de acesso.');
      return;
    }

    // 1. Special check for Administrator Matheus T.I
    const isMatheusLogin =
      cleanId.toUpperCase() === 'MATHEUS T.I' ||
      cleanId.toUpperCase() === 'MATHEUS' ||
      cleanId.toLowerCase() === 'matheus.ti@amilco.com.br';

    if (isMatheusLogin) {
      const adminExpectedPass = 'amilco2026';
      if (cleanPass !== adminExpectedPass) {
        setPasswordError(true);
        setFailedAttempts((prev) => prev + 1);
        setError('❌ SENHA INCORRETA para o Administrador Matheus T.I! Acesso recusado.');
        return;
      }

      const adminUser: User = registeredUsers.find(
        (u) => u.username?.toUpperCase() === 'MATHEUS T.I'
      ) || {
        id: 'admin-matheus',
        name: 'Matheus T.I',
        username: 'MATHEUS T.I',
        phone: '(69) 99999-0001',
        department: 'Tecnologia da Informação (T.I)',
        role: 'admin',
        status: 'aprovado',
        password: 'amilco2026',
      };
      setPasswordError(false);
      onLogin(adminUser);
      return;
    }

    // 2. Search user in registered users
    const foundUser = registeredUsers.find((u) => {
      const uName = (u.username || '').toLowerCase().trim();
      const uPhone = (u.phone || '').replace(/\D/g, '');
      const cleanPhone = cleanId.replace(/\D/g, '');
      const uFullName = (u.name || '').toLowerCase().trim();
      const target = cleanId.toLowerCase().trim();

      return (
        uName === target ||
        (cleanPhone.length >= 7 && uPhone.includes(cleanPhone)) ||
        uFullName === target ||
        (u.email && u.email.toLowerCase() === target)
      );
    });

    if (!foundUser) {
      setError(
        '❌ Usuário não localizado no banco de credenciais. Cadastre-se na aba "Novo Cadastro" ao lado.'
      );
      return;
    }

    // 3. Approval status check
    if (foundUser.status === 'pendente') {
      const roleLabel =
        foundUser.role === 'admin'
          ? 'Administrador'
          : foundUser.role === 'tecnico'
          ? 'Técnico de Suporte T.I'
          : 'Usuário';

      setError(
        `⏳ Acesso Pendente de Aprovação: Olá, ${foundUser.name}! Seu cadastro como "${roleLabel}" foi registrado e está aguardando a aprovação de Matheus T.I. Membros de suporte e administração só acessam o painel após a liberação do administrador.`
      );
      return;
    }

    if (foundUser.status === 'bloqueado') {
      setError('🚫 Acesso Bloqueado: Este usuário foi desativado pelo administrador.');
      return;
    }

    // 4. Strict password validation
    const expectedPassword = foundUser.password || 'amilco123';
    if (cleanPass !== expectedPassword) {
      setPasswordError(true);
      setFailedAttempts((prev) => prev + 1);
      setError(
        `❌ SENHA INCORRETA! A senha digitada para "${foundUser.name}" não confere com o banco de senhas. Verifique se a tecla Caps Lock está ligada e tente novamente.`
      );
      return;
    }

    setPasswordError(false);
    onLogin(foundUser);
  };

  // -------------------------------------------------------------
  // CADASTRO DE USUÁRIO NOVO COMUM (SOLICITANTE)
  // Após cadastrar, entra direto no formulário de entrada do problema!
  // -------------------------------------------------------------
  const handleRegisterCommonUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPasswordError(false);

    if (!userFullName.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }
    if (!userContact.trim()) {
      setError('Por favor, informe seu WhatsApp ou Usuário para contato.');
      return;
    }
    if (!userPassword.trim()) {
      setError('Por favor, defina uma senha de acesso.');
      return;
    }

    // Check if duplicate
    const exists = registeredUsers.some(
      (u) =>
        (u.username && u.username.toLowerCase() === userContact.toLowerCase().trim()) ||
        (u.phone && u.phone.replace(/\D/g, '') === userContact.replace(/\D/g, ''))
    );

    if (exists) {
      setError('Já existe um usuário com este telefone ou usuário cadastrado. Faça login na janela de Login.');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userFullName.trim(),
      username: userContact.trim(),
      phone: userContact.trim(),
      department: userDept,
      role: 'solicitante',
      status: 'aprovado', // Direct entry into the problem form!
      password: userPassword.trim(),
      createdAt: new Date().toISOString(),
    };

    onRegisterUser(newUser);
    // User enters directly into the problem submission form
    onLogin(newUser);
  };

  // -------------------------------------------------------------
  // CADASTRO DE TÉCNICO DE T.I OU ADMINISTRADOR
  // Após cadastrar, entra direto na janela de técnico do chamado!
  // -------------------------------------------------------------
  const handleRegisterTechUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPasswordError(false);

    if (!techFullName.trim()) {
      setError('Por favor, informe o nome do técnico.');
      return;
    }
    if (!techUsername.trim()) {
      setError('Por favor, informe o usuário de T.I (ex: felipe.ti).');
      return;
    }
    if (!techPassword.trim()) {
      setError('Por favor, defina uma senha de acesso.');
      return;
    }

    const cleanUsername = techUsername.trim();
    const isMatheus = cleanUsername.toUpperCase() === 'MATHEUS T.I';

    const exists = registeredUsers.some(
      (u) => u.username && u.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (exists && !isMatheus) {
      setError('Este nome de usuário de T.I já está cadastrado.');
      return;
    }

    const newTech: User = {
      id: isMatheus ? 'admin-matheus' : `tech-${Date.now()}`,
      name: techFullName.trim(),
      username: cleanUsername,
      phone: techPhone.trim() || '(69) 99999-0000',
      department: 'Tecnologia da Informação (T.I)',
      role: isMatheus ? 'admin' : techRole,
      status: isMatheus ? 'aprovado' : 'pendente', // Suporte e ADMs passam pela aprovação de Matheus T.I
      password: techPassword.trim(),
      createdAt: new Date().toISOString(),
    };

    onRegisterUser(newTech);

    if (isMatheus) {
      onLogin(newTech);
    } else {
      // Suporte e ADM ficam pendentes da aprovação de Matheus T.I
      setActiveWindow('login');
      setLoginIdentifier(cleanUsername);
      setPassword('');
      setSuccessNotice(
        `⏳ Cadastro Enviado para Aprovação! Olá, ${techFullName.trim()}! Seu cadastro como ${
          techRole === 'admin' ? 'Administrador' : 'Técnico de Suporte T.I'
        } foi gravado no sistema. Conforme a política de segurança da Amilco T.I, todos os membros de suporte e administração passam pela aprovação de MATHEUS T.I antes de acessar o painel. Assim que aprovado, faça login com sua senha.`
      );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-3 sm:p-6 relative overflow-x-hidden">
      {/* Background Ambience: Red & Black Geometric Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/35 via-zinc-950 to-black pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-700/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-700 via-red-500 to-red-700 shadow-sm shadow-red-500/50" />

      {/* Main Container */}
      <div className={`relative z-10 w-full transition-all duration-300 ${
        activeWindow === 'cadastro' ? 'max-w-2xl' : 'max-w-lg'
      }`}>
        {/* Top Header Card with Authentic Amilco Logo */}
        <div className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-5 sm:p-6 rounded-t-2xl border-t border-x border-red-900/40 text-center relative shadow-2xl">
          <div className="inline-flex p-3 rounded-2xl bg-white/95 shadow-xl shadow-black/80 mb-2.5 border border-red-500/30">
            <AmilcoLogo size="lg" />
          </div>

          <h1 className="text-base sm:text-xl font-extrabold uppercase tracking-tight text-white flex items-center justify-center gap-2">
            Central de Chamados T.I
          </h1>
          <p className="text-xs text-red-400 font-semibold tracking-wide uppercase mt-0.5">
            Amilco Home Center &bull; Atendimento ao Colaborador & Suporte Técnico
          </p>
        </div>

        {/* Dynamic Window Container */}
        <div className="bg-zinc-900/95 border-b border-x border-red-900/40 rounded-b-2xl shadow-2xl shadow-black/90 backdrop-blur-md overflow-hidden">
          {/* Alerts & Errors Banner */}
          {error && (
            <div
              id="box-login-error"
              className={`m-4 sm:m-6 mb-0 p-3.5 rounded-xl text-xs flex items-start gap-2.5 shadow-lg border transition-all ${
                passwordError
                  ? 'bg-red-950 border-red-500 text-red-100 ring-2 ring-red-600/50 animate-shake'
                  : 'bg-red-950/90 border-red-700 text-red-200'
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold uppercase tracking-wide text-red-300">
                  {passwordError ? 'Autenticação Recusada' : 'Atenção'}
                </div>
                <div className="leading-relaxed text-zinc-100">{error}</div>
                {failedAttempts > 1 && (
                  <p className="text-[11px] text-amber-300 font-medium pt-1">
                    Tentativas incorretas: {failedAttempts}. Dica: Clique no ícone do olho no campo de senha para conferir o que foi digitado.
                  </p>
                )}
              </div>
            </div>
          )}

          {successNotice && (
            <div className="m-4 sm:m-6 mb-0 p-3.5 bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex items-start gap-2.5 shadow-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{successNotice}</div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TELA DE LOGIN                                             */}
          {/* ========================================================= */}
          {activeWindow === 'login' && (
            <div className="p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
                    Usuário ou Telefone
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-red-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-identifier"
                      type="text"
                      required
                      placeholder="Ex: MATHEUS T.I, suporte.ti ou seu WhatsApp"
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        if (error) setError('');
                        if (passwordError) setPasswordError(false);
                      }}
                      className="w-full pl-10 pr-3 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:bg-zinc-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Não precisa de e-mail. Você pode usar seu nome de usuário ou número de telefone.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
                      Senha de Acesso
                    </label>
                    <span className="text-[11px] text-zinc-400">
                      Obrigatório
                    </span>
                  </div>
                  <div className="relative">
                    <Lock
                      className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                        passwordError ? 'text-red-500' : 'text-red-400'
                      }`}
                    />
                    <input
                      id="input-login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Digite sua senha..."
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError(false);
                        if (error && error.includes('SENHA')) setError('');
                      }}
                      className={`w-full pl-10 pr-10 py-2.5 bg-zinc-950 rounded-xl text-sm text-white placeholder-zinc-500 focus:bg-zinc-900 focus:outline-none transition-all ${
                        passwordError
                          ? 'border-2 border-red-500 ring-2 ring-red-500/30 animate-shake'
                          : 'border border-zinc-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      }`}
                    />
                    <button
                      type="button"
                      id="btn-toggle-show-password"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 rounded-md transition-colors"
                      title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2 uppercase tracking-wider mt-2 active:scale-98"
                >
                  <span>Validar Credenciais & Entrar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Redirect to Register Options */}
                <div className="pt-3 border-t border-zinc-800 text-center space-y-2">
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                    Ainda não tem cadastro?
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      id="btn-choose-register-user"
                      onClick={() => {
                        setActiveWindow('cadastro');
                        setCadastroTab('usuario');
                        setError('');
                      }}
                      className="py-2.5 px-3 bg-zinc-950 hover:bg-zinc-800 text-white text-xs rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-zinc-700 hover:border-blue-500/60 shadow-sm group"
                    >
                      <UserIcon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>Cadastrar Usuário</span>
                    </button>
                    <button
                      type="button"
                      id="btn-choose-register-tech"
                      onClick={() => {
                        setActiveWindow('cadastro');
                        setCadastroTab('tecnico');
                        setError('');
                      }}
                      className="py-2.5 px-3 bg-zinc-950 hover:bg-zinc-800 text-white text-xs rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-zinc-700 hover:border-red-500/60 shadow-sm group"
                    >
                      <Wrench className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                      <span>Cadastrar Membro T.I</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TELA DE CADASTRO                                          */}
          {/* ========================================================= */}
          {activeWindow === 'cadastro' && (
            <div className="p-4 sm:p-6 animate-in fade-in duration-200">
              {/* Header do Cadastro com botão de Voltar */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                    Novo Cadastro
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Selecione o tipo de perfil desejado para se registrar
                  </p>
                </div>

                <button
                  type="button"
                  id="btn-back-to-login"
                  onClick={() => {
                    setActiveWindow('login');
                    setError('');
                  }}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-700"
                >
                  <LogIn className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Voltar ao Login</span>
                </button>
              </div>

              {/* Seletor do que o usuário quer cadastrar */}
              <div className="grid grid-cols-2 gap-2 bg-black/60 p-1.5 rounded-xl border border-zinc-800 mb-5">
                <button
                  type="button"
                  id="tab-reg-user"
                  onClick={() => {
                    setCadastroTab('usuario');
                    setError('');
                  }}
                  className={`py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    cadastroTab === 'usuario'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 ring-1 ring-blue-400'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-blue-300" />
                  <span>Usuário Comum</span>
                </button>

                <button
                  type="button"
                  id="tab-reg-tech"
                  onClick={() => {
                    setCadastroTab('tecnico');
                    setError('');
                  }}
                  className={`py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    cadastroTab === 'tecnico'
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/40 ring-1 ring-red-400'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5 text-red-300" />
                  <span>Membro da T.I (Suporte / ADM)</span>
                </button>
              </div>

              {/* FORMULÁRIO 1: USUÁRIO COMUM (SOLICITANTE) */}
              {cadastroTab === 'usuario' && (
                <div className="bg-zinc-950/80 border border-blue-900/40 rounded-xl p-4 sm:p-5 relative shadow-lg">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-t-xl" />

                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center border border-blue-800/50">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                        Cadastro de Usuário Comum
                      </h3>
                      <span className="text-[10px] text-blue-400 font-semibold block">
                        Para colaboradores dos setores (Balcão, Caixa, Vendas, etc.)
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-blue-950/30 border border-blue-900/40 rounded-lg text-xs text-blue-200 mb-3.5 flex items-start gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>
                      Após cadastrar, você entra <strong>diretamente no formulário de entrada do problema</strong> para abrir seu chamado.
                    </span>
                  </div>

                  <form onSubmit={handleRegisterCommonUser} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-300 block uppercase">
                        Nome Completo
                      </label>
                      <input
                        id="input-user-reg-name"
                        type="text"
                        required
                        placeholder="Ex: João da Silva"
                        value={userFullName}
                        onChange={(e) => setUserFullName(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-300 block uppercase">
                        WhatsApp ou Telefone
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="input-user-reg-phone"
                          type="text"
                          required
                          placeholder="Ex: (69) 99234-5678"
                          value={userContact}
                          onChange={(e) => setUserContact(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500">
                        Não precisa de e-mail. Usado como seu login.
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-300 block uppercase">
                        Setor / Departamento
                      </label>
                      <div className="relative">
                        <Building className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <select
                          id="select-user-reg-dept"
                          value={userDept}
                          onChange={(e) => setUserDept(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept} className="bg-zinc-900 text-white">
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-300 block uppercase">
                        Senha de Acesso
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="input-user-reg-password"
                          type={showUserPassword ? 'text' : 'password'}
                          required
                          placeholder="Crie sua senha..."
                          value={userPassword}
                          onChange={(e) => setUserPassword(e.target.value)}
                          className="w-full pl-9 pr-9 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowUserPassword(!showUserPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                        >
                          {showUserPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      id="btn-submit-reg-user"
                      type="submit"
                      className="w-full mt-3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Cadastrar e Abrir Chamado</span>
                    </button>
                  </form>
                </div>
              )}

              {/* FORMULÁRIO 2: MEMBRO DA T.I (SUPORTE / ADM) */}
              {cadastroTab === 'tecnico' && (
                <div className="bg-zinc-950/80 border border-red-900/50 rounded-xl p-4 sm:p-5 relative shadow-lg">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-t-xl" />

                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 flex items-center justify-center border border-red-800/50">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                        Cadastro de Membro da T.I
                      </h3>
                      <span className="text-[10px] text-red-400 font-semibold block">
                        Equipe Técnica de Suporte & Administração Amilco T.I
                      </span>
                    </div>
                  </div>

                  {/* AVISO IMPORTANTE: APROVAÇÃO DE MATHEUS T.I */}
                  <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-100 mb-3.5 flex items-start gap-2.5 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="font-bold text-amber-300 uppercase tracking-wide text-[11px]">
                        Aprovação Obrigatória por Matheus T.I
                      </div>
                      <div className="text-zinc-200 leading-relaxed text-[11px]">
                        Por política de segurança do sistema, cadastros de <strong>Suporte Técnico</strong> e <strong>Administradores</strong> são salvos e <strong>passam pela aprovação de MATHEUS T.I</strong> antes de liberar o acesso.
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleRegisterTechUser} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-300 block uppercase">
                        Nome do Técnico / Administrador
                      </label>
                      <input
                        id="input-tech-reg-name"
                        type="text"
                        required
                        placeholder="Ex: Felipe Ramos"
                        value={techFullName}
                        onChange={(e) => setTechFullName(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-zinc-300 block uppercase">
                          Usuário de T.I
                        </label>
                        <input
                          id="input-tech-reg-user"
                          type="text"
                          required
                          placeholder="Ex: felipe.ti"
                          value={techUsername}
                          onChange={(e) => setTechUsername(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-zinc-300 block uppercase">
                          Telefone / WhatsApp
                        </label>
                        <input
                          id="input-tech-reg-phone"
                          type="text"
                          placeholder="(69) 99999-0000"
                          value={techPhone}
                          onChange={(e) => setTechPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-300 block uppercase">
                        Função Solicitada
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setTechRole('tecnico')}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all ${
                            techRole === 'tecnico'
                              ? 'bg-red-950 border-red-500 text-white ring-1 ring-red-500'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                          }`}
                        >
                          Técnico T.I
                        </button>
                        <button
                          type="button"
                          onClick={() => setTechRole('admin')}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all ${
                            techRole === 'admin'
                              ? 'bg-red-950 border-red-500 text-white ring-1 ring-red-500'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                          }`}
                        >
                          Administrador
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-300 block uppercase">
                        Senha de Acesso
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="input-tech-reg-password"
                          type={showTechPassword ? 'text' : 'password'}
                          required
                          placeholder="Defina a senha de T.I..."
                          value={techPassword}
                          onChange={(e) => setTechPassword(e.target.value)}
                          className="w-full pl-9 pr-9 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowTechPassword(!showTechPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                        >
                          {showTechPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      id="btn-submit-reg-tech"
                      type="submit"
                      className="w-full mt-3 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                      <span>Cadastrar e Enviar para Aprovação de Matheus T.I</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer copyright */}
        <div className="relative z-10 text-center mt-4 text-xs text-zinc-500">
          Amilco Home Center &bull; Central de Chamados de Tecnologia da Informação
        </div>
      </div>
    </div>
  );
};
