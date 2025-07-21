#!/bin/bash

echo "🚀 Iniciando deploy da Marcha Brasil..."

# Verificar se o build funciona
echo "📦 Testando build de produção..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build falhou! Verifique os erros acima."
    exit 1
fi

echo "✅ Build de produção OK!"

# Instalar Vercel CLI se não existir
if ! command -v vercel &> /dev/null; then
    echo "📥 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Deploy para produção
echo "🌐 Fazendo deploy para Vercel..."
vercel --prod

echo "🎉 Deploy concluído!"
echo "📱 Aguarde alguns minutos para propagação do DNS"
echo "🔗 Sua plataforma estará disponível na URL fornecida pelo Vercel"