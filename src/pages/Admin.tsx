import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Appointment {
  id: string;
  user_id: string;
  date: string;
  time: string;
  created_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export const Admin = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        // Buscar agendamentos
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .order('date', { ascending: true })
          .order('time', { ascending: true });

        if (appointmentsError) {
          setError(appointmentsError.message);
          return;
        }

        setAppointments(appointmentsData || []);

        // Buscar usuários
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, name, email');

        if (usersError) {
          console.error('Erro ao carregar usuários:', usersError);
        } else {
          setUsers(usersData || []);
        }
      } catch (err) {
        setError('Erro ao carregar agendamentos');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('pt-BR');
  };

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user?.name || userId;
  };

  const handleCancel = async (id: string) => {
    const confirmed = window.confirm('Deseja realmente cancelar este agendamento?');
    if (!confirmed) return;

    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id);

      if (error) {
        setError('Erro ao cancelar agendamento');
        return;
      }

      setSuccessMessage('Agendamento cancelado com sucesso');
      setAppointments(appointments.filter((apt) => apt.id !== id));

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Erro ao cancelar agendamento');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando agendamentos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Sair
          </button>
        </div>
        
        {successMessage && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhum agendamento encontrado
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserName(appointment.user_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(appointment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(appointment.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
