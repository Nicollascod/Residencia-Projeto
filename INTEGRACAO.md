# 🔗 Integração Frontend React + Backend Django

## 📋 Visão Geral

Este projeto integra um **frontend React/TypeScript** com um **backend Django REST Framework**, criando um sistema completo de gerenciamento acadêmico.

### Arquitetura
```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend React (Vite)                      │
│              (Porta 5173 - desenvolvimento)                   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/CORS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend Django REST API                         │
│    (Porta 8000 - http://localhost:8000)                      │
│                                                               │
│  ✓ JWT Authentication                                        │
│  ✓ CORS Habilitado                                          │
│  ✓ SQLite Database                                          │
│  ✓ Google OR-Tools (Resolução de Horários)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Como Iniciar a Integração

### 1️⃣ Backend Django (Já configurado)

O backend está em `./backend/` com todos os endpoints da API REST configurados.

**Status:** ✅ Rodando em http://localhost:8000

```bash
# Se precisar reiniciar o servidor Django:
cd backend
venv\Scripts\activate
python setup_and_run.py
```

**Credenciais para teste:**
- Usuário: `admin@example.com`
- Senha: `admin123`

---

### 2️⃣ Frontend React

**Instalar dependências (se ainda não fez):**
```bash
npm install
```

**Iniciar servidor de desenvolvimento:**
```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

---

## 📡 Endpoints da API

### Autenticação
```
POST   /api/auth/token/          - Obter Access Token
POST   /api/auth/token/refresh/  - Renovar Access Token
```

### Usuários
```
GET    /api/gerenciar/           - Listar usuários
POST   /api/gerenciar/           - Criar usuário
GET    /api/gerenciar/{id}/      - Obter usuário
PUT    /api/gerenciar/{id}/      - Atualizar usuário
DELETE /api/gerenciar/{id}/      - Deletar usuário
```

### Cursos
```
GET    /api/cursos/              - Listar cursos
POST   /api/cursos/              - Criar curso
GET    /api/cursos/{id}/         - Obter curso
PUT    /api/cursos/{id}/         - Atualizar curso
DELETE /api/cursos/{id}/         - Deletar curso
```

### Turmas
```
GET    /api/turmas/              - Listar turmas
POST   /api/turmas/              - Criar turma
GET    /api/turmas/{id}/         - Obter turma
PUT    /api/turmas/{id}/         - Atualizar turma
DELETE /api/turmas/{id}/         - Deletar turma
```

### Disciplinas
```
GET    /api/disciplinas/         - Listar disciplinas
POST   /api/disciplinas/         - Criar disciplina
GET    /api/disciplinas/{id}/    - Obter disciplina
PUT    /api/disciplinas/{id}/    - Atualizar disciplina
DELETE /api/disciplinas/{id}/    - Deletar disciplina
```

### Salas
```
GET    /api/salas/               - Listar salas
POST   /api/salas/               - Criar sala
GET    /api/salas/{id}/          - Obter sala
PUT    /api/salas/{id}/          - Atualizar sala
DELETE /api/salas/{id}/          - Deletar sala
```

### Aulas (Horários)
```
GET    /api/aulas/               - Listar aulas
POST   /api/aulas/               - Criar aula
GET    /api/aulas/{id}/          - Obter aula
PUT    /api/aulas/{id}/          - Atualizar aula
DELETE /api/aulas/{id}/          - Deletar aula
```

---

## 🔐 Autenticação JWT

### Fluxo de Login

