import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment } from '../types';
import { mockAppointments, availableTimeSlots } from '../data/mockData';
import { supabase } from '../lib/supabase';

interface AppointmentContextType {
  appointments: Appointment[];
  bookAppointment: (userId: string, date: string, time: string) => Promise<boolean>;
  getAppointmentsForDate: (date: string) => Appointment[];
  getAppointmentsForUser: (userId: string) => Appointment[];
  hasUserAppointmentOnDate: (userId: string, date: string) => boolean;
  getAvailableSlots: (date: string) => string[];
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const loadAppointments = async () => {
      console.log('[Supabase] Carregando agendamentos...');
      
      try {
        const { data, error } = await supabase.from('appointments').select('*');
        
        if (error) {
          console.error('[Supabase] Erro ao carregar:', error);
          // Fallback para localStorage
          const stored = localStorage.getItem('appointments');
          if (stored) {
            setAppointments(JSON.parse(stored));
          } else {
            setAppointments(mockAppointments);
          }
          return;
        }
        
        console.log('[Supabase] Agendamentos encontrados:', data?.length || 0);
        
        // Converter formato snake_case do Supabase para camelCase do TypeScript
        const convertedAppointments: Appointment[] = (data || []).map((apt: any) => ({
          id: apt.id,
          userId: apt.user_id,
          date: apt.date,
          time: apt.time,
          createdAt: apt.created_at,
          status: apt.status,
        }));
        
        // Carregar agendamentos do Supabase
        setAppointments(convertedAppointments);
        
        // Atualizar localStorage com dados do Supabase
        localStorage.setItem('appointments', JSON.stringify(convertedAppointments));
        
      } catch (error) {
        console.error('[Supabase] Erro ao carregar (catch):', error);
        // Fallback para localStorage
        const stored = localStorage.getItem('appointments');
        if (stored) {
          setAppointments(JSON.parse(stored));
        } else {
          setAppointments(mockAppointments);
        }
      }
    };
    
    loadAppointments();
  }, []);

  const bookAppointment = async (userId: string, date: string, time: string): Promise<boolean> => {
    // Check if slot is already taken
    const slotTaken = appointments.some(
      (apt) => apt.date === date && apt.time === time
    );
    if (slotTaken) {
      return false;
    }

    // Check if user already has appointment on this date
    const userHasAppointment = appointments.some(
      (apt) => apt.userId === userId && apt.date === date
    );
    if (userHasAppointment) {
      return false;
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      userId,
      date,
      time,
      createdAt: new Date().toISOString(),
      status: 'agendado',
    };

    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    // Gravação adicional no Supabase (não afeta funcionamento se falhar)
    console.log('[Supabase] Iniciando gravação do agendamento:', newAppointment);
    try {
      const { data, error } = await supabase.from('appointments').insert({
        id: newAppointment.id,
        user_id: newAppointment.userId,
        date: newAppointment.date,
        time: newAppointment.time,
        created_at: newAppointment.createdAt,
        status: 'agendado',
      });
      
      console.log('[Supabase] Resultado do insert:', { data, error });
      
      if (error) {
        console.error('[Supabase] Erro retornado pelo Supabase:', error);
      } else {
        console.log('[Supabase] Agendamento gravado com sucesso no Supabase');
      }
    } catch (error) {
      // Silencioso: falha no Supabase não deve afetar o funcionamento do sistema
      console.error('[Supabase] Erro ao gravar agendamento (catch):', error);
    }

    return true;
  };

  const getAppointmentsForDate = (date: string): Appointment[] => {
    return appointments.filter((apt) => apt.date === date);
  };

  const getAppointmentsForUser = (userId: string): Appointment[] => {
    return appointments.filter((apt) => apt.userId === userId);
  };

  const hasUserAppointmentOnDate = (userId: string, date: string): boolean => {
    return appointments.some(
      (apt) => apt.userId === userId && apt.date === date
    );
  };

  const getAvailableSlots = (date: string): string[] => {
    const appointmentsForDate = getAppointmentsForDate(date);
    const bookedTimes = appointmentsForDate.map((apt) => apt.time);
    
    const now = new Date();
    const selectedDate = new Date(date);
    
    return availableTimeSlots.filter((time) => {
      // Check if slot is already booked
      if (bookedTimes.includes(time)) {
        return false;
      }

      // Check if time is in the past (only for today)
      if (selectedDate.toDateString() === now.toDateString()) {
        const [hours, minutes] = time.split(':').map(Number);
        const slotTime = new Date(selectedDate);
        slotTime.setHours(hours, minutes, 0, 0);
        if (slotTime <= now) {
          return false;
        }
      }

      return true;
    });
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        bookAppointment,
        getAppointmentsForDate,
        getAppointmentsForUser,
        hasUserAppointmentOnDate,
        getAvailableSlots,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
