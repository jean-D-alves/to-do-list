# To-Do List API (Backend)

Este repositório contém apenas o **backend** da aplicação To-Do List.

## Tecnologias

- Node.js
- Express
- SQLite / MySQL (dependendo da configuração)
- JWT para autenticação
- CORS configurado para aceitar o frontend

## Funcionalidades

- Registro e login de usuários
- Gerenciamento de tarefas (CRUD)
- Validação de token JWT
- Middleware para cookies e CORS

## Variáveis de Ambiente

Certifique-se de configurar:

- `PORT` – Porta do servidor
- `FRONTEND` – URL do frontend autorizado
- `JWT_SECRET` – Chave secreta para JWT

## Deploy

O backend está atualmente deployado e integrado ao frontend, mas pode ser executado localmente:

```bash
npm install
npm run dev
