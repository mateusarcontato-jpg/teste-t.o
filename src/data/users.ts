import { User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'admin-matheus',
    name: 'Matheus T.I',
    username: 'MATHEUS T.I',
    phone: '(69) 99999-0001',
    email: 'matheus.ti@amilco.com.br',
    department: 'Tecnologia da Informação (T.I)',
    role: 'admin',
    status: 'aprovado',
    password: 'amilco2026',
    createdAt: '2026-09-11T08:00:00.000Z',
  },
  {
    id: 'user-demo-1',
    name: 'Patrícia Gomes',
    username: 'patricia.gomes',
    phone: '(69) 98888-1111',
    department: 'Financeiro / Caixa',
    role: 'solicitante',
    status: 'aprovado',
    password: '123',
    createdAt: '2026-09-11T09:00:00.000Z',
  },
  {
    id: 'user-demo-2',
    name: 'Carlos Oliveira (Balcão)',
    username: 'carlos.balcao',
    phone: '(69) 97777-2222',
    department: 'Vendas & Balcão',
    role: 'solicitante',
    status: 'pendente', // Test pending approval for Matheus to test in the panel!
    password: '123',
    createdAt: '2026-09-11T10:15:00.000Z',
  },
];