1. **Requisição:**
```javascript
POST /api/auth/token/
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

2. **Resposta:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

3. **Usar token em requisições:**
```javascript
Authorization: Bearer {access_token}
```

---

## 📁 Estrutura de Arquivos

```
Residencia-Projeto/
├── src/                          # Frontend React
│   ├── context/
│   │   └── AuthContext.tsx      # ✨ ATUALIZADO: Suporte JWT
│   ├── services/
│   │   └── api.ts               # ✨ Cliente Axios configurado
│   └── pages/                   # Páginas do sistema
│
├── backend/                      # Backend Django
│   ├── setup/
│   │   ├── settings.py          # Configurações Django
│   │   └── urls.py              # ✨ ATUALIZADO: Endpoints API
│   ├── apps/
│   │   ├── people/              # Usuários (✓ Completo)
│   │   ├── courses/             # Cursos, Turmas, Disciplinas
│   │   ├── rooms/               # Salas
│   │   ├── schedule/            # Horários/Aulas
│   │   └── core/                # Core models
│   ├── venv/                    # Virtual environment Python
│   ├── db.sqlite3               # Banco de dados
│   └── setup_and_run.py         # Script para iniciar
│
├── .env.local                   # ✨ ATUALIZADO: Configuração
└── package.json
```

---

## 🔧 Configuração de Ambiente

### Frontend (.env.local)
```env
# Backend URL
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (backend/setup/settings.py)
```python
# JWT
ACCESS_TOKEN_LIFETIME = timedelta(days=7)
REFRESH_TOKEN_LIFETIME = timedelta(days=14)

# CORS
CORS_ALLOW_ALL_ORIGINS = True  # Permite qualquer origem
```

---

## 🧪 Testando a Integração

### 1️⃣ Testar endpoint de autenticação

```bash
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### 2️⃣ Testar listagem de usuários com token

```bash
curl -X GET http://localhost:8000/api/gerenciar/ \
  -H "Authorization: Bearer {seu_token_aqui}"
```

### 3️⃣ No navegador

1. Abra http://localhost:5173
2. Faça login com credenciais:
   - Email: `admin@example.com` ou Username: `admin`
   - Senha: `admin123`
3. Se login falhar, o sistema faz fallback para autenticação local

---

## 🎯 Mapeamento Frontend ↔ Backend

| Frontend | Endpoint Backend |
|----------|------------------|
| /login | POST /api/auth/token/ |
| /dashboard | GET /api/ (múltiplas requisições) |
| /professors | GET /api/gerenciar/ |
| /courses | GET /api/cursos/ |
| /classes | GET /api/turmas/ |
| /subjects | GET /api/disciplinas/ |
| /rooms | GET /api/salas/ |
| /schedule | GET /api/aulas/ |

---

## 🐛 Troubleshooting

### Erro: "Cannot POST /api/auth/token/"
- ✅ Verifique se Django está rodando: `http://localhost:8000/api/`
- ✅ Reinicie o servidor Django se fez mudanças

### Erro: "CORS error"
- ✅ CORS já está habilitado no `settings.py`
- ✅ Verifique se `CORS_ALLOW_ALL_ORIGINS = True`

### Login sempre falha
- ✅ O sistema faz fallback para autenticação local
- ✅ Você pode logar com usuários padrão:
  - `coordenador-geral` / `geral123`
  - `coordenador` / `coord123`
  - `professor` / `prof123`

### "Token inválido ou expirado"
- ✅ Tokens JWT duram 7 dias
- ✅ Use o token `/refresh/` para renovar

---

## 📚 Recursos Adicionais

- [Django REST Framework Docs](https://www.django-rest-framework.org/)
- [Simple JWT Docs](https://django-rest-framework-simplejwt.readthedocs.io/)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)

---

## ✅ Checklist de Integração

- [x] Backend Django clonado e configurado
- [x] Dependências instaladas (Python e npm)
- [x] Banco de dados migrado
- [x] Usuários de teste criados
- [x] ViewSets API REST criados
- [x] Endpoints mapeados
- [x] JWT autenticação configurada
- [x] CORS habilitado
- [x] Frontend atualizado para usar JWT
- [x] Variáveis de ambiente configuradas
- [ ] Testes end-to-end (próximo passo)

---

## 🎉 Próximos Passos

1. **Testar endpoints individuais** com Postman ou curl
2. **Executar teste de integração** complete
3. **Deployar em produção** (adicionar HTTPS, variáveis de ambiente seguras, etc.)
4. **Implementar refresh token automático** no frontend
5. **Adicionar tratamento de erros mais robusto**

---

**Integração concluída! 🚀**

Para dúvidas ou problemas, consulte a documentação oficial ou os arquivos de configuração mencionados acima.
