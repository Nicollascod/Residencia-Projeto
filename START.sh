#!/bin/bash
# Script para iniciar a integração completa

echo "================================"
echo "🚀 Iniciando integração completa"
echo "================================"
echo ""

# Backend Django
echo "▶️  Iniciando Backend Django..."
echo "Abra outro terminal e execute:"
echo "  cd backend"
echo "  venv\Scripts\activate"
echo "  python setup_and_run.py"
echo ""
echo "Django estará em: http://localhost:8000"
echo ""

# Frontend React
echo "▶️  Iniciando Frontend React..."
npm install
npm run dev

echo ""
echo "================================"
echo "✅ Integração ativa!"
echo "================================"
echo ""
echo "Frontend:  http://localhost:5173"
echo "Backend:   http://localhost:8000"
echo ""
echo "Credenciais de teste:"
echo "  Email: admin@example.com"
echo "  Senha: admin123"
