# 📚 Gerenciador Acadêmico - Sistema Integrado

> Sistema completo de gerenciamento acadêmico com frontend React e backend Django

## 🎯 O que foi integrado?

- ✅ **Frontend React/TypeScript** com Vite
- ✅ **Backend Django REST API** com JWT
- ✅ **Autenticação integrada** (JWT + fallback local)
- ✅ **CORS configurado** para comunicação cliente-servidor
- ✅ **Banco de dados** SQLite com modelos completos
- ✅ **Endpoints REST** para:
  - Usuários (Professores, Coordenadores)
  - Cursos
  - Turmas
  - Disciplinas
  - Salas
  - Horários/Aulas

---

## 🚀 Iniciando Rápido

### Terminal 1 - Backend Django

```bash
cd backend
venv\Scripts\activate
python setup_and_run.py
```

✅ Django rodará em: **http://localhost:8000**

### Terminal 2 - Frontend React

```bash
npm install
npm run dev
```

✅ React rodará em: **http://localhost:5173**

---

## 🔐 Credenciais de Teste

```
Email:    admin@example.com
Senha:    admin123
Papel:    Coordenador Geral

OU utilize os usuários locais:
  coordenador-geral / geral123
  coordenador / coord123
  professor / prof123
```

---

## 📁 Estrutura do Projeto

```
.
├── src/                  # Frontend React
│   ├── context/          # Contexto de autenticação (ATUALIZADO)
│   ├── pages/            # Páginas da aplicação
│   ├── components/       # Componentes reutilizáveis
│   └── services/         # Cliente API
│
├── backend/              # Backend Django
│   ├── apps/             # Aplicações modulares
│   │   ├── people/       # Usuários
│   │   ├── courses/      # Cursos, Turmas, Disciplinas
│   │   ├── rooms/        # Salas
│   │   └── schedule/     # Horários
│   ├── setup/            # Configurações principais
│   └── venv/             # Environment virtual
│
├── .env.local            # (ATUALIZADO) Configuração local
└── INTEGRACAO.md         # Documentação detalhada
```

---

## 🔗 Endpoints da API

### Autenticação
- `POST /api/auth/token/` - Login
- `POST /api/auth/token/refresh/` - Renovar token

### Recursos
- `GET /api/gerenciar/` - Usuários
- `GET /api/cursos/` - Cursos
- `GET /api/turmas/` - Turmas
- `GET /api/disciplinas/` - Disciplinas
- `GET /api/salas/` - Salas
- `GET /api/aulas/` - Aulas

---

## ⚙️ Configurações Principais

### Django (backend/setup/settings.py)
```python
# JWT válido por 7 dias
ACCESS_TOKEN_LIFETIME = timedelta(days=7)

# CORS habilitado para qualquer origem
CORS_ALLOW_ALL_ORIGINS = True
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🧪 Testando a Integração

### 1. Abra o navegador
```
http://localhost:5173
```

### 2. Faça login
```
Email: admin@example.com
Senha: admin123
```

### 3. Navegue pelas páginas
- Dashboard
- Professores
- Cursos
- Disciplinas
- Salas
- Horários

---

## 📝 O que foi atualizado

| Arquivo | Mudanças |
|---------|----------|
| `src/context/AuthContext.tsx` | ✨ Adicionado suporte JWT + fallback local |
| `backend/setup/urls.py` | ✨ Endpoints API REST integrados |
| `backend/apps/*/views.py` | ✨ ViewSets REST criados |
| `backend/apps/*/urls.py` | ✨ Rotas configuradas |
| `.env.local` | ✨ URL do backend atualizada |

---

## 🎓 Funcionalidades do Sistema

### Gerenciamento de Usuários
- Criar, editar, deletar usuários
- Papéis: Coordenador Geral, Coordenador de Curso, Professor
- Autenticação segura com JWT

### Estrutura Acadêmica
- Cursos
- Turmas (por curso)
- Disciplinas (por curso, com múltiplos professores)
- Professores (com papéis específicos)

### Gerenciamento de Salas
- Cadastro de salas com tipos
- Recursos disponíveis
- Capacidade

### Grade de Horários
- Alocação de aulas
- Validação de conflitos (professor/sala)
- Resolução automática com OR-Tools

---

## 🐛 Troubleshooting

**Problema:** Erro ao fazer login
- ✅ Verifique se Django está rodando (http://localhost:8000)
- ✅ O sistema faz fallback automático para usuários locais

**Problema:** CORS error
- ✅ Verifique se CORS_ALLOW_ALL_ORIGINS = True em settings.py

**Problema:** Endpoints retornam 404
- ✅ Reinicie o servidor Django após mudanças em models.py

---

## 📚 Recursos

- [INTEGRACAO.md](./INTEGRACAO.md) - Documentação completa
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev)

---

## 🎉 Pronto!

A integração está **completa** e **funcional**. 

Você tem um sistema completo de gerenciamento acadêmico rodando com:
- ✅ Frontend moderno (React + TypeScript)
- ✅ Backend robusto (Django + DRF)
- ✅ Autenticação segura (JWT)
- ✅ CORS configurado
- ✅ Banco de dados

**Comece a usar agora!** 🚀

---

*Residência - Projeto Acadêmico*
*Última atualização: Abril 2026*
