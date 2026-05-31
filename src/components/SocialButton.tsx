import React from 'react';

interface SocialButtonProps {
  provider: 'google' | 'facebook';
  onClick: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ provider, onClick }) => {
  const config = {
    google: {
      icon: 'G',
      bgColor: 'bg-white',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
      hoverColor: 'hover:bg-gray-50',
    },
    facebook: {
      icon: 'f',
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      borderColor: 'border-blue-600',
      hoverColor: 'hover:bg-blue-700',
    },
  };

  const { icon, bgColor, textColor, borderColor, hoverColor } = config[provider];

  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${textColor} ${borderColor} ${hoverColor} border-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 w-full flex items-center justify-center gap-2`}
    >
      <span className="font-bold">{icon}</span>
      <span>Continuar com {provider === 'google' ? 'Google' : 'Facebook'}</span>
    </button>
  );
};
