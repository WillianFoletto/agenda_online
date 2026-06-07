export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  date: string;
  time: string;
  createdAt: string;
  status?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
