import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/users';
import { DEPARTMENTS } from '../data/initialTickets';
import { AmilcoLogo } from './AmilcoLogo';
import {
  Lock,
  User as UserIcon,
  Building,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Phone,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
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
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register Fields
  const [regName, setRegName] = useState('');
  const [regIdentifier, setRegIdentifier] = useState('');
  const [regDepartment, setRegDepartment] = useState(DEPARTMENTS[0]);
  const [regRole, setRegRole] = useState<UserRole>('solicitante');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');

    const cleanId = loginIdentifier.trim();
    if (!cleanId) {
      setError('Por favor, informe seu Nome de Usuário ou Telefone.');
      return;
    }

    // Special check for Administrator: MATHEUS T.I / amilco2026
    if (
      cleanId.toUpperCase() === 'MATHEUS T.I' ||
      cleanId.toUpperCase() === 'MATHEUS' ||
      cleanId.toLowerCase() === 'matheus.ti@amilco.com.br'
    ) {
      if (password === 'amilco2026' || !password) {
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
        onLogin(adminUser);
        return;
      } else {
        setError('Senha incorreta para o administrador Matheus T.I.');
        return;
      }
    }

    // Search existing user by username, phone, or name
    const foundUser = registeredUsers.find((u) => {
      const uName = (u.username || '').toLowerCase().trim();
      const uPhone = (u.phone || '').replace(/\D/g, '');
      const cleanPhone = cleanId.replace(/\D/g, '');
      const uFullName = (u.name || '').toLowerCase().trim();
      const target = cleanId.toLowerCase();

      return (
        uName === target ||
        (cleanPhone && uPhone.includes(cleanPhone)) ||
        uFullName === target ||
        u.email?.toLowerCase() === target
      );
    });

    if (!foundUser) {
      setError(
        'Usuário ou telefone não encontrado. Caso ainda não tenha cadastro, clique em "Cadastrar Novo Usuário" abaixo.'
      );
      return;
    }

    // Check approval status
    if (foundUser.status === 'pendente') {
      setError(
        `Acesso Pendente: Olá, ${foundUser.name}! Seu cadastro foi recebido e está aguardando liberação do administrador Matheus T.I. Solicite a aprovação ao T.I para liberar seu acesso.`
      );
      return;
    }

    if (foundUser.status === 'bloqueado') {
      setError('Este usuário foi desativado pelo administrador.');
      return;
    }

    // Validate password if user has password set
    if (foundUser.password && password && foundUser.password !== password) {
      setError('Senha incorreta.');
      return;
    }

    onLogin(foundUser);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');

    if (!regName.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }

    if (!regIdentifier.trim()) {
      setError('Por favor, informe seu nome de usuário ou telefone celular.');
      return;
    }

    if (!regPassword.trim()) {
      setError('Por favor, defina uma senha de acesso.');
      return;
    }

    // Check if user already exists
    const exists = registeredUsers.some(
      (u) =>
        (u.username && u.username.toLowerCase() === regIdentifier.toLowerCase().trim()) ||
        (u.phone && u.phone.replace(/\D/g, '') === regIdentifier.replace(/\D/g, ''))
    );

    if (exists) {
      setError('Já existe um usuário cadastrado com este nome de usuário ou telefone.');
      return;
    }

    // Create user with status 'pendente'
    const isMatheus = regIdentifier.toUpperCase().trim() === 'MATHEUS T.I';
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      username: regIdentifier.trim(),
      phone: regIdentifier.trim(),
      department: regDepartment,
      role: isMatheus ? 'admin' : regRole,
      status: isMatheus ? 'aprovado' : 'pendente', // Regular users require Matheus's approval!
      password: regPassword.trim(),
      createdAt: new Date().toISOString(),
    };

    onRegisterUser(newUser);

    if (isMatheus) {
      onLogin(newUser);
    } else {
      setIsRegistering(false);
      setSuccessNotice(
        `Cadastro de ${newUser.name} realizado com sucesso! Ele foi enviado para a fila de aprovação do administrador Matheus T.I. Assim que aprovado, o acesso será liberado.`
      );
      setLoginIdentifier(regIdentifier);
      setPassword(regPassword);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambience: Red & Black Geometric & Radial Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/30 via-zinc-950 to-black pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-700/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Red Accent Bars */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-700 via-red-500 to-red-700 shadow-sm shadow-red-500/50" />

      <div className="relative z-10 max-w-md w-full bg-zinc-900/95 border border-red-900/40 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-md overflow-hidden">
        {/* Top Header Card with Authentic Amilco Logo */}
        <div className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-6 text-center border-b border-zinc-800 relative">
          <div className="inline-flex p-3 rounded-2xl bg-white/95 shadow-lg shadow-black/60 mb-3 border border-red-500/30">
            <AmilcoLogo size="lg" />
          </div>

          <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-tight text-white flex items-center justify-center gap-2">
            Central de Chamados T.I
          </h1>
          <p className="text-xs text-red-400 font-semibold tracking-wide uppercase mt-1">
            Amilco Home Center &bull; Atendimento & Suporte
          </p>
        </div>

        {/* Quick 1-Click Access for Administrator Matheus T.I */}
        <div className="bg-gradient-to-r from-zinc-950 via-red-950/40 to-zinc-950 border-b border-red-900/30 p-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold text-zinc-200">
                Acesso do Administrador:
              </span>
            </div>
            <span className="text-[11px] font-mono text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/40">
              MATHEUS T.I
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setLoginIdentifier('MATHEUS T.I');
              setPassword('amilco2026');
              const admin = registeredUsers.find(
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
              onLogin(admin);
            }}
            className="mt-2 w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-red-900/30 flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Entrar como Matheus T.I (1 Clique)</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Alerts & Feedback */}
          {error && (
            <div className="mb-4 p-3.5 bg-red-950/90 border border-red-700 text-red-200 text-xs rounded-xl flex items-start gap-2.5 shadow-md">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {successNotice && (
            <div className="mb-4 p-3.5 bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex items-start gap-2.5 shadow-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{successNotice}</div>
            </div>
          )}

          {!isRegistering ? (
            /* Login Form */
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
                    placeholder="Ex: MATHEUS T.I ou (69) 99999-9999"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:bg-zinc-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                </div>
                <p className="text-[11px] text-zinc-400">
                  Não é necessário e-mail. Você pode usar seu nome de usuário ou WhatsApp.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
                    Senha de Acesso
                  </label>
                  <span className="text-[11px] text-zinc-400">Adm: amilco2026</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-red-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-login-password"
                    type="password"
                    placeholder="Digite sua senha..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:bg-zinc-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                </div>
              </div>

              <button
                id="btn-submit-login"
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2 uppercase tracking-wider mt-2 active:scale-98"
              >
                <span>Entrar no Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setError('');
                    setSuccessNotice('');
                  }}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold underline underline-offset-4 transition-colors"
                >
                  Novo colaborador? Cadastrar novo usuário
                </button>
              </div>
            </form>
          ) : (
            /* Register Form (No email needed!) */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="p-2.5 bg-red-950/40 border border-red-900/30 rounded-xl text-xs text-red-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Aviso:</strong> Seu cadastro ficará pendente de aprovação pelo administrador <strong>Matheus T.I</strong> para liberar o acesso.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-red-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-reg-name"
                    type="text"
                    required
                    placeholder="Ex: João da Silva"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
                  Usuário ou Telefone / Celular
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-red-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-reg-identifier"
                    type="text"
                    required
                    placeholder="Ex: joao.silva ou (69) 99234-5678"
                    value={regIdentifier}
                    onChange={(e) => setRegIdentifier(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
                  Setor / Departamento
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-red-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    id="select-reg-dept"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
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
                <label className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
                  Perfil Solicitado
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('solicitante')}
                    className={`p-2.5 rounded-xl border text-xs text-center transition-all ${
                      regRole === 'solicitante'
                        ? 'border-red-500 bg-red-950/60 text-white font-bold ring-1 ring-red-500'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900'
                    }`}
                  >
                    <span className="block font-bold">Solicitante</span>
                    <span className="text-[10px] text-zinc-400">Abrir Chamados</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('tecnico')}
                    className={`p-2.5 rounded-xl border text-xs text-center transition-all ${
                      regRole === 'tecnico'
                        ? 'border-red-500 bg-red-950/60 text-white font-bold ring-1 ring-red-500'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900'
                    }`}
                  >
                    <span className="block font-bold">Técnico T.I</span>
                    <span className="text-[10px] text-zinc-400">Atender Chamados</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-red-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-reg-password"
                    type="password"
                    required
                    placeholder="Defina uma senha..."
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <button
                id="btn-submit-register"
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors mt-2"
              >
                Solicitar Cadastro
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setError('');
                  }}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Já possui conta? Fazer Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer copyright */}
      <div className="relative z-10 text-center mt-6 text-xs text-zinc-500">
        Amilco Home Center &bull; Central de Chamados de Tecnologia da Informação
      </div>
    </div>
  );
};
