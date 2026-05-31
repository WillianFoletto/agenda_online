import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  time: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, date, time }) => {
  if (!isOpen) return null;

  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="text-green-600" size={32} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Agendamento Confirmado!
          </h2>

          <p className="text-gray-600 mb-6">
            Seu agendamento foi realizado com sucesso.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Data</p>
            <p className="font-semibold text-gray-900 capitalize">{formattedDate}</p>
            <p className="text-sm text-gray-600 mb-1 mt-3">Horário</p>
            <p className="font-semibold text-gray-900">{time}</p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
