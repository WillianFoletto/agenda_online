import { User, Appointment } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    password: '123456',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    password: '123456',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    userId: '1',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '2',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '14:00',
    createdAt: new Date().toISOString(),
  },
];

export const availableTimeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
];
