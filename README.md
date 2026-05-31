# Agenda Online

Sistema de agendamento online simples e funcional com React, TypeScript e Tailwind CSS.

## Tecnologias

- React 18
- TypeScript
- Tailwind CSS
- React Router
- Lucide React (ícones)
- date-fns (manipulação de datas)

## Funcionalidades

### Autenticação
- Login com Google (mock)
- Login com Facebook (mock)
- Login com e-mail e senha
- Cadastro de novos usuários

### Agendamento
- Seleção de data (próximos 7 dias)
- Visualização de horários disponíveis
- Escolha de horário
- Confirmação de agendamento
- Mensagem de sucesso

### Regras de Negócio
- Não exibe horários já ocupados
- Não permite horários passados
- Não permite mais de um agendamento por usuário na mesma data
- Exibe mensagem quando não há horários disponíveis
- Atualiza horários disponíveis após agendamento

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse a aplicação em `http://localhost:5173`

## Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── SocialButton.tsx
│   ├── TimeSlot.tsx
│   └── SuccessModal.tsx
├── context/         # Contextos da aplicação
│   ├── AuthContext.tsx
│   └── AppointmentContext.tsx
├── data/           # Dados mockados
│   └── mockData.ts
├── pages/          # Páginas da aplicação
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Scheduling.tsx
├── types/          # Definições de tipos TypeScript
│   └── index.ts
├── App.tsx         # Componente principal
├── main.tsx        # Entry point
└── index.css       # Estilos globais
```

## Dados Mockados

O sistema utiliza dados mockados para simular o funcionamento:

### Usuários de Teste
- E-mail: `joao@example.com`
- Senha: `123456`

- E-mail: `maria@example.com`
- Senha: `123456`

## Próximos Passos

Para transformar este MVP em um sistema completo:

1. Implementar autenticação real (Firebase, Auth0, ou backend próprio)
2. Integrar banco de dados (PostgreSQL, MongoDB, etc.)
3. Criar painel administrativo
4. Adicionar notificações (email, SMS)
5. Implementar cancelamento de agendamentos
6. Adicionar histórico de agendamentos
7. Implementar lembretes de agendamentos
