import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment } from '../types';
import { mockAppointments, availableTimeSlots } from '../data/mockData';

interface AppointmentContextType {
  appointments: Appointment[];
  bookAppointment: (userId: string, date: string, time: string) => boolean;
  getAppointmentsForDate: (date: string) => Appointment[];
  getAppointmentsForUser: (userId: string) => Appointment[];
  hasUserAppointmentOnDate: (userId: string, date: string) => boolean;
  getAvailableSlots: (date: string) => string[];
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('appointments');
    if (stored) {
      setAppointments(JSON.parse(stored));
    } else {
      setAppointments(mockAppointments);
    }
  }, []);

  const bookAppointment = (userId: string, date: string, time: string): boolean => {
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
    };

    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
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
