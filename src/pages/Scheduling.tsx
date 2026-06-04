import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import { Button } from '../components/Button';
import { TimeSlot } from '../components/TimeSlot';
import { SuccessModal } from '../components/SuccessModal';
import { Calendar, Clock, LogOut, User } from 'lucide-react';
import { format, addDays, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Scheduling: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getAvailableSlots, bookAppointment, hasUserAppointmentOnDate } = useAppointments();
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, "dd 'de' MMMM", { locale: ptBR }),
      weekday: format(date, 'EEEE', { locale: ptBR }),
      isToday: isToday(date),
    };
  });

  const availableSlots = getAvailableSlots(selectedDate);
  const hasAppointmentOnDate = user ? hasUserAppointmentOnDate(user.id, selectedDate) : false;

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setError('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setError('');
  };

  const handleBooking = async () => {
    if (!user) return;
    if (!selectedTime) {
      setError('Por favor, selecione um horário.');
      return;
    }

    const success = await bookAppointment(user.id, selectedDate, selectedTime);
    if (success) {
      setShowSuccessModal(true);
      setSelectedTime(null);
    } else {
      setError('Não foi possível realizar o agendamento. Tente novamente.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formattedSelectedDate = format(new Date(selectedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agenda Online</h1>
              <p className="text-sm text-gray-600">Bem-vindo, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Date Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-blue-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">Selecione a Data</h2>
              </div>
              
              <div className="space-y-2">
                {dates.map((date) => (
                  <button
                    key={date.value}
                    onClick={() => handleDateSelect(date.value)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedDate === date.value
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium capitalize">{date.weekday}</p>
                        <p className="text-sm opacity-90">{date.label}</p>
                      </div>
                      {date.isToday && (
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          Hoje
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-blue-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">Horários Disponíveis</h2>
              </div>

              <p className="text-gray-600 mb-6">
                {formattedSelectedDate}
              </p>

              {hasAppointmentOnDate ? (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                  <p className="font-medium">Você já possui um agendamento para esta data.</p>
                  <p className="text-sm mt-1">Cada usuário pode ter apenas um agendamento por dia.</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-3 rounded-lg">
                  <p>Não há horários disponíveis para esta data.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                    {availableSlots.map((time) => (
                      <TimeSlot
                        key={time}
                        time={time}
                        available={true}
                        selected={selectedTime === time}
                        onClick={() => handleTimeSelect(time)}
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleBooking}
                    disabled={!selectedTime}
                    fullWidth
                  >
                    Confirmar Agendamento
                  </Button>
                </>
              )}
            </div>

            {/* User's Appointments */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="text-blue-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">Meus Agendamentos</h2>
              </div>
              
              <div className="text-gray-600">
                <p>Seus agendamentos aparecerão aqui.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        date={selectedDate}
        time={selectedTime || ''}
      />
    </div>
  );
};
