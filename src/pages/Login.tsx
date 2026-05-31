import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { SocialButton } from '../components/SocialButton';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const success = login(email, password);
    if (success) {
      navigate('/agendamento');
    } else {
      setError('E-mail ou senha inválidos.');
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
    navigate('/agendamento');
  };

  const handleFacebookLogin = () => {
    loginWithFacebook();
    navigate('/agendamento');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agenda Online</h1>
          <p className="text-gray-600">Faça login para agendar seu horário</p>
        </div>

        <div className="space-y-4 mb-6">
          <SocialButton provider="google" onClick={handleGoogleLogin} />
          <SocialButton provider="facebook" onClick={handleFacebookLogin} />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Input
            type="email"
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth>
            Entrar
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Não tem uma conta?{' '}
          <button
            onClick={() => navigate('/cadastro')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};
